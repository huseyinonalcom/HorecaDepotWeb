import { endpoint } from "../../../../api/api/endpoint";
import { NextApiRequest, NextApiResponse } from "next";
import statusText from "../../../../api/statustexts";

const fetchUrl = `${process.env.API_URL}/api/users/me?populate[role][fields][0]=description&fields=id`;

export async function checkLoggedInUser({ authToken }: { authToken: string }) {
  if (!authToken) {
    throw new Error("Missing auth token");
  }

  const request = await fetch(fetchUrl, {
    method: "GET",
    cache: "no-cache",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!request.ok) {
    throw new Error("Failed to fetch user data");
  }

  const answer = await request.json();

  if (answer.role.description != "Client") {
    throw new Error("User is not a customer");
  }

  return { loggedIn: true };
}

const checkLoggedInUserEndpoint = endpoint<
  { authToken: string },
  { loggedIn: boolean }
>({
  methods: ["GET"],
  handler: async (input) => {
    return await checkLoggedInUser({ authToken: input.data.authToken });
  },
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  let response = null;
  try {
    response = await checkLoggedInUserEndpoint({
      method: "GET",
      data: {
        authToken: req.cookies.cj,
      },
    });

    if (response.error) {
      console.error("Error in checkLoggedInUserEndpoint", response.error);
      switch (response.error.type) {
        case "handler":
          return res.status(500).json({ error: statusText[500] });
        case "method":
          return res.status(405).json({ error: statusText[405] });
      }
    }

    return res.status(200).json(response.result);
  } catch (e) {
    console.error("Error in checkLoggedInUserEndpoint handler", response.error);
    return res.status(500).json({
      error: statusText[500],
    });
  }
}
