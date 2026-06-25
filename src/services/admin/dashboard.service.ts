import { prisma } from "@/lib/prisma";

export interface DashboardStats {
  projects: number;
  blogPosts: number;
  experienceEntries: number;
  skills: number;
  contactMessages: number;
  resumeUpdatedAt: string | null;
  siteStatus: "published" | "draft";
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const [
    projects,
    blogPosts,
    experienceEntries,
    skills,
    contactMessages,
    resume,
    hero,
  ] = await Promise.all([
    prisma.project.count(),
    prisma.blogPost.count(),
    prisma.experience.count(),
    prisma.skill.count(),
    prisma.contactMessage.count(),
    prisma.resume.findUnique({ where: { locale: "en" }, select: { contentUpdatedAt: true } }),
    prisma.hero.findUnique({ where: { locale: "en" }, select: { status: true } }),
  ]);

  return {
    projects,
    blogPosts,
    experienceEntries,
    skills,
    contactMessages,
    resumeUpdatedAt: resume?.contentUpdatedAt ?? null,
    siteStatus: hero?.status === "PUBLISHED" ? "published" : "draft",
  };
}
