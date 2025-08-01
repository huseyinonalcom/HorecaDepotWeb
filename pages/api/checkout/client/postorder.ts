import { orderMailEstablishment } from "../../../../api/utils/mail/order/orderMailEstablishment";
import { getShippingCostFromAddress } from "../../public/address/getshippingcostfromaddress";
import { orderMailClient } from "../../../../api/utils/mail/order/orderMailClient";
import { DocumentProduct } from "../../../../api/interfaces/documentProduct";
import { PDFInvoice } from "../../../../components/pdf/pdfinvoice";
import { Product } from "../../../../api/interfaces/product";
import { countries } from "../../../../api/utils/countries";
import { sendMail } from "../../../../api/utils/sendmail";
import { NextApiRequest, NextApiResponse } from "next";
import statusText from "../../../../api/statustexts";
import { renderToStream } from "@react-pdf/renderer";
import { getUser } from "../../private/user";

const calculateTotalWithPromo = (promoDetails, cart) => {
  const cartAfterPromo = JSON.parse(JSON.stringify(cart));
  const discountAmount = promoDetails.discount;
  const discountPer = promoDetails.perAmount;
  const isPercentage = promoDetails.discountIsPercentage;
  const perProduct = promoDetails.products.length > 0;
  const promoProducts = promoDetails.products;
  const promoCategories = promoDetails.categories;

  const applyDiscount = (item, amount) => {
    let totalDiscount = 0;
    if (isPercentage) {
      totalDiscount = ((item.value * discountAmount) / 100) * amount;
    } else {
      totalDiscount = discountAmount * amount;
    }
    return totalDiscount;
  };

  cartAfterPromo.forEach((item) => {
    if (perProduct && promoProducts.find((prod) => prod.id === item.product)) {
      const discountableAmount =
        Math.floor(item.amount / discountPer) * discountPer;
      const totalDiscount = applyDiscount(item, discountableAmount);
      item.subTotal = item.value * item.amount - totalDiscount;
      item.discount = item.priceBeforeDiscount * item.amount - item.subTotal;
      item.taxSubTotal = item.subTotal - item.subTotal / (1 + item.tax / 100);
    } else if (
      !perProduct &&
      promoCategories.find((cat) => cat.id === item.category.id)
    ) {
      const discountableAmount =
        Math.floor(item.amount / discountPer) * discountPer;
      const totalDiscount = applyDiscount(item, discountableAmount);
      item.subTotal = item.value * item.amount - totalDiscount;
      item.discount = item.priceBeforeDiscount * item.amount - item.subTotal;
      item.taxSubTotal = item.subTotal - item.subTotal / (1 + item.tax / 100);
    } else {
      item.subTotal = item.value * item.amount;
      item.taxSubTotal = item.subTotal - item.subTotal / (1 + item.tax / 100);
    }
  });
  return cartAfterPromo;
};

export default async function postOrder(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method === "POST") {
      const cookies = req.cookies;
      const authToken = cookies.cj;
      const usedPromo = req.query.promo;
      let taxExempt: boolean = false;
      const productsFromRequest = await JSON.parse(req.body);
      const productsFromCart =
        productsFromRequest.documentToPost.document_products;
      var productsToPost: DocumentProduct[] = [];
      let documentID: number = 0;
      var clientID: number;
      var clientEmail: string;
      const today = new Date();

      let client;

      try {
        const answer = await getUser({ self: true, authToken });
        client = answer.client_info;

        clientID = answer.client_info.id;
        clientEmail = answer.email;
      } catch (e) {
        console.error(e);
        return res.status(401).json(statusText[401]);
      }

      try {
        for (let i = 0; i < productsFromCart.length; i++) {
          const productID = productsFromCart[i].product;

          const fetchUrl = `${process.env.API_URL}/api/products/${productID}?populate[categories][fields][0]=id&populate[shelves][populate][establishment][fields][0]=name&populate[shelves][fields][0]=stock`;

          const response = await fetch(fetchUrl, {
            headers: {
              Authorization: `Bearer ${process.env.API_KEY}`,
            },
          });

          const answer = await response.json();
          const productFromAPI: Product = answer.data;
          let productCalculated: DocumentProduct = {
            category: {
              id: productFromAPI.categories[0].id,
            },
            product: productID,
            name: productFromAPI.name,
            amount: productsFromCart[i].amount,
            shelf: productFromAPI.shelves.find(
              (shelf) => shelf.establishment.id === 3,
            ).id,
            priceBeforeDiscount: productFromAPI.priceBeforeDiscount,
            value: productFromAPI.value,
            tax: taxExempt ? 0 : productFromAPI.tax,
          };

          if (
            productCalculated.priceBeforeDiscount <= productCalculated.value
          ) {
            productCalculated.priceBeforeDiscount = productCalculated.value;
            productCalculated.discount = 0;
          } else {
            productCalculated.discount =
              productCalculated.priceBeforeDiscount - productCalculated.value;
          }

          productCalculated.discount *= productCalculated.amount;

          productCalculated.subTotal =
            productCalculated.value * productCalculated.amount;

          productCalculated.taxSubTotal =
            productCalculated.subTotal -
            productCalculated.subTotal / (1 + productCalculated.tax / 100);

          productsToPost.push(productCalculated);
        }
      } catch (e) {
        return res.status(500).json(statusText[500]);
      }

      if (usedPromo) {
        try {
          const response = await fetch(
            `${process.env.API_URL}/api/promos?filters[code][$eq]=${usedPromo}&populate=clients,products,categories`,
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
              method: "GET",
            },
          );

          const answer = await response.json();
          if (response.ok) {
            productsToPost = await calculateTotalWithPromo(
              answer.data[0],
              productsToPost,
            );
          } else {
            return res.status(404).json("Promo could not be found!");
          }
        } catch (error) {
          return res.status(404).json("Promo could not be found!");
        }
      }

      let documentNumber: number = Number(new Date().getFullYear() + "0000001");
      try {
        const requestLastOrder = await fetch(
          `${process.env.API_URL}/api/documents?filters[type][$eq]=Commande&sort[0]=number:desc&pagination[page]=1&pagination[pageSize]=1&fields[0]=number`,
          {
            headers: {
              Authorization: `Bearer ${process.env.API_KEY}`,
            },
          },
        );

        if (requestLastOrder.ok) {
          const answer = await requestLastOrder.json();
          documentNumber = Number(answer.data[0].number) + 1;
          // documentnumber starts with current year
          // we need to replace the year in the last documentnumber with the current year
          documentNumber = Number(
            documentNumber
              .toString()
              .replace(
                documentNumber.toString().substring(0, 4),
                today.getFullYear().toString(),
              ),
          );
        } else {
        }
      } catch (e) {
        console.error(e);
        return res.status(404).json(statusText[404]);
      }

      var documentToPost = {
        number: documentNumber,
        type: "Commande",
        prefix: "NB-",
        date:
          today.getFullYear() +
          "-" +
          (today.getMonth() + 1).toString().padStart(2, "0") +
          "-" +
          today.getDate().toString().padStart(2, "0"),
        client: clientID,
        phase: 0,
        establishment: 1,
        docAddress: productsFromRequest.documentToPost.docAddress.id,
        delAddress: productsFromRequest.documentToPost.delAddress.id,
      };

      if (client.category == "Entreprise") {
        if (
          !countries
            .find((country) => country.name == "Belgium")
            .names.includes(productsFromRequest.docAddress.country)
        ) {
          taxExempt = true;
        }
      }

      try {
        const fetchUrl = `${process.env.API_URL}/api/documents?fields=id`;
        const request = await fetch(fetchUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${process.env.API_KEY}`,
          },
          body: JSON.stringify({
            data: documentToPost,
          }),
        });
        if (request.ok) {
          const answer = await request.json();
          documentID = answer.data.id;
          try {
            const fetchUrl = `${process.env.API_URL}/api/document-products`;
            const headers = {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${process.env.API_KEY}`,
            };
            for (let i = 0; i < productsToPost.length; i++) {
              const response = await fetch(fetchUrl, {
                method: "POST",
                headers: headers,
                body: JSON.stringify({
                  data: {
                    name: productsToPost[i].name,
                    value: productsToPost[i].value,
                    subTotal: productsToPost[i].subTotal,
                    discount: productsToPost[i].discount,
                    amount: productsToPost[i].amount,
                    tax: productsToPost[i].tax,
                    taxSubTotal: productsToPost[i].taxSubTotal,
                    document: documentID,
                    product: productsToPost[i].product,
                  },
                }),
              });
              if (!response.ok) {
                return res.status(400).json(statusText[400]);
              }
            }

            let shippingCost = 200;

            shippingCost = await getShippingCostFromAddress({
              address: productsFromRequest.documentToPost.delAddress,
              documentTotal: productsToPost.reduce(
                (acc, prd) => acc + prd.subTotal / (1 + prd.tax / 100),
                0,
              ),
            });

            if (
              productsFromRequest.documentToPost.docAddress.country ==
              "test123test123"
            ) {
              shippingCost = 0;
            }

            await fetch(fetchUrl, {
              method: "POST",
              headers: headers,
              body: JSON.stringify({
                data: {
                  name: "livraison",
                  value: shippingCost,
                  subTotal: shippingCost,
                  discount: 0,
                  amount: 1,
                  tax: taxExempt ? 0 : 21,
                  taxSubTotal: taxExempt
                    ? 0
                    : shippingCost - shippingCost / 1.21,
                  delivered: false,
                  document: documentID,
                },
              }),
            });

            const finishedDocument = await fetch(
              `${process.env.API_URL}/api/documents/${documentID}?populate=*`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${authToken}`,
                },
              },
            );
            const answer = await finishedDocument.json();

            const doc = answer.data;

            let mailOptionsCompany = {
              to: ["info@horecadepot.be", "horecadepothoreca@gmail.com"],
              subject: "Nouvelle Commande sur horecadepot.be",
              authToken: process.env.API_KEY,
              html: orderMailEstablishment({ document: doc }),
            };

            sendMail(mailOptionsCompany);

            let mailOptionsClient = {
              to: [clientEmail],
              replyTo: "info@horecadepot.be",
              subject: "Votre Commande Chez Nous - Horeca Depot",
              html: orderMailClient({ document: doc }),
              authToken: process.env.API_KEY,
              attachments: [
                {
                  filename: "facture.pdf",
                  content: await renderToStream(
                    PDFInvoice({ invoiceDocument: doc }),
                  ),
                  encoding: "base64",
                  contentType: "application/pdf",
                },
              ],
            };

            // @ts-expect-error
            sendMail(mailOptionsClient);
            return res.status(200).json({ id: documentID });
          } catch (e) {
            return res.status(500).json(statusText[500]);
          }
        } else {
          return res.status(400).json(statusText[400]);
        }
      } catch (e) {
        return res.status(500).json(statusText[500]);
      }
    } else {
      return res.status(405).json(statusText[405]);
    }
  } catch (e) {
    console.error(e);
    return res.status(500).json(statusText[500]);
  }
}
