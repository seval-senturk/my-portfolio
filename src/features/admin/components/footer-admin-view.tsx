"use client";

import { useState, useTransition } from "react";

import { saveFooterAction } from "@/features/admin/actions/content.actions";
import { AdminFormStatus } from "@/features/admin/components/admin-form-status";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
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
import type { SiteFooterContent } from "@/types/footer";

interface FooterAdminViewProps {
  config: SiteFooterContent;
  socialLinks: Array<{
    platform: string;
    label: string;
    href: string;
    visible: boolean;
  }>;
}

export function FooterAdminView({ config, socialLinks }: FooterAdminViewProps) {
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
          title={adminTr.footer.sections.newsletter}
          description={adminTr.footer.sections.newsletterDesc}
        >
          <AdminSwitchField
            id="newsletterEnabled"
            name="newsletterEnabled"
            label={adminTr.footer.fields.newsletterEnabled}
            defaultChecked={config.newsletter.enabled}
          />
          <AdminTextField
            id="newsletterLabel"
            name="newsletterLabel"
            label={adminTr.footer.fields.newsletterLabel}
            defaultValue={config.newsletter.label}
          />
          <AdminTextField
            id="newsletterTitle"
            name="newsletterTitle"
            label={adminTr.footer.fields.newsletterTitle}
            defaultValue={config.newsletter.title}
          />
          <AdminTextareaField
            id="newsletterDescription"
            name="newsletterDescription"
            label={adminTr.footer.fields.newsletterDescription}
            defaultValue={config.newsletter.description ?? ""}
            rows={3}
          />
          <AdminTextField
            id="newsletterPlaceholder"
            name="newsletterPlaceholder"
            label={adminTr.footer.fields.newsletterPlaceholder}
            defaultValue={config.newsletter.placeholder}
          />
          <AdminTextField
            id="newsletterButtonText"
            name="newsletterButtonText"
            label={adminTr.footer.fields.newsletterButtonText}
            defaultValue={config.newsletter.buttonText}
          />
        </AdminFormSection>

        <AdminFormSection
          title={adminTr.footer.sections.contact}
          description={adminTr.footer.sections.contactDesc}
        >
          <AdminTextField
            id="phone"
            name="phone"
            label={adminTr.footer.fields.phone}
            defaultValue={config.contact.phone ?? ""}
          />
          <AdminTextField
            id="email"
            name="email"
            label={adminTr.footer.fields.email}
            defaultValue={config.contact.email ?? ""}
          />
          <AdminTextField
            id="address"
            name="address"
            label={adminTr.footer.fields.address}
            defaultValue={config.contact.address ?? ""}
          />
        </AdminFormSection>

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
            id="copyright"
            name="copyright"
            label={adminTr.footer.fields.copyright}
            defaultValue={config.brand.copyright}
          />
        </AdminFormSection>

        <AdminFormSection
          title={adminTr.footer.sections.scrollToTop}
          description={adminTr.footer.sections.scrollToTopDesc}
        >
          <AdminSwitchField
            id="scrollToTopEnabled"
            name="scrollToTopEnabled"
            label={adminTr.footer.fields.scrollToTopEnabled}
            defaultChecked={config.scrollToTop.enabled}
          />
        </AdminFormSection>

        <AdminFormStatus error={status.error} success={status.success} />

        <AdminFormActions>
          <Button type="submit" variant="primary" isLoading={isPending}>
            {adminTr.footer.save}
          </Button>
        </AdminFormActions>
      </form>

      <FooterSocialAdminSection initialLinks={socialLinks} />
    </div>
  );
}
