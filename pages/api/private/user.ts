import { ClientUser } from "../../../api/interfaces/client";
import { NextApiRequest, NextApiResponse } from "next";
import statusText from "../../../api/statustexts";

const fetchUrl = `${process.env.API_URL}/api/users`;

const fetchParams = "populate=user_info";

export const getUser = async ({
  self,
  id,
  authToken,
}: {
  self?: boolean;
  id?: number;
  authToken: string;
}) => {
  let request;
  if (self) {
    request = await fetch(`${fetchUrl}/me?populate=user_info`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
  } else if (id) {
    request = await fetch(fetchUrl + "/" + id + "?" + fetchParams, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
  } else {
    console.error("No id or self provided for getUser");
    return null;
  }
  if (!request.ok) {
    console.error(await request.text());
    return null;
  } else {
    return await request.json();
  }
};

export const createUser = async ({
  user,
  authToken,
}: {
  authToken: string;
  user: ClientUser;
}) => {
  console.log(user);

  return "test";
};

export const updateUser = async ({
  id,
  user,
  authToken,
}: {
  id: number;
  authToken: string;
  user: ClientUser;
}) => {
  console.log(user);

  return "test";
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
        response = await getUser({
          self: Boolean(req.query.self as string),
          id: Number(req.query.id as string),
          authToken,
        });
        break;
      case "POST":
        response = await createUser({
          user: req.body,
          authToken,
        });
        break;
      case "PUT":
        response = await updateUser({
          id: Number(req.query.id as string),
          user: req.body,
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
