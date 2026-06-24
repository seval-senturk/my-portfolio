import type { AuthErrorCode } from "@/types/auth";
import { getAuthErrorContent } from "@/lib/auth/errors";

import { ButtonLink } from "@/components/ui/button-link";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";

interface AuthErrorAlertProps {
  code: AuthErrorCode;
}

export function AuthErrorAlert({ code }: AuthErrorAlertProps) {
  const content = getAuthErrorContent(code);

  return (
    <Card>
      <Card.Content className="space-y-4">
        <Heading as="h1" variant="h3">
          {content.title}
        </Heading>
        <Text tone="muted">{content.description}</Text>
        {content.actionHref && content.actionLabel && (
          <ButtonLink href={content.actionHref} variant="primary" size="md">
            {content.actionLabel}
          </ButtonLink>
        )}
      </Card.Content>
    </Card>
  );
}
