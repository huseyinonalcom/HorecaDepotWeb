import { apiUrl } from "../../../../api/api/constants";
import apiRoute from "../../../../api/api/apiRoute";
import {
  createDocumentProduct,
  deleteDocumentProduct,
  updateDocumentProduct,
} from "./documentproducts";

const fetchUrl = `${apiUrl}/api/documents`;

const fetchParams =
  "populate[document_products][fields]=*&populate[client][fields]=*&populate[establishment][fields]=*&populate[delAddress][fields]=*&populate[docAddress][fields]=*&populate[docAddress][fields]=*&populate[payments][fields]=*&populate[document_products][populate][0]=product&populate[document_products][populate][product][populate][0]=product_extra";

export const getDocuments = async ({
  id,
  page,
  type,
  search,
  authToken,
}: {
  id?: number;
  page?: number;
  type?: string;
  search?: string;
  authToken: string;
}) => {
  if (id) {
    const request = await fetch(fetchUrl + "/" + id + "?" + fetchParams, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });
    const response = await request.json();
    if (!request.ok) {
      return null;
    }
    return response;
  } else {
    const pageString =
      "&pagination[pageSize]=30&pagination[page]=" + (page ?? 1);
    let filterString = "";

    if (search) {
      filterString += ``;
    }

    if (type) {
      filterString += `&filters[type][$eqi]=${type}`;
    }

    const request = await fetch(
      fetchUrl +
        "?sort=number:DESC&filters[deleted][$eq]=false&sort=number&" +
        fetchParams +
        pageString +
        filterString,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      },
    );

    if (!request.ok) {
      console.error(await request.text());
      return null;
    } else {
      const data = await request.json();
      return data;
    }
  }
};

export const updateDocument = async ({
  authToken,
  id,
  updatedDocument,
}: {
  authToken: string;
  id: number;
  updatedDocument: any;
}) => {
  if (!id) {
    throw "No id provided.";
  }
  const documentToUpdate = (await getDocuments({ authToken, id: id })).data;
  if (!documentToUpdate) {
    throw "No document found";
  }

  try {
    updatedDocument.document_products.forEach(async (docProd) => {
      if (docProd.id) {
        await updateDocumentProduct({
          authToken,
          id: docProd.id,
          data: docProd,
        });
      } else {
        await createDocumentProduct({
          authToken,
          data: docProd,
          documentType: updatedDocument.type,
          documentId: id,
        });
      }
    });

    documentToUpdate.document_products.forEach(async (docProd) => {
      if (
        !updatedDocument.document_products.find((prod) => prod.id == docProd.id)
      ) {
        await deleteDocumentProduct({ authToken, id: docProd.id });
      }
    });

    const request = await fetch(`${fetchUrl}/${documentToUpdate.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ data: updatedDocument }),
    });

    if (!request.ok) {
      throw "Failed to update document";
    }

    return { result: true };
  } catch (error) {
    return { error: error, result: null };
  }
};

export const deleteDocument = async ({
  authToken,
  id,
}: {
  authToken: string;
  id: number;
}) => {
  if (!id) {
    throw "No id provided.";
  }
  const documentToDelete = (await getDocuments({ authToken, id: id })).data;
  if (!documentToDelete) {
    throw "No document found";
  }

  try {
    await Promise.all(
      documentToDelete.document_products.map((docProd) =>
        deleteDocumentProduct({ authToken, id: docProd.id }),
      ),
    );

    const request = await fetch(`${fetchUrl}/${documentToDelete.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!request.ok) {
      throw "Failed to delete document";
    }

    return { result: true };
  } catch (error) {
    return { error: error, result: null };
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
    GET: {
      func: async (req, res) => {
        return await getDocuments({
          page: Number(req.query.page as string),
          id: Number(req.query.id as string),
          search: req.query.search as string,
          type: req.query.type as string,
          authToken: req.cookies.j,
        });
      },
    },
    DELETE: {
      func: async (req, res) => {
        return await deleteDocument({
          authToken: req.cookies.j,
          id: Number(req.query.id as string),
        });
      },
    },
    PUT: {
      func: async (req, res) => {
        return await updateDocument({
          authToken: req.cookies.j,
          id: Number(req.query.id as string),
          updatedDocument: req.body,
        });
      },
    },
  },
});
