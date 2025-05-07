import { NextApiRequest, NextApiResponse } from "next";
import statusText from "../../../../api/statustexts";
import { endpoint } from "../../../../api/api/endpoint";

const fetchUrl = `${process.env.API_URL}/api/users/me?populate[0]=client_info&populate[client_info][populate][0]=addresses`;

export async function getSelfCustomer({ authToken }: { authToken: string }) {
  if (!authToken) {
    throw new Error("Missing auth token");
  }

  const request = await fetch(fetchUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!request.ok) {
    throw new Error("Failed to fetch user data");
  }

  const answer = await request.json();

  return answer;
}

const getSelfCustomerEndpoint = endpoint<{ authToken: string }>({
  methods: ["GET"],
  handler: async (input) => {
    return await getSelfCustomer({ authToken: input.data.authToken });
  },
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  let response = null;
  try {
    response = await getSelfCustomerEndpoint({
      method: "GET",
      data: {
        authToken: req.cookies.cj,
      },
    });

    if (response.error) {
      console.error("Error in getSelfCustomerEndpoint", response.error);
      switch (response.error.type) {
        case "handler":
          return res.status(500).json({ error: statusText[500] });
        case "method":
          return res.status(405).json({ error: statusText[405] });
      }
    }

    return res.status(200).json(response.result);
  } catch (e) {
    console.error("Error in getSelfCustomerEndpoint handler", response.error);
    return res.status(500).json({
      error: statusText[500],
    });
  }
}
