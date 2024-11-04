import { NextApiRequest, NextApiResponse } from "next";
import statusText from "../../../../api/statustexts";

const fetchUrl = `${process.env.API_URL}/api/users/me?populate[role][fields][0]=description&fields=id`;

export default async function checkLoggedInUserClient(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    const cookies = req.cookies;
    const authToken = cookies.cj;

    if (!authToken) {
      return res.status(401).json(statusText[401]);
    }

    try {
      const request = await fetch(fetchUrl, {
        method: "GET",
        cache: "no-cache",
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

      return res.status(200).json(statusText[200]);
    } catch (error) {
      return res.status(500).json(statusText[500]);
    }
  } else {
    return res.status(405).json(statusText[405]);
  }
}
