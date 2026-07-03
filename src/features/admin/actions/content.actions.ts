"use server";

import { revalidatePath, revalidateTag } from "next/cache";

import { adminError, adminSuccess } from "@/lib/admin/action-result";
import { CACHE_TAGS } from "@/lib/cache/server";
import { AuditActions, recordAudit } from "@/lib/platform/audit";
import {
  getOptionalString,
  getString,
  getBoolean,
  getProfileImageUrl,
  validateRequired,
} from "@/lib/admin/validation";
import { requireAdminUser } from "@/lib/auth/session";
import {
  parseCommaList,
  parseMultilineList,
  updateAbout,
  updateHero,
  getHeroRecord,
  getHeroTechnologyCard,
  createHeroTechnologyCard,
  updateHeroTechnologyCard,
  deleteHeroTechnologyCard,
  reorderHeroTechnologyCards,
  createHeroStat,
  updateHeroStat,
  deleteHeroStat,
  reorderHeroStats,
  updateResume,
  upsertDefaultResumePdf,
  createExperienceEntry,
  updateExperienceEntry,
  deleteExperienceEntry,
  updateExperiencePageConfig,
  reorderExperienceEntries,
  createEducationHomeEntry,
  updateEducationHomeEntry,
  deleteEducationHomeEntry,
  updateEducationHomeConfig,
  reorderEducationHomeEntries,
  createTestimonialItem,
  updateTestimonialItem,
  deleteTestimonialItem,
  updateTestimonialsConfig,
  reorderTestimonialItems,
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
  createFooterNavLink,
  updateFooterNavLink,
  deleteFooterNavLink,
  reorderFooterNavLinks,
  createFooterResourceLink,
  updateFooterResourceLink,
  deleteFooterResourceLink,
  reorderFooterResourceLinks,
  updateAboutHomeConfig,
  getAboutHomeConfig,
  createAboutHomeFeatureCard,
  updateAboutHomeFeatureCard,
  deleteAboutHomeFeatureCard,
  reorderAboutHomeFeatureCards,
} from "@/services/admin";
import {
  addBlogHomeCuratedPost,
  removeBlogHomeCuratedPost,
  reorderBlogHomeCuratedPosts,
  updateBlogHomeConfig,
} from "@/services/admin/blog-home.admin.service";
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
    const jobTitle = getString(formData, "jobTitle");
    const summary = getString(formData, "summary");
    const technologyHighlightsTitle = getString(formData, "technologyHighlightsTitle");
    const primaryCtaLabel = getString(formData, "primaryCtaLabel");
    const primaryCtaHref = getString(formData, "primaryCtaHref");
    const secondaryCtaLabel = getString(formData, "secondaryCtaLabel");
    const secondaryCtaHref = getString(formData, "secondaryCtaHref");
    const profileImageAlt = getString(formData, "profileImageAlt");
    const profileInitials = getString(formData, "profileInitials");
    const existingHero = await getHeroRecord();

    await updateHero({
      eyebrow,
      headline,
      jobTitle,
      summary,
      technologyHighlightsTitle,
      primaryCtaLabel,
      primaryCtaHref,
      primaryCtaVisible: getBoolean(formData, "primaryCtaVisible"),
      secondaryCtaLabel,
      secondaryCtaHref,
      secondaryCtaVisible: getBoolean(formData, "secondaryCtaVisible"),
      profileImageUrl:
        getProfileImageUrl(formData, "profileImageUrl", existingHero?.profileImageUrl) ??
        undefined,
      profileImageAlt,
      profileInitials,
      profileVisible: getBoolean(formData, "profileVisible"),
      orbitalLinesEnabled: getBoolean(formData, "orbitalLinesEnabled"),
      statsEnabled: getBoolean(formData, "statsEnabled"),
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

export async function saveHeroTechnologyCardAction(formData: FormData) {
  try {
    const user = await requireAdminUser();
    const id = getOptionalString(formData, "id");
    const existing = id ? await getHeroTechnologyCard(id) : null;
    const positionRaw = getString(formData, "position");
    const icon = getString(formData, "icon") || existing?.icon || "";

    if (!icon) {
      return adminError("Technology card icon is required.");
    }

    const input = {
      icon,
      title: getString(formData, "title"),
      href: getOptionalString(formData, "href"),
      position: Number.parseInt(positionRaw, 10) || 0,
      visible: formData.get("visible") === "on",
    };

    if (id) {
      await updateHeroTechnologyCard(id, input);
    } else {
      await createHeroTechnologyCard(input);
    }

    revalidatePublicContent();
    revalidatePath("/");
    revalidatePath("/admin/hero");
    await recordAudit({
      user,
      action: AuditActions.HERO_UPDATED,
      category: "CONTENT",
      entityType: "hero_technology_card",
      entityId: id ?? undefined,
      summary: id ? "Hero technology card updated" : "Hero technology card created",
    });

    return adminSuccess();
  } catch {
    return adminError("Failed to save technology card.");
  }
}

export async function deleteHeroTechnologyCardAction(id: string) {
  try {
    const user = await requireAdminUser();
    await deleteHeroTechnologyCard(id);
    revalidatePublicContent();
    revalidatePath("/admin/hero");
    await recordAudit({
      user,
      action: AuditActions.HERO_UPDATED,
      category: "CONTENT",
      entityType: "hero_technology_card",
      entityId: id,
      summary: "Hero technology card deleted",
    });
    return adminSuccess();
  } catch {
    return adminError("Failed to delete technology card.");
  }
}

export async function reorderHeroTechnologyCardsAction(orderedIds: string[]) {
  try {
    const user = await requireAdminUser();
    await reorderHeroTechnologyCards(orderedIds);
    revalidatePublicContent();
    revalidatePath("/admin/hero");
    await recordAudit({
      user,
      action: AuditActions.HERO_UPDATED,
      category: "CONTENT",
      summary: "Hero technology cards reordered",
    });
    return adminSuccess();
  } catch {
    return adminError("Failed to reorder technology cards.");
  }
}

export async function saveHeroStatAction(formData: FormData) {
  try {
    const user = await requireAdminUser();
    const id = getOptionalString(formData, "id");
    const input = {
      icon: getString(formData, "icon"),
      value: getString(formData, "value"),
      label: getString(formData, "label"),
      visible: formData.get("visible") === "on",
    };

    if (id) {
      await updateHeroStat(id, input);
    } else {
      await createHeroStat(input);
    }

    revalidatePublicContent();
    revalidatePath("/admin/hero");
    await recordAudit({
      user,
      action: AuditActions.HERO_UPDATED,
      category: "CONTENT",
      entityType: "hero_stat",
      entityId: id ?? undefined,
      summary: id ? "Hero stat updated" : "Hero stat created",
    });

    return adminSuccess();
  } catch {
    return adminError("Failed to save hero stat.");
  }
}

export async function deleteHeroStatAction(id: string) {
  try {
    const user = await requireAdminUser();
    await deleteHeroStat(id);
    revalidatePublicContent();
    revalidatePath("/admin/hero");
    await recordAudit({
      user,
      action: AuditActions.HERO_UPDATED,
      category: "CONTENT",
      entityType: "hero_stat",
      entityId: id,
      summary: "Hero stat deleted",
    });
    return adminSuccess();
  } catch {
    return adminError("Failed to delete hero stat.");
  }
}

export async function reorderHeroStatsAction(orderedIds: string[]) {
  try {
    const user = await requireAdminUser();
    await reorderHeroStats(orderedIds);
    revalidatePublicContent();
    revalidatePath("/admin/hero");
    await recordAudit({
      user,
      action: AuditActions.HERO_UPDATED,
      category: "CONTENT",
      summary: "Hero stats reordered",
    });
    return adminSuccess();
  } catch {
    return adminError("Failed to reorder hero stats.");
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
    const coreExpertiseTitle = getString(formData, "coreExpertiseTitle");
    const coreExpertiseItems = getString(formData, "coreExpertiseItems");
    const workingPrinciplesTitle = getString(formData, "workingPrinciplesTitle");
    const workingPrinciplesItems = getString(formData, "workingPrinciplesItems");
    const professionalHighlightsTitle = getString(formData, "professionalHighlightsTitle");
    const professionalHighlightsItems = getString(formData, "professionalHighlightsItems");
    const personalValuesTitle = getString(formData, "personalValuesTitle");
    const personalValuesItems = getString(formData, "personalValuesItems");

    const fieldErrors: Record<string, string> = {};
    for (const [key, value, label] of [
      ["sectionTitle", sectionTitle, "Section title"],
      ["sectionDescription", sectionDescription, "Section description"],
      ["introductionParagraphs", introductionParagraphs, "Introduction"],
      ["storyTitle", storyTitle, "Story title"],
      ["storyParagraphs", storyParagraphs, "Story content"],
      ["coreExpertiseTitle", coreExpertiseTitle, "Core expertise title"],
      ["coreExpertiseItems", coreExpertiseItems, "Core expertise items"],
      ["workingPrinciplesTitle", workingPrinciplesTitle, "Working principles title"],
      ["workingPrinciplesItems", workingPrinciplesItems, "Working principles items"],
      ["professionalHighlightsTitle", professionalHighlightsTitle, "Highlights title"],
      ["professionalHighlightsItems", professionalHighlightsItems, "Highlights items"],
      ["personalValuesTitle", personalValuesTitle, "Personal values title"],
      ["personalValuesItems", personalValuesItems, "Personal values items"],
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
      coreExpertiseTitle,
      coreExpertiseItems,
      workingPrinciplesTitle,
      workingPrinciplesItems,
      professionalHighlightsTitle,
      professionalHighlightsItems,
      personalValuesTitle,
      personalValuesItems,
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

export async function saveExperienceConfigAction(formData: FormData) {
  try {
    const user = await requireAdminUser();

    await updateExperiencePageConfig({
      sectionLabel: getString(formData, "sectionLabel"),
      sectionTitle: getString(formData, "sectionTitle"),
      sectionDescription: getString(formData, "sectionDescription"),
      sectionVisible: formData.get("sectionVisible") === "on",
      ctaLabel: getString(formData, "ctaLabel"),
      ctaHref: getString(formData, "ctaHref"),
      ctaVisible: formData.get("ctaVisible") === "on",
    });

    revalidatePublicContent();
    revalidatePath("/admin/experience");
    await recordAudit({
      user,
      action: AuditActions.EXPERIENCE_CONFIG_UPDATED,
      category: "CONTENT",
      entityType: "experience_page_config",
      summary: "Experience section updated",
    });
    return adminSuccess();
  } catch {
    return adminError("Failed to save experience section.");
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
      visible: formData.get("visible") === "on",
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

export async function reorderExperienceEntriesAction(orderedIds: string[]) {
  try {
    const user = await requireAdminUser();
    await reorderExperienceEntries(orderedIds);
    revalidatePublicContent();
    revalidatePath("/admin/experience");
    await recordAudit({
      user,
      action: AuditActions.EXPERIENCE_REORDERED,
      category: "CONTENT",
      entityType: "experience",
      summary: "Experience entries reordered",
    });
    return adminSuccess();
  } catch {
    return adminError("Failed to reorder experience entries.");
  }
}

export async function saveEducationHomeConfigAction(formData: FormData) {
  try {
    const user = await requireAdminUser();

    await updateEducationHomeConfig({
      sectionLabel: getString(formData, "sectionLabel"),
      sectionTitle: getString(formData, "sectionTitle"),
      sectionDescription: getString(formData, "sectionDescription"),
      sectionVisible: formData.get("sectionVisible") === "on",
    });

    revalidatePublicContent();
    revalidatePath("/admin/experience");
    await recordAudit({
      user,
      action: AuditActions.EDUCATION_HOME_CONFIG_UPDATED,
      category: "CONTENT",
      entityType: "education_home_config",
      summary: "Education home section updated",
    });
    return adminSuccess();
  } catch {
    return adminError("Failed to save education section.");
  }
}

export async function saveEducationHomeEntryAction(formData: FormData) {
  try {
    const user = await requireAdminUser();

    const id = getOptionalString(formData, "id");
    const input = {
      institution: getString(formData, "institution"),
      degree: getString(formData, "degree"),
      fieldOfStudy: getOptionalString(formData, "fieldOfStudy") ?? "",
      levelBadge: getOptionalString(formData, "levelBadge") ?? "",
      startMonth: getOptionalString(formData, "startMonth")
        ? Number(getString(formData, "startMonth"))
        : undefined,
      startYear: Number(getString(formData, "startYear") || new Date().getFullYear()),
      endMonth: getOptionalString(formData, "endMonth")
        ? Number(getString(formData, "endMonth"))
        : undefined,
      endYear: getOptionalString(formData, "endYear")
        ? Number(getString(formData, "endYear"))
        : undefined,
      description: getString(formData, "description"),
      technologies: parseCommaList(getString(formData, "technologies")),
      visible: formData.get("visible") === "on",
    };

    if (id) {
      await updateEducationHomeEntry(id, input);
    } else {
      await createEducationHomeEntry(input);
    }

    revalidatePublicContent();
    revalidatePath("/admin/experience");
    await recordAudit({
      user,
      action: id
        ? AuditActions.EDUCATION_HOME_ENTRY_UPDATED
        : AuditActions.EDUCATION_HOME_ENTRY_CREATED,
      category: "CONTENT",
      entityType: "education_home_entry",
      entityId: id ?? undefined,
      summary: id ? "Education home entry updated" : "Education home entry created",
    });
    return adminSuccess();
  } catch {
    return adminError("Failed to save education entry.");
  }
}

export async function deleteEducationHomeEntryAction(id: string) {
  try {
    const user = await requireAdminUser();
    await deleteEducationHomeEntry(id);
    revalidatePublicContent();
    revalidatePath("/admin/experience");
    await recordAudit({
      user,
      action: AuditActions.EDUCATION_HOME_ENTRY_DELETED,
      category: "CONTENT",
      entityType: "education_home_entry",
      entityId: id,
      summary: "Education home entry deleted",
    });
    return adminSuccess();
  } catch {
    return adminError("Failed to delete education entry.");
  }
}

export async function reorderEducationHomeEntriesAction(orderedIds: string[]) {
  try {
    const user = await requireAdminUser();
    await reorderEducationHomeEntries(orderedIds);
    revalidatePublicContent();
    revalidatePath("/admin/experience");
    await recordAudit({
      user,
      action: AuditActions.EDUCATION_HOME_REORDERED,
      category: "CONTENT",
      entityType: "education_home_entry",
      summary: "Education home entries reordered",
    });
    return adminSuccess();
  } catch {
    return adminError("Failed to reorder education entries.");
  }
}

export async function saveTestimonialsConfigAction(formData: FormData) {
  try {
    const user = await requireAdminUser();

    await updateTestimonialsConfig({
      label: getString(formData, "label"),
      title: getString(formData, "title"),
      titleAccent: getOptionalString(formData, "titleAccent") ?? "",
      description: getString(formData, "description"),
      sectionNumber: getString(formData, "sectionNumber"),
      visible: formData.get("visible") === "on",
      carouselEnabled: formData.get("carouselEnabled") === "on",
      autoplay: formData.get("autoplay") === "on",
      autoplayDelayMs: Number(getString(formData, "autoplayDelayMs") || "5000"),
      loop: formData.get("loop") === "on",
    });

    revalidatePublicContent();
    revalidatePath("/admin/testimonials");
    await recordAudit({
      user,
      action: AuditActions.TESTIMONIALS_CONFIG_UPDATED,
      category: "CONTENT",
      entityType: "testimonials_section_config",
      summary: "Testimonials section updated",
    });
    return adminSuccess();
  } catch {
    return adminError("Failed to save testimonials section.");
  }
}

export async function saveTestimonialItemAction(formData: FormData) {
  try {
    const user = await requireAdminUser();

    const id = getOptionalString(formData, "id");
    const ratingRaw = getOptionalString(formData, "rating");
    const testimonialDateRaw = getOptionalString(formData, "testimonialDate");
    const input = {
      quote: getString(formData, "quote"),
      authorName: getString(formData, "authorName"),
      authorTitle: getString(formData, "authorTitle"),
      company: getString(formData, "company"),
      avatarUrl: getOptionalString(formData, "avatarUrl") ?? "",
      companyLogoUrl: getOptionalString(formData, "companyLogoUrl") ?? "",
      rating: ratingRaw ? Number(ratingRaw) : undefined,
      testimonialDate: testimonialDateRaw || undefined,
      visible: formData.get("visible") === "on",
    };

    if (id) {
      await updateTestimonialItem(id, input);
    } else {
      await createTestimonialItem(input);
    }

    revalidatePublicContent();
    revalidatePath("/admin/testimonials");
    await recordAudit({
      user,
      action: id
        ? AuditActions.TESTIMONIAL_UPDATED
        : AuditActions.TESTIMONIAL_CREATED,
      category: "CONTENT",
      entityType: "testimonial",
      entityId: id ?? undefined,
      summary: id ? "Testimonial updated" : "Testimonial created",
    });
    return adminSuccess();
  } catch {
    return adminError("Failed to save testimonial.");
  }
}

export async function deleteTestimonialItemAction(id: string) {
  try {
    const user = await requireAdminUser();
    await deleteTestimonialItem(id);
    revalidatePublicContent();
    revalidatePath("/admin/testimonials");
    await recordAudit({
      user,
      action: AuditActions.TESTIMONIAL_DELETED,
      category: "CONTENT",
      entityType: "testimonial",
      entityId: id,
      summary: "Testimonial deleted",
    });
    return adminSuccess();
  } catch {
    return adminError("Failed to delete testimonial.");
  }
}

export async function reorderTestimonialItemsAction(orderedIds: string[]) {
  try {
    const user = await requireAdminUser();
    await reorderTestimonialItems(orderedIds);
    revalidatePublicContent();
    revalidatePath("/admin/testimonials");
    await recordAudit({
      user,
      action: AuditActions.TESTIMONIALS_REORDERED,
      category: "CONTENT",
      entityType: "testimonial",
      summary: "Testimonials reordered",
    });
    return adminSuccess();
  } catch {
    return adminError("Failed to reorder testimonials.");
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
      titleAccent: getOptionalString(formData, "titleAccent") ?? null,
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
      brandName: getString(formData, "brandName"),
      brandLogoUrl: getOptionalString(formData, "brandLogoUrl") ?? null,
      brandRole: getString(formData, "brandRole"),
      brandDescription: getOptionalString(formData, "brandDescription") ?? null,
      navSectionLabel: getString(formData, "navSectionLabel"),
      resourcesSectionLabel: getString(formData, "resourcesSectionLabel"),
      connectSectionLabel: getString(formData, "connectSectionLabel"),
      ctaTitle: getString(formData, "ctaTitle"),
      ctaDescription: getOptionalString(formData, "ctaDescription") ?? null,
      ctaLabel: getString(formData, "ctaLabel"),
      ctaHref: getString(formData, "ctaHref"),
      copyright: getString(formData, "copyright"),
      scrollToTopEnabled: formData.get("scrollToTopEnabled") === "on",
      scrollToTopLabel: getString(formData, "scrollToTopLabel"),
      orbitalDecorEnabled: formData.get("orbitalDecorEnabled") === "on",
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

export async function saveFooterNavLinkAction(formData: FormData) {
  try {
    const user = await requireAdminUser();
    const id = getOptionalString(formData, "id");
    const input = {
      label: getString(formData, "label"),
      href: getString(formData, "href"),
      visible: formData.get("visible") === "on",
    };

    if (id) {
      await updateFooterNavLink(id, input);
    } else {
      await createFooterNavLink(input);
    }

    revalidatePublicContent();
    revalidatePath("/admin/footer");
    await recordAudit({
      user,
      action: AuditActions.FOOTER_UPDATED,
      category: "CONTENT",
      entityType: "footer_nav_link",
      entityId: id ?? undefined,
      summary: id ? "Footer navigation link updated" : "Footer navigation link created",
    });

    return adminSuccess();
  } catch {
    return adminError("Failed to save navigation link.");
  }
}

export async function deleteFooterNavLinkAction(id: string) {
  try {
    const user = await requireAdminUser();
    await deleteFooterNavLink(id);
    revalidatePublicContent();
    revalidatePath("/admin/footer");
    await recordAudit({
      user,
      action: AuditActions.FOOTER_UPDATED,
      category: "CONTENT",
      entityType: "footer_nav_link",
      entityId: id,
      summary: "Footer navigation link deleted",
    });

    return adminSuccess();
  } catch {
    return adminError("Failed to delete navigation link.");
  }
}

export async function reorderFooterNavLinksAction(orderedIds: string[]) {
  try {
    const user = await requireAdminUser();
    await reorderFooterNavLinks(orderedIds);
    revalidatePublicContent();
    revalidatePath("/admin/footer");
    await recordAudit({
      user,
      action: AuditActions.FOOTER_UPDATED,
      category: "CONTENT",
      entityType: "footer_nav_link",
      summary: "Footer navigation links reordered",
    });

    return adminSuccess();
  } catch {
    return adminError("Failed to reorder navigation links.");
  }
}

export async function saveFooterResourceLinkAction(formData: FormData) {
  try {
    const user = await requireAdminUser();
    const id = getOptionalString(formData, "id");
    const input = {
      label: getString(formData, "label"),
      href: getString(formData, "href"),
      visible: formData.get("visible") === "on",
    };

    if (id) {
      await updateFooterResourceLink(id, input);
    } else {
      await createFooterResourceLink(input);
    }

    revalidatePublicContent();
    revalidatePath("/admin/footer");
    await recordAudit({
      user,
      action: AuditActions.FOOTER_UPDATED,
      category: "CONTENT",
      entityType: "footer_resource_link",
      entityId: id ?? undefined,
      summary: id ? "Footer resource link updated" : "Footer resource link created",
    });

    return adminSuccess();
  } catch {
    return adminError("Failed to save resource link.");
  }
}

export async function deleteFooterResourceLinkAction(id: string) {
  try {
    const user = await requireAdminUser();
    await deleteFooterResourceLink(id);
    revalidatePublicContent();
    revalidatePath("/admin/footer");
    await recordAudit({
      user,
      action: AuditActions.FOOTER_UPDATED,
      category: "CONTENT",
      entityType: "footer_resource_link",
      entityId: id,
      summary: "Footer resource link deleted",
    });

    return adminSuccess();
  } catch {
    return adminError("Failed to delete resource link.");
  }
}

export async function reorderFooterResourceLinksAction(orderedIds: string[]) {
  try {
    const user = await requireAdminUser();
    await reorderFooterResourceLinks(orderedIds);
    revalidatePublicContent();
    revalidatePath("/admin/footer");
    await recordAudit({
      user,
      action: AuditActions.FOOTER_UPDATED,
      category: "CONTENT",
      entityType: "footer_resource_link",
      summary: "Footer resource links reordered",
    });

    return adminSuccess();
  } catch {
    return adminError("Failed to reorder resource links.");
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

export async function saveAboutHomeConfigAction(formData: FormData) {
  try {
    const user = await requireAdminUser();

    await updateAboutHomeConfig({
      visible: formData.get("visible") === "on",
      sectionLabel: getString(formData, "sectionLabel"),
      title: getString(formData, "title"),
      titleAccent: getOptionalString(formData, "titleAccent") ?? null,
      description: getString(formData, "description"),
      ctaLabel: getString(formData, "ctaLabel"),
      ctaHref: getString(formData, "ctaHref"),
      ctaVisible: formData.get("ctaVisible") === "on",
    });

    revalidatePublicContent();
    revalidatePath("/admin/about");
    await recordAudit({
      user,
      action: AuditActions.ABOUT_HOME_UPDATED,
      category: "CONTENT",
      entityType: "about_home_config",
      summary: "About home section updated",
    });

    return adminSuccess();
  } catch {
    return adminError("Failed to save about home section.");
  }
}

export async function saveAboutHomeFeatureCardAction(formData: FormData) {
  try {
    const user = await requireAdminUser();
    const id = getOptionalString(formData, "id");
    const input = {
      number: getString(formData, "number"),
      icon: getString(formData, "icon"),
      title: getString(formData, "title"),
      description: getString(formData, "description"),
      visible: formData.get("visible") === "on",
    };

    if (id) {
      await updateAboutHomeFeatureCard(id, input);
    } else {
      await createAboutHomeFeatureCard(input);
    }

    revalidatePublicContent();
    revalidatePath("/admin/about");
    await recordAudit({
      user,
      action: AuditActions.ABOUT_HOME_UPDATED,
      category: "CONTENT",
      entityType: "about_home_feature_card",
      entityId: id ?? undefined,
      summary: id ? "About home feature card updated" : "About home feature card created",
    });

    return adminSuccess();
  } catch {
    return adminError("Failed to save feature card.");
  }
}

export async function deleteAboutHomeFeatureCardAction(id: string) {
  try {
    const user = await requireAdminUser();
    await deleteAboutHomeFeatureCard(id);
    revalidatePublicContent();
    revalidatePath("/admin/about");
    await recordAudit({
      user,
      action: AuditActions.ABOUT_HOME_UPDATED,
      category: "CONTENT",
      entityType: "about_home_feature_card",
      entityId: id,
      summary: "About home feature card deleted",
    });

    return adminSuccess();
  } catch {
    return adminError("Failed to delete feature card.");
  }
}

export async function reorderAboutHomeFeatureCardsAction(orderedIds: string[]) {
  try {
    const user = await requireAdminUser();
    await reorderAboutHomeFeatureCards(orderedIds);
    revalidatePublicContent();
    revalidatePath("/admin/about");
    await recordAudit({
      user,
      action: AuditActions.ABOUT_HOME_UPDATED,
      category: "CONTENT",
      summary: "About home feature cards reordered",
    });

    return adminSuccess();
  } catch {
    return adminError("Failed to reorder feature cards.");
  }
}

export async function saveBlogHomeConfigAction(formData: FormData) {
  try {
    const user = await requireAdminUser();
    const selectionMode = getString(formData, "selectionMode");
    const postLimitRaw = Number(getString(formData, "postLimit") || "3");
    const postLimit = [3, 6, 9].includes(postLimitRaw) ? postLimitRaw : 3;

    await updateBlogHomeConfig({
      label: getString(formData, "label"),
      title: getString(formData, "title"),
      titleAccent: getOptionalString(formData, "titleAccent") ?? null,
      description: getString(formData, "description"),
      sectionNumber: getString(formData, "sectionNumber"),
      visible: formData.get("visible") === "on",
      carouselEnabled: formData.get("carouselEnabled") === "on",
      autoplay: formData.get("autoplay") === "on",
      autoplayDelayMs: Number(getString(formData, "autoplayDelayMs") || "5000"),
      loop: formData.get("loop") === "on",
      postLimit,
      selectionMode:
        selectionMode === "featured" || selectionMode === "curated"
          ? selectionMode
          : "latest",
      readMoreLabel: getString(formData, "readMoreLabel"),
      ctaLabel: getOptionalString(formData, "ctaLabel") ?? null,
      ctaHref: getOptionalString(formData, "ctaHref") ?? null,
    });

    revalidatePublicContent();
    revalidatePath("/admin/blog/home-section");
    revalidatePath("/admin/blog-home");
    await recordAudit({
      user,
      action: AuditActions.BLOG_HOME_CONFIG_UPDATED,
      category: "CONTENT",
      entityType: "blog_home_section_config",
      summary: "Blog home section updated",
    });
    return adminSuccess();
  } catch {
    return adminError("Failed to save blog home section.");
  }
}

export async function addBlogHomeCuratedPostAction(blogPostId: string) {
  try {
    const user = await requireAdminUser();
    await addBlogHomeCuratedPost(blogPostId);
    revalidatePublicContent();
    revalidatePath("/admin/blog/home-section");
    revalidatePath("/admin/blog-home");
    await recordAudit({
      user,
      action: AuditActions.BLOG_HOME_CURATED_ADDED,
      category: "CONTENT",
      entityType: "blog_home_curated_post",
      entityId: blogPostId,
      summary: "Blog post added to home carousel",
    });
    return adminSuccess();
  } catch {
    return adminError("Failed to add blog post to home section.");
  }
}

export async function removeBlogHomeCuratedPostAction(id: string) {
  try {
    const user = await requireAdminUser();
    await removeBlogHomeCuratedPost(id);
    revalidatePublicContent();
    revalidatePath("/admin/blog/home-section");
    revalidatePath("/admin/blog-home");
    await recordAudit({
      user,
      action: AuditActions.BLOG_HOME_CURATED_REMOVED,
      category: "CONTENT",
      entityType: "blog_home_curated_post",
      entityId: id,
      summary: "Blog post removed from home carousel",
    });
    return adminSuccess();
  } catch {
    return adminError("Failed to remove blog post from home section.");
  }
}

export async function reorderBlogHomeCuratedPostsAction(orderedIds: string[]) {
  try {
    const user = await requireAdminUser();
    await reorderBlogHomeCuratedPosts(orderedIds);
    revalidatePublicContent();
    revalidatePath("/admin/blog/home-section");
    revalidatePath("/admin/blog-home");
    await recordAudit({
      user,
      action: AuditActions.BLOG_HOME_CURATED_REORDERED,
      category: "CONTENT",
      summary: "Blog home curated posts reordered",
    });
    return adminSuccess();
  } catch {
    return adminError("Failed to reorder curated blog posts.");
  }
}
