import { User } from "../../../api/interfaces/user";
import apiRoute from "../../../api/api/apiRoute";

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
    body: JSON.stringify({ data: user }),
  });

  if (!request.ok) {
    console.error("api/private/users", await request.text());
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
  console.log("api/private/user", fetchUrl + "/" + id);
  console.log("api/private/user", user);
  const request = await fetch(fetchUrl + "/" + id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({ user }),
  });

  if (!request.ok) {
    const ans = await request.text();
    console.error("api/private/user", ans);
    throw new Error(`api/private/user: ${ans}`);
  } else {
    const ans = await request.json();
    console.log("api/private/user", ans);
    return await ans;
  }
};

export default apiRoute({
  endpoints: {
    GET: {
      func(req, res) {
        return getUser({
          id: Number(req.query.id as string),
          self: Boolean(req.query.self as string),
          authToken: req.cookies.j,
        });
      },
    },
    POST: {
      func(req, res) {
        return createUser({
          user: req.body,
          authToken: req.cookies.j,
        });
      },
    },
    PUT: {
      func(req, res) {
        return updateUser({
          id: Number(req.query.id as string),
          user: req.body,
          authToken: req.cookies.j,
        });
      },
    },
  },
});
