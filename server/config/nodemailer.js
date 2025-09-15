import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, // e.g. smtp.gmail.com / smtp.zoho.com / smtp.resend.com
  port: process.env.SMTP_PORT, // 465 (SSL) or 587 (TLS)
  auth: {
    user: process.env.SMTP_USER, // SMTP username
    pass: process.env.SMTP_PASS, // SMTP password / API key
  },
  logger: true, // logs connection info
  debug: true, // show detailed debug info
});

export default transporter;
