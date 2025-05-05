import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
export const sendEmail = async ({ to, subject, text, html }) => {
    try {
      const transporter = nodemailer.createTransport({
        host: "smtp-relay.brevo.com",
        port: 587,
        auth: {
          user: process.env.BREVO_EMAIL,
          pass: process.env.BREVO_API_KEY,
        },
      });
  
      const mailOptions = {
        from: process.env.BREVO_FROM_EMAIL,
        to,
        subject,
        text, // fallback
        html, // beautiful version
      };
  
      await transporter.sendMail(mailOptions);
      console.log("Email sent successfully");
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };
  