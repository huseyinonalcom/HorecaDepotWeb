import statusText from "../../../../api/statustexts";
import { sendMail } from "../../../../api/utils/sendmail";

export default async function sendOrderNotifications(req, res) {
  try {
    var orderID;
    var order;
    if (req.query.orderid) {
      orderID = req.query.orderid;
    } else {
      return res.status(400).json(statusText[400]);
    }

    try {
      const fetchUrl = `${process.env.API_URL}/api/documents/${orderID}?populate[client][populate][login][fields][0]=email&populate[document_products][fields][0]=subTotal&populate[payments][fields][0]=value&populate[payments][fields][1]=deleted&populate[payments][fields][2]=verified`;
      const request = await fetch(fetchUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${process.env.API_KEY}`,
        },
      });
      if (request.ok) {
        const answer = await request.json();
        order = answer.data;
      } else {
        return res.status(404).json(statusText[404]);
      }
    } catch (e) {
      return res.status(500).json(statusText[500]);
    }

    // check if payments are in order

    var orderValue = 0;

    order.document_products.forEach(
      (docprod) => (orderValue += docprod.subTotal),
    );

    var orderPaid = 0;

    order.payments
      .filter((pay) => pay.verified && !pay.deleted)
      .forEach((pay) => (orderPaid += pay.value));

    if (orderPaid < orderValue) {
      return res.status(400).json(statusText[400]);
    }

    let mailOptionsClient = {
      to: [order.client.login.email], // List of recipients
      subject: "Confirmation Commande " + order.prefix + order.number, // Subject line
      authToken: req.cookies.j,
      html: `
      <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html
  xmlns="http://www.w3.org/1999/xhtml"
  xmlns:v="urn:schemas-microsoft-com:vml"
  xmlns:o="urn:schemas-microsoft-com:office:office"
>
  <head>
    <!--[if gte mso 9]>
      <xml>
        <o:OfficeDocumentSettings>
          <o:AllowPNG />
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
      </xml>
    <![endif]-->
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="x-apple-disable-message-reformatting" />
    <!--[if !mso]><!-->
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <!--<![endif]-->
    <title></title>

    <style type="text/css">
      @media only screen and (min-width: 620px) {
        .u-row {
          width: 600px !important;
        }
        .u-row .u-col {
          vertical-align: top;
        }

        .u-row .u-col-100 {
          width: 600px !important;
        }
      }

      @media (max-width: 620px) {
        .u-row-container {
          max-width: 100% !important;
          padding-left: 0px !important;
          padding-right: 0px !important;
        }
        .u-row .u-col {
          min-width: 320px !important;
          max-width: 100% !important;
          display: block !important;
        }
        .u-row {
          width: 100% !important;
        }
        .u-col {
          width: 100% !important;
        }
        .u-col > div {
          margin: 0 auto;
        }
      }
      body {
        margin: 0;
        padding: 0;
      }

      table,
      tr,
      td {
        vertical-align: top;
        border-collapse: collapse;
      }

      p {
        margin: 0;
      }

      .ie-container table,
      .mso-container table {
        table-layout: fixed;
      }

      * {
        line-height: inherit;
      }

      a[x-apple-data-detectors="true"] {
        color: inherit !important;
        text-decoration: none !important;
      }

      @media (max-width: 480px) {
        .hide-mobile {
          max-height: 0px;
          overflow: hidden;
          display: none !important;
        }
      }

      table,
      td {
        color: #7e8c8d;
      }
      #u_body a {
        color: #f1c40f;
        text-decoration: underline;
      }
      @media (max-width: 480px) {
        #u_content_heading_1 .v-font-size {
          font-size: 81px !important;
        }
        #u_content_heading_2 .v-container-padding-padding {
          padding: 10px !important;
        }
        #u_content_heading_2 .v-font-size {
          font-size: 36px !important;
        }
        #u_content_heading_2 .v-line-height {
          line-height: 110% !important;
        }
        #u_content_text_1 .v-font-size {
          font-size: 16px !important;
        }
        #u_content_text_2 .v-container-padding-padding {
          padding: 10px !important;
        }
        #u_content_button_1 .v-size-width {
          width: 65% !important;
        }
        #u_content_text_6 .v-container-padding-padding {
          padding: 40px 10px 10px !important;
        }
        #u_content_menu_2 .v-padding {
          padding: 5px 10px !important;
        }
      }
    </style>

    <!--[if !mso]><!-->
    <link
      href="https://fonts.googleapis.com/css?family=Open+Sans:400,700&display=swap"
      rel="stylesheet"
      type="text/css"
    />
    <link
      href="https://fonts.googleapis.com/css2?family=Arvo&display=swap"
      rel="stylesheet"
      type="text/css"
    />
    <!--<![endif]-->
  </head>

  <body
    class="clean-body u_body"
   
  >
    <!--[if IE]><div class="ie-container"><![endif]-->
    <!--[if mso]><div class="mso-container"><![endif]-->
    <table
      id="u_body"
     
     
     
    >
      <tbody>
        <tr>
          <td
           
          >
            <!--[if (mso)|(IE)]><table width="100%"><tr><td align="center"><![endif]-->

            <!--[if gte mso 9]>
      <table>
        <tr>
          <td width="100%">
      <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false">
        <v:fill type="frame" src="images/image-5.png" /><v:textbox inset="0,0,0,0">
      <![endif]-->

            <div
              class="u-row-container"
             images/image-5.png');
                background-repeat: no-repeat;
                background-position: center top;
                background-color: transparent;
              "
            >
              <div
                class="u-row"
               
              >
                <div
                 
                >
                  <!--[if (mso)|(IE)]><table width="100%"><tr><tdimages/image-5.png');background-repeat: no-repeat;background-position: center top;background-color: transparent;" align="center"><table><tr><![endif]-->

                  <!--[if (mso)|(IE)]><td align="center" width="600"><![endif]-->
                  <div
                    class="u-col u-col-100"
                   
                  >
                    <div>
                      <!--[if (!mso)&(!IE)]><!--><div
                       
                      ><!--<![endif]-->
                        <table
                          id="u_content_heading_1"
                         Open Sans', sans-serif"
                          role="presentation"
                         
                         
                          width="100%"
                         
                        >
                          <tbody>
                            <tr>
                              <td
                                class="v-container-padding-padding"
                               Open Sans', sans-serif;
                                "
                                align="left"
                              >
                                <!--[if mso]><table width="100%"><tr><td><![endif]-->
                                <h1
                                  class="v-line-height v-font-size"
                                 
                                >
                                  <span
                                    ><span
                                      ><span
                                        ><span
                                          ><span
                                            ><span
                                              ><span
                                                ><span
                                                  ><strong
                                                    >HorecaDepot</strong
                                                  ></span
                                                ></span
                                              ></span
                                            ></span
                                          ></span
                                        ></span
                                      ></span
                                    ></span
                                  >
                                </h1>
                                <!--[if mso]></td></tr></table><![endif]-->
                              </td>
                            </tr>
                          </tbody>
                        </table>

                        <table
                          id="u_content_heading_2"
                         Open Sans', sans-serif"
                          role="presentation"
                         
                         
                          width="100%"
                         
                        >
                          <tbody>
                            <tr>
                              <td
                                class="v-container-padding-padding"
                               Open Sans', sans-serif;
                                "
                                align="left"
                              >
                                <!--[if mso]><table width="100%"><tr><td><![endif]-->
                                <h1
                                  class="v-line-height v-font-size"
                                 
                                >
                                  Commande
                                </h1>
                                <!--[if mso]></td></tr></table><![endif]-->
                              </td>
                            </tr>
                          </tbody>
                        </table>

                        <table
                          id="u_content_text_1"
                         Open Sans', sans-serif"
                          role="presentation"
                         
                         
                          width="100%"
                         
                        >
                          <tbody>
                            <tr>
                              <td
                                class="v-container-padding-padding"
                               Open Sans', sans-serif;
                                "
                                align="left"
                              >
                                <div
                                  class="v-line-height v-font-size"
                                 Open Sans', sans-serif;
                                    font-size: 16px;
                                    color: #ffffff;
                                    line-height: 140%;
                                    text-align: center;
                                    word-wrap: break-word;
                                  "
                                >
                                  <p>
                                    <span
                                      data-metadata="&lt;!--(figmeta)eyJmaWxlS2V5IjoicmkxdVlheFJKck1qakhmdVV3UllhSSIsInBhc3RlSUQiOjEwMDg4MzA4MjMsImRhdGFUeXBlIjoic2NlbmUifQo=(/figmeta)--&gt;"
                                     
                                      >Consultez votre commande.</span
                                    >
                                  </p>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>

                        <table
                          id="u_content_text_2"
                         Open Sans', sans-serif"
                          role="presentation"
                         
                         
                          width="100%"
                         
                        >
                          <tbody>
                            <tr>
                              <td
                                class="v-container-padding-padding"
                               Open Sans', sans-serif;
                                "
                                align="left"
                              >
                                <div
                                  class="v-line-height v-font-size"
                                 
                                >
                                  <p>
                                    Text Text text
                                  </p>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>

                        <table
                          id="u_content_button_1"
                         Open Sans', sans-serif"
                          role="presentation"
                         
                         
                          width="100%"
                         
                        >
                          <tbody>
                            <tr>
                              <td
                                class="v-container-padding-padding"
                               Open Sans', sans-serif;
                                "
                                align="left"
                              >
                                <!--[if mso
                                  ]><style>
                                    .v-button {
                                      background: transparent !important;
                                    }
                                  </style><!
                                [endif]-->
                                <div align="center">
                                  <!--[if mso]><table><tr><td align="center"><![endif]-->
                                  <a
                                    href="${process.env.SITE_URL}"
                                    target="_blank"
                                    class="v-button v-size-width v-font-size"
                                   
                                  >
                                    Votre Commande
                                  </a>
                                  <!--[if mso]></td></tr></table><![endif]-->
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>

                        <table
                          id="u_content_text_6"
                         Open Sans', sans-serif"
                          role="presentation"
                         
                         
                          width="100%"
                         
                        >
                          <tbody>
                            <tr>
                              <td
                                class="v-container-padding-padding"
                               Open Sans', sans-serif;
                                "
                                align="left"
                              >
                                <div
                                  class="v-line-height v-font-size"
                                 
                                >
                                  <p>
                                    Si vous avez des questions, veuillez envoyer
                                    un e-mail à
                                    <a
                                      rel="noopener"
                                      href="mailto:order@horecadepot.be?subject=Commande%20%23"
                                      target="_blank"
                                      >order@horecadepot.be</a
                                    >. Ne répondez pas directement à cet e-mail,
                                    car cet e-mail est uniquement utilisé pour
                                    les messages automatisés.
                                  </p>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>

                        <table
                         Open Sans', sans-serif"
                          role="presentation"
                         
                         
                          width="100%"
                         
                        >
                          <tbody>
                            <tr>
                              <td
                                class="v-container-padding-padding"
                               Open Sans', sans-serif;
                                "
                                align="left"
                              >
                                <table
                                  height="0px"
                                  align="center"
                                 
                                 
                                 
                                  width="100%"
                                 
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                       
                                      >
                                        <span>&#160;</span>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>

                        <table
                         Open Sans', sans-serif"
                          role="presentation"
                         
                         
                          width="100%"
                         
                        >
                          <tbody>
                            <tr>
                              <td
                                class="v-container-padding-padding"
                               Open Sans', sans-serif;
                                "
                                align="left"
                              >
                                <div align="center">
                                  <div>
                                    <!--[if (mso)|(IE)]><table width="187"><tr><td align="center"><table width="100%"><tr><![endif]-->

                                    <!--[if (mso)|(IE)]><td width="32"><![endif]-->
                                    <table
                                      align="left"
                                     
                                     
                                     
                                      width="32"
                                      height="32"
                                     
                                    >
                                      <tbody>
                                        <tr>
                                          <td
                                            align="left"
                                           
                                           
                                          >
                                            <a
                                              href="https://www.facebook.com/"
                                              title="Facebook"
                                              target="_blank"
                                            >
                                              <img
                                                src="images/image-4.png"
                                                alt="Facebook"
                                                title="Facebook"
                                                width="32"
                                               
                                              />
                                            </a>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                    <!--[if (mso)|(IE)]></td><![endif]-->

                                    <!--[if (mso)|(IE)]><td width="32"><![endif]-->
                                    <table
                                      align="left"
                                     
                                     
                                     
                                      width="32"
                                      height="32"
                                     
                                    >
                                      <tbody>
                                        <tr>
                                          <td
                                            align="left"
                                           
                                           
                                          >
                                            <a
                                              href="https://www.linkedin.com/"
                                              title="LinkedIn"
                                              target="_blank"
                                            >
                                              <img
                                                src="images/image-1.png"
                                                alt="LinkedIn"
                                                title="LinkedIn"
                                                width="32"
                                               
                                              />
                                            </a>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                    <!--[if (mso)|(IE)]></td><![endif]-->

                                    <!--[if (mso)|(IE)]><td width="32"><![endif]-->
                                    <table
                                      align="left"
                                     
                                     
                                     
                                      width="32"
                                      height="32"
                                     
                                    >
                                      <tbody>
                                        <tr>
                                          <td
                                            align="left"
                                           
                                           
                                          >
                                            <a
                                              href="https://www.instagram.com/"
                                              title="Instagram"
                                              target="_blank"
                                            >
                                              <img
                                                src="images/image-2.png"
                                                alt="Instagram"
                                                title="Instagram"
                                                width="32"
                                               
                                              />
                                            </a>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                    <!--[if (mso)|(IE)]></td><![endif]-->

                                    <!--[if (mso)|(IE)]><td width="32"><![endif]-->
                                    <table
                                      align="left"
                                     
                                     
                                     
                                      width="32"
                                      height="32"
                                     
                                    >
                                      <tbody>
                                        <tr>
                                          <td
                                            align="left"
                                           
                                           
                                          >
                                            <a
                                              href="https://twitter.com/"
                                              title="X"
                                              target="_blank"
                                            >
                                              <img
                                                src="images/image-3.png"
                                                alt="X"
                                                title="X"
                                                width="32"
                                               
                                              />
                                            </a>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                    <!--[if (mso)|(IE)]></td><![endif]-->

                                    <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                                  </div>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>

                        <table
                          id="u_content_menu_2"
                         Open Sans', sans-serif"
                          role="presentation"
                         
                         
                          width="100%"
                         
                        >
                          <tbody>
                            <tr>
                              <td
                                class="v-container-padding-padding"
                               Open Sans', sans-serif;
                                "
                                align="left"
                              >
                                <div class="menu">
                                  <!--[if (mso)|(IE)]><table role="presentation" align="center"><tr><![endif]-->

                                  <!--[if (mso)|(IE)]><td><![endif]-->

                                  <a
                                    href="${process.env.SITE_URL}"
                                    target="_self"
                                   
                                    class="v-padding v-font-size"
                                  >
                                    Home
                                  </a>

                                  <!--[if (mso)|(IE)]></td><![endif]-->

                                  <!--[if (mso)|(IE)]><td><![endif]-->
                                  <span
                                   
                                    class="v-padding v-font-size hide-mobile"
                                  >
                                    |
                                  </span>
                                  <!--[if (mso)|(IE)]></td><![endif]-->

                                  <!--[if (mso)|(IE)]><td><![endif]-->

                                  <a
                                    href="${process.env.SITE_URL}/shop/tous?page=1"
                                    target="_self"
                                   
                                    class="v-padding v-font-size"
                                  >
                                    Shop
                                  </a>

                                  <!--[if (mso)|(IE)]></td><![endif]-->

                                  <!--[if (mso)|(IE)]><td><![endif]-->
                                  <span
                                   
                                    class="v-padding v-font-size hide-mobile"
                                  >
                                    |
                                  </span>
                                  <!--[if (mso)|(IE)]></td><![endif]-->

                                  <!--[if (mso)|(IE)]><td><![endif]-->

                                  <a
                                    href="${process.env.SITE_URL}/contact"
                                    target="_self"
                                   
                                    class="v-padding v-font-size"
                                  >
                                    Contact US
                                  </a>

                                  <!--[if (mso)|(IE)]></td><![endif]-->

                                  <!--[if (mso)|(IE)]></tr></table><![endif]-->
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>

                        <table
                         Open Sans', sans-serif"
                          role="presentation"
                         
                         
                          width="100%"
                         
                        >
                          <tbody>
                            <tr>
                              <td
                                class="v-container-padding-padding"
                               Open Sans', sans-serif;
                                "
                                align="left"
                              >
                                <div
                                  class="v-line-height v-font-size"
                                 
                                >
                                  <p>
                                    Horeca Depot 2024
                                  </p>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>

                        <!--[if (!mso)&(!IE)]><!-->
                      </div>
                      <!--<![endif]-->
                    </div>
                  </div>
                  <!--[if (mso)|(IE)]></td><![endif]-->
                  <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                </div>
              </div>
            </div>

            <!--[if gte mso 9]>
      </v:textbox></v:rect>
    </td>
    </tr>
    </table>
    <![endif]-->

            <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
          </td>
        </tr>
      </tbody>
    </table>
    <!--[if mso]></div><![endif]-->
    <!--[if IE]></div><![endif]-->
  </body>
</html>

      `,
    };

    // Setup email data for Users
    let mailOptionsUser = {
      to: ["test@huseyinonal.com"], // List of recipients
      subject: "Test Email Vendeur", // Subject line
      authToken: req.cookies.j,
      html: `
      <html>
        <head></head>
        <body>
          <div style="color: white; background-color: black; padding: 20px; text-align: center;">
            <h1>Horeca Depot - Commande ${order.prefix}-${order.number}</h1>
          </div>
          <div style="background-color: white; padding: 20px; text-align: center;">
            <p>Voir commande</p>
            <a href="${process.env.SITE_URL}/admin/order?id=${order.id}" style="display: inline-block; background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Click Here</a>
          </div>
          <div style="color: white; background-color: black; padding: 20px; text-align: center;">
            <p>2024 HorecaDepot</p>
          </div>
        </body>
      </html>
      `,
    };

    sendMail(mailOptionsClient).then((res) => sendMail(mailOptionsUser));
  } catch (e) {
    console.error(e);
    return res.status(500).json(statusText[500]);
  }
}
