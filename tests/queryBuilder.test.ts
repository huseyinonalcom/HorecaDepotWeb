import { test } from "node:test";
import assert from "node:assert/strict";
import {
  setQueryParams,
  applyStatusFilters,
  applyPriceFilters,
  applySearchFilter,
  applyCommonProductFields,
  buildApiUrl,
} from "../pages/api/public/products/queryBuilder";

process.env.API_URL = process.env.API_URL ?? "https://example.com";

test("setQueryParams flattens nested objects and arrays", () => {
  const params = new URLSearchParams();

  setQueryParams(params, {
    populate: {
      document_products: { fields: ["amount"] },
      shelves: {
        fields: ["stock"],
        populate: {
          supplier_order_products: { fields: ["amount"] },
        },
      },
    },
    fields: ["name", "value"],
    filters: [
      { categories: { id: { $eq: 10 } } },
      { categories: { id: { $eq: 11 } } },
    ],
  });

  const expected =
    "populate[document_products][fields][0]=amount&" +
    "populate[shelves][fields][0]=stock&" +
    "populate[shelves][populate][supplier_order_products][fields][0]=amount&" +
    "fields[0]=name&fields[1]=value&" +
    "filters[0][categories][id][$eq]=10&" +
    "filters[1][categories][id][$eq]=11";

  assert.equal(decodeURIComponent(params.toString()), expected);
});

test("applyStatusFilters toggles active/deleted flags", () => {
  const paramsActive = new URLSearchParams();
  applyStatusFilters(paramsActive, false);
  assert.equal(
    decodeURIComponent(paramsActive.toString()),
    "filters[active][$eq]=true&filters[deleted][$eq]=false",
  );

  const paramsInactive = new URLSearchParams();
  applyStatusFilters(paramsInactive, true);
  assert.equal(
    decodeURIComponent(paramsInactive.toString()),
    "filters[deleted][$eq]=false",
  );
});

test("applyPriceFilters sets range when values are valid", () => {
  const params = new URLSearchParams();
  applyPriceFilters(params, 100, 500);
  assert.equal(
    decodeURIComponent(params.toString()),
    "filters[$and][0][value][$gte]=100&filters[$and][1][value][$lte]=500",
  );

  const skipParams = new URLSearchParams();
  applyPriceFilters(skipParams, null, 500);
  assert.equal(skipParams.toString(), "");

  const invalidParams = new URLSearchParams();
  applyPriceFilters(invalidParams, 600, 500);
  assert.equal(invalidParams.toString(), "");
});

test("applySearchFilter sets contains filter when search term provided", () => {
  const params = new URLSearchParams();
  applySearchFilter(params, "chair");
  assert.equal(
    decodeURIComponent(params.toString()),
    "filters[name][$containsi]=chair",
  );

  const emptyParams = new URLSearchParams();
  applySearchFilter(emptyParams, null);
  assert.equal(emptyParams.toString(), "");
});

test("applyCommonProductFields sets expected populate fields", () => {
  const params = new URLSearchParams();
  applyCommonProductFields(params);
  const expected =
    "populate[document_products][fields][0]=amount&" +
    "populate[shelves][fields][0]=stock&" +
    "populate[shelves][populate][supplier_order_products][fields][0]=amount&" +
    "populate[categories][fields][0]=localized_name&" +
    "populate[images][fields][0]=url&" +
    "populate[product_extra][fields][0]=new&" +
    "populate[product_extra][fields][1]=tags&" +
    "fields[0]=name&fields[1]=internalCode&fields[2]=value&" +
    "fields[3]=priceBeforeDiscount&fields[4]=color&fields[5]=imageDirections&" +
    "fields[6]=localized_name&fields[7]=stock&fields[8]=views&" +
    "fields[9]=supplierCode&fields[10]=active";

  assert.equal(decodeURIComponent(params.toString()), expected);
});

test("buildApiUrl clones params and applies overrides", () => {
  const params = new URLSearchParams("filters[deleted][$eq]=false");
  const url = buildApiUrl(params, (mutable) => {
    mutable.set("pagination[page]", "2");
  });

  assert.match(url, /^https?:\/\//);
  assert(url.includes("filters%5Bdeleted%5D%5B%24eq%5D=false"));
  assert(url.includes("pagination%5Bpage%5D=2"));
  assert.equal(params.get("pagination[page]"), null);
});
