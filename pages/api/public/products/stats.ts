import { apiUrl } from "../../../../api/api/constants";
import apiRoute from "../../../../api/api/apiRoute";
import {
  createStatisticsDay,
  fetchStatisticsDay,
} from "../statistics/universal";

const fetchUrlStatistics = `${apiUrl}/api/statistics`;

async function createProductView({
  productId,
  statisticId,
}: {
  productId: number;
  statisticId: number;
}) {
  try {
    const statisticsDay = await fetch(
      `${fetchUrlStatistics}/${statisticId}?populate[product_view_stats][populate][product][populate][fields][0]=name`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${process.env.API_KEY}`,
        },
      },
    );

    if (!statisticsDay.ok) {
      throw "Failed to fetch product view";
    }

    const fetchedStatisticsDay = (await statisticsDay.json()).data
      .product_view_stats;

    const existingProductViewStat = fetchedStatisticsDay.find(
      (stat) => stat.product.id === productId,
    );

    if (existingProductViewStat) {
      incrementProductView({
        productViewStatId: existingProductViewStat.id,
        viewed: Number(existingProductViewStat.times_viewed) + 1,
      });
    } else {
      const request = await fetch(`${apiUrl}/api/product-view-stats`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${process.env.API_KEY}`,
        },
        body: JSON.stringify({
          data: {
            product: productId,
            statistic: statisticId,
            times_viewed: 1,
          },
        }),
      });
    }
  } catch (error) {
    console.error(error);
    throw "Failed to create product view";
  }
}

async function incrementProductView({
  productViewStatId,
  viewed,
}: {
  productViewStatId: number;
  viewed: number;
}) {
  try {
    const request = await fetch(
      `${apiUrl}/api/product-view-stats/${productViewStatId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${process.env.API_KEY}`,
        },
        body: JSON.stringify({
          data: {
            times_viewed: viewed,
          },
        }),
      },
    );

    if (!request.ok) {
      throw "Failed to increment product view";
    }
  } catch (error) {
    console.error(error);
  }
}

export async function logProductView({
  productId,
  action,
}: {
  productId: number;
  action: "views";
}) {
  try {
    let statisticsId;

    const existingStatisticsDay = await fetchStatisticsDay({
      date: new Date(),
    });

    if (existingStatisticsDay) {
      statisticsId = existingStatisticsDay.id;
    } else {
      const createdStatisticsDay = await createStatisticsDay();
      statisticsId = createdStatisticsDay.id;
    }

    await createProductView({
      productId: productId,
      statisticId: statisticsId,
    });
  } catch (error) {
    console.error(error);
    return false;
  }

  return true;
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
