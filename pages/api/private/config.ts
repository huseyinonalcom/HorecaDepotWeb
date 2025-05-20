import { apiUrl } from "../../../api/api/constants";
import apiRoute from "../../../api/api/apiRoute";

const fetchUrl = `${apiUrl}/api/config`;

export async function getConfig({ authToken }: { authToken: string }) {
  const response = await fetch(fetchUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    const ans = await response.text();
    throw new Error("Error fetching config");
  }
  const ans = await response.json();

  return { result: ans.data.data };
}

export async function updateConfig({
  authToken,
  config,
}: {
  authToken: string;
  config: any;
}) {
  const response = await fetch(fetchUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      data: {
        data: config,
      },
    }),
  });
  const ans = await response.json();

  if (!response.ok) {
    throw new Error("Error updating config");
  }

  return { result: ans };
}

export default apiRoute({
  authChallenge: async (req) => {
    if (!req.cookies.j) {
      return false;
    } else {
      return true;
    }
  },
  endpoints: {
    GET: {
      func: async (req, res) => {
        return await getConfig({ authToken: req.cookies.j });
      },
    },
    PUT: {
      func: async (req, res) => {
        return await updateConfig({
          authToken: req.cookies.j,
          config: req.body,
        });
      },
    },
  },
});
