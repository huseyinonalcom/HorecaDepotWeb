import { NextApiRequest, NextApiResponse } from "next";
import statusText from "../../../../api/statustexts";
import { endpoint } from "../../../../api/api/endpoint";

const fetchUrl = `${process.env.API_URL}/api/users/me?populate[role][fields][0]=name&fields=id`;
const validRoles = [7, 8, 9];

export async function checkLoggedInUserAdmin({
  authToken,
}: {
  authToken: string;
}) {
  if (!authToken) {
    throw new Error("Missing auth token");
  }

  const request = await fetch(fetchUrl, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!request.ok) {
    throw new Error("Failed to fetch user data");
  }

  const answer = await request.json();

  const roleName = answer.role.name.replaceAll("Tier ", "");
  if (!validRoles.includes(Number(roleName))) {
    throw new Error("Unauthorized role");
  }

  return { role: answer.role.name };
}

const checkLoggedInUserAdminEndpoint = endpoint<
  { authToken: string },
  { role: string }
>({
  methods: ["GET"],
  handler: async (input) => {
    return await checkLoggedInUserAdmin({ authToken: input.data.authToken });
  },
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  let response = null;
  if (req.method === "GET") {
    try {
      response = await checkLoggedInUserAdminEndpoint({
        method: "GET",
        data: {
          authToken: req.cookies.j,
        },
      });

      if (response.error) {
        if (response.error.type === "auth") {
          return res.status(401).json({ error: statusText[401] });
        }
        return res.status(500).json({ error: statusText[500] });
      }

      return res.status(200).json(response.result);
    } catch (e) {
      return res.status(500).json({
        error: statusText[500],
      });
    }
  }

  return res.status(405).json({ error: statusText[405], result: null });
}
