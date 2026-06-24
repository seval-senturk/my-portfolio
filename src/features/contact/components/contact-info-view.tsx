import type { ContactContent } from "@/types/contact";

import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Link } from "@/components/ui/link";
import { Text } from "@/components/ui/text";

interface ContactInfoViewProps {
  content: Pick<
    ContactContent,
    | "information"
    | "availabilityStatus"
    | "responseTime"
    | "resumeHref"
    | "resumeLabel"
  >;
}

export function ContactInfoView({ content }: ContactInfoViewProps) {
  const { information, availabilityStatus, responseTime, resumeHref, resumeLabel } =
    content;

  return (
    <Card className="h-full">
      <Card.Content className="space-y-6">
        <div className="space-y-3">
          <Heading as="h3" variant="h4">
            Contact Information
          </Heading>
          <Badge variant="accent">{availabilityStatus}</Badge>
          <Text tone="muted">{responseTime}</Text>
        </div>

        <address className="not-italic space-y-3">
          <div>
            <Text as="span" variant="small" tone="muted">
              Email
            </Text>
            <Text as="p">
              <Link href={`mailto:${information.email}`} variant="accent">
                {information.email}
              </Link>
            </Text>
          </div>

          <div>
            <Text as="span" variant="small" tone="muted">
              Location
            </Text>
            <Text as="p">{information.location}</Text>
          </div>

          <div>
            <Text as="span" variant="small" tone="muted">
              Website
            </Text>
            <Text as="p">
              <Link href={information.website} variant="accent">
                {information.website}
              </Link>
            </Text>
          </div>

          <div>
            <Text as="span" variant="small" tone="muted">
              LinkedIn
            </Text>
            <Text as="p">
              <Link href={information.linkedin} variant="accent">
                {information.linkedin}
              </Link>
            </Text>
          </div>

          <div>
            <Text as="span" variant="small" tone="muted">
              GitHub
            </Text>
            <Text as="p">
              <Link href={information.github} variant="accent">
                {information.github}
              </Link>
            </Text>
          </div>
        </address>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <ButtonLink href={resumeHref} variant="secondary" size="md">
            {resumeLabel}
          </ButtonLink>
          <ButtonLink
            href={`mailto:${information.email}`}
            variant="outline"
            size="md"
          >
            Email Me
          </ButtonLink>
        </div>
      </Card.Content>
    </Card>
  );
}
