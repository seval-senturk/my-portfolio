import { requestSiteFooter, requestSiteSocialLinks } from "@/lib/cache/request-dedupe";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/container";
import { FooterBottomBar } from "@/features/footer/components/footer-bottom-bar";
import { FooterBrandColumn } from "@/features/footer/components/footer-brand-column";
import { FooterConnectColumn } from "@/features/footer/components/footer-connect-column";
import { FooterDecorSvg } from "@/features/footer/components/footer-decor-svg";
import { FooterLinkColumn } from "@/features/footer/components/footer-link-column";

interface FooterSectionProps {
  className?: string;
}

export async function FooterSection({ className }: FooterSectionProps) {
  const [footerContent, socialLinks] = await Promise.all([
    requestSiteFooter(),
    requestSiteSocialLinks(),
  ]);

  return (
    <footer className={cn("site-footer", className)}>
      {footerContent.decor.orbitalEnabled ? (
        <FooterDecorSvg className="site-footer__decor" />
      ) : null}

      <Container size="wide" className="site-footer__main">
        <div className="site-footer__grid">
          <FooterBrandColumn brand={footerContent.brand} socialLinks={socialLinks} />

          <FooterLinkColumn
            title={footerContent.sectionLabels.navigation}
            links={footerContent.navigation}
            ariaLabel="Footer navigation"
          />

          <FooterLinkColumn
            title={footerContent.sectionLabels.resources}
            links={footerContent.resources}
            ariaLabel="Footer resources"
          />

          <FooterConnectColumn
            sectionLabel={footerContent.sectionLabels.connect}
            connect={footerContent.connect}
          />
        </div>

        <FooterBottomBar bottom={footerContent.bottom} />
      </Container>
    </footer>
  );
}
