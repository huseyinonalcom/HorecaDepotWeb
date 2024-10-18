import statusText from "../../../api/statustexts";
import { verifyPayments } from "./verifypayment";

const fetchPayment = async (origin) => {
  try {
    const fetchPaymentUrl = `${process.env.API_URL}/api/payments?filters[origin][$contains]=${origin}&populate[document][fields][0]=id`;

    const request = await fetch(fetchPaymentUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
    });
    let answer: any = false;
    if (request.ok) {
      answer = await request.json();
    } else {
      answer = await request.text();
    }
    console.log(answer);
    return answer;
  } catch (e) {
    console.error(e);
  }
};

export default async function paymentWebhook(req, res) {
  console.log("Webhook received");
  console.log(req.body);
  try {
    if (req.body.id) {
      const payment = await fetchPayment(req.body.id);
      if (!payment) {
        return res.status(400).json(statusText[400]);
      }
      verifyPayments(payment.document.id);
    }
    return res.status(200).json(statusText[200]);
  } catch (e) {
    console.error(e);
    return res.status(500).json(statusText[500]);
  }
}
