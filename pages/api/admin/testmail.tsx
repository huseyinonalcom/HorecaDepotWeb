import { NextApiRequest, NextApiResponse } from "next";
import statusText from "../../../api/statustexts";
import { sendMail } from "../../../api/utils/sendmail";

export async function sendTestMail(mailParams) {
  let mailConfig = JSON.parse(mailParams);
  let answer = await sendMail({
    to: [mailConfig.mailTo],
    html: "<p>test mail horecadepot.be</p>",
    subject: "test mail horeca depot",
    mailParams: mailConfig,
  });
  return answer;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json(statusText[405]);
  }
  let mailParams = req.body;
  try {
    const mailAnswer = await sendTestMail(mailParams);
    return res.status(200).json(mailAnswer);
  } catch (error) {
    return res.status(500).json(statusText[500]);
  }
}
