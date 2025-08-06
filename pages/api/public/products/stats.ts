import { getProducts, updateProduct } from "../../private/products/products";
import { apiUrl } from "../../../../api/api/constants";
import apiRoute from "../../../../api/api/apiRoute";

const fetchUrlStatistics = `${apiUrl}/api/statistics`;

async function fetchStatisticsDay({ date }: { date: Date }) {
  try {
    const dateStringAPI = date.toISOString().split("T")[0];

    const request = await fetch(
      `${fetchUrlStatistics}?filter[date][$eq]=${dateStringAPI}`,
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

      console.log("Fetched statistics for date", dateStringAPI, answer);
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
  statisticId?: number;
}) {
  let existingTimesViewed = 0;
  try {
    if (statisticId) {
      const existingProductViewStat = await fetch(
        `${fetchUrlStatistics}/${statisticId}?populate=*`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${process.env.API_KEY}`,
          },
        },
      );

      if (!existingProductViewStat.ok) {
        throw "Failed to fetch product view";
      }
      const fetchedProductViewStat = await existingProductViewStat.json();

      console.log(fetchedProductViewStat);
    }
  } catch (error) {
    console.error(error);
  }

  try {
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

    if (!request.ok) {
      throw "Failed to create product view";
    }
  } catch (error) {
    console.error(error);
    throw "Failed to create product view";
  }
}

async function incrementProductView({
  productViewStatId,
}: {
  productViewStatId: number;
}) {
  try {
    const existingProductViewStat = await fetch(
      `${apiUrl}/api/product-view-stats/${productViewStatId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${process.env.API_KEY}`,
        },
      },
    );

    if (!existingProductViewStat.ok) {
      throw "Failed to fetch product view";
    }

    const fetchedProductViewStat = await existingProductViewStat.json();

    const currentviews = fetchedProductViewStat.data.times_viewed;

    let newviews = 0;

    if (!currentviews) {
      newviews = 1;
    } else {
      newviews = Number(currentviews) + 1;
    }

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
            times_viewed: newviews,
          },
        }),
      },
    );

    if (!request.ok) {
      throw "Failed to increment product view";
    }
  } catch (error) {
    console.error(error);
    throw "Failed to increment product view stat";
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
  } catch (error) {
    console.error(error);
  }

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

    const createProductViewStat = await createProductView({
      productId: productId,
      statisticId: statisticsId,
    });
  } catch (error) {
    console.error(error);
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
