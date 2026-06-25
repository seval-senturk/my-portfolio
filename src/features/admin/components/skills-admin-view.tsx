"use client";

import { Pencil, Plus, Trash2 } from "lucide-react";
import { useMemo, useState, useTransition } from "react";

import {
  deleteSkillAction,
  saveSkillAction,
} from "@/features/admin/actions/content.actions";
import { AdminConfirmDialog } from "@/features/admin/ui/modal/admin-confirm-dialog";
import { AdminFormStatus } from "@/features/admin/components/admin-form-status";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
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

export interface SkillAdminRow {
  id: string;
  name: string;
  category: string;
  description?: string | null;
  featured: boolean;
  yearsOfExperience?: number | null;
  proficiencyLevel?: string | null;
}

interface SkillsAdminViewProps {
  entries: SkillAdminRow[];
}

export function SkillsAdminView({ entries }: SkillsAdminViewProps) {
  const [rows, setRows] = useState(entries);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<SkillAdminRow | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [status, setStatus] = useState<{ error?: string; success?: string }>({});
  const [isPending, startTransition] = useTransition();

  const columns = useMemo<AdminTableColumn<SkillAdminRow>[]>(
    () => [
      { id: "name", header: "Skill", sortValue: (row) => row.name, accessor: (row) => row.name },
      { id: "category", header: "Category", sortValue: (row) => row.category, accessor: (row) => row.category },
      {
        id: "featured",
        header: "Featured",
        accessor: (row) => (
          <Badge variant={row.featured ? "accent" : "outline"}>
            {row.featured ? "Yes" : "No"}
          </Badge>
        ),
      },
    ],
    [],
  );

  return (
    <div>
      <AdminPageHeader
        title="Skills"
        description="Manage skills, categories, and proficiency metadata."
        actions={
          <Button type="button" variant="primary" leftIcon={<Plus className="h-4 w-4" />} onClick={() => { setSelected(null); setIsModalOpen(true); }}>
            Add Skill
          </Button>
        }
      />

      <AdminFormStatus error={status.error} success={status.success} />

      <AdminDataTable
        data={rows}
        columns={columns}
        searchFilter={(row, query) =>
          `${row.name} ${row.category}`.toLowerCase().includes(query)
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
        title={selected ? "Edit Skill" : "Add Skill"}
        size="lg"
        footer={
          <Button type="submit" form="skill-admin-form" variant="primary" isLoading={isPending}>
            Save Skill
          </Button>
        }
      >
        <form
          id="skill-admin-form"
          action={(formData) => {
            if (selected) formData.set("id", selected.id);
            startTransition(async () => {
              const result = await saveSkillAction(formData);
              if (result.success) {
                setIsModalOpen(false);
                setStatus({ success: "Skill saved." });
                window.location.reload();
              } else {
                setStatus({ error: result.error });
              }
            });
          }}
        >
          <AdminFormSection title="Skill details">
            <AdminTextField id="name" name="name" label="Name" defaultValue={selected?.name} required />
            <AdminTextField id="category" name="category" label="Category" defaultValue={selected?.category} required />
            <AdminTextareaField id="description" name="description" label="Description" defaultValue={selected?.description ?? undefined} />
            <AdminTextField id="yearsOfExperience" name="yearsOfExperience" label="Years of experience" type="number" defaultValue={selected?.yearsOfExperience ?? undefined} />
            <AdminTextField id="proficiencyLevel" name="proficiencyLevel" label="Proficiency level" defaultValue={selected?.proficiencyLevel ?? undefined} />
            <AdminSwitchField id="featured" name="featured" label="Featured skill" defaultChecked={selected?.featured ?? false} />
          </AdminFormSection>
        </form>
      </AdminModal>

      <AdminConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={() => {
          if (!deleteId) return;
          startTransition(async () => {
            const result = await deleteSkillAction(deleteId);
            if (result.success) {
              setRows((current) => current.filter((row) => row.id !== deleteId));
              setStatus({ success: "Skill deleted." });
            } else {
              setStatus({ error: result.error });
            }
            setIsDeleteOpen(false);
          });
        }}
        title="Delete skill?"
        description="This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        isLoading={isPending}
      />
    </div>
  );
}
