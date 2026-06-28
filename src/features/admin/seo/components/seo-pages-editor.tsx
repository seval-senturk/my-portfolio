"use client";

import { useState } from "react";

import { savePageSeoAction } from "@/features/admin/actions/seo.actions";
import { adminTr } from "@/features/admin/i18n/tr";
import {
  seoRecordToFormInitial,
  SeoFieldsForm,
} from "@/features/admin/seo/components/seo-fields-form";
import type { SeoPageRecord } from "@/types/seo-management";

interface SeoPagesEditorProps {
  pages: SeoPageRecord[];
}

export function SeoPagesEditor({ pages }: SeoPagesEditorProps) {
  const [activeKey, setActiveKey] = useState(pages[0]?.pageKey ?? "home");
  const activePage = pages.find((page) => page.pageKey === activeKey) ?? pages[0];

  if (!activePage) {
    return <p className="text-small text-muted-foreground">{adminTr.seo.pages.noPages}</p>;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
      <aside className="admin-surface rounded-xl border p-3">
        <ul className="space-y-1">
          {pages.map((page) => (
            <li key={page.pageKey}>
              <button
                type="button"
                onClick={() => setActiveKey(page.pageKey)}
                className={`w-full rounded-lg px-3 py-2 text-left text-small transition-base ${
                  page.pageKey === activeKey
                    ? "bg-muted font-medium text-foreground"
                    : "text-muted-foreground hover:bg-muted/60"
                }`}
              >
                {page.label}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <div className="admin-surface rounded-xl border p-6">
        <div className="mb-4">
          <h3 className="text-body font-semibold">{activePage.label}</h3>
          <p className="text-caption text-muted-foreground">{activePage.routePath}</p>
        </div>
        <SeoFieldsForm
          key={activePage.pageKey}
          action={savePageSeoAction}
          hiddenFields={{ pageKey: activePage.pageKey }}
          initial={seoRecordToFormInitial(activePage)}
        />
      </div>
    </div>
  );
}
