import { NextApiRequest, NextApiResponse } from "next";
import statusText from "../../../../api/statustexts";

export default async function deleteProduct(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const cookies = req.cookies;
  const authToken = cookies.j;
  const prodID = req.query.id;
  if (!authToken) {
    return res.status(401).json(statusText[401]);
  }
  if (req.method === "DELETE") {
    try {
      const fetchUrl = `${process.env.API_URL}/api/products/${prodID}`;
      let body = {
        data: {
          deleted: true,
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

      if (!response.ok) {
        return res.status(400).json(statusText[400]);
      } else {
        return res.status(200).json(statusText[200]);
      }
    } catch (error) {
      return res.status(500).json(statusText[500]);
    }
  } else {
    return res.status(405).json(statusText[405]);
  }
}
