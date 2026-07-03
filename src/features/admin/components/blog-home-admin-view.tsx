"use client";

import { GripVertical, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition, type DragEvent } from "react";

import {
  addBlogHomeCuratedPostAction,
  removeBlogHomeCuratedPostAction,
  reorderBlogHomeCuratedPostsAction,
  saveBlogHomeConfigAction,
} from "@/features/admin/actions/content.actions";
import { BlogAdminNav } from "@/features/admin/blog/components/blog-admin-nav";
import { AdminSectionHeaderFields } from "@/features/admin/components/admin-section-header-fields";
import { AdminFormStatus } from "@/features/admin/components/admin-form-status";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { adminTr } from "@/features/admin/i18n/tr";
import { ADMIN_ROUTES } from "@/config/admin-routes.config";
import {
  AdminDataTable,
  type AdminTableColumn,
  AdminFormActions,
  AdminFormSection,
  AdminSwitchField,
  AdminTextField,
} from "@/features/admin/ui";
import { Button } from "@/components/ui/button";
import type { BlogHomeSelectionMode } from "@/types/blog-home";

export interface BlogHomeConfigRow {
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
  postLimit: number;
  selectionMode: BlogHomeSelectionMode;
  readMoreLabel: string;
  ctaLabel: string;
  ctaHref: string;
}

export interface BlogHomeCuratedRow {
  id: string;
  blogPostId: string;
  sortOrder: number;
  visible: boolean;
  title: string;
  slug: string;
  status: string;
}

interface PublishedPostOption {
  id: string;
  title: string;
  slug: string;
  publishedAt: Date | null;
}

interface BlogHomeAdminViewProps {
  config: BlogHomeConfigRow;
  curatedPosts: BlogHomeCuratedRow[];
  publishedPosts: PublishedPostOption[];
}

export function BlogHomeAdminView({
  config,
  curatedPosts: initialCurated,
  publishedPosts,
}: BlogHomeAdminViewProps) {
  const router = useRouter();
  const [status, setStatus] = useState<{ success?: string; error?: string }>({});
  const [rows, setRows] = useState(initialCurated);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [selectedPostId, setSelectedPostId] = useState("");
  const [isConfigPending, startConfigTransition] = useTransition();
  const [isCuratedPending, startCuratedTransition] = useTransition();
  const [, startReorderTransition] = useTransition();

  useEffect(() => {
    setRows(initialCurated);
  }, [initialCurated]);

  const availablePosts = useMemo(
    () => publishedPosts.filter((post) => !rows.some((row) => row.blogPostId === post.id)),
    [publishedPosts, rows],
  );

  const columns = useMemo<AdminTableColumn<BlogHomeCuratedRow>[]>(
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
            aria-label={adminTr.blogHome.reorderHandle}
          >
            <GripVertical className="h-4 w-4" />
          </button>
        ),
      },
      {
        id: "title",
        header: adminTr.blogHome.columns.title,
        sortValue: (row) => row.title,
        accessor: (row) => (
          <div>
            <p className="font-medium text-foreground">{row.title}</p>
            <p className="text-caption text-muted-foreground">/{row.slug}</p>
          </div>
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
      const result = await reorderBlogHomeCuratedPostsAction(nextRows.map((row) => row.id));
      setStatus(
        result.success
          ? { success: adminTr.blogHome.reorderSaved }
          : { error: result.error ?? adminTr.common.saveFailed },
      );
      if (result.success) {
        router.refresh();
      }
    });
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title={adminTr.blogHome.title}
        description={adminTr.blogHome.description}
      />

      <BlogAdminNav />

      <AdminFormStatus error={status.error} success={status.success} />

      <form
        action={(formData) => {
          startConfigTransition(async () => {
            const result = await saveBlogHomeConfigAction(formData);
            setStatus(
              result.success
                ? { success: adminTr.common.saved }
                : { error: result.error ?? adminTr.common.saveFailed },
            );
            if (result.success) {
              router.refresh();
            }
          });
        }}
        className="admin-surface space-y-6 rounded-xl border p-6"
      >
        <AdminFormSection
          title={adminTr.blogHome.sections.config}
          description={adminTr.blogHome.sections.configDesc}
        >
          <AdminSectionHeaderFields
            idPrefix="blog-home"
            labels={{
              label: adminTr.blogHome.fields.label,
              title: adminTr.blogHome.fields.title,
              titleAccent: adminTr.blogHome.fields.titleAccent,
              description: adminTr.blogHome.fields.description,
            }}
            values={{
              label: config.label,
              title: config.title,
              titleAccent: config.titleAccent,
              description: config.description,
            }}
            labelRowEnd={
              <AdminTextField
                id="blog-home-section-number"
                name="sectionNumber"
                label={adminTr.blogHome.fields.sectionNumber}
                defaultValue={config.sectionNumber}
                required
              />
            }
            titleFieldsInGrid
            afterDescription={
              <AdminSwitchField
                id="blog-home-visible"
                name="visible"
                label={adminTr.blogHome.fields.visible}
                defaultChecked={config.visible}
              />
            }
          />

          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-1 text-small">
              <span>{adminTr.blogHome.fields.postLimit}</span>
              <select
                name="postLimit"
                defaultValue={String(config.postLimit)}
                className="rounded-lg border bg-background px-3 py-2"
                required
              >
                <option value="3">3</option>
                <option value="6">6</option>
                <option value="9">9</option>
              </select>
            </label>
            <label className="flex flex-col gap-1 text-small">
              <span>{adminTr.blogHome.fields.selectionMode}</span>
              <select
                name="selectionMode"
                defaultValue={config.selectionMode}
                className="rounded-lg border bg-background px-3 py-2"
              >
                <option value="latest">{adminTr.blogHome.selectionModes.latest}</option>
                <option value="featured">{adminTr.blogHome.selectionModes.featured}</option>
                <option value="curated">{adminTr.blogHome.selectionModes.curated}</option>
              </select>
            </label>
          </div>

          <AdminTextField
            id="blog-home-read-more"
            name="readMoreLabel"
            label={adminTr.blogHome.fields.readMoreLabel}
            defaultValue={config.readMoreLabel}
            required
          />

          <div className="grid gap-4 md:grid-cols-2">
            <AdminTextField
              id="blog-home-cta-label"
              name="ctaLabel"
              label={adminTr.blogHome.fields.ctaLabel}
              defaultValue={config.ctaLabel}
            />
            <AdminTextField
              id="blog-home-cta-href"
              name="ctaHref"
              label={adminTr.blogHome.fields.ctaHref}
              defaultValue={config.ctaHref}
            />
          </div>
        </AdminFormSection>

        <AdminFormSection title={adminTr.blogHome.sections.carousel}>
          <div className="grid gap-4 md:grid-cols-2">
            <AdminSwitchField
              id="blog-home-carousel-enabled"
              name="carouselEnabled"
              label={adminTr.blogHome.fields.carouselEnabled}
              defaultChecked={config.carouselEnabled}
            />
            <AdminSwitchField
              id="blog-home-autoplay"
              name="autoplay"
              label={adminTr.blogHome.fields.autoplay}
              defaultChecked={config.autoplay}
            />
            <AdminSwitchField
              id="blog-home-loop"
              name="loop"
              label={adminTr.blogHome.fields.loop}
              defaultChecked={config.loop}
            />
            <AdminTextField
              id="blog-home-autoplay-delay"
              name="autoplayDelayMs"
              label={adminTr.blogHome.fields.autoplayDelayMs}
              defaultValue={String(config.autoplayDelayMs)}
            />
          </div>
        </AdminFormSection>

        <AdminFormActions>
          <Button type="submit" variant="primary" isLoading={isConfigPending}>
            {adminTr.blogHome.saveSection}
          </Button>
        </AdminFormActions>
      </form>

      <div className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-h4 text-foreground">{adminTr.blogHome.sections.curated}</h2>
            <p className="text-small text-muted-foreground">
              {adminTr.blogHome.sections.curatedDesc}
            </p>
          </div>
          <div className="flex flex-wrap items-end gap-3">
            <label className="flex min-w-[16rem] flex-col gap-1 text-small">
              <span>{adminTr.blogHome.fields.addPost}</span>
              <select
                value={selectedPostId}
                onChange={(event) => setSelectedPostId(event.target.value)}
                className="rounded-lg border bg-background px-3 py-2"
              >
                <option value="">{adminTr.blogHome.fields.selectPost}</option>
                {availablePosts.map((post) => (
                  <option key={post.id} value={post.id}>
                    {post.title}
                  </option>
                ))}
              </select>
            </label>
            <Button
              type="button"
              variant="secondary"
              disabled={!selectedPostId || isCuratedPending}
              onClick={() => {
                if (!selectedPostId) return;
                startCuratedTransition(async () => {
                  const result = await addBlogHomeCuratedPostAction(selectedPostId);
                  setStatus(
                    result.success
                      ? { success: adminTr.common.saved }
                      : { error: result.error ?? adminTr.common.saveFailed },
                  );
                  if (result.success) {
                    setSelectedPostId("");
                    router.refresh();
                  }
                });
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              {adminTr.blogHome.addPost}
            </Button>
          </div>
        </div>

        <AdminDataTable
          data={rows}
          columns={columns}
          searchFilter={(row, query) =>
            `${row.title} ${row.slug}`.toLowerCase().includes(query)
          }
          emptyTitle={adminTr.blogHome.emptyCurated}
          getRowProps={(row) => ({
            onDragOver: (event: DragEvent<HTMLTableRowElement>) => {
              event.preventDefault();
            },
            onDrop: () => handleDrop(row.id),
            className: draggingId === row.id ? "opacity-50" : undefined,
          })}
          rowActions={(row) => (
            <div className="flex justify-end gap-2">
              <Button asChild variant="ghost" size="sm">
                <Link href={`${ADMIN_ROUTES.blog}/${row.blogPostId}/edit`}>
                  {adminTr.common.edit}
                </Link>
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  startCuratedTransition(async () => {
                    const result = await removeBlogHomeCuratedPostAction(row.id);
                    setStatus(
                      result.success
                        ? { success: adminTr.common.saved }
                        : { error: result.error ?? adminTr.common.saveFailed },
                    );
                    if (result.success) {
                      router.refresh();
                    }
                  });
                }}
              >
                <Trash2 className="h-4 w-4 text-error" />
              </Button>
            </div>
          )}
        />
      </div>
    </div>
  );
}
