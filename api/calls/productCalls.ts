import { Category } from "../interfaces/category";
import { ProductConversion, Product } from "../interfaces/product";
import { getCategories } from "./categoryCalls";

const API_URL = `${process.env.API_URL}/api/`;
const API_KEY = process.env.API_KEY;

export async function getProductByID(id: number): Promise<Product> {
  const fetchUrl = `${API_URL}products/${id}?fields[0]=name&fields[1]=depth&fields[2]=productLine&fields[3]=internalCode&fields[4]=priceBeforeDiscount&fields[5]=value&fields[6]=width&fields[7]=height&fields[8]=description&fields[9]=material&fields[10]=color&fields[11]=supplierCode&fields[12]=imageDirections&fields[13]=tax&populate[shelves][populate][supplier_order_products][fields][0]=amountOrdered&populate[shelves][populate][supplier_order_products][fields][1]=amountDelivered&populate[images][fields][0]=url&populate[shelves][fields][0]=stock&populate[categories][fields][0]=Name&populate[document_products][fields][0]=amount&populate[product_extra][fields][0]=*&populate[product_color][fields][0]=*`;

  const response = await fetch(fetchUrl, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  });

  const answer = await response.json();

  return answer["data"] as Product;
}

export async function getAllProductIDs(): Promise<number[]> {
  let page: number = 1;
  const fetchUrl = `${API_URL}products?filters[active][$eq]=true&filters[deleted][$eq]=false&fields[0]=id&pagination[pageSize]=100&pagination[page]=${page}`;

  const response = await fetch(fetchUrl, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  });
  const data = await response.json();

  let allIDs: number[] = [];

  data["data"].forEach((element) => {
    allIDs.push(element.id);
  });

  if (data["meta"]["pagination"]["total"] > page) {
    for (let i: number = 2; i < data["meta"]["pagination"]["total"]; i++) {
      const fetchUrlP = `${API_URL}products?filters[active][$eq]=true&filters[deleted][$eq]=false&fields[0]=id&pagination[pageSize]=100&pagination[page]=${i}`;
      const responseP = await fetch(fetchUrlP, {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
      });
      const dataP = await responseP.json();
      dataP["data"].forEach((element) => {
        allIDs.push(element.id);
      });
    }
  }
  return allIDs;
}

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

export interface GetProductsParams {
  page: number;
  count?: number;
  category?: number;
  inStock?: boolean;
  search?: string;
  minvalue?: number;
  maxvalue?: number;
}

export async function getProducts({
  page,
  inStock,
  category,
  count = 30,
  search,
  minvalue,
  maxvalue,
}: GetProductsParams): Promise<[Product[], number, number, number]> {
  let categories: Category[] = await getCategories();

  let categoriesToSearch: number[] = getAllSubcategoryIds(categories, category);

  let fetchUrl: string =
    `${API_URL}products?` +
    (search ? "filters[name][$containsi]=" + search + "&" : "");

  var valuesValid: boolean = checkValues(minvalue, maxvalue);

  if (category) {
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
      fetchUrl += "filters[categories][id][$eq]=" + category + "&";
    }
  }

  fetchUrl += `filters[active][$eq]=true&filters[deleted][$eq]=false&`;

  const fetchUrlForValues = fetchUrl + "fields[0]=value&sort[0]=value:";

  if (valuesValid) {
    fetchUrl += `filters[$and][0][value][$gte]=${minvalue}&filters[$and][1][value][$lte]=${maxvalue}&`;
  }

  fetchUrl += `populate[document_products][fields][0]=amount&populate[shelves][fields][0]=stock&fields[0]=name&populate[categories][fields][0]=name&fields[2]=productLine&fields[3]=internalCode&fields[5]=value&fields[8]=description&populate[shelves][populate][supplier_order_products][fields][0]=amountOrdered&populate[shelves][populate][supplier_order_products][fields][1]=amountDelivered&fields[1]=depth&fields[4]=priceBeforeDiscount&fields[6]=width&fields[7]=height&fields[9]=material&fields[10]=color&fields[11]=supplierCode&fields[12]=imageDirections&populate[images][fields][0]=url&pagination[page]=${page}&pagination[pageSize]=${count}`;

  const response = await fetch(fetchUrl, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  });

  const data = await response.json();

  const sortedData: Product[] = data["data"].map(
    (productData) => productData as Product,
  );
  const totalPages = data["meta"]["pagination"]["pageCount"];

  var minValueFromAPI = 20;
  var maxValueFromAPI = 500;

  if (sortedData.length > 0) {
    const requestForMaxValue = await fetch(
      fetchUrlForValues + "desc&pagination[page]=1&pagination[pageSize]=1",
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
      },
    );

    const answerMaxValue = await requestForMaxValue.json();

    const requestForMinValue = await fetch(
      fetchUrlForValues + "asc&pagination[page]=1&pagination[pageSize]=1",
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
      },
    );
    const answerMinValue = await requestForMinValue.json();

    maxValueFromAPI = answerMaxValue.data[0].value;
    minValueFromAPI = answerMinValue.data[0].value;
  }

  return [sortedData, totalPages, minValueFromAPI, maxValueFromAPI];
}

export function calculateProductStock(product: Product): number {
  let calculatedStock: number = 0;

  if (!product.shelves) {
    return 0;
  } else {
    let initialStock: number = 0;
    product.shelves.forEach((shelf) => (initialStock += shelf.stock));
    let totalReceieved: number = 0;
    if (
      product.shelves.some((shelf) => shelf.supplier_order_products.length > 0)
    ) {
      product.shelves.forEach(
        (shelf) =>
          (totalReceieved += shelf.supplier_order_products["amountReceived"]),
      );
    }
    let totalSold: number = 0;
    if (product.document_products) {
      product.document_products.forEach(
        (docProd) => (totalSold += docProd["amount"]),
      );
    }
    calculatedStock = initialStock + totalReceieved - totalSold;
  }

  return calculatedStock;
}
