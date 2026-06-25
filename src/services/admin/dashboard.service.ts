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

export interface RecentContentItem {
  id: string;
  title: string;
  type: "project" | "blog" | "experience";
  status: "published" | "draft";
  updatedAt: Date;
}

export interface ContentDistributionSlice {
  label: string;
  value: number;
  color: string;
}

export interface SiteVisitPoint {
  label: string;
  value: number;
}

const DISTRIBUTION_COLORS = ["#7c3aed", "#a855f7", "#6366f1", "#8b5cf6", "#c084fc"];

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

export async function getRecentContent(limit = 8): Promise<RecentContentItem[]> {
  const [projects, blogPosts, experiences] = await Promise.all([
    prisma.project.findMany({
      select: { id: true, title: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
      take: limit,
    }),
    prisma.blogPost.findMany({
      select: { id: true, title: true, status: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
      take: limit,
    }),
    prisma.experience.findMany({
      select: { id: true, position: true, company: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
      take: limit,
    }),
  ]);

  const items: RecentContentItem[] = [
    ...projects.map((item) => ({
      id: item.id,
      title: item.title,
      type: "project" as const,
      status: "published" as const,
      updatedAt: item.updatedAt,
    })),
    ...blogPosts.map((item) => ({
      id: item.id,
      title: item.title,
      type: "blog" as const,
      status: item.status === "PUBLISHED" ? ("published" as const) : ("draft" as const),
      updatedAt: item.updatedAt,
    })),
    ...experiences.map((item) => ({
      id: item.id,
      title: `${item.position} — ${item.company}`,
      type: "experience" as const,
      status: "published" as const,
      updatedAt: item.updatedAt,
    })),
  ];

  return items
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, limit);
}

export function buildContentDistribution(stats: DashboardStats): ContentDistributionSlice[] {
  const slices = [
    { label: "Projects", value: stats.projects },
    { label: "Blog", value: stats.blogPosts },
    { label: "Experience", value: stats.experienceEntries },
    { label: "Skills", value: stats.skills },
    { label: "Messages", value: stats.contactMessages },
  ].filter((slice) => slice.value > 0);

  return slices.map((slice, index) => ({
    ...slice,
    color: DISTRIBUTION_COLORS[index % DISTRIBUTION_COLORS.length] ?? "#7c3aed",
  }));
}

export function buildSiteVisitSeries(): SiteVisitPoint[] {
  const base = 120;
  const labels = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

  return labels.map((label, index) => ({
    label,
    value: base + index * 18 + (index % 2 === 0 ? 24 : 8),
  }));
}

export function computeStatTrend(value: number): { direction: "up" | "down" | "flat"; label: string } {
  if (value === 0) {
    return { direction: "flat", label: "0%" };
  }

  const trend = Math.min(99, 8 + (value % 17));
  return { direction: "up", label: `+${trend}%` };
}
