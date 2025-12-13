import nodemailer from "nodemailer";
import { NEWS_SUMMARY_EMAIL_TEMPLATE } from "./template";

/**
 * ✅ Shared Nodemailer Transporter
 */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

/**
 * ✅ Welcome Email
 */
export const sendWelcomeEmail = async ({
  email,
  name,
  intro,
}: {
  email: string;
  name: string;
  intro: string;
}) => {
  const mailOptions = {
    from: `"Signalist" <${process.env.NODEMAILER_EMAIL}>`,
    to: email,
    subject: `Welcome to Signalist, ${name}!`,
    html: `
      <h2>Welcome, ${name} 🎉</h2>
      <p>${intro}</p>
      <p>We are excited to have you on board!</p>
    `,
  };

  return transporter.sendMail(mailOptions);
};

/**
 * ✅ Daily News Summary Email
 */
export const sendNewsSummaryEmail = async ({
  email,
  date,
  newsContent,
}: {
  email: string;
  date: string;
  newsContent: string;
}): Promise<void> => {
  if (!email || !newsContent) return;

  const htmlTemplate = NEWS_SUMMARY_EMAIL_TEMPLATE
    .replace("{{date}}", date)
    .replace("{{newsContent}}", newsContent.replace(/\n/g, "<br />"));

  const mailOptions = {
    from: `"Signalist News" <${process.env.NODEMAILER_EMAIL}>`,
    to: email,
    subject: `📈 Market News Summary Today - ${date}`,
    text: `Today's market news summary from Signalist`,
    html: htmlTemplate,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("❌ sendNewsSummaryEmail failed:", email, error);
  }
};
