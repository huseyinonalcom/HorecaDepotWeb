import statusText from "../../../api/statustexts";

const postPaymentUrl = `${process.env.API_URL}/api/payments?fields=id`;

export default async function createPaymentLink(req, res) {
  try {
    const {
      query: { test },
    } = req;

    const reqBody = JSON.parse(req.body);

    const fetchOrderUrl = `${process.env.API_URL}/api/documents/${reqBody.documentID}?populate[0]=client&populate[1]=establishment&populate[2]=delAddress&populate[3]=docAddress&populate[4]=document_products&populate[5]=payments`;

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
    } else {
      return res.status(404).json(statusText[404]);
    }

    const dateNow = new Date().toISOString().substring(0, 10);

    const strapiRequest = await fetch(postPaymentUrl, {
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
          origin: "Ogone",
          verified: "false",
        },
      }),
      method: "POST",
    });

    const strapiResponse = await strapiRequest.json();
    const paymentID = strapiResponse.data.id;
    if (strapiRequest.status !== 200) {
      return res.status(400).json({
        error:
          "Une erreur s'est produite lors de la génération du formulaire de paiement. Veuillez nous contacter pour obtenir une méthode alternative de paiement.",
      });
    }

    if (test == true) {
      return res.status(200).json({
        url: 0,
        data: {
          value: amount,
          date: dateNow,
          method: "Online",
          document: document.id,
          origin: "Ogone",
          verified: "false",
        },
        hostedCheckoutRequest: {
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
              companyInformation: {
                name: document.client.company,
              },
              billingAddress: {
                street: document.docAddress.street,
                houseNumber: document.docAddress.doorNumber,
                zip: document.docAddress.zipCode,
                city: document.docAddress.city,
                state: document.docAddress.province,
                countryCode: "BE",
              },
              contactDetails: {
                phoneNumber: document.client.phone,
              },
              // fiscalNumber: document.client.taxID, // figure out how to format this correctly (remove spaces and dots I think)
            },
            references: {
              merchantReference:
                document.prefix + document.number + "-" + paymentID.toFixed(0),
            },
          },
          hostedCheckoutSpecificInput: {
            returnUrl: "https://horecadepot.be",
            isRecurring: false,
            locale: "en_GB",
          },
          redirectPaymentMethodSpecificInput: {
            requiresApproval: false,
          },
        },
      });
    }

    const directSdk = require("onlinepayments-sdk-nodejs");

    const directSdkClient = directSdk.init({
      integrator: "ATKSPRL",
      host: "payment.direct.worldline-solutions.com",
      scheme: "https",
      port: 443,
      enableLogging: false,
      apiKeyId: process.env.OGONE_KEY,
      secretApiKey: process.env.OGONE_SECRET,
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
          merchantReference:
            document.prefix + document.number + "-" + paymentID.toFixed(0),
        },
      },
      hostedCheckoutSpecificInput: {
        returnUrl: `${process.env.SITE_URL}/payment?id=${paymentID.toFixed(0)}`,
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

    const hostedUrl = createHostedCheckoutResponse;

    return res.status(200).json({ url: hostedUrl.body.redirectUrl });
  } catch (e) {
    return res.status(500).json(statusText[500]);
  }
}
