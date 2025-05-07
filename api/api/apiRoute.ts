import { NextApiRequest, NextApiResponse } from "next";
import statusText from "../statustexts";

export type AuthChallenge = (req: NextApiRequest) => Promise<boolean>;
type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

type EndpointOutput<R = any> = {
  error: null | { type: string; message: string | Error };
  result: null | R;
};

type Endpoint<R = any> = {
  func: (
    req: NextApiRequest,
    res: NextApiResponse,
  ) => Promise<EndpointOutput<R>>;
};

type RequireAtLeastOne<T> = {
  [K in keyof T]: Required<Pick<T, K>> & Partial<Omit<T, K>>;
}[keyof T];

type EndpointMap = RequireAtLeastOne<Partial<Record<HttpMethod, Endpoint>>>;

/**
 * undefined endpoints will return a 501 not implemented
 */

export default function apiRoute({
  authChallenge,
  endpoints,
}: {
  authChallenge?: AuthChallenge;
  endpoints: EndpointMap;
}) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    if (authChallenge && !(await authChallenge(req))) {
      return res
        .status(401)
        .json({});
    }

    const method = req.method as HttpMethod;
    const endpoint = endpoints[method];

    if (!endpoint) {
      return res.status(501).json({ error: statusText[501] });
    }

    try {
      const result = await endpoint.func(req, res);
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error in endpoint handler:", error);
      return res.status(500).json({ error: statusText[500] });
    }
  };
}
