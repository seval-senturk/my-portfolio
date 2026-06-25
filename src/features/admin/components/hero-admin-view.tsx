"use client";

import { useState, useTransition } from "react";

import { saveHeroAction } from "@/features/admin/actions/content.actions";
import { AdminFormStatus } from "@/features/admin/components/admin-form-status";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import {
  AdminFormActions,
  AdminFormSection,
  AdminTextField,
  AdminTextareaField,
  AdminUploadField,
} from "@/features/admin/ui";
import { Button } from "@/components/ui/button";

interface HeroAdminViewProps {
  initial: {
    eyebrow: string;
    headline: string;
    summary: string;
    technologyHighlightsTitle: string;
    primaryCtaLabel: string;
    primaryCtaHref: string;
    secondaryCtaLabel: string;
    secondaryCtaHref: string;
    profileImageUrl: string;
    profileImageAlt: string;
    profileInitials: string;
  };
}

export function HeroAdminView({ initial }: HeroAdminViewProps) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ error?: string; success?: string }>({});

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await saveHeroAction(formData);
      setStatus(
        result.success
          ? { success: "Hero content saved successfully." }
          : { error: result.error ?? "Failed to save hero content." },
      );
    });
  }

  return (
    <div>
      <AdminPageHeader
        title="Hero"
        description="Manage the homepage hero section — headline, summary, CTAs, and profile."
      />

      <form action={handleSubmit} className="space-y-6">
        <AdminFormSection title="Content" description="Primary hero messaging.">
          <AdminTextField
            id="eyebrow"
            name="eyebrow"
            label="Eyebrow"
            defaultValue={initial.eyebrow}
            required
          />
          <AdminTextField
            id="headline"
            name="headline"
            label="Headline"
            defaultValue={initial.headline}
            required
          />
          <AdminTextareaField
            id="summary"
            name="summary"
            label="Summary"
            defaultValue={initial.summary}
            required
          />
          <AdminTextField
            id="technologyHighlightsTitle"
            name="technologyHighlightsTitle"
            label="Technology section title"
            defaultValue={initial.technologyHighlightsTitle}
          />
        </AdminFormSection>

        <AdminFormSection title="Calls to action">
          <div className="grid gap-4 md:grid-cols-2">
            <AdminTextField
              id="primaryCtaLabel"
              name="primaryCtaLabel"
              label="Primary CTA label"
              defaultValue={initial.primaryCtaLabel}
              required
            />
            <AdminTextField
              id="primaryCtaHref"
              name="primaryCtaHref"
              label="Primary CTA link"
              defaultValue={initial.primaryCtaHref}
            />
            <AdminTextField
              id="secondaryCtaLabel"
              name="secondaryCtaLabel"
              label="Secondary CTA label"
              defaultValue={initial.secondaryCtaLabel}
            />
            <AdminTextField
              id="secondaryCtaHref"
              name="secondaryCtaHref"
              label="Secondary CTA link"
              defaultValue={initial.secondaryCtaHref}
            />
          </div>
        </AdminFormSection>

        <AdminFormSection title="Profile">
          <AdminUploadField
            id="profileImageUrl"
            name="profileImageUrl"
            label="Profile image URL"
            defaultValue={initial.profileImageUrl}
          />
          <div className="grid gap-4 md:grid-cols-2">
            <AdminTextField
              id="profileImageAlt"
              name="profileImageAlt"
              label="Profile image alt text"
              defaultValue={initial.profileImageAlt}
              required
            />
            <AdminTextField
              id="profileInitials"
              name="profileInitials"
              label="Profile initials"
              defaultValue={initial.profileInitials}
              required
            />
          </div>
        </AdminFormSection>

        <AdminFormStatus error={status.error} success={status.success} />

        <AdminFormActions>
          <Button type="submit" variant="primary" isLoading={isPending}>
            Save Hero
          </Button>
        </AdminFormActions>
      </form>
    </div>
  );
}
