import { requestSiteFooter, requestSiteSocialLinks } from "@/lib/cache/request-dedupe";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/container";
import { FooterBottomBar } from "@/features/footer/components/footer-bottom-bar";
import { FooterContactRow } from "@/features/footer/components/footer-contact-row";
import { FooterNewsletter } from "@/features/footer/components/footer-newsletter";
import { ScrollToTop } from "@/features/footer/components/scroll-to-top";

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
      <FooterNewsletter newsletter={footerContent.newsletter} />
      <Container size="wide" className="site-footer__main">
        <FooterContactRow
          contact={footerContent.contact}
          socialLinks={socialLinks}
        />
        <FooterBottomBar brand={footerContent.brand} />
      </Container>
      <ScrollToTop enabled={footerContent.scrollToTop.enabled} />
    </footer>
  );
}
