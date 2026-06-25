import type { EmailProvider, EmailSendResult } from "@/services/email/types";
import type { ContactFormInput } from "@/types/contact";
import { logger } from "@/services/platform/logger.service";

export class StubEmailProvider implements EmailProvider {
  async sendContactNotification(
    input: ContactFormInput,
    recipientEmail: string,
  ): Promise<EmailSendResult> {
    logger.info("Contact notification (stub email)", {
      context: "email",
      metadata: {
        recipientEmail,
        subject: input.subject,
        from: input.email,
        name: input.name,
      },
    });

    return {
      success: true,
      messageId: `stub-${Date.now()}`,
    };
  }

  async sendPasswordResetEmail(
    recipientEmail: string,
    resetUrl: string,
  ): Promise<EmailSendResult> {
    logger.info("Password reset email (stub email)", {
      context: "email",
      metadata: { recipientEmail, resetUrl },
    });

    return {
      success: true,
      messageId: `stub-reset-${Date.now()}`,
    };
  }
}
