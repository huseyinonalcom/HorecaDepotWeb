import { apiUrl } from "../../../api/api/constants";
import apiRoute from "../../../api/api/apiRoute";

const fetchUrl = `${apiUrl}/api/home-page`;

export const getHomepage = async ({}) => {
  const request = await fetch(fetchUrl, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.API_KEY}`,
    },
  });

  if (!request.ok) {
    console.error(await request.text());
    throw new Error("Could not get homepage");
  } else {
    return (await request.json()).data;
  }
};

export const updateHomepage = async ({
  homepage,
  authToken,
}: {
  homepage: any;
  authToken: string;
}) => {
  const request = await fetch(fetchUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({ data: homepage }),
  });

  if (!request.ok) {
    console.error(await request.text());
    return null;
  } else {
    return await request.json();
  }
};

export default apiRoute({
  endpoints: {
    GET: {
      func() {
        return getHomepage({});
      },
    },
    PUT: {
      func(req) {
        return updateHomepage({
          homepage: req.body,
          authToken: req.cookies.j,
        });
      },
    },
  },
});
