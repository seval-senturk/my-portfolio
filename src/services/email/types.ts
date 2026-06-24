import type { ContactFormInput } from "@/types/contact";

export interface EmailSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface EmailProvider {
  sendContactNotification(
    input: ContactFormInput,
    recipientEmail: string,
  ): Promise<EmailSendResult>;
}
