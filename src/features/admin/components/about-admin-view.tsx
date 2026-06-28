"use client";

import { useState, useTransition } from "react";

import { saveAboutAction } from "@/features/admin/actions/content.actions";
import { AdminFormStatus } from "@/features/admin/components/admin-form-status";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { adminTr } from "@/features/admin/i18n/tr";
import {
  AdminFormActions,
  AdminFormSection,
  AdminTextField,
  AdminTextareaField,
} from "@/features/admin/ui";
import { Button } from "@/components/ui/button";

interface AboutAdminViewProps {
  initial: {
    sectionTitle: string;
    sectionDescription: string;
    introductionParagraphs: string;
    storyTitle: string;
    storyParagraphs: string;
  };
}

export function AboutAdminView({ initial }: AboutAdminViewProps) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ error?: string; success?: string }>({});

  return (
    <div>
      <AdminPageHeader title={adminTr.about.title} description={adminTr.about.description} />

      <form
        action={(formData) => {
          startTransition(async () => {
            const result = await saveAboutAction(formData);
            setStatus(
              result.success
                ? { success: adminTr.common.saved }
                : { error: result.error },
            );
          });
        }}
        className="space-y-6"
      >
        <AdminFormSection title={adminTr.about.sections.section}>
          <AdminTextField
            id="sectionTitle"
            name="sectionTitle"
            label={adminTr.about.fields.sectionTitle}
            defaultValue={initial.sectionTitle}
            required
          />
          <AdminTextareaField
            id="sectionDescription"
            name="sectionDescription"
            label={adminTr.about.fields.sectionDescription}
            defaultValue={initial.sectionDescription}
            required
          />
        </AdminFormSection>

        <AdminFormSection
          title={adminTr.about.sections.introduction}
          description={adminTr.about.sections.introductionDesc}
        >
          <AdminTextareaField
            id="introductionParagraphs"
            name="introductionParagraphs"
            label={adminTr.about.fields.introductionParagraphs}
            defaultValue={initial.introductionParagraphs}
            required
          />
        </AdminFormSection>

        <AdminFormSection title={adminTr.about.sections.story}>
          <AdminTextField
            id="storyTitle"
            name="storyTitle"
            label={adminTr.about.fields.storyTitle}
            defaultValue={initial.storyTitle}
            required
          />
          <AdminTextareaField
            id="storyParagraphs"
            name="storyParagraphs"
            label={adminTr.about.fields.storyParagraphs}
            defaultValue={initial.storyParagraphs}
            required
          />
        </AdminFormSection>

        <AdminFormStatus error={status.error} success={status.success} />

        <AdminFormActions>
          <Button type="submit" variant="primary" isLoading={isPending}>
            {adminTr.about.save}
          </Button>
        </AdminFormActions>
      </form>
    </div>
  );
}
