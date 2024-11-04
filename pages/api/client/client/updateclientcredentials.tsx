import { NextApiRequest, NextApiResponse } from "next";
import statusText from "../../../../api/statustexts";

export default async function putClientInfo(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "PUT") {
    const cookies = req.cookies;
    const authToken = cookies.cj;

    const client = JSON.parse(req.body);

    if (!authToken) {
      return res.status(401).json(statusText[401]);
    }

    try {
      const request = await fetch(
        `${process.env.API_URL}/api/users/${client.id}?fields=id`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            username: client.email,
            email: client.email,
          }),
        },
      );
      const answer = await request.json();

      if (!request.ok) {
        return res.status(400).json(statusText[400]);
      }

      try {
        const request = await fetch(
          `${process.env.API_URL}/api/clients/${client.client_info.id}?fields=id`,
          {
            body: JSON.stringify({
              data: {
                category: client.client_info.category,
                firstName: client.client_info.firstName,
                lastName: client.client_info.lastName,
                phone: client.client_info.phone,
                company: client.client_info.company,
                taxID: client.client_info.taxID,
              },
            }),
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
          },
        );

        const response = await request.json();

        if (!request.ok) {
          return res.status(400).json(statusText[400]);
        }

        return res.status(200).json(statusText[200]);
      } catch (error) {
        return res.status(500).json(statusText[500]);
      }
    } catch (error) {
      return res.status(500).json(statusText[500]);
    }
  } else {
    return res.status(405).json(statusText[405]);
  }
}
