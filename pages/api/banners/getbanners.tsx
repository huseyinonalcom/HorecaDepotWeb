import statusText from "../../../api/statustexts";

let cache = {
  data: null,
  timestamp: Date.now(),
};

const CACHE_DURATION = 15 * 60 * 1000;
const fetchUrl = `${process.env.API_URL}/api/site-banner?populate=*`;

export async function getAllBanners(req) {
  const fresh = req.query.fresh === "true";

  if (!fresh && cache.data && Date.now() - cache.timestamp < CACHE_DURATION) {
    return cache.data;
  }
  
  try {
    const response = await fetch(fetchUrl, {
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const answer = data.data.banners;

    cache = {
      data: answer,
      timestamp: Date.now(),
    };
    return answer;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function handler(req, res) {
  try {
    const response = await getAllBanners(req);

    if (!response) {
      return res.status(500).json(statusText[500]);
    }

    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json(statusText[500]);
  }
}
