import { apiUrl } from "../../../../api/api/constants";
import apiRoute from "../../../../api/api/apiRoute";
import { getProducts } from "../products/fetchproducts";

const fetchUrl = `${apiUrl}/api/document-products`;

export const createDocumentProduct = async ({
  authToken,
  data,
}: {
  authToken: string;
  data: any;
}) => {
  const docProd = JSON.parse(data);

  let product;

  if (docProd.product) {
    product = (await getProducts({ authToken, id: docProd.product })).data;
  }

  const documentProduct = {
    amount: docProd.amount,
    name: product.name,
    value: product.value,
    tax: docProd.tax,
    discount: docProd.discount,
    delivered: false,
    subTotal: product.value * docProd.amount,
    taxSubTotal:
      product.value * docProd.amount -
      (product.value * docProd.amount) / (1 + docProd.tax / 100),
    product: product.id,
  };

  const request = await fetch(fetchUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({ data: documentProduct }),
  });

  if (!request.ok) {
    throw new Error("Failed to create document product");
  } else {
    return { result: await request.json() };
  }
};

export default apiRoute({
  authChallenge: async (req) => {
    if (!req.cookies.j) {
      return false;
    } else {
      return true;
    }
  },
  endpoints: {
    POST: {
      func: async (req, res) => {
        return await createDocumentProduct({
          authToken: req.cookies.j,
          data: req.body,
        });
      },
    },
    PUT: {
      func: async (req, res) => {
        return await createDocumentProduct({
          authToken: req.cookies.j,
          data: req.body,
        });
      },
    },
  },
});
