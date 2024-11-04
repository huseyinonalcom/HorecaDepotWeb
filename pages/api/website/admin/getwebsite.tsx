import statusText from "../../../../api/statustexts";
import getAuthCookie from "../../cookies";

export async function getWebsite({ req, res }) {
  const authToken = getAuthCookie({ type: "admin", req });

  const qs = require("qs");
  const query = qs.stringify({
    populate: {
      media_groups: {
        fields: [
          "name",
          "order",
          "description",
          "is_fetched_from_api",
          "fetch_from",
        ],
        populate: {
          image_with_link: {
            fields: ["name", "linked_url", "order", "description"],
            populate: { image: { fields: ["url", "name"] } },
          },
        },
      },
    },
  });

  const response = await fetch(`${process.env.API_URL}/api/website?${query}`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  try {
    const data = await response.json();
    return data.data;
  } catch (e) {
    return null;
  }
}

export default async function handler(req, res) {
  try {
    const response = await getWebsite({ req, res });

    if (!response) {
      return res.status(400).json(statusText[400]);
    }

    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json(statusText[500]);
  }
}
