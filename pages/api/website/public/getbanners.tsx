import statusText from "../../../../api/statustexts";

export async function getBanners() {
  const response = await fetch(
    `${process.env.API_URL}/api/banners?populate[images][populate]=image&count=10000`,
    {
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
    },
  );

  try {
    const data = await response.json();
    return data.data;
  } catch (e) {
    return null;
  }
}

export default async function handler(req, res) {
  try {
    const response = await getBanners();

    if (!response) {
      return res.status(400).json(statusText[400]);
    }

    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json(statusText[500]);
  }
}
