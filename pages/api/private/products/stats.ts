import apiRoute from "../../../../api/api/apiRoute";
import { apiUrl } from "../../../../api/api/constants";

export const getTopProductsDay = async ({
  count = 10,
  date,
}: {
  count?: number;
  date?: string;
}) => {
  try {
    if (!date) {
      date = new Date().toISOString().split("T")[0]; // Default to today if no date is provided
    }

    const request = await fetch(
      `${apiUrl}/api/product-view-stats?sort=times_viewed:desc&pagination[pageSize]=${count}&filters[statistic][date][$eq]=${date}&populate[product][populate][0]=categories&populate[product][populate][1]=images`,
      {
        headers: {
          Authorization: `Bearer ${process.env.API_KEY}`,
        },
      },
    );

    if (!request.ok) {
      const errorText = await request.text();
      console.error("Error fetching top products:", errorText);
      return { result: null, error: "Failed to fetch top products" };
    }

    const response = await request.json();

    const data = response.data;

    const result = data.map((viewStat) => ({
      id: viewStat.id,
      times_viewed: viewStat.times_viewed,
      product: {
        localized_name:
          viewStat.product.localized_name?.en ?? viewStat.product.name,
      },
      images: viewStat.product.images.map((image) => ({
        url: image.url,
        id: image.id,
      })),
    }));

    return { result };
  } catch (error) {
    console.error("error in getTopProductsDay function:", error);
    return { result: null, error: error };
  }
};

export default apiRoute({
  endpoints: {
    GET: {
      func: async (req, res) => {
        switch (req.query.type) {
          case "top-products-day":
            return await getTopProductsDay({
              count: Number(req.query.count as string),
              date: req.query.date as string,
            });
          default:
            return { result: null, error: "Invalid type" };
        }
      },
    },
  },
});
