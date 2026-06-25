"use client";

import Link from "next/link";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useMemo, useState, useTransition } from "react";

import { ADMIN_ROUTES } from "@/config/admin-routes.config";
import {
  deleteBlogCategoryAction,
  saveBlogCategoryAction,
} from "@/features/admin/actions/blog.actions";
import { AdminConfirmDialog } from "@/features/admin/ui/modal/admin-confirm-dialog";
import { AdminFormStatus } from "@/features/admin/components/admin-form-status";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import {
  AdminDataTable,
  AdminModal,
  AdminTextField,
  AdminTextareaField,
  type AdminTableColumn,
} from "@/features/admin/ui";
import { Button } from "@/components/ui/button";

export interface BlogCategoryRow {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  postCount: number;
}

interface BlogCategoriesAdminViewProps {
  entries: BlogCategoryRow[];
}

export function BlogCategoriesAdminView({ entries }: BlogCategoriesAdminViewProps) {
  const [rows, setRows] = useState(entries);
  const [selected, setSelected] = useState<BlogCategoryRow | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [status, setStatus] = useState<{ error?: string; success?: string }>({});
  const [isPending, startTransition] = useTransition();

  const columns = useMemo<AdminTableColumn<BlogCategoryRow>[]>(
    () => [
      { id: "name", header: "Name", sortValue: (row) => row.name, accessor: (row) => row.name },
      { id: "slug", header: "Slug", sortValue: (row) => row.slug, accessor: (row) => row.slug },
      { id: "posts", header: "Posts", accessor: (row) => row.postCount },
    ],
    [],
  );

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Blog Categories"
        description="Organize articles by topic for SEO and navigation."
        actions={
          <div className="flex gap-2">
            <Link href={ADMIN_ROUTES.blog}>
              <Button type="button" variant="ghost">
                Back to posts
              </Button>
            </Link>
            <Button
              type="button"
              variant="primary"
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={() => {
                setSelected(null);
                setIsModalOpen(true);
              }}
            >
              Add category
            </Button>
          </div>
        }
      />

      <AdminFormStatus error={status.error} success={status.success} />

      <AdminDataTable
        data={rows}
        columns={columns}
        searchFilter={(row, query) =>
          `${row.name} ${row.slug}`.toLowerCase().includes(query)
        }
        rowActions={(row) => (
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelected(row);
                setIsModalOpen(true);
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => setDeleteId(row.id)}>
              <Trash2 className="h-4 w-4 text-error" />
            </Button>
          </div>
        )}
      />

      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selected ? "Edit category" : "Add category"}
      >
        <form
          action={async (formData) => {
            startTransition(async () => {
              const result = await saveBlogCategoryAction(formData);
              if (!result.success) {
                setStatus({ error: result.error });
                return;
              }
              setStatus({ success: "Category saved." });
              setIsModalOpen(false);
              window.location.reload();
            });
          }}
          className="space-y-4"
        >
          {selected ? <input type="hidden" name="id" value={selected.id} /> : null}
          <AdminTextField
            id="name"
            name="name"
            label="Name"
            required
            defaultValue={selected?.name ?? ""}
          />
          <AdminTextField
            id="slug"
            name="slug"
            label="Slug"
            hint="Leave blank to auto-generate."
            defaultValue={selected?.slug ?? ""}
          />
          <AdminTextareaField
            id="description"
            name="description"
            label="Description"
            rows={3}
            defaultValue={selected?.description ?? ""}
          />
          <Button type="submit" variant="primary" isLoading={isPending}>
            Save category
          </Button>
        </form>
      </AdminModal>

      <AdminConfirmDialog
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        title="Delete category"
        description="Posts linked to this category will lose the association."
        confirmLabel="Delete"
        variant="danger"
        isLoading={isPending}
        onConfirm={() => {
          if (!deleteId) return;
          startTransition(async () => {
            const formData = new FormData();
            formData.set("id", deleteId);
            const result = await deleteBlogCategoryAction(formData);
            if (!result.success) {
              setStatus({ error: result.error });
              return;
            }
            setRows((current) => current.filter((row) => row.id !== deleteId));
            setDeleteId(null);
            setStatus({ success: "Category deleted." });
          });
        }}
      />
    </div>
  );
}
