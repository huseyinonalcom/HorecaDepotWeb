import { NextApiRequest, NextApiResponse } from "next";
import statusText from "../../../../api/statustexts";

const fetchUrl = `${process.env.API_URL}/api/products?fields[0]=id&fields[1]=supplierCode&populate[product_extra][fields][0]=id&populate[shelves][populate][establishment][fields][0]=id&pagination[pageSize]=20000`;

export default async function getAllProductIDs(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const cookies = req.cookies;
    if (!cookies.j) {
      return res.status(401).json(statusText[401]);
    }
    const authToken = cookies.j;

    try {
      const request = await fetch(fetchUrl, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!request.ok) {
        return res.status(400).json(statusText[400]);
      }

      const response = await request.json();
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json(statusText[500]);
    }
  } else {
    return res.status(405).json(statusText[405]);
  }
}
