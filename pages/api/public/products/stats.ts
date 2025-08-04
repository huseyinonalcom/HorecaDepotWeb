import { getProducts, updateProduct } from "../../private/products/products";
import apiRoute from "../../../../api/api/apiRoute";

export async function logProductView({
  productId,
  action,
}: {
  productId: number;
  action: "viewed";
}) {
  try {
    const product = await getProducts({
      id: productId,
      authToken: process.env.API_KEY,
    });
    if (!product) return;

    const fetchedProduct = product.data;

    const currentViewed = fetchedProduct.viewed;

    let newViewed = 0;

    if (!currentViewed) {
      newViewed = 1;
    } else {
      newViewed = Number(currentViewed) + 1;
    }

    updateProduct({
      id: productId,
      authToken: process.env.API_KEY,
      data: {
        viewed: newViewed,
      },
    });
  } catch (error) {
    console.error(error);
    throw "Failed to log product view";
  }
}

export default apiRoute({
  endpoints: {
    POST: {
      func: async (req, res) => {
        logProductView({
          productId: Number(req.query.id),
          action: req.query.action as "viewed",
        });
        return { result: "ok" };
      },
    },
  },
});
