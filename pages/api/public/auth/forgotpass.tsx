import { apiUrl } from "../../../../api/api/constants";
import apiRoute from "../../../../api/api/apiRoute";

const fetchUrl = `${apiUrl}/api/public/auth/forgot-password`;

export async function forgotPassword({ email }: { email: string }) {
  const request = await fetch(fetchUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${process.env.API_KEY}`,
    },
    body: JSON.stringify({
      email: email,
    }),
  });

  if (!request.ok) {
    throw new Error("Failed to fetch user data");
  }

  const answer = await request.json();

  return { result: answer };
}

export default apiRoute({
  endpoints: {
    POST: {
      func: async (req, res) => {
        return await forgotPassword({ email: req.body.email });
      },
    },
  },
});
