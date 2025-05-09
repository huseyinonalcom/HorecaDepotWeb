import apiRoute from "../../../../api/api/apiRoute";
import { apiUrl } from "../../../../api/api/constants";
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
  const { document } = JSON.parse(data);
  if (document.type != "Reservation") {
    throw new Error("Invalid document type");
  }

  if (!document.documentProducts) {
    throw new Error("No document products");
  }

  if (!document.customer) {
    throw new Error("No customer");
  }

  document.user = (await getUser({ self: true, authToken: authToken })).id;

  if (!document.customer.id || document.customer.id == 0) {
    document.customer = (
      await createCustomer({
        authToken,
        customer: document.customer,
      })
    ).id;
  } else {
    document.customer = document.customer.id;
  }

  console.log(document);

  /*   const request = await fetch(fetchUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(document),
  });

  if (!request.ok) {
    throw new Error("Failed to create reservation");
  } else {
    return await { result: request.json() };
  } */

  return { result: "a" };
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
