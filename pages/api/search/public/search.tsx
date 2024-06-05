import Fuse from "fuse.js";
import { getProducts } from "../../../../api/calls/productCalls";
import statusText from "../../../../api/statustexts";
import { getAllCategoriesFlattened } from "../../categories/public/getallcategoriesflattened";
import { getCollections } from "../../collections/public/getcollections";
import enTranslations from "../../../../locales/en/common.json";
import frTranslations from "../../../../locales/fr/common.json";
import deTranslations from "../../../../locales/de/common.json";
import nlTranslations from "../../../../locales/nl/common.json";

const cache = {
  data: null,
  lastFetch: 0,
};

const SEARCH_CACHE_TTL = 20000 * 60 * 30;

const options = {
  keys: [
    { name: "name", weight: 0.3 },
    { name: "internalCode", weight: 0.3 },
    { name: "category.translations.en", weight: 0.1 },
    { name: "category.translations.fr", weight: 0.1 },
    { name: "category.translations.de", weight: 0.1 },
    { name: "category.translations.nl", weight: 0.1 },
    { name: "category.translations.tr", weight: 0.1 },
    { name: "translations.en", weight: 0.3 },
    { name: "translations.fr", weight: 0.3 },
    { name: "translations.de", weight: 0.3 },
    { name: "translations.nl", weight: 0.3 },
    { name: "translations.tr", weight: 0.3 },
    { name: "title", weight: 0.3 },
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
    if (!product.category) {
      return product;
    }

    const category = categories.find((cat) => cat.id === product.category.id);

    return {
      ...product,
      category: category
        ? category
        : { id: product.category.id, Name: product.category.Name },
    };
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
    const allCategories = await getAllCategoriesFlattened();
    data.categories = mergeTranslations(allCategories);
    let prods = await getProducts({ page: 1, count: 5000 });
    data.products = productsUpdateCategories(prods[0], data.categories);
    data.collections = await getCollections();
    cache.lastFetch = now;
    cache.data = data;
  }

  try {
    const fuseProducts = new Fuse(data.products, options);
    const resultsProducts = fuseProducts
      .search(search)
      .slice(0, 5)
      .map((result) => result.item);
    const fuseCategories = new Fuse(data.categories, options);
    const resultsCategories = fuseCategories
      .search(search)
      .slice(0, 5)
      .map((result) => result.item);
    const fuseCollections = new Fuse(data.collections, options);
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
