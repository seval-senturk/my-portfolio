import type { ExperienceContent } from "@/types/experience";
import type { ResumeContent } from "@/types/resume";
import type { SkillsContent } from "@/types/skills";
import {
  getDefaultResumeFile,
  resolveExperienceSnapshot,
  resolveSkillsSnapshot,
} from "@/lib/resume";

import { ResumeActionsBar } from "@/features/resume/components/resume-actions-bar";
import { ResumeCertificationsView } from "@/features/resume/components/resume-certifications-view";
import { ResumeEducationView } from "@/features/resume/components/resume-education-view";
import { ResumeExperienceSnapshotView } from "@/features/resume/components/resume-experience-snapshot-view";
import { ResumeHeader } from "@/features/resume/components/resume-header";
import { ResumeLanguagesView } from "@/features/resume/components/resume-languages-view";
import { ResumeQuickFactsView } from "@/features/resume/components/resume-quick-facts-view";
import { ResumeSkillsSnapshotView } from "@/features/resume/components/resume-skills-snapshot-view";
import { ResumeSubsection } from "@/features/resume/components/resume-subsection";
import { ResumeSummaryView } from "@/features/resume/components/resume-summary-view";
import { Text } from "@/components/ui/text";

interface ResumeHubViewProps {
  content: ResumeContent;
  experienceContent: ExperienceContent;
  skillsContent: SkillsContent;
}

export function ResumeHubView({
  content,
  experienceContent,
  skillsContent,
}: ResumeHubViewProps) {
  const resumeFile = getDefaultResumeFile(content.files);
  const experienceEntries = resolveExperienceSnapshot(
    experienceContent.entries,
    content.experienceSnapshot.entryIds,
  );
  const skillsItems = resolveSkillsSnapshot(
    skillsContent.featuredExpertise.items,
    content.skillsSnapshot.itemIds,
  );

  return (
    <article className="space-y-8">
      <ResumeHeader profile={content.profile} />

      <ResumeActionsBar actions={content.actions} resumeFile={resumeFile} />

      <ResumeSubsection title={content.professionalSummary.title}>
        <ResumeSummaryView paragraphs={content.professionalSummary.paragraphs} />
      </ResumeSubsection>

      <ResumeSubsection title={content.quickFacts.title}>
        <ResumeQuickFactsView items={content.quickFacts.items} />
      </ResumeSubsection>

      <ResumeExperienceSnapshotView
        config={content.experienceSnapshot}
        entries={experienceEntries}
      />

      <ResumeSkillsSnapshotView
        config={content.skillsSnapshot}
        items={skillsItems}
      />

      <ResumeEducationView
        title={content.education.title}
        items={content.education.items}
      />

      <ResumeCertificationsView
        title={content.certifications.title}
        items={content.certifications.items}
      />

      <ResumeLanguagesView
        title={content.languages.title}
        items={content.languages.items}
      />

      <footer>
        <Text as="p" variant="small" tone="muted">
          Last updated:{" "}
          <time dateTime={content.updatedAt}>{content.updatedAt}</time>
        </Text>
      </footer>
    </article>
  );
}
