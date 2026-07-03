import type { ReactNode } from "react";

import type { SectionHeaderContent } from "@/types/section-header";
import {
  AdminTextField,
  AdminTextareaField,
} from "@/features/admin/ui";

export interface AdminSectionHeaderFieldLabels {
  label: string;
  title: string;
  titleAccent: string;
  titleAccentHint?: string;
  description: string;
}

export interface AdminSectionHeaderFieldsProps {
  idPrefix: string;
  labels: AdminSectionHeaderFieldLabels;
  values: SectionHeaderContent;
  /** Form field name for the label input. Defaults to `label`. About uses `sectionLabel`. */
  labelFieldName?: string;
  descriptionRows?: number;
  descriptionRequired?: boolean;
  /** Extra fields rendered before title (e.g. visible toggle, section number). */
  beforeTitle?: ReactNode;
  /** Extra fields rendered after description. */
  afterDescription?: ReactNode;
  /** When set, label and this node share a two-column row on md+. */
  labelRowEnd?: ReactNode;
  /** Place title and titleAccent side-by-side on md+. */
  titleFieldsInGrid?: boolean;
}

export function AdminSectionHeaderFields({
  idPrefix,
  labels,
  values,
  labelFieldName = "label",
  descriptionRows = 3,
  descriptionRequired = false,
  beforeTitle,
  afterDescription,
  labelRowEnd,
  titleFieldsInGrid = false,
}: AdminSectionHeaderFieldsProps) {
  const labelField = (
    <AdminTextField
      id={`${idPrefix}-label`}
      name={labelFieldName}
      label={labels.label}
      defaultValue={values.label}
      required
    />
  );

  const titleField = (
    <AdminTextField
      id={`${idPrefix}-title`}
      name="title"
      label={labels.title}
      defaultValue={values.title}
      required
    />
  );

  const titleAccentField = (
    <AdminTextField
      id={`${idPrefix}-title-accent`}
      name="titleAccent"
      label={labels.titleAccent}
      defaultValue={values.titleAccent ?? ""}
      hint={labels.titleAccentHint}
    />
  );

  return (
    <>
      {beforeTitle}

      {labelRowEnd ? (
        <div className="grid gap-4 md:grid-cols-2">
          {labelField}
          {labelRowEnd}
        </div>
      ) : (
        labelField
      )}

      {titleFieldsInGrid ? (
        <div className="grid gap-4 md:grid-cols-2">
          {titleField}
          {titleAccentField}
        </div>
      ) : (
        <>
          {titleField}
          {titleAccentField}
        </>
      )}

      <AdminTextareaField
        id={`${idPrefix}-description`}
        name="description"
        label={labels.description}
        defaultValue={values.description ?? ""}
        rows={descriptionRows}
        required={descriptionRequired}
      />

      {afterDescription}
    </>
  );
}
