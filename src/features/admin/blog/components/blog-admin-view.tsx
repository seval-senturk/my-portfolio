"use client";

import Link from "next/link";
import { Eye, Pencil, Plus, Trash2 } from "lucide-react";
import { useMemo, useState, useTransition } from "react";

import { ADMIN_ROUTES } from "@/config/admin-routes.config";
import { deleteBlogPostAction } from "@/features/admin/actions/blog.actions";
import { AdminConfirmDialog } from "@/features/admin/ui/modal/admin-confirm-dialog";
import { AdminFormStatus } from "@/features/admin/components/admin-form-status";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { adminTr } from "@/features/admin/i18n/tr";
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
        header: adminTr.blog.columns.article,
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
        header: adminTr.common.status,
        sortValue: (row) => row.status,
        accessor: (row) => <Badge variant="outline">{row.status}</Badge>,
      },
      {
        id: "featured",
        header: adminTr.common.featured,
        accessor: (row) => (
          <Badge variant={row.featured ? "accent" : "secondary"}>
            {row.featured ? adminTr.common.yes : adminTr.common.no}
          </Badge>
        ),
      },
      {
        id: "readingTime",
        header: adminTr.blog.columns.readTime,
        accessor: (row) => `${row.readingTimeMinutes} ${adminTr.blog.minRead}`,
      },
    ],
    [],
  );

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={adminTr.blog.title}
        description={adminTr.blog.description}
        actions={
          <div className="flex flex-wrap gap-2">
            <Link href={`${ADMIN_ROUTES.blog}/categories`}>
              <Button type="button" variant="outline">
                {adminTr.blog.categoriesNav}
              </Button>
            </Link>
            <Link href={`${ADMIN_ROUTES.blog}/tags`}>
              <Button type="button" variant="outline">
                {adminTr.blog.tagsNav}
              </Button>
            </Link>
            <Link href={`${ADMIN_ROUTES.blog}/new`}>
              <Button type="button" variant="primary" leftIcon={<Plus className="h-4 w-4" />}>
                {adminTr.blog.newPost}
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
              <Button type="button" variant="ghost" size="sm" aria-label={adminTr.common.preview}>
                <Eye className="h-4 w-4" />
              </Button>
            </Link>
            <Link href={`${ADMIN_ROUTES.blog}/${row.id}/edit`}>
              <Button type="button" variant="ghost" size="sm" aria-label={adminTr.common.edit}>
                <Pencil className="h-4 w-4" />
              </Button>
            </Link>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              aria-label={adminTr.common.delete}
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
        title={adminTr.blog.deleteTitle}
        description={adminTr.blog.deleteDesc}
        confirmLabel={adminTr.common.delete}
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
            setStatus({ success: adminTr.common.deleted });
          });
        }}
      />
    </div>
  );
}
