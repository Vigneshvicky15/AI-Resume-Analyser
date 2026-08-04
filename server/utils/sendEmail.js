/**
 * Sends an email using EmailJS REST API.
 * Expects EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY, and EMAILJS_PRIVATE_KEY to be configured in process.env.
 * @param {Object} options - Email options.
 * @param {string} options.email - Recipient email.
 * @param {string} options.subject - Email subject.
 * @param {string} options.html - HTML content of the email.
 */
const sendEmail = async (options) => {
  if (!process.env.EMAILJS_SERVICE_ID || !process.env.EMAILJS_TEMPLATE_ID || !process.env.EMAILJS_PUBLIC_KEY || !process.env.EMAILJS_PRIVATE_KEY) {
    throw new Error('EmailJS credentials are not fully configured on the server. Please contact the administrator.');
  }

  const payload = {
    service_id: process.env.EMAILJS_SERVICE_ID,
    template_id: process.env.EMAILJS_TEMPLATE_ID,
    user_id: process.env.EMAILJS_PUBLIC_KEY,
    accessToken: process.env.EMAILJS_PRIVATE_KEY,
    template_params: {
      to_email: options.email,
      subject: options.subject,
      message_html: options.html
    }
  };

  const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('[EmailJS Error]:', errorText);
    throw new Error('Failed to send email via EmailJS');
  }

  console.log('[EmailJS] Email sent successfully');
  return true;
};

module.exports = sendEmail;
