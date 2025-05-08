import { apiUrl } from "../../../../api/api/constants";
import apiRoute from "../../../../api/api/apiRoute";

const fetchUrl = `${apiUrl}/api/users/me?populate[role][fields][0]=name&fields=id`;
const validRoles = [7, 8, 9];

export async function checkLoggedInUserAdmin({
  authToken,
}: {
  authToken: string;
}) {
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

  return { result: { role: answer.role.name } };
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
        return await checkLoggedInUserAdmin({ authToken: req.cookies.j });
      },
    },
  },
});
