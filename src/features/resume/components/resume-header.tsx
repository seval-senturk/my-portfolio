import type { ResumeProfile } from "@/types/resume";

import { Link } from "@/components/ui/link";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";

interface ResumeHeaderProps {
  profile: ResumeProfile;
}

export function ResumeHeader({ profile }: ResumeHeaderProps) {
  return (
    <header className="space-y-4 border-b border-border pb-8">
      <div className="space-y-2">
        <Heading as="h3" variant="h3">
          {profile.fullName}
        </Heading>
        <Text as="p" variant="body-large" className="font-medium">
          {profile.title}
        </Text>
        <Text tone="muted">{profile.summary}</Text>
      </div>

      <address className="not-italic">
        <ul className="flex flex-col gap-1 text-small sm:flex-row sm:flex-wrap sm:gap-x-4">
          <li>
            <Text as="span" variant="small" tone="muted">
              Location:{" "}
            </Text>
            <Text as="span" variant="small">
              {profile.location}
            </Text>
          </li>
          <li>
            <Text as="span" variant="small" tone="muted">
              Email:{" "}
            </Text>
            <Link href={`mailto:${profile.email}`} variant="accent">
              {profile.email}
            </Link>
          </li>
          <li>
            <Text as="span" variant="small" tone="muted">
              Website:{" "}
            </Text>
            <Link href={profile.website} variant="accent">
              {profile.website}
            </Link>
          </li>
          <li>
            <Text as="span" variant="small" tone="muted">
              LinkedIn:{" "}
            </Text>
            <Link href={profile.linkedin} variant="accent">
              {profile.linkedin}
            </Link>
          </li>
          <li>
            <Text as="span" variant="small" tone="muted">
              GitHub:{" "}
            </Text>
            <Link href={profile.github} variant="accent">
              {profile.github}
            </Link>
          </li>
        </ul>
      </address>
    </header>
  );
}
