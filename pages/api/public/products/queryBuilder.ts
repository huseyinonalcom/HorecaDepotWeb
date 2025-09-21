type QueryPrimitive = string | number | boolean;

export type QueryValue =
  | QueryPrimitive
  | QueryPrimitive[]
  | QueryValueObject
  | QueryValueObject[];

export interface QueryValueObject {
  [key: string]: QueryValue | null | undefined;
}

export function setQueryParams(
  params: URLSearchParams,
  entries: Record<string, QueryValue | null | undefined>,
) {
  const assignValue = (key: string, value: QueryValue | null | undefined) => {
    if (value == null) {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        assignValue(`${key}[${index}]`, item as QueryValue);
      });
      return;
    }

    if (typeof value === "object") {
      Object.entries(value as QueryValueObject).forEach(
        ([childKey, childValue]) => {
          assignValue(`${key}[${childKey}]`, childValue ?? null);
        },
      );
      return;
    }

    params.set(key, String(value));
  };

  Object.entries(entries).forEach(([key, value]) => {
    assignValue(key, value);
  });
}

function isValidValueRange(minValue: number | null, maxValue: number | null) {
  if (minValue === null || maxValue === null) {
    return false;
  }

  const isMinValueValid = Number.isInteger(minValue) && minValue > 0;
  const isMaxValueValid = Number.isInteger(maxValue) && maxValue > 0;
  const isMinLessThanMax = minValue < maxValue;

  return isMinValueValid && isMaxValueValid && isMinLessThanMax;
}

export function applyStatusFilters(
  params: URLSearchParams,
  showInactive: boolean,
) {
  if (showInactive) {
    setQueryParams(params, {
      "filters[active][$eq]": "false",
      "filters[deleted][$eq]": "false",
    });
    return;
  }

  setQueryParams(params, {
    "filters[active][$eq]": "true",
    "filters[deleted][$eq]": "false",
  });
}

export function applyPriceFilters(
  params: URLSearchParams,
  minValue: number | null,
  maxValue: number | null,
) {
  if (
    !isValidValueRange(minValue, maxValue) ||
    minValue == null ||
    maxValue == null
  ) {
    return;
  }

  setQueryParams(params, {
    "filters[$and][0][value][$gte]": minValue,
    "filters[$and][1][value][$lte]": maxValue,
  });
}

export function applySearchFilter(
  params: URLSearchParams,
  searchTerm: string | null,
) {
  if (!searchTerm) {
    return;
  }

  setQueryParams(params, {
    "filters[name][$containsi]": searchTerm,
  });
}

export function applyCommonProductFields(params: URLSearchParams) {
  setQueryParams(params, {
    populate: {
      document_products: { fields: ["amount"] },
      shelves: {
        fields: ["stock"],
        populate: {
          establishment: { fields: ["id"] },
        },
      },
      categories: { fields: ["localized_name", "code", "priority"] },
      images: { fields: ["url"] },
      product_extra: {
        fields: [
          "new",
          "tags",
          "weight",
          "per_box",
          "packaged_weight",
          "packaged_dimensions",
          "seat_height",
          "diameter",
          "surface_area",
          "packaged_weight_net",
          "barcode",
          "armrest_height",
        ],
      },
    },
    fields: [
      "name",
      "internalCode",
      "value",
      "priceBeforeDiscount",
      "color",
      "imageDirections",
      "localized_name",
      "stock",
      "views",
      "supplierCode",
      "depth",
      "width",
      "height",
      "material",
      "active",
    ],
  });
}

export const buildApiUrl = (
  baseParams: URLSearchParams,
  extraParams?: (params: URLSearchParams) => void,
) => {
  const params = new URLSearchParams(baseParams);

  if (extraParams) {
    extraParams(params);
  }

  return `${process.env.API_URL}/api/products?${params.toString()}`;
};
