export default async function getCategoryById(req, res) {
  const categoryId = req.query.id;

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

    res.status(200).json(data["data"]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
