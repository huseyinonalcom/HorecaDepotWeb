import { error } from "console";
import { getConfig } from "../../pages/api/config/private/getconfig";

type mailProps = {
  to: string[];
  subject: string;
  html: string;
};

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${year}-${month}-${day} ${hours}-${minutes}`;
};

export const sendMail = async (mailOptions: mailProps) => {
  const nodemailer = require("nodemailer");

  let mailConfig = (await getConfig()).mail;
  try {
    let transporter = nodemailer.createTransport({
      host: mailConfig.mailHost,
      port: mailConfig.mailPort,
      secure: false,
      auth: {
        user: mailConfig.mailUser,
        pass: mailConfig.mailPass,
      },
    });

    let mailParams = {
      from: `"${mailConfig.mailSenderName}" <${mailConfig.mailSender}>`, // Sender address
      to: mailOptions.to, // List of recipients
      subject: mailOptions.subject, // Subject line
      html: mailOptions.html,
    };

    // Send mail client
    transporter.sendMail(mailParams, (error, info) => {
      const timestamp = Date.now();
      const formattedDate = formatTimestamp(timestamp);
      if (error) {
        return {
          result: "failed",
          timestamp: formattedDate,
          error,
        };
      } else {
        return {
          result: "success",
          timestamp: formattedDate,
          info,
        };
      }
    });
  } catch (e) {
    console.log(e);
    return {
      result: "error",
    };
  }
};
