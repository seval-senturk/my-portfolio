"use client";

import { useState } from "react";

import { saveProjectSeoAction } from "@/features/admin/actions/seo.actions";
import { adminTr } from "@/features/admin/i18n/tr";
import {
  seoRecordToFormInitial,
  SeoFieldsForm,
} from "@/features/admin/seo/components/seo-fields-form";
import type { SeoMetadataRecord } from "@/types/seo-management";

interface ProjectSeoEntry {
  id: string;
  title: string;
  slug: string;
  seo: SeoMetadataRecord | null;
}

interface SeoProjectsEditorProps {
  projects: ProjectSeoEntry[];
}

export function SeoProjectsEditor({ projects }: SeoProjectsEditorProps) {
  const [activeId, setActiveId] = useState(projects[0]?.id ?? "");
  const active = projects.find((project) => project.id === activeId) ?? projects[0];

  if (!active) {
    return <p className="text-small text-muted-foreground">{adminTr.seo.projects.noProjects}</p>;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
      <aside className="admin-surface rounded-xl border p-3">
        <ul className="space-y-1">
          {projects.map((project) => (
            <li key={project.id}>
              <button
                type="button"
                onClick={() => setActiveId(project.id)}
                className={`w-full rounded-lg px-3 py-2 text-left text-small transition-base ${
                  project.id === activeId
                    ? "bg-muted font-medium text-foreground"
                    : "text-muted-foreground hover:bg-muted/60"
                }`}
              >
                {project.title}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <div className="admin-surface rounded-xl border p-6">
        <div className="mb-4">
          <h3 className="text-body font-semibold">{active.title}</h3>
          <p className="text-caption text-muted-foreground">{adminTr.seo.projects.slugLabel}: {active.slug}</p>
        </div>
        <SeoFieldsForm
          key={active.id}
          action={saveProjectSeoAction}
          hiddenFields={{ entityId: active.id }}
          initial={seoRecordToFormInitial(active.seo ?? undefined)}
        />
      </div>
    </div>
  );
}
