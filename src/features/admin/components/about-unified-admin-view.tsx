"use client";

import { useState } from "react";

import { AboutAdminView } from "@/features/admin/components/about-admin-view";
import { AboutHomeAdminView } from "@/features/admin/components/about-home-admin-view";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { adminTr } from "@/features/admin/i18n/tr";
import { cn } from "@/lib/cn";
import type { AboutHomeContent } from "@/types/about-home";

type AboutAdminTab = "home" | "page";

interface AboutUnifiedAdminViewProps {
  aboutHome: AboutHomeContent;
  aboutPage: {
    sectionTitle: string;
    sectionDescription: string;
    introductionParagraphs: string;
    storyTitle: string;
    storyParagraphs: string;
    coreExpertiseTitle: string;
    coreExpertiseItems: string;
    workingPrinciplesTitle: string;
    workingPrinciplesItems: string;
    professionalHighlightsTitle: string;
    professionalHighlightsItems: string;
    personalValuesTitle: string;
    personalValuesItems: string;
  };
}

export function AboutUnifiedAdminView({
  aboutHome,
  aboutPage,
}: AboutUnifiedAdminViewProps) {
  const [activeTab, setActiveTab] = useState<AboutAdminTab>("home");

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title={adminTr.about.title}
        description={adminTr.about.description}
      />

      <div
        className="inline-flex rounded-xl border border-border bg-surface p-1"
        role="tablist"
        aria-label={adminTr.about.tabs.label}
      >
        {(
          [
            { id: "home" as const, label: adminTr.about.tabs.homeSection },
            { id: "page" as const, label: adminTr.about.tabs.aboutPage },
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

      {activeTab === "home" ? (
        <AboutHomeAdminView config={aboutHome} embedded />
      ) : (
        <AboutAdminView initial={aboutPage} embedded />
      )}
    </div>
  );
}
