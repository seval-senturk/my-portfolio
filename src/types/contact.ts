import type { SocialPlatform } from "@/config/social-links.config";

export type AvailabilityStatus =
  | "Available for Opportunities"
  | "Open for Freelance Projects"
  | "Not Currently Available";

export type ContactFormField =
  | "name"
  | "email"
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
}

export interface ContactProjectTypeOption {
  id: string;
  label: string;
}

export interface ContactInformation {
  email: string;
  phone?: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
}

export interface ContactFormConfig {
  title: string;
  nameLabel: string;
  emailLabel: string;
  subjectLabel: string;
  messageLabel: string;
  companyLabel: string;
  projectTypeLabel: string;
  submitLabel: string;
  showCompanyField: boolean;
  showProjectTypeField: boolean;
  projectTypeOptions: readonly ContactProjectTypeOption[];
}

export interface ContactFormMessages {
  successTitle: string;
  successMessage: string;
  errorTitle: string;
  errorMessage: string;
  loadingLabel: string;
}

export interface ContactSectionHeader {
  title: string;
  description: string;
}

export interface ContactContent {
  section: ContactSectionHeader;
  information: ContactInformation;
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
