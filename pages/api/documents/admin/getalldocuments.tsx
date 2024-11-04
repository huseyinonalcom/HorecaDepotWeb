import { NextApiRequest, NextApiResponse } from "next";
import statusText from "../../../../api/statustexts";

const fetchUrl = `${process.env.API_URL}/api/documents?populate=*`;

export default async function getAllDocuments(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    const cookies = req.cookies;
    const authToken = cookies.j;
    const page = "&pagination[page]=" + (req.query.page ?? 1);
    let order = req.query.sort ? "&sort=" + req.query.sort : "";

    if (!authToken) {
      return res.status(401).json(statusText[401]);
    }

    try {
      const request = await fetch(fetchUrl + page + order, {
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
