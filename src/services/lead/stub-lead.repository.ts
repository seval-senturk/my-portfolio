import type { CreateLeadInput, LeadRepository } from "@/services/lead/types";
import type { ContactLeadRecord } from "@/types/contact";

export class StubLeadRepository implements LeadRepository {
  async save(input: CreateLeadInput): Promise<ContactLeadRecord> {
    const lead: ContactLeadRecord = {
      id: `lead-${Date.now()}`,
      name: input.name,
      email: input.email,
      subject: input.subject,
      message: input.message,
      company: input.company,
      projectType: input.projectType,
      status: input.status ?? "new",
      createdAt: new Date().toISOString(),
    };

    if (process.env.NODE_ENV === "development") {
      console.info("[StubLeadRepository] Lead saved", {
        id: lead.id,
        email: lead.email,
        subject: lead.subject,
      });
    }

    return lead;
  }
}

export function createLeadRepository(): LeadRepository {
  return new StubLeadRepository();
}
