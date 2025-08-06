import apiRoute from "../../../../api/api/apiRoute";

const fetchUrl = `${process.env.API_URL}/api/users/me?populate[0]=client_info&populate[client_info][populate][0]=addresses`;

export async function getSelfCustomer({ authToken }: { authToken: string }) {
  const request = await fetch(fetchUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!request.ok) {
    throw new Error("Failed to fetch user data");
  }

  const answer = await request.json();

  return answer;
}

export default apiRoute({
  endpoints: {
    GET: {
      func: async (req, res) => {
        return await getSelfCustomer({ authToken: req.cookies.cj });
      },
    },
  },
});
