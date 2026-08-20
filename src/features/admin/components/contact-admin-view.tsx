"use client";

import { useState, useTransition } from "react";

import type { SocialPlatform } from "@/config/social-links.config";
import { saveContactConfigAction } from "@/features/admin/actions/content.actions";
import { AdminSectionHeaderFields } from "@/features/admin/components/admin-section-header-fields";
import { AdminFormStatus } from "@/features/admin/components/admin-form-status";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { adminTr } from "@/features/admin/i18n/tr";
import {
  AdminFormActions,
  AdminFormSection,
  AdminSwitchField,
  AdminTextField,
  AdminTextareaField,
} from "@/features/admin/ui";
import type { ContactConfigInput } from "@/types/contact";

const SOCIAL_PLATFORMS: SocialPlatform[] = [
  "linkedin",
  "github",
  "instagram",
  "whatsapp",
  "email",
  "x",
];

const SOCIAL_ROW_COUNT = 6;

interface ContactAdminViewProps {
  initial: ContactConfigInput;
}

export function ContactAdminView({ initial }: ContactAdminViewProps) {
  const [status, setStatus] = useState<{ error?: string; success?: string }>({});
  const [isPending, startTransition] = useTransition();

  const socialRows = Array.from({ length: SOCIAL_ROW_COUNT }, (_, index) => {
    return (
      initial.socialLinks[index] ?? {
        id: `contact-social-${index}`,
        platform: "linkedin" as SocialPlatform,
        label: "",
        href: "",
        visible: false,
        sortOrder: index,
      }
    );
  });

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await saveContactConfigAction(formData);
      setStatus(
        result.success
          ? { success: adminTr.common.saved }
          : { error: result.error ?? adminTr.common.saveFailed },
      );
    });
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={adminTr.contact.title}
        description={adminTr.contact.description}
      />

      <form action={handleSubmit} className="space-y-6">
        <AdminFormSection
          title={adminTr.contact.sections.header}
          description={adminTr.contact.sections.headerDesc}
        >
          <AdminSwitchField
            id="sectionVisible"
            name="sectionVisible"
            label={adminTr.contact.fields.sectionVisible}
            defaultChecked={initial.sectionVisible}
          />
          <AdminSectionHeaderFields
            idPrefix="contact"
            labels={{
              label: "Üst etiket",
              title: "Ana başlık",
              titleAccent: "Vurgulu başlık",
              description: "Açıklama",
            }}
            values={{
              label: initial.sectionLabel,
              title: initial.sectionTitle,
              titleAccent: initial.sectionTitleAccent,
              description: initial.sectionDescription,
            }}
            labelFieldName="sectionLabel"
          />
        </AdminFormSection>

        <AdminFormSection
          title={adminTr.contact.sections.information}
          description={adminTr.contact.sections.informationDesc}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <AdminTextField
              id="email"
              name="email"
              label={adminTr.contact.fields.email}
              defaultValue={initial.email}
            />
            <AdminTextField
              id="phone"
              name="phone"
              label={adminTr.contact.fields.phone}
              defaultValue={initial.phone}
            />
            <AdminTextField
              id="location"
              name="location"
              label={adminTr.contact.fields.location}
              defaultValue={initial.location}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <AdminTextField
              id="infoEmailLabel"
              name="infoEmailLabel"
              label={adminTr.contact.fields.emailLabel}
              defaultValue={initial.infoLabels.email.label}
            />
            <AdminTextField
              id="infoPhoneLabel"
              name="infoPhoneLabel"
              label={adminTr.contact.fields.phoneLabel}
              defaultValue={initial.infoLabels.phone.label}
            />
            <AdminTextField
              id="infoLocationLabel"
              name="infoLocationLabel"
              label={adminTr.contact.fields.locationLabel}
              defaultValue={initial.infoLabels.location.label}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <AdminSwitchField
              id="emailVisible"
              name="emailVisible"
              label={adminTr.contact.fields.emailVisible}
              defaultChecked={initial.infoLabels.email.visible}
            />
            <AdminSwitchField
              id="phoneVisible"
              name="phoneVisible"
              label={adminTr.contact.fields.phoneVisible}
              defaultChecked={initial.infoLabels.phone.visible}
            />
            <AdminSwitchField
              id="locationVisible"
              name="locationVisible"
              label={adminTr.contact.fields.locationVisible}
              defaultChecked={initial.infoLabels.location.visible}
            />
          </div>
        </AdminFormSection>

        <AdminFormSection
          title={adminTr.contact.sections.form}
          description={adminTr.contact.sections.formDesc}
        >
          {(["name", "email", "phone", "projectType", "message"] as const).map((field) => {
            const fieldConfig = initial.formConfig[field];

            return (
              <div
                key={field}
                className="grid gap-3 rounded-xl border border-border p-4 md:grid-cols-[1fr_1fr_auto_auto]"
              >
                <AdminTextField
                  id={`${field}Placeholder`}
                  name={`${field}Placeholder`}
                  label={`${field} ${adminTr.contact.fields.placeholder}`}
                  defaultValue={fieldConfig.placeholder}
                />
                <AdminTextField
                  id={`${field}Label`}
                  name={`${field}Label`}
                  label={`${field} ${adminTr.contact.fields.fieldLabel}`}
                  defaultValue={fieldConfig.label}
                />
                <AdminSwitchField
                  id={`${field}Enabled`}
                  name={`${field}Enabled`}
                  label={adminTr.contact.fields.fieldEnabled}
                  defaultChecked={fieldConfig.enabled}
                />
                <AdminSwitchField
                  id={`${field}Required`}
                  name={`${field}Required`}
                  label={adminTr.contact.fields.fieldRequired}
                  defaultChecked={fieldConfig.required}
                />
              </div>
            );
          })}

          <AdminTextField
            id="submitLabel"
            name="submitLabel"
            label={adminTr.contact.fields.submitLabel}
            defaultValue={initial.formConfig.submitLabel}
          />

          <div className="grid gap-4 md:grid-cols-2">
            {initial.formConfig.projectTypeOptions.map((option, index) => (
              <AdminTextField
                key={option.id}
                id={`projectTypeOption_${index}`}
                name={`projectTypeOption_${index}`}
                label={`${adminTr.contact.fields.projectTypeOption} ${index + 1}`}
                defaultValue={option.label}
              />
            ))}
          </div>
        </AdminFormSection>

        <AdminFormSection
          title={adminTr.contact.sections.security}
          description={adminTr.contact.sections.securityDesc}
        >
          <AdminSwitchField
            id="securityNoteVisible"
            name="securityNoteVisible"
            label={adminTr.contact.fields.securityVisible}
            defaultChecked={initial.formConfig.securityNote.visible}
          />
          <AdminTextField
            id="securityNoteText"
            name="securityNoteText"
            label={adminTr.contact.fields.securityText}
            defaultValue={initial.formConfig.securityNote.text}
          />
        </AdminFormSection>

        <AdminFormSection
          title={adminTr.contact.sections.social}
          description={adminTr.contact.sections.socialDesc}
        >
          <div className="space-y-4">
            {socialRows.map((row, index) => (
              <div
                key={row.id}
                className="grid gap-3 rounded-xl border border-border p-4 md:grid-cols-[140px_1fr_1fr_auto]"
              >
                <input type="hidden" name={`social_${index}_id`} value={row.id} />
                <input type="hidden" name={`social_${index}_sortOrder`} value={String(index)} />
                <label className="flex flex-col gap-1 text-small">
                  <span className="font-medium text-foreground">
                    {adminTr.contact.fields.socialPlatform}
                  </span>
                  <select
                    name={`social_${index}_platform`}
                    defaultValue={row.platform}
                    className="h-10 rounded-lg border border-border bg-surface px-3 text-body"
                  >
                    <option value="">—</option>
                    {SOCIAL_PLATFORMS.map((platform) => (
                      <option key={platform} value={platform}>
                        {platform}
                      </option>
                    ))}
                  </select>
                </label>
                <AdminTextField
                  id={`social_${index}_label`}
                  name={`social_${index}_label`}
                  label={adminTr.contact.fields.socialLabel}
                  defaultValue={row.label}
                />
                <AdminTextField
                  id={`social_${index}_href`}
                  name={`social_${index}_href`}
                  label={adminTr.contact.fields.socialHref}
                  defaultValue={row.href}
                />
                <label className="flex items-end gap-2 pb-2 text-small">
                  <input
                    type="checkbox"
                    name={`social_${index}_visible`}
                    defaultChecked={row.visible}
                    className="h-4 w-4 rounded border-border"
                  />
                  <span>{adminTr.contact.fields.socialVisible}</span>
                </label>
              </div>
            ))}
          </div>
        </AdminFormSection>

        <AdminFormSection
          title={adminTr.contact.sections.messages}
          description={adminTr.contact.sections.messagesDesc}
        >
          <AdminTextField
            id="successTitle"
            name="successTitle"
            label={adminTr.contact.fields.successTitle}
            defaultValue={initial.messagesConfig.successTitle}
          />
          <AdminTextareaField
            id="successMessage"
            name="successMessage"
            label={adminTr.contact.fields.successMessage}
            defaultValue={initial.messagesConfig.successMessage}
          />
          <AdminTextField
            id="errorTitle"
            name="errorTitle"
            label={adminTr.contact.fields.errorTitle}
            defaultValue={initial.messagesConfig.errorTitle}
          />
          <AdminTextareaField
            id="errorMessage"
            name="errorMessage"
            label={adminTr.contact.fields.errorMessage}
            defaultValue={initial.messagesConfig.errorMessage}
          />
          <AdminTextField
            id="loadingLabel"
            name="loadingLabel"
            label={adminTr.contact.fields.loadingLabel}
            defaultValue={initial.messagesConfig.loadingLabel}
          />
        </AdminFormSection>

        <AdminFormStatus error={status.error} success={status.success} />
        <input type="hidden" name="website" value={initial.website} />
        <input type="hidden" name="linkedin" value={initial.linkedin} />
        <input type="hidden" name="github" value={initial.github} />
        <input type="hidden" name="availabilityStatus" value={initial.availabilityStatus} />
        <input type="hidden" name="responseTime" value={initial.responseTime} />
        <input type="hidden" name="calendarUrl" value={initial.calendarUrl} />
        <input type="hidden" name="resumeHref" value={initial.resumeHref} />
        <input type="hidden" name="resumeLabel" value={initial.resumeLabel} />
        <AdminFormActions isPending={isPending} saveLabel={adminTr.contact.save} />
      </form>
    </div>
  );
}
