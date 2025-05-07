import { Document } from "../../../api/interfaces/document";
import apiRoute from "../../../api/api/apiRoute";

const fetchUrl = `${process.env.API_URL}/api/documents`;

const fetchParams = "populate=*";

export const getDocuments = async ({
  id,
  page,
  type,
  search,
  authToken,
}: {
  id?: number;
  page?: number;
  type?: string;
  search?: string;
  authToken: string;
}) => {
  if (id) {
    const request = await fetch(fetchUrl + "/" + id + "?" + fetchParams, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    const response = await request.json();
    if (!request.ok) {
      return null;
    }
    return response;
  } else {
    const pageString =
      "&pagination[pageSize]=30&pagination[page]=" + (page ?? 1);
    let filterString = "";

    if (search) {
      filterString += ``;
    }

    if (type) {
      filterString += `&filters[type][$eq]=${type}`;
    }

    const request = await fetch(
      fetchUrl +
        "?filters[deleted][$eq]=false&sort=number&" +
        fetchParams +
        pageString +
        filterString,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      },
    );

    if (!request.ok) {
      console.error(await request.text());
      return null;
    } else {
      return await request.json();
    }
  }
};

export const createDocument = async ({
  authToken,
  data,
}: {
  authToken: string;
  data: Document;
}) => {
  const request = await fetch(fetchUrl + "?" + fetchParams, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(data),
  });

  if (!request.ok) {
    console.error(await request.text());
    return null;
  } else {
    return await request.json();
  }
};

export const updateDocument = async ({
  id,
  authToken,
  data,
}: {
  id: number;
  authToken: string;
  data: Document;
}) => {
  const request = await fetch(fetchUrl + "/" + id + "?" + fetchParams, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(data),
  });

  if (!request.ok) {
    console.error(await request.text());
    return null;
  } else {
    return await request.json();
  }
};

export default apiRoute({
  authChallenge: async (req) => {
    if (!req.cookies.cj) {
      return false;
    } else {
      return true;
    }
  },
  endpoints: {
    GET: {
      func: async (req, res) => {
        return await getDocuments({
          page: Number(req.query.page as string),
          id: Number(req.query.id as string),
          search: req.query.search as string,
          type: req.query.type as string,
          authToken: req.cookies.cj,
        });
      },
    },
    POST: {
      func: async (req, res) => {
        return await createDocument({
          authToken: req.cookies.cj,
          data: req.body,
        });
      },
    },
    PUT: {
      func: async (req, res) => {
        return await updateDocument({
          id: Number(req.query.id as string),
          authToken: req.cookies.cj,
          data: req.body,
        });
      },
    },
  },
});
