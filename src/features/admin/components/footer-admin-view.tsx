"use client";

import { useState, useTransition } from "react";

import { saveFooterAction } from "@/features/admin/actions/content.actions";
import { AdminFormStatus } from "@/features/admin/components/admin-form-status";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { FooterLinksAdminSection } from "@/features/admin/components/footer-links-admin-section";
import { FooterSocialAdminSection } from "@/features/admin/components/footer-social-admin-section";
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
import type { FooterLinkItem, SiteFooterContent } from "@/types/footer";

interface FooterAdminViewProps {
  config: SiteFooterContent;
  navigationLinks: FooterLinkItem[];
  resourceLinks: FooterLinkItem[];
  socialLinks: Array<{
    platform: string;
    label: string;
    href: string;
    visible: boolean;
  }>;
}

export function FooterAdminView({
  config,
  navigationLinks,
  resourceLinks,
  socialLinks,
}: FooterAdminViewProps) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ error?: string; success?: string }>({});

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await saveFooterAction(formData);
      setStatus(
        result.success
          ? { success: adminTr.common.saved }
          : { error: result.error ?? adminTr.common.saveFailed },
      );
    });
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title={adminTr.footer.title}
        description={adminTr.footer.description}
      />

      <form action={handleSubmit} className="space-y-6">
        <AdminFormSection
          title={adminTr.footer.sections.brand}
          description={adminTr.footer.sections.brandDesc}
        >
          <AdminUploadField
            id="brandLogoUrl"
            name="brandLogoUrl"
            label={adminTr.footer.fields.brandLogoUrl}
            defaultValue={config.brand.logoUrl ?? undefined}
          />
          <AdminTextField
            id="brandName"
            name="brandName"
            label={adminTr.footer.fields.brandName}
            defaultValue={config.brand.siteName}
          />
          <AdminTextField
            id="brandRole"
            name="brandRole"
            label={adminTr.footer.fields.brandRole}
            defaultValue={config.brand.role}
          />
          <AdminTextareaField
            id="brandDescription"
            name="brandDescription"
            label={adminTr.footer.fields.brandDescription}
            defaultValue={config.brand.description}
            rows={3}
          />
        </AdminFormSection>

        <AdminFormSection
          title={adminTr.footer.sections.sectionLabels}
          description={adminTr.footer.sections.sectionLabelsDesc}
        >
          <AdminTextField
            id="navSectionLabel"
            name="navSectionLabel"
            label={adminTr.footer.fields.navSectionLabel}
            defaultValue={config.sectionLabels.navigation}
          />
          <AdminTextField
            id="resourcesSectionLabel"
            name="resourcesSectionLabel"
            label={adminTr.footer.fields.resourcesSectionLabel}
            defaultValue={config.sectionLabels.resources}
          />
          <AdminTextField
            id="connectSectionLabel"
            name="connectSectionLabel"
            label={adminTr.footer.fields.connectSectionLabel}
            defaultValue={config.sectionLabels.connect}
          />
        </AdminFormSection>

        <AdminFormSection
          title={adminTr.footer.sections.connect}
          description={adminTr.footer.sections.connectDesc}
        >
          <AdminTextField
            id="ctaTitle"
            name="ctaTitle"
            label={adminTr.footer.fields.ctaTitle}
            defaultValue={config.connect.title}
          />
          <AdminTextareaField
            id="ctaDescription"
            name="ctaDescription"
            label={adminTr.footer.fields.ctaDescription}
            defaultValue={config.connect.description}
            rows={2}
          />
          <AdminTextField
            id="ctaLabel"
            name="ctaLabel"
            label={adminTr.footer.fields.ctaLabel}
            defaultValue={config.connect.ctaLabel}
          />
          <AdminTextField
            id="ctaHref"
            name="ctaHref"
            label={adminTr.footer.fields.ctaHref}
            defaultValue={config.connect.ctaHref}
          />
        </AdminFormSection>

        <AdminFormSection
          title={adminTr.footer.sections.bottom}
          description={adminTr.footer.sections.bottomDesc}
        >
          <AdminTextField
            id="copyright"
            name="copyright"
            label={adminTr.footer.fields.copyright}
            defaultValue={config.bottom.copyright}
          />
          <AdminSwitchField
            id="scrollToTopEnabled"
            name="scrollToTopEnabled"
            label={adminTr.footer.fields.scrollToTopEnabled}
            defaultChecked={config.bottom.backToTopEnabled}
          />
          <AdminTextField
            id="scrollToTopLabel"
            name="scrollToTopLabel"
            label={adminTr.footer.fields.scrollToTopLabel}
            defaultValue={config.bottom.backToTopLabel}
          />
        </AdminFormSection>

        <AdminFormSection
          title={adminTr.footer.sections.decor}
          description={adminTr.footer.sections.decorDesc}
        >
          <AdminSwitchField
            id="orbitalDecorEnabled"
            name="orbitalDecorEnabled"
            label={adminTr.footer.fields.orbitalDecorEnabled}
            defaultChecked={config.decor.orbitalEnabled}
          />
        </AdminFormSection>

        <AdminFormStatus error={status.error} success={status.success} />

        <AdminFormActions>
          <Button type="submit" variant="primary" isLoading={isPending}>
            {adminTr.footer.save}
          </Button>
        </AdminFormActions>
      </form>

      <AdminFormSection
        title={adminTr.footer.sections.navigation}
        description={adminTr.footer.sections.navigationDesc}
      >
        <FooterLinksAdminSection
          kind="navigation"
          title={adminTr.footer.sections.navigation}
          description={adminTr.footer.sections.navigationDesc}
          initialLinks={navigationLinks}
        />
      </AdminFormSection>

      <AdminFormSection
        title={adminTr.footer.sections.resources}
        description={adminTr.footer.sections.resourcesDesc}
      >
        <FooterLinksAdminSection
          kind="resources"
          title={adminTr.footer.sections.resources}
          description={adminTr.footer.sections.resourcesDesc}
          initialLinks={resourceLinks}
        />
      </AdminFormSection>

      <FooterSocialAdminSection initialLinks={socialLinks} />
    </div>
  );
}
