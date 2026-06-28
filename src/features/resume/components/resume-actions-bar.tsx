import type { ResumeActions, ResumeFile } from "@/types/resume";

import { FOCUS_RING_CLASS } from "@/lib/accessibility";
import { cn } from "@/lib/cn";

import {
  BUTTON_BASE_CLASSES,
  BUTTON_SIZE_CLASSES,
  BUTTON_VARIANT_CLASSES,
} from "@/components/ui/button-styles";
import { ButtonLink } from "@/components/ui/button-link";

interface ResumeActionsBarProps {
  actions: ResumeActions;
  resumeFile?: ResumeFile;
}

export function ResumeActionsBar({
  actions,
  resumeFile,
}: ResumeActionsBarProps) {
  return (
    <nav
      aria-label="Resume actions"
      className="flex flex-col gap-3 sm:flex-row sm:flex-wrap"
    >
      {resumeFile ? (
        <>
          <a
            href={resumeFile.filePath}
            download={resumeFile.fileName}
            className={cn(
              BUTTON_BASE_CLASSES,
              FOCUS_RING_CLASS,
              BUTTON_VARIANT_CLASSES.primary,
              BUTTON_SIZE_CLASSES.md,
            )}
          >
            {actions.downloadLabel}
          </a>
          <a
            href={resumeFile.filePath}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              BUTTON_BASE_CLASSES,
              FOCUS_RING_CLASS,
              BUTTON_VARIANT_CLASSES.secondary,
              BUTTON_SIZE_CLASSES.md,
            )}
          >
            {actions.viewLabel}
          </a>
        </>
      ) : (
        <p className="text-small text-muted-foreground" role="status">
          Resume PDF is temporarily unavailable.
        </p>
      )}
      <ButtonLink href={actions.contactHref} variant="outline" size="md">
        {actions.contactLabel}
      </ButtonLink>
    </nav>
  );
}
