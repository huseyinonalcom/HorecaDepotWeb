import statusText from "../../../api/statustexts";

export async function getPopup() {
  const response = await fetch(`${process.env.API_URL}/api/site-popup`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.API_KEY}`,
    },
  });
  const ans = await response.json();

  try {
    return ans;
  } catch (e) {
    return null;
  }
}

export default async function handler(req, res) {
  try {
    const response = await getPopup();

    if (!response) {
      return res.status(400).json(statusText[400]);
    }

    return res.status(200).json(response);
  } catch (e) {
    console.error(e);
    return res.status(500).json(statusText[500]);
  }
}
