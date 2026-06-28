import { listExperienceEntries } from "@/services/admin";
import { ExperienceAdminView } from "@/features/admin/components/experience-admin-view";

export default async function AdminExperiencePage() {
  const entries = await listExperienceEntries();

  return (
    <ExperienceAdminView
      entries={entries.map((entry) => ({
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
      }))}
    />
  );
}

