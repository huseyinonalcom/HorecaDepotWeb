import { apiUrl } from "../../../../api/api/constants";
import apiRoute from "../../../../api/api/apiRoute";
import products, { getProducts, updateProduct } from "../products/products";
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
    return await request.json();
  }
};

export const createDocumentProduct = async ({
  authToken,
  data,
  documentType,
}: {
  authToken: string;
  data: any;
  documentType: "Commande" | "Reservation";
}) => {
  const docProd = JSON.parse(data);

  let product;

  if (docProd.product) {
    product = (await getProducts({ authToken, id: docProd.product })).data;
    if (documentType == "Commande") {
      // reduce product stock by amount
    } else if (documentType == "Reservation") {
      // increase product reserved stock by amount
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

export const updateDocumentProduct = async ({
  id,
  authToken,
  data,
}: {
  id: number;
  authToken: string;
  data: any;
}) => {
  const docProd = JSON.parse(data);

  const originalDocumentProduct = await getDocumentProduct({
    authToken,
    id: id,
  });

  const relatedDocument = await getDocuments({ authToken, id: id });

  let product;

  if (docProd.product) {
    product = (await getProducts({ authToken, id: docProd.product })).data;
    if (relatedDocument.type == "Commande") {
      // updated document product amount - original document product amount
      // reduce product stock by amount
    } else if (relatedDocument.type == "Reservation") {
      // updated document product amount - original document product amount
      // increase product reserved stock by amount
      await updateProduct({
        authToken,
        data: {
          reserved:
            product.reserved + docProd.amount - originalDocumentProduct.amount,
        },
        id: docProd.id,
      });
    }
  }

  let documentProduct = {
    amount: docProd.amount,
    name: docProd.name,
    value: docProd.value,
    tax: docProd.tax,
    discount: docProd.discount,
    delivered: false,
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

export const deleteDocumentProduct = async ({
  authToken,
  id,
}: {
  authToken: string;
  id: number;
}) => {
  /**
   * fetch related document
   * find related product
   * if document is reservation
   *   decrease product reserved stock by amount
   * if document is commande
   *   increase product stock by amount
   * delete document product
   */
  const documentProduct = await getDocumentProduct({ authToken, id: id });
  const document = getDocuments({ authToken, id: documentProduct.document.id });
  const product = await getProducts({
    authToken,
    id: documentProduct.product.id,
  });
  /*   const request = await fetch(fetchUrl + "/" + id, {
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
  } */
  return { result: true };
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
          documentType: req.query.documentType as "Commande" | "Reservation",
        });
      },
    },
    PUT: {
      func: async (req, res) => {
        return await updateDocumentProduct({
          authToken: req.cookies.j,
          data: req.body,
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
