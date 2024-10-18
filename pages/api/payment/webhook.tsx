import statusText from "../../../api/statustexts";

export default async function paymentWebhook(req, res) {
    console.log("Webhook received");
    console.log(req.body);
  try {
    return res.status(200).json(statusText[200]);
  } catch (e) {
    console.error(e);
    return res.status(500).json(statusText[500]);
  }
}
