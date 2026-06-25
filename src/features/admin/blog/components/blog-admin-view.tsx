"use client";

import Link from "next/link";
import { Eye, Pencil, Plus, Trash2 } from "lucide-react";
import { useMemo, useState, useTransition } from "react";

import { ADMIN_ROUTES } from "@/config/admin-routes.config";
import { deleteBlogPostAction } from "@/features/admin/actions/blog.actions";
import { AdminConfirmDialog } from "@/features/admin/ui/modal/admin-confirm-dialog";
import { AdminFormStatus } from "@/features/admin/components/admin-form-status";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { AdminDataTable, type AdminTableColumn } from "@/features/admin/ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface BlogAdminRow {
  id: string;
  title: string;
  slug: string;
  status: string;
  featured: boolean;
  readingTimeMinutes: number;
  updatedAt: string;
  categoryNames: string[];
}

interface BlogAdminViewProps {
  entries: BlogAdminRow[];
}

export function BlogAdminView({ entries }: BlogAdminViewProps) {
  const [rows, setRows] = useState(entries);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [status, setStatus] = useState<{ error?: string; success?: string }>({});
  const [isPending, startTransition] = useTransition();

  const columns = useMemo<AdminTableColumn<BlogAdminRow>[]>(
    () => [
      {
        id: "title",
        header: "Article",
        sortValue: (row) => row.title,
        accessor: (row) => (
          <div>
            <p className="font-medium">{row.title}</p>
            <p className="text-caption text-muted-foreground">{row.slug}</p>
          </div>
        ),
      },
      {
        id: "status",
        header: "Status",
        sortValue: (row) => row.status,
        accessor: (row) => <Badge variant="outline">{row.status}</Badge>,
      },
      {
        id: "featured",
        header: "Featured",
        accessor: (row) => (
          <Badge variant={row.featured ? "accent" : "secondary"}>
            {row.featured ? "Yes" : "No"}
          </Badge>
        ),
      },
      {
        id: "readingTime",
        header: "Read time",
        accessor: (row) => `${row.readingTimeMinutes} min`,
      },
    ],
    [],
  );

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Blog"
        description="Manage articles, categories, tags, and SEO metadata."
        actions={
          <div className="flex flex-wrap gap-2">
            <Link href={`${ADMIN_ROUTES.blog}/categories`}>
              <Button type="button" variant="outline">
                Categories
              </Button>
            </Link>
            <Link href={`${ADMIN_ROUTES.blog}/tags`}>
              <Button type="button" variant="outline">
                Tags
              </Button>
            </Link>
            <Link href={`${ADMIN_ROUTES.blog}/new`}>
              <Button type="button" variant="primary" leftIcon={<Plus className="h-4 w-4" />}>
                New post
              </Button>
            </Link>
          </div>
        }
      />

      <AdminFormStatus error={status.error} success={status.success} />

      <AdminDataTable
        data={rows}
        columns={columns}
        searchFilter={(row, query) =>
          `${row.title} ${row.slug} ${row.categoryNames.join(" ")}`
            .toLowerCase()
            .includes(query)
        }
        rowActions={(row) => (
          <div className="flex justify-end gap-2">
            <Link href={`${ADMIN_ROUTES.blog}/${row.id}/preview`}>
              <Button type="button" variant="ghost" size="sm" aria-label="Preview">
                <Eye className="h-4 w-4" />
              </Button>
            </Link>
            <Link href={`${ADMIN_ROUTES.blog}/${row.id}/edit`}>
              <Button type="button" variant="ghost" size="sm" aria-label="Edit">
                <Pencil className="h-4 w-4" />
              </Button>
            </Link>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              aria-label="Delete"
              onClick={() => setDeleteId(row.id)}
            >
              <Trash2 className="h-4 w-4 text-error" />
            </Button>
          </div>
        )}
      />

      <AdminConfirmDialog
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        title="Delete blog post"
        description="This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        isLoading={isPending}
        onConfirm={() => {
          if (!deleteId) return;
          startTransition(async () => {
            const formData = new FormData();
            formData.set("id", deleteId);
            const result = await deleteBlogPostAction(formData);
            if (!result.success) {
              setStatus({ error: result.error });
              return;
            }
            setRows((current) => current.filter((row) => row.id !== deleteId));
            setDeleteId(null);
            setStatus({ success: "Blog post deleted." });
          });
        }}
      />
    </div>
  );
}
