import type { LeadRepository } from "@/services/lead/types";
import { prismaContactMessageRepository } from "@/repositories/prisma/contact-message.repository";

export function createLeadRepository(): LeadRepository {
  return prismaContactMessageRepository;
}
