"use client";

import { GripVertical, Pencil, Plus, Trash2 } from "lucide-react";
import { useMemo, useState, useTransition, type DragEvent } from "react";

import {
  deleteAboutHomeQuickInfoAction,
  deleteAboutHomeStatAction,
  reorderAboutHomeQuickInfoAction,
  reorderAboutHomeStatsAction,
  saveAboutHomeConfigAction,
  saveAboutHomeQuickInfoAction,
  saveAboutHomeStatAction,
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
import {
  ABOUT_HOME_ICON_OPTIONS,
} from "@/features/about-home/config/about-home-icons.config";
import { AboutHomeIcon } from "@/features/about-home/components/about-home-icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { AboutHomeContent } from "@/types/about-home";

type ItemKind = "quick-info" | "stat";

interface AboutHomeAdminViewProps {
  config: AboutHomeContent;
  embedded?: boolean;
}

export function AboutHomeAdminView({
  config: initialConfig,
  embedded = false,
}: AboutHomeAdminViewProps) {
  const [quickInfoRows, setQuickInfoRows] = useState([...initialConfig.quickInfo]);
  const [statRows, setStatRows] = useState([...initialConfig.stats]);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragKind, setDragKind] = useState<ItemKind | null>(null);
  const [modalKind, setModalKind] = useState<ItemKind>("quick-info");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedQuickInfo, setSelectedQuickInfo] = useState<
    (typeof quickInfoRows)[number] | null
  >(null);
  const [selectedStat, setSelectedStat] = useState<(typeof statRows)[number] | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ kind: ItemKind; id: string } | null>(
    null,
  );
  const [status, setStatus] = useState<{ error?: string; success?: string }>({});
  const [isPending, startTransition] = useTransition();
  const [isConfigPending, startConfigTransition] = useTransition();
  const [isReorderPending, startReorderTransition] = useTransition();

  const quickInfoColumns = useMemo<
    AdminTableColumn<(typeof quickInfoRows)[number]>[]
  >(
    () => [
      {
        id: "order",
        header: "",
        accessor: (row) => (
          <button
            type="button"
            draggable
            onDragStart={() => {
              setDraggingId(row.id);
              setDragKind("quick-info");
            }}
            onDragEnd={() => {
              setDraggingId(null);
              setDragKind(null);
            }}
            className="cursor-grab text-muted-foreground active:cursor-grabbing"
            aria-label={adminTr.aboutHome.reorderHandle}
          >
            <GripVertical className="h-4 w-4" />
          </button>
        ),
      },
      {
        id: "icon",
        header: adminTr.aboutHome.columns.icon,
        accessor: (row) => <AboutHomeIcon name={row.icon} size={18} />,
      },
      {
        id: "label",
        header: adminTr.aboutHome.columns.label,
        sortValue: (row) => row.label,
        accessor: (row) => row.label,
      },
      {
        id: "value",
        header: adminTr.aboutHome.columns.value,
        accessor: (row) => row.value,
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

  const statColumns = useMemo<AdminTableColumn<(typeof statRows)[number]>[]>(
    () => [
      {
        id: "order",
        header: "",
        accessor: (row) => (
          <button
            type="button"
            draggable
            onDragStart={() => {
              setDraggingId(row.id);
              setDragKind("stat");
            }}
            onDragEnd={() => {
              setDraggingId(null);
              setDragKind(null);
            }}
            className="cursor-grab text-muted-foreground active:cursor-grabbing"
            aria-label={adminTr.aboutHome.reorderHandle}
          >
            <GripVertical className="h-4 w-4" />
          </button>
        ),
      },
      {
        id: "icon",
        header: adminTr.aboutHome.columns.icon,
        accessor: (row) => <AboutHomeIcon name={row.icon} size={18} />,
      },
      {
        id: "value",
        header: adminTr.aboutHome.columns.statValue,
        sortValue: (row) => row.value,
        accessor: (row) => row.value,
      },
      {
        id: "label",
        header: adminTr.aboutHome.columns.statLabel,
        accessor: (row) => row.label,
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

  function handleDrop(kind: ItemKind, targetId: string) {
    if (!draggingId || dragKind !== kind || draggingId === targetId) {
      return;
    }

    const rows = kind === "quick-info" ? quickInfoRows : statRows;
    const setRows = kind === "quick-info" ? setQuickInfoRows : setStatRows;
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
    setDragKind(null);

    startReorderTransition(async () => {
      const orderedIds = nextRows.map((row) => row.id);
      const result =
        kind === "quick-info"
          ? await reorderAboutHomeQuickInfoAction(orderedIds)
          : await reorderAboutHomeStatsAction(orderedIds);

      setStatus(
        result.success
          ? { success: adminTr.aboutHome.reorderSaved }
          : { error: result.error ?? adminTr.common.saveFailed },
      );
    });
  }

  return (
    <div className="space-y-8">
      {!embedded ? (
        <AdminPageHeader
          title={adminTr.aboutHome.title}
          description={adminTr.aboutHome.description}
        />
      ) : null}

      <AdminFormStatus error={status.error} success={status.success} />

      <form
        action={(formData) => {
          startConfigTransition(async () => {
            const result = await saveAboutHomeConfigAction(formData);
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
          title={adminTr.aboutHome.sections.config}
          description={adminTr.aboutHome.sections.configDesc}
        >
          <AdminSwitchField
            id="visible"
            name="visible"
            label={adminTr.aboutHome.fields.visible}
            defaultChecked={initialConfig.section.visible}
          />
          <AdminTextField
            id="sectionLabel"
            name="sectionLabel"
            label={adminTr.aboutHome.fields.sectionLabel}
            defaultValue={initialConfig.section.label}
            required
          />
          <AdminTextField
            id="title"
            name="title"
            label={adminTr.aboutHome.fields.title}
            defaultValue={initialConfig.section.title}
            required
          />
          <AdminTextField
            id="titleAccent"
            name="titleAccent"
            label={adminTr.aboutHome.fields.titleAccent}
            defaultValue={initialConfig.section.titleAccent ?? ""}
            hint={adminTr.aboutHome.fields.titleAccentHint}
          />
          <AdminTextareaField
            id="description"
            name="description"
            label={adminTr.aboutHome.fields.description}
            defaultValue={initialConfig.section.description}
            rows={5}
            required
          />
        </AdminFormSection>

        <AdminFormSection
          title={adminTr.aboutHome.sections.profile}
          description={adminTr.aboutHome.sections.profileDesc}
        >
          <AdminUploadField
            id="profileImageUrl"
            name="profileImageUrl"
            label={adminTr.aboutHome.fields.profileImageUrl}
            defaultValue={initialConfig.profile.imageUrl ?? undefined}
          />
          <AdminTextField
            id="profileImageAlt"
            name="profileImageAlt"
            label={adminTr.aboutHome.fields.profileImageAlt}
            defaultValue={initialConfig.profile.imageAlt}
            required
          />
        </AdminFormSection>

        <AdminFormSection title={adminTr.aboutHome.sections.buttons}>
          <div className="grid gap-4 md:grid-cols-2">
            <AdminTextField
              id="primaryCtaLabel"
              name="primaryCtaLabel"
              label={adminTr.aboutHome.fields.primaryCtaLabel}
              defaultValue={initialConfig.actions.primary.label}
            />
            <AdminTextField
              id="primaryCtaHref"
              name="primaryCtaHref"
              label={adminTr.aboutHome.fields.primaryCtaHref}
              defaultValue={initialConfig.actions.primary.href}
            />
          </div>
          <AdminSwitchField
            id="primaryCtaVisible"
            name="primaryCtaVisible"
            label={adminTr.aboutHome.fields.primaryCtaVisible}
            defaultChecked={initialConfig.actions.primary.visible}
          />
          <div className="grid gap-4 md:grid-cols-2">
            <AdminTextField
              id="secondaryCtaLabel"
              name="secondaryCtaLabel"
              label={adminTr.aboutHome.fields.secondaryCtaLabel}
              defaultValue={initialConfig.actions.secondary.label}
            />
            <AdminTextField
              id="secondaryCtaHref"
              name="secondaryCtaHref"
              label={adminTr.aboutHome.fields.secondaryCtaHref}
              defaultValue={initialConfig.actions.secondary.href}
            />
          </div>
          <AdminSwitchField
            id="secondaryCtaVisible"
            name="secondaryCtaVisible"
            label={adminTr.aboutHome.fields.secondaryCtaVisible}
            defaultChecked={initialConfig.actions.secondary.visible}
          />
        </AdminFormSection>

        <AdminFormActions>
          <Button type="submit" variant="primary" isLoading={isConfigPending}>
            {adminTr.aboutHome.saveSection}
          </Button>
        </AdminFormActions>
      </form>

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-h4 text-foreground">
              {adminTr.aboutHome.sections.quickInfo}
            </h2>
            <p className="mt-1 text-small text-muted-foreground">
              {adminTr.aboutHome.sections.quickInfoDesc}
            </p>
          </div>
          <Button
            type="button"
            variant="primary"
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => {
              setSelectedQuickInfo(null);
              setSelectedStat(null);
              setModalKind("quick-info");
              setIsModalOpen(true);
            }}
          >
            {adminTr.aboutHome.addQuickInfo}
          </Button>
        </div>

        <AdminDataTable
          data={quickInfoRows}
          columns={quickInfoColumns}
          searchFilter={(row, query) =>
            `${row.label} ${row.value}`.toLowerCase().includes(query)
          }
          getRowProps={(row) => ({
            onDragOver: (event: DragEvent<HTMLTableRowElement>) => {
              event.preventDefault();
            },
            onDrop: () => handleDrop("quick-info", row.id),
            className:
              draggingId === row.id && dragKind === "quick-info"
                ? "opacity-50"
                : undefined,
          })}
          rowActions={(row) => (
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedQuickInfo(row);
                  setSelectedStat(null);
                  setModalKind("quick-info");
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
                  setDeleteTarget({ kind: "quick-info", id: row.id });
                  setIsDeleteOpen(true);
                }}
              >
                <Trash2 className="h-4 w-4 text-error" />
              </Button>
            </div>
          )}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-h4 text-foreground">
              {adminTr.aboutHome.sections.stats}
            </h2>
            <p className="mt-1 text-small text-muted-foreground">
              {adminTr.aboutHome.sections.statsDesc}
            </p>
          </div>
          <Button
            type="button"
            variant="primary"
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => {
              setSelectedQuickInfo(null);
              setSelectedStat(null);
              setModalKind("stat");
              setIsModalOpen(true);
            }}
          >
            {adminTr.aboutHome.addStat}
          </Button>
        </div>

        <AdminDataTable
          data={statRows}
          columns={statColumns}
          searchFilter={(row, query) =>
            `${row.label} ${row.value}`.toLowerCase().includes(query)
          }
          getRowProps={(row) => ({
            onDragOver: (event: DragEvent<HTMLTableRowElement>) => {
              event.preventDefault();
            },
            onDrop: () => handleDrop("stat", row.id),
            className:
              draggingId === row.id && dragKind === "stat" ? "opacity-50" : undefined,
          })}
          rowActions={(row) => (
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedStat(row);
                  setSelectedQuickInfo(null);
                  setModalKind("stat");
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
                  setDeleteTarget({ kind: "stat", id: row.id });
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
          modalKind === "stat"
            ? selectedStat
              ? adminTr.aboutHome.editStat
              : adminTr.aboutHome.addStat
            : selectedQuickInfo
              ? adminTr.aboutHome.editQuickInfo
              : adminTr.aboutHome.addQuickInfo
        }
        footer={
          <Button
            type="submit"
            form="about-home-item-form"
            variant="primary"
            isLoading={isPending}
          >
            {modalKind === "stat"
              ? adminTr.aboutHome.saveStat
              : adminTr.aboutHome.saveQuickInfo}
          </Button>
        }
      >
        <form
          id="about-home-item-form"
          action={(formData) => {
            if (modalKind === "quick-info" && selectedQuickInfo) {
              formData.set("id", selectedQuickInfo.id);
            }
            if (modalKind === "stat" && selectedStat) {
              formData.set("id", selectedStat.id);
            }

            startTransition(async () => {
              const result =
                modalKind === "stat"
                  ? await saveAboutHomeStatAction(formData)
                  : await saveAboutHomeQuickInfoAction(formData);

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
          <label className="flex flex-col gap-1 text-small">
            <span className="font-medium text-foreground">
              {adminTr.aboutHome.fields.icon}
            </span>
            <select
              name="icon"
              defaultValue={
                modalKind === "stat"
                  ? (selectedStat?.icon ?? "star")
                  : (selectedQuickInfo?.icon ?? "briefcase")
              }
              className="h-10 rounded-lg border border-border bg-surface px-3 text-body"
              required
            >
              {ABOUT_HOME_ICON_OPTIONS.map((icon) => (
                <option key={icon.value} value={icon.value}>
                  {icon.label}
                </option>
              ))}
            </select>
          </label>

          {modalKind === "stat" ? (
            <>
              <AdminTextField
                id="stat-value"
                name="value"
                label={adminTr.aboutHome.fields.statValue}
                defaultValue={selectedStat?.value ?? ""}
                required
              />
              <AdminTextField
                id="stat-label"
                name="label"
                label={adminTr.aboutHome.fields.statLabel}
                defaultValue={selectedStat?.label ?? ""}
                required
              />
            </>
          ) : (
            <>
              <AdminTextField
                id="quick-info-label"
                name="label"
                label={adminTr.aboutHome.fields.quickInfoLabel}
                defaultValue={selectedQuickInfo?.label ?? ""}
                required
              />
              <AdminTextField
                id="quick-info-value"
                name="value"
                label={adminTr.aboutHome.fields.quickInfoValue}
                defaultValue={selectedQuickInfo?.value ?? ""}
                required
              />
            </>
          )}

          <AdminSwitchField
            id="item-visible"
            name="visible"
            label={adminTr.aboutHome.fields.itemVisible}
            defaultChecked={
              modalKind === "stat"
                ? (selectedStat?.visible ?? true)
                : (selectedQuickInfo?.visible ?? true)
            }
          />
        </form>
      </AdminModal>

      <AdminConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title={
          deleteTarget?.kind === "stat"
            ? adminTr.aboutHome.deleteStatTitle
            : adminTr.aboutHome.deleteQuickInfoTitle
        }
        description={adminTr.aboutHome.deleteDesc}
        confirmLabel={adminTr.common.delete}
        onConfirm={() => {
          if (!deleteTarget) return;

          startTransition(async () => {
            const result =
              deleteTarget.kind === "stat"
                ? await deleteAboutHomeStatAction(deleteTarget.id)
                : await deleteAboutHomeQuickInfoAction(deleteTarget.id);

            if (result.success) {
              if (deleteTarget.kind === "stat") {
                setStatRows((current) =>
                  current.filter((row) => row.id !== deleteTarget.id),
                );
              } else {
                setQuickInfoRows((current) =>
                  current.filter((row) => row.id !== deleteTarget.id),
                );
              }
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
          {adminTr.aboutHome.reordering}
        </p>
      ) : null}
    </div>
  );
}
