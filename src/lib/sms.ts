// lib/sms.ts

// ========== TWILIO SETUP ==========
// 1. Sign up at https://www.twilio.com/try-twilio
// 2. Get Account SID, Auth Token, and Phone Number
// 3. Add to .env:
//    TWILIO_ACCOUNT_SID=your_account_sid
//    TWILIO_AUTH_TOKEN=your_auth_token
//    TWILIO_PHONE_NUMBER=your_twilio_number

// ========== TERMII SETUP (Recommended for Nigeria) ==========
// 1. Sign up at https://termii.com
// 2. Get API Key from dashboard
// 3. Add to .env:
//    TERMII_API_KEY=your_api_key
//    TERMII_SENDER_ID=YourApp (max 11 chars)

export type SmsProvider = "twilio" | "termii" | "mock";

export interface SendSmsResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

// ========== MOCK SMS (for development) ==========
async function sendSmsMock(to: string, message: string): Promise<SendSmsResult> {
  console.log("📱 [MOCK SMS]");
  console.log(`To: ${to}`);
  console.log(`Message: ${message}`);
  console.log("─────────────────────────────");
  
  return {
    success: true,
    messageId: `mock_${Date.now()}`,
  };
}

// ========== TWILIO ==========
async function sendSmsTwilio(to: string, message: string): Promise<SendSmsResult> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || !authToken || !fromNumber) {
    throw new Error("Twilio credentials not configured");
  }

  try {
    const auth = Buffer.from(`${accountSid}:${authToken}`).toString("base64");
    
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          To: to,
          From: fromNumber,
          Body: message,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || "Failed to send SMS",
      };
    }

    const data = await response.json();
    return {
      success: true,
      messageId: data.sid,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "SMS service error";
    return {
      success: false,
      error: errorMessage,
    };
  }
}

// ========== TERMII (Best for Nigeria) ==========
async function sendSmsTermii(to: string, message: string): Promise<SendSmsResult> {
  const apiKey = process.env.TERMII_API_KEY;
  const senderId = process.env.TERMII_SENDER_ID || "YourApp";

  if (!apiKey) {
    throw new Error("Termii API key not configured");
  }

  try {
    const response = await fetch("https://api.ng.termii.com/api/sms/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to,
        from: senderId,
        sms: message,
        type: "plain",
        channel: "generic",
        api_key: apiKey,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || "Failed to send SMS",
      };
    }

    const data = await response.json();
    return {
      success: true,
      messageId: data.message_id,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "SMS service error";
    return {
      success: false,
      error: errorMessage,
    };
  }
}

// ========== MAIN SEND FUNCTION ==========
export async function sendSms(
  to: string,
  message: string
): Promise<SendSmsResult> {
  const provider = (process.env.SMS_PROVIDER || "mock") as SmsProvider;

  switch (provider) {
    case "twilio":
      return sendSmsTwilio(to, message);
    case "termii":
      return sendSmsTermii(to, message);
    case "mock":
      return sendSmsMock(to, message);
    default:
      throw new Error(`Unknown SMS provider: ${provider}`);
  }
}

// ========== VERIFICATION CODE GENERATOR ==========
export function generateSMSVerificationCode(length: number = 6): string {
  return Math.floor(Math.random() * Math.pow(10, length))
    .toString()
    .padStart(length, "0");
}

// ========== SMS TEMPLATES ==========
export const smsTemplates = {
  phoneVerification: (code: string, appName: string = "YourApp") =>
    `${appName} verification code: ${code}. Valid for 10 minutes. Do not share this code.`,

  phoneVerificationReminder: (code: string, appName: string = "YourApp") =>
    `Your ${appName} verification code is: ${code}. This is a reminder.`,

  passwordReset: (code: string, appName: string = "YourApp") =>
    `${appName} password reset code: ${code}. Valid for 10 minutes. If you didn't request this, ignore this message.`,

  loginAlert: (appName: string = "YourApp") =>
    `New login to your ${appName} account. If this wasn't you, secure your account immediately.`,
};