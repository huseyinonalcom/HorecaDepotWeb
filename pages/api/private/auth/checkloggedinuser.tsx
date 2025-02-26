import { NextApiRequest, NextApiResponse } from "next";
import statusText from "../../../../api/statustexts";

const fetchUrl = `${process.env.API_URL}/api/users/me?populate[role][fields][0]=name&fields=id`;

const validRoles = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

export default async function checkLoggedInUserAdmin(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    const cookies = req.cookies;
    const authToken = cookies.j;

    if (!authToken) {
      return res.status(401).json(statusText[401]);
    }

    try {
      const request = await fetch(fetchUrl, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!request.ok) {
        return res.status(400).json(statusText[400]);
      }

      const answer = await request.json();

      if (
        !validRoles.includes(Number(answer.role.name.replaceAll("Tier ", "")))
      ) {
        return res.status(404).json(statusText[404]);
      }

      return res.status(200).json({ role: answer.role.name });
    } catch (error) {
      return res.status(500).json(statusText[500]);
    }
  } else {
    return res.status(405).json(statusText[405]);
  }
}
