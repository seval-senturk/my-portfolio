import type { EmailProvider } from "@/services/email/types";
import { StubEmailProvider } from "@/services/email/stub-email.provider";

export type EmailProviderName = "stub" | "resend" | "smtp" | "sendgrid";

class ResendEmailProviderStub extends StubEmailProvider {
  readonly name = "resend";
}

class SmtpEmailProviderStub extends StubEmailProvider {
  readonly name = "smtp";
}

class SendGridEmailProviderStub extends StubEmailProvider {
  readonly name = "sendgrid";
}

const providers: Record<EmailProviderName, () => EmailProvider> = {
  stub: () => new StubEmailProvider(),
  resend: () => new ResendEmailProviderStub(),
  smtp: () => new SmtpEmailProviderStub(),
  sendgrid: () => new SendGridEmailProviderStub(),
};

export function resolveEmailProviderName(): EmailProviderName {
  const configured = process.env.EMAIL_PROVIDER?.trim().toLowerCase();

  if (configured === "resend" || configured === "smtp" || configured === "sendgrid") {
    return configured;
  }

  return "stub";
}

export function createEmailProvider(): EmailProvider {
  const name = resolveEmailProviderName();
  return providers[name]();
}
