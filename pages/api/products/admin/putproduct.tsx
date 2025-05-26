import { Product } from "../../../../api/interfaces/product";
import { NextApiRequest, NextApiResponse } from "next";
import statusText from "../../../../api/statustexts";
import { getProductByID } from "./getproductbyid";

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

  const prod = await getProductByID(authToken, prodID);

  let shelves = prod.shelves;

  shelves.at(0).stock = stock;
  for (let i = 1; i < shelves.length; i++) {
    shelves.at(i).stock = 0;
  }

  result = await updateShelves(authToken, { shelves: shelves });

  return result;
};

const findProductExtraID = async (prodID: number, authToken: string) => {
  const response = await fetch(
    `${process.env.API_URL}/api/products/${prodID}?fields[0]=name&fields[1]=supplierCode&fields[2]=internalCode&fields[3]=value&fields[4]=depth&fields[5]=width&fields[6]=height&fields[7]=material&fields[8]=color&fields[9]=priceBeforeDiscount&fields[10]=active&fields[11]=description&fields[12]=imageDirections&populate[product_extra][fields][0]=*&populate[categories][fields][0]=localized_name&populate[categories][fields][1]=code&populate[images][fields][0]=name&populate[images][fields][1]=url&populate[shelves][fields][0]=stock&populate[shelves][populate][establishment][fields][0]=id&populate[reservations][fields][0]=client_name&populate[reservations][fields][1]=amount&populate[reservations][fields][2]=is_deleted&populate[supplier][fields][0]=name&populate[product_color][fields][0]=name`,
    {
      method: "GET",
      headers: {
        Authorization: authToken,
      },
    },
  );

  const data = await response.json();

  return data.data.product_extra.id;
};

export default async function putProduct(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  let result = {
    product: "Not Updated",
    productExtra: "Not Updated",
    shelves: "Not Updated",
    stock: "Not Updated",
  };
  let authToken = req.cookies.j;
  let body = req.body;

  if (req.body.data) {
    body = req.body.data;
  }

  if (!authToken) {
    authToken = req.headers.authorization;
  } else {
    authToken = `Bearer ${authToken}`;
  }

  if (!authToken) {
    return res.status(401).json(statusText[401]);
  }

  if (req.method === "PUT") {
    const prodID = req.query.id ?? body.id;

    if (!prodID) {
      return res.status(400).json(statusText[400]);
    }

    const prodToPost = body as Product;

    let prodExtraID = Number(req.query.extraid);

    if (!prodExtraID) {
      try {
        prodExtraID = prodToPost.product_extra.id;
      } catch {}
    }

    if (!prodExtraID) {
      try {
        prodExtraID = await findProductExtraID(prodID, authToken);
      } catch {}
    }

    try {
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
    } catch (error) {
      console.error(error);
      return res.status(500).json(statusText[500]);
    }

    return res.status(200).json(result);
  } else {
    return res.status(405).json(statusText[405]);
  }
}
