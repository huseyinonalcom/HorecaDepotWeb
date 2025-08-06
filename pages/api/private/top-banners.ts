import { apiUrl } from "../../../api/api/constants";
import apiRoute from "../../../api/api/apiRoute";

const fetchUrl = `${apiUrl}/api/top-banners`;
const fetchQuery = `?populate=*`;

export async function getTopBanners({ id }: { id?: number }) {
  const response = await fetch(
    `${fetchUrl}${id ? `/${id}` : ""}${fetchQuery}&count=10000`,
    {
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
    },
  );

  const data = await response.json();
  return { result: [] };
}

export async function postTopBanner({
  data,
  authToken,
}: {
  data: any;
  authToken: string;
}) {
  return {
    error: {
      type: "Not implemented",
      message: "Not implemented",
    },
    result: null,
  };
}

export async function putTopBanner({
  id,
  data,
  authToken,
}: {
  id: number;
  data: any;
  authToken: string;
}) {
  return {
    error: {
      type: "Not implemented",
      message: "Not implemented",
    },
    result: null,
  };
}

export async function deleteTopBanner({
  id,
  authToken,
}: {
  id: number;
  authToken: string;
}) {
  return {
    error: {
      type: "Not implemented",
      message: "Not implemented",
    },
    result: null,
  };
}

export default apiRoute({
  endpoints: {
    GET: {
      func: async (req, res) => {
        if (req.query.id) {
          return await getTopBanners({
            id: Number(req.query.id),
          });
        } else {
          return await getTopBanners({});
        }
      },
    },
    POST: {
      func: async (req, res) => {
        return await postTopBanner({
          data: req.body,
          authToken: req.cookies.j,
        });
      },
    },
    PUT: {
      func: async (req, res) => {
        return await putTopBanner({
          id: Number(req.query.id),
          data: req.body,
          authToken: req.cookies.j,
        });
      },
    },
    DELETE: {
      func: async (req, res) => {
        return await deleteTopBanner({
          id: Number(req.query.id),
          authToken: req.cookies.j,
        });
      },
    },
  },
});
