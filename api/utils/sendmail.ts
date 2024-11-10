import { getConfig } from "../../pages/api/config/private/getconfig";

type mailProps = {
  to: string[];
  subject: string;
  html: string;
  mailParams?: {
    mailUser: string;
    mailHost: string;
    mailPass: string;
    mailPort: string;
    mailSender: string;
    mailSenderName: string;
    mailTo: string;
  };
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
  let mailConfig;

  if (mailOptions.mailParams) {
    mailConfig = mailOptions.mailParams;
  } else {
    mailConfig = (await getConfig()).mail;
  }

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
      from: `"${mailConfig.mailSenderName}" <${mailConfig.mailSender}>`,
      to: mailOptions.to,
      subject: mailOptions.subject,
      html: mailOptions.html,
    };

    const timestamp = Date.now();
    const formattedDate = formatTimestamp(timestamp);

    const info = await transporter.sendMail(mailParams);

    return {
      result: "success",
      timestamp: formattedDate,
      info,
    };
  } catch (e) {
    return {
      result: "error",
      error: e,
    };
  }
};
