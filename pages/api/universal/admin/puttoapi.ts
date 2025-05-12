import { NextApiRequest, NextApiResponse } from "next";
import statusText from "../../../../api/statustexts";
import getAuthCookie from "../../cookies";

export async function putToAPI({
  req,
  res,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
}) {
  try {
    const authToken = getAuthCookie({ type: "admin", req });
    const collection = req.query.collection;
    const id = req.query.id;
    const bodyToPut = req.body;

    console.log(`PUTTING TO ${collection}`);
    console.log(bodyToPut);

    const request = await fetch(
      `${process.env.API_URL}/api/${collection}${id ? `/${id}` : ""}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ data: bodyToPut }),
      },
    );

    if (request.ok) {
      let ans = await request.json();
      return ans.data.id ?? true;
    } else {
      let ans = await request.text();
      console.error(ans);
      return false;
    }
  } catch (e) {
    console.error(e);
    return false;
  }
}

export default async function handler(req, res) {
  try {
    const response = await putToAPI({ req, res });

    if (!response) {
      return res.status(400).json(statusText[400]);
    }

    return res.status(200).json({ id: response });
  } catch (e) {
    return res.status(500).json(statusText[500]);
  }
}
