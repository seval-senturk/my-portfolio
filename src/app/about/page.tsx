import { ROUTES } from "@/constants/routes";
import { PagePlaceholder } from "@/features/layout";
import { createPageMetadata } from "@/seo/metadata";

export const metadata = createPageMetadata({
  title: "About",
  pathname: ROUTES.about,
});

export default function AboutPage() {
  return <PagePlaceholder title="About" />;
}
