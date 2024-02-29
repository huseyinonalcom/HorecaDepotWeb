import { NextApiRequest, NextApiResponse } from "next";

import statusText from "../../../../api/statustexts";
import { DocumentProduct } from "../../../../api/interfaces/documentProduct";
import { Product } from "../../../../api/interfaces/product";

export default async function postDocument(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const cookies = req.cookies;
    const authToken = cookies.j;
    const createDocument: boolean = req.query.final == "true";
    let documentID: number = 0;
    const clientID: number = req.body.client.id;
    let isClientProfessional: boolean = false;
    const establishmentID: number = req.body.establishment.id;
    const document = req.body.document;
    const userID = req.body.user.id;

    if (!authToken) {
      return res.status(401).json({ missing: "auth token" });
    }

    if (!userID) {
      return res.status(400).json({ missing: "userID" });
    }

    if (!clientID) {
      return res.status(400).json({ missing: "clientID" });
    }

    if (!document) {
      return res.status(400).json({ missing: "document" });
    }

    if (!document.document_products) {
      return res.status(400).json({ missing: "documentProducts" });
    }

    if (!document.documentAddress) {
      return res.status(400).json({ missing: "documentAddress" });
    }

    if (!document.deliveryAddress) {
      document.deliveryAddress = document.documentAddress;
    }

    let documentNumber: number = Number(new Date().getFullYear() + "0000001");

    try {
      const requestLastDoc = await fetch(
        `${process.env.API_URL}/api/documents?filters[type][$eq]=${document.type}&sort[0]=number:desc&pagination[page]=1&pagination[pageSize]=1&fields[0]=number`,
        {
          headers: {
            Authorization: `Bearer ${process.env.API_KEY}`,
          },
        }
      );

      if (requestLastDoc.ok) {
        const answer = await requestLastDoc.json();
        documentNumber = Number(answer.data[0].number) + 1;
      } else {
      }
    } catch {}

    const today = new Date();
    var documentToPost = {
      number: documentNumber,
      type: "Commande",
      prefix: "NB-",
      date:
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1).toString().padStart(2, "0") +
        "-" +
        today.getDate().toString().padStart(2, "0"),
      client: clientID,
      phase: 0,
      establishment: establishmentID,
      docAddress: document.docAddress.id,
      delAddress: document.delAddress.id,
    };

    if (createDocument) {
    } else {
      return res.status(200).json(documentToPost);
    }
  } else {
    return res.status(405).json(statusText[405]);
  }
}
