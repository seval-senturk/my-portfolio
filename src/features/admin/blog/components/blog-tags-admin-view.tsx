"use client";

import Link from "next/link";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useMemo, useState, useTransition } from "react";

import { ADMIN_ROUTES } from "@/config/admin-routes.config";
import { deleteBlogTagAction, saveBlogTagAction } from "@/features/admin/actions/blog.actions";
import { AdminConfirmDialog } from "@/features/admin/ui/modal/admin-confirm-dialog";
import { AdminFormStatus } from "@/features/admin/components/admin-form-status";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import {
  AdminDataTable,
  AdminModal,
  AdminTextField,
  type AdminTableColumn,
} from "@/features/admin/ui";
import { Button } from "@/components/ui/button";

export interface BlogTagRow {
  id: string;
  name: string;
  slug: string;
  postCount: number;
}

interface BlogTagsAdminViewProps {
  entries: BlogTagRow[];
}

export function BlogTagsAdminView({ entries }: BlogTagsAdminViewProps) {
  const [rows, setRows] = useState(entries);
  const [selected, setSelected] = useState<BlogTagRow | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [status, setStatus] = useState<{ error?: string; success?: string }>({});
  const [isPending, startTransition] = useTransition();

  const columns = useMemo<AdminTableColumn<BlogTagRow>[]>(
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
        title="Blog Tags"
        description="Use tags for granular filtering and future search."
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
              Add tag
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
        title={selected ? "Edit tag" : "Add tag"}
      >
        <form
          action={async (formData) => {
            startTransition(async () => {
              const result = await saveBlogTagAction(formData);
              if (!result.success) {
                setStatus({ error: result.error });
                return;
              }
              setStatus({ success: "Tag saved." });
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
          <Button type="submit" variant="primary" isLoading={isPending}>
            Save tag
          </Button>
        </form>
      </AdminModal>

      <AdminConfirmDialog
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        title="Delete tag"
        description="Posts linked to this tag will lose the association."
        confirmLabel="Delete"
        variant="danger"
        isLoading={isPending}
        onConfirm={() => {
          if (!deleteId) return;
          startTransition(async () => {
            const formData = new FormData();
            formData.set("id", deleteId);
            const result = await deleteBlogTagAction(formData);
            if (!result.success) {
              setStatus({ error: result.error });
              return;
            }
            setRows((current) => current.filter((row) => row.id !== deleteId));
            setDeleteId(null);
            setStatus({ success: "Tag deleted." });
          });
        }}
      />
    </div>
  );
}
