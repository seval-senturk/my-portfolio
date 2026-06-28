import { prisma } from "@/lib/prisma";
import type { FooterConfigInput } from "@/types/footer";

function hasFooterConfigModel(): boolean {
  return (
    "footerConfig" in prisma &&
    typeof prisma.footerConfig?.findUnique === "function"
  );
}

export async function getFooterConfig() {
  if (!hasFooterConfigModel()) {
    return null;
  }

  return prisma.footerConfig.findUnique({ where: { locale: "en" } });
}

export async function updateFooterConfig(input: FooterConfigInput) {
  if (!hasFooterConfigModel()) {
    throw new Error(
      'Prisma client is out of date. Stop the dev server, run "npx prisma generate", then restart.',
    );
  }

  return prisma.footerConfig.upsert({
    where: { locale: "en" },
    update: {
      newsletterEnabled: input.newsletterEnabled,
      newsletterLabel: input.newsletterLabel,
      newsletterTitle: input.newsletterTitle,
      newsletterDescription: input.newsletterDescription,
      newsletterPlaceholder: input.newsletterPlaceholder,
      newsletterButtonText: input.newsletterButtonText,
      phone: input.phone,
      email: input.email,
      address: input.address,
      copyright: input.copyright,
      brandName: input.brandName,
      brandLogoUrl: input.brandLogoUrl,
      scrollToTopEnabled: input.scrollToTopEnabled,
    },
    create: {
      locale: "en",
      newsletterEnabled: input.newsletterEnabled,
      newsletterLabel: input.newsletterLabel,
      newsletterTitle: input.newsletterTitle,
      newsletterDescription: input.newsletterDescription,
      newsletterPlaceholder: input.newsletterPlaceholder,
      newsletterButtonText: input.newsletterButtonText,
      phone: input.phone,
      email: input.email,
      address: input.address,
      copyright: input.copyright,
      brandName: input.brandName,
      brandLogoUrl: input.brandLogoUrl,
      scrollToTopEnabled: input.scrollToTopEnabled,
    },
  });
}
