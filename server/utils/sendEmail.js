const nodemailer = require('nodemailer');

/**
 * Sends an email using Nodemailer and Gmail SMTP service.
 * Expects SMTP_USER and SMTP_PASS to be configured in process.env.
 * @param {Object} options - Email options.
 * @param {string} options.email - Recipient email.
 * @param {string} options.subject - Email subject.
 * @param {string} options.html - HTML content of the email.
 */
const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    connectionTimeout: 5000, // 5 seconds
    greetingTimeout: 5000,
    socketTimeout: 10000, // 10 seconds
  });

  const mailOptions = {
    from: `"ResumePilot AI" <${process.env.SMTP_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
