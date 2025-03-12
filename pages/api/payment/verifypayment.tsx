import statusText from "../../../api/statustexts";
import { getConfig } from "../config/private/getconfig";

const fetchDocument = async (documentID) => {
  try {
    const fetchOrderUrl = `${process.env.API_URL}/api/documents/${documentID}?populate[0]=payments`;

    let document;

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

      return { document };
    } else {
      throw new Error("Error fetching document");
    }
  } catch (e) {
    console.error(e);
  }
};

const checkMolliePayment = async (paymentID, config) => {
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${config.mollie.MOLLIE_SECRET}`);

  let status = false;

  await fetch(`https://api.mollie.com/v2/payments/${paymentID}`, {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.status == "paid") {
        status = true;
      }
    })
    .catch((error) => console.error(error));
  return status;
};

const checkOgonePayment = async (paymentID, config) => {
  let paymentSuccess = false;

  try {
    const directSdk = require("onlinepayments-sdk-nodejs");

    const directSdkClient = directSdk.init({
      integrator: "ATKSPRL",
      host: "payment.direct.worldline-solutions.com",
      scheme: "https",
      port: 443,
      enableLogging: false,
      apiKeyId: config.ogone.OGONE_KEY,
      secretApiKey: config.ogone.OGONE_SECRET,
    });

    if (paymentID) {
      const getHostedCheckoutResponse =
        await directSdkClient.hostedCheckout.getHostedCheckout(
          "ATKSPRL",
          paymentID,
          {},
        );

      if (
        getHostedCheckoutResponse.body.createdPaymentOutput
          .paymentStatusCategory == "SUCCESSFUL"
      ) {
        paymentSuccess = true;
      }
    } else {
      return false;
    }
  } catch (e) {
    console.error(e);
  }

  if (paymentSuccess) {
    paymentSuccess = true;
  } else {
    return false;
  }

  return paymentSuccess;
};

const updatePaymentStatus = async (paymentID, status) => {
  const putPaymentStatus = await fetch(
    `${process.env.API_URL}/api/payments/${paymentID}?fields=id`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
      body: JSON.stringify({
        data: {
          verified: status,
        },
      }),
    },
  );
  if (putPaymentStatus.ok) {
    return true;
  } else {
    return false;
  }
};

export async function verifyPayments(id) {
  let config;

  try {
    config = await getConfig();
  } catch (e) {
    console.error(e);
  }
  try {
    let document = await fetchDocument(id);

    for (let payment of document.document.payments) {
      if (!payment.verified) {
        switch (payment.origin.split("-")[0]) {
          case "mollie":
            if (
              await checkMolliePayment(payment.origin.split("-")[1], config)
            ) {
              await updatePaymentStatus(payment.id, true).then((result) => {
                if (result) {
                  fetch(
                    `${process.env.SITE_URL}/api/documents/client/sendordernotifications?orderid=` +
                      document.document.id,
                    {
                      method: "GET",
                      headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        Authorization: `Bearer ${process.env.API_KEY}`,
                      },
                    },
                  );
                }
              });
            }
            break;
          case "ogone":
            if (await checkOgonePayment(payment.origin.split("-")[1], config)) {
              await updatePaymentStatus(payment.id, true).then((result) => {
                if (result) {
                  fetch(
                    `${process.env.SITE_URL}/api/documents/client/sendordernotifications?orderid=` +
                      document.document.id,
                    {
                      method: "GET",
                      headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        Authorization: `Bearer ${process.env.API_KEY}`,
                      },
                    },
                  );
                }
              });
            }
            break;
          default:
            return false;
        }
      }
    }

    return true;
  } catch (e) {
    return false;
  }
}

export default async function handler(req, res) {
  try {
    let documentID = null;

    if (req.query.id) {
      documentID = req.query.id;
    } else {
      return res.status(400).json(statusText[400]);
    }

    let success = false;

    success = await verifyPayments(documentID);

    if (!success) {
      return res.status(400).json(statusText[400]);
    }

    return res.status(200).json(statusText[200]);
  } catch (e) {
    return res.status(500).json(statusText[500]);
  }
}
