import { contactContent } from "@/data/contact.data";
import type {
  ContactFormConfig,
  ContactInfoLabels,
  ContactSocialLink,
} from "@/types/contact";

type LegacyFormConfig = {
  title?: string;
  nameLabel?: string;
  emailLabel?: string;
  subjectLabel?: string;
  messageLabel?: string;
  companyLabel?: string;
  projectTypeLabel?: string;
  submitLabel?: string;
  showCompanyField?: boolean;
  showProjectTypeField?: boolean;
  projectTypeOptions?: ContactFormConfig["projectTypeOptions"];
  name?: ContactFormConfig["name"];
  email?: ContactFormConfig["email"];
  phone?: ContactFormConfig["phone"];
  projectType?: ContactFormConfig["projectType"];
  message?: ContactFormConfig["message"];
  securityNote?: ContactFormConfig["securityNote"];
};

export function normalizeContactFormConfig(
  raw: LegacyFormConfig | ContactFormConfig | null | undefined,
): ContactFormConfig {
  if (!raw) {
    return contactContent.form;
  }

  if ("name" in raw && raw.name && "placeholder" in raw.name) {
    return {
      name: raw.name,
      email: raw.email ?? contactContent.form.email,
      phone: raw.phone ?? contactContent.form.phone,
      projectType: raw.projectType ?? contactContent.form.projectType,
      message: raw.message ?? contactContent.form.message,
      submitLabel: raw.submitLabel ?? contactContent.form.submitLabel,
      projectTypeOptions:
        raw.projectTypeOptions?.length
          ? raw.projectTypeOptions
          : contactContent.form.projectTypeOptions,
      securityNote: raw.securityNote ?? contactContent.form.securityNote,
    };
  }

  const legacy = raw as LegacyFormConfig;

  return {
    name: {
      enabled: true,
      label: legacy.nameLabel ?? contactContent.form.name.label,
      placeholder: legacy.nameLabel ?? contactContent.form.name.placeholder,
      required: true,
    },
    email: {
      enabled: true,
      label: legacy.emailLabel ?? contactContent.form.email.label,
      placeholder: legacy.emailLabel ?? contactContent.form.email.placeholder,
      required: true,
    },
    phone: contactContent.form.phone,
    projectType: {
      enabled: legacy.showProjectTypeField ?? true,
      label: legacy.projectTypeLabel ?? contactContent.form.projectType.label,
      placeholder: legacy.projectTypeLabel ?? contactContent.form.projectType.placeholder,
      required: false,
    },
    message: {
      enabled: true,
      label: legacy.messageLabel ?? contactContent.form.message.label,
      placeholder: legacy.messageLabel ?? contactContent.form.message.placeholder,
      required: true,
    },
    submitLabel: legacy.submitLabel ?? contactContent.form.submitLabel,
    projectTypeOptions:
      legacy.projectTypeOptions?.length
        ? legacy.projectTypeOptions
        : contactContent.form.projectTypeOptions,
    securityNote: contactContent.form.securityNote,
  };
}

export function normalizeContactInfoLabels(
  raw: ContactInfoLabels | null | undefined,
): ContactInfoLabels {
  return raw ?? contactContent.infoLabels;
}

export function normalizeContactSocialLinks(
  raw: readonly ContactSocialLink[] | null | undefined,
  fallback: readonly ContactSocialLink[],
): readonly ContactSocialLink[] {
  if (!raw || raw.length === 0) {
    return fallback;
  }

  return [...raw]
    .filter((link) => link.visible)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}
