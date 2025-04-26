import { NextApiRequest, NextApiResponse } from "next";
import statusText from "../../../api/statustexts";
import { User } from "../../../api/interfaces/user";

const fetchUrl = `${process.env.API_URL}/api/users`;

const fetchParams = "populate=user_info,client_info";

export const getUser = async ({
  id,
  self,
  authToken,
}: {
  id?: number;
  self?: boolean;
  authToken: string;
}) => {
  let request;
  if (self) {
    request = await fetch(`${fetchUrl}/me?${fetchParams}`, {
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
  user: User;
  authToken: string;
}) => {
  const request = await fetch(fetchUrl + "?" + fetchParams, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(user),
  });

  if (!request.ok) {
    console.error(await request.text());
    return null;
  } else {
    return await request.json();
  }
};

export const updateUser = async ({
  id,
  user,
  authToken,
}: {
  id: number;
  user: User;
  authToken: string;
}) => {
  const request = await fetch(fetchUrl + "/" + id + "?" + fetchParams, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(user),
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
