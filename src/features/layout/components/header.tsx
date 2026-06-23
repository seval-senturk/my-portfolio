import { headerCta } from "@/config/navigation.config";
import { cn } from "@/lib/cn";

import { HeaderBrand } from "@/features/layout/components/header-brand";
import { DesktopNav } from "@/features/layout/components/desktop-nav";
import { MobileNav } from "@/features/layout/components/mobile-nav";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-border/80 bg-background/85 backdrop-blur-md",
        className,
      )}
    >
      <Container size="wide">
        <div className="flex h-14 items-center justify-between gap-4 lg:h-16">
          <HeaderBrand />

          <div className="hidden lg:block">
            <DesktopNav />
          </div>

          <div className="flex items-center gap-3">
            <ButtonLink
              href={headerCta.href}
              variant="outline"
              size="sm"
              className="hidden sm:inline-flex"
            >
              {headerCta.label}
            </ButtonLink>
            <MobileNav />
          </div>
        </div>
      </Container>
    </header>
  );
}
