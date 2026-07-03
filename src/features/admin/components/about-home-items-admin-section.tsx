"use client";

import { GripVertical, Pencil, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition, type DragEvent } from "react";

import {
  deleteAboutHomeFeatureCardAction,
  reorderAboutHomeFeatureCardsAction,
  saveAboutHomeFeatureCardAction,
} from "@/features/admin/actions/content.actions";
import { AdminFormStatus } from "@/features/admin/components/admin-form-status";
import { adminTr } from "@/features/admin/i18n/tr";
import {
  AdminConfirmDialog,
  AdminDataTable,
  type AdminTableColumn,
  AdminFormActions,
  AdminModal,
  AdminSelectField,
  AdminSwitchField,
  AdminTextField,
  AdminTextareaField,
} from "@/features/admin/ui";
import { AboutHomeIcon } from "@/features/about-home/components/about-home-icon";
import { ABOUT_HOME_FEATURE_ICON_OPTIONS } from "@/features/about-home/config/about-home-icons.config";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { AboutHomeFeatureCard } from "@/types/about-home";

interface AboutHomeItemsAdminSectionProps {
  initialFeatureCards: AboutHomeFeatureCard[];
}

export function AboutHomeItemsAdminSection({
  initialFeatureCards,
}: AboutHomeItemsAdminSectionProps) {
  const router = useRouter();
  const [rows, setRows] = useState(initialFeatureCards);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<AboutHomeFeatureCard | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState<{ error?: string; success?: string }>({});
  const [isPending, startTransition] = useTransition();
  const [, startReorderTransition] = useTransition();

  useEffect(() => {
    setRows(initialFeatureCards);
  }, [initialFeatureCards]);

  const columns = useMemo<AdminTableColumn<AboutHomeFeatureCard>[]>(
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
            aria-label={adminTr.aboutHome.reorderHandle}
          >
            <GripVertical className="h-4 w-4" />
          </button>
        ),
      },
      {
        id: "number",
        header: adminTr.aboutHome.columns.number,
        accessor: (row) => row.number,
      },
      {
        id: "title",
        header: adminTr.aboutHome.columns.cardTitle,
        sortValue: (row) => row.title,
        accessor: (row) => (
          <div className="flex items-center gap-2">
            <AboutHomeIcon name={row.icon} size={16} />
            <span>{row.title}</span>
          </div>
        ),
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
      const result = await reorderAboutHomeFeatureCardsAction(nextRows.map((row) => row.id));
      setStatus(
        result.success
          ? { success: adminTr.common.saved }
          : { error: result.error ?? adminTr.common.saveFailed },
      );
    });
  }

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await saveAboutHomeFeatureCardAction(formData);
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
      const result = await deleteAboutHomeFeatureCardAction(deleteId);
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
      <div className="flex justify-end">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => {
            setSelectedCard(null);
            setIsModalOpen(true);
          }}
        >
          <Plus className="mr-1.5 h-4 w-4" />
          {adminTr.aboutHome.addFeatureCard}
        </Button>
      </div>

      <AdminDataTable
        data={rows}
        columns={columns}
        searchFilter={(row, query) =>
          `${row.title} ${row.number} ${row.description}`.toLowerCase().includes(query)
        }
        emptyTitle={adminTr.aboutHome.emptyFeatureCards}
        getRowProps={(row) => ({
          onDragOver: (event: DragEvent<HTMLTableRowElement>) => {
            event.preventDefault();
          },
          onDrop: () => handleDrop(row.id),
          className: draggingId === row.id ? "opacity-50" : undefined,
        })}
        rowActions={(row) => (
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedCard(row);
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

      <AdminFormStatus error={status.error} success={status.success} />

      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedCard ? adminTr.aboutHome.editFeatureCard : adminTr.aboutHome.addFeatureCard}
      >
        <form action={handleSubmit} className="space-y-4">
          {selectedCard ? <input type="hidden" name="id" value={selectedCard.id} /> : null}
          <AdminTextField
            id="number"
            name="number"
            label={adminTr.aboutHome.fields.number}
            defaultValue={selectedCard?.number ?? "01"}
          />
          <AdminSelectField
            id="icon"
            name="icon"
            label={adminTr.aboutHome.fields.icon}
            defaultValue={selectedCard?.icon ?? "code"}
            options={ABOUT_HOME_FEATURE_ICON_OPTIONS.map((option) => ({
              value: option.value,
              label: option.label,
            }))}
          />
          <AdminTextField
            id="title"
            name="title"
            label={adminTr.aboutHome.fields.cardTitle}
            defaultValue={selectedCard?.title ?? ""}
          />
          <AdminTextareaField
            id="description"
            name="description"
            label={adminTr.aboutHome.fields.cardDescription}
            defaultValue={selectedCard?.description ?? ""}
            rows={3}
          />
          <AdminSwitchField
            id="visible"
            name="visible"
            label={adminTr.aboutHome.fields.itemVisible}
            defaultChecked={selectedCard?.visible ?? true}
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
        title={adminTr.aboutHome.deleteFeatureCardTitle}
        description={adminTr.aboutHome.deleteDesc}
        confirmLabel={adminTr.common.delete}
        onConfirm={handleDelete}
        isLoading={isPending}
        variant="danger"
      />
    </div>
  );
}
