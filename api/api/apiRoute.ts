import { NextApiRequest, NextApiResponse } from "next";
import statusText from "../statustexts";

export type AuthChallenge = (req: NextApiRequest) => Promise<boolean>;

export type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

type EndpointOutput<R = any> = {
  error?: undefined | null | { type: string; message: string | Error };
  result: undefined | null | R;
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

export default function apiRoute({ endpoints }: { endpoints: EndpointMap }) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
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
