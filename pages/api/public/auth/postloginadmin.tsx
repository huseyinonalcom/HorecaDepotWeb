import { NextApiRequest, NextApiResponse } from "next";
import statusText from "../../../../api/statustexts";
import { apiUrl } from "../../../../api/api/constants";

const fetchUrl2 = `${apiUrl}/api/users/me?populate=role`;
const fetchUrl = `${apiUrl}/api/auth/local`;

const validRoles = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

export default async function logInAdmin(
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
        const answer = await request.text();
        console.log(answer);
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

      if (validRoles.includes(Number(answer2.role.description))) {
        const isProduction = process.env.NODE_ENV === "production";

        res.setHeader(
          "Set-Cookie",
          `j=${answer.jwt}; HttpOnly; Path=/; Max-Age=2592000; SameSite=Strict${isProduction ? "; Secure" : ""}`,
        );

        return res.status(200).json(answer2.role.name);
      } else {
        return res.status(500).json(statusText[500]);
      }
    } catch (error) {
      return res.status(500).json(statusText[500]);
    }
  } else {
    return res.status(405).json(statusText[405]);
  }
}
