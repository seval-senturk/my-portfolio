export type { EmailProvider, EmailSendResult } from "@/services/email/types";
export { createEmailProvider, resolveEmailProviderName } from "@/services/email/email-registry";
export { ResendEmailProvider } from "@/services/email/resend-email.provider";
export { StubEmailProvider } from "@/services/email/stub-email.provider";
