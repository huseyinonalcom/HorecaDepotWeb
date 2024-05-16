import { NextApiRequest, NextApiResponse } from "next";
import statusText from "../../../api/statustexts";

const fetchUrl = `${process.env.API_URL}/api/auth/forgot-password`;

export default async function logInClient(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const { email } = req.body;

    try {
      const request = await fetch(fetchUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${process.env.API_KEY}`,
        },
        body: JSON.stringify({
          email: email,
        }),
      });

      if (!request.ok) {
        return res.status(401).json(statusText[401]);
      }

      return res.status(200).json(statusText[200]);
    } catch (error) {
      return res.status(500).json(statusText[500]);
    }
  }
}
