import { hash } from "bcryptjs";
import { Prisma, PrismaClient, UserRole } from "@prisma/client";

import { siteConfig } from "@/config/site.config";
import { socialLinks } from "@/config/social-links.config";
import { aboutContent } from "@/data/about.data";
import { blogContent } from "@/data/blog.data";
import { contactContent } from "@/data/contact.data";
import { experienceContent } from "@/data/experience.data";
import { footerContent } from "@/data/footer.data";
import { heroContent } from "@/data/hero.data";
import { professionalHighlights } from "@/data/professional-highlights.data";
import { projectsContent } from "@/data/projects.data";
import { resumeContent } from "@/data/resume.data";
import { skillsContent } from "@/data/skills.data";
import { slugify } from "@/repositories/shared/locale";
import type { ContactContent } from "@/types/contact";
import type { ExperienceEntry } from "@/types/experience";
import type { ProjectEntry } from "@/types/project";
import type { ResumeCertification } from "@/types/resume";
import type { SkillEntry } from "@/types/skills";

const prisma = new PrismaClient();
const LOCALE = "en";

function toJson<T>(value: T): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

async function ensureTechnology(name: string) {
  const slug = slugify(name);

  return prisma.technology.upsert({
    where: { name },
    update: { slug },
    create: { name, slug },
  });
}

async function seedAdminUser() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error(
      "ADMIN_EMAIL and ADMIN_PASSWORD environment variables are required for seeding.",
    );
  }

  const passwordHash = await hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: {
      name: "Admin",
      passwordHash,
      role: UserRole.ADMIN,
    },
    create: {
      email,
      name: "Admin",
      passwordHash,
      role: UserRole.ADMIN,
    },
  });

  console.info(`Seeded admin user: ${email}`);
}

async function seedSiteSettings() {
  const settings = await prisma.siteSettings.upsert({
    where: { locale: LOCALE },
    update: {
      siteName: siteConfig.name,
      siteTitle: siteConfig.title,
      siteDescription: siteConfig.description,
      authorName: siteConfig.author.name,
      authorJobTitle: siteConfig.author.jobTitle,
      authorEmail: siteConfig.author.email,
      footerTagline: footerContent.tagline,
      footerQuickLinksLabel: footerContent.columns.quickLinks,
      footerConnectLabel: footerContent.columns.connect,
      footerCopyrightSuffix: footerContent.copyrightSuffix,
      professionalHighlights: toJson(professionalHighlights),
    },
    create: {
      id: "default",
      locale: LOCALE,
      siteName: siteConfig.name,
      siteTitle: siteConfig.title,
      siteDescription: siteConfig.description,
      authorName: siteConfig.author.name,
      authorJobTitle: siteConfig.author.jobTitle,
      authorEmail: siteConfig.author.email,
      footerTagline: footerContent.tagline,
      footerQuickLinksLabel: footerContent.columns.quickLinks,
      footerConnectLabel: footerContent.columns.connect,
      footerCopyrightSuffix: footerContent.copyrightSuffix,
      professionalHighlights: toJson(professionalHighlights),
    },
  });

  await prisma.socialLink.deleteMany({ where: { siteSettingsId: settings.id } });

  await prisma.socialLink.createMany({
    data: socialLinks.map((link, index) => ({
      siteSettingsId: settings.id,
      platform: link.platform,
      label: link.label,
      href: link.href,
      visible: true,
      sortOrder: index,
    })),
  });
}

async function seedHero() {
  await prisma.hero.upsert({
    where: { locale: LOCALE },
    update: {
      eyebrow: heroContent.eyebrow,
      headline: heroContent.headline,
      summary: heroContent.summary,
      technologyHighlightsTitle: heroContent.technologyHighlightsTitle,
      technologyHighlights: toJson([...heroContent.technologyHighlights]),
      primaryCtaLabel: heroContent.primaryCta.label,
      primaryCtaHref: heroContent.primaryCta.href,
      secondaryCtaLabel: heroContent.secondaryCta.label,
      secondaryCtaHref: heroContent.secondaryCta.href,
      profileImageUrl: null,
      profileImageAlt: heroContent.profile.imageAlt,
      profileInitials: heroContent.profile.initials,
    },
    create: {
      locale: LOCALE,
      eyebrow: heroContent.eyebrow,
      headline: heroContent.headline,
      summary: heroContent.summary,
      technologyHighlightsTitle: heroContent.technologyHighlightsTitle,
      technologyHighlights: toJson([...heroContent.technologyHighlights]),
      primaryCtaLabel: heroContent.primaryCta.label,
      primaryCtaHref: heroContent.primaryCta.href,
      secondaryCtaLabel: heroContent.secondaryCta.label,
      secondaryCtaHref: heroContent.secondaryCta.href,
      profileImageUrl: null,
      profileImageAlt: heroContent.profile.imageAlt,
      profileInitials: heroContent.profile.initials,
    },
  });
}

async function seedAbout() {
  await prisma.about.upsert({
    where: { locale: LOCALE },
    update: {
      sectionTitle: aboutContent.section.title,
      sectionDescription: aboutContent.section.description,
      introduction: toJson(aboutContent.introduction),
      story: toJson(aboutContent.story),
      coreExpertise: toJson(aboutContent.coreExpertise),
      workingPrinciples: toJson(aboutContent.workingPrinciples),
      professionalHighlights: toJson(aboutContent.professionalHighlights),
      personalValues: toJson(aboutContent.personalValues),
    },
    create: {
      locale: LOCALE,
      sectionTitle: aboutContent.section.title,
      sectionDescription: aboutContent.section.description,
      introduction: toJson(aboutContent.introduction),
      story: toJson(aboutContent.story),
      coreExpertise: toJson(aboutContent.coreExpertise),
      workingPrinciples: toJson(aboutContent.workingPrinciples),
      professionalHighlights: toJson(aboutContent.professionalHighlights),
      personalValues: toJson(aboutContent.personalValues),
    },
  });
}

async function seedExperience() {
  await prisma.experiencePageConfig.upsert({
    where: { locale: LOCALE },
    update: {
      sectionTitle: experienceContent.section.title,
      sectionDescription: experienceContent.section.description,
    },
    create: {
      locale: LOCALE,
      sectionTitle: experienceContent.section.title,
      sectionDescription: experienceContent.section.description,
    },
  });

  const incomingIds = experienceContent.entries.map((entry) => entry.id);
  await prisma.experienceTechnology.deleteMany({
    where: { experienceId: { notIn: incomingIds } },
  });
  await prisma.experience.deleteMany({
    where: { id: { notIn: incomingIds } },
  });

  for (const [index, entry] of (
    experienceContent.entries as readonly ExperienceEntry[]
  ).entries()) {
    await prisma.experience.upsert({
      where: { id: entry.id },
      update: {
        company: entry.company,
        position: entry.position,
        employmentType: entry.employmentType,
        location: entry.location,
        startMonth: entry.startDate.month,
        startYear: entry.startDate.year,
        endMonth: entry.endDate?.month ?? null,
        endYear: entry.endDate?.year ?? null,
        current: entry.current ?? false,
        summary: entry.summary,
        responsibilities: [...entry.responsibilities],
        achievements: [...(entry.achievements ?? [])],
        sortOrder: index,
      },
      create: {
        id: entry.id,
        company: entry.company,
        position: entry.position,
        employmentType: entry.employmentType,
        location: entry.location,
        startMonth: entry.startDate.month,
        startYear: entry.startDate.year,
        endMonth: entry.endDate?.month ?? null,
        endYear: entry.endDate?.year ?? null,
        current: entry.current ?? false,
        summary: entry.summary,
        responsibilities: [...entry.responsibilities],
        achievements: [...(entry.achievements ?? [])],
        sortOrder: index,
      },
    });

    await prisma.experienceTechnology.deleteMany({
      where: { experienceId: entry.id },
    });

    for (const technologyName of entry.technologies) {
      const technology = await ensureTechnology(technologyName);
      await prisma.experienceTechnology.create({
        data: {
          experienceId: entry.id,
          technologyId: technology.id,
        },
      });
    }
  }
}

async function seedProjects() {
  await prisma.projectsPageConfig.upsert({
    where: { locale: LOCALE },
    update: {
      sectionTitle: projectsContent.section.title,
      sectionDescription: projectsContent.section.description,
      featuredTitle: projectsContent.featured.title,
      additionalTitle: projectsContent.additional.title,
    },
    create: {
      locale: LOCALE,
      sectionTitle: projectsContent.section.title,
      sectionDescription: projectsContent.section.description,
      featuredTitle: projectsContent.featured.title,
      additionalTitle: projectsContent.additional.title,
    },
  });

  const incomingIds = projectsContent.entries.map((entry) => entry.id);
  await prisma.projectTechnology.deleteMany({
    where: { projectId: { notIn: incomingIds } },
  });
  await prisma.project.deleteMany({
    where: { id: { notIn: incomingIds } },
  });

  for (const [index, entry] of (
    projectsContent.entries as readonly ProjectEntry[]
  ).entries()) {
    await prisma.project.upsert({
      where: { id: entry.id },
      update: {
        slug: entry.slug,
        title: entry.title,
        shortDescription: entry.shortDescription,
        longDescription: entry.longDescription,
        category: entry.category,
        status: entry.status ?? null,
        client: entry.client ?? null,
        role: entry.role,
        featured: entry.featured,
        coverImageUrl: entry.coverImage ?? null,
        gallery: entry.gallery ? toJson([...entry.gallery]) : Prisma.JsonNull,
        startMonth: entry.startDate?.month ?? null,
        startYear: entry.startDate?.year ?? null,
        endMonth: entry.endDate?.month ?? null,
        endYear: entry.endDate?.year ?? null,
        highlights: [...(entry.highlights ?? [])],
        githubUrl: entry.githubUrl ?? null,
        liveUrl: entry.liveUrl ?? null,
        caseStudy: entry.caseStudy ? toJson(entry.caseStudy) : Prisma.JsonNull,
        metrics: entry.metrics ? toJson([...entry.metrics]) : Prisma.JsonNull,
        sortOrder: index,
      },
      create: {
        id: entry.id,
        slug: entry.slug,
        title: entry.title,
        shortDescription: entry.shortDescription,
        longDescription: entry.longDescription,
        category: entry.category,
        status: entry.status ?? null,
        client: entry.client ?? null,
        role: entry.role,
        featured: entry.featured,
        coverImageUrl: entry.coverImage ?? null,
        gallery: entry.gallery ? toJson([...entry.gallery]) : Prisma.JsonNull,
        startMonth: entry.startDate?.month ?? null,
        startYear: entry.startDate?.year ?? null,
        endMonth: entry.endDate?.month ?? null,
        endYear: entry.endDate?.year ?? null,
        highlights: [...(entry.highlights ?? [])],
        githubUrl: entry.githubUrl ?? null,
        liveUrl: entry.liveUrl ?? null,
        caseStudy: entry.caseStudy ? toJson(entry.caseStudy) : Prisma.JsonNull,
        metrics: entry.metrics ? toJson([...entry.metrics]) : Prisma.JsonNull,
        sortOrder: index,
      },
    });

    await prisma.projectTechnology.deleteMany({
      where: { projectId: entry.id },
    });

    for (const technologyName of entry.technologies) {
      const technology = await ensureTechnology(technologyName);
      await prisma.projectTechnology.create({
        data: {
          projectId: entry.id,
          technologyId: technology.id,
        },
      });
    }
  }
}

async function seedSkills() {
  await prisma.skillsPageConfig.upsert({
    where: { locale: LOCALE },
    update: {
      sectionTitle: skillsContent.section.title,
      sectionDescription: skillsContent.section.description,
      featuredTitle: skillsContent.featuredExpertise.header.title,
      categoriesTitle: skillsContent.categories.header.title,
      featuredExpertise: toJson([...skillsContent.featuredExpertise.items]),
    },
    create: {
      locale: LOCALE,
      sectionTitle: skillsContent.section.title,
      sectionDescription: skillsContent.section.description,
      featuredTitle: skillsContent.featuredExpertise.header.title,
      categoriesTitle: skillsContent.categories.header.title,
      featuredExpertise: toJson([...skillsContent.featuredExpertise.items]),
    },
  });

  const incomingIds = skillsContent.entries.map((entry) => entry.id);
  await prisma.skill.deleteMany({
    where: { id: { notIn: incomingIds } },
  });

  for (const [index, entry] of (
    skillsContent.entries as readonly SkillEntry[]
  ).entries()) {
    const technology = await ensureTechnology(entry.name);

    await prisma.skill.upsert({
      where: { id: entry.id },
      update: {
        name: entry.name,
        category: entry.category,
        description: entry.description ?? null,
        featured: entry.featured ?? false,
        yearsOfExperience: entry.yearsOfExperience ?? null,
        proficiencyLevel: entry.proficiencyLevel ?? null,
        technologyId: technology.id,
        sortOrder: index,
      },
      create: {
        id: entry.id,
        name: entry.name,
        category: entry.category,
        description: entry.description ?? null,
        featured: entry.featured ?? false,
        yearsOfExperience: entry.yearsOfExperience ?? null,
        proficiencyLevel: entry.proficiencyLevel ?? null,
        technologyId: technology.id,
        sortOrder: index,
      },
    });
  }
}

async function seedResume() {
  const resume = await prisma.resume.upsert({
    where: { locale: LOCALE },
    update: {
      sectionTitle: resumeContent.section.title,
      sectionDescription: resumeContent.section.description,
      profile: toJson(resumeContent.profile),
      professionalSummary: toJson(resumeContent.professionalSummary),
      quickFacts: toJson(resumeContent.quickFacts),
      experienceSnapshot: toJson(resumeContent.experienceSnapshot),
      skillsSnapshot: toJson(resumeContent.skillsSnapshot),
      actions: toJson(resumeContent.actions),
      educationTitle: resumeContent.education.title,
      certificationsTitle: resumeContent.certifications.title,
      languagesTitle: resumeContent.languages.title,
      contentUpdatedAt: resumeContent.updatedAt,
    },
    create: {
      locale: LOCALE,
      sectionTitle: resumeContent.section.title,
      sectionDescription: resumeContent.section.description,
      profile: toJson(resumeContent.profile),
      professionalSummary: toJson(resumeContent.professionalSummary),
      quickFacts: toJson(resumeContent.quickFacts),
      experienceSnapshot: toJson(resumeContent.experienceSnapshot),
      skillsSnapshot: toJson(resumeContent.skillsSnapshot),
      actions: toJson(resumeContent.actions),
      educationTitle: resumeContent.education.title,
      certificationsTitle: resumeContent.certifications.title,
      languagesTitle: resumeContent.languages.title,
      contentUpdatedAt: resumeContent.updatedAt,
    },
  });

  await prisma.resumeFile.deleteMany({ where: { resumeId: resume.id } });
  await prisma.education.deleteMany({ where: { resumeId: resume.id } });
  await prisma.certification.deleteMany({ where: { resumeId: resume.id } });
  await prisma.resumeLanguage.deleteMany({ where: { resumeId: resume.id } });

  await prisma.resumeFile.createMany({
    data: resumeContent.files.map((file, index) => ({
      id: file.id,
      resumeId: resume.id,
      locale: file.locale,
      label: file.label,
      filePath: file.filePath,
      fileName: file.fileName,
      mimeType: file.mimeType,
      isDefault: file.isDefault ?? false,
      sortOrder: index,
    })),
  });

  await prisma.education.createMany({
    data: resumeContent.education.items.map((item, index) => ({
      id: item.id,
      resumeId: resume.id,
      institution: item.institution,
      degree: item.degree,
      fieldOfStudy: item.fieldOfStudy ?? null,
      startMonth: item.startDate?.month ?? null,
      startYear: item.startDate?.year ?? null,
      endMonth: item.endDate?.month ?? null,
      endYear: item.endDate?.year ?? null,
      description: item.description ?? null,
      sortOrder: index,
    })),
  });

  await prisma.certification.createMany({
    data: (
      resumeContent.certifications.items as readonly ResumeCertification[]
    ).map((item, index) => ({
      id: item.id,
      resumeId: resume.id,
      title: item.title,
      organization: item.organization,
      issueMonth: item.issueDate?.month ?? null,
      issueYear: item.issueDate?.year ?? null,
      credentialUrl: item.credentialUrl ?? null,
      sortOrder: index,
    })),
  });

  await prisma.resumeLanguage.createMany({
    data: resumeContent.languages.items.map((item, index) => ({
      id: item.id,
      resumeId: resume.id,
      name: item.name,
      proficiency: item.proficiency,
      sortOrder: index,
    })),
  });
}

async function seedContact() {
  const contactData = contactContent as ContactContent;
  await prisma.contactPageConfig.upsert({
    where: { locale: LOCALE },
    update: {
      sectionTitle: contactContent.section.title,
      sectionDescription: contactContent.section.description,
      email: contactContent.information.email,
      phone: contactData.information.phone ?? null,
      location: contactData.information.location,
      website: contactData.information.website,
      linkedin: contactData.information.linkedin,
      github: contactData.information.github,
      availabilityStatus: contactData.availabilityStatus,
      responseTime: contactData.responseTime,
      calendarUrl: contactData.calendarUrl ?? null,
      resumeHref: contactContent.resumeHref,
      resumeLabel: contactContent.resumeLabel,
      formConfig: toJson(contactContent.form),
      messagesConfig: toJson(contactContent.messages),
    },
    create: {
      locale: LOCALE,
      sectionTitle: contactContent.section.title,
      sectionDescription: contactContent.section.description,
      email: contactContent.information.email,
      phone: contactData.information.phone ?? null,
      location: contactData.information.location,
      website: contactData.information.website,
      linkedin: contactData.information.linkedin,
      github: contactData.information.github,
      availabilityStatus: contactData.availabilityStatus,
      responseTime: contactData.responseTime,
      calendarUrl: contactData.calendarUrl ?? null,
      resumeHref: contactContent.resumeHref,
      resumeLabel: contactContent.resumeLabel,
      formConfig: toJson(contactContent.form),
      messagesConfig: toJson(contactContent.messages),
    },
  });
}

async function seedBlog() {
  await prisma.blogPageConfig.upsert({
    where: { locale: LOCALE },
    update: {
      sectionTitle: blogContent.section.title,
      sectionDescription: blogContent.section.description,
    },
    create: {
      locale: LOCALE,
      sectionTitle: blogContent.section.title,
      sectionDescription: blogContent.section.description,
    },
  });
}

async function main() {
  await seedAdminUser();
  await seedSiteSettings();
  await seedHero();
  await seedAbout();
  await seedExperience();
  await seedProjects();
  await seedSkills();
  await seedResume();
  await seedContact();
  await seedBlog();

  console.info("Database seed completed successfully.");
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
