const { Resend } = require('resend');

/**
 * Sends an email using Resend API.
 * Expects RESEND_API_KEY to be configured in process.env.
 * @param {Object} options - Email options.
 * @param {string} options.email - Recipient email.
 * @param {string} options.subject - Email subject.
 * @param {string} options.html - HTML content of the email.
 */
const sendEmail = async (options) => {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not configured');
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  // If you don't have a custom domain verified in Resend, you MUST use 'onboarding@resend.dev'
  // as the sender, and you can only send TO the email address you signed up with.
  const { data, error } = await resend.emails.send({
    from: 'ResumePilot AI <onboarding@resend.dev>',
    to: options.email,
    subject: options.subject,
    html: options.html,
  });

  if (error) {
    console.error('[Resend Error]:', error);
    throw new Error(error.message);
  }

  console.log('[Resend] Email sent successfully:', data);
  return data;
};

module.exports = sendEmail;
