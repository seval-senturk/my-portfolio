import { prisma } from "@/lib/prisma";
import { DEFAULT_LOCALE } from "@/repositories/shared/locale";
import type { FooterConfigInput, FooterLinkInput } from "@/types/footer";

function hasFooterModels(): boolean {
  return (
    "footerConfig" in prisma &&
    typeof prisma.footerConfig?.findUnique === "function" &&
    "footerNavLink" in prisma
  );
}

function requireFooterModels() {
  if (!hasFooterModels()) {
    throw new Error(
      'Prisma client is out of date. Stop the dev server, run "npx prisma generate", then restart.',
    );
  }
}

export async function getFooterConfig() {
  if (!hasFooterModels()) {
    return null;
  }

  return prisma.footerConfig.findUnique({ where: { locale: DEFAULT_LOCALE } });
}

export async function listFooterNavLinks() {
  if (!hasFooterModels()) {
    return [];
  }

  return prisma.footerNavLink.findMany({ orderBy: { sortOrder: "asc" } });
}

export async function listFooterResourceLinks() {
  if (!hasFooterModels()) {
    return [];
  }

  return prisma.footerResourceLink.findMany({ orderBy: { sortOrder: "asc" } });
}

export async function getFooterNavLink(id: string) {
  if (!hasFooterModels()) {
    return null;
  }

  return prisma.footerNavLink.findUnique({ where: { id } });
}

export async function getFooterResourceLink(id: string) {
  if (!hasFooterModels()) {
    return null;
  }

  return prisma.footerResourceLink.findUnique({ where: { id } });
}

export async function updateFooterConfig(input: FooterConfigInput) {
  requireFooterModels();

  return prisma.footerConfig.upsert({
    where: { locale: DEFAULT_LOCALE },
    update: {
      brandName: input.brandName,
      brandLogoUrl: input.brandLogoUrl,
      brandRole: input.brandRole,
      brandDescription: input.brandDescription,
      navSectionLabel: input.navSectionLabel,
      resourcesSectionLabel: input.resourcesSectionLabel,
      connectSectionLabel: input.connectSectionLabel,
      ctaTitle: input.ctaTitle,
      ctaDescription: input.ctaDescription,
      ctaLabel: input.ctaLabel,
      ctaHref: input.ctaHref,
      copyright: input.copyright,
      scrollToTopEnabled: input.scrollToTopEnabled,
      scrollToTopLabel: input.scrollToTopLabel,
      orbitalDecorEnabled: input.orbitalDecorEnabled,
    },
    create: {
      locale: DEFAULT_LOCALE,
      brandName: input.brandName,
      brandLogoUrl: input.brandLogoUrl,
      brandRole: input.brandRole,
      brandDescription: input.brandDescription,
      navSectionLabel: input.navSectionLabel,
      resourcesSectionLabel: input.resourcesSectionLabel,
      connectSectionLabel: input.connectSectionLabel,
      ctaTitle: input.ctaTitle,
      ctaDescription: input.ctaDescription,
      ctaLabel: input.ctaLabel,
      ctaHref: input.ctaHref,
      copyright: input.copyright,
      scrollToTopEnabled: input.scrollToTopEnabled,
      scrollToTopLabel: input.scrollToTopLabel,
      orbitalDecorEnabled: input.orbitalDecorEnabled,
    },
  });
}

export async function createFooterNavLink(input: FooterLinkInput) {
  requireFooterModels();

  const count = await prisma.footerNavLink.count();
  const id = input.id ?? `footer-nav-${Date.now()}`;

  return prisma.footerNavLink.create({
    data: {
      id,
      label: input.label,
      href: input.href,
      visible: input.visible,
      sortOrder: count,
    },
  });
}

export async function updateFooterNavLink(id: string, input: FooterLinkInput) {
  requireFooterModels();

  return prisma.footerNavLink.update({
    where: { id },
    data: {
      label: input.label,
      href: input.href,
      visible: input.visible,
    },
  });
}

export async function deleteFooterNavLink(id: string) {
  requireFooterModels();
  await prisma.footerNavLink.delete({ where: { id } });
}

export async function reorderFooterNavLinks(orderedIds: string[]) {
  requireFooterModels();

  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.footerNavLink.update({
        where: { id },
        data: { sortOrder: index },
      }),
    ),
  );
}

export async function createFooterResourceLink(input: FooterLinkInput) {
  requireFooterModels();

  const count = await prisma.footerResourceLink.count();
  const id = input.id ?? `footer-resource-${Date.now()}`;

  return prisma.footerResourceLink.create({
    data: {
      id,
      label: input.label,
      href: input.href,
      visible: input.visible,
      sortOrder: count,
    },
  });
}

export async function updateFooterResourceLink(id: string, input: FooterLinkInput) {
  requireFooterModels();

  return prisma.footerResourceLink.update({
    where: { id },
    data: {
      label: input.label,
      href: input.href,
      visible: input.visible,
    },
  });
}

export async function deleteFooterResourceLink(id: string) {
  requireFooterModels();
  await prisma.footerResourceLink.delete({ where: { id } });
}

export async function reorderFooterResourceLinks(orderedIds: string[]) {
  requireFooterModels();

  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.footerResourceLink.update({
        where: { id },
        data: { sortOrder: index },
      }),
    ),
  );
}

export async function getFooterAdminContent() {
  const [config, navigation, resources] = await Promise.all([
    getFooterConfig(),
    listFooterNavLinks(),
    listFooterResourceLinks(),
  ]);

  return { config, navigation, resources };
}
