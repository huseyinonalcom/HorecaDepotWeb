import statusText from "../../../../api/statustexts";
import getAuthCookie from "../../cookies";

export async function getFromApi({ req }) {
  try {
    const authToken = getAuthCookie({ type: "admin", req });
    const collection = req.query.collectiontoput;
    const id = req.query.idtoput;
    const qs = req.query.qs;

    const request = await fetch(
      `${process.env.API_URL}/api/${collection}${id ? `/${id}` : ""}${qs ? `?${qs}` : ""}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      },
    );

    if (request.ok) {
      return true;
    } else {
      return false;
    }
  } catch (_) {
    return false;
  }
}

export default async function handler(req, res) {
  try {
    const response = await getFromApi({ req });

    if (!response) {
      return res.status(400).json(statusText[400]);
    }
    try {
      res.revalidate("/");
    } catch (_) {}

    return res.status(200).json(statusText[200]);
  } catch (e) {
    return res.status(500).json(statusText[500]);
  }
}
