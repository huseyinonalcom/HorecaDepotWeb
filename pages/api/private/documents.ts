import { NextApiRequest, NextApiResponse } from "next";
import statusText from "../../../api/statustexts";
import { ClientUser } from "../../../api/interfaces/client";
import { DocumentProduct } from "../../../api/interfaces/documentProduct";

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
  customer,
  authToken,
  documentProducts,
}: {
  authToken: string;
  customer: ClientUser;
  documentProducts: DocumentProduct[];
}) => {
  const request = await fetch(fetchUrl + "?" + fetchParams, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(customer),
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
  customer,
  authToken,
  documentProducts,
}: {
  id: number;
  authToken: string;
  customer: ClientUser;
  documentProducts: DocumentProduct[];
}) => {
  const request = await fetch(fetchUrl + "/" + id + "?" + fetchParams, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(customer),
  });

  if (!request.ok) {
    console.error(await request.text());
    return null;
  } else {
    return await request.json();
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (!req.cookies.j) {
      return res.status(401).json(statusText[401]);
    }
    const authToken = req.cookies.j;
    let response;
    switch (req.method) {
      case "GET":
        response = await getDocuments({
          page: Number(req.query.page as string),
          search: req.query.search as string,
          id: Number(req.query.id as string),
          type: req.query.type as string,
          authToken,
        });
        break;
      case "POST":
        response = await createDocument({
          customer: req.body.customer,
          documentProducts: req.body.documentProducts,
          authToken,
        });
        break;
      case "PUT":
        response = await updateDocument({
          id: Number(req.query.id as string),
          customer: req.body.customer,
          documentProducts: req.body.documentProducts,
          authToken,
        });
        break;
    }

    console.log(response);

    if (!response) {
      return res.status(500).json(statusText[500]);
    }

    return res.status(200).json(response);
  } catch (e) {
    console.error(e);
    return res.status(500).json(statusText[500]);
  }
}
