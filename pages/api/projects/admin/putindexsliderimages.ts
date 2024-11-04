import { NextApiRequest, NextApiResponse } from "next";
import statusText from "../../../../api/statustexts";

export default async function putIndexSliderImages(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    const cookies = req.cookies;
    const authToken = cookies.j;
    const imgIDs = req.body;

    if (!authToken) {
      return res.status(401).json(statusText[401]);
    }

    try {
      const fetchUrl = `${process.env.API_URL}/api/websites/1?fields=id`;
      const request = await fetch(fetchUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(imgIDs),
        redirect: "follow",
      });

      if (!request.ok) {
        return res.status(400).json(statusText[400]);
      }

      const response = await request.json();
      return res.status(200).json(statusText[200]);
    } catch (error) {
      return res.status(500).json(statusText[500]);
    }
  } else {
    return res.status(405).json(statusText[405]);
  }
}
