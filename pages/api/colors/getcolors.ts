import { NextApiRequest, NextApiResponse } from "next";

export default async function getColors(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const cookies = req.cookies;
  const authToken = cookies.j;
  if (req.method === "GET") {
    try {
      const fetchUrl = `${process.env.API_URL}/api/colors`;
      const reqColor = await fetch(fetchUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      console.log(reqColor);

      return res.status(200).json(reqColor);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  } else {
    return res.status(405).json("Method not allowed.");
  }
}
