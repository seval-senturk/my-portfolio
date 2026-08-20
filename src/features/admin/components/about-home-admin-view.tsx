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
  AdminUploadField,
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
          <AdminTextField
            id="title"
            name="title"
            label={adminTr.aboutHome.fields.title}
            defaultValue={config.section.title}
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
          title={adminTr.aboutHome.sections.profile}
          description={adminTr.aboutHome.sections.profileDesc}
        >
          <AdminUploadField
            id="profileImageUrl"
            name="profileImageUrl"
            label={adminTr.aboutHome.fields.profileImage}
            defaultValue={config.profile.imageSrc ?? ""}
            accept="image/png,image/webp,image/jpeg"
            category="About"
          />
          <div className="grid gap-4 md:grid-cols-2">
            <AdminTextField
              id="profileImageAlt"
              name="profileImageAlt"
              label={adminTr.aboutHome.fields.profileAlt}
              defaultValue={config.profile.imageAlt}
            />
            <AdminTextField
              id="profileInitials"
              name="profileInitials"
              label={adminTr.aboutHome.fields.profileInitials}
              defaultValue={config.profile.initials}
            />
            <AdminSwitchField
              id="profileVisible"
              name="profileVisible"
              label={adminTr.aboutHome.fields.profileVisible}
              defaultChecked={config.profile.visible}
            />
          </div>
        </AdminFormSection>

        <AdminFormSection
          title={adminTr.aboutHome.sections.primaryCta}
          description={adminTr.aboutHome.sections.primaryCtaDesc}
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

        <AdminFormSection
          title={adminTr.aboutHome.sections.secondaryCta}
          description={adminTr.aboutHome.sections.secondaryCtaDesc}
        >
          <AdminTextField
            id="secondaryCtaLabel"
            name="secondaryCtaLabel"
            label={adminTr.aboutHome.fields.secondaryCtaLabel}
            defaultValue={config.secondaryCta.label}
          />
          <AdminTextField
            id="secondaryCtaHref"
            name="secondaryCtaHref"
            label={adminTr.aboutHome.fields.secondaryCtaHref}
            defaultValue={config.secondaryCta.href}
          />
          <AdminSwitchField
            id="secondaryCtaVisible"
            name="secondaryCtaVisible"
            label={adminTr.aboutHome.fields.secondaryCtaVisible}
            defaultChecked={config.secondaryCta.visible}
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
        title={adminTr.aboutHome.sections.infoCards}
        description={adminTr.aboutHome.sections.infoCardsDesc}
      >
        <AboutHomeItemsAdminSection initialFeatureCards={[...config.featureCards]} />
      </AdminFormSection>
    </div>
  );
}
