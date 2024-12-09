import { revalidatePath } from "next/cache";
import statusText from "../../../../api/statustexts";
import getAuthCookie from "../../cookies";

export async function putToAPI({ req, res }) {
  try {
    const authToken = getAuthCookie({ type: "admin", req });
    const collection = req.query.collectiontoput;
    const id = req.query.idtoput;
    const bodyToPut = req.body;

    const request = await fetch(
      `${process.env.API_URL}/api/${collection}${id ? `/${id}` : ""}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          data: bodyToPut,
        }),
      },
    );

    let ans = await request.json();
    console.log(ans);

    if (request.ok) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    console.log(e);
    return false;
  }
}

export default async function handler(req, res) {
  try {
    const response = await putToAPI({ req, res });

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
    console.log(e);
    return res.status(500).json(statusText[500]);
  }
}
