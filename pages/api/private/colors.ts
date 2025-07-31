import { Color } from "../../../api/interfaces/color";
import { apiUrl } from "../../../api/api/constants";
import apiRoute from "../../../api/api/apiRoute";

export async function getColor({
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
    const fetchUrl = `${apiUrl}/api/product-colors/${id}`;
    const reqColor = await fetch(fetchUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });

    return { result: reqColor };
  } catch (error) {
    return { error: error, result: null };
  }
}

export async function getColors({ authToken }: { authToken: string }) {
  try {
    const fetchUrl = `${process.env.API_URL}/api/product-colors`;
    const reqColor = await fetch(fetchUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });

    return { result: (await reqColor.json()).data };
  } catch (error) {
    return { error: error, result: null };
  }
}

export async function postColor({
  color,
  authToken,
}: {
  color: Color;
  authToken: string;
}) {
  try {
    const fetchUrl = `${process.env.API_URL}/api/product-colors`;
    const reqColor = await fetch(fetchUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        data: {
          name: color.name.trim(),
          code: color.code.trim().toUpperCase(),
          image: color.image?.id,
        },
      }),
    });

    if (reqColor.status != 200) {
      throw "Failed to post color.";
    }

    return { result: { id: reqColor } };
  } catch (error) {
    return { error: error, result: null };
  }
}

export async function putColor({
  id,
  color,
  authToken,
}: {
  id: number;
  color: Color;
  authToken: string;
}) {
  if (!id) {
    throw "No id provided.";
  }

  try {
    const fetchUrl = `${process.env.API_URL}/api/product-colors/${id}`;
    const reqColor = await fetch(fetchUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        data: {
          name: color.name.trim(),
          code: color.code.trim().toUpperCase(),
          image: color.image.id,
        },
      }),
    });

    return { result: { id: reqColor } };
  } catch (error) {
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
          return await getColor({
            id: Number(req.query.id),
            authToken: req.cookies.j,
          });
        } else {
          return await getColors({ authToken: req.cookies.j });
        }
      },
    },
    POST: {
      func: async (req, res) => {
        return await postColor({ color: req.body, authToken: req.cookies.j });
      },
    },
    PUT: {
      func: async (req, res) => {
        return await putColor({
          id: Number(req.query.id),
          color: req.body,
          authToken: req.cookies.j,
        });
      },
    },
  },
});
