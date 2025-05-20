import { apiUrl } from "../../../api/api/constants";
import apiRoute from "../../../api/api/apiRoute";

const fetchUrl = `${apiUrl}/api/shelves`;

export const createShelf = async ({
  shelf,
  authToken,
}: {
  authToken: string;
  shelf: {
    product: any;
    stock: number;
    establishment: any;
  };
}) => {
  throw "Not implemented yet";
};

export const udpateShelf = async ({
  id,
  shelf,
  authToken,
}: {
  id: number;
  authToken: string;
  shelf: {
    product?: any;
    stock: number;
    establishment?: any;
  };
}) => {
  if (!id || typeof id !== "number") {
    throw "No id provided.";
  }

  if (!shelf) {
    throw "No shelf provided.";
  }

  if (typeof shelf.stock !== "number") {
    throw "No stock provided.";
  }

  if ("establishment" in shelf) {
    const value = shelf.establishment;
    if (typeof value === "number") {
    } else if (typeof value === "object" && value?.id) {
      shelf.establishment = value.id;
    } else {
      throw "Invalid establishment provided. Must be a number or object with id.";
    }
  }

  if ("product" in shelf) {
    const value = shelf.product;
    if (typeof value === "number") {
    } else if (typeof value === "object" && value?.id) {
      shelf.product = value.id;
    } else {
      throw "Invalid product provided. Must be a number or object with id.";
    }
  }

  const request = await fetch(`${fetchUrl}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({ data: shelf }),
  });

  if (!request.ok) {
    throw "Failed to update shelf";
  }

  return { result: true };
};

export default apiRoute({
  endpoints: {
    POST: {
      func: async (req, res) => {
        return await createShelf({
          authToken: req.cookies.j,
          shelf: req.body,
        });
      },
    },
  },
});
