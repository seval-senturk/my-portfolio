const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}

export function validateRequired(value: string, fieldName: string): string | undefined {
  if (!value.trim()) {
    return `${fieldName} is required.`;
  }

  return undefined;
}

export function validateEmail(value: string): string | undefined {
  const required = validateRequired(value, "Email");

  if (required) {
    return required;
  }

  if (!isValidEmail(value)) {
    return "Please enter a valid email address.";
  }

  return undefined;
}

export function validatePassword(value: string): string | undefined {
  if (!value) {
    return "Password is required.";
  }

  if (value.length < 6) {
    return "Password must be at least 6 characters.";
  }

  return undefined;
}

export function getString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export function getOptionalString(formData: FormData, key: string): string | undefined {
  const value = getString(formData, key);
  return value || undefined;
}

export function getBoolean(formData: FormData, key: string): boolean {
  return formData.get(key) === "on" || formData.get(key) === "true";
}
