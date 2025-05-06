import { checkLoggedInUserAdmin } from "../../pages/api/private/auth/checkloggedinuser";
import { NextApiRequest, NextApiResponse } from "next";
import { httpMethod } from "./endpoint";
import statusText from "../statustexts";

type HandlerFunction = (
  req: NextApiRequest,
  res: NextApiResponse,
) => Promise<void> | void;

export const requestHandler = <T = any, R = any>({
  handlers,
}: {
  handlers: Record<httpMethod, HandlerFunction>;
}) => {
  return (req: NextApiRequest, res: NextApiResponse) => {
    const method = req.method as httpMethod;

    if (!handlers[method]) {
      return res
        .status(405)
        .json({ error: { type: "method", message: "Method not allowed" } });
    }

    try {
      handlers[method](req, res);
    } catch (error) {
      console.error("Error in request handler:", error);
      return res.status(500).json({ error: statusText[500] });
    }
  };
};

export const adminHandler = <T = any, R = any>({
  handlers,
}: {
  handlers: Record<httpMethod, HandlerFunction>;
}) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const authToken = req.cookies.j;

    try {
      const adminCheck = await checkLoggedInUserAdmin({ authToken });
      if (!adminCheck) {
        return res
          .status(401)
          .json({ error: { type: "auth", message: "Unauthorized" } });
      }
      requestHandler({ handlers })(req, res);
    } catch (error) {
      console.error("Admin check failed:", error);
      return res
        .status(401)
        .json({ error: { type: "auth", message: "Unauthorized" } });
    }
  };
};

export const customerHandler = <T = any, R = any>({
  handlers,
}: {
  handlers: Record<httpMethod, HandlerFunction>;
}) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const authToken = req.cookies.j;

    try {
      const adminCheck = await checkLoggedInUserAdmin({ authToken });
      if (!adminCheck) {
        return res
          .status(401)
          .json({ error: { type: "auth", message: "Unauthorized" } });
      }
      requestHandler({ handlers })(req, res);
    } catch (error) {
      console.error("Admin check failed:", error);
      return res
        .status(401)
        .json({ error: { type: "auth", message: "Unauthorized" } });
    }
  };
};