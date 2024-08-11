import { NextApiRequest, NextApiResponse } from "next";
import { Color } from "../../../api/interfaces/color";

export default async function putColor(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const cookies = req.cookies;
  const authToken = cookies.j;
  if (!req.query.id) {
    return res.status(400).json("No id provided.");
  }
  if (req.method === "PUT") {
    const colorToPost = req.body as Color;

    try {
      const fetchUrl = `${process.env.API_URL}/api/product-colors/${req.query.id}`;
      const reqColor = await fetch(fetchUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          data: {
            name: colorToPost.name,
            image: colorToPost.image.id,
          },
        }),
      });

      console.log(reqColor);

      return res.status(200).json({ id: reqColor });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  } else {
    return res.status(405).json("Method not allowed.");
  }
}
