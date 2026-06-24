import { NextResponse } from "next/server";

import { contactContent } from "@/data/contact.data";
import { submitContactForm } from "@/services/contact.service";
import type { ContactFormInput } from "@/types/contact";

export async function POST(request: Request) {
  let body: ContactFormInput;

  try {
    body = (await request.json()) as ContactFormInput;
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body." },
      { status: 400 },
    );
  }

  const result = await submitContactForm(body, {
    recipientEmail: contactContent.information.email,
  });

  if (!result.success) {
    return NextResponse.json(
      { success: false, error: result.error },
      { status: 400 },
    );
  }

  return NextResponse.json({
    success: true,
    leadId: result.leadId,
  });
}
