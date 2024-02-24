let cache = {};

const CACHE_DURATION = 15 * 60 * 1000;

export default async function handler(req, res) {
  const categoryId = req.query.id;

  if (cache[categoryId] && Date.now() - cache[categoryId].timestamp < CACHE_DURATION) {
    return res.status(200).json(cache[categoryId].data);
  }

  try {
    const fetchUrl = `${process.env.API_URL}/api/categories/${categoryId}?populate[headCategory][fields][0]=Name&populate[subCategories][fields][0]=Name&fields[0]=Name&populate[image][fields][0]=url&populate[subCategories][populate][image][fields][0]=url&pagination[pageSize]=100`;
    const response = await fetch(fetchUrl, {
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    cache[categoryId] = {
      data: data["data"],
      timestamp: Date.now(),
    };

    res.status(200).json(data["data"]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
