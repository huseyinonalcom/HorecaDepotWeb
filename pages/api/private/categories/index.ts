import { apiUrl } from "../../../../api/api/constants";
import apiRoute from "../../../../api/api/apiRoute";

const fetchUrl = `${apiUrl}/api/categories`;
const fetchQuery =
  "?populate[headCategory][fields][0]=localized_name&populate[subCategories][fields][0]=localized_name&fields[0]=localized_name&fields[1]=code&fields[2]=localized_name&fields[3]=priority&populate[image][fields][0]=url&populate[products_multi_categories][fields][0]=id&populate[products_multi_categories][fields][1]=active&sort=priority&pagination[pageSize]=1000";

export async function getCategories({ id }: { id?: number }) {
  const response = await fetch(
    `${fetchUrl}${id ? `/${id}` : ""}${fetchQuery}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
    },
  );

  const data = await response.json();
  return data.data;
}

export async function postCategory({
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
      throw "Failed to post Category.";
    }

    const ans = await reqBanner.json();

    return { result: ans };
  } catch (error) {
    return { error: error, result: null };
  }
}

export async function putCategory({
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

export async function deleteCategory({
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
  authChallenge: async (req) => {
    return !!req.cookies.j;
  },
  endpoints: {
    GET: {
      func: async (req, res) => {
        if (req.query.id) {
          return await getCategories({
            id: Number(req.query.id),
          });
        } else {
          return await getCategories({});
        }
      },
    },
    POST: {
      func: async (req, res) => {
        return await postCategory({
          data: req.body,
          authToken: req.cookies.j,
        });
      },
    },
    PUT: {
      func: async (req, res) => {
        return await putCategory({
          id: Number(req.query.id),
          data: req.body,
          authToken: req.cookies.j,
        });
      },
    },
    DELETE: {
      func: async (req, res) => {
        return await deleteCategory({
          id: Number(req.query.id),
          authToken: req.cookies.j,
        });
      },
    },
  },
});
