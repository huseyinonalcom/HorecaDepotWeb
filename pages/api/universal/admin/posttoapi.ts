import statusText from "../../../../api/statustexts";
import getAuthCookie from "../../cookies";

export async function postToAPI({ req, res }) {
  try {
    const authToken = getAuthCookie({ type: "admin", req });
    const collection = req.query.collection;
    const bodyToPost = req.body;

    let reqBody = bodyToPost;

    if (!req.query.nodata) {
      reqBody = JSON.stringify({
        data: JSON.parse(bodyToPost),
      });
    }

    const request = await fetch(`${process.env.API_URL}/api/${collection}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: reqBody,
    });

    if (request.ok) {
      let ans = await request.json();
      if (req.query.nodata) {
        return ans.id;
      }
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
    const response = await postToAPI({ req, res });

    if (!response) {
      return res.status(400).json(statusText[400]);
    }

    return res.status(200).json({ id: response });
  } catch (e) {
    return res.status(500).json(statusText[500]);
  }
}
