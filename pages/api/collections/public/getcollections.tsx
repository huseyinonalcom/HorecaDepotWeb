import statusText from "../../../../api/statustexts";

export default async function getCollections(req, res) {
  if (req.method != "GET") {
    return res.status(405).json(statusText[405]);
  }
  let filterFeatured = "";
  if (req.query.featured) {
    if (req.query.featured == "true") {
      filterFeatured = "&filters[featured][$eq]=true";
    } else if (req.query.featured == "false") {
      filterFeatured = "&filters[featured][$eq]=false";
    } else {
      return res.status(400).json(statusText[400]);
    }
  }
  let collectionID = "";
  if (req.query.id && Number.isSafeInteger(Number(req.query.id))) {
    collectionID = `/${req.query.id}`;
  }
  try {
    const fetchCollectionsUrl = `${process.env.API_URL}/api/product-collections${collectionID}?populate[products][fields][0]=name${filterFeatured}&populate[products][fields][1]=supplierCode&populate[products][fields][2]=internalCode&populate[products][fields][3]=color&populate[products][fields][4]=material&populate[products][fields][5]=priceBeforeDiscount&populate[products][fields][6]=value&populate[image][fields][0]=url&populate[products][populate][images][fields][0]=url`;

    const fetchCollectionsRequest = await fetch(fetchCollectionsUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
    });
    if (fetchCollectionsRequest.ok) {
      const fetchCollectionsAnswer = await fetchCollectionsRequest.json();
      return res.status(200).json(fetchCollectionsAnswer.data);
    } else {
      const fetchCollectionsAnswer = await fetchCollectionsRequest.json();
      console.log(fetchCollectionsAnswer);
      return res.status(404).json(statusText[404]);
    }
  } catch (_) {
    return res.status(500).json(statusText[500]);
  }
}
