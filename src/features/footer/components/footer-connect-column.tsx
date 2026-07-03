import { ArrowUpRight } from "lucide-react";

import { FOCUS_RING_CLASS } from "@/lib/accessibility";
import { cn } from "@/lib/cn";
import type { SiteFooterContent } from "@/types/footer";

import { ButtonLink } from "@/components/ui/button-link";

interface FooterConnectColumnProps {
  sectionLabel: string;
  connect: SiteFooterContent["connect"];
}

export function FooterConnectColumn({ sectionLabel, connect }: FooterConnectColumnProps) {
  const showCta = connect.ctaLabel && connect.ctaHref;

  return (
    <div className="site-footer__connect-col">
      <h2 className="site-footer__col-heading">
        {sectionLabel}
        <span className="site-footer__col-heading-line" aria-hidden />
      </h2>

      {connect.title ? <p className="site-footer__connect-title">{connect.title}</p> : null}

      {connect.description ? (
        <p className="site-footer__connect-description">{connect.description}</p>
      ) : null}

      {showCta ? (
        <ButtonLink
          href={connect.ctaHref}
          variant="primary"
          size="lg"
          className={cn(
            "site-footer__connect-cta rounded-full px-7 shadow-[0_12px_32px_rgba(124,131,255,0.28)]",
            FOCUS_RING_CLASS,
          )}
        >
          {connect.ctaLabel}
          <ArrowUpRight size={18} aria-hidden className="opacity-90" />
        </ButtonLink>
      ) : null}
    </div>
  );
}
