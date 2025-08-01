import { NextApiRequest, NextApiResponse } from "next";
import statusText from "../../../../api/statustexts";

export default async function getOrderDetails(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method === "GET") {
      const cookies = req.cookies;
      const authToken = cookies.cj;
      const orderID = req.query.order;
      if (!authToken) {
        return res.status(401).json(statusText[401]);
      }
      if (orderID) {
        try {
          const fetchUrl = `${process.env.API_URL}/api/documents/${orderID}?populate[0]=client&populate[1]=establishment&populate[2]=delAddress&populate[3]=docAddress&populate[4]=document_products&populate[5]=payments`;
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
            // answer.data.payments = answer.data.payments.filter((payment) => !payment.deleted && payment.verified);
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
