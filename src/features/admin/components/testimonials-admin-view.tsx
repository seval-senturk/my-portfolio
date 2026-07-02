"use client";

import { GripVertical, Pencil, Plus, Trash2 } from "lucide-react";
import { useMemo, useState, useTransition, type DragEvent } from "react";

import {
  deleteTestimonialItemAction,
  reorderTestimonialItemsAction,
  saveTestimonialItemAction,
  saveTestimonialsConfigAction,
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
  AdminUploadField,
} from "@/features/admin/ui";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface TestimonialsConfigRow {
  label: string;
  title: string;
  titleAccent: string;
  description: string;
  sectionNumber: string;
  visible: boolean;
  carouselEnabled: boolean;
  autoplay: boolean;
  autoplayDelayMs: number;
  loop: boolean;
}

export interface TestimonialAdminRow {
  id: string;
  quote: string;
  authorName: string;
  authorTitle: string;
  company: string;
  avatarUrl?: string | null;
  companyLogoUrl?: string | null;
  rating?: number | null;
  testimonialDate?: string | null;
  visible: boolean;
}

interface TestimonialsAdminViewProps {
  config: TestimonialsConfigRow;
  items: TestimonialAdminRow[];
}

export function TestimonialsAdminView({ config, items }: TestimonialsAdminViewProps) {
  const [rows, setRows] = useState(items);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<TestimonialAdminRow | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [status, setStatus] = useState<{ error?: string; success?: string }>({});
  const [isPending, startTransition] = useTransition();
  const [isConfigPending, startConfigTransition] = useTransition();

  const columns = useMemo<AdminTableColumn<TestimonialAdminRow>[]>(
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
            aria-label={adminTr.testimonials.reorderHandle}
          >
            <GripVertical className="h-4 w-4" />
          </button>
        ),
      },
      {
        id: "author",
        header: adminTr.testimonials.columns.author,
        sortValue: (row) => row.authorName,
        accessor: (row) => (
          <div>
            <p className="font-medium">{row.authorName}</p>
            <p className="text-caption text-muted-foreground">{row.company}</p>
          </div>
        ),
      },
      {
        id: "quote",
        header: adminTr.testimonials.columns.quote,
        accessor: (row) => (
          <p className="max-w-md truncate text-small text-muted-foreground">{row.quote}</p>
        ),
      },
      {
        id: "rating",
        header: adminTr.testimonials.columns.rating,
        accessor: (row) =>
          row.rating ? (
            <span className="text-small text-muted-foreground">{row.rating}/5</span>
          ) : (
            "—"
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
    if (!draggingId || draggingId === targetId) return;

    const nextRows = [...rows];
    const fromIndex = nextRows.findIndex((row) => row.id === draggingId);
    const toIndex = nextRows.findIndex((row) => row.id === targetId);
    if (fromIndex < 0 || toIndex < 0) return;

    const [moved] = nextRows.splice(fromIndex, 1);
    nextRows.splice(toIndex, 0, moved!);
    setRows(nextRows);
    setDraggingId(null);

    startTransition(async () => {
      const result = await reorderTestimonialItemsAction(nextRows.map((row) => row.id));
      setStatus(
        result.success
          ? { success: adminTr.testimonials.reorderSaved }
          : { error: result.error ?? adminTr.common.saveFailed },
      );
    });
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title={adminTr.testimonials.title}
        description={adminTr.testimonials.description}
      />

      <AdminFormStatus error={status.error} success={status.success} />

      <form
        action={(formData) => {
          startConfigTransition(async () => {
            const result = await saveTestimonialsConfigAction(formData);
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
          title={adminTr.testimonials.sections.config}
          description={adminTr.testimonials.sections.configDesc}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <AdminTextField
              id="testimonials-label"
              name="label"
              label={adminTr.testimonials.fields.label}
              defaultValue={config.label}
              required
            />
            <AdminTextField
              id="testimonials-section-number"
              name="sectionNumber"
              label={adminTr.testimonials.fields.sectionNumber}
              defaultValue={config.sectionNumber}
              required
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <AdminTextField
              id="testimonials-title"
              name="title"
              label={adminTr.testimonials.fields.title}
              defaultValue={config.title}
              required
            />
            <AdminTextField
              id="testimonials-title-accent"
              name="titleAccent"
              label={adminTr.testimonials.fields.titleAccent}
              defaultValue={config.titleAccent}
            />
          </div>
          <AdminTextareaField
            id="testimonials-description"
            name="description"
            label={adminTr.testimonials.fields.description}
            defaultValue={config.description}
            rows={3}
            required
          />
          <AdminSwitchField
            id="testimonials-visible"
            name="visible"
            label={adminTr.testimonials.fields.visible}
            defaultChecked={config.visible}
          />
        </AdminFormSection>

        <AdminFormSection title={adminTr.testimonials.sections.carousel}>
          <div className="grid gap-4 md:grid-cols-2">
            <AdminSwitchField
              id="testimonials-carousel-enabled"
              name="carouselEnabled"
              label={adminTr.testimonials.fields.carouselEnabled}
              defaultChecked={config.carouselEnabled}
            />
            <AdminSwitchField
              id="testimonials-autoplay"
              name="autoplay"
              label={adminTr.testimonials.fields.autoplay}
              defaultChecked={config.autoplay}
            />
            <AdminSwitchField
              id="testimonials-loop"
              name="loop"
              label={adminTr.testimonials.fields.loop}
              defaultChecked={config.loop}
            />
            <AdminTextField
              id="testimonials-autoplay-delay"
              name="autoplayDelayMs"
              label={adminTr.testimonials.fields.autoplayDelayMs}
              type="number"
              min={2000}
              step={500}
              defaultValue={config.autoplayDelayMs}
              required
            />
          </div>
        </AdminFormSection>

        <AdminFormActions>
          <Button type="submit" variant="primary" isLoading={isConfigPending}>
            {adminTr.testimonials.saveSection}
          </Button>
        </AdminFormActions>
      </form>

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-h4 text-foreground">{adminTr.testimonials.sections.entries}</h2>
            <p className="mt-1 text-small text-muted-foreground">
              {adminTr.testimonials.sections.entriesDesc}
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
            {adminTr.testimonials.add}
          </Button>
        </div>

        <AdminDataTable
          data={rows}
          columns={columns}
          searchPlaceholder={adminTr.testimonials.search}
          searchFilter={(row, query) =>
            `${row.authorName} ${row.company} ${row.quote}`.toLowerCase().includes(query)
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
        title={selected ? adminTr.testimonials.edit : adminTr.testimonials.add}
        description={adminTr.testimonials.editDesc}
        size="lg"
        footer={
          <Button
            type="submit"
            form="testimonial-item-form"
            variant="primary"
            isLoading={isPending}
          >
            {adminTr.testimonials.saveEntry}
          </Button>
        }
      >
        <form
          id="testimonial-item-form"
          action={(formData) => {
            if (selected) formData.set("id", selected.id);
            startTransition(async () => {
              const result = await saveTestimonialItemAction(formData);
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
          <AdminFormSection title={adminTr.testimonials.sections.entryDetails}>
            <AdminTextareaField
              id="testimonial-quote"
              name="quote"
              label={adminTr.testimonials.fields.quote}
              defaultValue={selected?.quote}
              rows={4}
              required
            />
            <div className="grid gap-4 md:grid-cols-2">
              <AdminTextField
                id="testimonial-author-name"
                name="authorName"
                label={adminTr.testimonials.fields.authorName}
                defaultValue={selected?.authorName}
                required
              />
              <AdminTextField
                id="testimonial-author-title"
                name="authorTitle"
                label={adminTr.testimonials.fields.authorTitle}
                defaultValue={selected?.authorTitle}
                required
              />
              <AdminTextField
                id="testimonial-company"
                name="company"
                label={adminTr.testimonials.fields.company}
                defaultValue={selected?.company}
                required
              />
              <AdminTextField
                id="testimonial-rating"
                name="rating"
                label={adminTr.testimonials.fields.rating}
                type="number"
                min={1}
                max={5}
                defaultValue={selected?.rating ?? undefined}
              />
              <AdminTextField
                id="testimonial-date"
                name="testimonialDate"
                label={adminTr.testimonials.fields.testimonialDate}
                type="date"
                defaultValue={
                  selected?.testimonialDate
                    ? selected.testimonialDate.slice(0, 10)
                    : undefined
                }
              />
            </div>
            <AdminUploadField
              id="testimonial-avatar"
              name="avatarUrl"
              label={adminTr.testimonials.fields.avatarUrl}
              defaultValue={selected?.avatarUrl ?? undefined}
            />
            <AdminUploadField
              id="testimonial-company-logo"
              name="companyLogoUrl"
              label={adminTr.testimonials.fields.companyLogoUrl}
              defaultValue={selected?.companyLogoUrl ?? undefined}
            />
            <AdminSwitchField
              id="testimonial-visible"
              name="visible"
              label={adminTr.testimonials.fields.entryVisible}
              defaultChecked={selected?.visible ?? true}
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
            const result = await deleteTestimonialItemAction(deleteId);
            if (result.success) {
              setRows((current) => current.filter((row) => row.id !== deleteId));
              setStatus({ success: adminTr.common.deleted });
            } else {
              setStatus({ error: result.error });
            }
            setIsDeleteOpen(false);
          });
        }}
        title={adminTr.testimonials.deleteTitle}
        description={adminTr.testimonials.deleteDesc}
        confirmLabel={adminTr.common.delete}
        variant="danger"
        isLoading={isPending}
      />
    </div>
  );
}
