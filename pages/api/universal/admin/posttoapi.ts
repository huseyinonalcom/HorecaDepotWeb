import { revalidatePath } from "next/cache";
import statusText from "../../../../api/statustexts";
import getAuthCookie from "../../cookies";

export async function postToAPI({ req, res }) {
  try {
    const authToken = getAuthCookie({ type: "admin", req });
    const collection = req.query.collectiontopost;
    const bodyToPut = req.body;

    const request = await fetch(`${process.env.API_URL}/api/${collection}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        data: bodyToPut,
      }),
    });

    let ans = await request.json();

    if (request.ok) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    return false;
  }
}

export default async function handler(req, res) {
  try {
    const response = await postToAPI({ req, res });

    if (!response) {
      return res.status(400).json(statusText[400]);
    }
    try {
      res.revalidate("/");
    } catch (_) {}
    try {
      revalidatePath("/");
    } catch (_) {}

    return res.status(200).json(statusText[200]);
  } catch (e) {
    return res.status(500).json(statusText[500]);
  }
}
