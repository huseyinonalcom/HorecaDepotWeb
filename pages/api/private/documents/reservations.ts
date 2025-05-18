import { getLastDocumentNumber as getNewDocumentNumber } from "./getlastdocumentnumber";
import { createDocumentProduct } from "./documentproducts";
import { apiUrl } from "../../../../api/api/constants";
import apiRoute from "../../../../api/api/apiRoute";
import { createCustomer } from "../customers";
import { getUser } from "../user";

const fetchUrl = `${apiUrl}/api/documents`;

export const createReservation = async ({
  authToken,
  data,
}: {
  authToken: string;
  data: any;
}) => {
  let { document } = JSON.parse(data);
  if (document.type != "Reservation") {
    throw new Error("Invalid document type");
  }

  if (!document.documentProducts) {
    throw new Error("No document products");
  }

  if (!document.customer) {
    throw new Error("No customer");
  }

  document.user = (
    await getUser({ self: true, authToken: authToken })
  ).user_info.id;

  if (!document.customer.id || document.customer.id == 0) {
    document.client = (
      await createCustomer({
        authToken,
        customer: document.customer.client_info,
      })
    ).result.data.id;
  } else {
    document.client = document.customer.id;
  }

  const createPromises = document.documentProducts.map((dp) =>
    createDocumentProduct({
      authToken,
      documentType: "Reservation",
      data: JSON.stringify({
        id: `new`,
        amount: dp.amount,
        tax: 21,
        discount: 0,
        product: dp.id,
      }),
    }).then((res) => res.result.data.id),
  );

  const postedDocumentProducts = await Promise.all(createPromises);
  document = {
    ...document,
    document_products: postedDocumentProducts,
    prefix: "RES-",
    number: (await getNewDocumentNumber({ authToken, type: "Reservation" }))
      .result,
    date: new Date().toISOString().split("T")[0],
    phase: 1,
  };

  delete document.customer;
  delete document.documentProducts;

  const request = await fetch(fetchUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({ data: document }),
  });

  if (!request.ok) {
    console.error(await request.text());
    throw new Error("Failed to create reservation");
  } else {
    const answer = await request.json();
    return { result: answer };
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
        return await createReservation({
          authToken: req.cookies.j,
          data: req.body,
        });
      },
    },
  },
});
