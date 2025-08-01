import { NextApiRequest, NextApiResponse } from "next";

import statusText from "../../../../api/statustexts";

export default async function putTagsBulk(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const cookies = req.cookies;
  const authToken = cookies.j;
  const body = await JSON.parse(req.body);
  const prodIds = body.products;
  const tags = body.tags;

  if (!authToken) {
    return res.status(401).json(statusText[401]);
  }

  if (req.method === "PUT") {
    try {
      prodIds.forEach((chsp) => {
        const putTags = async () => {
          const putReq = await fetch(
            `${process.env.API_URL}/api/product-extras/${chsp.product_extra.id}?fields[0]=id&fields[1]=tags`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${authToken}`,
              },
              body: JSON.stringify({ data: { tags: tags } }),
              redirect: "follow",
            }
          );
          const ans = await putReq.json();
          return ans;
        };
        putTags()
      });
    } catch (error) {
      return res.status(500).json(statusText[500]);
    }

    return res.status(200).json(statusText[200]);
  } else {
    return res.status(405).json(statusText[405]);
  }
}
