import Link from "next/link";

import type { FooterLinkItem } from "@/types/footer";

interface FooterLinkColumnProps {
  title: string;
  links: readonly FooterLinkItem[];
  ariaLabel: string;
}

export function FooterLinkColumn({ title, links, ariaLabel }: FooterLinkColumnProps) {
  if (links.length === 0) {
    return null;
  }

  return (
    <nav className="site-footer__link-col" aria-label={ariaLabel}>
      <h2 className="site-footer__col-heading">
        {title}
        <span className="site-footer__col-heading-line" aria-hidden />
      </h2>
      <ul className="site-footer__link-list">
        {links.map((link) => (
          <li key={link.id}>
            <Link href={link.href} className="site-footer__link">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
