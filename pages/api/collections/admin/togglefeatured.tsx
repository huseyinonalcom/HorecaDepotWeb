export default async function putCollectionFeatured(req, res) {
  const productId = req.query.id;
  try {
    const cookies = req.cookies;
    const authToken = cookies.j;
    const fetchUrl = `${process.env.API_URL}/api/product-collections/${productId}?fields[0]=id&fields[1]=featured`;
    const response = await fetch(fetchUrl, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      method: "PUT",
      body: JSON.stringify({ data: { featured: req.body.featured } }),
    });
    const answer = await response.json();

    const data = answer["data"];
    
    return res.status(200).json(data.featured);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
