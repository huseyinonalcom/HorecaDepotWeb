import statusText from "../../../../api/statustexts";

const fetchUrl = `${process.env.API_URL}/api/suppliers`;
const fetchUrl2 = `?fields[0]=name`;

export async function getAllSuppliers(req) {
  const cookies = req.cookies;
  const authToken = cookies.j;
  try {
    const response = await fetch(fetchUrl + fetchUrl2, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    const data = await response.json();


    if (!response.ok) {
      return null;
    }
    return data["data"];
  } catch (error) {
    return null;
  }
}

export default async function handler(req, res) {
  try {
    const response = await getAllSuppliers(req);

    if (!response) {
      return res.status(500).json(statusText[500]);
    }

    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json(statusText[500]);
  }
}
