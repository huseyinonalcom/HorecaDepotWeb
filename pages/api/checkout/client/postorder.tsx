import { NextApiRequest, NextApiResponse } from "next";

import statusText from "../../../../api/statustexts";
import { DocumentProduct } from "../../../../api/interfaces/documentProduct";
import { Product } from "../../../../api/interfaces/product";
import { getConfig } from "../../config/private/getconfig";

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
  if (req.method === "POST") {
    const cookies = req.cookies;
    const authToken = cookies.cj;
    const createDocument: boolean = req.query.final == "true";
    const usedPromo = req.query.promo;
    let isClientProfessional: boolean = false;
    const productsFromRequest = await JSON.parse(req.body);
    const productsFromCart =
      productsFromRequest.documentToPost.document_products;
    var productsToPost: DocumentProduct[] = [];
    let documentID: number = 0;
    var clientID: number;
    var establishmentID: number;
    var clientEmail: string;
    var clientFirstName: string;
    var clientLastName: string;

    try {
      const request = await fetch(
        `${process.env.API_URL}/api/users/me?populate[client_info][populate][0]=addresses&populate[client_info][populate][1]=establishment&populate=role`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      );

      const answer = await request.json();
      clientID = answer.client_info.id;
      clientEmail = answer.email;
      clientFirstName = answer.client_info.firstName;
      clientLastName = answer.client_info.lastName;
      establishmentID = answer.client_info.establishment.id;
      if (answer.client_info.category == "Entreprise") {
        isClientProfessional = true;
      } else {
        isClientProfessional = false;
      }
    } catch {}

    try {
      for (let i = 0; i < productsFromCart.length; i++) {
        const productID = productsFromCart[i].product;

        const fetchUrl = `${process.env.API_URL}/api/products/${productID}?fields[0]=name&fields[1]=productLine&fields[2]=internalCode&fields[3]=priceBeforeDiscount&fields[4]=value&fields[5]=tax&populate[categories][fields][0]=id&populate[shelves][populate][establishment][fields][0]=name&populate[shelves][fields][0]=stock`;

        const response = await fetch(fetchUrl, {
          headers: {
            Authorization: `Bearer ${process.env.API_KEY}`,
          },
        });

        const answer = await response.json();
        const productFromAPI: Product = answer.data;
        let productCalculated: DocumentProduct = { category: {} };
        productCalculated.category.id = productFromAPI.categories[0].id;
        productCalculated.product = productID;
        productCalculated.name = productFromAPI.name;
        productCalculated.amount = productsFromCart[i].amount;
        productCalculated.shelf = productFromAPI.shelves.find(
          (shelf) => shelf.establishment.id === 3,
        ).id;
        productCalculated.shelfStock = productFromAPI.shelves.find(
          (shelf) => shelf.establishment.id === 3,
        ).stock;
        productCalculated.priceBeforeDiscount =
          productFromAPI.priceBeforeDiscount;
        productCalculated.value = productFromAPI.value;
        if (productCalculated.priceBeforeDiscount <= productCalculated.value) {
          productCalculated.priceBeforeDiscount = productCalculated.value;
          productCalculated.discount = 0;
        } else {
          productCalculated.discount =
            productCalculated.priceBeforeDiscount - productCalculated.value;
        }
        productCalculated.discount *= productCalculated.amount;
        productCalculated.subTotal =
          productCalculated.value * productCalculated.amount; // total (tax included)
        productCalculated.tax = productFromAPI.tax; // tax percentage as integer (10% is 10 ...)
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
      } else {
      }
    } catch {}

    const today = new Date();
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
      establishment: establishmentID,
      docAddress: productsFromRequest.documentToPost.docAddress.id,
      delAddress: productsFromRequest.documentToPost.delAddress.id,
    };

    if (createDocument) {
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
                    // description: productToPost[i].description,
                    value: productsToPost[i].value,
                    subTotal: productsToPost[i].subTotal,
                    discount: productsToPost[i].discount,
                    amount: productsToPost[i].amount,
                    tax: productsToPost[i].tax,
                    taxSubTotal: productsToPost[i].taxSubTotal,
                    delivered: false,
                    document: documentID,
                    product: productsToPost[i].product,
                  },
                }),
              });
              if (!response.ok) {
                return res.status(400).json(statusText[400]);
              }
            }

            let shippingCost = 100;

            let addressData;
            try {
              const addressReq = await fetch(
                `${process.env.API_URL}/api/addresses/${productsFromRequest.documentToPost.docAddress.id}`,
                {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${process.env.API_KEY}`,
                  },
                },
              );
              addressData = (await addressReq.json()).data;
              let config = await getConfig();
              shippingCost = addressData.shippingDistance * config.costPerKM;
            } catch (e) {
              console.error(e);
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
                  tax: 21,
                  taxSubTotal: shippingCost - shippingCost / 1.21,
                  delivered: false,
                  document: documentID,
                },
              }),
            });

            const nodemailer = require("nodemailer");

            // Create a transporter object using the custom SMTP transport
            let transporter = nodemailer.createTransport({
              host: process.env.MAIL_HOST, // Custom SMTP server
              port: 587, // Common port for SMTP. Use 465 for SSL
              secure: false, // True for 465, false for other ports
              auth: {
                user: process.env.MAIL_USER, // Your email or SMTP user
                pass: process.env.MAIL_PASS, // Your password for SMTP authentication
              },
            });

            let mailOptionsCompany = {
              from: `"${process.env.MAIL_SENDER}" <${process.env.MAIL_USER}>`, // Sender address
              to: ["info@horecadepot.be", "horecadepothoreca@gmail.com"], // List of recipients
              subject: "Nouvelle Commande sur horecadepot.be", // Subject line
              html: `
              <!DOCTYPE html>
              <html lang="en">
                <head>
                  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
                  <style media="all" type="text/css">
                    @media all {
                      .btn-primary table td:hover {
                        background-color: #ec0867 !important;
                      }

                      .btn-primary a:hover {
                        background-color: #ec0867 !important;
                        border-color: #ec0867 !important;
                      }
                    }
                    @media only screen and (max-width: 640px) {
                      .main p,
                      .main td,
                      .main span {
                        font-size: 16px !important;
                      }

                      .wrapper {
                        padding: 8px !important;
                      }

                      .content {
                        padding: 0 !important;
                      }

                      .container {
                        padding: 0 !important;
                        padding-top: 8px !important;
                        width: 100% !important;
                      }

                      .main {
                        border-left-width: 0 !important;
                        border-radius: 0 !important;
                        border-right-width: 0 !important;
                      }

                      .btn table {
                        max-width: 100% !important;
                        width: 100% !important;
                      }

                      .btn a {
                        font-size: 16px !important;
                        max-width: 100% !important;
                        width: 100% !important;
                      }
                    }
                    @media all {
                      .ExternalClass {
                        width: 100%;
                      }

                      .ExternalClass,
                      .ExternalClass p,
                      .ExternalClass span,
                      .ExternalClass font,
                      .ExternalClass td,
                      .ExternalClass div {
                        line-height: 100%;
                      }

                      .apple-link a {
                        color: inherit !important;
                        font-family: inherit !important;
                        font-size: inherit !important;
                        font-weight: inherit !important;
                        line-height: inherit !important;
                        text-decoration: none !important;
                      }

                      #MessageViewBody a {
                        color: inherit;
                        text-decoration: none;
                        font-size: inherit;
                        font-family: inherit;
                        font-weight: inherit;
                        line-height: inherit;
                      }
                    }
                  </style>
                </head>
                <body
                  style="
                    font-family: Helvetica, sans-serif;
                    -webkit-font-smoothing: antialiased;
                    font-size: 16px;
                    line-height: 1.3;
                    -ms-text-size-adjust: 100%;
                    -webkit-text-size-adjust: 100%;
                    background-color: #f4f5f6;
                    margin: 0;
                    padding: 0;
                  "
                >
                  <table
                    role="presentation"
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                    class="body"
                    style="
                      border-collapse: separate;
                      mso-table-lspace: 0pt;
                      mso-table-rspace: 0pt;
                      background-color: #f4f5f6;
                      width: 100%;
                    "
                    width="100%"
                    bgcolor="#f4f5f6"
                  >
                    <tr>
                      <td
                        style="
                          font-family: Helvetica, sans-serif;
                          font-size: 16px;
                          vertical-align: top;
                        "
                        valign="top"
                      >
                        &nbsp;
                      </td>
                      <td
                        class="container"
                        style="
                          font-family: Helvetica, sans-serif;
                          font-size: 16px;
                          vertical-align: top;
                          max-width: 600px;
                          padding: 0;
                          padding-top: 24px;
                          width: 600px;
                          margin: 0 auto;
                        "
                        width="600"
                        valign="top"
                      >
                        <div
                          class="content"
                          style="
                            box-sizing: border-box;
                            display: block;
                            margin: 0 auto;
                            max-width: 600px;
                            padding: 0;
                          "
                        >
                          <!-- START CENTERED WHITE CONTAINER -->
                          <span
                            class="preheader"
                            style="
                              color: transparent;
                              display: none;
                              height: 0;
                              max-height: 0;
                              max-width: 0;
                              opacity: 0;
                              overflow: hidden;
                              mso-hide: all;
                              visibility: hidden;
                              width: 0;
                            "
                            >Nouvelle Commande</span
                          >
                          <table
                            role="presentation"
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            class="main"
                            style="
                              border-collapse: separate;
                              mso-table-lspace: 0pt;
                              mso-table-rspace: 0pt;
                              background: #ffffff;
                              border: 1px solid #eaebed;
                              border-radius: 16px;
                              width: 100%;
                            "
                            width="100%"
                          >
                            <!-- START MAIN CONTENT AREA -->
                            <tr>
                              <td
                                class="wrapper"
                                style="
                                  font-family: Helvetica, sans-serif;
                                  font-size: 16px;
                                  vertical-align: top;
                                  box-sizing: border-box;
                                  padding: 24px;
                                "
                                valign="top"
                              >
                                <p
                                  style="
                                    font-family: Helvetica, sans-serif;
                                    font-size: 16px;
                                    font-weight: normal;
                                    margin: 0;
                                    margin-bottom: 16px;
                                  "
                                >
                                  Client: ${
                                    clientFirstName + " " + clientLastName
                                  }
                                </p>
                             
                                <table
                                  role="presentation"
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  class="btn btn-primary"
                                  style="
                                    border-collapse: separate;
                                    mso-table-lspace: 0pt;
                                    mso-table-rspace: 0pt;
                                    box-sizing: border-box;
                                    width: 100%;
                                    min-width: 100%;
                                  "
                                  width="100%"
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                        align="left"
                                        style="
                                          font-family: Helvetica, sans-serif;
                                          font-size: 16px;
                                          vertical-align: top;
                                          padding-bottom: 16px;
                                        "
                                        valign="top"
                                      >
                                        <table
                                          role="presentation"
                                          border="0"
                                          cellpadding="0"
                                          cellspacing="0"
                                          style="
                                            border-collapse: separate;
                                            mso-table-lspace: 0pt;
                                            mso-table-rspace: 0pt;
                                            width: auto;
                                          "
                                        >
                                          <tbody>
                                            <tr>
                                              <td
                                                style="
                                                  font-family: Helvetica, sans-serif;
                                                  font-size: 16px;
                                                  vertical-align: top;
                                                  border-radius: 4px;
                                                  text-align: center;
                                                  background-color: #0867ec;
                                                "
                                                valign="top"
                                                align="center"
                                                bgcolor="#0867ec"
                                              >
                                                <a
                                                  href="https://horecadepot.be/admin/order?id=${documentID}"
                                                  target="_blank"
                                                  style="
                                                    border: solid 2px #0867ec;
                                                    border-radius: 4px;
                                                    box-sizing: border-box;
                                                    cursor: pointer;
                                                    display: inline-block;
                                                    font-size: 16px;
                                                    font-weight: bold;
                                                    margin: 0;
                                                    padding: 12px 24px;
                                                    text-decoration: none;
                                                    text-transform: capitalize;
                                                    background-color: #0867ec;
                                                    border-color: #0867ec;
                                                    color: #ffffff;
                                                  "
                                                  >Voir details</a
                                                >
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                                <p
                                  style="
                                    font-family: Helvetica, sans-serif;
                                    font-size: 16px;
                                    font-weight: normal;
                                    margin: 0;
                                    margin-bottom: 16px;
                                  "
                                ></p>
                                <p
                                  style="
                                    font-family: Helvetica, sans-serif;
                                    font-size: 16px;
                                    font-weight: normal;
                                    margin: 0;
                                    margin-bottom: 16px;
                                  "
                                > </p>
                              </td>
                            </tr>

                            <!-- END MAIN CONTENT AREA -->
                          </table>

                          <!-- START FOOTER -->
                          <div
                            class="footer"
                            style="
                              clear: both;
                              padding-top: 24px;
                              text-align: center;
                              width: 100%;
                            "
                          >
                            <table
                              role="presentation"
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              style="
                                border-collapse: separate;
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                width: 100%;
                              "
                              width="100%"
                            >
                              <tr>
                                <td
                                  class="content-block"
                                  style="
                                    font-family: Helvetica, sans-serif;
                                    vertical-align: top;
                                    color: #9a9ea6;
                                    font-size: 16px;
                                    text-align: center;
                                  "
                                  valign="top"
                                  align="center"
                                >
                                  <span
                                    class="apple-link"
                                    style="
                                      color: #9a9ea6;
                                      font-size: 16px;
                                      text-align: center;
                                    "
                                  ></span>
                                </td>
                              </tr>
                              <tr></tr>
                            </table>
                          </div>

                          <!-- END FOOTER -->

                          <!-- END CENTERED WHITE CONTAINER -->
                        </div>
                      </td>
                      <td
                        style="
                          font-family: Helvetica, sans-serif;
                          font-size: 16px;
                          vertical-align: top;
                        "
                        valign="top"
                      >
                        &nbsp;
                      </td>
                    </tr>
                  </table>
                </body>
              </html>
              `,
            };

            // Send mail client
            transporter.sendMail(mailOptionsCompany, (error, info) => {});

            // Setup email data for Client
            let mailOptionsClient = {
              from: `"${process.env.MAIL_SENDER}" <${process.env.MAIL_USER}>`, // Sender address
              to: clientEmail, // List of recipients
              subject: "Votre Commande Chez Nous - Horeca Depot", // Subject line
              html: `
              <!DOCTYPE html>
              <html lang="en">
                <head>
                  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
                  <style media="all" type="text/css">
                    @media all {
                      .btn-primary table td:hover {
                        background-color: #ec0867 !important;
                      }

                      .btn-primary a:hover {
                        background-color: #ec0867 !important;
                        border-color: #ec0867 !important;
                      }
                    }
                    @media only screen and (max-width: 640px) {
                      .main p,
                      .main td,
                      .main span {
                        font-size: 16px !important;
                      }

                      .wrapper {
                        padding: 8px !important;
                      }

                      .content {
                        padding: 0 !important;
                      }

                      .container {
                        padding: 0 !important;
                        padding-top: 8px !important;
                        width: 100% !important;
                      }

                      .main {
                        border-left-width: 0 !important;
                        border-radius: 0 !important;
                        border-right-width: 0 !important;
                      }

                      .btn table {
                        max-width: 100% !important;
                        width: 100% !important;
                      }

                      .btn a {
                        font-size: 16px !important;
                        max-width: 100% !important;
                        width: 100% !important;
                      }
                    }
                    @media all {
                      .ExternalClass {
                        width: 100%;
                      }

                      .ExternalClass,
                      .ExternalClass p,
                      .ExternalClass span,
                      .ExternalClass font,
                      .ExternalClass td,
                      .ExternalClass div {
                        line-height: 100%;
                      }

                      .apple-link a {
                        color: inherit !important;
                        font-family: inherit !important;
                        font-size: inherit !important;
                        font-weight: inherit !important;
                        line-height: inherit !important;
                        text-decoration: none !important;
                      }

                      #MessageViewBody a {
                        color: inherit;
                        text-decoration: none;
                        font-size: inherit;
                        font-family: inherit;
                        font-weight: inherit;
                        line-height: inherit;
                      }
                    }
                  </style>
                </head>
                <body
                  style="
                    font-family: Helvetica, sans-serif;
                    -webkit-font-smoothing: antialiased;
                    font-size: 16px;
                    line-height: 1.3;
                    -ms-text-size-adjust: 100%;
                    -webkit-text-size-adjust: 100%;
                    background-color: #f4f5f6;
                    margin: 0;
                    padding: 0;
                  "
                >
                  <table
                    role="presentation"
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                    class="body"
                    style="
                      border-collapse: separate;
                      mso-table-lspace: 0pt;
                      mso-table-rspace: 0pt;
                      background-color: #f4f5f6;
                      width: 100%;
                    "
                    width="100%"
                    bgcolor="#f4f5f6"
                  >
                    <tr>
                      <td
                        style="
                          font-family: Helvetica, sans-serif;
                          font-size: 16px;
                          vertical-align: top;
                        "
                        valign="top"
                      >
                        &nbsp;
                      </td>
                      <td
                        class="container"
                        style="
                          font-family: Helvetica, sans-serif;
                          font-size: 16px;
                          vertical-align: top;
                          max-width: 600px;
                          padding: 0;
                          padding-top: 24px;
                          width: 600px;
                          margin: 0 auto;
                        "
                        width="600"
                        valign="top"
                      >
                        <div
                          class="content"
                          style="
                            box-sizing: border-box;
                            display: block;
                            margin: 0 auto;
                            max-width: 600px;
                            padding: 0;
                          "
                        >
                          <!-- START CENTERED WHITE CONTAINER -->
                          <span
                            class="preheader"
                            style="
                              color: transparent;
                              display: none;
                              height: 0;
                              max-height: 0;
                              max-width: 0;
                              opacity: 0;
                              overflow: hidden;
                              mso-hide: all;
                              visibility: hidden;
                              width: 0;
                            "
                            >Votre Commande Chez Nous - Horeca Depot</span
                          >
                          <table
                            role="presentation"
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            class="main"
                            style="
                              border-collapse: separate;
                              mso-table-lspace: 0pt;
                              mso-table-rspace: 0pt;
                              background: #ffffff;
                              border: 1px solid #eaebed;
                              border-radius: 16px;
                              width: 100%;
                            "
                            width="100%"
                          >
                            <!-- START MAIN CONTENT AREA -->
                            <tr>
                              <td
                                class="wrapper"
                                style="
                                  font-family: Helvetica, sans-serif;
                                  font-size: 16px;
                                  vertical-align: top;
                                  box-sizing: border-box;
                                  padding: 24px;
                                "
                                valign="top"
                              >
                                <p
                                  style="
                                    font-family: Helvetica, sans-serif;
                                    font-size: 16px;
                                    font-weight: normal;
                                    margin: 0;
                                    margin-bottom: 16px;
                                  "
                                >
                                  Bonjour ${
                                    clientFirstName + " " + clientLastName
                                  }
                                </p>
                                <p
                                  style="
                                    font-family: Helvetica, sans-serif;
                                    font-size: 16px;
                                    font-weight: normal;
                                    margin: 0;
                                    margin-bottom: 16px;
                                  "
                                >
                                  Nous avons bien reçu votre commande.<br />Cliquez sur le
                                  bouton ci-dessous pour suivre votre commande.
                                </p>
                                <table
                                  role="presentation"
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  class="btn btn-primary"
                                  style="
                                    border-collapse: separate;
                                    mso-table-lspace: 0pt;
                                    mso-table-rspace: 0pt;
                                    box-sizing: border-box;
                                    width: 100%;
                                    min-width: 100%;
                                  "
                                  width="100%"
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                        align="left"
                                        style="
                                          font-family: Helvetica, sans-serif;
                                          font-size: 16px;
                                          vertical-align: top;
                                          padding-bottom: 16px;
                                        "
                                        valign="top"
                                      >
                                        <table
                                          role="presentation"
                                          border="0"
                                          cellpadding="0"
                                          cellspacing="0"
                                          style="
                                            border-collapse: separate;
                                            mso-table-lspace: 0pt;
                                            mso-table-rspace: 0pt;
                                            width: auto;
                                          "
                                        >
                                          <tbody>
                                            <tr>
                                              <td
                                                style="
                                                  font-family: Helvetica, sans-serif;
                                                  font-size: 16px;
                                                  vertical-align: top;
                                                  border-radius: 4px;
                                                  text-align: center;
                                                  background-color: #0867ec;
                                                "
                                                valign="top"
                                                align="center"
                                                bgcolor="#0867ec"
                                              >
                                                <a
                                                  href="${process.env.SITE_URL}/account/order?id=${documentID}"
                                                  target="_blank"
                                                  style="
                                                    border: solid 2px #0867ec;
                                                    border-radius: 4px;
                                                    box-sizing: border-box;
                                                    cursor: pointer;
                                                    display: inline-block;
                                                    font-size: 16px;
                                                    font-weight: bold;
                                                    margin: 0;
                                                    padding: 12px 24px;
                                                    text-decoration: none;
                                                    text-transform: capitalize;
                                                    background-color: #0867ec;
                                                    border-color: #0867ec;
                                                    color: #ffffff;
                                                  "
                                                  >Mon tableau de bord</a
                                                >
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                                <p
                                  style="
                                    font-family: Helvetica, sans-serif;
                                    font-size: 16px;
                                    font-weight: normal;
                                    margin: 0;
                                    margin-bottom: 16px;
                                  "
                                ></p>
                                <p
                                  style="
                                    font-family: Helvetica, sans-serif;
                                    font-size: 16px;
                                    font-weight: normal;
                                    margin: 0;
                                    margin-bottom: 16px;
                                  "
                                > </p>
                              </td>
                            </tr>

                            <!-- END MAIN CONTENT AREA -->
                          </table>

                          <!-- START FOOTER -->
                          <div
                            class="footer"
                            style="
                              clear: both;
                              padding-top: 24px;
                              text-align: center;
                              width: 100%;
                            "
                          >
                            <table
                              role="presentation"
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              style="
                                border-collapse: separate;
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                width: 100%;
                              "
                              width="100%"
                            >
                              <tr>
                                <td
                                  class="content-block"
                                  style="
                                    font-family: Helvetica, sans-serif;
                                    vertical-align: top;
                                    color: #9a9ea6;
                                    font-size: 16px;
                                    text-align: center;
                                  "
                                  valign="top"
                                  align="center"
                                >
                                  <span
                                    class="apple-link"
                                    style="
                                      color: #9a9ea6;
                                      font-size: 16px;
                                      text-align: center;
                                    "
                                  ></span>
                                </td>
                              </tr>
                              <tr></tr>
                            </table>
                          </div>

                          <!-- END FOOTER -->

                          <!-- END CENTERED WHITE CONTAINER -->
                        </div>
                      </td>
                      <td
                        style="
                          font-family: Helvetica, sans-serif;
                          font-size: 16px;
                          vertical-align: top;
                        "
                        valign="top"
                      >
                        &nbsp;
                      </td>
                    </tr>
                  </table>
                </body>
              </html>
              `,
            };

            // Send mail client
            transporter.sendMail(mailOptionsClient, (error, info) => {
              if (error) {
                return res.status(500).json(statusText[500]);
              } else {
                return res.status(200).json({ id: documentID });
              }
            });
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
      return res.status(200).json(documentToPost);
    }
  } else {
    return res.status(405).json(statusText[405]);
  }
}
