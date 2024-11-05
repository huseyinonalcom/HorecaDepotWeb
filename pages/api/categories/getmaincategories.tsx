let cache = {
  data: null,
  timestamp: Date.now(),
};

const CACHE_DURATION = 15 * 60 * 1000;
const fetchUrl = `${process.env.API_URL}/api/categories?filters[headCategory][id][$null]=true&fields[0]=localized_name&populate[image][fields][0]=url&sort=priority&pagination[pageSize]=100`;

export default async function getMainCategory(req, res) {
  if (cache.data && Date.now() - cache.timestamp < CACHE_DURATION) {
    return res.status(200).json(cache.data);
  }

  try {
    const response = await fetch(fetchUrl, {
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    cache = {
      data: data["data"],
      timestamp: Date.now(),
    };

    res.status(200).json(data["data"]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
