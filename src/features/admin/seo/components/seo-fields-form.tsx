"use client";

import { useState, useTransition, type ReactNode } from "react";

import { AdminFormStatus } from "@/features/admin/components/admin-form-status";
import {
  AdminFormSection,
  AdminSelectField,
  AdminTextField,
  AdminTextareaField,
} from "@/features/admin/ui";
import { Button } from "@/components/ui/button";

interface SeoFieldsFormProps {
  action: (formData: FormData) => Promise<{ success: boolean; error?: string; message?: string }>;
  hiddenFields?: Record<string, string>;
  initial: {
    metaTitle?: string;
    metaDescription?: string;
    canonicalUrl?: string;
    focusKeyword?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImageUrl?: string;
    ogImageAlt?: string;
    ogType?: string;
    twitterCardType?: string;
    twitterImageUrl?: string;
    keywords?: string;
    robotsIndex?: "inherit" | "true" | "false";
    robotsFollow?: "inherit" | "true" | "false";
    seoNotes?: string;
  };
  showSeoNotes?: boolean;
  children?: ReactNode;
}

export function SeoFieldsForm({
  action,
  hiddenFields,
  initial,
  showSeoNotes = false,
  children,
}: SeoFieldsFormProps) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ error?: string; success?: string }>({});

  return (
    <form
      action={(formData) => {
        startTransition(async () => {
          const result = await action(formData);
          setStatus(
            result.success
              ? { success: "Saved successfully." }
              : { error: result.error ?? "Save failed." },
          );
        });
      }}
      className="space-y-6"
    >
      {hiddenFields
        ? Object.entries(hiddenFields).map(([key, value]) => (
            <input key={key} type="hidden" name={key} value={value} />
          ))
        : null}

      <AdminFormSection title="Meta">
        <AdminTextField
          id="metaTitle"
          name="metaTitle"
          label="Meta title"
          defaultValue={initial.metaTitle}
          hint="Recommended: up to 70 characters."
        />
        <AdminTextareaField
          id="metaDescription"
          name="metaDescription"
          label="Meta description"
          defaultValue={initial.metaDescription}
          hint="Recommended: up to 160 characters."
        />
        <AdminTextField
          id="focusKeyword"
          name="focusKeyword"
          label="Focus keyword"
          defaultValue={initial.focusKeyword}
        />
        <AdminTextField
          id="keywords"
          name="keywords"
          label="Keywords"
          defaultValue={initial.keywords}
          hint="Comma-separated."
        />
        <AdminTextField
          id="canonicalUrl"
          name="canonicalUrl"
          label="Canonical URL"
          defaultValue={initial.canonicalUrl}
        />
      </AdminFormSection>

      <AdminFormSection title="Open Graph">
        <AdminTextField id="ogTitle" name="ogTitle" label="OG title" defaultValue={initial.ogTitle} />
        <AdminTextareaField
          id="ogDescription"
          name="ogDescription"
          label="OG description"
          defaultValue={initial.ogDescription}
        />
        <AdminTextField
          id="ogImageUrl"
          name="ogImageUrl"
          label="OG image URL"
          defaultValue={initial.ogImageUrl}
        />
        <AdminTextField
          id="ogImageAlt"
          name="ogImageAlt"
          label="OG image alt text"
          defaultValue={initial.ogImageAlt}
        />
        <AdminSelectField
          id="ogType"
          name="ogType"
          label="OG type"
          defaultValue={initial.ogType ?? "website"}
          options={[
            { value: "website", label: "Website" },
            { value: "article", label: "Article" },
            { value: "profile", label: "Profile" },
          ]}
        />
      </AdminFormSection>

      <AdminFormSection title="Twitter / X">
        <AdminSelectField
          id="twitterCardType"
          name="twitterCardType"
          label="Card type"
          defaultValue={initial.twitterCardType ?? "SUMMARY_LARGE_IMAGE"}
          options={[
            { value: "SUMMARY", label: "Summary" },
            { value: "SUMMARY_LARGE_IMAGE", label: "Summary Large Image" },
          ]}
        />
        <AdminTextField
          id="twitterImageUrl"
          name="twitterImageUrl"
          label="Twitter image URL"
          defaultValue={initial.twitterImageUrl}
        />
      </AdminFormSection>

      <AdminFormSection title="Robots">
        <AdminSelectField
          id="robotsIndex"
          name="robotsIndex"
          label="Index"
          defaultValue={initial.robotsIndex ?? "inherit"}
          options={[
            { value: "inherit", label: "Inherit global default" },
            { value: "true", label: "Index" },
            { value: "false", label: "No Index" },
          ]}
        />
        <AdminSelectField
          id="robotsFollow"
          name="robotsFollow"
          label="Follow"
          defaultValue={initial.robotsFollow ?? "inherit"}
          options={[
            { value: "inherit", label: "Inherit global default" },
            { value: "true", label: "Follow" },
            { value: "false", label: "No Follow" },
          ]}
        />
      </AdminFormSection>

      {showSeoNotes ? (
        <AdminFormSection title="SEO Notes">
          <AdminTextareaField
            id="seoNotes"
            name="seoNotes"
            label="Internal SEO notes"
            defaultValue={initial.seoNotes}
          />
        </AdminFormSection>
      ) : null}

      {children}

      <AdminFormStatus error={status.error} success={status.success} />
      <div className="flex justify-end">
        <Button type="submit" variant="primary" isLoading={isPending}>
          Save SEO
        </Button>
      </div>
    </form>
  );
}

function keywordsToString(keywords?: string[] | null): string {
  return keywords?.join(", ") ?? "";
}

export function seoRecordToFormInitial(record?: {
  metaTitle?: string | null;
  metaDescription?: string | null;
  canonicalUrl?: string | null;
  focusKeyword?: string | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogImageUrl?: string | null;
  ogImageAlt?: string | null;
  ogType?: string | null;
  twitterImageUrl?: string | null;
  twitterCardType?: string | null;
  keywords?: string[] | null;
  robotsIndex?: boolean | null;
  robotsFollow?: boolean | null;
  seoNotes?: string | null;
}) {
  return {
    metaTitle: record?.metaTitle ?? "",
    metaDescription: record?.metaDescription ?? "",
    canonicalUrl: record?.canonicalUrl ?? "",
    focusKeyword: record?.focusKeyword ?? "",
    ogTitle: record?.ogTitle ?? "",
    ogDescription: record?.ogDescription ?? "",
    ogImageUrl: record?.ogImageUrl ?? "",
    ogImageAlt: record?.ogImageAlt ?? "",
    ogType: record?.ogType ?? "website",
    twitterCardType: record?.twitterCardType ?? "SUMMARY_LARGE_IMAGE",
    twitterImageUrl: record?.twitterImageUrl ?? "",
    keywords: keywordsToString(record?.keywords),
    robotsIndex:
      record?.robotsIndex == null
        ? ("inherit" as const)
        : record.robotsIndex
          ? ("true" as const)
          : ("false" as const),
    robotsFollow:
      record?.robotsFollow == null
        ? ("inherit" as const)
        : record.robotsFollow
          ? ("true" as const)
          : ("false" as const),
    seoNotes: record?.seoNotes ?? "",
  };
}
