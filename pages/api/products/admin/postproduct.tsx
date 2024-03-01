import { NextApiRequest, NextApiResponse } from "next";

import { Product } from "../../../../api/interfaces/product";

export default async function postProduct(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const cookies = req.cookies;
  const authToken = cookies.j;
  if (req.method === "POST") {
    const prodToPost = req.body as Product;

    try {
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
            category: prodToPost.category.id,
            description: prodToPost.description,
            supplier: 1,
            supplierCode: prodToPost.supplierCode.toString() ?? "0",
            internalCode: prodToPost.internalCode ?? "0",
            value: prodToPost.value ?? 0,
            tax: 21,
            width: prodToPost.width ?? 0,
            depth: prodToPost.depth ?? 0,
            minStock: 0,
            minOrder: 0,
            height: prodToPost.height ?? 0,
            color: prodToPost.color,
            material: prodToPost.material,
            discountRange: prodToPost.discountRange ?? 0,
            priceBeforeDiscount:
              prodToPost.priceBeforeDiscount ?? prodToPost.value ?? 0,
          },
        }),
      });

      if (!reqProd.ok) {
        return res.status(500).json("error posting prod");
      } else {
        const answer = await reqProd.json();
        prodToPost.id = answer.data.id;
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
          return res.status(500).json("error posting extra");
        } else {
          console.log(prodToPost);
          // post shelves
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
                stock: prodToPost.shelves.find((shelf) => shelf.establishment.id == 1).stock ?? 0,
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
                stock: prodToPost.shelves.find((shelf) => shelf.establishment.id == 3).stock ?? 0,
                establishment: 3,
              },
            }),
          });
          if (!reqShelf1.ok || !reqShelf2.ok) {
            return res.status(500).json("error in shelf requests");
          }
        }
      }
    } catch (error) {
      return res.status(500).json("error outside of requests");
    }

    return res.status(200).json("Product posted successfully");
  } else {
    return res.status(405).json("Method not allowed.");
  }
}
