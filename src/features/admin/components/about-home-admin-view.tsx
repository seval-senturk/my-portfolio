"use client";

import { useState, useTransition } from "react";

import { saveAboutHomeConfigAction } from "@/features/admin/actions/content.actions";
import { AboutHomeItemsAdminSection } from "@/features/admin/components/about-home-items-admin-section";
import { AdminFormStatus } from "@/features/admin/components/admin-form-status";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { adminTr } from "@/features/admin/i18n/tr";
import {
  AdminFormActions,
  AdminFormSection,
  AdminSwitchField,
  AdminTextField,
  AdminTextareaField,
} from "@/features/admin/ui";
import { Button } from "@/components/ui/button";
import type { AboutHomeContent } from "@/types/about-home";

interface AboutHomeAdminViewProps {
  config: AboutHomeContent;
  embedded?: boolean;
}

export function AboutHomeAdminView({
  config,
  embedded = false,
}: AboutHomeAdminViewProps) {
  const [status, setStatus] = useState<{ error?: string; success?: string }>({});
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await saveAboutHomeConfigAction(formData);
      setStatus(
        result.success
          ? { success: adminTr.common.saved }
          : { error: result.error ?? adminTr.common.saveFailed },
      );
    });
  }

  return (
    <div className="space-y-8">
      {!embedded ? (
        <AdminPageHeader
          title={adminTr.aboutHome.title}
          description={adminTr.aboutHome.description}
        />
      ) : null}

      <form action={handleSubmit} className="space-y-6">
        <AdminFormSection
          title={adminTr.aboutHome.sections.config}
          description={adminTr.aboutHome.sections.configDesc}
        >
          <AdminSwitchField
            id="visible"
            name="visible"
            label={adminTr.aboutHome.fields.visible}
            defaultChecked={config.section.visible}
          />
          <AdminTextField
            id="sectionLabel"
            name="sectionLabel"
            label={adminTr.aboutHome.fields.sectionLabel}
            defaultValue={config.section.label}
          />
          <AdminTextareaField
            id="title"
            name="title"
            label={adminTr.aboutHome.fields.title}
            defaultValue={config.section.title}
            rows={3}
            hint={adminTr.aboutHome.fields.titleHint}
          />
          <AdminTextField
            id="titleAccent"
            name="titleAccent"
            label={adminTr.aboutHome.fields.titleAccent}
            defaultValue={config.section.titleAccent ?? ""}
            hint={adminTr.aboutHome.fields.titleAccentHint}
          />
          <AdminTextareaField
            id="description"
            name="description"
            label={adminTr.aboutHome.fields.description}
            defaultValue={config.section.description}
            rows={4}
            hint={adminTr.aboutHome.fields.descriptionHint}
          />
        </AdminFormSection>

        <AdminFormSection
          title={adminTr.aboutHome.sections.cta}
          description={adminTr.aboutHome.sections.ctaDesc}
        >
          <AdminTextField
            id="ctaLabel"
            name="ctaLabel"
            label={adminTr.aboutHome.fields.ctaLabel}
            defaultValue={config.cta.label}
          />
          <AdminTextField
            id="ctaHref"
            name="ctaHref"
            label={adminTr.aboutHome.fields.ctaHref}
            defaultValue={config.cta.href}
          />
          <AdminSwitchField
            id="ctaVisible"
            name="ctaVisible"
            label={adminTr.aboutHome.fields.ctaVisible}
            defaultChecked={config.cta.visible}
          />
        </AdminFormSection>

        <AdminFormStatus error={status.error} success={status.success} />

        <AdminFormActions>
          <Button type="submit" variant="primary" isLoading={isPending}>
            {adminTr.aboutHome.saveSection}
          </Button>
        </AdminFormActions>
      </form>

      <AdminFormSection
        title={adminTr.aboutHome.sections.featureCards}
        description={adminTr.aboutHome.sections.featureCardsDesc}
      >
        <AboutHomeItemsAdminSection initialFeatureCards={[...config.featureCards]} />
      </AdminFormSection>
    </div>
  );
}
