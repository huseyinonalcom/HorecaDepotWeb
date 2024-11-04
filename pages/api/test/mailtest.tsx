export default async function mailTest(req, res) {
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

  // Setup email data for Clients
  let mailOptionsClient = {
    from: `"${process.env.MAIL_SENDER}" <${process.env.MAIL_USER}>`, // Sender address
    to: "huseyin-_-onal@hotmail.com", // List of recipients
    subject: "Confirmation Commande ", // Subject line
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
        style="
          margin: 0;
          padding: 0;
          -webkit-text-size-adjust: 100%;
          background-color: #ecf0f1;
          color: #7e8c8d;
        "
      >
        <!--[if IE]><div class="ie-container"><![endif]-->
        <!--[if mso]><div class="mso-container"><![endif]-->
        <table
          id="u_body"
          style="
            border-collapse: collapse;
            table-layout: fixed;
            border-spacing: 0;
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
            vertical-align: top;
            min-width: 320px;
            margin: 0 auto;
            background-color: #ecf0f1;
            width: 100%;
          "
          cellpadding="0"
          cellspacing="0"
        >
          <tbody>
            <tr style="vertical-align: top">
              <td
                style="
                  word-break: break-word;
                  border-collapse: collapse !important;
                  vertical-align: top;
                "
              >
                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #ecf0f1;"><![endif]-->
    
                <!--[if gte mso 9]>
          <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;min-width: 320px;max-width: 600px;">
            <tr>
              <td background="${process.env.SITE_URL}/assets/email/images/image-5.png" valign="top" width="100%">
          <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width: 600px;">
            <v:fill type="frame" src="${process.env.SITE_URL}/assets/email/images/image-5.png" /><v:textbox style="mso-fit-shape-to-text:true" inset="0,0,0,0">
          <![endif]-->
    
                <div
                  class="u-row-container"
                  style="
                    padding: 0px;
                    background-image: url('${process.env.SITE_URL}/assets/email/images/image-5.png');
                    background-repeat: no-repeat;
                    background-position: center top;
                    background-color: transparent;
                  "
                >
                  <div
                    class="u-row"
                    style="
                      margin: 0 auto;
                      min-width: 320px;
                      max-width: 600px;
                      overflow-wrap: break-word;
                      word-wrap: break-word;
                      word-break: break-word;
                      background-color: transparent;
                    "
                  >
                    <div
                      style="
                        border-collapse: collapse;
                        display: table;
                        width: 100%;
                        height: 100%;
                        background-color: transparent;
                      "
                    >
                      <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-image: url('${process.env.SITE_URL}/assets/email/images/image-5.png');background-repeat: no-repeat;background-position: center top;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->
    
                      <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                      <div
                        class="u-col u-col-100"
                        style="
                          max-width: 320px;
                          min-width: 600px;
                          display: table-cell;
                          vertical-align: top;
                        "
                      >
                        <div style="height: 100%; width: 100% !important">
                          <!--[if (!mso)&(!IE)]><!--><div
                            style="
                              box-sizing: border-box;
                              height: 100%;
                              padding: 0px;
                              border-top: 0px solid transparent;
                              border-left: 0px solid transparent;
                              border-right: 0px solid transparent;
                              border-bottom: 0px solid transparent;
                            "
                          ><!--<![endif]-->
                            <table
                              id="u_content_heading_1"
                              style="font-family: 'Open Sans', sans-serif"
                              role="presentation"
                              cellpadding="0"
                              cellspacing="0"
                              width="100%"
                              border="0"
                            >
                              <tbody>
                                <tr>
                                  <td
                                    class="v-container-padding-padding"
                                    style="
                                      overflow-wrap: break-word;
                                      word-break: break-word;
                                      padding: 200px 10px 5px;
                                      font-family: 'Open Sans', sans-serif;
                                    "
                                    align="left"
                                  >
                                    <!--[if mso]><table width="100%"><tr><td><![endif]-->
                                    <h1
                                      class="v-line-height v-font-size"
                                      style="
                                        margin: 0px;
                                        color: #f1c40f;
                                        line-height: 90%;
                                        text-align: center;
                                        word-wrap: break-word;
                                        font-family: Arvo;
                                        font-size: 71px;
                                        font-weight: 400;
                                      "
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
                              style="font-family: 'Open Sans', sans-serif"
                              role="presentation"
                              cellpadding="0"
                              cellspacing="0"
                              width="100%"
                              border="0"
                            >
                              <tbody>
                                <tr>
                                  <td
                                    class="v-container-padding-padding"
                                    style="
                                      overflow-wrap: break-word;
                                      word-break: break-word;
                                      padding: 10px;
                                      font-family: 'Open Sans', sans-serif;
                                    "
                                    align="left"
                                  >
                                    <!--[if mso]><table width="100%"><tr><td><![endif]-->
                                    <h1
                                      class="v-line-height v-font-size"
                                      style="
                                        margin: 0px;
                                        color: #ffffff;
                                        line-height: 110%;
                                        text-align: center;
                                        word-wrap: break-word;
                                        font-family: Arvo;
                                        font-size: 50px;
                                        font-weight: 400;
                                      "
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
                              style="font-family: 'Open Sans', sans-serif"
                              role="presentation"
                              cellpadding="0"
                              cellspacing="0"
                              width="100%"
                              border="0"
                            >
                              <tbody>
                                <tr>
                                  <td
                                    class="v-container-padding-padding"
                                    style="
                                      overflow-wrap: break-word;
                                      word-break: break-word;
                                      padding: 10px;
                                      font-family: 'Open Sans', sans-serif;
                                    "
                                    align="left"
                                  >
                                    <div
                                      class="v-line-height v-font-size"
                                      style="
                                        font-family: 'Open Sans', sans-serif;
                                        font-size: 16px;
                                        color: #ffffff;
                                        line-height: 140%;
                                        text-align: center;
                                        word-wrap: break-word;
                                      "
                                    >
                                      <p style="line-height: 140%">
                                        <span
                                          data-metadata="&lt;!--(figmeta)eyJmaWxlS2V5IjoicmkxdVlheFJKck1qakhmdVV3UllhSSIsInBhc3RlSUQiOjEwMDg4MzA4MjMsImRhdGFUeXBlIjoic2NlbmUifQo=(/figmeta)--&gt;"
                                          style="line-height: 22.4px"
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
                              style="font-family: 'Open Sans', sans-serif"
                              role="presentation"
                              cellpadding="0"
                              cellspacing="0"
                              width="100%"
                              border="0"
                            >
                              <tbody>
                                <tr>
                                  <td
                                    class="v-container-padding-padding"
                                    style="
                                      overflow-wrap: break-word;
                                      word-break: break-word;
                                      padding: 10px 50px 25px;
                                      font-family: 'Open Sans', sans-serif;
                                    "
                                    align="left"
                                  >
                                    <div
                                      class="v-line-height v-font-size"
                                      style="
                                        font-family: inherit;
                                        font-size: 14px;
                                        color: #95a5a6;
                                        line-height: 140%;
                                        text-align: center;
                                        word-wrap: break-word;
                                      "
                                    >
                                      <p style="line-height: 140%">
                                        Text Text text
                                      </p>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
    
                            <table
                              id="u_content_button_1"
                              style="font-family: 'Open Sans', sans-serif"
                              role="presentation"
                              cellpadding="0"
                              cellspacing="0"
                              width="100%"
                              border="0"
                            >
                              <tbody>
                                <tr>
                                  <td
                                    class="v-container-padding-padding"
                                    style="
                                      overflow-wrap: break-word;
                                      word-break: break-word;
                                      padding: 10px;
                                      font-family: 'Open Sans', sans-serif;
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
                                      <!--[if mso]><table border="0" cellspacing="0" cellpadding="0"><tr><td align="center" bgcolor="#f1c40f" style="padding:10px 20px;" valign="top"><![endif]-->
                                      <a
                                        href="${process.env.SITE_URL}"
                                        target="_blank"
                                        class="v-button v-size-width v-font-size"
                                        style="
                                          box-sizing: border-box;
                                          display: inline-block;
                                          text-decoration: none;
                                          -webkit-text-size-adjust: none;
                                          text-align: center;
                                          color: #000000;
                                          background-color: #f1c40f;
                                          border-radius: 4px;
                                          -webkit-border-radius: 4px;
                                          -moz-border-radius: 4px;
                                          width: 30%;
                                          max-width: 100%;
                                          padding-top: 10px;
                                          padding-bottom: 10px;
                                          overflow-wrap: break-word;
                                          word-break: break-word;
                                          word-wrap: break-word;
                                          mso-border-alt: none;
                                          font-size: 14px;
                                        "
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
                              style="font-family: 'Open Sans', sans-serif"
                              role="presentation"
                              cellpadding="0"
                              cellspacing="0"
                              width="100%"
                              border="0"
                            >
                              <tbody>
                                <tr>
                                  <td
                                    class="v-container-padding-padding"
                                    style="
                                      overflow-wrap: break-word;
                                      word-break: break-word;
                                      padding: 40px 80px 10px;
                                      font-family: 'Open Sans', sans-serif;
                                    "
                                    align="left"
                                  >
                                    <div
                                      class="v-line-height v-font-size"
                                      style="
                                        font-size: 14px;
                                        line-height: 160%;
                                        text-align: center;
                                        word-wrap: break-word;
                                      "
                                    >
                                      <p style="font-size: 14px; line-height: 160%">
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
                              style="font-family: 'Open Sans', sans-serif"
                              role="presentation"
                              cellpadding="0"
                              cellspacing="0"
                              width="100%"
                              border="0"
                            >
                              <tbody>
                                <tr>
                                  <td
                                    class="v-container-padding-padding"
                                    style="
                                      overflow-wrap: break-word;
                                      word-break: break-word;
                                      padding: 20px 0px;
                                      font-family: 'Open Sans', sans-serif;
                                    "
                                    align="left"
                                  >
                                    <table
                                      height="0px"
                                      align="center"
                                      border="0"
                                      cellpadding="0"
                                      cellspacing="0"
                                      width="100%"
                                      style="
                                        border-collapse: collapse;
                                        table-layout: fixed;
                                        border-spacing: 0;
                                        mso-table-lspace: 0pt;
                                        mso-table-rspace: 0pt;
                                        vertical-align: top;
                                        border-top: 1px solid #bbbbbb;
                                        -ms-text-size-adjust: 100%;
                                        -webkit-text-size-adjust: 100%;
                                      "
                                    >
                                      <tbody>
                                        <tr style="vertical-align: top">
                                          <td
                                            style="
                                              word-break: break-word;
                                              border-collapse: collapse !important;
                                              vertical-align: top;
                                              font-size: 0px;
                                              line-height: 0px;
                                              mso-line-height-rule: exactly;
                                              -ms-text-size-adjust: 100%;
                                              -webkit-text-size-adjust: 100%;
                                            "
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
                              style="font-family: 'Open Sans', sans-serif"
                              role="presentation"
                              cellpadding="0"
                              cellspacing="0"
                              width="100%"
                              border="0"
                            >
                              <tbody>
                                <tr>
                                  <td
                                    class="v-container-padding-padding"
                                    style="
                                      overflow-wrap: break-word;
                                      word-break: break-word;
                                      padding: 10px;
                                      font-family: 'Open Sans', sans-serif;
                                    "
                                    align="left"
                                  >
                                    <div align="center">
                                      <div style="display: table; max-width: 187px">
                                        <!--[if (mso)|(IE)]><table width="187" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-collapse:collapse;" align="center"><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse; mso-table-lspace: 0pt;mso-table-rspace: 0pt; width:187px;"><tr><![endif]-->
    
                                        <!--[if (mso)|(IE)]><td width="32" style="width:32px; padding-right: 15px;" valign="top"><![endif]-->
                                        <table
                                          align="left"
                                          border="0"
                                          cellspacing="0"
                                          cellpadding="0"
                                          width="32"
                                          height="32"
                                          style="
                                            width: 32px !important;
                                            height: 32px !important;
                                            display: inline-block;
                                            border-collapse: collapse;
                                            table-layout: fixed;
                                            border-spacing: 0;
                                            mso-table-lspace: 0pt;
                                            mso-table-rspace: 0pt;
                                            vertical-align: top;
                                            margin-right: 15px;
                                          "
                                        >
                                          <tbody>
                                            <tr style="vertical-align: top">
                                              <td
                                                align="left"
                                                valign="middle"
                                                style="
                                                  word-break: break-word;
                                                  border-collapse: collapse !important;
                                                  vertical-align: top;
                                                "
                                              >
                                                <a
                                                  href="https://www.facebook.com/"
                                                  title="Facebook"
                                                  target="_blank"
                                                >
                                                  <img
                                                    src="${process.env.SITE_URL}/assets/email/images/image-4.png"
                                                    alt="Facebook"
                                                    title="Facebook"
                                                    width="32"
                                                    style="
                                                      outline: none;
                                                      text-decoration: none;
                                                      -ms-interpolation-mode: bicubic;
                                                      clear: both;
                                                      display: block !important;
                                                      border: none;
                                                      height: auto;
                                                      float: none;
                                                      max-width: 32px !important;
                                                    "
                                                  />
                                                </a>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                        <!--[if (mso)|(IE)]></td><![endif]-->
    
                                        <!--[if (mso)|(IE)]><td width="32" style="width:32px; padding-right: 15px;" valign="top"><![endif]-->
                                        <table
                                          align="left"
                                          border="0"
                                          cellspacing="0"
                                          cellpadding="0"
                                          width="32"
                                          height="32"
                                          style="
                                            width: 32px !important;
                                            height: 32px !important;
                                            display: inline-block;
                                            border-collapse: collapse;
                                            table-layout: fixed;
                                            border-spacing: 0;
                                            mso-table-lspace: 0pt;
                                            mso-table-rspace: 0pt;
                                            vertical-align: top;
                                            margin-right: 15px;
                                          "
                                        >
                                          <tbody>
                                            <tr style="vertical-align: top">
                                              <td
                                                align="left"
                                                valign="middle"
                                                style="
                                                  word-break: break-word;
                                                  border-collapse: collapse !important;
                                                  vertical-align: top;
                                                "
                                              >
                                                <a
                                                  href="https://www.linkedin.com/"
                                                  title="LinkedIn"
                                                  target="_blank"
                                                >
                                                  <img
                                                    src="${process.env.SITE_URL}/assets/email/images/image-1.png"
                                                    alt="LinkedIn"
                                                    title="LinkedIn"
                                                    width="32"
                                                    style="
                                                      outline: none;
                                                      text-decoration: none;
                                                      -ms-interpolation-mode: bicubic;
                                                      clear: both;
                                                      display: block !important;
                                                      border: none;
                                                      height: auto;
                                                      float: none;
                                                      max-width: 32px !important;
                                                    "
                                                  />
                                                </a>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                        <!--[if (mso)|(IE)]></td><![endif]-->
    
                                        <!--[if (mso)|(IE)]><td width="32" style="width:32px; padding-right: 15px;" valign="top"><![endif]-->
                                        <table
                                          align="left"
                                          border="0"
                                          cellspacing="0"
                                          cellpadding="0"
                                          width="32"
                                          height="32"
                                          style="
                                            width: 32px !important;
                                            height: 32px !important;
                                            display: inline-block;
                                            border-collapse: collapse;
                                            table-layout: fixed;
                                            border-spacing: 0;
                                            mso-table-lspace: 0pt;
                                            mso-table-rspace: 0pt;
                                            vertical-align: top;
                                            margin-right: 15px;
                                          "
                                        >
                                          <tbody>
                                            <tr style="vertical-align: top">
                                              <td
                                                align="left"
                                                valign="middle"
                                                style="
                                                  word-break: break-word;
                                                  border-collapse: collapse !important;
                                                  vertical-align: top;
                                                "
                                              >
                                                <a
                                                  href="https://www.instagram.com/"
                                                  title="Instagram"
                                                  target="_blank"
                                                >
                                                  <img
                                                    src="${process.env.SITE_URL}/assets/email/images/image-2.png"
                                                    alt="Instagram"
                                                    title="Instagram"
                                                    width="32"
                                                    style="
                                                      outline: none;
                                                      text-decoration: none;
                                                      -ms-interpolation-mode: bicubic;
                                                      clear: both;
                                                      display: block !important;
                                                      border: none;
                                                      height: auto;
                                                      float: none;
                                                      max-width: 32px !important;
                                                    "
                                                  />
                                                </a>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                        <!--[if (mso)|(IE)]></td><![endif]-->
    
                                        <!--[if (mso)|(IE)]><td width="32" style="width:32px; padding-right: 0px;" valign="top"><![endif]-->
                                        <table
                                          align="left"
                                          border="0"
                                          cellspacing="0"
                                          cellpadding="0"
                                          width="32"
                                          height="32"
                                          style="
                                            width: 32px !important;
                                            height: 32px !important;
                                            display: inline-block;
                                            border-collapse: collapse;
                                            table-layout: fixed;
                                            border-spacing: 0;
                                            mso-table-lspace: 0pt;
                                            mso-table-rspace: 0pt;
                                            vertical-align: top;
                                            margin-right: 0px;
                                          "
                                        >
                                          <tbody>
                                            <tr style="vertical-align: top">
                                              <td
                                                align="left"
                                                valign="middle"
                                                style="
                                                  word-break: break-word;
                                                  border-collapse: collapse !important;
                                                  vertical-align: top;
                                                "
                                              >
                                                <a
                                                  href="https://twitter.com/"
                                                  title="X"
                                                  target="_blank"
                                                >
                                                  <img
                                                    src="${process.env.SITE_URL}/assets/email/images/image-3.png"
                                                    alt="X"
                                                    title="X"
                                                    width="32"
                                                    style="
                                                      outline: none;
                                                      text-decoration: none;
                                                      -ms-interpolation-mode: bicubic;
                                                      clear: both;
                                                      display: block !important;
                                                      border: none;
                                                      height: auto;
                                                      float: none;
                                                      max-width: 32px !important;
                                                    "
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
                              style="font-family: 'Open Sans', sans-serif"
                              role="presentation"
                              cellpadding="0"
                              cellspacing="0"
                              width="100%"
                              border="0"
                            >
                              <tbody>
                                <tr>
                                  <td
                                    class="v-container-padding-padding"
                                    style="
                                      overflow-wrap: break-word;
                                      word-break: break-word;
                                      padding: 10px;
                                      font-family: 'Open Sans', sans-serif;
                                    "
                                    align="left"
                                  >
                                    <div class="menu" style="text-align: center">
                                      <!--[if (mso)|(IE)]><table role="presentation" border="0" cellpadding="0" cellspacing="0" align="center"><tr><![endif]-->
    
                                      <!--[if (mso)|(IE)]><td style="padding:5px 15px"><![endif]-->
    
                                      <a
                                        href="${process.env.SITE_URL}"
                                        target="_self"
                                        style="
                                          padding: 5px 15px;
                                          display: inline-block;
                                          color: #ffffff;
                                          font-size: 14px;
                                          text-decoration: none;
                                        "
                                        class="v-padding v-font-size"
                                      >
                                        Home
                                      </a>
    
                                      <!--[if (mso)|(IE)]></td><![endif]-->
    
                                      <!--[if (mso)|(IE)]><td style="padding:5px 15px"><![endif]-->
                                      <span
                                        style="
                                          padding: 5px 15px;
                                          display: inline-block;
                                          color: #ffffff;
                                          font-size: 14px;
                                        "
                                        class="v-padding v-font-size hide-mobile"
                                      >
                                        |
                                      </span>
                                      <!--[if (mso)|(IE)]></td><![endif]-->
    
                                      <!--[if (mso)|(IE)]><td style="padding:5px 15px"><![endif]-->
    
                                      <a
                                        href="${process.env.SITE_URL}/shop/tous?page=1"
                                        target="_self"
                                        style="
                                          padding: 5px 15px;
                                          display: inline-block;
                                          color: #ffffff;
                                          font-size: 14px;
                                          text-decoration: none;
                                        "
                                        class="v-padding v-font-size"
                                      >
                                        Shop
                                      </a>
    
                                      <!--[if (mso)|(IE)]></td><![endif]-->
    
                                      <!--[if (mso)|(IE)]><td style="padding:5px 15px"><![endif]-->
                                      <span
                                        style="
                                          padding: 5px 15px;
                                          display: inline-block;
                                          color: #ffffff;
                                          font-size: 14px;
                                        "
                                        class="v-padding v-font-size hide-mobile"
                                      >
                                        |
                                      </span>
                                      <!--[if (mso)|(IE)]></td><![endif]-->
    
                                      <!--[if (mso)|(IE)]><td style="padding:5px 15px"><![endif]-->
    
                                      <a
                                        href="${process.env.SITE_URL}/contact"
                                        target="_self"
                                        style="
                                          padding: 5px 15px;
                                          display: inline-block;
                                          color: #ffffff;
                                          font-size: 14px;
                                          text-decoration: none;
                                        "
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
                              style="font-family: 'Open Sans', sans-serif"
                              role="presentation"
                              cellpadding="0"
                              cellspacing="0"
                              width="100%"
                              border="0"
                            >
                              <tbody>
                                <tr>
                                  <td
                                    class="v-container-padding-padding"
                                    style="
                                      overflow-wrap: break-word;
                                      word-break: break-word;
                                      padding: 10px 10px 40px;
                                      font-family: 'Open Sans', sans-serif;
                                    "
                                    align="left"
                                  >
                                    <div
                                      class="v-line-height v-font-size"
                                      style="
                                        font-size: 14px;
                                        line-height: 160%;
                                        text-align: center;
                                        word-wrap: break-word;
                                      "
                                    >
                                      <p style="font-size: 14px; line-height: 160%">
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

  // Send mail client
  transporter.sendMail(mailOptionsClient, (error, info) => {
    if (error) {
    } else {
      const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        const year = date.getFullYear();
        // JavaScript months are 0-indexed, so add 1 to get the correct month
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");

        return `${year}-${month}-${day} ${hours}-${minutes}`;
      };

      // Example usage:
      const timestamp = Date.now(); // Current timestamp
      const formattedDate = formatTimestamp(timestamp);

      return res.status(200).json(formattedDate);
    }
  });
}
