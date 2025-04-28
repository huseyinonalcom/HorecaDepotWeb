import { Address } from "../../../api/interfaces/address";
import { NextApiRequest, NextApiResponse } from "next";
import statusText from "../../../api/statustexts";

const fetchUrl = `${process.env.API_URL}/api/addresses`;

export const getAddress = async ({
  id,
  authToken,
}: {
  id?: number;
  authToken: string;
}) => {
  let request;
  if (id) {
    request = await fetch(fetchUrl + "/" + id, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
  } else {
    return null;
  }

  if (!request.ok) {
    console.error(await request.text());
    return null;
  } else {
    return await request.json();
  }
};

export const createAddress = async ({
  address,
  authToken,
}: {
  authToken: string;
  address: Address;
}) => {
  const request = await fetch(fetchUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(address),
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
        response = await getAddress({
          id: Number(req.query.id as string),
          authToken,
        });
        break;
      case "POST":
        response = await createAddress({
          address: req.body,
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
