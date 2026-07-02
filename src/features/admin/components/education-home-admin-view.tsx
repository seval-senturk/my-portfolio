"use client";

import { GripVertical, Pencil, Plus, Trash2 } from "lucide-react";
import { useMemo, useState, useTransition, type DragEvent } from "react";

import {
  deleteEducationHomeEntryAction,
  reorderEducationHomeEntriesAction,
  saveEducationHomeConfigAction,
  saveEducationHomeEntryAction,
} from "@/features/admin/actions/content.actions";
import { AdminConfirmDialog } from "@/features/admin/ui/modal/admin-confirm-dialog";
import { AdminFormStatus } from "@/features/admin/components/admin-form-status";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { adminTr } from "@/features/admin/i18n/tr";
import {
  AdminDataTable,
  type AdminTableColumn,
  AdminFormActions,
  AdminFormSection,
  AdminModal,
  AdminSwitchField,
  AdminTextField,
  AdminTextareaField,
} from "@/features/admin/ui";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface EducationHomeConfigRow {
  sectionLabel: string;
  sectionTitle: string;
  sectionDescription: string;
  sectionVisible: boolean;
}

export interface EducationHomeAdminRow {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  levelBadge: string;
  startMonth?: number | null;
  startYear: number;
  endMonth?: number | null;
  endYear?: number | null;
  description: string;
  technologies: string[];
  visible: boolean;
}

interface EducationHomeAdminViewProps {
  config: EducationHomeConfigRow;
  entries: EducationHomeAdminRow[];
  embedded?: boolean;
}

export function EducationHomeAdminView({
  config,
  entries,
  embedded = false,
}: EducationHomeAdminViewProps) {
  const [rows, setRows] = useState(entries);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<EducationHomeAdminRow | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [status, setStatus] = useState<{ error?: string; success?: string }>({});
  const [isPending, startTransition] = useTransition();
  const [isConfigPending, startConfigTransition] = useTransition();

  const columns = useMemo<AdminTableColumn<EducationHomeAdminRow>[]>(
    () => [
      {
        id: "order",
        header: "",
        accessor: (row) => (
          <button
            type="button"
            draggable
            onDragStart={() => setDraggingId(row.id)}
            onDragEnd={() => setDraggingId(null)}
            className="cursor-grab text-muted-foreground active:cursor-grabbing"
            aria-label={adminTr.educationHome.reorderHandle}
          >
            <GripVertical className="h-4 w-4" />
          </button>
        ),
      },
      {
        id: "degree",
        header: adminTr.educationHome.columns.degree,
        sortValue: (row) => row.degree,
        accessor: (row) => (
          <div>
            <p className="font-medium">{row.degree}</p>
            <p className="text-caption text-muted-foreground">{row.institution}</p>
          </div>
        ),
      },
      {
        id: "field",
        header: adminTr.educationHome.columns.field,
        sortValue: (row) => row.fieldOfStudy,
        accessor: (row) => row.fieldOfStudy || "—",
      },
      {
        id: "visible",
        header: adminTr.common.status,
        accessor: (row) => (
          <Badge variant={row.visible ? "accent" : "outline"}>
            {row.visible ? adminTr.common.yes : adminTr.common.no}
          </Badge>
        ),
      },
    ],
    [],
  );

  function handleDrop(targetId: string) {
    if (!draggingId || draggingId === targetId) return;

    const nextRows = [...rows];
    const fromIndex = nextRows.findIndex((row) => row.id === draggingId);
    const toIndex = nextRows.findIndex((row) => row.id === targetId);
    if (fromIndex < 0 || toIndex < 0) return;

    const [moved] = nextRows.splice(fromIndex, 1);
    nextRows.splice(toIndex, 0, moved!);
    setRows(nextRows);
    setDraggingId(null);

    startTransition(async () => {
      const result = await reorderEducationHomeEntriesAction(nextRows.map((row) => row.id));
      setStatus(
        result.success
          ? { success: adminTr.educationHome.reorderSaved }
          : { error: result.error ?? adminTr.common.saveFailed },
      );
    });
  }

  function openCreate() {
    setSelected(null);
    setIsModalOpen(true);
  }

  function openEdit(row: EducationHomeAdminRow) {
    setSelected(row);
    setIsModalOpen(true);
  }

  function openDelete(row: EducationHomeAdminRow) {
    setDeleteId(row.id);
    setIsDeleteOpen(true);
  }

  return (
    <div className="space-y-8">
      {!embedded ? (
        <AdminPageHeader
          title={adminTr.educationHome.title}
          description={adminTr.educationHome.description}
        />
      ) : null}

      <AdminFormStatus error={status.error} success={status.success} />

      <form
        action={(formData) => {
          startConfigTransition(async () => {
            const result = await saveEducationHomeConfigAction(formData);
            setStatus(
              result.success
                ? { success: adminTr.common.saved }
                : { error: result.error ?? adminTr.common.saveFailed },
            );
          });
        }}
        className="admin-surface space-y-6 rounded-xl border p-6"
      >
        <AdminFormSection
          title={adminTr.educationHome.sections.config}
          description={adminTr.educationHome.sections.configDesc}
        >
          <AdminTextField
            id="educationSectionLabel"
            name="sectionLabel"
            label={adminTr.educationHome.fields.sectionLabel}
            defaultValue={config.sectionLabel}
            required
          />
          <AdminTextField
            id="educationSectionTitle"
            name="sectionTitle"
            label={adminTr.educationHome.fields.sectionTitle}
            defaultValue={config.sectionTitle}
            required
          />
          <AdminTextareaField
            id="educationSectionDescription"
            name="sectionDescription"
            label={adminTr.educationHome.fields.sectionDescription}
            defaultValue={config.sectionDescription}
          />
          <AdminSwitchField
            id="educationSectionVisible"
            name="sectionVisible"
            label={adminTr.educationHome.fields.sectionVisible}
            defaultChecked={config.sectionVisible}
          />
        </AdminFormSection>

        <AdminFormActions>
          <Button type="submit" variant="primary" isLoading={isConfigPending}>
            {adminTr.educationHome.saveSection}
          </Button>
        </AdminFormActions>
      </form>

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-h4 text-foreground">{adminTr.educationHome.sections.entries}</h2>
            <p className="mt-1 text-small text-muted-foreground">
              {adminTr.educationHome.sections.entriesDesc}
            </p>
          </div>
          <Button
            type="button"
            variant="primary"
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={openCreate}
          >
            {adminTr.educationHome.add}
          </Button>
        </div>

        <AdminDataTable
          data={rows}
          columns={columns}
          searchPlaceholder={adminTr.educationHome.search}
          searchFilter={(row, query) =>
            `${row.institution} ${row.degree} ${row.fieldOfStudy}`.toLowerCase().includes(query)
          }
          getRowProps={(row) => ({
            onDragOver: (event: DragEvent<HTMLTableRowElement>) => {
              event.preventDefault();
            },
            onDrop: () => handleDrop(row.id),
            className: draggingId === row.id ? "opacity-50" : undefined,
          })}
          rowActions={(row) => (
            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => openEdit(row)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => openDelete(row)}>
                <Trash2 className="h-4 w-4 text-error" />
              </Button>
            </div>
          )}
        />
      </div>

      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selected ? adminTr.educationHome.edit : adminTr.educationHome.add}
        description={adminTr.educationHome.editDesc}
        size="lg"
        footer={
          <Button
            type="submit"
            form="education-home-admin-form"
            variant="primary"
            isLoading={isPending}
          >
            {adminTr.educationHome.saveEntry}
          </Button>
        }
      >
        <form
          id="education-home-admin-form"
          className="space-y-4"
          action={(formData) => {
            if (selected) formData.set("id", selected.id);
            startTransition(async () => {
              const result = await saveEducationHomeEntryAction(formData);
              if (result.success) {
                setIsModalOpen(false);
                setStatus({ success: adminTr.common.saved });
                window.location.reload();
              } else {
                setStatus({ error: result.error });
              }
            });
          }}
        >
          <AdminFormSection title={adminTr.educationHome.sections.entryDetails}>
            <div className="grid gap-4 md:grid-cols-2">
              <AdminTextField
                id="institution"
                name="institution"
                label={adminTr.educationHome.fields.institution}
                defaultValue={selected?.institution}
                required
              />
              <AdminTextField
                id="degree"
                name="degree"
                label={adminTr.educationHome.fields.degree}
                defaultValue={selected?.degree}
                required
              />
              <AdminTextField
                id="fieldOfStudy"
                name="fieldOfStudy"
                label={adminTr.educationHome.fields.fieldOfStudy}
                defaultValue={selected?.fieldOfStudy}
              />
              <AdminTextField
                id="levelBadge"
                name="levelBadge"
                label={adminTr.educationHome.fields.levelBadge}
                defaultValue={selected?.levelBadge}
              />
              <AdminTextField
                id="educationStartMonth"
                name="startMonth"
                label={adminTr.educationHome.fields.startMonth}
                type="number"
                min={1}
                max={12}
                defaultValue={selected?.startMonth ?? undefined}
              />
              <AdminTextField
                id="educationStartYear"
                name="startYear"
                label={adminTr.educationHome.fields.startYear}
                type="number"
                defaultValue={selected?.startYear ?? new Date().getFullYear()}
                required
              />
              <AdminTextField
                id="educationEndMonth"
                name="endMonth"
                label={adminTr.educationHome.fields.endMonth}
                type="number"
                min={1}
                max={12}
                defaultValue={selected?.endMonth ?? undefined}
              />
              <AdminTextField
                id="educationEndYear"
                name="endYear"
                label={adminTr.educationHome.fields.endYear}
                type="number"
                defaultValue={selected?.endYear ?? undefined}
              />
            </div>
            <AdminTextareaField
              id="educationDescription"
              name="description"
              label={adminTr.educationHome.fields.description}
              defaultValue={selected?.description}
              required
            />
            <AdminTextField
              id="educationTechnologies"
              name="technologies"
              label={adminTr.educationHome.fields.technologies}
              defaultValue={selected?.technologies.join(", ")}
            />
            <AdminSwitchField
              id="educationVisible"
              name="visible"
              label={adminTr.educationHome.fields.entryVisible}
              defaultChecked={selected?.visible ?? true}
            />
          </AdminFormSection>
        </form>
      </AdminModal>

      <AdminConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={() => {
          if (!deleteId) return;
          startTransition(async () => {
            const result = await deleteEducationHomeEntryAction(deleteId);
            if (result.success) {
              setRows((current) => current.filter((row) => row.id !== deleteId));
              setStatus({ success: adminTr.common.deleted });
            } else {
              setStatus({ error: result.error });
            }
            setIsDeleteOpen(false);
          });
        }}
        title={adminTr.educationHome.deleteTitle}
        description={adminTr.educationHome.deleteDesc}
        confirmLabel={adminTr.common.delete}
        variant="danger"
        isLoading={isPending}
      />
    </div>
  );
}
