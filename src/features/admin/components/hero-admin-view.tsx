"use client";

import { useState, useTransition } from "react";

import { saveHeroAction } from "@/features/admin/actions/content.actions";
import { AdminFormStatus } from "@/features/admin/components/admin-form-status";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { adminTr } from "@/features/admin/i18n/tr";
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
          ? { success: adminTr.common.saved }
          : { error: result.error ?? adminTr.common.saveFailed },
      );
    });
  }

  return (
    <div>
      <AdminPageHeader title={adminTr.hero.title} description={adminTr.hero.description} />

      <form action={handleSubmit} className="space-y-6">
        <AdminFormSection title={adminTr.hero.sections.content} description={adminTr.hero.sections.contentDesc}>
          <AdminTextField
            id="eyebrow"
            name="eyebrow"
            label={adminTr.hero.fields.eyebrow}
            defaultValue={initial.eyebrow}
          />
          <AdminTextField
            id="headline"
            name="headline"
            label={adminTr.hero.fields.headline}
            defaultValue={initial.headline}
          />
          <AdminTextareaField
            id="summary"
            name="summary"
            label={adminTr.hero.fields.summary}
            defaultValue={initial.summary}
          />
          <AdminTextField
            id="technologyHighlightsTitle"
            name="technologyHighlightsTitle"
            label={adminTr.hero.fields.techTitle}
            defaultValue={initial.technologyHighlightsTitle}
          />
        </AdminFormSection>

        <AdminFormSection title={adminTr.hero.sections.cta}>
          <div className="grid gap-4 md:grid-cols-2">
            <AdminTextField
              id="primaryCtaLabel"
              name="primaryCtaLabel"
              label={adminTr.hero.fields.primaryCtaLabel}
              defaultValue={initial.primaryCtaLabel}
            />
            <AdminTextField
              id="primaryCtaHref"
              name="primaryCtaHref"
              label={adminTr.hero.fields.primaryCtaHref}
              defaultValue={initial.primaryCtaHref}
            />
            <AdminTextField
              id="secondaryCtaLabel"
              name="secondaryCtaLabel"
              label={adminTr.hero.fields.secondaryCtaLabel}
              defaultValue={initial.secondaryCtaLabel}
            />
            <AdminTextField
              id="secondaryCtaHref"
              name="secondaryCtaHref"
              label={adminTr.hero.fields.secondaryCtaHref}
              defaultValue={initial.secondaryCtaHref}
            />
          </div>
        </AdminFormSection>

        <AdminFormSection
          title={adminTr.hero.sections.profile}
          description={adminTr.hero.sections.profileDesc}
        >
          <AdminUploadField
            id="profileImageUrl"
            name="profileImageUrl"
            label={adminTr.hero.fields.profileImage}
            defaultValue={initial.profileImageUrl}
            accept="image/png,image/webp,image/jpeg"
            category="Hero"
          />
          <div className="grid gap-4 md:grid-cols-2">
            <AdminTextField
              id="profileImageAlt"
              name="profileImageAlt"
              label={adminTr.hero.fields.profileAlt}
              defaultValue={initial.profileImageAlt}
            />
            <AdminTextField
              id="profileInitials"
              name="profileInitials"
              label={adminTr.hero.fields.profileInitials}
              defaultValue={initial.profileInitials}
            />
          </div>
        </AdminFormSection>

        <AdminFormStatus error={status.error} success={status.success} />

        <AdminFormActions>
          <Button type="submit" variant="primary" isLoading={isPending}>
            {adminTr.hero.save}
          </Button>
        </AdminFormActions>
      </form>
    </div>
  );
}
