import statusText from "../../../api/statustexts";

const fetchDocument = async (documentID) => {
  try {
    const fetchOrderUrl = `${process.env.API_URL}/api/documents/${documentID}?populate[5]=payments`;

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
      const answer = await request.text();
      throw new Error("Error fetching document");
    }
  } catch (e) {
    console.error(e);
  }
};

async function verifyPayment(req, res) {
  try {
    let documentID = null;
    let payment = null;
    let amount = null;

    let test = false;

    if (req.query.test && req.query.test == "true") {
      test = true;
    }

    if (req.query.id) {
      documentID = req.query.id;
    } else {
      return res.status(400).json(statusText[400]);
    }

    let document = await fetchDocument(documentID);

    for (let payment of document.document.payments) {
      if (!payment.verified) {
        console.log(payment);
      }
    }

    // if (!test) {
    //   const fetchPaymentUrl = `${process.env.API_URL}/api/payments/${documentID}?populate[document][populate][document_products][fields][0]=subTotal`;

    //   const fetchPaymentRequest = await fetch(fetchPaymentUrl, {
    //     method: "GET",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Accept: "application/json",
    //       Authorization: `Bearer ${process.env.API_KEY}`,
    //     },
    //   });
    //   if (fetchPaymentRequest.ok) {
    //     const fetchPaymentAnswer = await fetchPaymentRequest.json();

    //     payment = fetchPaymentAnswer.data;
    //     amount = payment.document.document_products
    //       .reduce((accumulator, currentItem) => {
    //         return accumulator + currentItem.subTotal;
    //       }, 0)
    //       .toFixed(2);
    //   } else {
    //     return res.status(404).json(statusText[404]);
    //   }
    // }

    // const directSdk = require("onlinepayments-sdk-nodejs");

    // const directSdkClient = directSdk.init({
    //   integrator: "ATKSPRL",
    //   host: "payment.direct.worldline-solutions.com",
    //   scheme: "https",
    //   port: 443,
    //   enableLogging: false,
    //   apiKeyId: process.env.OGONE_KEY,
    //   secretApiKey: process.env.OGONE_SECRET,
    // });

    let paymentSuccess = false;

    // if (ogoneID) {
    //   const getHostedCheckoutResponse =
    //     await directSdkClient.hostedCheckout.getHostedCheckout(
    //       "ATKSPRL",
    //       ogoneID,
    //       {},
    //     );
    //   if (
    //     getHostedCheckoutResponse.body.createdPaymentOutput
    //       .paymentStatusCategory == "SUCCESSFUL"
    //   ) {
    //     paymentSuccess = true;
    //   }
    // } else {
    //   return res.status(400).json(statusText[400]);
    // }

    // if (paymentSuccess) {
    //   const putPaymentStatus = await fetch(
    //     `${process.env.API_URL}/api/payments/${documentID}?fields=id`,
    //     {
    //       method: "PUT",
    //       headers: {
    //         "Content-Type": "application/json",
    //         Accept: "application/json",
    //         Authorization: `Bearer ${process.env.API_KEY}`,
    //       },
    //       body: JSON.stringify({
    //         data: {
    //           verified: paymentSuccess,
    //         },
    //       }),
    //     },
    //   );
    //   if (putPaymentStatus.ok) {
    //     return res.status(200).json(statusText[200]);
    //   } else {
    //     return res.status(404).json(statusText[404]);
    //   }
    // } else {
    //   return res.status(200).json({ paymentSuccess: paymentSuccess });
    // }
    return res.status(200).json({ paymentSuccess: paymentSuccess });
  } catch (e) {
    return res.status(500).json(statusText[500]);
  }
}

export default async function handler(req, res) {
  try {
    let documentID = null;
    let payment = null;
    let amount = null;

    let test = false;

    if (req.query.test && req.query.test == "true") {
      test = true;
    }

    if (req.query.id) {
      documentID = req.query.id;
    } else {
      return res.status(400).json(statusText[400]);
    }

    let document = await fetchDocument(documentID);

    for (let payment of document.document.payments) {
      if (!payment.verified) {
        console.log(payment);
      }
    }

    return res.status(200).json({ paymentSuccess: false });
  } catch (e) {
    return res.status(500).json(statusText[500]);
  }
}
