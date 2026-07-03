import { transporter } from "../lib/mail";
import { NextResponse } from "next/server";

export default async function sendEmail(req) {

  const {name,email,message} = await req.json();

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: "owner@example.com",
    subject: "Message from the web",
    text: message
  });

  return NextResponse.json({
    success:true,
    message:"message sent"
  });
  
}