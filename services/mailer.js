import { transporter } from "../lib/mail";

export default async function sendEmail({ name, email, message }) {
    await transporter.verify();

    await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: "abuhanifainstallation@gmail.com",
        subject: "Message from contact form",
        text: `Message from Abu Hanifa page,

  Name: ${ name }
Email: ${ email }
Message: ${ message } `,
    });

    return true;
}
