"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useMemo, useState, useTransition } from "react";

import { ADMIN_ROUTES } from "@/config/admin-routes.config";
import { saveBlogPostAction } from "@/features/admin/actions/blog.actions";
import { AdminFormStatus } from "@/features/admin/components/admin-form-status";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { adminTr } from "@/features/admin/i18n/tr";
import { generateSlugFromTitle } from "@/lib/blog";
import {
  AdminFormActions,
  AdminFormSection,
  AdminSelectField,
  AdminSwitchField,
  AdminTextField,
  AdminTextareaField,
  AdminUploadField,
} from "@/features/admin/ui";
import { Button } from "@/components/ui/button";

const BlogRichTextEditor = dynamic(
  () =>
    import("@/features/admin/blog/components/blog-rich-text-editor").then(
      (mod) => mod.BlogRichTextEditor,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[360px] rounded-xl border border-border bg-muted/30 p-6 text-small text-muted-foreground">
        {adminTr.blog.loadingEditor}
      </div>
    ),
  },
);

export interface BlogPostFormValues {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  contentHtml: string;
  contentJson?: Record<string, unknown>;
  authorName: string;
  status: "draft" | "published" | "scheduled" | "archived";
  featured: boolean;
  coverImageUrl: string;
  coverImageAlt: string;
  categoryIds: string[];
  tagIds: string[];
  scheduledAt: string;
  seo: {
    metaTitle: string;
    metaDescription: string;
    canonicalUrl: string;
    focusKeyword: string;
    seoNotes: string;
    ogImageUrl: string;
    ogImageAlt: string;
    ogType: string;
    twitterImageUrl: string;
    twitterCardType: string;
    keywords: string;
  };
}

interface BlogCategoryOption {
  id: string;
  name: string;
}

interface BlogTagOption {
  id: string;
  name: string;
}

interface BlogPostFormProps {
  initial: BlogPostFormValues;
  categories: BlogCategoryOption[];
  tags: BlogTagOption[];
  mode: "create" | "edit";
}

export function BlogPostForm({ initial, categories, tags, mode }: BlogPostFormProps) {
  const [values, setValues] = useState(initial);
  const [editorContent, setEditorContent] = useState({
    json: initial.contentJson,
    html: initial.contentHtml,
  });
  const [status, setStatus] = useState<{ error?: string; success?: string }>({});
  const [isPending, startTransition] = useTransition();

  const previewHref = useMemo(() => {
    if (!values.id) return null;
    return `${ADMIN_ROUTES.blog}/${values.id}/preview`;
  }, [values.id]);

  function updateField<K extends keyof BlogPostFormValues>(key: K, value: BlogPostFormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function toggleId(listKey: "categoryIds" | "tagIds", id: string) {
    setValues((current) => {
      const exists = current[listKey].includes(id);
      return {
        ...current,
        [listKey]: exists
          ? current[listKey].filter((item) => item !== id)
          : [...current[listKey], id],
      };
    });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.set("contentHtml", editorContent.html);
    if (editorContent.json) {
      formData.set("contentJson", JSON.stringify(editorContent.json));
    }

    startTransition(async () => {
      const result = await saveBlogPostAction(formData);
      if (!result.success) {
        setStatus({ error: result.error });
        return;
      }

      setStatus({ success: adminTr.common.saved });
      if (mode === "create" && result.data?.id) {
        window.location.href = `${ADMIN_ROUTES.blog}/${result.data.id}/edit`;
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {values.id ? <input type="hidden" name="id" value={values.id} /> : null}
      <input type="hidden" name="contentHtml" value={editorContent.html} />
      <input
        type="hidden"
        name="contentJson"
        value={editorContent.json ? JSON.stringify(editorContent.json) : ""}
      />

      <AdminPageHeader
        title={mode === "create" ? adminTr.blog.newPost : adminTr.blog.editPost}
        description={adminTr.blog.editDesc}
        actions={
          <div className="flex gap-2">
            {previewHref ? (
              <Link href={previewHref}>
                <Button type="button" variant="outline">
                  {adminTr.common.preview}
                </Button>
              </Link>
            ) : null}
            <Link href={ADMIN_ROUTES.blog}>
              <Button type="button" variant="ghost">
                {adminTr.blog.backToList}
              </Button>
            </Link>
          </div>
        }
      />

      <AdminFormStatus error={status.error} success={status.success} />

      <AdminFormSection title={adminTr.blog.sections.content}>
        <AdminTextField
          id="title"
          label="Title"
          name="title"
          required
          value={values.title}
          onChange={(event) => {
            const title = event.target.value;
            updateField("title", title);
            if (!values.slug || values.slug === generateSlugFromTitle(values.title)) {
              updateField("slug", generateSlugFromTitle(title));
            }
          }}
        />
        <AdminTextField
          id="slug"
          label="Slug"
          name="slug"
          hint="Auto-generated from title; editable for SEO."
          value={values.slug}
          onChange={(event) => updateField("slug", event.target.value)}
        />
        <AdminTextareaField
          id="excerpt"
          label="Excerpt"
          name="excerpt"
          required
          rows={3}
          value={values.excerpt}
          onChange={(event) => updateField("excerpt", event.target.value)}
        />
        <AdminTextField
          id="authorName"
          label="Author"
          name="authorName"
          value={values.authorName}
          onChange={(event) => updateField("authorName", event.target.value)}
        />
        <div>
          <p className="mb-2 text-small font-medium">Body</p>
          <BlogRichTextEditor
            initialJson={values.contentJson}
            onChange={setEditorContent}
          />
        </div>
      </AdminFormSection>

      <AdminFormSection title={adminTr.blog.sections.publishing}>
        <AdminSelectField
          id="status"
          label={adminTr.common.status}
          name="status"
          value={values.status}
          onChange={(value) => updateField("status", value as BlogPostFormValues["status"])}
          options={[
            { label: adminTr.blog.status.draft, value: "draft" },
            { label: adminTr.blog.status.published, value: "published" },
            { label: adminTr.blog.status.scheduled, value: "scheduled" },
            { label: adminTr.blog.status.archived, value: "archived" },
          ]}
        />
        {values.status === "scheduled" ? (
          <AdminTextField
            id="scheduledAt"
            label="Scheduled at"
            name="scheduledAt"
            type="datetime-local"
            value={values.scheduledAt ? values.scheduledAt.slice(0, 16) : ""}
            onChange={(event) =>
              updateField("scheduledAt", new Date(event.target.value).toISOString())
            }
          />
        ) : null}
        <AdminSwitchField
          id="featured"
          label={adminTr.blog.featuredArticle}
          name="featured"
          checked={values.featured}
          onChange={(checked) => updateField("featured", checked)}
        />
      </AdminFormSection>

      <AdminFormSection title={adminTr.blog.sections.media}>
        <AdminUploadField
          id="coverImageUrl"
          label="Cover image URL"
          name="coverImageUrl"
          value={values.coverImageUrl}
          onChange={(value) => updateField("coverImageUrl", value)}
          hint="Cloudinary-ready URL field for now."
        />
        <AdminTextField
          id="coverImageAlt"
          label="Cover image alt text"
          name="coverImageAlt"
          value={values.coverImageAlt}
          onChange={(event) => updateField("coverImageAlt", event.target.value)}
        />
      </AdminFormSection>

      <AdminFormSection title={adminTr.blog.sections.taxonomy}>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="mb-2 text-small font-medium">{adminTr.blog.categoriesNav}</p>
            <div className="space-y-2 rounded-xl border border-border p-3">
              {categories.map((category) => (
                <label key={category.id} className="flex items-center gap-2 text-small">
                  <input
                    type="checkbox"
                    name="categoryIds"
                    value={category.id}
                    checked={values.categoryIds.includes(category.id)}
                    onChange={() => toggleId("categoryIds", category.id)}
                  />
                  {category.name}
                </label>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-small font-medium">{adminTr.blog.tagsNav}</p>
            <div className="space-y-2 rounded-xl border border-border p-3">
              {tags.map((tag) => (
                <label key={tag.id} className="flex items-center gap-2 text-small">
                  <input
                    type="checkbox"
                    name="tagIds"
                    value={tag.id}
                    checked={values.tagIds.includes(tag.id)}
                    onChange={() => toggleId("tagIds", tag.id)}
                  />
                  {tag.name}
                </label>
              ))}
            </div>
          </div>
        </div>
      </AdminFormSection>

      <AdminFormSection title={adminTr.blog.sections.seo}>
        <AdminTextField
          id="seoMetaTitle"
          label="Meta title"
          name="seoMetaTitle"
          value={values.seo.metaTitle}
          onChange={(event) =>
            setValues((current) => ({
              ...current,
              seo: { ...current.seo, metaTitle: event.target.value },
            }))
          }
        />
        <AdminTextareaField
          id="seoMetaDescription"
          label="Meta description"
          name="seoMetaDescription"
          rows={3}
          value={values.seo.metaDescription}
          onChange={(event) =>
            setValues((current) => ({
              ...current,
              seo: { ...current.seo, metaDescription: event.target.value },
            }))
          }
        />
        <AdminTextField
          id="seoFocusKeyword"
          label="Focus keyword"
          name="seoFocusKeyword"
          value={values.seo.focusKeyword}
          onChange={(event) =>
            setValues((current) => ({
              ...current,
              seo: { ...current.seo, focusKeyword: event.target.value },
            }))
          }
        />
        <AdminTextField
          id="seoCanonicalUrl"
          label="Canonical URL"
          name="seoCanonicalUrl"
          value={values.seo.canonicalUrl}
          onChange={(event) =>
            setValues((current) => ({
              ...current,
              seo: { ...current.seo, canonicalUrl: event.target.value },
            }))
          }
        />
        <AdminTextField
          id="seoOgImageUrl"
          label="OG image URL"
          name="seoOgImageUrl"
          value={values.seo.ogImageUrl}
          onChange={(event) =>
            setValues((current) => ({
              ...current,
              seo: { ...current.seo, ogImageUrl: event.target.value },
            }))
          }
        />
        <AdminTextField
          id="seoOgImageAlt"
          label="OG image alt"
          name="seoOgImageAlt"
          value={values.seo.ogImageAlt}
          onChange={(event) =>
            setValues((current) => ({
              ...current,
              seo: { ...current.seo, ogImageAlt: event.target.value },
            }))
          }
        />
        <AdminTextField
          id="seoTwitterImageUrl"
          label="Twitter image URL"
          name="seoTwitterImageUrl"
          value={values.seo.twitterImageUrl}
          onChange={(event) =>
            setValues((current) => ({
              ...current,
              seo: { ...current.seo, twitterImageUrl: event.target.value },
            }))
          }
        />
        <AdminSelectField
          id="seoTwitterCardType"
          name="seoTwitterCardType"
          label="Twitter card type"
          value={values.seo.twitterCardType}
          onChange={(value) =>
            setValues((current) => ({
              ...current,
              seo: { ...current.seo, twitterCardType: value },
            }))
          }
          options={[
            { value: "SUMMARY", label: adminTr.seo.fields.summary },
            { value: "SUMMARY_LARGE_IMAGE", label: adminTr.seo.fields.summaryLargeImage },
          ]}
        />
        <AdminTextField
          id="seoKeywords"
          label="Keywords"
          name="seoKeywords"
          hint="Comma-separated"
          value={values.seo.keywords}
          onChange={(event) =>
            setValues((current) => ({
              ...current,
              seo: { ...current.seo, keywords: event.target.value },
            }))
          }
        />
        <AdminTextareaField
          id="seoNotes"
          label={adminTr.seo.fields.seoNotes}
          name="seoNotes"
          rows={3}
          value={values.seo.seoNotes}
          onChange={(event) =>
            setValues((current) => ({
              ...current,
              seo: { ...current.seo, seoNotes: event.target.value },
            }))
          }
        />
        <input type="hidden" name="seoOgType" value={values.seo.ogType || "article"} />
      </AdminFormSection>

      <AdminFormActions>
        <Button type="submit" variant="primary" isLoading={isPending}>
          {mode === "create" ? adminTr.blog.createPost : adminTr.blog.saveChanges}
        </Button>
      </AdminFormActions>
    </form>
  );
}
