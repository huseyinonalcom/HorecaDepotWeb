import { NextApiRequest, NextApiResponse } from "next";
import statusText from "../../../../api/statustexts";

const fetchUrl = `${process.env.API_URL}/api/upload/files/`;

export default async function deleteFileByID(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "DELETE") {
    const cookies = req.cookies;
    const authToken = cookies.j;

    if (!authToken) {
      return res.status(401).json(statusText[401]);
    }

    try {
      const request = await fetch(fetchUrl + req.query.id, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        redirect: "follow",
      });

      if (!request.ok) {
        return res.status(400).json(statusText[400]);
      }

      return res.status(200).json(statusText[200]);
    } catch (error) {
      return res.status(500).json(statusText[500]);
    }
  } else {
    return res.status(405).json(statusText[405]);
  }
}
