import type { ContentDistributionSlice } from "@/services/admin/dashboard.service";

interface DashboardDonutChartProps {
  data: ContentDistributionSlice[];
  title: string;
}

export function DashboardDonutChart({ data, title }: DashboardDonutChartProps) {
  const total = data.reduce((sum, slice) => sum + slice.value, 0);
  const radius = 56;
  const stroke = 18;
  const circumference = 2 * Math.PI * radius;

  let offset = 0;

  const segments =
    total === 0
      ? [{ color: "#334155", dash: circumference, offset: 0 }]
      : data.map((slice) => {
          const portion = slice.value / total;
          const dash = portion * circumference;
          const segment = { color: slice.color, dash, offset };
          offset += dash;
          return segment;
        });

  return (
    <div className="admin-surface rounded-xl border p-5">
      <h3 className="mb-4 text-small font-semibold">{title}</h3>
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
        <div className="relative">
          <svg width="160" height="160" viewBox="0 0 160 160" role="img" aria-label={title}>
            <g transform="translate(80 80) rotate(-90)">
              {segments.map((segment, index) => (
                <circle
                  key={`segment-${index}`}
                  r={radius}
                  fill="transparent"
                  stroke={segment.color}
                  strokeWidth={stroke}
                  strokeDasharray={`${segment.dash} ${circumference}`}
                  strokeDashoffset={-segment.offset}
                  strokeLinecap="butt"
                />
              ))}
            </g>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-h3 font-semibold">{total}</span>
            <span className="text-caption text-muted-foreground">Toplam</span>
          </div>
        </div>

        <ul className="flex-1 space-y-2">
          {data.map((slice) => (
            <li key={slice.label} className="flex items-center justify-between gap-3 text-small">
              <span className="inline-flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: slice.color }}
                  aria-hidden
                />
                {slice.label}
              </span>
              <span className="font-medium">{slice.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
