import { getCategories } from "../../../../api/calls/categoryCalls";
import { Category } from "../../../../api/interfaces/category";
import { Product, ProductConversion } from "../../../../api/interfaces/product";
import statusText from "../../../../api/statustexts";
import { getAllCategoriesFlattened } from "../../categories/public/getallcategoriesflattened";

function getAllSubcategoryIds(categories: Category[], categoryId: number) {
  let ids: number[] = [];

  function searchAndExtract(category: Category) {
    ids.push(category.id);
    category.subCategories.forEach((subCategory) => {
      searchAndExtract(subCategory);
    });
  }

  function findAndProcessCategory(categories: Category[]) {
    for (const category of categories) {
      if (category.id == categoryId) {
        searchAndExtract(category);
        return true;
      }

      if (findAndProcessCategory(category.subCategories)) {
        return true;
      }
    }

    return false;
  }

  findAndProcessCategory(categories);
  return ids;
}

function checkValues(minValue, maxValue) {
  // If either value is null, return null
  if (minValue === null || maxValue === null) {
    return null;
  }

  // Check if both minValue and maxValue are positive integers and minValue is less than maxValue
  const isMinValueValid = Number.isInteger(minValue) && minValue > 0;
  const isMaxValueValid = Number.isInteger(maxValue) && maxValue > 0;
  const isMinLessThanMax = minValue < maxValue;

  return isMinValueValid && isMaxValueValid && isMinLessThanMax;
}

const en = require("../../../../locales/en/common.json");
const fr = require("../../../../locales/fr/common.json");
const nl = require("../../../../locales/nl/common.json");
const de = require("../../../../locales/de/common.json");

// Function to read JSON file
const loadJSON = (name) => {
  switch (name) {
    case "en":
      return en;
    case "fr":
      return fr;
    case "nl":
      return nl;
    case "de":
      return de;
    default:
      return fr;
  }
};

// Load all JSON files
const locales = {
  en: loadJSON("en"),
  fr: loadJSON("fr"),
  nl: loadJSON("nl"),
  de: loadJSON("de"),
};

// Cache object to store results
const cache = {};

// Function to find a category parameter, with caching
const findCategoryParam = (categoryParam) => {
  if (cache[categoryParam]) {
    return cache[categoryParam];
  }

  for (const locale in locales) {
    for (const key in locales[locale]) {
      if (locales[locale][key] === categoryParam) {
        cache[categoryParam] = key; // Cache the result
        return key;
      }
    }
  }

  cache[categoryParam] = categoryParam; // Cache the result as it is if not found
  return categoryParam;
};

export async function getProducts(req) {
  const pageParam = req.query.page ?? 1;
  let categoryParam = req.query.category ?? null;
  const minValueParam = Number(req.query.minprice) ?? null;
  const maxValueParam = Number(req.query.maxprice) ?? null;
  const searchParam = req.query.search ?? null;
  const sortParam = req.query.sort ?? null;
  const countParam = req.query.count ?? null;

  try {
    let categories: Category[] = await getCategories();

    let categoriesToSearch: number[] = [];

    categoryParam ? (categoryParam = decodeURIComponent(categoryParam)) : null;

    if (categoryParam == "tous") {
      categoryParam = null;
    }
    if (typeof categoryParam === "string") {
      const parsedCategoryParam = parseInt(categoryParam, 10);

      if (isNaN(parsedCategoryParam)) {
        const param = findCategoryParam(categoryParam);
        categoryParam = parseInt(
          await getAllCategoriesFlattened().then(
            (data) => data.find((cat) => cat.Name === param).id,
          ),
        );
      } else {
        categoryParam = parsedCategoryParam;
      }
    }

    if (categoryParam) {
      categoriesToSearch = getAllSubcategoryIds(categories, categoryParam);
    }

    let fetchUrl: string =
      `${process.env.API_URL}/api/products?` +
      (searchParam ? "filters[name][$containsi]=" + searchParam + "&" : "");

    var valuesValid: boolean = false;

    if (minValueParam != null && maxValueParam != null) {
      valuesValid = checkValues(minValueParam, maxValueParam);
    }

    if (categoryParam) {
      if (categoriesToSearch.length > 1) {
        let index = 0;
        categoriesToSearch.forEach((catS) => {
          fetchUrl +=
            "filters[$or][" +
            index +
            "][categories][id][$eq]=" +
            catS.toString() +
            "&";
          index++;
        });
      } else {
        fetchUrl += "filters[categories][id][$eq]=" + categoryParam + "&";
      }
    }

    fetchUrl += `filters[active][$eq]=true&filters[deleted][$eq]=false&`;

    const fetchUrlForValues = fetchUrl + "fields[0]=value&sort[0]=value:";

    if (valuesValid) {
      fetchUrl += `filters[$and][0][value][$gte]=${minValueParam}&filters[$and][1][value][$lte]=${maxValueParam}&`;
    }

    fetchUrl += `populate[document_products][fields][0]=amount&populate[product_extra][fields][0]=*&populate[shelves][fields][0]=stock&fields[0]=name&populate[categories][fields][0]=name&fields[2]=productLine&fields[3]=internalCode&fields[5]=value&fields[8]=description&populate[shelves][populate][supplier_order_products][fields][0]=amountOrdered&populate[shelves][populate][supplier_order_products][fields][1]=amountDelivered&fields[1]=depth&fields[4]=priceBeforeDiscount&fields[6]=width&fields[7]=height&fields[9]=material&fields[10]=color&fields[11]=imageDirections&populate[images][fields][0]=url&pagination[page]=${pageParam}${
      sortParam ? `&sort[0]=${sortParam}` : ""
    }${countParam ? `&pagination[pageSize]=${countParam}` : ""}`;

    const response = await fetch(fetchUrl, {
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
    });

    const data = await response.json();

    // sort productData array on product.product_extra.new from true to false
    const sortedData: Product[] = data["data"]
      .map((productData) => productData as Product)
      .sort((a, b) => {
        // Assuming product_extra.new is a boolean property
        const isNewA = a.product_extra.new;
        const isNewB = b.product_extra.new;

        // If both are new or both are not new, maintain their original order
        if (isNewA === isNewB) {
          return 0;
        }

        // Sort new items first (true comes before false)
        return isNewA ? -1 : 1;
      });

    const totalPages = data["meta"]["pagination"]["pageCount"];

    var minValueFromAPI = 20;
    var maxValueFromAPI = 500;

    if (sortedData.length > 0) {
      const requestForMaxValue = await fetch(
        fetchUrlForValues + "desc&pagination[page]=1&pagination[pageSize]=1",
        {
          headers: {
            Authorization: `Bearer ${process.env.API_KEY}`,
          },
        },
      );

      const answerMaxValue = await requestForMaxValue.json();

      const requestForMinValue = await fetch(
        fetchUrlForValues + "asc&pagination[page]=1&pagination[pageSize]=1",
        {
          headers: {
            Authorization: `Bearer ${process.env.API_KEY}`,
          },
        },
      );
      const answerMinValue = await requestForMinValue.json();

      maxValueFromAPI = answerMaxValue.data[0].value;
      minValueFromAPI = answerMinValue.data[0].value;
    }
    const currentCategoryID = categoryParam;
    return {
      sortedData,
      totalPages,
      minValueFromAPI,
      maxValueFromAPI,
      currentCategoryID,
    };
  } catch (error) {
    return null;
  }
}

export default async function handler(req, res) {
  try {
    const response = await getProducts(req);

    if (!response) {
      return res.status(500).json(statusText[500]);
    }

    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json(statusText[500]);
  }
}
