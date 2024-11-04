import { NextApiRequest, NextApiResponse } from "next";

import statusText from "../../../../api/statustexts";
import { Product } from "../../../../api/interfaces/product";

export default async function putProduct(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const cookies = req.cookies;
  const authToken = cookies.j;
  const prodID = req.query.id;
  if (!authToken) {
    return res.status(401).json(statusText[401]);
  }
  if (req.method === "PUT") {
    try {
      const prodToPost = req.body.currProd as Product;
      const fetchUrl = `${process.env.API_URL}/api/products/${prodID}`;
      let body;
      let reservations = [];
      reservations.push(...prodToPost.reservations);
      if (req.body.newRes != null) {
        reservations.push(req.body.newRes);
      }
      body = {
        data: {
          reservations: reservations,
        },
      };

      const response = await fetch(fetchUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(body),
        redirect: "follow",
      });

      const ans = await response.json();
      if (!response.ok) {
        return res.status(400).json(statusText[400]);
      }
    } catch (error) {
      return res.status(500).json(statusText[500]);
    }

    return res.status(200).json(statusText[200]);
  } else {
    return res.status(405).json(statusText[405]);
  }
}
