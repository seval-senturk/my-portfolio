import type { ContactSocialLink } from "@/types/contact";

import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Link } from "@/components/ui/link";
import { Text } from "@/components/ui/text";

interface ContactSocialViewProps {
  title?: string;
  links: readonly ContactSocialLink[];
}

export function ContactSocialView({
  title = "Social Presence",
  links,
}: ContactSocialViewProps) {
  const visibleLinks = links.filter((link) => link.visible);

  if (visibleLinks.length === 0) {
    return null;
  }

  return (
    <Card>
      <Card.Content>
        <Heading as="h3" variant="h4">
          {title}
        </Heading>
        <ul className="mt-4 space-y-3">
          {visibleLinks.map((link) => {
            const isEmail = link.platform === "email";

            return (
              <li key={link.id}>
                <Text as="span" variant="small" tone="muted">
                  {link.label}
                </Text>
                <Text as="p">
                  <Link
                    href={link.href}
                    variant="accent"
                    {...(!isEmail && {
                      target: "_blank",
                      rel: "noopener noreferrer",
                    })}
                  >
                    {link.href}
                  </Link>
                </Text>
              </li>
            );
          })}
        </ul>
      </Card.Content>
    </Card>
  );
}
