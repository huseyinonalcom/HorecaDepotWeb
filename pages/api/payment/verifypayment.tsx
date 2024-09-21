import statusText from "../../../api/statustexts";

export default async function verifyPayment(req, res) {
  try {
    let ogoneID = null;
    let paymentID = null;
    let payment = null;
    let amount = null;

    let test = false;

    if (req.query.test && req.query.test == "true") {
      test = true;
    }

    if (req.query.paymentid) {
      paymentID = req.query.paymentid;
    } else {
      return res.status(400).json(statusText[400]);
    }

    if (req.query.ogoneid) {
      ogoneID = req.query.ogoneid;
      try {
        const putOgoneIDReq = await fetch(
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
                origin: `${ogoneID}`,
              },
            }),
          },
        );
        if (putOgoneIDReq.ok) {
        } else {
          return res.status(404).json(statusText[404]);
        }
      } catch (e) {
        return res.status(404).json(statusText[404]);
      }
    }

    if (!test) {
      const fetchPaymentUrl = `${process.env.API_URL}/api/payments/${paymentID}?populate[document][populate][document_products][fields][0]=subTotal`;

      const fetchPaymentRequest = await fetch(fetchPaymentUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${process.env.API_KEY}`,
        },
      });
      if (fetchPaymentRequest.ok) {
        const fetchPaymentAnswer = await fetchPaymentRequest.json();

        payment = fetchPaymentAnswer.data;
        amount = payment.document.document_products
          .reduce((accumulator, currentItem) => {
            return accumulator + currentItem.subTotal;
          }, 0)
          .toFixed(2);
      } else {
        return res.status(404).json(statusText[404]);
      }
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

    let paymentSuccess = false;

    if (ogoneID) {
      const getHostedCheckoutResponse =
        await directSdkClient.hostedCheckout.getHostedCheckout(
          "ATKSPRL",
          ogoneID,
          {},
        );
      if (
        getHostedCheckoutResponse.body.createdPaymentOutput
          .paymentStatusCategory == "SUCCESSFUL"
      ) {
        paymentSuccess = true;
      }
    } else {
      return res.status(400).json(statusText[400]);
    }

    if (!test) {
      if (paymentSuccess) {
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
                verified: paymentSuccess,
              },
            }),
          },
        );
        if (putPaymentStatus.ok) {
          return res.status(200).json(statusText[200]);
        } else {
          return res.status(404).json(statusText[404]);
        }
      } else {
        return res.status(200).json({ paymentSuccess: paymentSuccess });
      }
    } else {
      return res.status(200).json({ paymentSuccess: paymentSuccess });
    }
  } catch (e) {
    return res.status(500).json(statusText[500]);
  }
}
