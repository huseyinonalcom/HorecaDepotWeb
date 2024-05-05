import statusText from "../../../../api/statustexts";

export async function getCollections(collectionID?, filterFeatured?) {
  const now = Date.now();

  // &populate[products][fields][3]=internalCode

  try {
    const fetchCollectionsUrl = `${
      process.env.API_URL
    }/api/product-collections${
      collectionID ?? ""
    }?populate[products][fields][0]=name${
      filterFeatured ?? "&filters[featured][$eq]=true"
    }&populate[products][fields][1]=supplierCode&populate[products][fields][2]=color&populate[products][populate][shelves][fields][0]=stock&populate[products][fields][4]=material&populate[products][fields][5]=priceBeforeDiscount&populate[products][fields][6]=value&populate[image][fields][0]=url&populate[products][populate][images][fields][0]=url&populate[products][populate][category][fields][0]=Name`;
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
      return fetchCollectionsAnswer.data;
    } else {
      throw new Error("Failed to fetch collections data");
    }
  } catch (error) {
    console.error("Error fetching collections data:", error);
    throw error;
  }
}

// API route handler
export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json(statusText[405]);
  }

  let filterFeatured = "";
  if (req.query.featured) {
    if (req.query.featured == "false") {
      filterFeatured = "&filters[featured][$eq]=false";
    }
  }

  let collectionID = "";
  if (req.query.id && Number.isSafeInteger(Number(req.query.id))) {
    collectionID = `/${req.query.id}`;
  }

  try {
    const collectionsData = await getCollections(collectionID, filterFeatured);
    return res.status(200).json(collectionsData);
  } catch (error) {
    return res.status(500).json(statusText[500]);
  }
}
