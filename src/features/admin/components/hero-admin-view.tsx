"use client";

import { GripVertical, Pencil, Plus, Trash2 } from "lucide-react";
import { useMemo, useState, useTransition, type DragEvent } from "react";

import {
  deleteHeroStatAction,
  deleteHeroTechnologyCardAction,
  reorderHeroStatsAction,
  reorderHeroTechnologyCardsAction,
  saveHeroAction,
  saveHeroStatAction,
  saveHeroTechnologyCardAction,
} from "@/features/admin/actions/content.actions";
import { HeroSocialAdminSection } from "@/features/admin/components/hero-social-admin-section";
import { AdminHeroTechIconField } from "@/features/admin/components/admin-hero-tech-icon-field";
import { AdminFormStatus } from "@/features/admin/components/admin-form-status";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { adminTr } from "@/features/admin/i18n/tr";
import {
  HERO_STAT_ICON_OPTIONS,
  HERO_TECH_POSITION_OPTIONS,
  HeroTechIcon,
} from "@/features/hero/config/hero-tech-icons.config";
import {
  AdminConfirmDialog,
  AdminDataTable,
  type AdminTableColumn,
  AdminFormActions,
  AdminFormSection,
  AdminModal,
  AdminSelectField,
  AdminSwitchField,
  AdminTextField,
  AdminTextareaField,
  AdminUploadField,
} from "@/features/admin/ui";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { Badge } from "@/components/ui/badge";
import { Text } from "@/components/ui/text";
import { ROUTES } from "@/constants/routes";
import type { HeroContent, HeroStatItem, HeroTechnologyCard } from "@/types/hero";

type ItemKind = "tech-card" | "stat";

interface HeroSocialLinkRow {
  platform: string;
  label: string;
  href: string;
  visible: boolean;
}

interface HeroAdminViewProps {
  initial: HeroContent;
  needsSetup?: boolean;
  socialLinks: HeroSocialLinkRow[];
}

export function HeroAdminView({ initial, needsSetup = false, socialLinks }: HeroAdminViewProps) {
  const [techRows, setTechRows] = useState([...initial.technologyCards]);
  const [statRows, setStatRows] = useState([...initial.stats]);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragKind, setDragKind] = useState<ItemKind | null>(null);
  const [modalKind, setModalKind] = useState<ItemKind>("tech-card");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedTech, setSelectedTech] = useState<HeroTechnologyCard | null>(null);
  const [selectedStat, setSelectedStat] = useState<HeroStatItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ kind: ItemKind; id: string } | null>(
    null,
  );
  const [status, setStatus] = useState<{ error?: string; success?: string }>({});
  const [isPending, startTransition] = useTransition();
  const [isReorderPending, startReorderTransition] = useTransition();

  const techColumns = useMemo<AdminTableColumn<HeroTechnologyCard>[]>(
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
              setDragKind("tech-card");
            }}
            onDragEnd={() => {
              setDraggingId(null);
              setDragKind(null);
            }}
            className="cursor-grab text-muted-foreground active:cursor-grabbing"
            aria-label={adminTr.hero.reorderHandle}
          >
            <GripVertical className="h-4 w-4" />
          </button>
        ),
      },
      {
        id: "icon",
        header: adminTr.hero.columns.icon,
        accessor: (row) => <HeroTechIcon icon={row.icon} />,
      },
      {
        id: "title",
        header: adminTr.hero.columns.title,
        sortValue: (row) => row.title,
        accessor: (row) => row.title,
      },
      {
        id: "position",
        header: adminTr.hero.columns.position,
        accessor: (row) =>
          HERO_TECH_POSITION_OPTIONS.find((option) => option.value === String(row.position))
            ?.label ?? row.position,
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

  const statColumns = useMemo<AdminTableColumn<HeroStatItem>[]>(
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
            aria-label={adminTr.hero.reorderHandle}
          >
            <GripVertical className="h-4 w-4" />
          </button>
        ),
      },
      {
        id: "value",
        header: adminTr.hero.columns.statValue,
        sortValue: (row) => row.value,
        accessor: (row) => row.value,
      },
      {
        id: "label",
        header: adminTr.hero.columns.statLabel,
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

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await saveHeroAction(formData);
      setStatus(
        result.success
          ? { success: adminTr.common.saved }
          : { error: result.error ?? adminTr.common.saveFailed },
      );
    });
  }

  function handleDrop(kind: ItemKind, targetId: string) {
    if (!draggingId || dragKind !== kind || draggingId === targetId) {
      return;
    }

    const rows = kind === "tech-card" ? techRows : statRows;
    const setRows = kind === "tech-card" ? setTechRows : setStatRows;
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
        kind === "tech-card"
          ? await reorderHeroTechnologyCardsAction(orderedIds)
          : await reorderHeroStatsAction(orderedIds);

      setStatus(
        result.success
          ? { success: adminTr.common.saved }
          : { error: result.error ?? adminTr.common.saveFailed },
      );
    });
  }

  function openCreateModal(kind: ItemKind) {
    setModalKind(kind);
    setSelectedTech(null);
    setSelectedStat(null);
    setIsModalOpen(true);
  }

  function openEditModal(kind: ItemKind, row: HeroTechnologyCard | HeroStatItem) {
    setModalKind(kind);
    if (kind === "tech-card") {
      setSelectedTech(row as HeroTechnologyCard);
      setSelectedStat(null);
    } else {
      setSelectedStat(row as HeroStatItem);
      setSelectedTech(null);
    }
    setIsModalOpen(true);
  }

  function handleItemSubmit(formData: FormData) {
    startTransition(async () => {
      const result =
        modalKind === "tech-card"
          ? await saveHeroTechnologyCardAction(formData)
          : await saveHeroStatAction(formData);

      if (result.success) {
        setIsModalOpen(false);
        setStatus({ success: adminTr.common.saved });
        window.location.reload();
        return;
      }

      setStatus({ error: result.error ?? adminTr.common.saveFailed });
    });
  }

  function confirmDelete(kind: ItemKind, id: string) {
    setDeleteTarget({ kind, id });
    setIsDeleteOpen(true);
  }

  function handleDelete() {
    if (!deleteTarget) {
      return;
    }

    startTransition(async () => {
      const result =
        deleteTarget.kind === "tech-card"
          ? await deleteHeroTechnologyCardAction(deleteTarget.id)
          : await deleteHeroStatAction(deleteTarget.id);

      setIsDeleteOpen(false);
      setDeleteTarget(null);

      if (result.success) {
        setStatus({ success: adminTr.common.deleted });
        window.location.reload();
        return;
      }

      setStatus({ error: result.error ?? adminTr.common.deleteFailed });
    });
  }

  return (
    <div className="space-y-10">
      <AdminPageHeader
        title={adminTr.hero.title}
        description={adminTr.hero.description}
        actions={
          <ButtonLink href={ROUTES.home} variant="outline" size="sm" target="_blank">
            {adminTr.hero.previewSite}
          </ButtonLink>
        }
      />

      {needsSetup ? (
        <div className="rounded-xl border border-accent/30 bg-accent/10 px-4 py-3">
          <Text variant="small">{adminTr.hero.setupNotice}</Text>
        </div>
      ) : null}

      <form action={handleSubmit} className="space-y-6">
        <AdminFormSection title={adminTr.hero.sections.content} description={adminTr.hero.sections.contentDesc}>
          <AdminTextField
            id="eyebrow"
            name="eyebrow"
            label={adminTr.hero.fields.eyebrow}
            defaultValue={initial.eyebrow}
          />
          <AdminTextField
            id="headline"
            name="headline"
            label={adminTr.hero.fields.headline}
            defaultValue={initial.headline}
          />
          <AdminTextField
            id="jobTitle"
            name="jobTitle"
            label={adminTr.hero.fields.jobTitle}
            defaultValue={initial.jobTitle}
          />
          <AdminTextareaField
            id="summary"
            name="summary"
            label={adminTr.hero.fields.summary}
            defaultValue={initial.summary}
          />
          <input type="hidden" name="technologyHighlightsTitle" value={initial.technologyHighlightsTitle} />
        </AdminFormSection>

        <AdminFormSection title={adminTr.hero.sections.cta}>
          <div className="grid gap-4 md:grid-cols-2">
            <AdminTextField
              id="primaryCtaLabel"
              name="primaryCtaLabel"
              label={adminTr.hero.fields.primaryCtaLabel}
              defaultValue={initial.primaryCta.label}
            />
            <AdminTextField
              id="primaryCtaHref"
              name="primaryCtaHref"
              label={adminTr.hero.fields.primaryCtaHref}
              defaultValue={initial.primaryCta.href}
            />
            <AdminSwitchField
              id="primaryCtaVisible"
              name="primaryCtaVisible"
              label={adminTr.hero.fields.primaryCtaVisible}
              defaultChecked={initial.primaryCta.visible}
            />
            <AdminTextField
              id="secondaryCtaLabel"
              name="secondaryCtaLabel"
              label={adminTr.hero.fields.secondaryCtaLabel}
              defaultValue={initial.secondaryCta.label}
            />
            <AdminTextField
              id="secondaryCtaHref"
              name="secondaryCtaHref"
              label={adminTr.hero.fields.secondaryCtaHref}
              defaultValue={initial.secondaryCta.href}
            />
            <AdminSwitchField
              id="secondaryCtaVisible"
              name="secondaryCtaVisible"
              label={adminTr.hero.fields.secondaryCtaVisible}
              defaultChecked={initial.secondaryCta.visible}
            />
          </div>
        </AdminFormSection>

        <AdminFormSection
          title={adminTr.hero.sections.profile}
          description={adminTr.hero.sections.profileDesc}
        >
          <AdminUploadField
            id="profileImageUrl"
            name="profileImageUrl"
            label={adminTr.hero.fields.profileImage}
            defaultValue={initial.profile.imageSrc ?? ""}
            accept="image/png,image/webp,image/jpeg"
            category="Hero"
          />
          <div className="grid gap-4 md:grid-cols-2">
            <AdminTextField
              id="profileImageAlt"
              name="profileImageAlt"
              label={adminTr.hero.fields.profileAlt}
              defaultValue={initial.profile.imageAlt}
            />
            <AdminTextField
              id="profileInitials"
              name="profileInitials"
              label={adminTr.hero.fields.profileInitials}
              defaultValue={initial.profile.initials}
            />
            <AdminSwitchField
              id="profileVisible"
              name="profileVisible"
              label={adminTr.hero.fields.profileVisible}
              defaultChecked={initial.profile.visible}
            />
          </div>
        </AdminFormSection>

        <AdminFormSection title={adminTr.hero.sections.background}>
          <AdminSwitchField
            id="statsEnabled"
            name="statsEnabled"
            label={adminTr.hero.fields.statsEnabled}
            defaultChecked={initial.statsEnabled}
          />
          <input type="hidden" name="orbitalLinesEnabled" value="off" />
        </AdminFormSection>

        <AdminFormStatus error={status.error} success={status.success} />

        <AdminFormActions>
          <Button type="submit" variant="primary" isLoading={isPending}>
            {adminTr.hero.save}
          </Button>
        </AdminFormActions>
      </form>

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-h4 text-foreground">{adminTr.hero.sections.techCards}</h2>
            <p className="mt-1 text-small text-muted-foreground">
              {adminTr.hero.sections.techCardsDesc}
            </p>
          </div>
          <Button type="button" variant="primary" size="sm" onClick={() => openCreateModal("tech-card")}>
            <Plus className="h-4 w-4" />
            {adminTr.hero.addTechCard}
          </Button>
        </div>

        <AdminDataTable
          data={techRows}
          columns={techColumns}
          getRowProps={(row) => ({
            onDragOver: (event: DragEvent<HTMLTableRowElement>) => {
              event.preventDefault();
            },
            onDrop: () => handleDrop("tech-card", row.id),
            className: draggingId === row.id && dragKind === "tech-card" ? "opacity-50" : undefined,
          })}
          rowActions={(row) => (
            <div className="flex items-center gap-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => openEditModal("tech-card", row)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => confirmDelete("tech-card", row.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
          emptyTitle={adminTr.hero.emptyTechCards}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-h4 text-foreground">{adminTr.hero.sections.stats}</h2>
            <p className="mt-1 text-small text-muted-foreground">
              {adminTr.hero.sections.statsDesc}
            </p>
          </div>
          <Button type="button" variant="primary" size="sm" onClick={() => openCreateModal("stat")}>
            <Plus className="h-4 w-4" />
            {adminTr.hero.addStat}
          </Button>
        </div>

        <AdminDataTable
          data={statRows}
          columns={statColumns}
          getRowProps={(row) => ({
            onDragOver: (event: DragEvent<HTMLTableRowElement>) => {
              event.preventDefault();
            },
            onDrop: () => handleDrop("stat", row.id),
            className: draggingId === row.id && dragKind === "stat" ? "opacity-50" : undefined,
          })}
          rowActions={(row) => (
            <div className="flex items-center gap-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => openEditModal("stat", row)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => confirmDelete("stat", row.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
          emptyTitle={adminTr.hero.emptyStats}
        />
      </div>

      <HeroSocialAdminSection initialLinks={socialLinks} />

      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalKind === "tech-card" ? adminTr.hero.modalTechTitle : adminTr.hero.modalStatTitle}
      >
        <form action={handleItemSubmit} className="space-y-4">
          {modalKind === "tech-card" ? (
            <>
              {selectedTech ? <input type="hidden" name="id" value={selectedTech.id} /> : null}
              <AdminHeroTechIconField
                key={selectedTech?.id ?? "new-tech-card"}
                defaultValue={selectedTech?.icon ?? ""}
              />
              <AdminTextField
                id="title"
                name="title"
                label={adminTr.hero.fields.techTitle}
                defaultValue={selectedTech?.title ?? ""}
                required
              />
              <AdminTextField
                id="href"
                name="href"
                label={adminTr.hero.fields.techHref}
                defaultValue={selectedTech?.href ?? ""}
              />
              <AdminSelectField
                id="position"
                name="position"
                label={adminTr.hero.fields.techPosition}
                defaultValue={String(selectedTech?.position ?? 0)}
                options={[...HERO_TECH_POSITION_OPTIONS]}
              />
              <AdminSwitchField
                id="visible"
                name="visible"
                label={adminTr.common.active}
                defaultChecked={selectedTech?.visible ?? true}
              />
            </>
          ) : (
            <>
              {selectedStat ? <input type="hidden" name="id" value={selectedStat.id} /> : null}
              <AdminSelectField
                id="icon"
                name="icon"
                label={adminTr.hero.fields.statIcon}
                defaultValue={selectedStat?.icon ?? "code"}
                options={[...HERO_STAT_ICON_OPTIONS]}
              />
              <AdminTextField
                id="value"
                name="value"
                label={adminTr.hero.fields.statValue}
                defaultValue={selectedStat?.value ?? ""}
                required
              />
              <AdminTextField
                id="label"
                name="label"
                label={adminTr.hero.fields.statLabel}
                defaultValue={selectedStat?.label ?? ""}
                required
              />
              <AdminSwitchField
                id="visible"
                name="visible"
                label={adminTr.common.active}
                defaultChecked={selectedStat?.visible ?? true}
              />
            </>
          )}

          <AdminFormActions>
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              {adminTr.common.cancel}
            </Button>
            <Button type="submit" variant="primary" isLoading={isPending || isReorderPending}>
              {adminTr.common.save}
            </Button>
          </AdminFormActions>
        </form>
      </AdminModal>

      <AdminConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title={adminTr.common.delete}
        description={adminTr.hero.deleteConfirm}
        confirmLabel={adminTr.common.delete}
        isLoading={isPending}
        variant="danger"
      />
    </div>
  );
}
