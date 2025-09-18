import type { NextApiRequest, NextApiResponse } from "next";
import { getAllSubcategoriesOfCategory } from "../../public/categories/getallsubcategoriesofcategory";
import { getCategoryFromString } from "../../public/categories/getcategoryfromstring";
import { Product } from "../../../../api/interfaces/product";
import statusText from "../../../../api/statustexts";
import {
  applyCommonProductFields,
  applyPriceFilters,
  applySearchFilter,
  applyStatusFilters,
  buildApiUrl,
  setQueryParams,
} from "./queryBuilder";

function getQueryValue(value: unknown): string | null {
  if (value == null) {
    return null;
  }

  if (Array.isArray(value)) {
    return value.length > 0 && value[0] != null ? String(value[0]) : null;
  }

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  return null;
}

function parseNumberParam(value: unknown): number | null {
  const queryValue = getQueryValue(value);
  if (queryValue == null) {
    return null;
  }

  const parsed = Number(queryValue);
  return Number.isNaN(parsed) ? null : parsed;
}

function isTruthyQueryParam(value: unknown): boolean {
  const queryValue = getQueryValue(value);
  if (queryValue == null) {
    return false;
  }
  const normalized = queryValue.trim().toLowerCase();
  if (["true", "1", "yes", "on"].includes(normalized)) {
    return true;
  }
  if (["false", "0", "no", "off"].includes(normalized)) {
    return false;
  }
  return false;
}

async function resolveCategoryId(rawCategory: unknown): Promise<number | null> {
  const categoryValue = getQueryValue(rawCategory);

  if (!categoryValue) {
    return null;
  }

  const decodedCategory = decodeURIComponent(categoryValue);

  if (decodedCategory === "tous") {
    return null;
  }

  const numericCategory = Number(decodedCategory);

  if (!Number.isNaN(numericCategory)) {
    return numericCategory;
  }

  const category = await getCategoryFromString({ category: decodedCategory });
  return category.id;
}

async function applyCategoryFilters(
  params: URLSearchParams,
  categoryId: number | null,
) {
  if (!categoryId) {
    return;
  }

  const categoriesToSearch = await getAllSubcategoriesOfCategory({
    id: categoryId,
  });

  const categoryIds =
    Array.isArray(categoriesToSearch) && categoriesToSearch.length > 0
      ? categoriesToSearch
      : [categoryId];

  categoryIds.forEach((categoryIdValue, index) => {
    params.append(
      `filters[categories][id][$in][${index}]`,
      categoryIdValue.toString(),
    );
  });
}

type RequestWithQuery = { query: Record<string, unknown> };

export async function getProducts(req: RequestWithQuery) {
  const pageParam = getQueryValue(req.query.page) ?? "1";
  const minValueParam = parseNumberParam(req.query.minprice);
  const maxValueParam = parseNumberParam(req.query.maxprice);
  const searchParam = getQueryValue(req.query.search);
  const sortParam = getQueryValue(req.query.sort);
  const countParam = getQueryValue(req.query.count);
  const getLimitsParam = isTruthyQueryParam(req.query.getlimits);
  const showInactive = isTruthyQueryParam(req.query.showinactive);

  try {
    const categoryId = await resolveCategoryId(req.query.category);

    const baseFilterParams = new URLSearchParams();
    applySearchFilter(baseFilterParams, searchParam);
    await applyCategoryFilters(baseFilterParams, categoryId);
    applyStatusFilters(baseFilterParams, showInactive);

    const filtersForValues = new URLSearchParams(baseFilterParams);

    applyPriceFilters(baseFilterParams, minValueParam, maxValueParam);

    const productParams = new URLSearchParams(baseFilterParams);
    applyCommonProductFields(productParams);
    setQueryParams(productParams, {
      "pagination[page]": pageParam.toString(),
      "sort[0]": sortParam ?? null,
      "pagination[pageSize]": countParam ?? null,
    });

    const fetchUrl = buildApiUrl(productParams);

    console.log({ productParams });
    const response = await fetch(fetchUrl, {
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
    });

    const data = await response.json();
    const sortedData: Product[] = data["data"];
    const totalPages = data["meta"]["pagination"]["pageCount"];

    let minValueFromAPI = 1;
    let maxValueFromAPI = 9999;

    if (sortedData.length > 0 && getLimitsParam) {
      const valuesParamsBase = new URLSearchParams(filtersForValues);
      valuesParamsBase.set("fields[0]", "value");
      valuesParamsBase.set("pagination[page]", "1");
      valuesParamsBase.set("pagination[pageSize]", "1");

      const [answerMaxValue, answerMinValue] = await Promise.all([
        fetch(
          buildApiUrl(valuesParamsBase, (params) => {
            params.set("sort[0]", "value:desc");
          }),
          {
            headers: { Authorization: `Bearer ${process.env.API_KEY}` },
          },
        ).then((res) => res.json()),
        fetch(
          buildApiUrl(valuesParamsBase, (params) => {
            params.set("sort[0]", "value:asc");
          }),
          {
            headers: { Authorization: `Bearer ${process.env.API_KEY}` },
          },
        ).then((res) => res.json()),
      ]);

      maxValueFromAPI = answerMaxValue.data[0].value;
      minValueFromAPI = answerMinValue.data[0].value;
    }

    const currentCategoryID = categoryId;

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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
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
