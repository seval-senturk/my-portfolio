"use client";

import { useState, useTransition } from "react";

import type { SocialPlatform } from "@/config/social-links.config";
import { saveFooterSocialLinksAction } from "@/features/admin/actions/content.actions";
import { AdminFormStatus } from "@/features/admin/components/admin-form-status";
import { adminTr } from "@/features/admin/i18n/tr";
import {
  AdminFormActions,
  AdminFormSection,
  AdminTextField,
} from "@/features/admin/ui";
import { Button } from "@/components/ui/button";

const PLATFORMS: SocialPlatform[] = [
  "linkedin",
  "github",
  "x",
  "instagram",
  "dribbble",
  "behance",
  "medium",
  "email",
];

interface FooterSocialAdminSectionProps {
  initialLinks: Array<{
    platform: string;
    label: string;
    href: string;
    visible: boolean;
  }>;
}

const ROW_COUNT = 6;

export function FooterSocialAdminSection({
  initialLinks,
}: FooterSocialAdminSectionProps) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ error?: string; success?: string }>({});

  const rows = Array.from({ length: ROW_COUNT }, (_, index) => {
    return initialLinks[index] ?? {
      platform: "",
      label: "",
      href: "",
      visible: true,
    };
  });

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await saveFooterSocialLinksAction(formData);
      setStatus(
        result.success
          ? { success: adminTr.common.saved }
          : { error: result.error ?? adminTr.common.saveFailed },
      );
    });
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <AdminFormSection
        title={adminTr.footer.sections.social}
        description={adminTr.footer.sections.socialDesc}
      >
        <div className="space-y-4">
          {rows.map((row, index) => (
            <div
              key={index}
              className="grid gap-3 rounded-xl border border-border p-4 md:grid-cols-[140px_1fr_1fr_auto]"
            >
              <label className="flex flex-col gap-1 text-small">
                <span className="font-medium text-foreground">
                  {adminTr.footer.fields.socialPlatform}
                </span>
                <select
                  name={`social_${index}_platform`}
                  defaultValue={row.platform}
                  className="h-10 rounded-lg border border-border bg-surface px-3 text-body"
                >
                  <option value="">—</option>
                  {PLATFORMS.map((platform) => (
                    <option key={platform} value={platform}>
                      {platform}
                    </option>
                  ))}
                </select>
              </label>
              <AdminTextField
                id={`social_${index}_label`}
                name={`social_${index}_label`}
                label={adminTr.footer.fields.socialLabel}
                defaultValue={row.label}
              />
              <AdminTextField
                id={`social_${index}_href`}
                name={`social_${index}_href`}
                label={adminTr.footer.fields.socialHref}
                defaultValue={row.href}
              />
              <label className="flex items-end gap-2 pb-2 text-small">
                <input
                  type="checkbox"
                  name={`social_${index}_visible`}
                  defaultChecked={row.visible}
                  className="h-4 w-4 rounded border-border"
                />
                <span>{adminTr.footer.fields.socialVisible}</span>
              </label>
            </div>
          ))}
        </div>
      </AdminFormSection>

      <AdminFormStatus error={status.error} success={status.success} />

      <AdminFormActions>
        <Button type="submit" variant="primary" isLoading={isPending}>
          {adminTr.footer.saveSocial}
        </Button>
      </AdminFormActions>
    </form>
  );
}
