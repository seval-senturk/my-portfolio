import type { SocialPlatform } from "@/config/social-links.config";
import type { HomeCmsSection } from "@/types/section-header";

export type AvailabilityStatus =
  | "Available for Opportunities"
  | "Open for Freelance Projects"
  | "Not Currently Available";

export type ContactFormField =
  | "name"
  | "email"
  | "phone"
  | "subject"
  | "message"
  | "company"
  | "projectType";

export type LeadStatus = "new" | "read" | "replied" | "archived";

export interface ContactSocialLink {
  id: string;
  platform: SocialPlatform;
  label: string;
  href: string;
  visible: boolean;
  sortOrder: number;
}

export interface ContactProjectTypeOption {
  id: string;
  label: string;
}

export interface ContactFormFieldSettings {
  enabled: boolean;
  label: string;
  placeholder: string;
  required: boolean;
}

export interface ContactInfoFieldSettings {
  label: string;
  visible: boolean;
}

export interface ContactFormConfig {
  name: ContactFormFieldSettings;
  email: ContactFormFieldSettings;
  phone: ContactFormFieldSettings;
  projectType: ContactFormFieldSettings;
  message: ContactFormFieldSettings;
  submitLabel: string;
  projectTypeOptions: readonly ContactProjectTypeOption[];
  securityNote: {
    text: string;
    visible: boolean;
  };
}

export interface ContactFormMessages {
  successTitle: string;
  successMessage: string;
  errorTitle: string;
  errorMessage: string;
  loadingLabel: string;
}

export interface ContactInformation {
  email: string;
  phone?: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
}

export interface ContactInfoLabels {
  email: ContactInfoFieldSettings;
  phone: ContactInfoFieldSettings;
  location: ContactInfoFieldSettings;
}

export interface ContactSectionConfig extends HomeCmsSection {
  description: string;
}

export interface ContactContent {
  section: ContactSectionConfig;
  information: ContactInformation;
  infoLabels: ContactInfoLabels;
  availabilityStatus: AvailabilityStatus;
  responseTime: string;
  calendarUrl?: string;
  socialLinks: readonly ContactSocialLink[];
  resumeHref: string;
  resumeLabel: string;
  form: ContactFormConfig;
  messages: ContactFormMessages;
}

export interface ContactFormInput {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  company?: string;
  projectType?: string;
  website?: string;
}

export interface ContactFormValidationError {
  field: ContactFormField;
  message: string;
}

export interface ContactFormValidationResult {
  success: boolean;
  errors: ContactFormValidationError[];
  data?: ContactFormInput;
}

export interface ContactLeadRecord {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
  company?: string;
  projectType?: string;
  status: LeadStatus;
  createdAt: string;
}

export interface ContactSubmissionResult {
  success: boolean;
  leadId?: string;
  error?: string;
}

export interface ContactConfigInput {
  sectionVisible: boolean;
  sectionLabel: string;
  sectionTitle: string;
  sectionTitleAccent: string;
  sectionDescription: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
  availabilityStatus: string;
  responseTime: string;
  calendarUrl: string;
  resumeHref: string;
  resumeLabel: string;
  formConfig: ContactFormConfig;
  messagesConfig: ContactFormMessages;
  infoLabels: ContactInfoLabels;
  socialLinks: ContactSocialLink[];
}
