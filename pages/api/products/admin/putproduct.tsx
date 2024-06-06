import { Product } from "../../../../api/interfaces/product";
import { NextApiRequest, NextApiResponse } from "next";
import statusText from "../../../../api/statustexts";

export default async function putProduct(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const cookies = req.cookies;
  const authToken = cookies.j;
  const prodID = req.query.id;
  const prodExtraID = req.query.extraid;
  if (!authToken) {
    return res.status(401).json(statusText[401]);
  }
  if (req.method === "PUT") {
    const prodToPost = req.body as Product;
    const imagesArray = [];
    prodToPost.images?.forEach((img) => imagesArray.push({ id: img.id }));
    try {
      const fetchUrl = `${process.env.API_URL}/api/products/${prodID}`;
      let body = {
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
          images: prodToPost.images.map((img) => img.id),
          minOrder: 0,
          height: prodToPost.height ?? 0,
          color: prodToPost.color,
          material: prodToPost.material,
          discountRange: prodToPost.discountRange ?? 0,
          priceBeforeDiscount:
            prodToPost.priceBeforeDiscount ?? prodToPost.value ?? 0,
        },
      };
      const response = await fetch(fetchUrl, {
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
        return res.status(400).json(statusText[400]);
      } else {
        const fetchUrl2 = `${process.env.API_URL}/api/product-extras/${prodExtraID}`;
        const response2 = await fetch(fetchUrl2, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${authToken}`,
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
        });

        if (!response2.ok) {
          return res.status(400).json(statusText[400]);
        } else {
          // post stock to shelves
          // console.log(prodToPost);
          const fetchUrlShelves = `${process.env.API_URL}/api/shelves/`;
          prodToPost.shelves.forEach(async (shelf) => {
            const reqShelf = await fetch(fetchUrlShelves + shelf.id, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${authToken}`,
              },
              body: JSON.stringify({
                data: {
                  stock: shelf.stock ?? 0,
                },
              }),
            });
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
