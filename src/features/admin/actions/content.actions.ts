"use server";

import { revalidatePath, revalidateTag } from "next/cache";

import { adminError, adminSuccess } from "@/lib/admin/action-result";
import { CACHE_TAGS } from "@/lib/cache/server";
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
  upsertDefaultResumePdf,
  createExperienceEntry,
  updateExperienceEntry,
  deleteExperienceEntry,
  createProjectEntry,
  updateProjectEntry,
  deleteProjectEntry,
  createSkillEntry,
  updateSkillEntry,
  deleteSkillEntry,
  updateExpertiseCarouselConfig,
  createExpertiseCarouselItem,
  updateExpertiseCarouselItem,
  deleteExpertiseCarouselItem,
  reorderExpertiseCarouselItems,
  parseExpertiseBulletList,
  updateFooterConfig,
} from "@/services/admin";
import { replaceSocialLinks } from "@/services/admin/social.admin.service";

function revalidatePublicContent() {
  revalidateTag(CACHE_TAGS.content);
  revalidateTag(CACHE_TAGS.seo);
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/experience");
  revalidatePath("/projects");
  revalidatePath("/skills");
  revalidatePath("/resume");
  revalidatePath("/blog");
  revalidatePath("/contact");
}

const SOCIAL_PLATFORMS = [
  "github",
  "linkedin",
  "email",
  "x",
  "instagram",
  "medium",
  "behance",
  "dribbble",
] as const;

export async function saveHeroSocialLinksAction(formData: FormData) {
  try {
    const user = await requireAdminUser();
    const links = [];

    for (let index = 0; index < 6; index += 1) {
      const platform = getString(formData, `social_${index}_platform`);
      const label = getString(formData, `social_${index}_label`);
      const href = getString(formData, `social_${index}_href`);
      const visible = formData.get(`social_${index}_visible`) === "on";

      if (!platform && !label && !href) {
        continue;
      }

      if (!platform || !label || !href) {
        return adminError(`Social link ${index + 1} requires platform, label, and URL.`);
      }

      if (!SOCIAL_PLATFORMS.includes(platform as (typeof SOCIAL_PLATFORMS)[number])) {
        return adminError(`Invalid platform for social link ${index + 1}.`);
      }

      links.push({
        platform: platform as (typeof SOCIAL_PLATFORMS)[number],
        label,
        href,
        visible,
      });
    }

    await replaceSocialLinks(links);

    revalidatePublicContent();
    revalidatePath("/admin/hero");
    await recordAudit({
      user,
      action: AuditActions.HERO_UPDATED,
      category: "CONTENT",
      summary: "Hero social links updated",
    });

    return adminSuccess();
  } catch {
    return adminError("Failed to save social links.");
  }
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

    const sectionTitle = getString(formData, "sectionTitle");
    const sectionDescription = getString(formData, "sectionDescription");
    const profileSummary = getString(formData, "profileSummary");
    const profileTitle = getString(formData, "profileTitle");
    const profileLocation = getString(formData, "profileLocation");
    const contentUpdatedAt =
      getString(formData, "contentUpdatedAt") || new Date().toISOString().slice(0, 10);

    const fieldErrors: Record<string, string> = {};
    for (const [key, value, label] of [
      ["sectionTitle", sectionTitle, "Section title"],
      ["sectionDescription", sectionDescription, "Section description"],
      ["profileTitle", profileTitle, "Profile title"],
      ["profileSummary", profileSummary, "Profile summary"],
    ] as const) {
      const error = validateRequired(value, label);
      if (error) fieldErrors[key] = error;
    }

    if (Object.keys(fieldErrors).length > 0) {
      return adminError("Please fix the highlighted fields.", fieldErrors);
    }

    await updateResume({
      sectionTitle,
      sectionDescription,
      profileSummary,
      profileTitle,
      profileLocation,
      contentUpdatedAt,
    });

    revalidatePublicContent();
    revalidatePath("/admin/resume");
    await recordAudit({ user, action: AuditActions.RESUME_UPDATED, category: "CONTENT", summary: "Resume content updated" });
    return adminSuccess();
  } catch {
    return adminError("Failed to save resume content.");
  }
}

export async function uploadResumePdfAction(formData: FormData) {
  try {
    const user = await requireAdminUser();
    const file = formData.get("resumePdf");

    if (!(file instanceof File)) {
      return adminError("Please select a PDF file to upload.");
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const label = getOptionalString(formData, "resumePdfLabel") ?? "English CV";

    await upsertDefaultResumePdf({
      buffer,
      originalName: file.name,
      label,
    });

    revalidatePublicContent();
    revalidatePath("/admin/resume");
    await recordAudit({
      user,
      action: AuditActions.RESUME_UPDATED,
      category: "CONTENT",
      summary: "Resume PDF uploaded",
    });
    return adminSuccess();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to upload resume PDF.";
    return adminError(message);
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

export async function saveExpertiseCarouselConfigAction(formData: FormData) {
  try {
    const user = await requireAdminUser();

    await updateExpertiseCarouselConfig({
      label: getString(formData, "label"),
      title: getString(formData, "title"),
      description: getString(formData, "description"),
      visible: formData.get("visible") === "on",
    });

    revalidatePublicContent();
    revalidatePath("/admin/expertise-carousel");
    await recordAudit({
      user,
      action: AuditActions.EXPERTISE_CAROUSEL_UPDATED,
      category: "CONTENT",
      entityType: "expertise_carousel_config",
      summary: "Expertise carousel section updated",
    });
    return adminSuccess();
  } catch {
    return adminError("Failed to save expertise carousel section.");
  }
}

export async function saveExpertiseCarouselItemAction(formData: FormData) {
  try {
    const user = await requireAdminUser();

    const id = getOptionalString(formData, "id");
    const input = {
      icon: getString(formData, "icon"),
      title: getString(formData, "title"),
      description: getOptionalString(formData, "description"),
      bulletItems: parseExpertiseBulletList(
        getOptionalString(formData, "bulletItems") ?? "",
      ),
      ctaLabel: getOptionalString(formData, "ctaLabel"),
      ctaHref: getOptionalString(formData, "ctaHref"),
      visible: formData.get("visible") === "on",
    };

    if (id) {
      await updateExpertiseCarouselItem(id, input);
    } else {
      await createExpertiseCarouselItem(input);
    }

    revalidatePublicContent();
    revalidatePath("/admin/expertise-carousel");
    await recordAudit({
      user,
      action: id
        ? AuditActions.EXPERTISE_CAROUSEL_ITEM_UPDATED
        : AuditActions.EXPERTISE_CAROUSEL_ITEM_CREATED,
      category: "CONTENT",
      entityType: "expertise_carousel_item",
      entityId: id ?? undefined,
      summary: id ? "Expertise carousel card updated" : "Expertise carousel card created",
    });
    return adminSuccess();
  } catch {
    return adminError("Failed to save expertise carousel card.");
  }
}

export async function deleteExpertiseCarouselItemAction(id: string) {
  try {
    const user = await requireAdminUser();
    await deleteExpertiseCarouselItem(id);
    revalidatePublicContent();
    revalidatePath("/admin/expertise-carousel");
    await recordAudit({
      user,
      action: AuditActions.EXPERTISE_CAROUSEL_ITEM_DELETED,
      category: "CONTENT",
      entityType: "expertise_carousel_item",
      entityId: id,
      summary: "Expertise carousel card deleted",
    });
    return adminSuccess();
  } catch {
    return adminError("Failed to delete expertise carousel card.");
  }
}

export async function reorderExpertiseCarouselItemsAction(orderedIds: string[]) {
  try {
    const user = await requireAdminUser();
    await reorderExpertiseCarouselItems(orderedIds);
    revalidatePublicContent();
    revalidatePath("/admin/expertise-carousel");
    await recordAudit({
      user,
      action: AuditActions.EXPERTISE_CAROUSEL_REORDERED,
      category: "CONTENT",
      entityType: "expertise_carousel_item",
      summary: "Expertise carousel cards reordered",
    });
    return adminSuccess();
  } catch {
    return adminError("Failed to reorder expertise carousel cards.");
  }
}

export async function saveFooterAction(formData: FormData) {
  try {
    const user = await requireAdminUser();

    await updateFooterConfig({
      newsletterEnabled: formData.get("newsletterEnabled") === "on",
      newsletterLabel: getString(formData, "newsletterLabel"),
      newsletterTitle: getString(formData, "newsletterTitle"),
      newsletterDescription: getOptionalString(formData, "newsletterDescription") ?? null,
      newsletterPlaceholder: getString(formData, "newsletterPlaceholder"),
      newsletterButtonText: getString(formData, "newsletterButtonText"),
      phone: getOptionalString(formData, "phone") ?? null,
      email: getOptionalString(formData, "email") ?? null,
      address: getOptionalString(formData, "address") ?? null,
      copyright: getString(formData, "copyright"),
      brandName: getString(formData, "brandName"),
      brandLogoUrl: getOptionalString(formData, "brandLogoUrl") ?? null,
      scrollToTopEnabled: formData.get("scrollToTopEnabled") === "on",
    });

    revalidatePublicContent();
    revalidatePath("/admin/footer");
    await recordAudit({
      user,
      action: AuditActions.FOOTER_UPDATED,
      category: "CONTENT",
      entityType: "footer_config",
      summary: "Footer content updated",
    });

    return adminSuccess();
  } catch {
    return adminError("Failed to save footer.");
  }
}

export async function saveFooterSocialLinksAction(formData: FormData) {
  try {
    const user = await requireAdminUser();
    const links = [];

    for (let index = 0; index < 6; index += 1) {
      const platform = getString(formData, `social_${index}_platform`);
      const label = getString(formData, `social_${index}_label`);
      const href = getString(formData, `social_${index}_href`);
      const visible = formData.get(`social_${index}_visible`) === "on";

      if (!platform && !label && !href) {
        continue;
      }

      if (!platform || !label || !href) {
        return adminError(`Social link ${index + 1} requires platform, label, and URL.`);
      }

      if (!SOCIAL_PLATFORMS.includes(platform as (typeof SOCIAL_PLATFORMS)[number])) {
        return adminError(`Invalid platform for social link ${index + 1}.`);
      }

      links.push({
        platform: platform as (typeof SOCIAL_PLATFORMS)[number],
        label,
        href,
        visible,
      });
    }

    await replaceSocialLinks(links);

    revalidatePublicContent();
    revalidatePath("/admin/footer");
    await recordAudit({
      user,
      action: AuditActions.FOOTER_UPDATED,
      category: "CONTENT",
      summary: "Footer social links updated",
    });

    return adminSuccess();
  } catch {
    return adminError("Failed to save social links.");
  }
}

export async function subscribeNewsletterAction(formData: FormData) {
  const email = getString(formData, "email").trim();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return adminError("Please enter a valid email address.");
  }

  return adminSuccess();
}
