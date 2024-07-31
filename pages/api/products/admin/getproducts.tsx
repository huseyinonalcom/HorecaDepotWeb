import { getCategories } from "../../../../api/calls/categoryCalls";
import { Category } from "../../../../api/interfaces/category";
import { Product, ProductConversion } from "../../../../api/interfaces/product";

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

export default async function getProductsAdmin(req, res) {
  const pageParam = req.query.page ?? 1;
  const categoryParam = req.query.category ?? null;
  const minValueParam = Number(req.query.minprice) ?? null;
  const maxValueParam = Number(req.query.maxprice) ?? null;
  const searchParam = req.query.search ?? null;
  const sortParam = req.query.sort ?? null;
  const countParam = req.query.count ?? null;

  try {
    let categories: Category[] = await getCategories();

    let categoriesToSearch: number[] = [];

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

    fetchUrl += `populate[document_products][fields][0]=amount&populate[reservations][fields][0]=client_name&populate[reservations][fields][1]=amount&populate[reservations][fields][2]=is_deleted&populate[product_extra][fields][0]=*&populate[shelves][fields][0]=stock&fields[0]=name&populate[categories][fields][0]=name&fields[2]=productLine&fields[3]=internalCode&fields[5]=value&fields[8]=description&populate[shelves][populate][supplier_order_products][fields][0]=amountOrdered&populate[shelves][populate][supplier_order_products][fields][1]=amountDelivered&fields[1]=depth&fields[4]=priceBeforeDiscount&fields[6]=width&fields[7]=height&fields[9]=material&fields[10]=color&fields[11]=imageDirections&populate[images][fields][0]=url&pagination[page]=${pageParam}${
      sortParam ? `&sort=${sortParam}` : ""
    }${countParam ? `&pagination[pageSize]=${countParam}` : ""}`;

    const response = await fetch(fetchUrl, {
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
    });

    const data = await response.json();

    const sortedData: Product[] = data["data"].map(
      (productData) => productData as Product
    );
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
        }
      );

      const answerMaxValue = await requestForMaxValue.json();

      const requestForMinValue = await fetch(
        fetchUrlForValues + "asc&pagination[page]=1&pagination[pageSize]=1",
        {
          headers: {
            Authorization: `Bearer ${process.env.API_KEY}`,
          },
        }
      );
      const answerMinValue = await requestForMinValue.json();

      maxValueFromAPI = answerMaxValue.data[0].value;
      minValueFromAPI = answerMinValue.data[0].value;
    }
    return res
      .status(200)
      .json({ sortedData, totalPages, minValueFromAPI, maxValueFromAPI });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
