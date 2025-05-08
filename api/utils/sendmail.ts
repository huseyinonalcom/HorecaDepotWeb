import { getConfig } from "../../pages/api/private/config";

type mailProps = {
  to: string[];
  subject: string;
  html: string;
  attachments?: string[];
  replyTo?: string;
  authToken: string;
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
    mailConfig = (await getConfig({ authToken: mailOptions.authToken })).result
      .mail;
  }

  try {
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: "587",
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    let mailParams = {
      from: `"${process.env.MAIL_SENDER}" <${process.env.MAIL_USER}>`,
      to: mailOptions.to,
      replyTo: mailOptions.replyTo,
      subject: mailOptions.subject,
      html: mailOptions.html,
      attachments: mailOptions.attachments,
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
    console.error(e);
    return {
      result: "error",
      error: e,
    };
  }
};
