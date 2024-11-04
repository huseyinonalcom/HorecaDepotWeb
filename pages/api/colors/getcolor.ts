import { NextApiRequest, NextApiResponse } from "next";

export default async function getColor(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const cookies = req.cookies;
  const authToken = cookies.j;
  if (!req.query.id) {
    return res.status(400).json("No id provided.");
  }
  if (req.method === "GET") {
    try {
      const fetchUrl = `${process.env.API_URL}/api/product-colors/${req.query.id}`;
      const reqColor = await fetch(fetchUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      return res.status(200).json(reqColor);
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res.status(405).json("Method not allowed.");
  }
}
