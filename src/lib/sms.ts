// lib/sms.ts

// ========== TERMII SETUP (Recommended for Nigeria) ==========
// 1. Sign up at https://termii.com
// 2. Get API Key and BASE_URL from dashboard
// 3. Add to .env:
//    TERMII_API_KEY=your_api_key
//    TERMII_BASE_URL=your_base_url (e.g., https://api.ng.termii.com)
//    TERMII_SENDER_ID=YourApp (max 11 chars, alphanumeric)

export type SmsProvider = "termii" | "mock";

export interface SendSmsResult {
  success: boolean;
  messageId?: string;
  pinId?: string;
  error?: string;
}

export interface VerifyOtpResult {
  success: boolean;
  verified: boolean;
  error?: string;
}

// ========== MOCK SMS (for development) ==========
async function sendSmsMock(
  to: string,
  message: string
): Promise<SendSmsResult> {
  console.log("📱 [MOCK SMS]");
  console.log(`To: ${to}`);
  console.log(`Message: ${message}`);
  console.log("─────────────────────────────");

  return {
    success: true,
    messageId: `mock_${Date.now()}`,
  };
}

// ========== TERMII - SEND OTP (Termii generates the PIN) ==========
async function sendOtpTermii(
  to: string,
  pinLength: number = 6,
  messageTemplate?: string
): Promise<SendSmsResult> {
  const apiKey = process.env.TERMII_API_KEY;
  const baseUrl = process.env.TERMII_BASE_URL;
  const senderId = process.env.TERMII_SENDER_ID || "YourApp";

  if (!apiKey || !baseUrl) {
    throw new Error("Termii API key or BASE_URL not configured");
  }

  const cleanBaseUrl = baseUrl.replace(/\/$/, "");

  // Create PIN placeholder based on length
  const placeholder = "< " + "1".repeat(pinLength) + " >";
  const defaultMessage = `Your verification code is ${placeholder}. Valid for 10 minutes. Do not share this code.`;

  try {
    const response = await fetch(`${cleanBaseUrl}/api/sms/otp/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_key: apiKey,
        pin_type: "NUMERIC",
        to: to,
        from: senderId,
        channel: "generic",
        pin_attempts: 3,
        pin_time_to_live: 10, // 10 minutes
        pin_length: pinLength,
        pin_placeholder: placeholder,
        message_text: messageTemplate || defaultMessage,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || `HTTP ${response.status}: Failed to send OTP`,
      };
    }

    const data = await response.json();

    if (data.status !== "200" && data.code !== "ok") {
      return {
        success: false,
        error: data.message || data.smsStatus || "Failed to send OTP",
      };
    }

    return {
      success: true,
      messageId: data.message_id_str || data.message_id,
      pinId: data.pin_id || data.pinId, // IMPORTANT: Store this to verify later
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "SMS service error";
    return {
      success: false,
      error: errorMessage,
    };
  }
}

// ========== TERMII - VERIFY OTP ==========
async function verifyOtpTermii(
  pinId: string,
  pin: string
): Promise<VerifyOtpResult> {
  const apiKey = process.env.TERMII_API_KEY;
  const baseUrl = process.env.TERMII_BASE_URL;

  if (!apiKey || !baseUrl) {
    throw new Error("Termii API key or BASE_URL not configured");
  }

  const cleanBaseUrl = baseUrl.replace(/\/$/, "");

  try {
    const response = await fetch(`${cleanBaseUrl}/api/sms/otp/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_key: apiKey,
        pin_id: pinId,
        pin: pin,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        verified: false,
        error: error.message || `HTTP ${response.status}: Failed to verify OTP`,
      };
    }

    const data = await response.json();

    // Termii returns verified: true/false
    return {
      success: true,
      verified: data.verified === true || data.verified === "True",
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "OTP verification error";
    return {
      success: false,
      verified: false,
      error: errorMessage,
    };
  }
}

// ========== TERMII - SEND REGULAR SMS (for non-OTP messages) ==========
async function sendSmsTermii(
  to: string,
  message: string
): Promise<SendSmsResult> {
  const apiKey = process.env.TERMII_API_KEY;
  const baseUrl = process.env.TERMII_BASE_URL;
  const senderId = process.env.TERMII_SENDER_ID || "YourApp";

  if (!apiKey || !baseUrl) {
    throw new Error("Termii API key or BASE_URL not configured");
  }

  const cleanBaseUrl = baseUrl.replace(/\/$/, "");

  try {
    const response = await fetch(`${cleanBaseUrl}/api/sms/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_key: apiKey,
        to: to,
        from: senderId,
        sms: message,
        type: "plain",
        channel: "generic",
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || `HTTP ${response.status}: Failed to send SMS`,
      };
    }

    const data = await response.json();

    if (data.code !== "ok" && data.status !== "200") {
      return {
        success: false,
        error: data.message || "Failed to send SMS",
      };
    }

    return {
      success: true,
      messageId: data.message_id_str || data.message_id,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "SMS service error";
    return {
      success: false,
      error: errorMessage,
    };
  }
}

// ========== MAIN SEND SMS FUNCTION (for regular messages) ==========
export async function sendSms(
  to: string,
  message: string
): Promise<SendSmsResult> {
  const provider = (process.env.SMS_PROVIDER || "mock") as SmsProvider;

  switch (provider) {
    case "termii":
      return sendSmsTermii(to, message);
    case "mock":
      return sendSmsMock(to, message);
    default:
      throw new Error(`Unknown SMS provider: ${provider}`);
  }
}

// ========== SEND OTP FUNCTION (Termii generates PIN automatically) ==========
export async function sendOtp(
  to: string,
  pinLength: number = 6,
  messageTemplate?: string
): Promise<SendSmsResult> {
  const provider = (process.env.SMS_PROVIDER || "mock") as SmsProvider;

  switch (provider) {
    case "termii":
      return sendOtpTermii(to, pinLength, messageTemplate);
    case "mock":
      // For mock, generate a fake PIN for testing
      const mockPin = generateSMSVerificationCode(pinLength);
      const mockMessage = messageTemplate
        ? messageTemplate.replace(/< \d+ >/, mockPin)
        : `Your verification code is ${mockPin}`;
      console.log(`🔑 [MOCK OTP]: ${mockPin}`);
      return sendSmsMock(to, mockMessage);
    default:
      throw new Error(`Unknown SMS provider: ${provider}`);
  }
}

// ========== VERIFY OTP FUNCTION ==========
export async function verifyOtp(
  pinId: string,
  pin: string
): Promise<VerifyOtpResult> {
  const provider = (process.env.SMS_PROVIDER || "mock") as SmsProvider;

  switch (provider) {
    case "termii":
      return verifyOtpTermii(pinId, pin);
    case "mock":
      // For mock, always return true for testing
      console.log(`✅ [MOCK VERIFY]: PIN ${pin} for ID ${pinId}`);
      return {
        success: true,
        verified: true,
      };
    default:
      throw new Error(`Unknown SMS provider: ${provider}`);
  }
}

// ========== VERIFICATION CODE GENERATOR (for custom implementations) ==========
export function generateSMSVerificationCode(length: number = 6): string {
  return Math.floor(Math.random() * Math.pow(10, length))
    .toString()
    .padStart(length, "0");
}

// ========== SMS TEMPLATES ==========
export const smsTemplates = {
  // Use < 123456 > as placeholder - Termii will replace it
  phoneVerification: (appName: string = "YourApp", pinLength: number = 6) => {
    const placeholder = "< " + "1".repeat(pinLength) + " >";
    return `Your ${appName} verification code is ${placeholder}. Valid for 10 minutes. Do not share this code.`;
  },

  passwordReset: (appName: string = "YourApp", pinLength: number = 6) => {
    const placeholder = "< " + "1".repeat(pinLength) + " >";
    return `Your ${appName} password reset code is ${placeholder}. Valid for 10 minutes. If you didn't request this, ignore this message.`;
  },

  // For regular SMS (non-OTP)
  loginAlert: (appName: string = "YourApp") =>
    `New login to your ${appName} account. If this wasn't you, secure your account immediately.`,
};
