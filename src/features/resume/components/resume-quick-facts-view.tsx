import type { ResumeQuickFact } from "@/types/resume";

import { StatGrid } from "@/components/shared/stat-grid";

interface ResumeQuickFactsViewProps {
  items: readonly ResumeQuickFact[];
}

export function ResumeQuickFactsView({ items }: ResumeQuickFactsViewProps) {
  return <StatGrid items={items} columns={3} />;
}
