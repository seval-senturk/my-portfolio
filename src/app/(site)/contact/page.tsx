import { contactContentService } from "@/content";
import { ROUTES } from "@/constants/routes";
import { ContactSection } from "@/features/contact";
import { SEO_PAGE_KEYS } from "@/constants/seo-pages";
import { buildPageMetadata } from "@/services/seo/seo-resolver.service";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const contact = await contactContentService.get();

  return buildPageMetadata(SEO_PAGE_KEYS.CONTACT, {
    title: "Contact",
    description: contact.section.description,
    pathname: ROUTES.contact,
  });
}

export default async function ContactPage() {
  const contact = await contactContentService.get();

  return <ContactSection content={contact} titleAs="h1" />;
}
