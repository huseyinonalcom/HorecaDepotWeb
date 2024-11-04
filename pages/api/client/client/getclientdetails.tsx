import { NextApiRequest, NextApiResponse } from "next";

import statusText from "../../../../api/statustexts";

export default async function getClientDetails(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      const cookies = req.cookies;
      const authToken = cookies.cj;
      if (!authToken) {
        return res.status(401).json(statusText[401]);
      }
      try {
        const fetchUrl = `${process.env.API_URL}/api/users/me?populate[0]=client_info&populate[client_info][populate][0]=addresses`;
        const request = await fetch(fetchUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });
        const answer = await request.json();
        if (request.ok) {
          return res.status(200).json(answer);
        } else {
          return res.status(404).json(statusText[404]);
        }
      } catch (e) {
        return res.status(500).json(statusText[500]);
      }
    } else {
      return res.status(405).json(statusText[405]);
    }
  } catch (e) {
    return res.status(500).json(statusText[500]);
  }
}
