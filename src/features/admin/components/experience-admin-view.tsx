"use client";

import { Pencil, Plus, Trash2 } from "lucide-react";
import { useMemo, useState, useTransition } from "react";

import {
  deleteExperienceAction,
  saveExperienceAction,
} from "@/features/admin/actions/content.actions";
import { AdminConfirmDialog } from "@/features/admin/ui/modal/admin-confirm-dialog";
import { AdminFormStatus } from "@/features/admin/components/admin-form-status";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { adminTr } from "@/features/admin/i18n/tr";
import {
  AdminDataTable,
  type AdminTableColumn,
  AdminFormSection,
  AdminModal,
  AdminSwitchField,
  AdminTextField,
  AdminTextareaField,
} from "@/features/admin/ui";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface ExperienceAdminRow {
  id: string;
  company: string;
  position: string;
  employmentType: string;
  location: string;
  startMonth: number;
  startYear: number;
  endMonth?: number | null;
  endYear?: number | null;
  current: boolean;
  summary: string;
  responsibilities: string[];
  achievements: string[];
  technologies: string[];
}

interface ExperienceAdminViewProps {
  entries: ExperienceAdminRow[];
}

export function ExperienceAdminView({ entries }: ExperienceAdminViewProps) {
  const [rows, setRows] = useState(entries);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<ExperienceAdminRow | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [status, setStatus] = useState<{ error?: string; success?: string }>({});
  const [isPending, startTransition] = useTransition();

  const columns = useMemo<AdminTableColumn<ExperienceAdminRow>[]>(
    () => [
      {
        id: "position",
        header: adminTr.experience.columns.role,
        sortValue: (row) => row.position,
        accessor: (row) => (
          <div>
            <p className="font-medium">{row.position}</p>
            <p className="text-caption text-muted-foreground">{row.company}</p>
          </div>
        ),
      },
      {
        id: "location",
        header: adminTr.experience.columns.location,
        sortValue: (row) => row.location,
        accessor: (row) => row.location,
      },
      {
        id: "type",
        header: adminTr.experience.columns.type,
        accessor: (row) => row.employmentType,
      },
      {
        id: "status",
        header: adminTr.experience.columns.status,
        accessor: (row) => (
          <Badge variant={row.current ? "accent" : "outline"}>
            {row.current ? adminTr.experience.current : adminTr.experience.past}
          </Badge>
        ),
      },
    ],
    [],
  );

  function openCreate() {
    setSelected(null);
    setIsModalOpen(true);
  }

  function openEdit(row: ExperienceAdminRow) {
    setSelected(row);
    setIsModalOpen(true);
  }

  function openDelete(row: ExperienceAdminRow) {
    setDeleteId(row.id);
    setIsDeleteOpen(true);
  }

  return (
    <div>
      <AdminPageHeader
        title={adminTr.experience.title}
        description={adminTr.experience.description}
        actions={
          <Button type="button" variant="primary" leftIcon={<Plus className="h-4 w-4" />} onClick={openCreate}>
            {adminTr.experience.add}
          </Button>
        }
      />

      <AdminFormStatus error={status.error} success={status.success} />

      <AdminDataTable
        data={rows}
        columns={columns}
        searchPlaceholder={adminTr.experience.search}
        searchFilter={(row, query) =>
          `${row.company} ${row.position} ${row.location}`.toLowerCase().includes(query)
        }
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

      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selected ? adminTr.experience.edit : adminTr.experience.add}
        description={adminTr.experience.editDesc}
        size="lg"
        footer={
          <Button
            type="submit"
            form="experience-admin-form"
            variant="primary"
            isLoading={isPending}
          >
            {adminTr.experience.saveEntry}
          </Button>
        }
      >
        <form
          id="experience-admin-form"
          className="space-y-4"
          action={(formData) => {
            if (selected) formData.set("id", selected.id);
            startTransition(async () => {
              const result = await saveExperienceAction(formData);
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
          <AdminFormSection title={adminTr.experience.sections.roleDetails}>
            <div className="grid gap-4 md:grid-cols-2">
              <AdminTextField id="company" name="company" label="Company" defaultValue={selected?.company} required />
              <AdminTextField id="position" name="position" label="Position" defaultValue={selected?.position} required />
              <AdminTextField id="employmentType" name="employmentType" label="Employment type" defaultValue={selected?.employmentType ?? "Full-time"} />
              <AdminTextField id="location" name="location" label="Location" defaultValue={selected?.location} required />
              <AdminTextField id="startMonth" name="startMonth" label="Start month" type="number" min={1} max={12} defaultValue={selected?.startMonth ?? 1} />
              <AdminTextField id="startYear" name="startYear" label="Start year" type="number" defaultValue={selected?.startYear ?? new Date().getFullYear()} />
              <AdminTextField id="endMonth" name="endMonth" label="End month" type="number" min={1} max={12} defaultValue={selected?.endMonth ?? undefined} />
              <AdminTextField id="endYear" name="endYear" label="End year" type="number" defaultValue={selected?.endYear ?? undefined} />
            </div>
            <AdminSwitchField id="current" name="current" label="Current role" defaultChecked={selected?.current ?? false} />
            <AdminTextareaField id="summary" name="summary" label="Summary" defaultValue={selected?.summary} required />
            <AdminTextareaField
              id="responsibilities"
              name="responsibilities"
              label="Responsibilities (one per line)"
              defaultValue={selected?.responsibilities.join("\n")}
            />
            <AdminTextareaField
              id="achievements"
              name="achievements"
              label="Achievements (one per line)"
              defaultValue={selected?.achievements.join("\n")}
            />
            <AdminTextField
              id="technologies"
              name="technologies"
              label="Technologies (comma-separated)"
              defaultValue={selected?.technologies.join(", ")}
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
            const result = await deleteExperienceAction(deleteId);
            if (result.success) {
              setRows((current) => current.filter((row) => row.id !== deleteId));
              setStatus({ success: adminTr.common.deleted });
            } else {
              setStatus({ error: result.error });
            }
            setIsDeleteOpen(false);
          });
        }}
        title={adminTr.experience.deleteTitle}
        description={adminTr.experience.deleteDesc}
        confirmLabel={adminTr.common.delete}
        variant="danger"
        isLoading={isPending}
      />
    </div>
  );
}
