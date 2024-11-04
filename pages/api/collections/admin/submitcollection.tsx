import statusText from "../../../../api/statustexts";

export default async function submitCollection(req, res) {
  if (!req.cookies.j) {
    return res.status(401).json(statusText[401]);
  }
  const authToken = req.cookies.j;

  if (!req.body) {
    return res.status(400).json("Missing body");
  }

  const body = await JSON.parse(req.body);

  if (req.method == "POST") {
    const fetchUrl = `${process.env.API_URL}/api/product-collections?fields[0]=id`;
    const postRequest = await fetch(fetchUrl, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      method: "POST",
      body: JSON.stringify({ data: { name: body.name } }),
    });

    const answer = await postRequest.json();

    if (postRequest.ok) {
      return res.status(200).json(answer.data);
    } else {
      return res.status(500).json(statusText[500]);
    }
  } else if (req.method == "PUT") {
    if (!req.query.id) {
      return res.status(400).json("Missing ID");
    }
    try {
      const fetchUrl = `${process.env.API_URL}/api/product-collections/${req.query.id}?fields[0]=id`;
      const response = await fetch(fetchUrl, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        method: "PUT",
        body: JSON.stringify({ data: body }),
      });
      const answer = await response.json();

      const data = answer["data"];

      return res.status(200).json(data.featured);
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  } else {
    return res.status(405).json(statusText[405]);
  }
}
