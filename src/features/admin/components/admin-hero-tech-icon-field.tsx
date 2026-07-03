"use client";

import { useEffect, useState } from "react";

import { adminTr } from "@/features/admin/i18n/tr";
import { AdminFormField, AdminUploadField } from "@/features/admin/ui";
import {
  HERO_TECH_ICON_OPTIONS,
  HeroTechIcon,
  isHeroTechIconUrl,
} from "@/features/hero/config/hero-tech-icons.config";
import { cn } from "@/lib/cn";

type IconMode = "upload" | "preset";

interface AdminHeroTechIconFieldProps {
  defaultValue?: string;
  name?: string;
}

function resolveInitialMode(value: string): IconMode {
  if (!value || isHeroTechIconUrl(value)) {
    return "upload";
  }

  return HERO_TECH_ICON_OPTIONS.some((option) => option.value === value)
    ? "preset"
    : "upload";
}

export function AdminHeroTechIconField({
  defaultValue = "",
  name = "icon",
}: AdminHeroTechIconFieldProps) {
  const [mode, setMode] = useState<IconMode>(() => resolveInitialMode(defaultValue));
  const [iconValue, setIconValue] = useState(defaultValue);

  useEffect(() => {
    setIconValue(defaultValue);
    setMode(resolveInitialMode(defaultValue));
  }, [defaultValue]);

  return (
    <div className="space-y-3">
      <div className="inline-flex rounded-lg border border-border bg-muted/30 p-1">
        <button
          type="button"
          onClick={() => setMode("upload")}
          className={cn(
            "rounded-md px-3 py-1.5 text-small transition-colors",
            mode === "upload"
              ? "bg-surface text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {adminTr.hero.fields.techIconUploadTab}
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("preset");
            if (!iconValue || isHeroTechIconUrl(iconValue)) {
              setIconValue(HERO_TECH_ICON_OPTIONS[0]?.value ?? "react");
            }
          }}
          className={cn(
            "rounded-md px-3 py-1.5 text-small transition-colors",
            mode === "preset"
              ? "bg-surface text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {adminTr.hero.fields.techIconPresetTab}
        </button>
      </div>

      {mode === "upload" ? (
        <AdminUploadField
          id="techIconUpload"
          name={name}
          label={adminTr.hero.fields.techIcon}
          hint={adminTr.hero.fields.techIconUploadHint}
          defaultValue={isHeroTechIconUrl(iconValue) ? iconValue : ""}
          value={isHeroTechIconUrl(iconValue) ? iconValue : ""}
          onChange={setIconValue}
          accept="image/png,image/webp,image/jpeg,image/svg+xml"
          category="Hero"
          folderSlug="tech-icons"
        />
      ) : (
        <AdminFormField
          id="techIconPreset"
          label={adminTr.hero.fields.techIcon}
          hint={adminTr.hero.fields.techIconPresetHint}
        >
          <input type="hidden" name={name} value={iconValue} readOnly />
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
            {HERO_TECH_ICON_OPTIONS.map((option) => {
              const isSelected = iconValue === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  title={option.label}
                  aria-label={option.label}
                  aria-pressed={isSelected}
                  onClick={() => setIconValue(option.value)}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-lg border px-2 py-2 transition-colors",
                    isSelected
                      ? "border-accent bg-accent/10"
                      : "border-border bg-surface hover:border-accent/40",
                  )}
                >
                  <HeroTechIcon icon={option.value} />
                  <span className="max-w-full truncate text-[0.625rem] text-muted-foreground">
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>
        </AdminFormField>
      )}

      {iconValue ? (
        <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/20 px-3 py-2">
          <span className="text-small text-muted-foreground">
            {adminTr.hero.fields.techIconPreview}
          </span>
          <HeroTechIcon icon={iconValue} className="h-6 w-6" />
        </div>
      ) : null}
    </div>
  );
}
