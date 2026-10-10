const nodemailer = require('nodemailer');

let cachedTransporter = null;

async function getTransporter() {
  if (cachedTransporter) return cachedTransporter;

  // 1. If real SMTP credentials are provided in .env
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    cachedTransporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: Number(process.env.EMAIL_PORT) === 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    return cachedTransporter;
  }

  // 2. If SMTP_HOST / SMTP_USER / SMTP_PASS are set
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    cachedTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    return cachedTransporter;
  }

  // 3. Fallback to automated Ethereal test account (real emails with live preview URLs)
  try {
    const testAccount = await nodemailer.createTestAccount();
    console.log(`[EMAIL] ℹ️ Using Ethereal test mail service: ${testAccount.user}`);
    cachedTransporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    return cachedTransporter;
  } catch (err) {
    console.warn('[EMAIL] Could not initialize Ethereal test account:', err.message);
    return null;
  }
}

/**
 * Sends a stylized 6-digit password reset verification email
 */
async function sendPasswordResetEmail({ to, name, otp }) {
  const transporter = await getTransporter();

  const fromAddress = process.env.EMAIL_FROM || process.env.EMAIL_USER || '"TravelGenesis" <noreply@travelgenesis.ng>';
  const recipientName = name ? name.split(' ')[0] : 'Traveler';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your TravelGenesis Verification Code</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F8FAFC; margin: 0; padding: 24px; color: #1E293B; }
        .container { max-width: 520px; margin: 0 auto; background: #FFFFFF; border-radius: 18px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06); border: 1px solid #E2E8F0; }
        .header { background: linear-gradient(135deg, #0D1B2A 0%, #007A8C 100%); padding: 36px 32px; text-align: center; }
        .brand { font-size: 24px; font-weight: 800; color: #FFFFFF; letter-spacing: -0.5px; margin: 0; }
        .brand span { color: #5CE1E6; }
        .header-subtitle { color: rgba(255, 255, 255, 0.85); font-size: 13px; margin-top: 6px; }
        .content { padding: 36px 32px; }
        .greeting { font-size: 18px; font-weight: 700; color: #0F172A; margin: 0 0 12px 0; }
        .message { font-size: 14.5px; line-height: 1.6; color: #475569; margin: 0 0 24px 0; }
        .otp-box { background: #F0FDFA; border: 2px dashed #007A8C; border-radius: 14px; padding: 20px; text-align: center; margin: 24px 0; }
        .otp-label { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #007A8C; margin-bottom: 8px; }
        .otp-code { font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #007A8C; font-family: 'Courier New', monospace; margin: 0; }
        .expiry { font-size: 13px; color: #64748B; margin-top: 10px; }
        .security-note { background: #FEF2F2; border-left: 4px solid #EF4444; border-radius: 6px; padding: 12px 14px; font-size: 13px; color: #991B1B; line-height: 1.5; margin: 24px 0 0 0; }
        .footer { padding: 24px 32px; background: #F8FAFC; border-top: 1px solid #E2E8F0; text-align: center; font-size: 12px; color: #94A3B8; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 class="brand">Travel<span>Genesis</span></h1>
          <div class="header-subtitle">Account Security & Verification</div>
        </div>
        <div class="content">
          <h2 class="greeting">Hello, ${recipientName}</h2>
          <p class="message">We received a request to reset your TravelGenesis account password. Enter the 6-digit verification code below to proceed with resetting your password:</p>
          
          <div class="otp-box">
            <div class="otp-label">Verification Code</div>
            <div class="otp-code">${otp}</div>
            <div class="expiry">This code will expire in <strong>15 minutes</strong>.</div>
          </div>

          <div class="security-note">
            <strong>Security Tip:</strong> Never share this code with anyone. TravelGenesis support will never ask for your password or verification code. If you didn't request this change, you can safely ignore this email.
          </div>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} TravelGenesis Technologies. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;

  const textContent = `
Hello ${recipientName},

Your TravelGenesis password reset verification code is:

${otp}

This code expires in 15 minutes.
If you did not request this password reset, please ignore this email.

TravelGenesis Security Team
  `.trim();

  if (!transporter) {
    console.log(`[EMAIL SIMULATION] Sent to: ${to} | OTP: ${otp}`);
    return { success: true, simulated: true };
  }

  try {
    const info = await transporter.sendMail({
      from: fromAddress,
      to,
      subject: `Your TravelGenesis Verification Code: ${otp}`,
      text: textContent,
      html: htmlContent,
    });

    console.log(`[EMAIL] ✅ Email sent to ${to}: ${info.messageId}`);
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`[EMAIL] 🔗 Live Web Preview URL: ${previewUrl}`);
    }

    return {
      success: true,
      messageId: info.messageId,
      previewUrl,
    };
  } catch (err) {
    console.error(`[EMAIL ERROR] Failed to send email to ${to}:`, err.message);
    throw new Error(`Unable to send verification email: ${err.message}`);
  }
}

module.exports = {
  sendPasswordResetEmail,
};
