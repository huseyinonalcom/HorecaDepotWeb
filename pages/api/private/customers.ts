import { NextApiRequest, NextApiResponse } from "next";
import statusText from "../../../api/statustexts";
import { ClientUser } from "../../../api/interfaces/client";

const fetchUrl = `${process.env.API_URL}/api/clients`;

const fetchParams = "populate=addresses,login";

export const getCustomers = async ({
  id,
  page,
  search,
  authToken,
}: {
  id?: number;
  page?: number;
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
    const pageString = "&pagination[page]=" + (page ?? 1);
    let searchString = "";

    if (search) {
      searchString = `&pagination[pageSize]=30&sort=firstName&filters[$or][0][firstName][$containsi]=${search}&filters[$or][1][lastName][$containsi]=${search}&filters[$or][2][email][$containsi]=${search}`;
    }

    const request = await fetch(
      fetchUrl +
        "?filters[deleted][$eq]=false&" +
        fetchParams +
        pageString +
        searchString,
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

export const createCustomer = async ({
  customer,
  authToken,
}: {
  authToken: string;
  customer: ClientUser;
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

export const updateCustomer = async ({
  id,
  customer,
  authToken,
}: {
  id: number;
  authToken: string;
  customer: ClientUser;
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
        response = await getCustomers({
          page: Number(req.query.page as string),
          search: req.query.search as string,
          id: Number(req.query.id as string),
          authToken,
        });
        break;
      case "POST":
        response = await createCustomer({
          customer: req.body,
          authToken,
        });
        break;
      case "PUT":
        response = await updateCustomer({
          id: Number(req.query.id as string),
          customer: req.body,
          authToken,
        });
        break;
    }

    console.log(JSON.stringify(response));

    if (!response) {
      return res.status(500).json(statusText[500]);
    }

    return res.status(200).json(response);
  } catch (e) {
    console.error(e);
    return res.status(500).json(statusText[500]);
  }
}
