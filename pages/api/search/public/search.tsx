import Fuse from "fuse.js";
import { getProducts } from "../../../../api/calls/productCalls";
import statusText from "../../../../api/statustexts";
import { getAllCategoriesFlattened } from "../../categories/public/getallcategoriesflattened";
import { getCollections } from "../../collections/public/getcollections";
import enTranslations from "../../../../locales/en/common.json";
import frTranslations from "../../../../locales/fr/common.json";
import deTranslations from "../../../../locales/de/common.json";
import trTranslations from "../../../../locales/tr/common.json";
import nlTranslations from "../../../../locales/nl/common.json";

const cache = {
  data: null,
  lastFetch: 0,
};

const SEARCH_CACHE_TTL = 20000 * 60 * 30;

const options = {
  keys: [
    "name", // name of a product
    "internalCode", // internal code of a product
    "category.translations.en", // english translation of a products category name
    "category.translations.fr", // french translation of a products category name
    "category.translations.de", // german translation of a products category name
    "category.translations.nl", // dutch translation of a products category name
    "category.translations.tr", // turkish translation of a products category name

    "translations.en", // english translation of a category name
    "translations.fr", // french translation of a category name
    "translations.de", // german translation of a category name
    "translations.nl", // dutch translation of a category name
    "translations.tr", // turkish translation of a category name

    "title", // title of a collection
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
        tr: trTranslations[category.Name] || category.Name,
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
    console.log(error);
    return res.status(500).json(statusText[500]);
  }
}
