import { getProductStock, updateProductStock } from "../products/productStock";
import { apiUrl } from "../../../../api/api/constants";
import apiRoute from "../../../../api/api/apiRoute";
import { getProducts } from "../products/products";
import { getDocuments } from "./universal";

const fetchUrl = `${apiUrl}/api/document-products`;

const getDocumentProduct = async ({
  authToken,
  id,
}: {
  authToken: string;
  id: number;
}) => {
  const request = await fetch(fetchUrl + "/" + id + "?populate=*", {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!request.ok) {
    throw new Error("Failed to fetch document product");
  } else {
    const answer = await request.json();
    return answer.data;
  }
};

export const createDocumentProduct = async ({
  authToken,
  data,
  documentType,
  documentId,
}: {
  authToken: string;
  data: any;
  documentType: "Commande" | "Reservation";
  documentId?: number;
}) => {
  const docProd = data;

  docProd.value = Number(docProd.value);
  docProd.amount = Number(docProd.amount);

  let product;

  if (docProd.product) {
    if (typeof docProd.product !== "number") {
      docProd.product = docProd.product.id;
    }
    product = (await getProducts({ authToken, id: docProd.product })).data;

    docProd.tax = product.tax;

    const productStock = (
      await getProductStock({
        authToken,
        id: product.id,
      })
    ).result;
    if (documentType == "Commande") {
      await updateProductStock({
        authToken,
        stock: {
          reserved: Math.max(Number(productStock.reserved), 0),
          stock: {
            store: productStock.stock.store,
            warehouse: productStock.stock.warehouse,
          },
        },
        id: product.id,
      });
    } else if (documentType == "Reservation") {
      await updateProductStock({
        authToken,
        stock: {
          reserved: Math.max(Number(productStock.reserved) + docProd.amount, 0),
          stock: {
            store: productStock.stock.store,
            warehouse: productStock.stock.warehouse,
          },
        },
        id: product.id,
      });
    }
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
    document: null,
  };

  if (documentId) {
    documentProduct.document = documentId;
  }

  const request = await fetch(fetchUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({ data: documentProduct }),
  });

  if (!request.ok) {
    const ans = await request.text();
    console.error("failed to create document product", ans);
    throw new Error("Failed to create document product");
  } else {
    return { result: await request.json() };
  }
};

export const updateDocumentProduct = async ({
  id,
  authToken,
  data,
}: {
  id: number;
  authToken: string;
  data: any;
}) => {
  const docProd = data;

  const originalDocumentProduct = await getDocumentProduct({
    authToken,
    id: id,
  });

  const relatedDocument = (
    await getDocuments({
      authToken,
      id: originalDocumentProduct.document.id,
    })
  ).data;

  let product;

  if (docProd.product) {
    if (typeof docProd.product !== "number") {
      docProd.product = docProd.product.id;
    }
    product = (await getProducts({ authToken, id: docProd.product })).data;

    const productStock = (
      await getProductStock({
        authToken,
        id: product.id,
      })
    ).result;
    if (relatedDocument.type == "Commande") {
      await updateProductStock({
        authToken,
        stock: {
          reserved: Math.max(Number(productStock.reserved), 0),
          stock: {
            store: Number(productStock.stock.store),
            warehouse: Number(productStock.stock.warehouse),
          },
        },
        id: product.id,
      });
    } else if (relatedDocument.type == "Reservation") {
      await updateProductStock({
        authToken,
        stock: {
          reserved: Math.max(
            Number(productStock.reserved) +
              Number(docProd.amount) -
              Number(originalDocumentProduct.amount),
            0,
          ),
          stock: {
            store: Number(productStock.stock.store),
            warehouse: Number(productStock.stock.warehouse),
          },
        },
        id: product.id,
      });
    }
  }

  let documentProduct = {
    amount: Number(docProd.amount),
    name: docProd.name,
    value: Number(docProd.value),
    tax: Number(docProd.tax),
    discount: Number(docProd.discount),
    delivered: docProd.delivered,
    subTotal: docProd.value * docProd.amount,
    taxSubTotal:
      docProd.value * docProd.amount -
      (docProd.value * docProd.amount) / (1 + docProd.tax / 100),
    product: null,
  };

  if (product) {
    documentProduct = {
      ...documentProduct,
      product: product.id,
    };
  }

  const request = await fetch(fetchUrl + "/" + id, {
    method: "PUT",
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

export const deleteDocumentProduct = async ({
  authToken,
  id,
}: {
  authToken: string;
  id: number;
}) => {
  const docProd = await getDocumentProduct({ authToken, id: id });

  const relatedDocument = (
    await getDocuments({
      authToken,
      id: docProd.document.id,
    })
  ).data;

  if (relatedDocument && docProd.product) {
    if (typeof docProd.product !== "number") {
      docProd.product = docProd.product.id;
    }
    const product = (await getProducts({ authToken, id: docProd.product }))
      .data;

    const productStock = (
      await getProductStock({
        authToken,
        id: product.id,
      })
    ).result;

    if (relatedDocument.type == "Commande") {
      await updateProductStock({
        authToken,
        stock: {
          reserved: Math.max(Number(productStock.reserved), 0),
          stock: {
            store: productStock.stock.store,
            warehouse: productStock.stock.warehouse,
          },
        },
        id: product.id,
      });
    } else if (relatedDocument.type == "Reservation") {
      await updateProductStock({
        authToken,
        stock: {
          reserved: Math.max(Number(productStock.reserved) - docProd.amount, 0),
          stock: {
            store: productStock.stock.store,
            warehouse: productStock.stock.warehouse,
          },
        },
        id: product.id,
      });
    }
  }

  const request = await fetch(fetchUrl + "/" + id, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!request.ok) {
    throw new Error("Failed to delete document product");
  } else {
    return { result: true };
  }
};

export default apiRoute({
 
  endpoints: {
    POST: {
      func: async (req, res) => {
        return await createDocumentProduct({
          authToken: req.cookies.j,
          data: JSON.parse(req.body),
          documentType: req.query.documentType as "Commande" | "Reservation",
        });
      },
    },
    PUT: {
      func: async (req, res) => {
        return await updateDocumentProduct({
          authToken: req.cookies.j,
          data: JSON.parse(req.body),
          id: Number(req.query.id as string),
        });
      },
    },
    DELETE: {
      func: async (req, res) => {
        return await deleteDocumentProduct({
          authToken: req.cookies.j,
          id: Number(req.query.id as string),
        });
      },
    },
  },
});
