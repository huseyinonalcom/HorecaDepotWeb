import statusText from "../../../../api/statustexts";

export async function getCollections({
  collectionID,
  filterFeatured,
}: {
  collectionID?: string;
  filterFeatured?: string;
}) {
  try {
    const fetchCollectionsUrl = `${
      process.env.API_URL
    }/api/product-collections${
      collectionID ? `/${collectionID}` : ""
    }?populate[products][fields][0]=name${
      filterFeatured ?? "&filters[featured][$eq]=true"
    }&populate[products][fields][1]=internalCode&populate[products][fields][2]=color&populate[products][populate][shelves][fields][0]=stock&populate[products][fields][4]=material&populate[products][fields][5]=priceBeforeDiscount&populate[products][fields][6]=value&populate[products][fields][7]=active&populate[products][fields][8]=imageDirections&populate[image][fields][0]=url&populate[products][populate][images][fields][0]=url&populate[products][populate][categories][fields][0]=localized_name&populate[products][populate][product_color][fields][0]=name`;
    const fetchCollectionsRequest = await fetch(fetchCollectionsUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
    });

    const ans = await fetchCollectionsRequest.json();

    if (fetchCollectionsRequest.ok) {
      const fetchCollectionsAnswer = ans;
      // Sort collections by value (ascending)
      for (let i = 0; i < fetchCollectionsAnswer.data.length; i++) {
        fetchCollectionsAnswer.data[i].products = fetchCollectionsAnswer.data[
          i
        ].products.sort((a, b) => a.value - b.value);
      }

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
    collectionID = `${req.query.id}`;
  }

  try {
    const collectionsData = await getCollections({
      collectionID,
      filterFeatured,
    });
    return res.status(200).json(collectionsData);
  } catch (error) {
    return res.status(500).json(statusText[500]);
  }
}
