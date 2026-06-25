"use client";

import { useState, useTransition } from "react";

import { saveAboutAction } from "@/features/admin/actions/content.actions";
import { AdminFormStatus } from "@/features/admin/components/admin-form-status";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
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
      <AdminPageHeader
        title="About"
        description="Edit about page section content, introduction, and professional story."
      />

      <form
        action={(formData) => {
          startTransition(async () => {
            const result = await saveAboutAction(formData);
            setStatus(
              result.success
                ? { success: "About content saved successfully." }
                : { error: result.error },
            );
          });
        }}
        className="space-y-6"
      >
        <AdminFormSection title="Section">
          <AdminTextField
            id="sectionTitle"
            name="sectionTitle"
            label="Section title"
            defaultValue={initial.sectionTitle}
            required
          />
          <AdminTextareaField
            id="sectionDescription"
            name="sectionDescription"
            label="Section description"
            defaultValue={initial.sectionDescription}
            required
          />
        </AdminFormSection>

        <AdminFormSection
          title="Introduction"
          description="Separate paragraphs with a blank line."
        >
          <AdminTextareaField
            id="introductionParagraphs"
            name="introductionParagraphs"
            label="Introduction paragraphs"
            defaultValue={initial.introductionParagraphs}
            required
          />
        </AdminFormSection>

        <AdminFormSection title="Professional story">
          <AdminTextField
            id="storyTitle"
            name="storyTitle"
            label="Story title"
            defaultValue={initial.storyTitle}
            required
          />
          <AdminTextareaField
            id="storyParagraphs"
            name="storyParagraphs"
            label="Story paragraphs"
            defaultValue={initial.storyParagraphs}
            required
          />
        </AdminFormSection>

        <AdminFormStatus error={status.error} success={status.success} />

        <AdminFormActions>
          <Button type="submit" variant="primary" isLoading={isPending}>
            Save About
          </Button>
        </AdminFormActions>
      </form>
    </div>
  );
}
