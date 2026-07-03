"use client";

import { GripVertical, Pencil, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition, type DragEvent } from "react";

import {
  deleteFooterNavLinkAction,
  deleteFooterResourceLinkAction,
  reorderFooterNavLinksAction,
  reorderFooterResourceLinksAction,
  saveFooterNavLinkAction,
  saveFooterResourceLinkAction,
} from "@/features/admin/actions/content.actions";
import { AdminFormStatus } from "@/features/admin/components/admin-form-status";
import { adminTr } from "@/features/admin/i18n/tr";
import {
  AdminConfirmDialog,
  AdminDataTable,
  type AdminTableColumn,
  AdminFormActions,
  AdminModal,
  AdminSwitchField,
  AdminTextField,
} from "@/features/admin/ui";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { FooterLinkItem } from "@/types/footer";

type FooterLinkKind = "navigation" | "resources";

interface FooterLinksAdminSectionProps {
  kind: FooterLinkKind;
  title: string;
  description: string;
  initialLinks: FooterLinkItem[];
}

export function FooterLinksAdminSection({
  kind,
  title,
  description,
  initialLinks,
}: FooterLinksAdminSectionProps) {
  const router = useRouter();
  const [rows, setRows] = useState(initialLinks);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [selectedLink, setSelectedLink] = useState<FooterLinkItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState<{ error?: string; success?: string }>({});
  const [isPending, startTransition] = useTransition();
  const [, startReorderTransition] = useTransition();

  useEffect(() => {
    setRows(initialLinks);
  }, [initialLinks]);

  const columns = useMemo<AdminTableColumn<FooterLinkItem>[]>(
    () => [
      {
        id: "reorder",
        header: "",
        accessor: (row) => (
          <button
            type="button"
            className="cursor-grab text-muted-foreground"
            draggable
            onDragStart={() => setDraggingId(row.id)}
            onDragEnd={() => setDraggingId(null)}
            aria-label={adminTr.footer.links.reorderHandle}
          >
            <GripVertical className="h-4 w-4" />
          </button>
        ),
      },
      {
        id: "label",
        header: adminTr.footer.links.label,
        sortValue: (row) => row.label,
        accessor: (row) => (
          <div>
            <p className="font-medium text-foreground">{row.label}</p>
            <p className="text-caption text-muted-foreground">{row.href}</p>
          </div>
        ),
      },
      {
        id: "visible",
        header: adminTr.footer.links.visible,
        accessor: (row) =>
          row.visible ? (
            <Badge variant="accent">{adminTr.common.active}</Badge>
          ) : (
            <Badge variant="outline">{adminTr.common.no}</Badge>
          ),
      },
    ],
    [],
  );

  function handleDrop(targetId: string) {
    if (!draggingId || draggingId === targetId) {
      return;
    }

    const nextRows = [...rows];
    const fromIndex = nextRows.findIndex((row) => row.id === draggingId);
    const toIndex = nextRows.findIndex((row) => row.id === targetId);

    if (fromIndex < 0 || toIndex < 0) {
      return;
    }

    const [moved] = nextRows.splice(fromIndex, 1);
    nextRows.splice(toIndex, 0, moved!);
    setRows(nextRows);
    setDraggingId(null);

    startReorderTransition(async () => {
      const orderedIds = nextRows.map((row) => row.id);
      const result =
        kind === "navigation"
          ? await reorderFooterNavLinksAction(orderedIds)
          : await reorderFooterResourceLinksAction(orderedIds);

      setStatus(
        result.success
          ? { success: adminTr.common.saved }
          : { error: result.error ?? adminTr.common.saveFailed },
      );
    });
  }

  function openCreateModal() {
    setSelectedLink(null);
    setIsModalOpen(true);
  }

  function openEditModal(row: FooterLinkItem) {
    setSelectedLink(row);
    setIsModalOpen(true);
  }

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result =
        kind === "navigation"
          ? await saveFooterNavLinkAction(formData)
          : await saveFooterResourceLinkAction(formData);

      setStatus(
        result.success
          ? { success: adminTr.common.saved }
          : { error: result.error ?? adminTr.common.saveFailed },
      );

      if (result.success) {
        setIsModalOpen(false);
        router.refresh();
      }
    });
  }

  function handleDelete() {
    if (!deleteId) {
      return;
    }

    startTransition(async () => {
      const result =
        kind === "navigation"
          ? await deleteFooterNavLinkAction(deleteId)
          : await deleteFooterResourceLinkAction(deleteId);

      setStatus(
        result.success
          ? { success: adminTr.common.saved }
          : { error: result.error ?? adminTr.common.saveFailed },
      );

      if (result.success) {
        setDeleteId(null);
        router.refresh();
      }
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-h4 font-semibold text-foreground">{title}</h3>
          <p className="mt-1 text-small text-muted-foreground">{description}</p>
        </div>
        <Button type="button" variant="secondary" size="sm" onClick={openCreateModal}>
          <Plus className="mr-1.5 h-4 w-4" />
          {adminTr.footer.links.add}
        </Button>
      </div>

      <AdminDataTable
        data={rows}
        columns={columns}
        searchFilter={(row, query) =>
          `${row.label} ${row.href}`.toLowerCase().includes(query)
        }
        emptyTitle={adminTr.footer.links.empty}
        getRowProps={(row) => ({
          onDragOver: (event: DragEvent<HTMLTableRowElement>) => {
            event.preventDefault();
          },
          onDrop: () => handleDrop(row.id),
          className: draggingId === row.id ? "opacity-50" : undefined,
        })}
        rowActions={(row) => (
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => openEditModal(row)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => setDeleteId(row.id)}>
              <Trash2 className="h-4 w-4 text-error" />
            </Button>
          </div>
        )}
      />

      <AdminFormStatus error={status.error} success={status.success} />

      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedLink ? adminTr.footer.links.edit : adminTr.footer.links.add}
      >
        <form action={handleSubmit} className="space-y-4">
          {selectedLink ? <input type="hidden" name="id" value={selectedLink.id} /> : null}
          <AdminTextField
            id={`${kind}-label`}
            name="label"
            label={adminTr.footer.links.label}
            defaultValue={selectedLink?.label ?? ""}
            required
          />
          <AdminTextField
            id={`${kind}-href`}
            name="href"
            label={adminTr.footer.links.href}
            defaultValue={selectedLink?.href ?? ""}
            required
          />
          <AdminSwitchField
            id={`${kind}-visible`}
            name="visible"
            label={adminTr.footer.links.visible}
            defaultChecked={selectedLink?.visible ?? true}
          />
          <AdminFormActions>
            <Button type="submit" variant="primary" isLoading={isPending}>
              {adminTr.common.save}
            </Button>
          </AdminFormActions>
        </form>
      </AdminModal>

      <AdminConfirmDialog
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        title={adminTr.footer.links.deleteTitle}
        description={adminTr.footer.links.deleteDesc}
        confirmLabel={adminTr.common.delete}
        onConfirm={handleDelete}
        isLoading={isPending}
        variant="danger"
      />
    </div>
  );
}
