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

    try {
      const request = await fetch(
        `${process.env.API_URL}/api/users/me?populate[client_info][populate][0]=addresses&populate[client_info][populate][1]=establishment&populate=role`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const answer = await request.json();
      clientID = answer.client_info.id;
      establishmentID = answer.client_info.establishment.id;
      if (answer.client_info.category == "Entreprise") {
        isClientProfessional = true;
      } else {
        isClientProfessional = false;
      }
    } catch {}

    try {
      for (let i = 0; i < productsFromCart.length; i++) {
        const productID = productsFromCart[i].product;

        const fetchUrl = `${process.env.API_URL}/api/products/${productID}?fields[0]=name&fields[1]=productLine&fields[2]=internalCode&fields[3]=priceBeforeDiscount&fields[4]=value&fields[5]=tax&populate[category][fields][0]=id`;

        const response = await fetch(fetchUrl, {
          headers: {
            Authorization: `Bearer ${process.env.API_KEY}`,
          },
        });

        const answer = await response.json();
        const productFromAPI: Product = answer.data;
        let productCalculated: DocumentProduct = { category: {} };
        productCalculated.category.id = productFromAPI.category.id;
        productCalculated.product = productID;
        productCalculated.name = productFromAPI.name;
        productCalculated.amount = productsFromCart[i].amount;
        productCalculated.priceBeforeDiscount =
          productFromAPI.priceBeforeDiscount;
        productCalculated.value = productFromAPI.value;
        if (productCalculated.priceBeforeDiscount <= productCalculated.value) {
          productCalculated.priceBeforeDiscount = productCalculated.value;
          productCalculated.discount = 0;
        } else {
          productCalculated.discount =
            productCalculated.priceBeforeDiscount - productCalculated.value;
        }
        productCalculated.discount *= productCalculated.amount;
        productCalculated.subTotal =
          productCalculated.value * productCalculated.amount; // total (tax included)
        productCalculated.tax = productFromAPI.tax; // tax percentage as integer (10% is 10 ...)
        productCalculated.taxSubTotal =
          productCalculated.subTotal -
          productCalculated.subTotal / (1 + productCalculated.tax / 100);
        productsToPost.push(productCalculated);
      }
    } catch (e) {
      return res.status(500).json(statusText[500]);
    }


    let documentNumber: number = Number(new Date().getFullYear() + "0000001");
    try {
      const requestLastOrder = await fetch(
        `${process.env.API_URL}/api/documents?filters[type][$eq]=Commande&sort[0]=number:desc&pagination[page]=1&pagination[pageSize]=1&fields[0]=number`,
        {
          headers: {
            Authorization: `Bearer ${process.env.API_KEY}`,
          },
        }
      );

      if (requestLastOrder.ok) {
        const answer = await requestLastOrder.json();
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
      docAddress: productsFromRequest.documentToPost.docAddress.id,
      delAddress: productsFromRequest.documentToPost.delAddress.id,
    };

    if (createDocument) {
      try {
        const fetchUrl = `${process.env.API_URL}/api/documents?fields=id`;
        const request = await fetch(fetchUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${process.env.API_KEY}`,
          },
          body: JSON.stringify({
            data: documentToPost,
          }),
        });
        if (request.ok) {
          const answer = await request.json();
          documentID = answer.data.id;
          try {
            const fetchUrl = `${process.env.API_URL}/api/document-products`;
            const headers = {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${process.env.API_KEY}`,
            };
            for (let i = 0; i < productsToPost.length; i++) {
              const response = await fetch(fetchUrl, {
                method: "POST",
                headers: headers,
                body: JSON.stringify({
                  data: {
                    name: productsToPost[i].name,
                    // description: productToPost[i].description,
                    value: productsToPost[i].value,
                    subTotal: productsToPost[i].subTotal,
                    discount: productsToPost[i].discount,
                    amount: productsToPost[i].amount,
                    tax: productsToPost[i].tax,
                    taxSubTotal: productsToPost[i].taxSubTotal,
                    delivered: false,
                    document: documentID,
                    product: productsToPost[i].product,
                  },
                }),
              });
              if (!response.ok) {
                return res.status(400).json(statusText[400]);
              }
            }
            return res.status(200).json({ documentID: documentID });
          } catch (e) {
            return res.status(500).json(statusText[500]);
          }
        } else {
          return res.status(400).json(statusText[400]);
        }
      } catch (e) {
        return res.status(500).json(statusText[500]);
      }
    } else {
      return res.status(200).json(documentToPost);
    }
  } else {
    return res.status(405).json(statusText[405]);
  }
}
