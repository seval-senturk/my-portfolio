import type { ContactLeadRecord, LeadStatus } from "@/types/contact";

export interface CreateLeadInput {
  name: string;
  email: string;
  subject: string;
  message: string;
  company?: string;
  projectType?: string;
  status?: LeadStatus;
}

export interface LeadRepository {
  save(input: CreateLeadInput): Promise<ContactLeadRecord>;
}
