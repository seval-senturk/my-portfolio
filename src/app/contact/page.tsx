import { contactContent } from "@/data/contact.data";
import { ROUTES } from "@/constants/routes";
import { ContactSection } from "@/features/contact";
import { createPageMetadata } from "@/seo/metadata";

export const metadata = createPageMetadata({
  title: "Contact",
  description: contactContent.section.description,
  pathname: ROUTES.contact,
});

export default function ContactPage() {
  return <ContactSection content={contactContent} titleAs="h1" />;
}
