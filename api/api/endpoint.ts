export type httpMethod = "GET" | "POST" | "PUT" | "DELETE";

export type EndpointInput<T = any> = {
  method: httpMethod;
  data: T;
};

export type EndpointOutput<R = any> = {
  error: null | { type: string; message: string | Error };
  result: null | R;
};

export const endpoint = <T = any, R = any>({
  methods,
  auth,
  handler,
}: {
  methods: httpMethod[];
  auth?: (input: EndpointInput<T>) => Promise<boolean>;
  handler: (input: EndpointInput<T>) => Promise<R>;
}) => {
  return async (input: EndpointInput<T>): Promise<EndpointOutput<R>> => {
    try {
      if (!methods.includes(input.method)) {
        return {
          error: {
            type: "method",
            message: `Method ${input.method} not allowed`,
          },
          result: null,
        };
      }
    } catch (error) {
      console.error("Error in endpoint:", error);
      return {
        error: {
          type: "method",
          message: `Unknown method error`,
        },
        result: null,
      };
    }

    if (auth) {
      try {
        const isAuthorized = await auth(input);
        if (!isAuthorized) {
          return {
            error: { type: "auth", message: "Unauthorized" },
            result: null,
          };
        }
      } catch (err) {
        return {
          error: {
            type: "auth",
            message: err instanceof Error ? err : String(err),
          },
          result: null,
        };
      }
    }

    try {
      const result = await handler(input);
      return {
        error: null,
        result,
      };
    } catch (err) {
      return {
        error: {
          type: "handler",
          message: err instanceof Error ? err : String(err),
        },
        result: null,
      };
    }
  };
};
