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
  console.log("api/universal/admin/puttoapi", "query", req.query);
  const query = req.query;
  try {
    const authToken = getAuthCookie({ type: "admin", req });
    const collection = query.collection;
    const id = query.id;
    const bodyToPut = req.body;
    const nodata = query.nodata;

    let body;

    if (!nodata) {
      body = JSON.stringify({ data: JSON.parse(bodyToPut) });
    } else {
      body = JSON.stringify(JSON.parse(bodyToPut));
    }

    const request = await fetch(
      `${process.env.API_URL}/api/${collection}${id ? `/${id}` : ""}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: body,
      },
    );

    if (request.ok) {
      let ans = await request.json();
      return ans.id ?? true;
    } else {
      let ans = await request.text();
      console.error("api/universal/admin/puttoapi", ans);
      return false;
    }
  } catch (e) {
    console.error("api/universal/admin/puttoapi", e);
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
