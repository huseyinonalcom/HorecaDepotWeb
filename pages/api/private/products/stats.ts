import { apiUrl } from "../../../../api/api/constants";
import apiRoute from "../../../../api/api/apiRoute";

function subtractDays(date: Date | string, days: number): Date {
  const base = typeof date === "string" ? new Date(date) : date;
  const result = new Date(base);
  result.setDate(result.getDate() - days);
  return result;
}

function isoDate(d: Date = new Date()): string {
  return d.toISOString().split("T")[0];
}

export const getTopProductsDay = async ({
  count = 10,
  date,
}: {
  count?: number;
  date?: string;
}) => {
  try {
    const day = date ?? isoDate(new Date());

    const request = await fetch(
      `${apiUrl}/api/product-view-stats` +
        `?sort=times_viewed:desc` +
        `&pagination[pageSize]=${count}` +
        `&filters[statistic][date][$eq]=${day}` +
        `&populate[product][populate][0]=categories` +
        `&populate[product][populate][1]=images`,
      {
        headers: {
          Authorization: `Bearer ${process.env.API_KEY}`,
        },
      },
    );

    if (!request.ok) {
      const errorText = await request.text();
      console.error("Error fetching top products (day):", errorText);
      return { result: null, error: "Failed to fetch top products" };
    }

    const response = await request.json();
    const data: any[] = response?.data ?? [];

    const result = data.map((viewStat: any) => ({
      id: viewStat?.product?.id,
      times_viewed: viewStat?.times_viewed ?? 0,
      product: {
        id: viewStat?.product?.id,
        localized_name: viewStat?.product?.localized_name ?? {
          en: viewStat?.product?.name,
          fr: viewStat?.product?.name,
          de: viewStat?.product?.name,
          nl: viewStat?.product?.name,
        },
      },
      images:
        (viewStat?.product?.images ?? []).map((image: any) => ({
          url: image?.url,
          id: image?.id,
        })) ?? [],
    }));

    return { result };
  } catch (error) {
    console.error("error in getTopProductsDay function:", error);
    return { result: null, error };
  }
};

export const getTopProductsWeek = async ({
  count = 10,
  date,
}: {
  count?: number;
  date?: string;
}) => {
  try {
    const endDate = date ?? isoDate(new Date());
    const startDate = isoDate(subtractDays(endDate, 7));

    const pageSize = 150;
    const request = await fetch(
      `${apiUrl}/api/product-view-stats` +
        `?sort=times_viewed:desc` +
        `&pagination[pageSize]=${pageSize}` +
        `&filters[statistic][date][$gte]=${startDate}` +
        `&populate[product][populate][0]=categories` +
        `&populate[product][populate][1]=images`,
      {
        headers: {
          Authorization: `Bearer ${process.env.API_KEY}`,
        },
      },
    );

    if (!request.ok) {
      const errorText = await request.text();
      console.error("Error fetching top products (week):", errorText);
      return { result: null, error: "Failed to fetch top products" };
    }

    const response = await request.json();
    const data: any[] = response?.data ?? [];

    const byProduct = new Map<
      number,
      {
        product: any;
        times_viewed: number;
      }
    >();

    for (const row of data) {
      const p = row?.product;
      if (!p?.id) continue;
      const prev = byProduct.get(p.id);
      const sum =
        Number(prev?.times_viewed ?? "0") + Number(row?.times_viewed ?? "0");
      byProduct.set(p.id, { product: p, times_viewed: sum });
    }

    const mergedSorted = [...byProduct.values()]
      .sort((a, b) => (b.times_viewed ?? 0) - (a.times_viewed ?? 0))
      .slice(0, count);

    const result = mergedSorted.map(({ product, times_viewed }) => ({
      id: product.id,
      times_viewed,
      product: {
        id: product.id,
        localized_name: product?.localized_name ?? {
          en: product?.name,
          fr: product?.name,
          de: product?.name,
          nl: product?.name,
        },
      },
      images:
        (product?.images ?? []).map((image: any) => ({
          url: image?.url,
          id: image?.id,
        })) ?? [],
    }));

    return { result };
  } catch (error) {
    console.error("error in getTopProductsWeek function:", error);
    return { result: null, error };
  }
};

export default apiRoute({
  endpoints: {
    GET: {
      func: async (req, res) => {
        const countParam = req.query.count;
        const count =
          typeof countParam === "string" && countParam.trim() !== ""
            ? Number(countParam)
            : undefined;

        switch (req.query.type) {
          case "top-products-day":
            return await getTopProductsDay({
              count,
              date: (req.query.date as string) || undefined,
            });
          case "top-products-week":
            return await getTopProductsWeek({
              count,
              date: (req.query.date as string) || undefined,
            });
          default:
            return { result: null, error: "Invalid type" };
        }
      },
    },
  },
});
