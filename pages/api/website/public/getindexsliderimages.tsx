import statusText from "../../../../api/statustexts";

const cache = {
  data: null,
  lastFetch: 0,
};

const CATEGORY_CACHE_TTL = 1000 * 60 * 30;

export default async function getIndexSliderImages(req, res) {
  const now = Date.now();
  const cacheCheck = () => {
    if (cache.data && now - cache.lastFetch < CATEGORY_CACHE_TTL) {
      return res.status(200).json(cache.data);
    }
  };

  cacheCheck();

  try {
    const fetchImagesUrl = `${process.env.API_URL}/api/websites/1?fields[0]=id&fields[1]=indexSliderImagesUrls&populate[indexSliderImages][fields][0]=url`;

    const fetchImagesRequest = await fetch(fetchImagesUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
    });
    if (fetchImagesRequest.ok) {
      const fetchImagesAnswer = await fetchImagesRequest.json();

      cache.lastFetch = now;
      cache.data = fetchImagesAnswer.data;
      return res.status(200).json(fetchImagesAnswer.data);
    } else {
      return res.status(404).json(statusText[404]);
    }
  } catch (_) {
    return res.status(500).json(statusText[500]);
  }
}
