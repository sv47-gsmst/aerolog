const nodemailer = require('nodemailer');

let transporter = null;

async function getTransporter() {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: process.env.ETHEREAL_USER,
      pass: process.env.ETHEREAL_PASS
    }
  });

  return transporter;
}

async function sendMagicLink(email, token) {
  const transport = await getTransporter();
  const magicUrl = `${process.env.FRONTEND_URL}/auth/verify?token=${token}`;

  const info = await transport.sendMail({
    from: '"Aerolog" <noreply@aerolog.me>',
    to: email,
    subject: 'Your Aerolog login link',
    html: `
      <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
        <h1 style="font-size: 24px; color: #1a1a1a;">Sign in to Aerolog</h1>
        <p style="color: #555; line-height: 1.6;">
          Click the button below to sign in. This link expires in 15 minutes and can only be used once.
        </p>
        <a href="${magicUrl}"
          style="display: inline-block; margin: 24px 0; padding: 14px 28px;
                 background: #4a90d9; color: white; border-radius: 8px;
                 text-decoration: none; font-weight: 600; font-size: 16px;">
          Sign in to Aerolog
        </a>
        <p style="color: #999; font-size: 13px;">
          If you didn't request this, you can safely ignore this email.
        </p>
      </div>
    `
  });

  // Ethereal preview URL - shows where to view the "sent" email in browser
  console.log('Magic link preview URL:', nodemailer.getTestMessageUrl(info));
  return nodemailer.getTestMessageUrl(info);
}

module.exports = { sendMagicLink };