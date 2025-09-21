import { getAllCategoriesFlattened } from "../categories/public/getallcategoriesflattened";
import { getProducts } from "./products/getproducts";
import apiRoute from "../../../api/api/apiRoute";
import { getCollections } from "./collections";
import Fuse from "fuse.js";

const cache = {
  data: null,
  lastFetch: 0,
};

const SEARCH_CACHE_TTL = 40 * 60 * 1000; // 40 minutes in milliseconds

const optionsProducts = {
  keys: [
    { name: "localized_name.en", weight: 0.3 },
    { name: "localized_name.fr", weight: 0.3 },
    { name: "localized_name.de", weight: 0.3 },
    { name: "localized_name.nl", weight: 0.3 },
    { name: "name", weight: 0.2 },
    { name: "internalCode", weight: 0.3 },
    { name: "categories.translations.en", weight: 0.1 },
    { name: "categories.translations.fr", weight: 0.1 },
    { name: "categories.translations.de", weight: 0.1 },
    { name: "categories.translations.nl", weight: 0.1 },
    { name: "supplierCode", weight: 0.3 },
  ],
  threshold: 0.5,
};

const optionsCategories = {
  keys: [
    { name: "translations.en", weight: 0.3 },
    { name: "translations.fr", weight: 0.3 },
    { name: "translations.de", weight: 0.3 },
    { name: "translations.nl", weight: 0.3 },
  ],
  threshold: 0.5,
};

const optionsCollections = {
  keys: [
    { name: "title", weight: 0.3 },
    { name: "translations.en", weight: 0.3 },
    { name: "translations.fr", weight: 0.3 },
    { name: "translations.de", weight: 0.3 },
    { name: "translations.nl", weight: 0.3 },
  ],
  threshold: 0.5,
};

const mergeTranslations = (categories) => {
  return categories.map((category) => {
    return {
      ...category,
      translations: {
        en: category.localized_name.en || category.Name,
        fr: category.localized_name.fr || category.Name,
        de: category.localized_name.de || category.Name,
        nl: category.localized_name.nl || category.Name,
      },
    };
  });
};

const productsUpdateCategories = (products, categories) => {
  return products.map((product) => {
    if (!product.categories) {
      return product;
    }

    product.categories = product.categories.map((cat) => {
      return categories.find((category) => category.id === cat.id);
    });

    return product;
  });
};

export async function fuzzySearch({
  search,
  count,
  noCache,
  filter,
  sort,
}: {
  search: string;
  noCache?: boolean;
  count?: number;
  filter?: { on: string; value: number }[];
  sort?: string;
}) {
  const now = Date.now();

  let data = {
    products: [],
    categories: [],
    collections: [],
  };

  if (cache.data && now - cache.lastFetch < SEARCH_CACHE_TTL && !noCache) {
    data = cache.data;
  } else {
    try {
      const allCategories = await getAllCategoriesFlattened();
      data.categories = mergeTranslations(allCategories);
      let filterQuery = {};
      if (Array.isArray(filter)) {
        for (let filterRule of filter) {
          if (filterRule.on == "category" && filterRule.value) {
            filterQuery = { category: filterRule.value, ...filterQuery };
          }
          if (filterRule.on == "active") {
            filterQuery = { showinactive: !filterRule.value, ...filterQuery };
          }
        }
      }

      let prods = (
        await getProducts({
          query: { page: 1, count: 5000, ...filterQuery },
        })
      ).sortedData;
      data.products = productsUpdateCategories(prods, data.categories);
      data.collections = await getCollections({});
      cache.lastFetch = now;
      cache.data = data;
    } catch (error) {
      console.error("Error while fetching data:", error);
    }
  }

  try {
    const fuseProducts = new Fuse(data.products, optionsProducts);
    const resultsProducts = fuseProducts
      .search(search)
      .slice(0, count ?? 4)
      .map((result) => result.item);
    const fuseCategories = new Fuse(data.categories, optionsCategories);
    const resultsCategories = fuseCategories
      .search(search)
      .slice(0, 5)
      .map((result) => result.item);
    const fuseCollections = new Fuse(data.collections, optionsCollections);
    const resultsCollections = fuseCollections
      .search(search)
      .slice(0, 5)
      .map((result) => result.item);
    return {
      result: [...resultsProducts, ...resultsCategories, ...resultsCollections],
    };
  } catch (error) {
    console.error("Error while searching:", error);
    throw error;
  }
}

export default apiRoute({
  endpoints: {
    GET: {
      func: async (req, res) =>
        await fuzzySearch({
          search: req.query.search as string,
          count: Number((req.query.count ?? "4") as string),
          noCache: req.query.nocache === "true",
        }),
    },
  },
});
