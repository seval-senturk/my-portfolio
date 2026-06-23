import { footerNavigation } from "@/config/navigation.config";
import { siteConfig } from "@/config/site.config";
import { footerContent } from "@/data/footer.data";
import { cn } from "@/lib/cn";

import { SocialLinks } from "@/features/layout/components/social-links";
import { Link } from "@/components/ui/link";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
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
                    <Link
                      href={item.href}
                      variant="muted"
                      showExternalIcon={false}
                      className="text-small no-underline hover:underline"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="md:col-span-2 lg:col-span-1">
            <Heading as="h3" variant="h4">
              {footerContent.columns.connect}
            </Heading>
            <ul className="mt-4 space-y-2">
              {siteConfig.author.email && (
                <li>
                  <Link
                    href={`mailto:${siteConfig.author.email}`}
                    variant="muted"
                    showExternalIcon={false}
                    className="text-small no-underline hover:underline"
                  >
                    {siteConfig.author.email}
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <Text variant="small" tone="muted">
            &copy; {currentYear} {siteConfig.author.name}.{" "}
            {footerContent.copyrightSuffix}
          </Text>
        </div>
      </Container>
    </footer>
  );
}
