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
    coreExpertiseTitle: string;
    coreExpertiseItems: string;
    workingPrinciplesTitle: string;
    workingPrinciplesItems: string;
    professionalHighlightsTitle: string;
    professionalHighlightsItems: string;
    personalValuesTitle: string;
    personalValuesItems: string;
  };
  embedded?: boolean;
}

export function AboutAdminView({ initial, embedded = false }: AboutAdminViewProps) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ error?: string; success?: string }>({});

  return (
    <div>
      {!embedded ? (
        <AdminPageHeader title={adminTr.about.title} description={adminTr.about.description} />
      ) : null}

      <form
        action={(formData) => {
          startTransition(async () => {
            const result = await saveAboutAction(formData);
            setStatus(
              result.success
                ? { success: adminTr.common.saved }
                : { error: result.error ?? adminTr.common.saveFailed },
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
            rows={6}
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
            rows={6}
            required
          />
        </AdminFormSection>

        <AdminFormSection
          title={adminTr.about.sections.coreExpertise}
          description={adminTr.about.sections.coreExpertiseDesc}
        >
          <AdminTextField
            id="coreExpertiseTitle"
            name="coreExpertiseTitle"
            label={adminTr.about.fields.sectionBlockTitle}
            defaultValue={initial.coreExpertiseTitle}
            required
          />
          <AdminTextareaField
            id="coreExpertiseItems"
            name="coreExpertiseItems"
            label={adminTr.about.fields.coreExpertiseItems}
            defaultValue={initial.coreExpertiseItems}
            rows={10}
            hint={adminTr.about.fields.expertiseItemsHint}
            required
          />
        </AdminFormSection>

        <AdminFormSection
          title={adminTr.about.sections.workingPrinciples}
          description={adminTr.about.sections.workingPrinciplesDesc}
        >
          <AdminTextField
            id="workingPrinciplesTitle"
            name="workingPrinciplesTitle"
            label={adminTr.about.fields.sectionBlockTitle}
            defaultValue={initial.workingPrinciplesTitle}
            required
          />
          <AdminTextareaField
            id="workingPrinciplesItems"
            name="workingPrinciplesItems"
            label={adminTr.about.fields.workingPrinciplesItems}
            defaultValue={initial.workingPrinciplesItems}
            rows={8}
            hint={adminTr.about.fields.simpleItemsHint}
            required
          />
        </AdminFormSection>

        <AdminFormSection
          title={adminTr.about.sections.professionalHighlights}
          description={adminTr.about.sections.professionalHighlightsDesc}
        >
          <AdminTextField
            id="professionalHighlightsTitle"
            name="professionalHighlightsTitle"
            label={adminTr.about.fields.sectionBlockTitle}
            defaultValue={initial.professionalHighlightsTitle}
            required
          />
          <AdminTextareaField
            id="professionalHighlightsItems"
            name="professionalHighlightsItems"
            label={adminTr.about.fields.professionalHighlightsItems}
            defaultValue={initial.professionalHighlightsItems}
            rows={6}
            hint={adminTr.about.fields.highlightsItemsHint}
            required
          />
        </AdminFormSection>

        <AdminFormSection
          title={adminTr.about.sections.personalValues}
          description={adminTr.about.sections.personalValuesDesc}
        >
          <AdminTextField
            id="personalValuesTitle"
            name="personalValuesTitle"
            label={adminTr.about.fields.sectionBlockTitle}
            defaultValue={initial.personalValuesTitle}
            required
          />
          <AdminTextareaField
            id="personalValuesItems"
            name="personalValuesItems"
            label={adminTr.about.fields.personalValuesItems}
            defaultValue={initial.personalValuesItems}
            rows={8}
            hint={adminTr.about.fields.simpleItemsHint}
            required
          />
        </AdminFormSection>

        <AdminFormStatus error={status.error} success={status.success} />

        <AdminFormActions>
          <Button type="submit" variant="primary" isLoading={isPending}>
            {adminTr.about.savePage}
          </Button>
        </AdminFormActions>
      </form>
    </div>
  );
}
