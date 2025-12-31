import crypto from "crypto";

// Generate a secure random token (for URLs)
export function generateToken() {
  return crypto.randomBytes(32).toString("hex");
}

// Generate a short verification code (for manual entry)
export function generateVerificationCode(length: 6 | 8 = 6): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  
  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, characters.length);
    code += characters[randomIndex];
  }
  
  return code;
}

// Alternative: Generate numeric-only code
export function generateNumericCode(length: 6 | 8 = 6): string {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return crypto.randomInt(min, max).toString();
}