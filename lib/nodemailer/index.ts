// import nodemailer from "nodemailer";
// import { WELCOME_EMAIL_TEMPLATE } from "./template";

// export const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.NODEMAILER_EMAIL,
//     pass: process.env.NODEMAILER_PASSWORD,
//   },
// });

// export const sendWelcomeEmail = async({email, name, intro}:WelcomeEmailData) => {
//     const htmlTemplate = WELCOME_EMAIL_TEMPLATE.replace("{{name}}", name).replace("{{intro}}", intro);

//     const mailOptions = {
//         from:`Signalist <${process.env.NODEMAILER_EMAIL}> signalist@gungun.com`,
//         to:email,
//         subject:"Welcome to Signalist 🎉 - your stock market toolkit is ready",
//         text:"Thank you for joining Signalist! We're excited to have you on board.",
//         html:htmlTemplate
//     }

//     await transporter.sendMail(mailOptions);
// }

import nodemailer from "nodemailer";

export const sendWelcomeEmail = async ({
  email,
  name,
  intro
}: {
  email: string;
  name: string;
  intro: string;
}) => {
  // Configure transporter (Gmail example, use app password)
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PASSWORD
    }
  });

  const mailOptions = {
    from: `"Signalist" <${process.env.NODEMAILER_EMAIL}>`,
    to: email,
    subject: `Welcome to Signalist, ${name}!`,
    text: `${intro}\n\nHi ${name}, welcome to our platform!`,
    html: `<p>${intro}</p><p>Hi <b>${name}</b>, welcome to our platform!</p>`
  };

  return transporter.sendMail(mailOptions);
};
