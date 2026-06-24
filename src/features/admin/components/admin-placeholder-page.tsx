import type { ReactNode } from "react";

import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";

interface AdminPlaceholderPageProps {
  title: string;
  description: string;
  children?: ReactNode;
}

export function AdminPlaceholderPage({
  title,
  description,
  children,
}: AdminPlaceholderPageProps) {
  return (
    <div className="space-y-3">
      <Heading as="h1">{title}</Heading>
      <Text tone="muted">{description}</Text>
      {children}
    </div>
  );
}
