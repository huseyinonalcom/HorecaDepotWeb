import statusText from "../../../api/statustexts";
import { getConfig } from "../private/config";

const postPaymentUrl = `${process.env.API_URL}/api/payments?fields=id`;

// fetch config
// check which payment providers can be used
// check searchparams for which payment provider to use
// try to create payment link with that provider
// return the link, or an error if it fails
// also create a payment in the database with the amount, the document id and the id from the payment provider

const createMollieLink = async (
  amount,
  documentID,
  MOLLIE_SECRET,
  description,
) => {
  let answer;
  try {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${MOLLIE_SECRET}`);
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    const urlencoded = new URLSearchParams();
    urlencoded.append("amount[currency]", "EUR");
    urlencoded.append("amount[value]", amount);
    urlencoded.append("description", description);
    urlencoded.append(
      "redirectUrl",
      `${process.env.SITE_URL}/payment?id=${documentID}`,
    );
    urlencoded.append(
      "webhookUrl",
      `${process.env.SITE_URL}/api/payment/webhook`,
    );
    urlencoded.append("metadata", `{"order_id": ${documentID}}`);

    await fetch("https://api.mollie.com/v2/payments", {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
      redirect: "follow",
    })
      .then((response) => response.json())
      .then((result) => {
        answer = result;
      })
      .catch((error) => console.error(error));
  } catch (e) {
    console.error(e);
  }
  console.info(answer);
  return answer;
};

const createOgoneLink = async (amount, document, ogoneCredetials) => {
  const directSdk = require("onlinepayments-sdk-nodejs");

  const directSdkClient = directSdk.init({
    integrator: "ATKSPRL",
    host: "payment.direct.worldline-solutions.com",
    scheme: "https",
    port: 443,
    enableLogging: false,
    apiKeyId: ogoneCredetials.OGONE_KEY,
    secretApiKey: ogoneCredetials.OGONE_SECRET,
  });

  const createHostedCheckoutRequest = {
    cardPaymentMethodSpecificInput: {
      transactionChannel: "ECOMMERCE",
      authorizationMode: "SALE",
      tokenize: true,
    },
    order: {
      amountOfMoney: {
        currencyCode: "EUR",
        amount: amount * 100,
      },
      customer: {
        merchantCustomerId: document.client.id.toFixed(0),
        locale: "en_GB",
        personalInformation: {
          name: {
            firstName: document.client.firstName,
            surname: document.client.lastName,
          },
        },
        billingAddress: {
          street: document.docAddress.street,
          houseNumber: document.docAddress.doorNumber,
          zip: document.docAddress.zipCode,
          city: document.docAddress.city,
          ...(document.docAddress.province && {
            state: document.docAddress.province,
          }),
          countryCode: "BE",
        },
        contactDetails: {
          phoneNumber: document.client.phone,
        },
        ...(document.client.company && {
          companyInformation: { name: document.client.company },
        }),
        // fiscalNumber: document.client.taxID, // figure out how to format this correctly (remove spaces and dots I think)
      },
      references: {
        merchantReference: document.prefix + document.number,
      },
    },
    hostedCheckoutSpecificInput: {
      returnUrl: `https://horecadepot.be/payment?id=${document.id}`,
      isRecurring: false,
      locale: "en_GB",
    },
    redirectPaymentMethodSpecificInput: {
      requiresApproval: false,
    },
  };

  if (document.client.company) {
    createHostedCheckoutRequest.order.customer.companyInformation = {
      name: document.client.company,
    };
  }

  const createHostedCheckoutResponse =
    await directSdkClient.hostedCheckout.createHostedCheckout(
      "ATKSPRL",
      createHostedCheckoutRequest,
      null,
    );

  return {
    url: createHostedCheckoutResponse.body.redirectUrl,
    id: createHostedCheckoutResponse.body.hostedCheckoutId,
  };
};

const fetchDocument = async (documentID) => {
  try {
    const fetchOrderUrl = `${process.env.API_URL}/api/documents/${documentID}?populate[0]=client&populate[1]=establishment&populate[2]=delAddress&populate[3]=docAddress&populate[4]=document_products&populate[5]=payments`;

    let document;
    let amount;

    const request = await fetch(fetchOrderUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
    });
    if (request.ok) {
      const answer = await request.json();

      document = answer.data;
      amount =
        document.document_products.reduce((accumulator, currentItem) => {
          return accumulator + currentItem.subTotal;
        }, 0) -
        document.payments
          .filter((pay) => !pay.deleted && pay.verified)
          .reduce((accumulator, currentItem) => {
            return accumulator + currentItem.value;
          }, 0)
          .toFixed(2);

      return { document, amount };
    } else {
      throw new Error("Error fetching document");
    }
  } catch (e) {
    console.error(e);
  }
};

export default async function createPaymentLink(req, res) {
  try {
    const {
      query: { provider },
    } = req;

    let paymentProvider = provider;

    if (!paymentProvider) {
      paymentProvider = "ogone";
    }

    let config;

    try {
      config = (await getConfig({ authToken: req.cookies.j })).result;
      paymentProvider = config.activeProvider ?? `ogone`;
      if (!config[paymentProvider]) {
        return res.status(400).json(statusText[400]);
      }
    } catch (e) {
      console.error(e);
    }

    const reqBody = JSON.parse(req.body);

    const { amount, document } = await fetchDocument(reqBody.id);

    let answer;
    let idFromProvider;
    let url;

    switch (paymentProvider) {
      case "mollie":
        answer = await createMollieLink(
          amount.toFixed(2),
          document.id,
          config.mollie.MOLLIE_SECRET,
          document.prefix + document.number,
        );
        url = answer._links.checkout.href;
        idFromProvider = answer.id;
        break;
      case "ogone":
        answer = await createOgoneLink(amount, document, config.ogone);
        url = answer.url;
        idFromProvider = answer.id;
        break;
      default:
        return res.status(400).json(statusText[400]);
    }

    const dateNow = new Date().toISOString().split("T")[0];

    const strapiRequest = await fetch(postPaymentUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
      body: JSON.stringify({
        data: {
          value: amount,
          date: dateNow,
          method: "Online",
          document: document.id,
          origin: paymentProvider + "-" + idFromProvider,
          verified: "false",
        },
      }),
    });

    if (strapiRequest.status !== 200) {
      return res.status(400).json(statusText[400]);
    }

    if (!url) {
      return res.status(400).json(statusText[400]);
    }

    return res.status(200).json({ url: url });
  } catch (e) {
    console.error(e);
    return res.status(500).json(statusText[500]);
  }
}
