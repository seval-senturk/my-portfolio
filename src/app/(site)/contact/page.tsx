import { ROUTES } from "@/constants/routes";
import { ContactSection } from "@/features/contact";
import { SEO_PAGE_KEYS } from "@/constants/seo-pages";
import { requestContactContent } from "@/lib/cache/request-dedupe";
import { buildPageMetadata } from "@/services/seo/seo-resolver.service";

export const revalidate = 300;

export async function generateMetadata() {
  const contact = await requestContactContent();

  return buildPageMetadata(SEO_PAGE_KEYS.CONTACT, {
    title: "Contact",
    description: contact.section.description,
    pathname: ROUTES.contact,
  });
}

export default async function ContactPage() {
  const contact = await requestContactContent();

  return <ContactSection content={contact} titleAs="h1" />;
}
