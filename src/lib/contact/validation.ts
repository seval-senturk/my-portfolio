import { CONTACT_FIELD_LIMITS } from "@/lib/contact/constants";
import type {
  ContactFormInput,
  ContactFormValidationError,
  ContactFormValidationResult,
} from "@/types/contact";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function trimValue(value: string | undefined): string {
  return value?.trim() ?? "";
}

function validateEmail(value: string): string | undefined {
  if (!value) {
    return "Email is required.";
  }

  if (value.length > CONTACT_FIELD_LIMITS.email.max) {
    return `Email must be at most ${CONTACT_FIELD_LIMITS.email.max} characters.`;
  }

  if (!EMAIL_PATTERN.test(value)) {
    return "Please enter a valid email address.";
  }

  return undefined;
}

function validateLength(
  value: string,
  field: keyof typeof CONTACT_FIELD_LIMITS,
  label: string,
): string | undefined {
  const limits = CONTACT_FIELD_LIMITS[field];

  if ("min" in limits && value.length < limits.min) {
    return `${label} must be at least ${limits.min} characters.`;
  }

  if (value.length > limits.max) {
    return `${label} must be at most ${limits.max} characters.`;
  }

  return undefined;
}

export function validateContactForm(
  input: ContactFormInput,
): ContactFormValidationResult {
  const errors: ContactFormValidationError[] = [];

  const name = trimValue(input.name);
  const email = trimValue(input.email);
  const subject = trimValue(input.subject);
  const message = trimValue(input.message);
  const company = trimValue(input.company);
  const projectType = trimValue(input.projectType);

  const nameError = validateLength(name, "name", "Name");
  if (nameError) {
    errors.push({ field: "name", message: nameError });
  }

  const emailError = validateEmail(email);
  if (emailError) {
    errors.push({ field: "email", message: emailError });
  }

  const subjectError = validateLength(subject, "subject", "Subject");
  if (subjectError) {
    errors.push({ field: "subject", message: subjectError });
  }

  const messageError = validateLength(message, "message", "Message");
  if (messageError) {
    errors.push({ field: "message", message: messageError });
  }

  if (company) {
    const companyError = validateLength(company, "company", "Company");
    if (companyError) {
      errors.push({ field: "company", message: companyError });
    }
  }

  if (errors.length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    errors: [],
    data: {
      name,
      email,
      subject,
      message,
      ...(company ? { company } : {}),
      ...(projectType ? { projectType } : {}),
    },
  };
}

export function isSpamSubmission(input: ContactFormInput): boolean {
  return trimValue(input.website).length > 0;
}

export function getFieldErrorMessage(
  errors: ContactFormValidationError[],
  field: ContactFormValidationError["field"],
): string | undefined {
  return errors.find((error) => error.field === field)?.message;
}
