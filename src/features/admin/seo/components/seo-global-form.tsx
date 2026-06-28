"use client";

import { useState, useTransition } from "react";

import type { SeoGlobalSettingsRecord } from "@/types/seo-management";
import { AdminFormStatus } from "@/features/admin/components/admin-form-status";
import { adminTr } from "@/features/admin/i18n/tr";
import {
  AdminFormSection,
  AdminSwitchField,
  AdminTextField,
  AdminTextareaField,
} from "@/features/admin/ui";
import { Button } from "@/components/ui/button";

interface SeoGlobalFormProps {
  initial: SeoGlobalSettingsRecord;
  action: (formData: FormData) => Promise<{ success: boolean; error?: string; message?: string }>;
}

export function SeoGlobalForm({ initial, action }: SeoGlobalFormProps) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ error?: string; success?: string }>({});

  return (
    <form
      action={(formData) => {
        startTransition(async () => {
          const result = await action(formData);
          setStatus(
            result.success
              ? { success: adminTr.common.saved }
              : { error: result.error ?? adminTr.common.saveFailed },
          );
        });
      }}
      className="admin-surface space-y-6 rounded-xl border p-6"
    >
      <AdminFormSection title={adminTr.seo.global.sections.identity}>
        <AdminTextField id="siteTitle" name="siteTitle" label="Site title" defaultValue={initial.siteTitle} />
        <AdminTextareaField
          id="siteDescription"
          name="siteDescription"
          label="Site description"
          defaultValue={initial.siteDescription}
        />
        <AdminTextField
          id="defaultAuthorName"
          name="defaultAuthorName"
          label="Default author"
          defaultValue={initial.defaultAuthorName}
        />
        <AdminTextField
          id="defaultKeywords"
          name="defaultKeywords"
          label="Default keywords"
          defaultValue={initial.defaultKeywords.join(", ")}
          hint="Comma-separated."
        />
        <AdminTextField
          id="titleTemplate"
          name="titleTemplate"
          label="Title template"
          defaultValue={initial.titleTemplate}
          hint="Use %s for page title and %siteName% for site name."
        />
      </AdminFormSection>

      <AdminFormSection title={adminTr.seo.global.sections.urls}>
        <AdminTextField
          id="siteUrlOverride"
          name="siteUrlOverride"
          label="Site URL override"
          defaultValue={initial.siteUrlOverride ?? ""}
        />
        <AdminTextField
          id="defaultLanguage"
          name="defaultLanguage"
          label="Default language"
          defaultValue={initial.defaultLanguage}
        />
        <AdminTextField
          id="faviconPath"
          name="faviconPath"
          label="Favicon path"
          defaultValue={initial.faviconPath}
        />
      </AdminFormSection>

      <AdminFormSection title={adminTr.seo.global.sections.social}>
        <AdminTextField
          id="defaultOgImageUrl"
          name="defaultOgImageUrl"
          label="Default OG image URL"
          defaultValue={initial.defaultOgImageUrl ?? ""}
        />
        <AdminTextField
          id="defaultTwitterImageUrl"
          name="defaultTwitterImageUrl"
          label="Default Twitter image URL"
          defaultValue={initial.defaultTwitterImageUrl ?? ""}
        />
        <AdminTextField
          id="twitterHandle"
          name="twitterHandle"
          label="Twitter handle"
          defaultValue={initial.twitterHandle ?? ""}
        />
      </AdminFormSection>

      <AdminFormSection title={adminTr.seo.global.sections.robots}>
        <AdminSwitchField
          id="defaultRobotsIndex"
          name="defaultRobotsIndex"
          label="Allow indexing by default"
          defaultChecked={initial.defaultRobotsIndex}
        />
        <AdminSwitchField
          id="defaultRobotsFollow"
          name="defaultRobotsFollow"
          label="Allow following links by default"
          defaultChecked={initial.defaultRobotsFollow}
        />
      </AdminFormSection>

      <AdminFormStatus error={status.error} success={status.success} />
      <div className="flex justify-end">
        <Button type="submit" variant="primary" isLoading={isPending}>
          {adminTr.seo.global.save}
        </Button>
      </div>
    </form>
  );
}
