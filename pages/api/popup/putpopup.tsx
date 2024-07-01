import statusText from "../../../api/statustexts";
import getAuthCookie from "../cookies";

export async function putPopup({ req, res }) {
  const authToken = getAuthCookie({ type: "admin", req });

  const popup = JSON.parse(req.body);

  const response = await fetch(`${process.env.API_URL}/api/site-popup`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      data: {
        url: popup.url,
        img: popup.img,
      },
    }),
  });
  const ans = await response.json();

  try {
    return true;
  } catch (e) {
    return null;
  }
}

export default async function handler(req, res) {
  try {
    const response = await putPopup({ req, res });

    if (!response) {
      return res.status(400).json(statusText[400]);
    }
    try {
      res.revalidate("/");
    } catch (_) {}

    return res.status(200).json(statusText[200]);
  } catch (e) {
    console.error(e);
    return res.status(500).json(statusText[500]);
  }
}
