import { NextResponse } from "next/server";

import { handleApiError, throwPlatformError } from "@/lib/platform/error-handler";
import { checkRateLimit, getClientIp } from "@/lib/platform/rate-limit";
import { contactContentService } from "@/content";
import { submitContactForm } from "@/services/contact.service";
import { isFeatureEnabled } from "@/services/platform/settings.service";
import type { ContactFormInput } from "@/types/contact";

export async function POST(request: Request) {
  try {
    const contactEnabled = await isFeatureEnabled("contactForm");

    if (!contactEnabled) {
      throwPlatformError("FORBIDDEN", "The contact form is currently unavailable.");
    }

    const ip = getClientIp(request);
    const rateLimit = checkRateLimit({
      key: `contact:${ip}`,
      limit: 5,
      windowMs: 15 * 60 * 1000,
    });

    if (!rateLimit.allowed) {
      throwPlatformError("RATE_LIMIT", "Too many contact submissions. Please try again later.");
    }

    let body: ContactFormInput;

    try {
      body = (await request.json()) as ContactFormInput;
    } catch {
      throwPlatformError("VALIDATION", "Invalid request body.");
    }

    const contact = await contactContentService.get();

    const result = await submitContactForm(body, {
      recipientEmail: contact.information.email,
    });

    if (!result.success) {
      throwPlatformError("VALIDATION", result.error ?? "Unable to submit contact form.");
    }

    return NextResponse.json({
      success: true,
      leadId: result.leadId,
    });
  } catch (error) {
    return handleApiError(error, "contact");
  }
}
