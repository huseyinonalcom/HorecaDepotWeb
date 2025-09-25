import { apiUrl } from "../../../api/api/constants";
import apiRoute from "../../../api/api/apiRoute";
import { Product } from "../../../api/interfaces/product";
import { getProducts } from "./products/products";

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

  const requestedProduct = shelf.product;

  const resolveProductId = (value: unknown): number | null => {
    if (typeof value === "number") {
      return value;
    }

    if (typeof value === "object" && value && "id" in value) {
      const { id: nestedId } = value as { id?: unknown };
      if (typeof nestedId === "number") {
        return nestedId;
      }
    }

    return null;
  };

  let productId = resolveProductId(requestedProduct);

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
      Authorization: buildAuthHeader(authToken),
    },
    body: JSON.stringify({ data: shelf }),
  });

  if (!request.ok) {
    throw "Failed to update shelf";
  }

  if (!productId) {
    const productLookupToken = authToken ?? process.env.API_KEY;

    if (productLookupToken) {
      const shelfDetailsRequest = await fetch(
        `${fetchUrl}/${id}?populate[product][fields][0]=id`,
        {
          headers: {
            Authorization: buildAuthHeader(productLookupToken),
          },
        },
      );

      if (shelfDetailsRequest.ok) {
        const shelfDetails = await shelfDetailsRequest.json();
        const shelfProduct = shelfDetails?.data?.product;
        productId = resolveProductId(shelfProduct);
      }
    }
  }

  if (productId) {
    await syncProductCurrentStock(authToken, productId);
  }

  return { result: true };
};

const toSafeNumber = (value: unknown) => {
  const parsed = Number(value ?? 0);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const syncProductCurrentStock = async (
  authToken: string,
  productId: number,
) => {
  const token = authToken ?? process.env.API_KEY;

  if (!token) {
    throw "Missing authorization token";
  }

  let product: Product;

  const normalizedToken = stripBearerPrefix(token);

  try {
    product = await getProducts({
      authToken: normalizedToken,
      id: productId,
    });
  } catch (error) {
    console.error(error);
    throw "Failed to fetch product for stock synchronization";
  }

  if (!product || !Array.isArray(product.shelves)) {
    return;
  }

  const currentStock = product.shelves.reduce((total, shelf) => {
    return total + toSafeNumber(shelf?.stock);
  }, 0);

  const updateRequest = await fetch(`${apiUrl}/api/products/${productId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: buildAuthHeader(normalizedToken),
    },
    body: JSON.stringify({ data: { currentstock: currentStock } }),
  });

  if (!updateRequest.ok) {
    throw "Failed to update product current stock";
  }
};

function buildAuthHeader(token: string) {
  return hasBearerPrefix(token) ? token : `Bearer ${token}`;
}

function stripBearerPrefix(token: string) {
  return hasBearerPrefix(token) ? token.replace(/^Bearer\s+/i, "") : token;
}

function hasBearerPrefix(token: string) {
  return /^Bearer\s+/i.test(token);
}

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
