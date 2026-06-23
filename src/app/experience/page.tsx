import { ROUTES } from "@/constants/routes";
import { PagePlaceholder } from "@/features/layout";
import { createPageMetadata } from "@/seo/metadata";

export const metadata = createPageMetadata({
  title: "Experience",
  pathname: ROUTES.experience,
});

export default function ExperiencePage() {
  return <PagePlaceholder title="Experience" />;
}
