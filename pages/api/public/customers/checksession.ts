import apiRoute from "../../../../api/api/apiRoute";

const fetchUrl = `${process.env.API_URL}/api/users/me?populate[role][fields][0]=description&fields=id`;

export async function checkLoggedInUser({ authToken }: { authToken: string }) {
  if (!authToken) {
    throw new Error("Missing auth token");
  }

  const request = await fetch(fetchUrl, {
    method: "GET",
    cache: "no-cache",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!request.ok) {
    throw new Error("Failed to fetch user data");
  }

  const answer = await request.json();

  if (answer.role.description != "Client") {
    throw new Error("User is not a customer");
  }

  return { result: { loggedIn: true } };
}

export default apiRoute({
 
  endpoints: {
    GET: {
      func: async (req, res) => {
        return await checkLoggedInUser({ authToken: req.cookies.cj });
      },
    },
  },
});
