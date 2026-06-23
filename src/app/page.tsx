import { A11Y } from "@/lib/accessibility";
import { siteConfig } from "@/config/site.config";

export default function HomePage() {
  return (
    <main
      id={A11Y.mainContentId}
      className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6 py-16"
    >
      <p className="text-sm font-medium uppercase tracking-wide text-foreground/70">
        Phase 1 Foundation
      </p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight">
        {siteConfig.author.name}
      </h1>
      <p className="mt-4 text-lg text-foreground/80">
        {siteConfig.author.jobTitle}
      </p>
      <p className="mt-6 max-w-prose text-base leading-relaxed text-foreground/70">
        Architecture, SEO, and performance foundation is in place. Visual design
        and content sections will be implemented in upcoming phases.
      </p>
    </main>
  );
}
