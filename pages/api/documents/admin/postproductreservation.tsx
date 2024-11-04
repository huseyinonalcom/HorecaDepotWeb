import { NextApiRequest, NextApiResponse } from "next";

import statusText from "../../../../api/statustexts";

// create client if client doesn't exist yet req.body.document.client.id
// create document and add client: client.id
// create documentproducts and add document: document.id

export default async function postProductReservation(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const cookies = req.cookies;
  const authToken = cookies.j;
  const document = req.body.document;
  let clientNeedsToBeCreated: boolean = false;

  if (!authToken) {
    return res.status(401).json({ missing: "auth token" });
  }

  if (!document) {
    return res.status(400).json({ missing: "document" });
  }

  if (!document.client.id || document.client.id == 0) {
    clientNeedsToBeCreated = true;
  }

  if (req.method === "POST") {
    try {
      if (clientNeedsToBeCreated) {
        try {
          const reqClient = await fetch(`${process.env.API_URL}/api/clients`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify({
              data: {
                firstName: document.client.firstName,
                lastName: document.client.lastName,
                category: document.client.category,
              },
            }),
          });
          const reqClientAnswer = await reqClient.json();
          if (reqClient.ok) {
            document.client.id = reqClientAnswer.data.id;
            // post the document
            // then post the documentproducts
             
          } else {
            return res
              .status(400)
              .json({ error: "negative response posting client" });
          }
        } catch (e) {
          return res.status(500).json("internal error posting client");
        }
      }
    } catch (error) {
      return res.status(500).json("error outside of requests");
    }

    return res.status(200).json(statusText[200]);
  } else {
    return res.status(405).json(statusText[405]);
  }
}
