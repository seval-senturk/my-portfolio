"use client";

import { useState, useTransition } from "react";

import { saveResumeAction } from "@/features/admin/actions/content.actions";
import { AdminFormStatus } from "@/features/admin/components/admin-form-status";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import {
  AdminFormActions,
  AdminFormSection,
  AdminTextField,
  AdminTextareaField,
} from "@/features/admin/ui";
import { Button } from "@/components/ui/button";

interface ResumeAdminViewProps {
  initial: {
    sectionTitle: string;
    sectionDescription: string;
    profileSummary: string;
    profileTitle: string;
    profileLocation: string;
    contentUpdatedAt: string;
  };
}

export function ResumeAdminView({ initial }: ResumeAdminViewProps) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ error?: string; success?: string }>({});

  return (
    <div>
      <AdminPageHeader
        title="Resume"
        description="Manage resume center section content and profile summary."
      />

      <form
        action={(formData) => {
          startTransition(async () => {
            const result = await saveResumeAction(formData);
            setStatus(
              result.success
                ? { success: "Resume content saved successfully." }
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
          />
          <AdminTextareaField
            id="sectionDescription"
            name="sectionDescription"
            label="Section description"
            defaultValue={initial.sectionDescription}
          />
          <AdminTextField
            id="contentUpdatedAt"
            name="contentUpdatedAt"
            label="Last updated (YYYY-MM-DD)"
            defaultValue={initial.contentUpdatedAt}
          />
        </AdminFormSection>

        <AdminFormSection title="Profile snapshot">
          <AdminTextField
            id="profileTitle"
            name="profileTitle"
            label="Professional title"
            defaultValue={initial.profileTitle}
          />
          <AdminTextField
            id="profileLocation"
            name="profileLocation"
            label="Location"
            defaultValue={initial.profileLocation}
          />
          <AdminTextareaField
            id="profileSummary"
            name="profileSummary"
            label="Profile summary"
            defaultValue={initial.profileSummary}
          />
        </AdminFormSection>

        <AdminFormStatus error={status.error} success={status.success} />

        <AdminFormActions>
          <Button type="submit" variant="primary" isLoading={isPending}>
            Save Resume
          </Button>
        </AdminFormActions>
      </form>
    </div>
  );
}
