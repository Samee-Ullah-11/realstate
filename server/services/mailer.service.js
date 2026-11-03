const { env } = require('../config/env');
const logger = require('../utils/logger');

// Email notification is optional: without SMTP config this is a no-op.
async function notifyNewInquiry(inquiry) {
  const { host, port, user, pass, notifyEmail } = env.smtp;
  if (!host || !user || !pass || !notifyEmail) return;

  const nodemailer = require('nodemailer');
  const transport = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  await transport.sendMail({
    from: `"Website" <${user}>`,
    to: notifyEmail,
    subject: `New inquiry from ${inquiry.name}`,
    text: [
      `Name: ${inquiry.name}`,
      `Phone: ${inquiry.phone}`,
      inquiry.email && `Email: ${inquiry.email}`,
      inquiry.message && `Message: ${inquiry.message}`,
      `Language: ${inquiry.language}`,
    ]
      .filter(Boolean)
      .join('\n'),
  });
  logger.info('Inquiry notification sent');
}

module.exports = { notifyNewInquiry };
