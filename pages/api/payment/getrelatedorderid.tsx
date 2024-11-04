import statusText from "../../../api/statustexts";

export default async function getRelatedOrderID(req, res) {
  try {
    let paymentID = null;

    if (req.query.paymentid) {
      paymentID = req.query.paymentid;
    } else {
      return res.status(400).json(statusText[400]);
    }

    const fetchPaymentUrl = `${process.env.API_URL}/api/payments/${paymentID}?populate[document][fields][0]=id&fields[0]=id`;

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
      return res.status(200).json({ orderID: fetchPaymentAnswer.data.document.id });
    } else {
      return res.status(404).json(statusText[404]);
    }
  } catch (_) {
    return res.status(500).json(statusText[500]);
  }
}
