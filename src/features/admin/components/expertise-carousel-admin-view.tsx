"use client";

import { GripVertical, Pencil, Plus, Trash2 } from "lucide-react";
import { useMemo, useState, useTransition, type DragEvent } from "react";

import {
  deleteExpertiseCarouselItemAction,
  reorderExpertiseCarouselItemsAction,
  saveExpertiseCarouselConfigAction,
  saveExpertiseCarouselItemAction,
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
import {
  EXPERTISE_ICON_OPTIONS,
  resolveExpertiseIcon,
} from "@/features/expertise-carousel/config/expertise-icons.config";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface ExpertiseCarouselConfigRow {
  label: string;
  title: string;
  description: string;
  visible: boolean;
}

export interface ExpertiseCarouselItemRow {
  id: string;
  icon: string;
  title: string;
  description?: string | null;
  bulletItems: string[];
  ctaLabel?: string | null;
  ctaHref?: string | null;
  visible: boolean;
  sortOrder: number;
}

interface ExpertiseCarouselAdminViewProps {
  config: ExpertiseCarouselConfigRow;
  items: ExpertiseCarouselItemRow[];
}

export function ExpertiseCarouselAdminView({
  config,
  items: initialItems,
}: ExpertiseCarouselAdminViewProps) {
  const [rows, setRows] = useState(initialItems);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<ExpertiseCarouselItemRow | null>(
    null,
  );
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [status, setStatus] = useState<{ error?: string; success?: string }>(
    {},
  );
  const [isPending, startTransition] = useTransition();
  const [isConfigPending, startConfigTransition] = useTransition();
  const [isReorderPending, startReorderTransition] = useTransition();

  const columns = useMemo<AdminTableColumn<ExpertiseCarouselItemRow>[]>(
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
            aria-label={adminTr.expertiseCarousel.reorderHandle}
          >
            <GripVertical className="h-4 w-4" />
          </button>
        ),
      },
      {
        id: "icon",
        header: adminTr.expertiseCarousel.columns.icon,
        accessor: (row) => {
          const Icon = resolveExpertiseIcon(row.icon);
          return <Icon className="h-4 w-4" aria-hidden />;
        },
      },
      {
        id: "title",
        header: adminTr.expertiseCarousel.columns.title,
        sortValue: (row) => row.title,
        accessor: (row) => row.title,
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

    startReorderTransition(async () => {
      const result = await reorderExpertiseCarouselItemsAction(
        nextRows.map((row) => row.id),
      );
      setStatus(
        result.success
          ? { success: adminTr.expertiseCarousel.reorderSaved }
          : { error: result.error ?? adminTr.common.saveFailed },
      );
    });
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title={adminTr.expertiseCarousel.title}
        description={adminTr.expertiseCarousel.description}
      />

      <AdminFormStatus error={status.error} success={status.success} />

      <form
        action={(formData) => {
          startConfigTransition(async () => {
            const result = await saveExpertiseCarouselConfigAction(formData);
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
          title={adminTr.expertiseCarousel.sections.config}
          description={adminTr.expertiseCarousel.sections.configDesc}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <AdminTextField
              id="expertise-label"
              name="label"
              label={adminTr.expertiseCarousel.fields.label}
              defaultValue={config.label}
              required
            />
            <AdminSwitchField
              id="expertise-visible"
              name="visible"
              label={adminTr.expertiseCarousel.fields.visible}
              defaultChecked={config.visible}
            />
          </div>
          <AdminTextField
            id="expertise-title"
            name="title"
            label={adminTr.expertiseCarousel.fields.title}
            defaultValue={config.title}
            required
          />
          <AdminTextareaField
            id="expertise-description"
            name="description"
            label={adminTr.expertiseCarousel.fields.description}
            defaultValue={config.description}
            rows={3}
          />
        </AdminFormSection>

        <AdminFormActions>
          <Button type="submit" variant="primary" isLoading={isConfigPending}>
            {adminTr.expertiseCarousel.saveSection}
          </Button>
        </AdminFormActions>
      </form>

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-h4 text-foreground">
              {adminTr.expertiseCarousel.sections.cards}
            </h2>
            <p className="mt-1 text-small text-muted-foreground">
              {adminTr.expertiseCarousel.sections.cardsDesc}
            </p>
          </div>
          <Button
            type="button"
            variant="primary"
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => {
              setSelected(null);
              setIsModalOpen(true);
            }}
          >
            {adminTr.expertiseCarousel.add}
          </Button>
        </div>

        <AdminDataTable
          data={rows}
          columns={columns}
          searchFilter={(row, query) =>
            `${row.title} ${row.icon}`.toLowerCase().includes(query)
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
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setDeleteId(row.id);
                  setIsDeleteOpen(true);
                }}
              >
                <Trash2 className="h-4 w-4 text-error" />
              </Button>
            </div>
          )}
        />
      </div>

      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          selected
            ? adminTr.expertiseCarousel.edit
            : adminTr.expertiseCarousel.add
        }
        size="lg"
        footer={
          <Button
            type="submit"
            form="expertise-carousel-item-form"
            variant="primary"
            isLoading={isPending}
          >
            {adminTr.expertiseCarousel.saveCard}
          </Button>
        }
      >
        <form
          id="expertise-carousel-item-form"
          action={(formData) => {
            if (selected) formData.set("id", selected.id);
            startTransition(async () => {
              const result = await saveExpertiseCarouselItemAction(formData);
              if (result.success) {
                setIsModalOpen(false);
                setStatus({ success: adminTr.common.saved });
                window.location.reload();
              } else {
                setStatus({ error: result.error });
              }
            });
          }}
          className="space-y-4"
        >
          <AdminFormSection title={adminTr.expertiseCarousel.sections.cardDetails}>
            <label className="flex flex-col gap-1 text-small">
              <span className="font-medium text-foreground">
                {adminTr.expertiseCarousel.fields.icon}
              </span>
              <select
                name="icon"
                defaultValue={selected?.icon ?? "Layers"}
                className="h-10 rounded-lg border border-border bg-surface px-3 text-body"
                required
              >
                {EXPERTISE_ICON_OPTIONS.map((icon) => (
                  <option key={icon} value={icon}>
                    {icon}
                  </option>
                ))}
              </select>
            </label>
            <AdminTextField
              id="expertise-item-title"
              name="title"
              label={adminTr.expertiseCarousel.fields.cardTitle}
              defaultValue={selected?.title ?? ""}
              required
            />
            <AdminTextareaField
              id="expertise-item-description"
              name="description"
              label={adminTr.expertiseCarousel.fields.cardDescription}
              defaultValue={selected?.description ?? ""}
              rows={3}
            />
            <AdminTextareaField
              id="expertise-item-bullets"
              name="bulletItems"
              label={adminTr.expertiseCarousel.fields.bulletItems}
              defaultValue={selected?.bulletItems.join("\n") ?? ""}
              rows={5}
              hint={adminTr.expertiseCarousel.fields.bulletItemsHint}
            />
            <div className="grid gap-4 md:grid-cols-2">
              <AdminTextField
                id="expertise-item-cta-label"
                name="ctaLabel"
                label={adminTr.expertiseCarousel.fields.ctaLabel}
                defaultValue={selected?.ctaLabel ?? ""}
              />
              <AdminTextField
                id="expertise-item-cta-href"
                name="ctaHref"
                label={adminTr.expertiseCarousel.fields.ctaHref}
                defaultValue={selected?.ctaHref ?? ""}
              />
            </div>
            <AdminSwitchField
              id="expertise-item-visible"
              name="visible"
              label={adminTr.expertiseCarousel.fields.cardVisible}
              defaultChecked={selected?.visible ?? true}
            />
          </AdminFormSection>
        </form>
      </AdminModal>

      <AdminConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title={adminTr.expertiseCarousel.deleteTitle}
        description={adminTr.expertiseCarousel.deleteDesc}
        confirmLabel={adminTr.common.delete}
        onConfirm={() => {
          if (!deleteId) return;
          startTransition(async () => {
            const result = await deleteExpertiseCarouselItemAction(deleteId);
            if (result.success) {
              setRows((current) => current.filter((row) => row.id !== deleteId));
              setIsDeleteOpen(false);
              setStatus({ success: adminTr.common.saved });
            } else {
              setStatus({ error: result.error });
            }
          });
        }}
        isLoading={isPending}
      />

      {isReorderPending ? (
        <p className="text-caption text-muted-foreground">
          {adminTr.expertiseCarousel.reordering}
        </p>
      ) : null}
    </div>
  );
}
