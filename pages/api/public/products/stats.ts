import { getProducts, updateProduct } from "../../private/products/products";
import { apiUrl } from "../../../../api/api/constants";
import apiRoute from "../../../../api/api/apiRoute";

const fetchUrlStatistics = `${apiUrl}/api/statistics`;

async function fetchStatisticsDay({ date }: { date: Date }) {
  try {
    const dateStringAPI = date.toISOString().split("T")[0];

    const request = await fetch(
      `${fetchUrlStatistics}?filters[date][$eq]=${dateStringAPI}&populate=*`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.API_KEY}`,
        },
      },
    );

    if (!request.ok) {
      const error = `Failed to fetch statistics for date ${dateStringAPI}`;
      console.error(error);
      throw error;
    } else {
      const answer = await request.json();

      if (answer.data.length == 0) {
        throw `No statistics found for date ${dateStringAPI}`;
      }

      return answer.data[0];
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function createStatisticsDay() {
  try {
    const today = new Date();
    const dateStringAPI = today.toISOString().split("T")[0];

    const request = await fetch(`${fetchUrlStatistics}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
      body: JSON.stringify({
        data: {
          date: dateStringAPI,
        },
      }),
    });

    if (!request.ok) {
      const error = "Failed to create statistics for today";
      console.error(error);
      throw error;
    } else {
      const answer = await request.json();
      console.log("Created statistics for today", answer);
      return answer.data;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}

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

    console.log(fetchedStatisticsDay);

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
    const product = await getProducts({
      id: productId,
      authToken: process.env.API_KEY,
    });

    if (!product) throw "Failed to fetch product";

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
