import statusText from "../../../../api/statustexts";

export async function getConfig() {
  const authToken = process.env.API_KEY;

  const response = await fetch(`${process.env.API_URL}/api/config`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  });
  const ans = await response.json();

  try {
    return ans.data.data;
  } catch (e) {
    return null;
  }
}

export default async function handler(req, res) {
  try {
    const response = await getConfig();

    if (!response) {
      return res.status(400).json(statusText[400]);
    }

    return res.status(200).json(response);
  } catch (e) {
    console.error(e);
    return res.status(500).json(statusText[500]);
  }
}
