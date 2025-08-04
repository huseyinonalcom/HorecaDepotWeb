import { getAllSubcategoriesOfCategory } from "../../public/categories/getallsubcategoriesofcategory";
import { getCategoryFromString } from "../../public/categories/getcategoryfromstring";
import { Product } from "../../../../api/interfaces/product";
import statusText from "../../../../api/statustexts";

function checkValues(minValue, maxValue) {
  if (minValue === null || maxValue === null) {
    return null;
  }

  const isMinValueValid = Number.isInteger(minValue) && minValue > 0;
  const isMaxValueValid = Number.isInteger(maxValue) && maxValue > 0;
  const isMinLessThanMax = minValue < maxValue;

  return isMinValueValid && isMaxValueValid && isMinLessThanMax;
}

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
    categoryParam ? (categoryParam = decodeURIComponent(categoryParam)) : null;

    if (categoryParam == "tous") {
      categoryParam = null;
    }

    if (typeof categoryParam === "string") {
      const parsedCategoryParam = parseInt(categoryParam, 10);

      if (isNaN(parsedCategoryParam)) {
        categoryParam = (
          await getCategoryFromString({ category: categoryParam })
        ).id;
      } else {
        categoryParam = parsedCategoryParam;
      }
    }

    let categoriesToSearch: number[] = [];

    if (categoryParam) {
      categoriesToSearch = await getAllSubcategoriesOfCategory({
        id: categoryParam,
      });
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

    fetchUrl += `populate[document_products][fields][0]=amount&populate[shelves][fields][0]=stock&populate[shelves][populate][supplier_order_products][fields][0]=amount&fields[0]=name&populate[categories][fields][0]=localized_name&fields[1]=internalCode&fields[2]=value&fields[3]=priceBeforeDiscount&fields[4]=color&fields[5]=imageDirections&fields[6]=localized_name&fields[7]=stock&fields[8]=views&populate[images][fields][0]=url&populate[product_extra][fields][0]=new&populate[product_extra][fields][1]=tags&pagination[page]=${pageParam}${
      sortParam ? `&sort[0]=${sortParam}` : ""
    }${countParam ? `&pagination[pageSize]=${countParam}` : ""}`;

    const response = await fetch(fetchUrl, {
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
    });

    const data = await response.json();

    // sort productData array on product.product_extra.new from true to false
    const sortedData: Product[] = data["data"];

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
