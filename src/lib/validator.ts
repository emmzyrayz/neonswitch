export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPassword(password: string): { valid: boolean; error?: string } {

  if (password.length > 128) {
    return { valid: false, error: "Password is too long (max 128 characters)" };
  }

  if (password.length < 8) {
    return { valid: false, error: "Password must be at least 8 characters" };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: "Password must contain at least one uppercase letter" };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, error: "Password must contain at least one lowercase letter" };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, error: "Password must contain at least one number" };
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return { valid: false, error: "Password must contain at least one special character" };
  }

  return { valid: true };
}

export function sanitizeEmail(email: string): string {
  return email?.toLowerCase().trim();
}

export function isValidName(name: string): { valid: boolean; error?: string } {
  if (!name || name.trim().length < 2) {
    return { valid: false, error: "Name must be at least 2 characters" };
  }
  
  if (name.length > 50) {
    return { valid: false, error: "Name is too long (max 50 characters)" };
  }
  
  // Allow letters, spaces, hyphens, apostrophes
  if (!/^[a-zA-Z\s'-]+$/.test(name)) {
    return { valid: false, error: "Name contains invalid characters" };
  }
  
  return { valid: true };
}

export function sanitizeInput(input: string): string {
  return input?.trim();
}