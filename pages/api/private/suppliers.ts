import apiRoute from "../../../api/api/apiRoute";

const fetchUrl = `${process.env.API_URL}/api/suppliers?fields[0]=name`;

export async function getSuppliers({ authToken }: { authToken: string }) {
  console.log("get suppliers");
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

export default apiRoute({
  authChallenge: async (req) => {
    if (!req.cookies.j) {
      return false;
    }
    return true;
  },
  endpoints: {
    GET: {
      func: async (req, res) => {
        console.log("cookies", req.cookies);
        return await getSuppliers({ authToken: req.cookies.j });
      },
    },
  },
});
