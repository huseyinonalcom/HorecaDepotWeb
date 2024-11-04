import { NextApiRequest, NextApiResponse } from "next";

import statusText from "../../../../api/statustexts";

export default async function getAllOrders(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      const cookies = req.cookies;
      const authToken = cookies.cj;
      if (!authToken) {
        return res.status(401).json(statusText[401]);
      }
      try {
        const fetchUrl = `${process.env.API_URL}/api/documents?fields[0]=prefix&fields[1]=number&fields[2]=date&populate[client][fields][0]=id&populate[payments][fields][0]=value&populate[payments][fields][1]=verified&populate[payments][fields][2]=deleted&populate[document_products][fields][0]=subTotal&populate[document_products][populate][product][fields][0]=name&populate[document_products][populate][products][fields][1]=imageDirections&populate[document_products][populate][product][populate][images][fields][0]=url`;
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
          const cleanedData = answer.data.map((item) => ({
            ...item,
            payments: item.payments.filter(
              (payment) => !payment.deleted && payment.verified
            ),
          }));
          return res.status(200).json(cleanedData);
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
