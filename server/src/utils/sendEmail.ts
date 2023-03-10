import nodemailer from "nodemailer";
import Logger from "./logger";

const sendEmail = async (user: string, subject: string, message: string) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, // hostname
    secure: false, // TLS requires secureConnection to be false
    port: 587, // port for secure SMTP
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = await transporter.sendMail({
    from: process.env.FROM_MAIL,
    to: user,
    subject: subject,
    text: message,
  });

  // Logger.info("Message sent: %s", mailOptions.messageId);
  // Logger.info("Preview URL: %s", nodemailer.getTestMessageUrl(mailOptions));
};

export default sendEmail;
