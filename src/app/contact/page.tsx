import { ROUTES } from "@/constants/routes";
import { PagePlaceholder } from "@/features/layout";
import { createPageMetadata } from "@/seo/metadata";

export const metadata = createPageMetadata({
  title: "Contact",
  pathname: ROUTES.contact,
});

export default function ContactPage() {
  return <PagePlaceholder title="Contact" />;
}
