"use client";

import { useTransition, useState } from "react";

import { saveAiCareerSeoAction } from "@/features/admin/actions/seo.actions";
import type { SeoAiCareerSettingsRecord } from "@/types/seo-management";
import { AdminFormStatus } from "@/features/admin/components/admin-form-status";
import { adminTr } from "@/features/admin/i18n/tr";
import {
  AdminFormSection,
  AdminTextField,
  AdminTextareaField,
} from "@/features/admin/ui";
import { Button } from "@/components/ui/button";

interface SeoAiCareerFormProps {
  initial: SeoAiCareerSettingsRecord;
}

export function SeoAiCareerForm({ initial }: SeoAiCareerFormProps) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ error?: string; success?: string }>({});

  return (
    <form
      action={(formData) => {
        startTransition(async () => {
          const result = await saveAiCareerSeoAction(formData);
          setStatus(
            result.success
              ? { success: adminTr.common.saved }
              : { error: result.error ?? adminTr.common.saveFailed },
          );
        });
      }}
      className="admin-surface space-y-6 rounded-xl border p-6"
    >
      <AdminFormSection title={adminTr.seo.aiCareer.sections.landing}>
        <AdminTextField
          id="landingMetaTitle"
          name="landingMetaTitle"
          label="Landing meta title"
          defaultValue={initial.landingMetaTitle ?? ""}
        />
        <AdminTextareaField
          id="landingDescription"
          name="landingDescription"
          label="Landing description"
          defaultValue={initial.landingDescription ?? ""}
        />
        <AdminTextField
          id="landingKeywords"
          name="landingKeywords"
          label="Landing keywords"
          defaultValue={initial.landingKeywords.join(", ")}
        />
        <AdminTextField
          id="ogImageUrl"
          name="ogImageUrl"
          label="OG image URL"
          defaultValue={initial.ogImageUrl ?? ""}
        />
      </AdminFormSection>

      <AdminFormSection title={adminTr.seo.aiCareer.sections.tool}>
        <AdminTextField
          id="toolMetaTitle"
          name="toolMetaTitle"
          label="Tool meta title"
          defaultValue={initial.toolMetaTitle ?? ""}
        />
        <AdminTextareaField
          id="toolDescription"
          name="toolDescription"
          label="Tool description"
          defaultValue={initial.toolDescription ?? ""}
        />
      </AdminFormSection>

      <AdminFormSection title={adminTr.seo.aiCareer.sections.structured}>
        <AdminTextareaField
          id="faqSchemaJson"
          name="faqSchemaJson"
          label="FAQ schema JSON"
          defaultValue={
            initial.faqSchemaJson ? JSON.stringify(initial.faqSchemaJson, null, 2) : ""
          }
          hint='Example: {"mainEntity":[{"@type":"Question","name":"...","acceptedAnswer":{"@type":"Answer","text":"..."}}]}'
        />
        <AdminTextareaField
          id="featureSchemaJson"
          name="featureSchemaJson"
          label="Feature schema JSON"
          defaultValue={
            initial.featureSchemaJson
              ? JSON.stringify(initial.featureSchemaJson, null, 2)
              : ""
          }
        />
      </AdminFormSection>

      <AdminFormStatus error={status.error} success={status.success} />
      <div className="flex justify-end">
        <Button type="submit" variant="primary" isLoading={isPending}>
          {adminTr.seo.saveAiCareer}
        </Button>
      </div>
    </form>
  );
}
