import { ContactMessageStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import type { CreateLeadInput, LeadRepository } from "@/services/lead/types";
import type { ContactLeadRecord, LeadStatus } from "@/types/contact";

function toLeadStatus(status: ContactMessageStatus): LeadStatus {
  switch (status) {
    case ContactMessageStatus.READ:
      return "read";
    case ContactMessageStatus.REPLIED:
      return "replied";
    case ContactMessageStatus.ARCHIVED:
      return "archived";
    default:
      return "new";
  }
}

function toPrismaLeadStatus(status?: LeadStatus): ContactMessageStatus {
  switch (status) {
    case "read":
      return ContactMessageStatus.READ;
    case "replied":
      return ContactMessageStatus.REPLIED;
    case "archived":
      return ContactMessageStatus.ARCHIVED;
    default:
      return ContactMessageStatus.NEW;
  }
}

export class PrismaContactMessageRepository implements LeadRepository {
  async save(input: CreateLeadInput): Promise<ContactLeadRecord> {
    const message = await prisma.contactMessage.create({
      data: {
        name: input.name,
        email: input.email,
        subject: input.subject,
        message: input.message,
        company: input.company,
        projectType: input.projectType,
        status: toPrismaLeadStatus(input.status),
      },
    });

    return {
      id: message.id,
      name: message.name,
      email: message.email,
      subject: message.subject,
      message: message.message,
      company: message.company ?? undefined,
      projectType: message.projectType ?? undefined,
      status: toLeadStatus(message.status),
      createdAt: message.createdAt.toISOString(),
    };
  }
}

export const prismaContactMessageRepository = new PrismaContactMessageRepository();
