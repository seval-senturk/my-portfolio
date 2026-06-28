import { env } from "@/lib/env";
import { logger } from "@/services/platform/logger.service";
import type { EmailProvider, EmailSendResult } from "@/services/email/types";
import type { ContactFormInput } from "@/types/contact";

interface ResendEmailPayload {
  from: string;
  to: string[];
  subject: string;
  html: string;
}

async function sendViaResend(payload: ResendEmailPayload): Promise<EmailSendResult> {
  const apiKey = env.email.resendApiKey;

  if (!apiKey) {
    return { success: false, error: "RESEND_API_KEY is not configured." };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const body = (await response.json()) as { id?: string; message?: string };

    if (!response.ok) {
      logger.error("Resend API error", {
        context: "email",
        metadata: { status: response.status, message: body.message },
      });

      return {
        success: false,
        error: body.message ?? "Failed to send email via Resend.",
      };
    }

    return {
      success: true,
      messageId: body.id,
    };
  } catch (error) {
    logger.error("Resend request failed", {
      context: "email",
      error: error instanceof Error ? error : undefined,
    });

    return {
      success: false,
      error: "Failed to reach Resend API.",
    };
  }
}

export class ResendEmailProvider implements EmailProvider {
  readonly name = "resend";

  async sendContactNotification(
    input: ContactFormInput,
    recipientEmail: string,
  ): Promise<EmailSendResult> {
    return sendViaResend({
      from: env.email.fromAddress,
      to: [recipientEmail],
      subject: `[Portfolio Contact] ${input.subject}`,
      html: `
        <p><strong>Name:</strong> ${input.name}</p>
        <p><strong>Email:</strong> ${input.email}</p>
        <p><strong>Subject:</strong> ${input.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${input.message.replace(/\n/g, "<br />")}</p>
      `,
    });
  }

  async sendPasswordResetEmail(
    recipientEmail: string,
    resetUrl: string,
  ): Promise<EmailSendResult> {
    return sendViaResend({
      from: env.email.fromAddress,
      to: [recipientEmail],
      subject: "Reset your admin password",
      html: `
        <p>You requested a password reset.</p>
        <p><a href="${resetUrl}">Reset password</a></p>
        <p>If you did not request this, you can ignore this email.</p>
      `,
    });
  }
}
