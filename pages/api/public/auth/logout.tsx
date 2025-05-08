import { NextApiRequest, NextApiResponse } from "next";
import statusText from "../../../../api/statustexts";

export default async function logOutClient(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  res.setHeader(
    "Set-Cookie",
    `cj="3e8uduj8923d"; HttpOnly; Path=/; Max-Age=1; SameSite=Strict`,
  );
  return res.status(200).json(statusText[200]);
}
