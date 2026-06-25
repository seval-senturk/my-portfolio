import type { EmailProvider, EmailSendResult } from "@/services/email/types";
import type { ContactFormInput } from "@/types/contact";

export class StubEmailProvider implements EmailProvider {
  async sendContactNotification(
    input: ContactFormInput,
    recipientEmail: string,
  ): Promise<EmailSendResult> {
    if (process.env.NODE_ENV === "development") {
      console.info("[StubEmailProvider] Contact notification", {
        recipientEmail,
        subject: input.subject,
        from: input.email,
        name: input.name,
      });
    }

    return {
      success: true,
      messageId: `stub-${Date.now()}`,
    };
  }

  async sendPasswordResetEmail(
    recipientEmail: string,
    resetUrl: string,
  ): Promise<EmailSendResult> {
    if (process.env.NODE_ENV === "development") {
      console.info("[StubEmailProvider] Password reset email", {
        recipientEmail,
        resetUrl,
      });
    }

    return {
      success: true,
      messageId: `stub-reset-${Date.now()}`,
    };
  }
}

export function createEmailProvider(): EmailProvider {
  return new StubEmailProvider();
}
