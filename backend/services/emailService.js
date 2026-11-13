/**
 * Email helper that uses SMTP via Nodemailer when configured,
 * and gracefully logs reset instructions in local/development environments.
 */
exports.sendEmail = async ({ to, subject, text, html }) => {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      // Lazy-load nodemailer only when SMTP credentials are configured
      const nodemailer = require('nodemailer');
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.SMTP_FROM || 'StudySync <noreply@studysync.app>',
        to,
        subject,
        text,
        html,
      });
      return { delivered: true, mode: 'smtp' };
    } catch (err) {
      console.warn('SMTP email failed, falling back to log:', err.message);
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    console.log(`[Email Service Fallback] To: ${to} | Subject: ${subject}\n${text}`);
  }
  return { delivered: false, mode: 'console' };
};
