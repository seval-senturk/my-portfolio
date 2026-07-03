"use server";

import { revalidatePath, revalidateTag } from "next/cache";

import { ADMIN_ROUTES } from "@/config/admin-routes.config";
import { adminError, adminSuccess } from "@/lib/admin/action-result";
import { CACHE_TAGS } from "@/lib/cache/server";
import { AuditActions, recordAudit } from "@/lib/platform/audit";
import { getOptionalString, getString, validateRequired } from "@/lib/admin/validation";
import { requireAdminUser } from "@/lib/auth/session";
import { resolveSanitizedBlogHtml } from "@/lib/blog/resolve-content-html";
import { parseCommaList } from "@/services/admin/project.admin.service";
import {
  autosaveBlogPostDraft,
  createBlogPost,
  deleteBlogPost,
  updateBlogPost,
  type BlogPostInput,
} from "@/services/admin/blog.admin.service";
import {
  createBlogCategory,
  deleteBlogCategory,
  updateBlogCategory,
} from "@/services/admin/blog-category.admin.service";
import {
  createBlogTag,
  deleteBlogTag,
  updateBlogTag,
} from "@/services/admin/blog-tag.admin.service";

function revalidateBlogPaths(slug?: string) {
  revalidateTag(CACHE_TAGS.content);
  revalidateTag(CACHE_TAGS.seo);
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath(ADMIN_ROUTES.blog);
  if (slug) {
    revalidatePath(`/blog/${slug}`);
    revalidatePath(`${ADMIN_ROUTES.blog}/${slug}/preview`);
  }
}

function parseBlogPostForm(formData: FormData): BlogPostInput | { error: string } {
  const title = getString(formData, "title");
  const excerpt = getString(formData, "excerpt");
  const contentHtml = getString(formData, "contentHtml");
  const titleError = validateRequired(title, "Title");
  const excerptError = validateRequired(excerpt, "Excerpt");

  if (titleError || excerptError) {
    return { error: titleError ?? excerptError ?? "Invalid form data." };
  }

  const contentJsonRaw = getOptionalString(formData, "contentJson");
  let contentJson: Record<string, unknown> | undefined;

  if (contentJsonRaw) {
    try {
      contentJson = JSON.parse(contentJsonRaw) as Record<string, unknown>;
    } catch {
      return { error: "Invalid editor content." };
    }
  }

  try {
    resolveSanitizedBlogHtml({ contentHtml, contentJson });
  } catch {
    return { error: "Blog content cannot be empty." };
  }

  const status = getString(formData, "status") as BlogPostInput["status"];

  return {
    id: getOptionalString(formData, "id"),
    title,
    slug: getOptionalString(formData, "slug"),
    excerpt,
    contentHtml,
    contentJson,
    authorName: getOptionalString(formData, "authorName"),
    status: ["draft", "published", "scheduled", "archived"].includes(status)
      ? status
      : "draft",
    featured: formData.get("featured") === "on" || formData.get("featured") === "true",
    coverImageUrl: getOptionalString(formData, "coverImageUrl"),
    coverImageAlt: getOptionalString(formData, "coverImageAlt"),
    categoryIds: formData.getAll("categoryIds").map(String),
    tagIds: formData.getAll("tagIds").map(String),
    scheduledAt: getOptionalString(formData, "scheduledAt"),
    seo: {
      metaTitle: getOptionalString(formData, "seoMetaTitle"),
      metaDescription: getOptionalString(formData, "seoMetaDescription"),
      canonicalUrl: getOptionalString(formData, "seoCanonicalUrl"),
      focusKeyword: getOptionalString(formData, "seoFocusKeyword"),
      seoNotes: getOptionalString(formData, "seoNotes"),
      ogImageUrl: getOptionalString(formData, "seoOgImageUrl"),
      ogImageAlt: getOptionalString(formData, "seoOgImageAlt"),
      ogType: getOptionalString(formData, "seoOgType") ?? "article",
      twitterImageUrl: getOptionalString(formData, "seoTwitterImageUrl"),
      twitterCardType:
        (getOptionalString(formData, "seoTwitterCardType") as
          | "SUMMARY"
          | "SUMMARY_LARGE_IMAGE"
          | undefined) ?? undefined,
      keywords: parseCommaList(getString(formData, "seoKeywords")),
    },
  };
}

export async function saveBlogPostAction(formData: FormData) {
  try {
    const user = await requireAdminUser();
    const parsed = parseBlogPostForm(formData);

    if ("error" in parsed) {
      return adminError(parsed.error);
    }

    const id = getOptionalString(formData, "id");
    const post = id
      ? await updateBlogPost(id, parsed)
      : await createBlogPost(parsed);

    revalidateBlogPaths(post.slug);
    await recordAudit({
      user,
      action: AuditActions.BLOG_POST_SAVED,
      category: "CONTENT",
      entityType: "blog_post",
      entityId: post.id,
      summary: `Blog post saved: ${post.slug}`,
    });
    return adminSuccess({ id: post.id, slug: post.slug });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save blog post.";
    return adminError(message);
  }
}

export async function deleteBlogPostAction(formData: FormData) {
  try {
    const user = await requireAdminUser();
    const id = getString(formData, "id");
    if (!id) return adminError("Post id is required.");

    await deleteBlogPost(id);
    revalidateBlogPaths();
    await recordAudit({
      user,
      action: AuditActions.BLOG_POST_DELETED,
      category: "CONTENT",
      entityType: "blog_post",
      entityId: id,
      summary: "Blog post deleted",
    });
    return adminSuccess();
  } catch {
    return adminError("Failed to delete blog post.");
  }
}

export async function autosaveBlogPostAction(formData: FormData) {
  try {
    await requireAdminUser();
    const id = getString(formData, "id");
    if (!id) return adminError("Post id is required for autosave.");

    const contentJsonRaw = getOptionalString(formData, "contentJson");
    let contentJson: Record<string, unknown> | undefined;

    if (contentJsonRaw) {
      contentJson = JSON.parse(contentJsonRaw) as Record<string, unknown>;
    }

    await autosaveBlogPostDraft(id, {
      title: getOptionalString(formData, "title"),
      excerpt: getOptionalString(formData, "excerpt"),
      contentHtml: getOptionalString(formData, "contentHtml"),
      contentJson,
      status: "draft",
    });

    return adminSuccess();
  } catch {
    return adminError("Autosave failed.");
  }
}

export async function saveBlogCategoryAction(formData: FormData) {
  try {
    await requireAdminUser();
    const name = getString(formData, "name");
    const nameError = validateRequired(name, "Name");
    if (nameError) return adminError(nameError);

    const id = getOptionalString(formData, "id");
    const input = {
      name,
      slug: getOptionalString(formData, "slug"),
      description: getOptionalString(formData, "description"),
    };

    if (id) {
      await updateBlogCategory(id, input);
    } else {
      await createBlogCategory(input);
    }

    revalidateBlogPaths();
    return adminSuccess();
  } catch {
    return adminError("Failed to save category.");
  }
}

export async function deleteBlogCategoryAction(formData: FormData) {
  try {
    await requireAdminUser();
    const id = getString(formData, "id");
    if (!id) return adminError("Category id is required.");
    await deleteBlogCategory(id);
    revalidateBlogPaths();
    return adminSuccess();
  } catch {
    return adminError("Failed to delete category.");
  }
}

export async function saveBlogTagAction(formData: FormData) {
  try {
    await requireAdminUser();
    const name = getString(formData, "name");
    const nameError = validateRequired(name, "Name");
    if (nameError) return adminError(nameError);

    const id = getOptionalString(formData, "id");
    const input = {
      name,
      slug: getOptionalString(formData, "slug"),
    };

    if (id) {
      await updateBlogTag(id, input);
    } else {
      await createBlogTag(input);
    }

    revalidateBlogPaths();
    return adminSuccess();
  } catch {
    return adminError("Failed to save tag.");
  }
}

export async function deleteBlogTagAction(formData: FormData) {
  try {
    await requireAdminUser();
    const id = getString(formData, "id");
    if (!id) return adminError("Tag id is required.");
    await deleteBlogTag(id);
    revalidateBlogPaths();
    return adminSuccess();
  } catch {
    return adminError("Failed to delete tag.");
  }
}
