"use client";

import { useState } from "react";

import {
  EducationHomeAdminView,
  type EducationHomeAdminRow,
  type EducationHomeConfigRow,
} from "@/features/admin/components/education-home-admin-view";
import {
  ExperienceAdminView,
  type ExperienceAdminRow,
  type ExperiencePageConfigRow,
} from "@/features/admin/components/experience-admin-view";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { adminTr } from "@/features/admin/i18n/tr";
import { cn } from "@/lib/cn";

type CareerJourneyTab = "experience" | "education";

interface CareerJourneyUnifiedAdminViewProps {
  experienceConfig: ExperiencePageConfigRow;
  experienceEntries: ExperienceAdminRow[];
  educationConfig: EducationHomeConfigRow;
  educationEntries: EducationHomeAdminRow[];
}

export function CareerJourneyUnifiedAdminView({
  experienceConfig,
  experienceEntries,
  educationConfig,
  educationEntries,
}: CareerJourneyUnifiedAdminViewProps) {
  const [activeTab, setActiveTab] = useState<CareerJourneyTab>("experience");

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title={adminTr.careerJourney.title}
        description={adminTr.careerJourney.description}
      />

      <div
        className="inline-flex rounded-xl border border-border bg-surface p-1"
        role="tablist"
        aria-label={adminTr.careerJourney.tabs.label}
      >
        {(
          [
            { id: "experience" as const, label: adminTr.careerJourney.tabs.experience },
            { id: "education" as const, label: adminTr.careerJourney.tabs.education },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            className={cn(
              "rounded-lg px-4 py-2 text-small font-medium transition-base",
              activeTab === tab.id
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "experience" ? (
        <ExperienceAdminView
          config={experienceConfig}
          entries={experienceEntries}
          embedded
        />
      ) : (
        <EducationHomeAdminView
          config={educationConfig}
          entries={educationEntries}
          embedded
        />
      )}
    </div>
  );
}
