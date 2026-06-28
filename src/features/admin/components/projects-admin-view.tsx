"use client";

import { Pencil, Plus, Trash2 } from "lucide-react";
import { useMemo, useState, useTransition } from "react";

import {
  deleteProjectAction,
  saveProjectAction,
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
  AdminUploadField,
} from "@/features/admin/ui";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface ProjectAdminRow {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  category: string;
  status?: string | null;
  client?: string | null;
  role: string;
  featured: boolean;
  coverImageUrl?: string | null;
  githubUrl?: string | null;
  liveUrl?: string | null;
  technologies: string[];
  highlights: string[];
}

interface ProjectsAdminViewProps {
  entries: ProjectAdminRow[];
}

export function ProjectsAdminView({ entries }: ProjectsAdminViewProps) {
  const [rows, setRows] = useState(entries);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<ProjectAdminRow | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [status, setStatus] = useState<{ error?: string; success?: string }>({});
  const [isPending, startTransition] = useTransition();

  const columns = useMemo<AdminTableColumn<ProjectAdminRow>[]>(
    () => [
      {
        id: "title",
        header: adminTr.projects.columns.project,
        sortValue: (row) => row.title,
        accessor: (row) => (
          <div>
            <p className="font-medium">{row.title}</p>
            <p className="text-caption text-muted-foreground">{row.slug}</p>
          </div>
        ),
      },
      { id: "category", header: adminTr.projects.columns.category, sortValue: (row) => row.category, accessor: (row) => row.category },
      {
        id: "featured",
        header: adminTr.projects.columns.featured,
        accessor: (row) => (
          <Badge variant={row.featured ? "accent" : "outline"}>
            {row.featured ? adminTr.common.yes : adminTr.common.no}
          </Badge>
        ),
      },
    ],
    [],
  );

  return (
    <div>
      <AdminPageHeader
        title={adminTr.projects.title}
        description={adminTr.projects.description}
        actions={
          <Button type="button" variant="primary" leftIcon={<Plus className="h-4 w-4" />} onClick={() => { setSelected(null); setIsModalOpen(true); }}>
            {adminTr.projects.add}
          </Button>
        }
      />

      <AdminFormStatus error={status.error} success={status.success} />

      <AdminDataTable
        data={rows}
        columns={columns}
        searchFilter={(row, query) =>
          `${row.title} ${row.category} ${row.slug}`.toLowerCase().includes(query)
        }
        rowActions={(row) => (
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => { setSelected(row); setIsModalOpen(true); }}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => { setDeleteId(row.id); setIsDeleteOpen(true); }}>
              <Trash2 className="h-4 w-4 text-error" />
            </Button>
          </div>
        )}
      />

      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selected ? adminTr.projects.edit : adminTr.projects.add}
        size="xl"
        footer={
          <Button type="submit" form="project-admin-form" variant="primary" isLoading={isPending}>
            {adminTr.projects.saveProject}
          </Button>
        }
      >
        <form
          id="project-admin-form"
          className="space-y-4"
          action={(formData) => {
            if (selected) formData.set("id", selected.id);
            startTransition(async () => {
              const result = await saveProjectAction(formData);
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
          <AdminFormSection title={adminTr.projects.sections.details}>
            <div className="grid gap-4 md:grid-cols-2">
              <AdminTextField id="title" name="title" label="Title" defaultValue={selected?.title} required />
              <AdminTextField id="slug" name="slug" label="Slug" defaultValue={selected?.slug} required />
              <AdminTextField id="category" name="category" label="Category" defaultValue={selected?.category} required />
              <AdminTextField id="status" name="status" label="Status" defaultValue={selected?.status ?? undefined} />
              <AdminTextField id="role" name="role" label="Role" defaultValue={selected?.role} required />
              <AdminTextField id="client" name="client" label="Client" defaultValue={selected?.client ?? undefined} />
            </div>
            <AdminSwitchField id="featured" name="featured" label={adminTr.projects.featuredLabel} defaultChecked={selected?.featured ?? false} />
            <AdminTextareaField id="shortDescription" name="shortDescription" label="Short description" defaultValue={selected?.shortDescription} required />
            <AdminTextareaField id="longDescription" name="longDescription" label="Long description" defaultValue={selected?.longDescription} required />
            <AdminUploadField id="coverImageUrl" name="coverImageUrl" label="Cover image URL" defaultValue={selected?.coverImageUrl ?? undefined} />
            <AdminTextField id="githubUrl" name="githubUrl" label="GitHub URL" defaultValue={selected?.githubUrl ?? undefined} />
            <AdminTextField id="liveUrl" name="liveUrl" label="Live URL" defaultValue={selected?.liveUrl ?? undefined} />
            <AdminTextField id="technologies" name="technologies" label="Technologies (comma-separated)" defaultValue={selected?.technologies.join(", ")} />
            <AdminTextareaField id="highlights" name="highlights" label="Highlights (one per line)" defaultValue={selected?.highlights.join("\n")} />
          </AdminFormSection>
        </form>
      </AdminModal>

      <AdminConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={() => {
          if (!deleteId) return;
          startTransition(async () => {
            const result = await deleteProjectAction(deleteId);
            if (result.success) {
              setRows((current) => current.filter((row) => row.id !== deleteId));
              setStatus({ success: adminTr.common.deleted });
            } else {
              setStatus({ error: result.error });
            }
            setIsDeleteOpen(false);
          });
        }}
        title={adminTr.projects.deleteTitle}
        description={adminTr.projects.deleteDesc}
        confirmLabel={adminTr.common.delete}
        variant="danger"
        isLoading={isPending}
      />
    </div>
  );
}
