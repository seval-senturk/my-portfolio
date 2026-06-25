import { footerNavigation } from "@/config/navigation.config";
import { siteConfig } from "@/config/site.config";
import { siteContentService } from "@/content";
import { cn } from "@/lib/cn";

import { SocialLinks } from "@/features/layout/components/social-links";
import { Link } from "@/components/ui/link";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";

interface FooterProps {
  className?: string;
}

export async function Footer({ className }: FooterProps) {
  const footerContent = await siteContentService.getFooter();
  const currentYear = new Date().getFullYear();

  return (
    <footer className={cn("border-t border-border bg-surface", className)}>
      <Container size="wide" className="py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <Heading as="h2" variant="h4">
              {siteConfig.author.name}
            </Heading>
            <Text tone="muted" className="mt-3 max-w-sm">
              {footerContent.tagline}
            </Text>
            <SocialLinks className="mt-6" iconSize="sm" />
          </div>

          <div>
            <Heading as="h3" variant="h4">
              {footerContent.columns.quickLinks}
            </Heading>
            <nav aria-label="Footer navigation" className="mt-4">
              <ul className="grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-1">
                {footerNavigation.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} variant="muted">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div>
            <Heading as="h3" variant="h4">
              {footerContent.columns.connect}
            </Heading>
            <div className="mt-4 space-y-2">
              {siteConfig.author.email && (
                <Text as="p" variant="small">
                  <Link
                    href={`mailto:${siteConfig.author.email}`}
                    variant="accent"
                  >
                    {siteConfig.author.email}
                  </Link>
                </Text>
              )}
            </div>
          </div>
        </div>

        <Text as="p" variant="small" tone="muted" className="mt-10">
          &copy;{" "}
          <span suppressHydrationWarning>{currentYear}</span>{" "}
          {siteConfig.author.name}. {footerContent.copyrightSuffix}
        </Text>
      </Container>
    </footer>
  );
}
