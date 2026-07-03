import { headerCta } from "@/config/navigation.config";
import { cn } from "@/lib/cn";

import { HeaderBrand } from "@/features/layout/components/header-brand";
import { DesktopNav } from "@/features/layout/components/desktop-nav";
import { MobileNav } from "@/features/layout/components/mobile-nav";
import { SiteHeaderShell } from "@/features/layout/components/site-header-shell";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  return (
    <SiteHeaderShell>
      <Container size="wide" className={cn(className)}>
        <div className="grid h-16 grid-cols-[1fr_auto] items-center gap-4 lg:h-[4.5rem] lg:grid-cols-[1fr_auto_1fr]">
          <HeaderBrand />

          <div className="hidden justify-center lg:flex">
            <DesktopNav />
          </div>

          <div className="flex items-center justify-end gap-2 sm:gap-3">
            <ButtonLink
              href={headerCta.href}
              variant="outline"
              size="sm"
              className="hidden rounded-full border-border/70 bg-surface/20 px-5 hover:border-accent/40 hover:bg-surface/40 lg:inline-flex"
            >
              {headerCta.label}
              <span aria-hidden className="ml-0.5 opacity-70">
                »
              </span>
            </ButtonLink>
            <MobileNav />
          </div>
        </div>
      </Container>
    </SiteHeaderShell>
  );
}
