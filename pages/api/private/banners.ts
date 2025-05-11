import { apiUrl } from "../../../api/api/constants";
import apiRoute from "../../../api/api/apiRoute";

const fetchUrl = `${apiUrl}/api/banners`;
const fetchQuery = `?populate[images][populate]=image`;

export async function getBanners({ id }: { id?: number }) {
  const response = await fetch(
    `${fetchUrl}${id ? `/${id}` : ""}${fetchQuery}&count=10000`,
    {
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
    },
  );

  const data = await response.json();
  return data.data;
}

export async function postBanner({
  data,
  authToken,
}: {
  data: any;
  authToken: string;
}) {
  try {
    const reqBanner = await fetch(fetchUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        data,
      }),
    });

    if (reqBanner.status != 200) {
      throw "Failed to post Banner.";
    }

    return { result: { id: reqBanner } };
  } catch (error) {
    return { error: error, result: null };
  }
}

export async function putBanner({
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
    const reqBanner = await fetch(fetchUrl + "/" + id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        data,
      }),
    });

    return { result: { id: reqBanner } };
  } catch (error) {
    console.log(error);
    return { error: error, result: null };
  }
}

export async function deletetBanner({
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
    console.log(error);
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
          return await getBanners({
            id: Number(req.query.id),
          });
        } else {
          return await getBanners({});
        }
      },
    },
    POST: {
      func: async (req, res) => {
        return await postBanner({ data: req.body, authToken: req.cookies.j });
      },
    },
    PUT: {
      func: async (req, res) => {
        return await putBanner({
          id: Number(req.query.id),
          data: req.body,
          authToken: req.cookies.j,
        });
      },
    },
    DELETE: {
      func: async (req, res) => {
        return await deletetBanner({
          id: Number(req.query.id),
          authToken: req.cookies.j,
        });
      },
    },
  },
});
