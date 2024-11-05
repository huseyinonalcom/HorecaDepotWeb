import {
  Category,
  CategoryConversion,
} from "../../../../api/interfaces/category";
import { Product } from "../../../../api/interfaces/product";
import statusText from "../../../../api/statustexts";
import { getAllCategoriesFlattened } from "../../categories/public/getallcategoriesflattened";

function getAllSubcategoryIds(categories, categoryId) {
  const ids = [];
  const stack = categories.filter((cat) => cat.id === categoryId);

  while (stack.length > 0) {
    const category = stack.pop();
    ids.push(category.id);
    if (category.subCategories) stack.push(...category.subCategories);
  }
  return ids;
}

function checkValues(minValue, maxValue) {
  if (minValue === null || maxValue === null) {
    return null;
  }

  const isMinValueValid = Number.isInteger(minValue) && minValue > 0;
  const isMaxValueValid = Number.isInteger(maxValue) && maxValue > 0;
  const isMinLessThanMax = minValue < maxValue;

  return isMinValueValid && isMaxValueValid && isMinLessThanMax;
}

const cache = {};

// Function to find a category parameter, with caching
const findCategoryParam = (categoryParam, categories) => {
  if (cache[categoryParam]) {
    return cache[categoryParam];
  }

  for (const category of categories) {
    if (Object.values(category.localized_name).includes(categoryParam)) {
      cache[categoryParam] = category.id;
      return category.id;
    }
  }

  cache[categoryParam] = categoryParam;
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
  const getLimitsParam = req.query.getlimits ?? null;

  try {
    const allCats = await getAllCategoriesFlattened();

    const allCategories = allCats.map(CategoryConversion.fromJson);
    const categoryMap = new Map(allCategories.map((cat) => [cat.id, cat]));

    allCategories.forEach((cat) => {
      cat.subCategories = [];
    });

    allCategories.forEach((cat) => {
      if (cat.headCategory) {
        const parent: Category = categoryMap.get(cat.headCategory.id);
        if (parent) {
          parent.subCategories.push(cat);
        }
      }
    });

    const mainCategories = allCategories.filter((cat) => !cat.headCategory);

    let categories: Category[] = mainCategories;

    let categoriesToSearch: number[] = [];

    categoryParam ? (categoryParam = decodeURIComponent(categoryParam)) : null;

    if (categoryParam == "tous") {
      categoryParam = null;
    }

    if (typeof categoryParam === "string") {
      const parsedCategoryParam = parseInt(categoryParam, 10);

      if (isNaN(parsedCategoryParam)) {
        categoryParam = findCategoryParam(categoryParam, allCategories);
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

    fetchUrl += `populate[document_products][fields][0]=amount&populate[shelves][fields][0]=stock&fields[0]=name&populate[categories][fields][0]=localized_name&fields[1]=internalCode&fields[2]=value&fields[3]=priceBeforeDiscount&fields[4]=color&fields[5]=imageDirections&populate[images][fields][0]=url&populate[product_extra][fields][0]=new&pagination[page]=${pageParam}${
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

    var minValueFromAPI = 1;
    var maxValueFromAPI = 9999;

    if (sortedData.length > 0 && getLimitsParam) {
      const [answerMaxValue, answerMinValue] = await Promise.all([
        fetch(
          fetchUrlForValues + "desc&pagination[page]=1&pagination[pageSize]=1",
          {
            headers: { Authorization: `Bearer ${process.env.API_KEY}` },
          },
        ).then((res) => res.json()),
        fetch(
          fetchUrlForValues + "asc&pagination[page]=1&pagination[pageSize]=1",
          {
            headers: { Authorization: `Bearer ${process.env.API_KEY}` },
          },
        ).then((res) => res.json()),
      ]);

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
    console.error(error);
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
