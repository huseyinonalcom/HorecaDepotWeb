import { apiUrl } from "../../../api/api/constants";
import apiRoute from "../../../api/api/apiRoute";

const fetchUrl = `${apiUrl}/api/product-collections`;
const fetchQuery = `?populate[products][fields][0]=name&populate[products][fields][1]=internalCode&populate[products][fields][2]=color&populate[products][populate][shelves][fields][0]=stock&populate[products][fields][4]=material&populate[products][fields][5]=priceBeforeDiscount&populate[products][fields][6]=value&populate[products][fields][7]=active&populate[products][fields][8]=imageDirections&populate[image][fields][0]=url&populate[products][populate][images][fields][0]=url&populate[products][populate][categories][fields][0]=localized_name&populate[products][populate][product_color][fields][0]=name`;

export async function getCollections({
  id,
  featured,
}: {
  id?: number;
  featured?: boolean;
}) {
  if (id) {
    featured = false;
  }
  const response = await fetch(
    `${fetchUrl}${id ? `/${id}` : ""}${fetchQuery}${
      featured ?? "&filters[featured][$eq]=true"
    }`,
    {
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
    },
  );

  const data = await response.json();
  return data.data;
}

export async function postCollection({
  data,
  authToken,
}: {
  data: any;
  authToken: string;
}) {
  try {
    const body = JSON.stringify({ data: JSON.parse(data) });

    const reqBanner = await fetch(fetchUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: body,
    });

    if (reqBanner.status != 200) {
      const ans = await reqBanner.text();
      throw "Failed to post Collection.";
    }

    const ans = await reqBanner.json();

    return { result: ans };
  } catch (error) {
    return { error: error, result: null };
  }
}

export async function putCollection({
  id,
  data,
  authToken,
}: {
  id: number;
  data: any;
  authToken: string;
}) {
  if (!id) {
    throw "No id provided.";
  }

  try {
    const body = JSON.stringify({ data: JSON.parse(data) });

    const reqBanner = await fetch(fetchUrl + "/" + id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: body,
    });

    return { result: { id: reqBanner } };
  } catch (error) {
    console.error(error);
    return { error: error, result: null };
  }
}

export async function deleteCollection({
  id,
  authToken,
}: {
  id: number;
  authToken: string;
}) {
  if (!id) {
    throw "No id provided.";
  }

  try {
    await fetch(fetchUrl + "/" + id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });

    return { result: true };
  } catch (error) {
    console.error(error);
    return { error: error, result: null };
  }
}

export default apiRoute({
 
  endpoints: {
    GET: {
      func: async (req, res) => {
        if (req.query.id) {
          return await getCollections({
            id: Number(req.query.id),
          });
        } else if (req.query.featured) {
          return await getCollections({
            featured: true,
          });
        } else {
          return await getCollections({});
        }
      },
    },
    POST: {
      func: async (req, res) => {
        return await postCollection({
          data: req.body,
          authToken: req.cookies.j,
        });
      },
    },
    PUT: {
      func: async (req, res) => {
        return await putCollection({
          id: Number(req.query.id),
          data: req.body,
          authToken: req.cookies.j,
        });
      },
    },
    DELETE: {
      func: async (req, res) => {
        return await deleteCollection({
          id: Number(req.query.id),
          authToken: req.cookies.j,
        });
      },
    },
  },
});
