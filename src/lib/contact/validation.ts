import { CONTACT_FIELD_LIMITS } from "@/lib/contact/constants";
import type {
  ContactFormConfig,
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
  required = true,
): string | undefined {
  if (!value && !required) {
    return undefined;
  }

  const limits = CONTACT_FIELD_LIMITS[field];

  if ("min" in limits && value.length < limits.min) {
    return `${label} must be at least ${limits.min} characters.`;
  }

  if (value.length > limits.max) {
    return `${label} must be at most ${limits.max} characters.`;
  }

  return undefined;
}

export function buildContactSubject(
  projectType: string,
  fallback = "Website inquiry",
): string {
  return projectType.length > 0 ? projectType : fallback;
}

export function validateContactForm(
  input: ContactFormInput,
  config?: ContactFormConfig,
): ContactFormValidationResult {
  const errors: ContactFormValidationError[] = [];
  const form = config;

  const name = trimValue(input.name);
  const email = trimValue(input.email);
  const phone = trimValue(input.phone);
  const subject = trimValue(input.subject);
  const message = trimValue(input.message);
  const company = trimValue(input.company);
  const projectType = trimValue(input.projectType);

  if (!form || form.name.enabled) {
    const nameError = validateLength(
      name,
      "name",
      form?.name.label ?? "Name",
      form?.name.required ?? true,
    );
    if (nameError) {
      errors.push({ field: "name", message: nameError });
    }
  }

  if (!form || form.email.enabled) {
    const emailError = validateEmail(email);
    if (emailError) {
      errors.push({ field: "email", message: emailError });
    }
  }

  if (!form || form.phone.enabled) {
    const phoneError = validateLength(
      phone,
      "phone",
      form?.phone.label ?? "Phone",
      form?.phone.required ?? false,
    );
    if (phoneError) {
      errors.push({ field: "phone", message: phoneError });
    }
  }

  const resolvedSubject = subject || buildContactSubject(projectType);
  const subjectError = validateLength(resolvedSubject, "subject", "Subject");
  if (subjectError) {
    errors.push({ field: "subject", message: subjectError });
  }

  if (!form || form.message.enabled) {
    const messageError = validateLength(
      message,
      "message",
      form?.message.label ?? "Message",
      form?.message.required ?? true,
    );
    if (messageError) {
      errors.push({ field: "message", message: messageError });
    }
  }

  if (company) {
    const companyError = validateLength(company, "company", "Company", false);
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
      subject: resolvedSubject,
      message,
      ...(phone ? { phone } : {}),
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
