import { Client } from "../../../api/interfaces/client";
import { NextApiRequest, NextApiResponse } from "next";
import statusText from "../../../api/statustexts";
import { createUser } from "./user";
import { randomBytes } from "crypto";

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
  let request;
  if (id) {
    request = await fetch(fetchUrl + "/" + id + "?" + fetchParams, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
  } else {
    const pageString =
      "&pagination[pageSize]=30&pagination[page]=" + (page ?? 1);
    let searchString = "";

    if (search) {
      searchString = `&filters[$or][0][firstName][$containsi]=${search}&filters[$or][1][lastName][$containsi]=${search}&filters[$or][2][login][email][$containsi]=${search}&filters[$or][3][company][$containsi]=${search}`;
    }

    request = await fetch(
      fetchUrl +
        "?filters[deleted][$eq]=false&sort=firstName&" +
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
  }

  if (!request.ok) {
    console.error(await request.text());
    return null;
  } else {
    return await request.json();
  }
};

export const createCustomer = async ({
  customer,
  authToken,
}: {
  authToken: string;
  customer: Client;
}) => {
  const request = await fetch(fetchUrl + "?" + fetchParams, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({ data: customer }),
  });

  if (!request.ok) {
    console.error(await request.text());
    return null;
  } else {
    const answer = await request.json();

    try {
      const reqUser = await createUser({
        user: {
          email: customer.email,
          client_info: answer.data.id,
          username: customer.email,
          password: randomBytes(16).toString("hex"),
          // @ts-expect-error
          role: 14,
        },
        authToken,
      });

      if (!reqUser) {
        const answer = await request.json();
      }
    } catch (e) {
      console.error(e);
    }

    return { result: answer };
  }
};

export const updateCustomer = async ({
  id,
  customer,
  authToken,
}: {
  id: number;
  authToken: string;
  customer: Client;
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

    if (!response) {
      return res.status(500).json(statusText[500]);
    }

    return res.status(200).json(response);
  } catch (e) {
    console.error(e);
    return res.status(500).json(statusText[500]);
  }
}
