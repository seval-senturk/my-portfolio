import type { ProjectEntry } from "@/types/project";
import { getProjectDetailPath } from "@/lib/projects";
import { formatTechnologyList } from "@/lib/content";
import { cn } from "@/lib/cn";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Link } from "@/components/ui/link";
import { Text } from "@/components/ui/text";

interface ProjectCardProps {
  project: ProjectEntry;
  showCaseStudyLink?: boolean;
  className?: string;
}

export function ProjectCard({
  project,
  showCaseStudyLink = false,
  className,
}: ProjectCardProps) {
  const hasCaseStudy = project.caseStudy !== undefined;
  const showCaseStudy =
    showCaseStudyLink && hasCaseStudy && project.caseStudy !== undefined;

  return (
    <Card className={cn("flex h-full flex-col", className)} interactive>
      <Card.Content className="flex flex-1 flex-col">
        <header className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Heading as="h3" variant="h4">
              {project.title}
            </Heading>
            {project.status && (
              <Badge variant="outline">{project.status}</Badge>
            )}
          </div>
          <Text as="p" variant="small" tone="muted">
            {project.role} · {project.category}
            {project.client ? ` · ${project.client}` : ""}
          </Text>
        </header>

        <Text tone="muted" className="mt-4 flex-1">
          {project.shortDescription}
        </Text>

        <div className="mt-4">
          <Heading as="h4" variant="h4" className="text-small font-semibold">
            Technologies
          </Heading>
          <Text as="p" variant="small" className="mt-2 text-foreground">
            {formatTechnologyList(project.technologies)}
          </Text>
        </div>

        {project.highlights && project.highlights.length > 0 && (
          <ul className="mt-4 list-disc space-y-1 pl-5">
            {project.highlights.map((highlight) => (
              <li key={highlight}>
                <Text as="span" variant="small">
                  {highlight}
                </Text>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-6 flex flex-wrap gap-4 border-t border-border pt-4">
          {project.githubUrl && (
            <Link
              href={project.githubUrl}
              variant="accent"
              className="text-small no-underline hover:underline"
            >
              GitHub
            </Link>
          )}
          {project.liveUrl && (
            <Link
              href={project.liveUrl}
              variant="accent"
              className="text-small no-underline hover:underline"
            >
              Live Demo
            </Link>
          )}
          {showCaseStudy && (
            <Link
              href={getProjectDetailPath(project.slug)}
              variant="accent"
              className="text-small no-underline hover:underline"
              showExternalIcon={false}
            >
              Case Study
            </Link>
          )}
        </div>
      </Card.Content>
    </Card>
  );
}
