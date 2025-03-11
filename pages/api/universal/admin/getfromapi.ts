import statusText from "../../../../api/statustexts";
import getAuthCookie from "../../cookies";

export async function getFromApi({
  collection,
  id,
  qs,
  authToken,
}: {
  id?: number;
  collection: string;
  qs?: string;
  authToken: string;
}) {
  try {
    console.log(
      `${process.env.API_URL}/api/${collection}${id ? `/${id}` : ""}${qs ? `?${qs}` : ""}`,
    );
    const request = await fetch(
      `${process.env.API_URL}/api/${collection}${id ? `/${id}` : ""}${qs ? `?${qs}` : ""}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      },
    );

    if (request.ok) {
      const answer = await request.json();
      return answer;
    } else {
      const answer = await request.text();
      console.log(answer);
      return false;
    }
  } catch (e) {
    console.log(e);
    return false;
  }
}

export default async function handler(req, res) {
  try {
    const authToken = getAuthCookie({ type: "admin", req });
    const collection = req.query.collection;
    const id = req.query.id;
    const qs = req.query.qs;
    const response = await getFromApi({ collection, id, qs, authToken });
    if (!response) {
      return res.status(400).json(statusText[400]);
    }

    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json(statusText[500]);
  }
}
