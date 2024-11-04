import Fuse from "fuse.js";
import statusText from "../../../../api/statustexts";
import { getAllCategoriesFlattened } from "../../categories/public/getallcategoriesflattened";
import { getCollections } from "../../collections/public/getcollections";
import enTranslations from "../../../../locales/en/common.json";
import frTranslations from "../../../../locales/fr/common.json";
import deTranslations from "../../../../locales/de/common.json";
import nlTranslations from "../../../../locales/nl/common.json";
import { getProducts } from "../../products/public/getproducts";

const cache = {
  data: null,
  lastFetch: 0,
};

const SEARCH_CACHE_TTL = 20000 * 60 * 30;

const optionsProducts = {
  keys: [
    { name: "name", weight: 0.3 },
    { name: "internalCode", weight: 0.3 },
    { name: "categories.translations.en", weight: 0.1 },
    { name: "categories.translations.fr", weight: 0.1 },
    { name: "categories.translations.de", weight: 0.1 },
    { name: "categories.translations.nl", weight: 0.1 },
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
        en: enTranslations[category.Name] || category.Name,
        fr: frTranslations[category.Name] || category.Name,
        de: deTranslations[category.Name] || category.Name,
        nl: nlTranslations[category.Name] || category.Name,
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

// Function to fetch index slider images data from the API
export async function fuzzySearch({ search }: { search: string }) {
  const now = Date.now();

  let data = {
    products: [],
    categories: [],
    collections: [],
  };

  if (cache.data && now - cache.lastFetch < SEARCH_CACHE_TTL) {
    data = cache.data;
  } else {
    try {
      const allCategories = await getAllCategoriesFlattened();
      data.categories = mergeTranslations(allCategories);
      let prods = (await getProducts({ query: { page: 1, count: 5000 } }))
        .sortedData;
      data.products = productsUpdateCategories(prods, data.categories);
      data.collections = await getCollections();
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
      .slice(0, 4)
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
    return [...resultsProducts, ...resultsCategories, ...resultsCollections];
  } catch (error) {
    console.error("Error while searching:", error);
    throw error;
  }
}

// API route handler for fetching projects
export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json(statusText[405]);
  }
  if (req.query.search === undefined) {
    return res.status(400).json(statusText[400]);
  }
  try {
    const searchResults = await fuzzySearch({ search: req.query.search });
    return res.status(200).json(searchResults);
  } catch (error) {
    return res.status(500).json(statusText[500]);
  }
}
