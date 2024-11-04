import { NextApiRequest } from "next";

export default function getAuthCookie({
  type,
  req,
}: {
  type: "admin" | "public";
  req: NextApiRequest;
}) {
  if (type === "admin") {
    const cookies = req.cookies;
    const authToken = cookies.j;
    return authToken;
  } else if (type === "public") {
    const cookies = req.cookies;
    const authToken = cookies.cj;
    return authToken;
  }
}
