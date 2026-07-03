import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth:{
    user:process.env.SMTP_USER,
    pass:process.env.SMTP_PASS
  }
});
