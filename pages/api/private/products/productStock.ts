import { apiUrl } from "../../../../api/api/constants";
import apiRoute from "../../../../api/api/apiRoute";
import { updateProduct } from "./products";
import { udpateShelf } from "../shelves";

const fetchUrl = `${apiUrl}/api/products`;

export const getProductStock = async ({
  authToken,
  id,
}: {
  authToken: string;
  id: number;
}) => {
  if (!id) {
    throw "No id provided.";
  }

  const request = await fetch(
    `${fetchUrl}/${id}?populate[shelves][fields][0]=stock&populate[shelves][populate][establishment][fields][0]=id&fields[0]=reserved`,
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    },
  );

  if (!request.ok) {
    throw "Failed to fetch products";
  }

  const response = await request.json();

  return {
    result: {
      reserved: Number(response.data.reserved),
      stock: {
        store: response.data.shelves.find(
          (shelf) => shelf.establishment.id == 1,
        ).stock,
        warehouse: response.data.shelves.find(
          (shelf) => shelf.establishment.id == 3,
        ).stock,
      },
    },
  };
};

export async function updateProductStock({
  id,
  authToken,
  stock,
}: {
  id: number;
  authToken: string;
  stock: {
    reserved: number;
    stock: {
      store: number;
      warehouse: number;
    };
  };
}) {
  if (!id) {
    throw "No id provided.";
  }

  const productRequest = await fetch(
    `${fetchUrl}/${id}?populate[shelves][fields][0]=stock&populate[shelves][populate][establishment][fields][0]=id&fields[0]=reserved`,
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    },
  );

  if (!productRequest.ok) {
    throw "Failed to fetch products";
  }

  const product = (await productRequest.json()).data;

  let errors = [];

  await updateProduct({
    authToken,
    id: product.id,
    data: {
      reserved: Number(stock.reserved),
      currentstock: Number(stock.stock.store) + Number(stock.stock.warehouse),
    },
  }).catch((error) => {
    console.error(error);
    errors.push(error);
  });

  product.shelves.forEach(async (shelf) => {
    if (shelf.establishment.id == 1) {
      await udpateShelf({
        id: shelf.id,
        authToken,
        shelf: {
          stock: stock.stock.store,
        },
      }).catch((error) => {
        errors.push(error);
      });
    } else if (shelf.establishment.id == 3) {
      await udpateShelf({
        id: shelf.id,
        authToken,
        shelf: {
          stock: stock.stock.warehouse,
        },
      }).catch((error) => {
        errors.push(error);
      });
    }
  });

  if (errors.length > 0) {
    console.error(errors);
    throw new Error("Failed to update product");
  } else {
    return { result: true };
  }
}

export default apiRoute({
  endpoints: {
    GET: {
      func: async (req, res) => {
        return await getProductStock({
          authToken: req.cookies.j,
          id: Number(req.query.id as string),
        });
      },
    },
    PUT: {
      func: async (req, res) => {
        return await updateProductStock({
          authToken: req.cookies.j,
          stock: req.body,
          id: Number(req.query.id as string),
        });
      },
    },
  },
});
