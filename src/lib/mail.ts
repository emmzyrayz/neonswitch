import nodemailer from "nodemailer";

// Email configuration
const EMAIL_CONFIG = {
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
};

// Create reusable transporter
const transporter = nodemailer.createTransport(EMAIL_CONFIG);

// Verify connection on startup (optional)
transporter.verify((error) => {
  if (error) {
    console.error("❌ SMTP connection failed:", error);
  } else {
    console.log("✅ SMTP server is ready to send emails");
  }
});

// Base email sender function
export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}) {
  try {
    const info = await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM_ADDRESS}>`,
      to,
      subject,
      html,
      text: text || stripHtml(html), // Fallback plain text
    });

    console.log("📧 Email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    return { success: false, error };
  }
}

// Helper: Strip HTML tags for plain text fallback
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Email template wrapper
function emailTemplate({
  title,
  preheader,
  content,
}: {
  title: string;
  preheader?: string;
  content: string;
}): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #f4f4f7;
      color: #333;
    }
    .email-wrapper {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 40px 20px;
      text-align: center;
    }
    .logo {
      color: #ffffff;
      font-size: 32px;
      font-weight: bold;
      text-decoration: none;
      letter-spacing: 1px;
    }
    .content {
      padding: 40px 20px;
    }
    .button {
      display: inline-block;
      padding: 14px 32px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      margin: 20px 0;
    }
    .code-box {
      background-color: #f8f9fa;
      border: 2px dashed #667eea;
      border-radius: 8px;
      padding: 20px;
      text-align: center;
      margin: 20px 0;
    }
    .code {
      font-size: 32px;
      font-weight: bold;
      letter-spacing: 4px;
      color: #667eea;
      font-family: 'Courier New', monospace;
    }
    .footer {
      background-color: #f8f9fa;
      padding: 20px;
      text-align: center;
      font-size: 14px;
      color: #6c757d;
    }
    .preheader {
      display: none;
      font-size: 1px;
      color: #f4f4f7;
      line-height: 1px;
      max-height: 0;
      max-width: 0;
      opacity: 0;
      overflow: hidden;
    }
    h1 {
      color: #333;
      margin-bottom: 10px;
    }
    p {
      line-height: 1.6;
      margin: 15px 0;
      color: #555;
    }
    .divider {
      height: 1px;
      background-color: #e0e0e0;
      margin: 30px 0;
    }
  </style>
</head>
<body>
  ${preheader ? `<span class="preheader">${preheader}</span>` : ""}
  <div class="email-wrapper">
    <div class="header">
      <a href="${process.env.NEXT_PUBLIC_APP_URL}" class="logo">NEONSECURE</a>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} NeonSecure. All rights reserved.</p>
      <p>
        <a href="${
          process.env.NEXT_PUBLIC_APP_URL
        }" style="color: #667eea; text-decoration: none;">Visit our website</a> |
        <a href="${
          process.env.NEXT_PUBLIC_APP_URL
        }/support" style="color: #667eea; text-decoration: none;">Contact support</a>
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

// ============================================
// EMAIL INSTANCES
// ============================================

// 1. Welcome/Verification Email
export async function sendVerificationEmail(
  email: string,
  verificationUrl: string,
  verificationCode: string
) {
  const content = `
    <h1>Welcome to NeonSecure! 🎉</h1>
    <p>Thank you for signing up. We're excited to have you on board!</p>
    <p>To complete your registration and verify your email address, please use one of the following methods:</p>
    
    <div class="divider"></div>
    
    <h3>Method 1: Click the button</h3>
    <a href="${verificationUrl}" class="button">Verify Email Address</a>
    
    <div class="divider"></div>
    
    <h3>Method 2: Enter this code</h3>
    <div class="code-box">
      <div class="code">${verificationCode}</div>
    </div>
    <p style="text-align: center; color: #6c757d; font-size: 14px;">This code will expire in 24 hours</p>
    
    <div class="divider"></div>
    
    <p style="font-size: 14px; color: #6c757d;">
      If you didn't create an account with NeonSecure, you can safely ignore this email.
    </p>
  `;

  return sendEmail({
    to: email,
    subject: "Verify Your Email - NeonSecure",
    html: emailTemplate({
      title: "Verify Your Email",
      preheader: "Complete your registration by verifying your email address",
      content,
    }),
  });
}

// 2. Password Reset Email
export async function sendPasswordResetEmail(
  email: string,
  resetUrl: string,
  resetCode: string
) {
  const content = `
    <h1>Reset Your Password 🔒</h1>
    <p>We received a request to reset your password for your NeonSecure account.</p>
    <p>To reset your password, please use one of the following methods:</p>
    
    <div class="divider"></div>
    
    <h3>Method 1: Click the button</h3>
    <a href="${resetUrl}" class="button">Reset Password</a>
    
    <div class="divider"></div>
    
    <h3>Method 2: Enter this code</h3>
    <div class="code-box">
      <div class="code">${resetCode}</div>
    </div>
    <p style="text-align: center; color: #6c757d; font-size: 14px;">This code will expire in 1 hour</p>
    
    <div class="divider"></div>
    
    <p style="font-size: 14px; color: #ff4444;">
      <strong>⚠️ Security Notice:</strong> If you didn't request a password reset, please ignore this email or contact support if you're concerned about your account security.
    </p>
  `;

  return sendEmail({
    to: email,
    subject: "Reset Your Password - NeonSecure",
    html: emailTemplate({
      title: "Reset Your Password",
      preheader: "You requested to reset your password",
      content,
    }),
  });
}

// 3. Password Changed Confirmation
export async function sendPasswordChangedEmail(email: string, ipAddress?: string) {
  const content = `
    <h1>Password Changed Successfully ✅</h1>
    <p>Your password has been changed successfully.</p>
    ${ipAddress ? `Request came from IP: ${ipAddress}` : ''}
    <p>If you made this change, you can safely ignore this email.</p>
    
    <div class="divider"></div>
    
    <p style="font-size: 14px; color: #ff4444;">
      <strong>⚠️ Didn't make this change?</strong>
    </p>
    <p>If you didn't change your password, please contact our support team immediately and secure your account.</p>
    <a href="${process.env.NEXT_PUBLIC_APP_URL}/support" class="button">Contact Support</a>
    
    <div class="divider"></div>
    
    <p style="font-size: 14px; color: #6c757d;">
      This is an automated security notification from NeonSecure.
    </p>
  `;

  return sendEmail({
    to: email,
    subject: "Password Changed - NeonSecure",
    html: emailTemplate({
      title: "Password Changed",
      preheader: "Your password has been changed",
      content,
    }),
  });
}

// 4. Welcome Email (After Verification)
export async function sendWelcomeEmail(email: string, neonId: string) {
  const content = `
    <h1>Welcome to NeonSecure! 🚀</h1>
    <p>Your email has been verified and your account is now active!</p>
    
    <div class="code-box" style="border: 2px solid #667eea;">
      <p style="margin: 0; color: #6c757d; font-size: 14px;">Your Neon ID</p>
      <div class="code" style="font-size: 24px;">${neonId}</div>
    </div>
    
    <p>Here's what you can do next:</p>
    <ul style="line-height: 1.8;">
      <li>Complete your profile</li>
      <li>Explore our features</li>
      <li>Connect with the community</li>
    </ul>
    
    <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="button">Go to Dashboard</a>
    
    <div class="divider"></div>
    
    <p>Need help getting started? Check out our <a href="${process.env.NEXT_PUBLIC_APP_URL}/docs" style="color: #667eea;">documentation</a> or reach out to our support team.</p>
  `;

  return sendEmail({
    to: email,
    subject: "Welcome to NeonSecure! 🎉",
    html: emailTemplate({
      title: "Welcome to NeonSecure",
      preheader: "Your account is ready to go!",
      content,
    }),
  });
}

// 5. Login Alert Email (Optional Security Feature)
export async function sendLoginAlertEmail(
  email: string,
  loginDetails: {
    ip?: string;
    location?: string;
    device?: string;
    time: Date;
  }
) {
  const content = `
    <h1>New Login Detected 🔐</h1>
    <p>We detected a new login to your NeonSecure account.</p>
    
    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 5px 0;"><strong>Time:</strong> ${loginDetails.time.toLocaleString()}</p>
      ${
        loginDetails.ip
          ? `<p style="margin: 5px 0;"><strong>IP Address:</strong> ${loginDetails.ip}</p>`
          : ""
      }
      ${
        loginDetails.location
          ? `<p style="margin: 5px 0;"><strong>Location:</strong> ${loginDetails.location}</p>`
          : ""
      }
      ${
        loginDetails.device
          ? `<p style="margin: 5px 0;"><strong>Device:</strong> ${loginDetails.device}</p>`
          : ""
      }
    </div>
    
    <p>If this was you, you can safely ignore this email.</p>
    
    <div class="divider"></div>
    
    <p style="font-size: 14px; color: #ff4444;">
      <strong>⚠️ Not you?</strong>
    </p>
    <p>If you didn't log in, please secure your account immediately:</p>
    <a href="${
      process.env.NEXT_PUBLIC_APP_URL
    }/auth/change-password" class="button">Change Password</a>
  `;

  return sendEmail({
    to: email,
    subject: "New Login Detected - NeonSecure",
    html: emailTemplate({
      title: "New Login Detected",
      preheader: "We detected a new login to your account",
      content,
    }),
  });
}
