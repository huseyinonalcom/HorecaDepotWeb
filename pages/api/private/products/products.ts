import { apiUrl } from "../../../../api/api/constants";
import apiRoute from "../../../../api/api/apiRoute";
import { Product } from "../../../../api/interfaces/product";

const fetchUrl = `${apiUrl}/api/products`;

const fetchParams =
  "fields[0]=name&fields[1]=supplierCode&fields[2]=internalCode&fields[3]=value&fields[4]=depth&fields[5]=width&fields[6]=height&fields[7]=material&fields[8]=color&fields[9]=priceBeforeDiscount&fields[10]=active&fields[11]=imageDirections&fields[12]=localized_name&fields[13]=tax&fields[14]=reserved&fields[15]=views&fields[16]=currentstock&populate[product_extra][fields][0]=weight&populate[product_extra][fields][1]=per_box&populate[product_extra][fields][2]=packaged_weight&populate[product_extra][fields][3]=packaged_dimensions&populate[product_extra][fields][4]=seat_height&populate[product_extra][fields][5]=diameter&populate[product_extra][fields][6]=surface_area&populate[product_extra][fields][7]=packaged_weight_net&populate[product_extra][fields][8]=barcode&populate[product_extra][fields][9]=armrest_height&populate[categories][fields][0]=localized_name&populate[categories][fields][1]=code&populate[shelves][fields][0]=stock&populate[shelves][populate][establishment][fields][0]=id&populate[images][fields][0]=url&populate[product_color][fields][0]=name";

const toSafeNumber = (value: unknown) => {
  const parsed = Number(value ?? 0);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const calculateCurrentStock = (shelves: Product["shelves"]) => {
  if (!Array.isArray(shelves)) {
    return undefined;
  }

  return shelves.reduce((total, shelf) => {
    return total + toSafeNumber(shelf?.stock);
  }, 0);
};

const hasBearerPrefix = (token: string) => /^Bearer\s+/i.test(token);

const stripBearerPrefix = (token: string) =>
  hasBearerPrefix(token) ? token.replace(/^Bearer\s+/i, "") : token;

const buildAuthHeader = (token: string) =>
  hasBearerPrefix(token) ? token : `Bearer ${token}`;

const normalizeAuthToken = (token?: string) => {
  const providedToken = token ?? process.env.API_KEY;

  if (!providedToken) {
    throw new Error("Missing authorization token");
  }

  const raw = stripBearerPrefix(providedToken);

  return {
    raw,
    header: buildAuthHeader(raw),
  };
};

export const getProducts = async ({
  authToken,
  category,
  search,
  count,
  page,
  ean,
  id,
}: {
  category?: string;
  authToken: string;
  search?: string;
  count?: string;
  page?: number;
  ean?: string;
  id?: number;
}) => {
  if (!authToken) {
    authToken = process.env.API_KEY;
  }
  try {
    if (id) {
      const request = await fetch(fetchUrl + "/" + id + "?" + fetchParams, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!request.ok) {
        throw new Error(await request.text());
      }

      const response = await request.json();
      return response.data;
    }

    if (ean) {
      const request = await fetch(
        fetchUrl + "?" + fetchParams + "&filters[supplierCode][$eq]=" + ean,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      );

      if (!request.ok) {
        throw new Error(await request.text());
      }

      const response = await request.json();
      return response.data;
    }

    const pageString = "&pagination[page]=" + (page ?? 1);
    const sort = "&sort=name";
    const pageSize = `&pagination[pageSize]=${count ?? "15"}`;
    let searchString = "";
    let categoryString = "";

    if (search) {
      searchString = `&filters[$or][0][name][$containsi]=${search}&filters[$or][1][supplierCode][$containsi]=${search}&filters[$or][2][internalCode][$containsi]=${search}`;
    }

    if (category && category != "0" && category != "null") {
      categoryString = `&filters[categories][id][$eq]=${category}`;
    }

    const request = await fetch(
      fetchUrl +
        "?filters[deleted][$eq]=false&" +
        fetchParams +
        categoryString +
        pageString +
        sort +
        searchString +
        pageSize,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    );

    if (!request.ok) {
      throw new Error(await request.text());
    }

    const response = await request.json();

    return response;
  } catch (error) {
    console.error(error);
    throw "Failed to fetch products";
  }
};

export async function deleteProduct({
  id,
  authToken,
}: {
  id: number;
  authToken: string;
}) {
  let body = {
    data: {
      deleted: true,
    },
  };
  const response = await fetch(`${fetchUrl}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(body),
    redirect: "follow",
  });

  if (!response.ok) {
    throw new Error("Failed to delete product");
  } else {
    return { result: true };
  }
}

const updateProductMain = async (
  prodID: number,
  authToken: string,
  prodToPost: Product,
) => {
  let body = {
    data: {},
  };

  if (prodToPost.name != null && prodToPost.name != undefined) {
    body.data = {
      ...body.data,
      name: prodToPost.name,
    };
  }

  if (prodToPost.categories) {
    body.data = {
      ...body.data,
      categories: prodToPost.categories.map((cat) => cat.id),
    };
  }

  if (prodToPost.color) {
    body.data = {
      ...body.data,
      color: prodToPost.color,
    };
  }

  body.data = {
    ...body.data,
    description: prodToPost.description,
  };

  if (prodToPost.supplierCode != null && prodToPost.supplierCode != undefined) {
    body.data = {
      ...body.data,
      supplierCode: prodToPost.supplierCode.toString() ?? "0",
    };
  }

  if (prodToPost.internalCode != null && prodToPost.internalCode != undefined) {
    body.data = {
      ...body.data,
      internalCode: prodToPost.internalCode ?? "0",
    };
  }

  if (prodToPost.value != null && prodToPost.value != undefined) {
    body.data = {
      ...body.data,
      value: prodToPost.value ?? 0,
    };
  }

  if (prodToPost.tax != null && prodToPost.tax != undefined) {
    body.data = {
      ...body.data,
      tax: prodToPost.tax ?? 0,
    };
  }

  if (prodToPost.width != null && prodToPost.width != undefined) {
    body.data = {
      ...body.data,
      width: prodToPost.width ?? 0,
    };
  }

  if (prodToPost.depth != null && prodToPost.depth != undefined) {
    body.data = {
      ...body.data,
      depth: prodToPost.depth ?? 0,
    };
  }

  if (prodToPost.minStock != null && prodToPost.minStock != undefined) {
    body.data = {
      ...body.data,
      minStock: 0,
    };
  }

  if (prodToPost.supplier) {
    body.data = {
      ...body.data,
      supplier: prodToPost.supplier.id,
    };
  }

  if (prodToPost.images) {
    body.data = {
      ...body.data,
      images:
        prodToPost.images &&
        prodToPost.images.length > 0 &&
        prodToPost.images.map((img) => img.id),
    };
  }

  if (prodToPost.minOrder != null && prodToPost.minOrder != undefined) {
    body.data = {
      ...body.data,
      minOrder: 0,
    };
  }

  if (prodToPost.height != null && prodToPost.height != undefined) {
    body.data = {
      ...body.data,
      height: prodToPost.height ?? 0,
    };
  }

  if (prodToPost.product_color) {
    body.data = {
      ...body.data,
      product_color: prodToPost.product_color?.id,
    };
  }

  body.data = {
    ...body.data,
    material: prodToPost.material,
  };

  if (
    prodToPost.discountRange != null &&
    prodToPost.discountRange != undefined
  ) {
    body.data = {
      ...body.data,
      discountRange: prodToPost.discountRange ?? 0,
    };
  }

  if (prodToPost.imageDirections) {
    body.data = {
      ...body.data,
      imageDirections: prodToPost.imageDirections ?? {
        l: 0,
        r: 0,
        f: 0,
        b: 0,
        fl: 0,
        fr: 0,
        d: 0,
      },
    };
  }

  if (
    prodToPost.priceBeforeDiscount != null &&
    prodToPost.priceBeforeDiscount != undefined
  ) {
    body.data = {
      ...body.data,
      priceBeforeDiscount:
        prodToPost.priceBeforeDiscount ?? prodToPost.value ?? 0,
    };
  }

  if (prodToPost.active != null && prodToPost.active != undefined) {
    body.data = {
      ...body.data,
      active: prodToPost.active,
    };
  }

  if (prodToPost.localized_description) {
    body.data = {
      ...body.data,
      localized_description: prodToPost.localized_description,
    };
  }

  if (prodToPost.localized_name) {
    body.data = {
      ...body.data,
      localized_name: prodToPost.localized_name,
    };
  } else {
    body.data = {
      ...body.data,
      localized_name: {
        en: prodToPost.name,
        nl: prodToPost.name,
        fr: prodToPost.name,
        de: prodToPost.name,
      },
    };
  }

  if (prodToPost.reserved != null && prodToPost.reserved != undefined) {
    body.data = {
      ...body.data,
      reserved: prodToPost.reserved ?? 0,
    };
  }

  if (prodToPost.currentstock != null && prodToPost.currentstock != undefined) {
    body.data = {
      ...body.data,
      currentstock: toSafeNumber(prodToPost.currentstock),
    };
  }

  const response = await fetch(
    `${process.env.API_URL}/api/products/${prodID}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: authToken,
      },
      redirect: "follow",
      body: JSON.stringify(body),
    },
  );

  return response;
};

const updateProductExtra = async (
  prodExtraID: number,
  authToken: string,
  prodToPost: Product,
) => {
  let body = {
    data: {},
  };

  if (prodToPost.product_extra.new) {
    body.data = {
      ...body.data,
      new: prodToPost.product_extra.new,
    };
  }

  if (prodToPost.product_extra.weight) {
    body.data = {
      ...body.data,
      weight: prodToPost.product_extra.weight ?? 0,
    };
  }

  if (prodToPost.product_extra.per_box) {
    body.data = {
      ...body.data,
      per_box: prodToPost.product_extra.per_box ?? 0,
    };
  }

  if (prodToPost.product_extra.packaged_weight) {
    body.data = {
      ...body.data,
      packaged_weight: prodToPost.product_extra.packaged_weight ?? 0,
    };
  }

  if (prodToPost.product_extra.packaged_dimensions) {
    body.data = {
      ...body.data,
      packaged_dimensions:
        prodToPost.product_extra.packaged_dimensions?.toString(),
    };
  }

  if (prodToPost.product_extra.seat_height) {
    body.data = {
      ...body.data,
      seat_height: prodToPost.product_extra.seat_height ?? 0,
    };
  }

  if (prodToPost.product_extra.diameter) {
    body.data = {
      ...body.data,
      diameter: prodToPost.product_extra.diameter ?? 0,
    };
  }

  if (prodToPost.product_extra.tags) {
    body.data = {
      ...body.data,
      tags: prodToPost.product_extra.tags,
    };
  }

  if (prodToPost.product_extra.barcode) {
    body.data = {
      ...body.data,
      barcode: prodToPost.product_extra.barcode.toString(),
    };
  }

  if (prodToPost.product_extra.armrest_height) {
    body.data = {
      ...body.data,
      armrest_height: prodToPost.product_extra.armrest_height,
    };
  }

  if (prodToPost.product_extra.packaged_weight_net) {
    body.data = {
      ...body.data,
      packaged_weight_net: prodToPost.product_extra.packaged_weight_net ?? 0,
    };
  }

  const response = await fetch(
    `${process.env.API_URL}/api/product-extras/${prodExtraID}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: authToken,
      },
      body: JSON.stringify(body),
      redirect: "follow",
    },
  );

  return response;
};

const updateShelves = async (authToken: string, prodToPost: Product) => {
  let result = "Not Updated";

  const shelfUpdatePromises = prodToPost.shelves.map(async (shelf) => {
    const reqShelf = await fetch(
      `${process.env.API_URL}/api/shelves/` + shelf.id,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: authToken,
        },
        body: JSON.stringify({
          data: {
            stock: shelf.stock ?? 0,
          },
        }),
      },
    );

    if (reqShelf.ok) {
      if (result === "Not Updated") {
        result = "Updated";
      }
    } else {
      if (result === "Updated") {
        result = "Partially Updated";
      } else {
        result = "Not Updated";
      }
    }
  });

  await Promise.all(shelfUpdatePromises);

  return result;
};

const updateStock = async (
  authToken: string,
  prodID: number,
  stock: number,
) => {
  let result = "Not Updated";

  const prod = await getProducts({ authToken, id: prodID });

  let shelves = prod.shelves;

  shelves.at(0).stock = stock;
  for (let i = 1; i < shelves.length; i++) {
    shelves.at(i).stock = 0;
  }

  result = await updateShelves(authToken, { shelves: shelves });

  return result;
};

export async function updateProduct({
  authToken,
  data,
  id,
  extraid,
}: {
  authToken: string;
  data: any;
  id: number;
  extraid: number;
}) {
  let result = {
    product: "Not Updated",
    productExtra: "Not Updated",
    shelves: "Not Updated",
    stock: "Not Updated",
  };
  let body = data;

  authToken = `Bearer ${authToken}`;

  const prodID = Number(id);

  const prodToPost = body as Product;

  const shelvesCurrentStock = calculateCurrentStock(prodToPost.shelves);

  if (shelvesCurrentStock !== undefined) {
    prodToPost.currentstock = shelvesCurrentStock;
  } else if (prodToPost.stock == 0 || prodToPost.stock) {
    prodToPost.currentstock = toSafeNumber(prodToPost.stock);
  }

  let prodExtraID = Number(extraid);

  const response = await updateProductMain(prodID, authToken, prodToPost);

  if (response.ok) {
    result.product = "Updated";
  }

  if (prodExtraID && prodToPost.product_extra) {
    const response2 = await updateProductExtra(
      prodExtraID,
      authToken,
      prodToPost,
    );

    if (response2.ok) {
      result.productExtra = "Updated";
    }
  }

  if (prodToPost.shelves && prodToPost.shelves.length > 0) {
    result.shelves = await updateShelves(authToken, prodToPost);
  }

  if (prodToPost.stock == 0 || prodToPost.stock) {
    result.stock = await updateStock(authToken, prodID, prodToPost.stock);
  }

  return { result: true };
}

export async function postProduct({
  authToken,
  data,
}: {
  authToken: string;
  data: any;
}) {
  let postedID = 0;
  const prodToPost = data;

  const fetchUrl = `${process.env.API_URL}/api/products`;
  const reqProd = await fetch(fetchUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      data: {
        name: prodToPost.name,
        active: true,
        deleted: false,
        categories: prodToPost.categories.map((cat) => cat.id),
        description: prodToPost.description,
        localized_description: prodToPost.localized_description,
        localized_name: prodToPost.localized_name,
        supplierCode: prodToPost.supplierCode.toString() ?? "0",
        internalCode: prodToPost.internalCode ?? "0",
        value: prodToPost.value ?? 0,
        tax: 21,
        width: prodToPost.width ?? 0,
        depth: prodToPost.depth ?? 0,
        minStock: 0,
        minOrder: 0,
        supplier: prodToPost.supplier.id,
        images:
          prodToPost.images &&
          prodToPost.images.length > 0 &&
          prodToPost.images.map((img) => img.id),
        height: prodToPost.height ?? 0,
        product_color: prodToPost.product_color?.id,
        material: prodToPost.material,
        imageDirections: prodToPost.imageDirections ?? {
          l: 0,
          r: 0,
          f: 0,
          b: 0,
          fl: 0,
          fr: 0,
          d: 0,
        },
        discountRange: prodToPost.discountRange ?? 0,
        priceBeforeDiscount:
          prodToPost.priceBeforeDiscount ?? prodToPost.value ?? 0,
      },
    }),
  });

  if (!reqProd.ok) {
    const answer = await reqProd.text();
    throw new Error("failed to create product");
  } else {
    const answer = await reqProd.json();
    prodToPost.id = answer.data.id;
    postedID = answer.data.id;
    const fetchUrl2 = `${process.env.API_URL}/api/product-extras`;
    const response2 = await fetch(fetchUrl2, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        data: {
          product: prodToPost.id,
          weight: prodToPost.product_extra.weight ?? 0,
          per_box: prodToPost.product_extra.per_box ?? 0,
          packaged_weight: prodToPost.product_extra.packaged_weight ?? 0,
          packaged_dimensions:
            prodToPost.product_extra.packaged_dimensions?.toString(),
          seat_height: prodToPost.product_extra.seat_height ?? 0,
          diameter: prodToPost.product_extra.diameter ?? 0,
          barcode: prodToPost.product_extra.barcode.toString(),
          tags: prodToPost.product_extra.tags,
          armrest_height: prodToPost.product_extra.armrest_height,
          packaged_weight_net:
            prodToPost.product_extra.packaged_weight_net ?? 0,
        },
      }),
    });

    if (!response2.ok) {
      throw new Error("failed to create product-extras");
    } else {
      const fetchUrlShelves = `${process.env.API_URL}/api/shelves`;
      const reqShelf1 = await fetch(fetchUrlShelves, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          data: {
            product: prodToPost.id,
            stock: 0,
            establishment: 1,
          },
        }),
      });
      const reqShelf2 = await fetch(fetchUrlShelves, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          data: {
            product: prodToPost.id,
            stock: 0,
            establishment: 3,
          },
        }),
      });
      if (!reqShelf1.ok || !reqShelf2.ok) {
        throw new Error("failed to create shelves");
      }
    }
  }

  return { result: { id: postedID } };
}

type SyncProductsResult = {
  processed: number;
  updated: number;
  failures: Array<{
    id: number;
    reason: string;
  }>;
};

export async function syncAllProductsCurrentStock({
  authToken,
  pageSize = 1000,
}: {
  authToken?: string;
  pageSize?: number;
}): Promise<SyncProductsResult> {
  const { header } = normalizeAuthToken(authToken);
  console.log("syncAllProductsCurrentStock:start", {
    pageSize,
  });

  let page = 1;
  let processed = 0;
  let updated = 0;
  const failures: SyncProductsResult["failures"] = [];
  const seenProductIds = new Set<number>();

  while (true) {
    const pagedParams =
      `${fetchParams}&pagination[page]=${page}&pagination[pageSize]=${pageSize}`;

    console.log("syncAllProductsCurrentStock:fetchPage", { page });

    const response = await fetch(`${fetchUrl}?${pagedParams}`, {
      headers: {
        Authorization: header,
      },
    });

    if (!response.ok) {
      const details = await response.text();
      console.error("syncAllProductsCurrentStock:fetchError", {
        page,
        details,
      });
      throw new Error(`Failed to fetch products: ${details}`);
    }

    const payload = await response.json();
    const products: Product[] = Array.isArray(payload?.data)
      ? payload.data
      : [];

    if (products.length === 0) {
      console.log("syncAllProductsCurrentStock:noMoreProducts", { page });
      break;
    }

    for (const product of products) {
      const productId = toSafeNumber(product?.id);

      if (!productId || seenProductIds.has(productId)) {
        continue;
      }

      seenProductIds.add(productId);
      processed += 1;

      const shelvesTotal = calculateCurrentStock(product?.shelves) ?? 0;
      const currentValue = toSafeNumber(product?.currentstock);

      if (currentValue === shelvesTotal) {
        continue;
      }

      console.log("syncAllProductsCurrentStock:updateProduct", {
        productId,
        currentValue,
        shelvesTotal,
      });

      const updateResponse = await fetch(
        `${process.env.API_URL}/api/products/${productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: header,
          },
          body: JSON.stringify({
            data: {
              currentstock: shelvesTotal,
            },
          }),
        },
      );

      if (updateResponse.ok) {
        console.log("syncAllProductsCurrentStock:updateSuccess", {
          productId,
        });
        updated += 1;
      } else {
        let reason = "Failed to update product current stock";

        try {
          reason = await updateResponse.text();
        } catch (error) {
          console.error(error);
        }

        console.error("syncAllProductsCurrentStock:updateFailure", {
          productId,
          reason,
        });
        failures.push({ id: productId, reason });
      }
    }

    const pagination = payload?.meta?.pagination;

    if (!pagination || page >= toSafeNumber(pagination?.pageCount)) {
      break;
    }

    console.log("syncAllProductsCurrentStock:nextPage", {
      currentPage: page,
      pageCount: pagination?.pageCount,
    });
    page += 1;
  }

  const summary = {
    processed,
    updated,
    failures,
  };

  console.log("syncAllProductsCurrentStock:complete", summary);

  return summary;
}

export default apiRoute({
  endpoints: {
    GET: {
      func: async (req, res) => {
        return await getProducts({
          authToken: req.cookies.j,
          ean: req.query.ean as string,
          id: Number(req.query.id as string),
          page: Number(req.query.page as string),
          category: req.query.category as string,
          search: req.query.search as string,
          count: req.query.count as string,
        });
      },
    },
    PUT: {
      func: async (req, res) => {
        return await updateProduct({
          authToken: req.cookies.j,
          data: req.body,
          id: Number(req.query.id as string),
          extraid: Number(req.query.extraid as string),
        });
      },
    },
    DELETE: {
      func: async (req, res) => {
        return await deleteProduct({
          authToken: req.cookies.j,
          id: Number(req.query.id as string),
        });
      },
    },
    POST: {
      func: async (req, res) => {
        return await postProduct({
          authToken: req.cookies.j,
          data: req.body,
        });
      },
    },
  },
});
