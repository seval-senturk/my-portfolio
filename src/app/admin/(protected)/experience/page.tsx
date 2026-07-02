import { educationHomeContent } from "@/data/education-home.data";
import { experienceContent } from "@/data/experience.data";
import { CareerJourneyUnifiedAdminView } from "@/features/admin/components/career-journey-unified-admin-view";
import {
  getEducationHomeConfig,
  getExperiencePageConfig,
  listEducationHomeEntries,
  listExperienceEntries,
} from "@/services/admin";

export default async function AdminExperiencePage() {
  const [experienceConfig, experienceEntries, educationConfig, educationEntries] =
    await Promise.all([
      getExperiencePageConfig(),
      listExperienceEntries(),
      getEducationHomeConfig(),
      listEducationHomeEntries(),
    ]);

  const resolvedExperienceConfig = experienceConfig
    ? {
        sectionLabel: experienceConfig.sectionLabel,
        sectionTitle: experienceConfig.sectionTitle,
        sectionDescription: experienceConfig.sectionDescription,
        sectionVisible: experienceConfig.sectionVisible,
        ctaLabel: experienceConfig.ctaLabel,
        ctaHref: experienceConfig.ctaHref,
        ctaVisible: experienceConfig.ctaVisible,
      }
    : {
        sectionLabel: experienceContent.section.label,
        sectionTitle: experienceContent.section.title,
        sectionDescription: experienceContent.section.description,
        sectionVisible: experienceContent.section.visible,
        ctaLabel: experienceContent.section.cta.label,
        ctaHref: experienceContent.section.cta.href,
        ctaVisible: experienceContent.section.cta.visible,
      };

  const resolvedEducationConfig = educationConfig
    ? {
        sectionLabel: educationConfig.sectionLabel,
        sectionTitle: educationConfig.sectionTitle,
        sectionDescription: educationConfig.sectionDescription ?? "",
        sectionVisible: educationConfig.sectionVisible,
      }
    : {
        sectionLabel: educationHomeContent.section.label,
        sectionTitle: educationHomeContent.section.title,
        sectionDescription: educationHomeContent.section.description ?? "",
        sectionVisible: educationHomeContent.section.visible,
      };

  return (
    <CareerJourneyUnifiedAdminView
      experienceConfig={resolvedExperienceConfig}
      experienceEntries={experienceEntries.map((entry) => ({
        id: entry.id,
        company: entry.company,
        position: entry.position,
        employmentType: entry.employmentType,
        location: entry.location,
        startMonth: entry.startMonth,
        startYear: entry.startYear,
        endMonth: entry.endMonth,
        endYear: entry.endYear,
        current: entry.current,
        summary: entry.summary,
        responsibilities: entry.responsibilities,
        achievements: entry.achievements,
        technologies: entry.technologies.map((item) => item.technology.name),
        visible: entry.visible,
      }))}
      educationConfig={resolvedEducationConfig}
      educationEntries={educationEntries.map((entry) => ({
        id: entry.id,
        institution: entry.institution,
        degree: entry.degree,
        fieldOfStudy: entry.fieldOfStudy ?? "",
        levelBadge: entry.levelBadge ?? "",
        startMonth: entry.startMonth,
        startYear: entry.startYear,
        endMonth: entry.endMonth,
        endYear: entry.endYear,
        description: entry.description,
        technologies: entry.technologies,
        visible: entry.visible,
      }))}
    />
  );
}
