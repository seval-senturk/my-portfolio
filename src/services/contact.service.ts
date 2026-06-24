import { isSpamSubmission, validateContactForm } from "@/lib/contact/validation";
import { createEmailProvider } from "@/services/email";
import { createLeadRepository } from "@/services/lead";
import type {
  ContactFormInput,
  ContactSubmissionResult,
} from "@/types/contact";

interface SubmitContactFormOptions {
  recipientEmail: string;
}

export async function submitContactForm(
  input: ContactFormInput,
  { recipientEmail }: SubmitContactFormOptions,
): Promise<ContactSubmissionResult> {
  if (isSpamSubmission(input)) {
    return { success: true, leadId: "spam-filtered" };
  }

  const validation = validateContactForm(input);

  if (!validation.success || !validation.data) {
    return {
      success: false,
      error: validation.errors[0]?.message ?? "Invalid form submission.",
    };
  }

  const leadRepository = createLeadRepository();
  const emailProvider = createEmailProvider();

  try {
    const lead = await leadRepository.save(validation.data);
    const emailResult = await emailProvider.sendContactNotification(
      validation.data,
      recipientEmail,
    );

    if (!emailResult.success) {
      return {
        success: false,
        error: emailResult.error ?? "Failed to send notification.",
      };
    }

    return {
      success: true,
      leadId: lead.id,
    };
  } catch {
    return {
      success: false,
      error: "An unexpected error occurred. Please try again later.",
    };
  }
}
