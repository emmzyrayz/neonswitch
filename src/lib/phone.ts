// lib/phone.ts
import { COUNTRY_CODES, getCallingCode } from "./countries";

export interface PhoneParseResult {
  valid: boolean;
  formatted?: string; // E.164
  nationalFormat?: string;
  error?: string;
}

export interface CountryCallingCode {
  [key: string]: string;
}

export const COUNTRY_PHONE_PATTERNS: Record<
  string,
  {
    minLength: number;
    maxLength: number;
    format?: (num: string) => string;
  }
> = {
  NG: {
    minLength: 10,
    maxLength: 10,
    format: (num) => `${num.slice(0, 4)} ${num.slice(4, 7)} ${num.slice(7)}`,
  },
  GH: {
    minLength: 9,
    maxLength: 9,
    format: (num) => `${num.slice(0, 3)} ${num.slice(3, 6)} ${num.slice(6)}`,
  },
  US: {
    minLength: 10,
    maxLength: 10,
    format: (num) => `(${num.slice(0, 3)}) ${num.slice(3, 6)}-${num.slice(6)}`,
  },
  GB: {
    minLength: 10,
    maxLength: 10,
    format: (num) => `${num.slice(0, 4)} ${num.slice(4, 6)} ${num.slice(6)}`,
  },
  CA: {
    minLength: 10,
    maxLength: 10,
    format: (num) => `(${num.slice(0, 3)}) ${num.slice(3, 6)}-${num.slice(6)}`,
  },
  AU: {
    minLength: 9,
    maxLength: 9,
    format: (num) => `${num.slice(0, 4)} ${num.slice(4)}`,
  },
  // Add more country-specific patterns as needed
};

/**
 * Get country calling code from country code
 * @param countryCode - ISO 3166-1 alpha-2 country code (e.g., "NG", "US", "GB")
 * @returns Calling code without + (e.g., "234", "1", "44")
 */
export function getCountryCallingCode(countryCode: string): string | null {
  return getCallingCode(countryCode);
}

export function getPhoneExample(countryCode: string): string {
  const callingCode = getCountryCallingCode(countryCode);
  const patterns = COUNTRY_PHONE_PATTERNS[countryCode];

  if (!callingCode) return "+...";

  if (patterns?.format) {
    const exampleDigits = "1234567890".slice(0, patterns.minLength);
    return `${patterns.format(exampleDigits)}`;
  }

  return "...";
}

export function parsePhoneNumber(
  raw: string,
  countryCode?: string
): PhoneParseResult {
  if (!raw) {
    return { valid: false, error: "Phone number is required" };
  }

  // Remove spaces, dashes, parentheses, dots
  let cleaned = raw.replace(/[^\d+]/g, "");

  // If already E.164 format (starts with +)
  if (cleaned.startsWith("+")) {
    // Validate length (E.164 allows 1-15 digits after +)
    if (cleaned.length < 8 || cleaned.length > 16) {
      return { valid: false, error: "Invalid phone number length" };
    }
    return { valid: true, formatted: cleaned };
  }

  // If no country code provided, can't format local numbers
  if (!countryCode) {
    return {
      valid: false,
      error: "Country code is required to format local phone numbers",
    };
  }

  // Get the calling code for the country
  const callingCode = getCountryCallingCode(countryCode);
  if (!callingCode) {
    return {
      valid: false,
      error: `Unsupported country code: ${countryCode}`,
    };
  }

  // Handle local numbers starting with 0 (common in many countries)
  if (cleaned.startsWith("0")) {
    cleaned = cleaned.slice(1);
  }

  // Get country-specific validation
  const countryPattern = COUNTRY_PHONE_PATTERNS[countryCode];

  // Validate length
  if (countryPattern) {
    if (
      cleaned.length < countryPattern.minLength ||
      cleaned.length > countryPattern.maxLength
    ) {
      return {
        valid: false,
        error: `Phone number must be ${countryPattern.minLength} digits for ${countryCode}`,
      };
    }
  } else {
    // Default validation
    if (cleaned.length < 6 || cleaned.length > 13) {
      return {
        valid: false,
        error: "Phone number must be between 6 and 13 digits",
      };
    }
  }

  // Build E.164 format
  const formatted = `+${callingCode}${cleaned}`;

  // Validate final length
  if (formatted.length < 8 || formatted.length > 16) {
    return { valid: false, error: "Invalid phone number length" };
  }

  // Create national format for display
  let nationalFormat = cleaned;

  if (countryPattern?.format) {
    nationalFormat = countryPattern.format(cleaned);
  }

  return {
    valid: true,
    formatted,
    nationalFormat,
  };
}

/**
 * Format E.164 phone number for display
 * @example
 * formatPhoneForDisplay("+2348012345678") // "+234 801 234 5678"
 */
export function formatPhoneForDisplay(e164: string): string {
  if (!e164 || !e164.startsWith("+")) {
    return e164;
  }

  // Simple formatting: +XXX XXX XXX XXXX
  const digits = e164.slice(1);
  if (digits.length <= 3) return e164;

  const countryCode = digits.slice(0, 3);
  const rest = digits.slice(3);

  // Break rest into groups of 3
  const groups = rest.match(/.{1,3}/g) || [];

  return `+${countryCode} ${groups.join(" ")}`;
}

/**
 * Mask phone number for security/display
 * @example
 * maskPhone("+2348012345678") // "+234****5678"
 */
export function maskPhone(e164: string): string {
  if (!e164 || e164.length < 8) return e164;

  const start = e164.slice(0, 4);
  const end = e164.slice(-4);
  const masked = "*".repeat(Math.max(e164.length - 8, 0));

  return `${start}${masked}${end}`;
}

export function formatPhoneAsYouType(
  value: string,
  countryCode: string
): { display: string; raw: string } {
  if (!value) return { display: "", raw: "" };

  const callingCode = getCountryCallingCode(countryCode);
  if (!callingCode) return { display: value, raw: value };

  // Remove all non-digits
  let digits = value.replace(/\D/g, "");

  // Remove leading 0 if present
  if (digits.startsWith("0")) {
    digits = digits.slice(1);
  }

  // Get country pattern
  const pattern = COUNTRY_PHONE_PATTERNS[countryCode];

  let display = digits;
  if (pattern?.format && digits.length >= pattern.minLength) {
    // Apply formatting based on pattern
    try {
      display = pattern.format(digits);
    } catch {
      // If formatting fails, just show digits
    }
  }

  return {
    display,
    raw: digits,
  };
}

/**
 * Extract country code from E.164 number
 */
export function extractCountryCode(e164: string): string | null {
  if (!e164.startsWith("+")) return null;

  for (const [code, callingCode] of Object.entries(COUNTRY_CODES)) {
    if (e164.startsWith(`+${callingCode}`)) {
      return code;
    }
  }

  return null;
}