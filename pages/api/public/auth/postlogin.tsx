import { NextApiRequest, NextApiResponse } from "next";
import { apiUrl } from "../../../../api/api/constants";
import statusText from "../../../../api/statustexts";

const fetchUrl3 = `${apiUrl}/api/users/me?populate[0]=client_info&populate[client_info][populate][0]=addresses`;
const fetchUrl2 = `${apiUrl}/api/users/me?populate[0]=role`;
const fetchUrl = `${apiUrl}/api/auth/local`;

const validRoles = ["Client"];

export default async function logInClient(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const { identifier, password } = req.body;

    try {
      const request = await fetch(fetchUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${process.env.API_KEY}`,
        },
        body: JSON.stringify({
          identifier: identifier,
          password: password,
        }),
      });

      if (!request.ok) {
        return res.status(401).json(statusText[401]);
      }

      const answer = await request.json();

      const request2 = await fetch(fetchUrl2, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${answer.jwt}`,
        },
      });

      const answer2 = await request2.json();

      if (validRoles.includes(answer2.role.description)) {
        const isProduction = process.env.NODE_ENV === "production";

        res.setHeader(
          "Set-Cookie",
          `cj=${answer.jwt}; HttpOnly; Path=/; Max-Age=2592000; SameSite=Strict${isProduction ? "; Secure" : ""}`,
        );

        const request3 = await fetch(fetchUrl3, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${answer.jwt}`,
          },
        });

        const answer3 = await request3.json();

        return res.status(200).json(answer3);
      } else {
        return res.status(500).json(statusText[500]);
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json(statusText[500]);
    }
  } else {
    return res.status(405).json(statusText[405]);
  }
}
