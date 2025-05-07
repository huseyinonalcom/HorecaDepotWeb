import { NextApiRequest, NextApiResponse } from "next";
import { endpoint } from "../../../api/api/endpoint";
import statusText from "../../../api/statustexts";

const fetchUrl = `${process.env.API_URL}/api/suppliers?fields[0]=name`;

export async function getSuppliers({ authToken }: { authToken: string }) {
  if (!authToken) {
    throw new Error("Missing auth token");
  }
  const response = await fetch(fetchUrl, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error("Failed to fetch suppliers");
  }

  return data["data"];
}

const suppliersEndpoint = endpoint<{ authToken: string }>({
  methods: ["GET"],
  handler: async (input) => {
    return await getSuppliers({ authToken: input.data.authToken });
  },
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  let response = null;
  try {
    response = await suppliersEndpoint({
      method: "GET",
      data: {
        authToken: req.cookies.j,
      },
    });

    if (response.error) {
      console.error("Error in suppliersEndpoint", response.error);
      switch (response.error.type) {
        case "handler":
          return res.status(500).json({ error: statusText[500] });
        case "method":
          return res.status(405).json({ error: statusText[405] });
        case "auth":
          return res.status(401).json({ error: statusText[401] });
        default:
          return res.status(500).json({ error: statusText[500] });
      }
    }

    return res.status(200).json(response.result);
  } catch (e) {
    console.error("Error in suppliersEndpoint handler", response.error);
    return res.status(500).json({
      error: statusText[500],
    });
  }
}
