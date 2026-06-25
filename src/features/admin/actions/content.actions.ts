"use server";

import { revalidatePath } from "next/cache";

import { adminError, adminSuccess } from "@/lib/admin/action-result";
import { AuditActions, recordAudit } from "@/lib/platform/audit";
import {
  getOptionalString,
  getString,
  validateRequired,
} from "@/lib/admin/validation";
import { requireAdminUser } from "@/lib/auth/session";
import {
  parseCommaList,
  parseMultilineList,
  updateAbout,
  updateHero,
  updateResume,
  createExperienceEntry,
  updateExperienceEntry,
  deleteExperienceEntry,
  createProjectEntry,
  updateProjectEntry,
  deleteProjectEntry,
  createSkillEntry,
  updateSkillEntry,
  deleteSkillEntry,
} from "@/services/admin";

function revalidatePublicContent() {
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/experience");
  revalidatePath("/projects");
  revalidatePath("/skills");
  revalidatePath("/resume");
  revalidatePath("/blog");
}

export async function saveHeroAction(formData: FormData) {
  try {
    const user = await requireAdminUser();

    const eyebrow = getString(formData, "eyebrow");
    const headline = getString(formData, "headline");
    const summary = getString(formData, "summary");
    const technologyHighlightsTitle = getString(formData, "technologyHighlightsTitle");
    const primaryCtaLabel = getString(formData, "primaryCtaLabel");
    const primaryCtaHref = getString(formData, "primaryCtaHref");
    const secondaryCtaLabel = getString(formData, "secondaryCtaLabel");
    const secondaryCtaHref = getString(formData, "secondaryCtaHref");
    const profileImageAlt = getString(formData, "profileImageAlt");
    const profileInitials = getString(formData, "profileInitials");

    const fieldErrors: Record<string, string> = {};
    const requiredFields: Array<[string, string, string]> = [
      ["eyebrow", eyebrow, "Eyebrow"],
      ["headline", headline, "Headline"],
      ["summary", summary, "Summary"],
      ["primaryCtaLabel", primaryCtaLabel, "Primary CTA label"],
      ["profileImageAlt", profileImageAlt, "Profile image alt"],
      ["profileInitials", profileInitials, "Profile initials"],
    ];

    for (const [key, value, label] of requiredFields) {
      const error = validateRequired(value, label);
      if (error) fieldErrors[key] = error;
    }

    if (Object.keys(fieldErrors).length > 0) {
      return adminError("Please fix the highlighted fields.", fieldErrors);
    }

    await updateHero({
      eyebrow,
      headline,
      summary,
      technologyHighlightsTitle,
      primaryCtaLabel,
      primaryCtaHref,
      secondaryCtaLabel,
      secondaryCtaHref,
      profileImageUrl: getOptionalString(formData, "profileImageUrl"),
      profileImageAlt,
      profileInitials,
    });

    revalidatePublicContent();
    revalidatePath("/admin/hero");
    await recordAudit({
      user,
      action: AuditActions.HERO_UPDATED,
      category: "CONTENT",
      summary: "Hero section updated",
    });
    return adminSuccess();
  } catch {
    return adminError("Failed to save hero content.");
  }
}

export async function saveAboutAction(formData: FormData) {
  try {
    const user = await requireAdminUser();

    const sectionTitle = getString(formData, "sectionTitle");
    const sectionDescription = getString(formData, "sectionDescription");
    const introductionParagraphs = getString(formData, "introductionParagraphs");
    const storyTitle = getString(formData, "storyTitle");
    const storyParagraphs = getString(formData, "storyParagraphs");

    const fieldErrors: Record<string, string> = {};
    for (const [key, value, label] of [
      ["sectionTitle", sectionTitle, "Section title"],
      ["sectionDescription", sectionDescription, "Section description"],
      ["introductionParagraphs", introductionParagraphs, "Introduction"],
      ["storyTitle", storyTitle, "Story title"],
      ["storyParagraphs", storyParagraphs, "Story content"],
    ] as const) {
      const error = validateRequired(value, label);
      if (error) fieldErrors[key] = error;
    }

    if (Object.keys(fieldErrors).length > 0) {
      return adminError("Please fix the highlighted fields.", fieldErrors);
    }

    await updateAbout({
      sectionTitle,
      sectionDescription,
      introductionParagraphs,
      storyTitle,
      storyParagraphs,
    });

    revalidatePublicContent();
    revalidatePath("/admin/about");
    await recordAudit({ user, action: AuditActions.ABOUT_UPDATED, category: "CONTENT", summary: "About page updated" });
    return adminSuccess();
  } catch {
    return adminError("Failed to save about content.");
  }
}

export async function saveResumeAction(formData: FormData) {
  try {
    const user = await requireAdminUser();

    await updateResume({
      sectionTitle: getString(formData, "sectionTitle"),
      sectionDescription: getString(formData, "sectionDescription"),
      profileSummary: getString(formData, "profileSummary"),
      profileTitle: getString(formData, "profileTitle"),
      profileLocation: getString(formData, "profileLocation"),
      contentUpdatedAt: getString(formData, "contentUpdatedAt") || new Date().toISOString().slice(0, 10),
    });

    revalidatePublicContent();
    revalidatePath("/admin/resume");
    await recordAudit({ user, action: AuditActions.RESUME_UPDATED, category: "CONTENT", summary: "Resume content updated" });
    return adminSuccess();
  } catch {
    return adminError("Failed to save resume content.");
  }
}

export async function saveExperienceAction(formData: FormData) {
  try {
    const user = await requireAdminUser();

    const id = getOptionalString(formData, "id");
    const input = {
      company: getString(formData, "company"),
      position: getString(formData, "position"),
      employmentType: getString(formData, "employmentType") || "Full-time",
      location: getString(formData, "location"),
      startMonth: Number(getString(formData, "startMonth") || "1"),
      startYear: Number(getString(formData, "startYear") || new Date().getFullYear()),
      endMonth: getOptionalString(formData, "endMonth")
        ? Number(getString(formData, "endMonth"))
        : undefined,
      endYear: getOptionalString(formData, "endYear")
        ? Number(getString(formData, "endYear"))
        : undefined,
      current: formData.get("current") === "on",
      summary: getString(formData, "summary"),
      responsibilities: parseMultilineList(getString(formData, "responsibilities")),
      achievements: parseMultilineList(getString(formData, "achievements")),
      technologies: parseCommaList(getString(formData, "technologies")),
    };

    if (id) {
      await updateExperienceEntry(id, input);
    } else {
      await createExperienceEntry(input);
    }

    revalidatePublicContent();
    revalidatePath("/admin/experience");
    await recordAudit({
      user,
      action: id ? AuditActions.EXPERIENCE_UPDATED : AuditActions.EXPERIENCE_CREATED,
      category: "CONTENT",
      entityType: "experience",
      entityId: id ?? undefined,
      summary: id ? "Experience entry updated" : "Experience entry created",
    });
    return adminSuccess();
  } catch {
    return adminError("Failed to save experience entry.");
  }
}

export async function deleteExperienceAction(id: string) {
  try {
    const user = await requireAdminUser();
    await deleteExperienceEntry(id);
    revalidatePublicContent();
    revalidatePath("/admin/experience");
    await recordAudit({
      user,
      action: AuditActions.EXPERIENCE_DELETED,
      category: "CONTENT",
      entityType: "experience",
      entityId: id,
      summary: "Experience entry deleted",
    });
    return adminSuccess();
  } catch {
    return adminError("Failed to delete experience entry.");
  }
}

export async function saveProjectAction(formData: FormData) {
  try {
    const user = await requireAdminUser();

    const id = getOptionalString(formData, "id");
    const input = {
      slug: getString(formData, "slug"),
      title: getString(formData, "title"),
      shortDescription: getString(formData, "shortDescription"),
      longDescription: getString(formData, "longDescription"),
      category: getString(formData, "category"),
      status: getOptionalString(formData, "status"),
      client: getOptionalString(formData, "client"),
      role: getString(formData, "role"),
      featured: formData.get("featured") === "on",
      coverImageUrl: getOptionalString(formData, "coverImageUrl"),
      githubUrl: getOptionalString(formData, "githubUrl"),
      liveUrl: getOptionalString(formData, "liveUrl"),
      technologies: parseCommaList(getString(formData, "technologies")),
      highlights: parseMultilineList(getString(formData, "highlights")),
    };

    if (id) {
      await updateProjectEntry(id, input);
    } else {
      await createProjectEntry(input);
    }

    revalidatePublicContent();
    revalidatePath("/admin/projects");
    await recordAudit({
      user,
      action: id ? AuditActions.PROJECT_UPDATED : AuditActions.PROJECT_CREATED,
      category: "CONTENT",
      entityType: "project",
      entityId: id ?? undefined,
      summary: id ? "Project updated" : "Project created",
    });
    return adminSuccess();
  } catch {
    return adminError("Failed to save project.");
  }
}

export async function deleteProjectAction(id: string) {
  try {
    const user = await requireAdminUser();
    await deleteProjectEntry(id);
    revalidatePublicContent();
    revalidatePath("/admin/projects");
    await recordAudit({
      user,
      action: AuditActions.PROJECT_DELETED,
      category: "CONTENT",
      entityType: "project",
      entityId: id,
      summary: "Project deleted",
    });
    return adminSuccess();
  } catch {
    return adminError("Failed to delete project.");
  }
}

export async function saveSkillAction(formData: FormData) {
  try {
    const user = await requireAdminUser();

    const id = getOptionalString(formData, "id");
    const yearsRaw = getOptionalString(formData, "yearsOfExperience");
    const input = {
      name: getString(formData, "name"),
      category: getString(formData, "category"),
      description: getOptionalString(formData, "description"),
      featured: formData.get("featured") === "on",
      yearsOfExperience: yearsRaw ? Number(yearsRaw) : undefined,
      proficiencyLevel: getOptionalString(formData, "proficiencyLevel"),
    };

    if (id) {
      await updateSkillEntry(id, input);
    } else {
      await createSkillEntry(input);
    }

    revalidatePublicContent();
    revalidatePath("/admin/skills");
    await recordAudit({
      user,
      action: id ? AuditActions.SKILL_UPDATED : AuditActions.SKILL_CREATED,
      category: "CONTENT",
      entityType: "skill",
      entityId: id ?? undefined,
      summary: id ? "Skill updated" : "Skill created",
    });
    return adminSuccess();
  } catch {
    return adminError("Failed to save skill.");
  }
}

export async function deleteSkillAction(id: string) {
  try {
    const user = await requireAdminUser();
    await deleteSkillEntry(id);
    revalidatePublicContent();
    revalidatePath("/admin/skills");
    await recordAudit({
      user,
      action: AuditActions.SKILL_DELETED,
      category: "CONTENT",
      entityType: "skill",
      entityId: id,
      summary: "Skill deleted",
    });
    return adminSuccess();
  } catch {
    return adminError("Failed to delete skill.");
  }
}
