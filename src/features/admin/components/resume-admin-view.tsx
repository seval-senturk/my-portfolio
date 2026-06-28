"use client";

import { useState, useTransition } from "react";

import {
  saveResumeAction,
  uploadResumePdfAction,
} from "@/features/admin/actions/content.actions";
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
import type { ResumeFileInfo } from "@/services/admin/resume.admin.service";

interface ResumeAdminViewProps {
  initial: {
    sectionTitle: string;
    sectionDescription: string;
    profileSummary: string;
    profileTitle: string;
    profileLocation: string;
    contentUpdatedAt: string;
  };
  resumeFile: ResumeFileInfo | null;
}

export function ResumeAdminView({ initial, resumeFile }: ResumeAdminViewProps) {
  const [isPending, startTransition] = useTransition();
  const [pdfPending, startPdfTransition] = useTransition();
  const [status, setStatus] = useState<{ error?: string; success?: string }>({});
  const [pdfStatus, setPdfStatus] = useState<{ error?: string; success?: string }>({});

  return (
    <div className="space-y-8">
      <AdminPageHeader title={adminTr.resume.title} description={adminTr.resume.description} />

      <AdminFormSection title={adminTr.resume.sections.pdf}>
        {resumeFile ? (
          <p className="text-small text-muted-foreground">
            {adminTr.resume.currentPdf}:{" "}
            <a
              href={resumeFile.filePath}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline-offset-4 hover:underline"
            >
              {resumeFile.fileName}
            </a>
          </p>
        ) : (
          <p className="text-small text-warning">{adminTr.resume.noPdf}</p>
        )}

        <form
          action={(formData) => {
            startPdfTransition(async () => {
              const result = await uploadResumePdfAction(formData);
              setPdfStatus(
                result.success
                  ? { success: adminTr.common.saved }
                  : { error: result.error },
              );
            });
          }}
          className="space-y-4"
        >
          <AdminTextField
            id="resumePdfLabel"
            name="resumePdfLabel"
            label={adminTr.resume.fields.pdfLabel}
            defaultValue={resumeFile?.label ?? "English CV"}
          />
          <div>
            <label htmlFor="resumePdf" className="mb-2 block text-small font-medium">
              {adminTr.resume.fields.pdfFile}
            </label>
            <input
              id="resumePdf"
              name="resumePdf"
              type="file"
              accept="application/pdf,.pdf"
              required={!resumeFile}
              className="block w-full text-small"
            />
            <p className="mt-1 text-caption text-muted-foreground">{adminTr.resume.pdfHint}</p>
          </div>
          <AdminFormStatus error={pdfStatus.error} success={pdfStatus.success} />
          <Button type="submit" variant="secondary" isLoading={pdfPending}>
            {adminTr.resume.uploadPdf}
          </Button>
        </form>
      </AdminFormSection>

      <form
        action={(formData) => {
          startTransition(async () => {
            const result = await saveResumeAction(formData);
            setStatus(
              result.success
                ? { success: adminTr.common.saved }
                : { error: result.error },
            );
          });
        }}
        className="space-y-6"
      >
        <AdminFormSection title={adminTr.resume.sections.section}>
          <AdminTextField
            id="sectionTitle"
            name="sectionTitle"
            label={adminTr.resume.fields.sectionTitle}
            defaultValue={initial.sectionTitle}
          />
          <AdminTextareaField
            id="sectionDescription"
            name="sectionDescription"
            label={adminTr.resume.fields.sectionDescription}
            defaultValue={initial.sectionDescription}
          />
          <AdminTextField
            id="contentUpdatedAt"
            name="contentUpdatedAt"
            label={adminTr.resume.fields.contentUpdatedAt}
            defaultValue={initial.contentUpdatedAt}
          />
        </AdminFormSection>

        <AdminFormSection title={adminTr.resume.sections.profile}>
          <AdminTextField
            id="profileTitle"
            name="profileTitle"
            label={adminTr.resume.fields.profileTitle}
            defaultValue={initial.profileTitle}
          />
          <AdminTextField
            id="profileLocation"
            name="profileLocation"
            label={adminTr.resume.fields.profileLocation}
            defaultValue={initial.profileLocation}
          />
          <AdminTextareaField
            id="profileSummary"
            name="profileSummary"
            label={adminTr.resume.fields.profileSummary}
            defaultValue={initial.profileSummary}
          />
        </AdminFormSection>

        <AdminFormStatus error={status.error} success={status.success} />

        <AdminFormActions>
          <Button type="submit" variant="primary" isLoading={isPending}>
            {adminTr.resume.save}
          </Button>
        </AdminFormActions>
      </form>
    </div>
  );
}
