import statusText from "../../../../api/statustexts";

export async function getWebsite() {
  const qs = require("qs");
  const query = qs.stringify({
    populate: {
      media_groups: {
        fields: [
          "name",
          "order",
          "description",
          "fetch_from",
          "is_fetched_from_api",
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
      Authorization: `Bearer ${process.env.API_KEY}`,
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
    const response = await getWebsite();

    if (!response) {
      return res.status(400).json(statusText[400]);
    }

    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json(statusText[500]);
  }
}
