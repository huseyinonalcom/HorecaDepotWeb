import statusText from "../../../../api/statustexts";
import getAuthCookie from "../../cookies";

export async function putWebsite({ req, res }) {
  const authToken = getAuthCookie({ type: "admin", req });

  const media_groups = JSON.parse(req.body);

  const response = await fetch(`${process.env.API_URL}/api/website`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      data: {
        media_groups: media_groups,
      },
    }),
  });

  const data = await response.json();

  try {
    return data;
  } catch (e) {
    return null;
  }
}

export default async function handler(req, res) {
  try {
    const response = await putWebsite({ req, res });

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
