import { NextApiRequest, NextApiResponse } from "next";
import statusText from "../../../../api/statustexts";

export default async function logOutAdmin(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  res.setHeader(
    "Set-Cookie",
    `j="3e8uduj8923d"; HttpOnly; Path=/; Max-Age=-1; SameSite=Strict`,
  );
  return res.status(200).json(statusText[200]);
}
