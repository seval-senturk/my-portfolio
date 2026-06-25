export type { EmailProvider, EmailSendResult } from "@/services/email/types";
export { createEmailProvider, resolveEmailProviderName } from "@/services/email/email-registry";
export { StubEmailProvider } from "@/services/email/stub-email.provider";
