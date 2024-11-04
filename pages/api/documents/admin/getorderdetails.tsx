import { NextApiRequest, NextApiResponse } from "next";

import statusText from "../../../../api/statustexts";

export default async function getOrderDetails(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method === "GET") {
      const cookies = req.cookies;
      const authToken = cookies.j;
      const orderID = req.query.order;
      if (!authToken) {
        return res.status(401).json(statusText[401]);
      }
      if (orderID) {
        try {
          const fetchUrl = `${process.env.API_URL}/api/documents/${orderID}?populate[client][fields]=*&populate[establishment][fields]=*&populate[delAddress][fields]=*&populate[docAddress][fields]=*&populate[docAddress][fields]=*&populate[payments][fields]=*&populate[document_products][populate][0]=product&populate[document_products][populate][product][populate][0]=product_extra`;
          const request = await fetch(fetchUrl, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${authToken}`,
            },
          });
          if (request.ok) {
            const answer = await request.json();
            return res.status(200).json(answer.data);
          } else {
            return res.status(404).json(statusText[404]);
          }
        } catch (e) {
          return res.status(500).json(statusText[500]);
        }
      } else {
        return res.status(400).json(statusText[400]);
      }
    } else {
      return res.status(405).json(statusText[405]);
    }
  } catch (e) {
    return res.status(500).json(statusText[500]);
  }
}
