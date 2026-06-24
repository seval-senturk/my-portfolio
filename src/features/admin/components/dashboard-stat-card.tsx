import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";

interface DashboardStatCardProps {
  label: string;
  value: number | string;
  description?: string;
}

export function DashboardStatCard({
  label,
  value,
  description,
}: DashboardStatCardProps) {
  return (
    <Card>
      <Card.Content className="space-y-2">
        <Text as="p" variant="small" tone="muted">
          {label}
        </Text>
        <Text as="p" variant="body-large" className="font-semibold">
          {value}
        </Text>
        {description && (
          <Text as="p" variant="small" tone="muted">
            {description}
          </Text>
        )}
      </Card.Content>
    </Card>
  );
}
