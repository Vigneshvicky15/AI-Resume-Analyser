const nodemailer = require('nodemailer');
const dns = require('dns');

/**
 * Sends an email using Nodemailer and Gmail SMTP service.
 * Expects SMTP_USER and SMTP_PASS to be configured in process.env.
 * @param {Object} options - Email options.
 * @param {string} options.email - Recipient email.
 * @param {string} options.subject - Email subject.
 * @param {string} options.html - HTML content of the email.
 */
const sendEmail = async (options) => {
  // Force IPv4 resolution to bypass Render's IPv6 ENETUNREACH issues
  let smtpHost = 'smtp.gmail.com';
  try {
    const lookupResult = await dns.promises.lookup('smtp.gmail.com', { family: 4 });
    smtpHost = lookupResult.address;
    console.log(`[SMTP] Resolved smtp.gmail.com to IPv4: ${smtpHost}`);
  } catch (err) {
    console.error('[SMTP] DNS lookup failed, falling back to hostname', err);
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    connectionTimeout: 5000, // Fail fast if blocked
    socketTimeout: 5000,
    tls: {
      servername: 'smtp.gmail.com', // Required for SNI when connecting via IP
      rejectUnauthorized: false
    }
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
