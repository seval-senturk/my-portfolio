"use client";

import { GripVertical, Pencil, Plus, Trash2 } from "lucide-react";
import { useMemo, useState, useTransition, type DragEvent } from "react";

import {
  deleteProjectAction,
  deleteProjectFilterAction,
  reorderProjectEntriesAction,
  reorderProjectFiltersAction,
  saveProjectAction,
  saveProjectFilterAction,
  saveProjectsPageConfigAction,
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
  AdminSelectField,
  AdminSwitchField,
  AdminTextField,
  AdminTextareaField,
  AdminUploadField,
} from "@/features/admin/ui";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface ProjectsPageConfigRow {
  label: string;
  sectionTitle: string;
  titleAccent?: string | null;
  sectionDescription: string;
  featuredTitle: string;
  additionalTitle: string;
  ctaTitle: string;
  ctaDescription: string;
  ctaButtonLabel: string;
  ctaButtonHref: string;
  ctaVisible: boolean;
  sectionVisible: boolean;
  homeSectionVisible: boolean;
  homeFeaturedLimit: number;
  homeSectionDescription?: string | null;
  homeCtaLabel: string;
  homeCtaHref: string;
}

export interface ProjectFilterAdminRow {
  id: string;
  label: string;
  slug: string;
  matchType: string;
  matchValue: string;
  visible: boolean;
}

export interface ProjectAdminRow {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  category: string;
  status?: string | null;
  client?: string | null;
  role: string;
  featured: boolean;
  coverImageUrl?: string | null;
  coverImageAlt?: string | null;
  projectType?: string | null;
  visible?: boolean;
  githubUrl?: string | null;
  liveUrl?: string | null;
  technologies: string[];
  highlights: string[];
}

interface ProjectsAdminViewProps {
  config: ProjectsPageConfigRow;
  filters: ProjectFilterAdminRow[];
  entries: ProjectAdminRow[];
}

const FILTER_MATCH_TYPES = [
  { value: "category", label: adminTr.projects.filterTypes.category },
  { value: "projectType", label: adminTr.projects.filterTypes.projectType },
] as const;

export function ProjectsAdminView({ config, filters, entries }: ProjectsAdminViewProps) {
  const [rows, setRows] = useState(entries);
  const [filterRows, setFilterRows] = useState(filters);
  const [draggingProjectId, setDraggingProjectId] = useState<string | null>(null);
  const [draggingFilterId, setDraggingFilterId] = useState<string | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isDeleteProjectOpen, setIsDeleteProjectOpen] = useState(false);
  const [isDeleteFilterOpen, setIsDeleteFilterOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectAdminRow | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<ProjectFilterAdminRow | null>(null);
  const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null);
  const [deleteFilterId, setDeleteFilterId] = useState<string | null>(null);
  const [status, setStatus] = useState<{ error?: string; success?: string }>({});
  const [isPending, startTransition] = useTransition();
  const [isConfigPending, startConfigTransition] = useTransition();

  const projectColumns = useMemo<AdminTableColumn<ProjectAdminRow>[]>(
    () => [
      {
        id: "order",
        header: "",
        accessor: (row) => (
          <button
            type="button"
            draggable
            onDragStart={() => setDraggingProjectId(row.id)}
            onDragEnd={() => setDraggingProjectId(null)}
            className="cursor-grab text-muted-foreground active:cursor-grabbing"
            aria-label={adminTr.projects.reorderHandle}
          >
            <GripVertical className="h-4 w-4" />
          </button>
        ),
      },
      {
        id: "title",
        header: adminTr.projects.columns.project,
        sortValue: (row) => row.title,
        accessor: (row) => (
          <div>
            <p className="font-medium">{row.title}</p>
            <p className="text-caption text-muted-foreground">{row.slug}</p>
          </div>
        ),
      },
      {
        id: "category",
        header: adminTr.projects.columns.category,
        sortValue: (row) => row.category,
        accessor: (row) => row.category,
      },
      {
        id: "featured",
        header: adminTr.projects.columns.featured,
        accessor: (row) => (
          <Badge variant={row.featured ? "accent" : "outline"}>
            {row.featured ? adminTr.common.yes : adminTr.common.no}
          </Badge>
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

  const filterColumns = useMemo<AdminTableColumn<ProjectFilterAdminRow>[]>(
    () => [
      {
        id: "order",
        header: "",
        accessor: (row) => (
          <button
            type="button"
            draggable
            onDragStart={() => setDraggingFilterId(row.id)}
            onDragEnd={() => setDraggingFilterId(null)}
            className="cursor-grab text-muted-foreground active:cursor-grabbing"
            aria-label={adminTr.projects.reorderHandle}
          >
            <GripVertical className="h-4 w-4" />
          </button>
        ),
      },
      {
        id: "label",
        header: adminTr.projects.columns.filter,
        sortValue: (row) => row.label,
        accessor: (row) => (
          <div>
            <p className="font-medium">{row.label}</p>
            <p className="text-caption text-muted-foreground">{row.slug}</p>
          </div>
        ),
      },
      {
        id: "match",
        header: adminTr.projects.columns.match,
        accessor: (row) => (
          <span className="text-small text-muted-foreground">
            {row.matchType}: {row.matchValue}
          </span>
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

  function handleProjectDrop(targetId: string) {
    if (!draggingProjectId || draggingProjectId === targetId) return;

    const nextRows = [...rows];
    const fromIndex = nextRows.findIndex((row) => row.id === draggingProjectId);
    const toIndex = nextRows.findIndex((row) => row.id === targetId);
    if (fromIndex < 0 || toIndex < 0) return;

    const [moved] = nextRows.splice(fromIndex, 1);
    nextRows.splice(toIndex, 0, moved!);
    setRows(nextRows);
    setDraggingProjectId(null);

    startTransition(async () => {
      const result = await reorderProjectEntriesAction(nextRows.map((row) => row.id));
      setStatus(
        result.success
          ? { success: adminTr.projects.reorderSaved }
          : { error: result.error ?? adminTr.common.saveFailed },
      );
    });
  }

  function handleFilterDrop(targetId: string) {
    if (!draggingFilterId || draggingFilterId === targetId) return;

    const nextRows = [...filterRows];
    const fromIndex = nextRows.findIndex((row) => row.id === draggingFilterId);
    const toIndex = nextRows.findIndex((row) => row.id === targetId);
    if (fromIndex < 0 || toIndex < 0) return;

    const [moved] = nextRows.splice(fromIndex, 1);
    nextRows.splice(toIndex, 0, moved!);
    setFilterRows(nextRows);
    setDraggingFilterId(null);

    startTransition(async () => {
      const result = await reorderProjectFiltersAction(nextRows.map((row) => row.id));
      setStatus(
        result.success
          ? { success: adminTr.projects.filterReorderSaved }
          : { error: result.error ?? adminTr.common.saveFailed },
      );
    });
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title={adminTr.projects.title}
        description={adminTr.projects.description}
      />

      <AdminFormStatus error={status.error} success={status.success} />

      <form
        action={(formData) => {
          startConfigTransition(async () => {
            const result = await saveProjectsPageConfigAction(formData);
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
          title={adminTr.projects.sections.config}
          description={adminTr.projects.sections.configDesc}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <AdminTextField
              id="label"
              name="label"
              label={adminTr.projects.fields.label}
              defaultValue={config.label}
              required
            />
            <AdminTextField
              id="sectionTitle"
              name="sectionTitle"
              label={adminTr.projects.fields.sectionTitle}
              defaultValue={config.sectionTitle}
              required
            />
            <AdminTextField
              id="titleAccent"
              name="titleAccent"
              label={adminTr.projects.fields.titleAccent}
              defaultValue={config.titleAccent ?? undefined}
            />
            <AdminSwitchField
              id="sectionVisible"
              name="sectionVisible"
              label={adminTr.projects.fields.sectionVisible}
              defaultChecked={config.sectionVisible}
            />
          </div>
          <AdminTextareaField
            id="sectionDescription"
            name="sectionDescription"
            label={adminTr.projects.fields.sectionDescription}
            defaultValue={config.sectionDescription}
            required
          />
          <div className="grid gap-4 md:grid-cols-2">
            <AdminTextField
              id="featuredTitle"
              name="featuredTitle"
              label={adminTr.projects.fields.featuredTitle}
              defaultValue={config.featuredTitle}
              required
            />
            <AdminTextField
              id="additionalTitle"
              name="additionalTitle"
              label={adminTr.projects.fields.additionalTitle}
              defaultValue={config.additionalTitle}
              required
            />
          </div>
        </AdminFormSection>

        <AdminFormSection
          title={adminTr.projects.sections.home}
          description={adminTr.projects.sections.homeDesc}
        >
          <AdminSwitchField
            id="homeSectionVisible"
            name="homeSectionVisible"
            label={adminTr.projects.fields.homeSectionVisible}
            defaultChecked={config.homeSectionVisible}
          />
          <AdminSelectField
            id="homeFeaturedLimit"
            name="homeFeaturedLimit"
            label={adminTr.projects.fields.homeFeaturedLimit}
            options={[
              { value: "1", label: "1" },
              { value: "2", label: "2" },
              { value: "3", label: "3" },
              { value: "4", label: "4" },
              { value: "5", label: "5" },
              { value: "6", label: "6" },
            ]}
            defaultValue={String(config.homeFeaturedLimit)}
            required
          />
          <AdminTextareaField
            id="homeSectionDescription"
            name="homeSectionDescription"
            label={adminTr.projects.fields.homeSectionDescription}
            defaultValue={config.homeSectionDescription ?? undefined}
          />
          <div className="grid gap-4 md:grid-cols-2">
            <AdminTextField
              id="homeCtaLabel"
              name="homeCtaLabel"
              label={adminTr.projects.fields.homeCtaLabel}
              defaultValue={config.homeCtaLabel}
              required
            />
            <AdminTextField
              id="homeCtaHref"
              name="homeCtaHref"
              label={adminTr.projects.fields.homeCtaHref}
              defaultValue={config.homeCtaHref}
              required
            />
          </div>
        </AdminFormSection>

        <AdminFormSection title={adminTr.projects.sections.cta}>
          <div className="grid gap-4 md:grid-cols-2">
            <AdminTextField
              id="ctaTitle"
              name="ctaTitle"
              label={adminTr.projects.fields.ctaTitle}
              defaultValue={config.ctaTitle}
              required
            />
            <AdminTextField
              id="ctaButtonLabel"
              name="ctaButtonLabel"
              label={adminTr.projects.fields.ctaButtonLabel}
              defaultValue={config.ctaButtonLabel}
              required
            />
          </div>
          <AdminTextareaField
            id="ctaDescription"
            name="ctaDescription"
            label={adminTr.projects.fields.ctaDescription}
            defaultValue={config.ctaDescription}
            required
          />
          <AdminTextField
            id="ctaButtonHref"
            name="ctaButtonHref"
            label={adminTr.projects.fields.ctaButtonHref}
            defaultValue={config.ctaButtonHref}
            required
          />
          <AdminSwitchField
            id="ctaVisible"
            name="ctaVisible"
            label={adminTr.projects.fields.ctaVisible}
            defaultChecked={config.ctaVisible}
          />
        </AdminFormSection>

        <AdminFormActions>
          <Button type="submit" variant="primary" isLoading={isConfigPending}>
            {adminTr.projects.saveSection}
          </Button>
        </AdminFormActions>
      </form>

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-h4 text-foreground">{adminTr.projects.sections.filters}</h2>
            <p className="mt-1 text-small text-muted-foreground">
              {adminTr.projects.sections.filtersDesc}
            </p>
          </div>
          <Button
            type="button"
            variant="primary"
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => {
              setSelectedFilter(null);
              setIsFilterModalOpen(true);
            }}
          >
            {adminTr.projects.addFilter}
          </Button>
        </div>

        <AdminDataTable
          data={filterRows}
          columns={filterColumns}
          searchFilter={(row, query) =>
            `${row.label} ${row.slug} ${row.matchValue}`.toLowerCase().includes(query)
          }
          getRowProps={(row) => ({
            onDragOver: (event: DragEvent<HTMLTableRowElement>) => {
              event.preventDefault();
            },
            onDrop: () => handleFilterDrop(row.id),
            className: draggingFilterId === row.id ? "opacity-50" : undefined,
          })}
          rowActions={(row) => (
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedFilter(row);
                  setIsFilterModalOpen(true);
                }}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setDeleteFilterId(row.id);
                  setIsDeleteFilterOpen(true);
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
            <h2 className="text-h4 text-foreground">{adminTr.projects.sections.entries}</h2>
            <p className="mt-1 text-small text-muted-foreground">
              {adminTr.projects.sections.entriesDesc}
            </p>
          </div>
          <Button
            type="button"
            variant="primary"
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => {
              setSelectedProject(null);
              setIsProjectModalOpen(true);
            }}
          >
            {adminTr.projects.add}
          </Button>
        </div>

        <AdminDataTable
          data={rows}
          columns={projectColumns}
          searchFilter={(row, query) =>
            `${row.title} ${row.category} ${row.slug}`.toLowerCase().includes(query)
          }
          getRowProps={(row) => ({
            onDragOver: (event: DragEvent<HTMLTableRowElement>) => {
              event.preventDefault();
            },
            onDrop: () => handleProjectDrop(row.id),
            className: draggingProjectId === row.id ? "opacity-50" : undefined,
          })}
          rowActions={(row) => (
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedProject(row);
                  setIsProjectModalOpen(true);
                }}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setDeleteProjectId(row.id);
                  setIsDeleteProjectOpen(true);
                }}
              >
                <Trash2 className="h-4 w-4 text-error" />
              </Button>
            </div>
          )}
        />
      </div>

      <AdminModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        title={selectedFilter ? adminTr.projects.editFilter : adminTr.projects.addFilter}
        footer={
          <Button type="submit" form="project-filter-form" variant="primary" isLoading={isPending}>
            {adminTr.projects.saveFilter}
          </Button>
        }
      >
        <form
          id="project-filter-form"
          className="space-y-4"
          action={(formData) => {
            if (selectedFilter) formData.set("id", selectedFilter.id);
            startTransition(async () => {
              const result = await saveProjectFilterAction(formData);
              if (result.success) {
                setIsFilterModalOpen(false);
                setStatus({ success: adminTr.common.saved });
                window.location.reload();
              } else {
                setStatus({ error: result.error });
              }
            });
          }}
        >
          <AdminFormSection title={adminTr.projects.sections.filterDetails}>
            <AdminTextField
              id="filterLabel"
              name="label"
              label={adminTr.projects.fields.filterLabel}
              defaultValue={selectedFilter?.label}
              required
            />
            <AdminTextField
              id="filterSlug"
              name="slug"
              label={adminTr.projects.fields.filterSlug}
              defaultValue={selectedFilter?.slug}
              required
            />
            <AdminSelectField
              id="matchType"
              name="matchType"
              label={adminTr.projects.fields.matchType}
              options={FILTER_MATCH_TYPES.map((option) => ({
                value: option.value,
                label: option.label,
              }))}
              defaultValue={selectedFilter?.matchType ?? "category"}
              required
            />
            <AdminTextField
              id="matchValue"
              name="matchValue"
              label={adminTr.projects.fields.matchValue}
              defaultValue={selectedFilter?.matchValue}
              required
            />
            <AdminSwitchField
              id="filterVisible"
              name="visible"
              label={adminTr.projects.fields.filterVisible}
              defaultChecked={selectedFilter?.visible ?? true}
            />
          </AdminFormSection>
        </form>
      </AdminModal>

      <AdminModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        title={selectedProject ? adminTr.projects.edit : adminTr.projects.add}
        size="xl"
        footer={
          <Button type="submit" form="project-admin-form" variant="primary" isLoading={isPending}>
            {adminTr.projects.saveProject}
          </Button>
        }
      >
        <form
          id="project-admin-form"
          className="space-y-4"
          action={(formData) => {
            if (selectedProject) formData.set("id", selectedProject.id);
            startTransition(async () => {
              const result = await saveProjectAction(formData);
              if (result.success) {
                setIsProjectModalOpen(false);
                setStatus({ success: adminTr.common.saved });
                window.location.reload();
              } else {
                setStatus({ error: result.error });
              }
            });
          }}
        >
          <AdminFormSection title={adminTr.projects.sections.details}>
            <div className="grid gap-4 md:grid-cols-2">
              <AdminTextField
                id="title"
                name="title"
                label="Title"
                defaultValue={selectedProject?.title}
                required
              />
              <AdminTextField
                id="slug"
                name="slug"
                label="Slug"
                defaultValue={selectedProject?.slug}
                required
              />
              <AdminTextField
                id="category"
                name="category"
                label="Category"
                defaultValue={selectedProject?.category}
                required
              />
              <AdminTextField
                id="status"
                name="status"
                label="Status"
                defaultValue={selectedProject?.status ?? undefined}
              />
              <AdminTextField
                id="role"
                name="role"
                label="Role"
                defaultValue={selectedProject?.role}
                required
              />
              <AdminTextField
                id="client"
                name="client"
                label="Client"
                defaultValue={selectedProject?.client ?? undefined}
              />
              <AdminTextField
                id="projectType"
                name="projectType"
                label="Project type"
                defaultValue={selectedProject?.projectType ?? undefined}
              />
            </div>
            <div className="flex flex-wrap gap-6">
              <AdminSwitchField
                id="featured"
                name="featured"
                label={adminTr.projects.featuredLabel}
                defaultChecked={selectedProject?.featured ?? false}
              />
              <AdminSwitchField
                id="visible"
                name="visible"
                label="Visible"
                defaultChecked={selectedProject?.visible ?? true}
              />
            </div>
            <AdminTextareaField
              id="shortDescription"
              name="shortDescription"
              label="Short description"
              defaultValue={selectedProject?.shortDescription}
              required
            />
            <AdminTextareaField
              id="longDescription"
              name="longDescription"
              label="Long description"
              defaultValue={selectedProject?.longDescription}
              required
            />
            <AdminUploadField
              id="coverImageUrl"
              name="coverImageUrl"
              label="Cover image URL"
              defaultValue={selectedProject?.coverImageUrl ?? undefined}
            />
            <AdminTextField
              id="coverImageAlt"
              name="coverImageAlt"
              label="Cover image alt"
              defaultValue={selectedProject?.coverImageAlt ?? undefined}
            />
            <AdminTextField
              id="githubUrl"
              name="githubUrl"
              label="GitHub URL"
              defaultValue={selectedProject?.githubUrl ?? undefined}
            />
            <AdminTextField
              id="liveUrl"
              name="liveUrl"
              label="Live URL"
              defaultValue={selectedProject?.liveUrl ?? undefined}
            />
            <AdminTextField
              id="technologies"
              name="technologies"
              label="Technologies (comma-separated)"
              defaultValue={selectedProject?.technologies.join(", ")}
            />
            <AdminTextareaField
              id="highlights"
              name="highlights"
              label="Highlights (one per line)"
              defaultValue={selectedProject?.highlights.join("\n")}
            />
          </AdminFormSection>
        </form>
      </AdminModal>

      <AdminConfirmDialog
        isOpen={isDeleteProjectOpen}
        onClose={() => setIsDeleteProjectOpen(false)}
        onConfirm={() => {
          if (!deleteProjectId) return;
          startTransition(async () => {
            const result = await deleteProjectAction(deleteProjectId);
            if (result.success) {
              setRows((current) => current.filter((row) => row.id !== deleteProjectId));
              setStatus({ success: adminTr.common.deleted });
            } else {
              setStatus({ error: result.error });
            }
            setIsDeleteProjectOpen(false);
          });
        }}
        title={adminTr.projects.deleteTitle}
        description={adminTr.projects.deleteDesc}
        confirmLabel={adminTr.common.delete}
        variant="danger"
        isLoading={isPending}
      />

      <AdminConfirmDialog
        isOpen={isDeleteFilterOpen}
        onClose={() => setIsDeleteFilterOpen(false)}
        onConfirm={() => {
          if (!deleteFilterId) return;
          startTransition(async () => {
            const result = await deleteProjectFilterAction(deleteFilterId);
            if (result.success) {
              setFilterRows((current) => current.filter((row) => row.id !== deleteFilterId));
              setStatus({ success: adminTr.common.deleted });
            } else {
              setStatus({ error: result.error });
            }
            setIsDeleteFilterOpen(false);
          });
        }}
        title={adminTr.projects.deleteFilterTitle}
        description={adminTr.projects.deleteFilterDesc}
        confirmLabel={adminTr.common.delete}
        variant="danger"
        isLoading={isPending}
      />
    </div>
  );
}
