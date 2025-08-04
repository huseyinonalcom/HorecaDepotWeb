import { getProducts, updateProduct } from "../../private/products/products";
import apiRoute from "../../../../api/api/apiRoute";

export async function logProductView({
  productId,
  action,
}: {
  productId: number;
  action: "views";
}) {
  try {
    const product = await getProducts({
      id: productId,
      authToken: process.env.API_KEY,
    });
    if (!product) return;

    const fetchedProduct = product.data;

    const currentviews = fetchedProduct.views;

    let newviews = 0;

    if (!currentviews) {
      newviews = 1;
    } else {
      newviews = Number(currentviews) + 1;
    }

    updateProduct({
      id: productId,
      authToken: process.env.API_KEY,
      data: {
        views: newviews,
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
          action: req.query.action as "views",
        });
        return { result: "ok" };
      },
    },
  },
});
