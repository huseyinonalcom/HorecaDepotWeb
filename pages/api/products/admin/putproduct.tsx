import { Product } from "../../../../api/interfaces/product";
import { NextApiRequest, NextApiResponse } from "next";
import statusText from "../../../../api/statustexts";

export default async function putProduct(
  req: NextApiRequest,
  res: NextApiResponse,
) {
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

  const prodID = body.id;
  let prodExtraID = Number(req.query.extraid);

  if (!prodID) {
    return res.status(401).json(statusText[401]);
  }

  if (req.method === "PUT") {
    const prodToPost = body as Product;

    if (!prodExtraID) {
      prodExtraID = prodToPost.product_extra.id;
    }

    if (!prodExtraID) {
      return res.status(401).json(statusText[401]);
    }

    try {
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
          body: JSON.stringify({
            data: {
              name: prodToPost.name,
              categories: prodToPost.categories.map((cat) => cat.id),
              description: prodToPost.description,
              supplierCode: prodToPost.supplierCode.toString() ?? "0",
              internalCode: prodToPost.internalCode ?? "0",
              value: prodToPost.value ?? 0,
              tax: 21,
              width: prodToPost.width ?? 0,
              depth: prodToPost.depth ?? 0,
              minStock: 0,
              supplier: prodToPost.supplier.id,
              images:
                prodToPost.images &&
                prodToPost.images.length > 0 &&
                prodToPost.images.map((img) => img.id),
              minOrder: 0,
              height: prodToPost.height ?? 0,
              product_color: prodToPost.product_color?.id,
              material: prodToPost.material,
              discountRange: prodToPost.discountRange ?? 0,
              imageDirections: prodToPost.imageDirections ?? {
                l: 0,
                r: 0,
                f: 0,
                b: 0,
                fl: 0,
                fr: 0,
                d: 0,
              },
              priceBeforeDiscount:
                prodToPost.priceBeforeDiscount ?? prodToPost.value ?? 0,
            },
          }),
        },
      );

      if (!response.ok) {
        return res.status(400).json(statusText[400]);
      } else {
        const response2 = await fetch(
          `${process.env.API_URL}/api/product-extras/${prodExtraID}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: authToken,
            },
            body: JSON.stringify({
              data: {
                weight: prodToPost.product_extra.weight ?? 0,
                per_box: prodToPost.product_extra.per_box ?? 0,
                packaged_weight: prodToPost.product_extra.packaged_weight ?? 0,
                packaged_dimensions:
                  prodToPost.product_extra.packaged_dimensions?.toString(),
                seat_height: prodToPost.product_extra.seat_height ?? 0,
                diameter: prodToPost.product_extra.diameter ?? 0,
                tags: prodToPost.product_extra.tags,
                barcode: prodToPost.product_extra.barcode.toString(),
                armrest_height: prodToPost.product_extra.armrest_height,
                packaged_weight_net:
                  prodToPost.product_extra.packaged_weight_net ?? 0,
              },
            }),
            redirect: "follow",
          },
        );

        if (!response2.ok) {
          return res.status(400).json(statusText[400]);
        } else {
          prodToPost.shelves.forEach(async (shelf) => {
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
            if (!reqShelf.ok) {
              return res.status(500).json("error in shelf requests");
            }
          });
        }
      }
    } catch (error) {
      return res.status(500).json(statusText[500]);
    }

    return res.status(200).json(statusText[200]);
  } else {
    return res.status(405).json(statusText[405]);
  }
}
