import { requestContactContent } from "@/lib/cache/request-dedupe";
import { cn } from "@/lib/cn";

import { HeaderBrand } from "@/features/layout/components/header-brand";
import { SlideNavigationMenu } from "@/features/layout/components/slide-navigation-menu";
import { SiteHeaderShell } from "@/features/layout/components/site-header-shell";
import { SectionNavProvider } from "@/features/layout/context/section-nav-context";
import { Container } from "@/components/ui/container";

interface HeaderProps {
  className?: string;
}

export async function Header({ className }: HeaderProps) {
  const contact = await requestContactContent();

  return (
    <SiteHeaderShell>
      <SectionNavProvider>
        <Container size="wide" className={cn(className)}>
          <div className="flex h-16 items-center justify-between gap-4 lg:h-[4.5rem]">
            <HeaderBrand />
            <SlideNavigationMenu
              availabilityLabel={contact.availabilityStatus}
              resumeHref={contact.resumeHref}
            />
          </div>
        </Container>
      </SectionNavProvider>
    </SiteHeaderShell>
  );
}
