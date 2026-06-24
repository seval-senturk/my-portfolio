import { contactContentService } from "@/content";
import { ROUTES } from "@/constants/routes";
import { ContactSection } from "@/features/contact";
import { createPageMetadata } from "@/seo/metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const contact = await contactContentService.get();

  return createPageMetadata({
    title: "Contact",
    description: contact.section.description,
    pathname: ROUTES.contact,
  });
}

export default async function ContactPage() {
  const contact = await contactContentService.get();

  return <ContactSection content={contact} titleAs="h1" />;
}
