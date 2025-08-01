import { NextApiRequest, NextApiResponse } from "next";
import statusText from "../../../../api/statustexts";

const fetchUrl = `${process.env.API_URL}/api/users/me?populate[client_info][populate][0]=addresses&populate=role`;

export default async function putClientInfo(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const cookies = req.cookies;
    const authToken = cookies.cj;

    if (!authToken) {
      return res.status(401).json(statusText[401]);
    }

    try {
      const request = await fetch(fetchUrl, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!request.ok) {
        return res.status(400).json(statusText[400]);
      }
      const answer = await request.json();
      if (answer.role.description != "Client") {
        return res.status(404).json(statusText[404]);
      }

      return res.status(200).json(answer);
    } catch (error) {
      return res.status(500).json(statusText[500]);
    }
  } else {
    return res.status(405).json(statusText[405]);
  }
}
