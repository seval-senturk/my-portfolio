import type { RecentContentItem } from "@/services/admin/dashboard.service";
import { adminTr } from "@/features/admin/i18n/tr";

import { Badge } from "@/components/ui/badge";

interface DashboardRecentContentProps {
  items: RecentContentItem[];
}

const TYPE_LABELS: Record<RecentContentItem["type"], string> = {
  project: "Proje",
  blog: "Blog",
  experience: "Deneyim",
};

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function DashboardRecentContent({ items }: DashboardRecentContentProps) {
  return (
    <div className="admin-surface admin-table-wrap">
      <div className="border-b border-border px-5 py-4">
        <h3 className="text-small font-semibold">{adminTr.dashboard.recentContent}</h3>
      </div>

      {items.length === 0 ? (
        <p className="px-5 py-8 text-small text-muted-foreground">
          Henüz içerik bulunmuyor.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Başlık</th>
                <th>Tür</th>
                <th>Durum</th>
                <th>Güncelleme</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={`${item.type}-${item.id}`}>
                  <td className="font-medium">{item.title}</td>
                  <td className="text-muted-foreground">{TYPE_LABELS[item.type]}</td>
                  <td>
                    <Badge variant={item.status === "published" ? "accent" : "secondary"}>
                      {item.status === "published"
                        ? adminTr.dashboard.published
                        : adminTr.dashboard.draft}
                    </Badge>
                  </td>
                  <td className="text-muted-foreground">{formatDate(item.updatedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
