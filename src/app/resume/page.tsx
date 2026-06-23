import { ROUTES } from "@/constants/routes";
import { PagePlaceholder } from "@/features/layout";
import { createPageMetadata } from "@/seo/metadata";

export const metadata = createPageMetadata({
  title: "Resume",
  pathname: ROUTES.resume,
  description:
    "ATS-friendly resume and CV of Seval Şentürk, Frontend & Full Stack Developer.",
});

export default function ResumePage() {
  return (
    <PagePlaceholder
      title="Resume"
      description="ATS-friendly CV and resume download will be available in an upcoming phase."
    />
  );
}
