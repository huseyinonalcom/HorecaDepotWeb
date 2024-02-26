export default async function toggleActive(req, res) {
  const productId = req.query.id;
  try {
    const cookies = req.cookies;
    const authToken = cookies.j;
    const fetchUrl = `${process.env.API_URL}/api/products/${productId}?fields[0]=id&fields[1]=active`;

    const response = await fetch(fetchUrl, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      method: "PUT",
      body: JSON.stringify({ data: { active: req.body.active } }),
    });
    const answer = await response.json();

    const data = answer["data"];

    return res.status(200).json(data.active);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
