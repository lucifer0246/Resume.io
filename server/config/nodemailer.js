import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, // smtp-relay.brevo.com
  port: process.env.SMTP_PORT, // 587
  secure: false, // STARTTLS, must be false for 587
  auth: {
    user: process.env.SMTP_USER, // e.g. 938fd2001@smtp-brevo.com
    pass: process.env.SMTP_PASS, // your Brevo SMTP key
  },
  logger: true,
  debug: true,
});

export default transporter;
