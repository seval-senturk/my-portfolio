import { ChevronUp } from "lucide-react";
import Link from "next/link";

import { A11Y } from "@/lib/accessibility";
import type { SiteFooterContent } from "@/types/footer";

interface FooterBottomBarProps {
  bottom: SiteFooterContent["bottom"];
}

export function FooterBottomBar({ bottom }: FooterBottomBarProps) {
  return (
    <div className="site-footer__bottom">
      <p className="site-footer__copyright">{bottom.copyright}</p>

      {bottom.backToTopEnabled ? (
        <Link href={`#${A11Y.mainContentId}`} className="site-footer__back-to-top">
          <span>{bottom.backToTopLabel}</span>
          <span className="site-footer__back-to-top-icon" aria-hidden>
            <ChevronUp size={16} />
          </span>
        </Link>
      ) : null}
    </div>
  );
}
