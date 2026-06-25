import type { SiteVisitPoint } from "@/services/admin/dashboard.service";

interface DashboardLineChartProps {
  data: SiteVisitPoint[];
  title: string;
}

export function DashboardLineChart({ data, title }: DashboardLineChartProps) {
  const width = 560;
  const height = 200;
  const padding = { top: 16, right: 12, bottom: 28, left: 12 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const maxValue = Math.max(...data.map((point) => point.value), 1);
  const minValue = Math.min(...data.map((point) => point.value));
  const range = Math.max(maxValue - minValue, 1);

  const points = data.map((point, index) => {
    const x = padding.left + (index / Math.max(data.length - 1, 1)) * chartWidth;
    const y =
      padding.top + chartHeight - ((point.value - minValue) / range) * chartHeight;
    return { x, y, label: point.label };
  });

  const polyline = points.map((point) => `${point.x},${point.y}`).join(" ");
  const area = [
    `${points[0]?.x ?? padding.left},${padding.top + chartHeight}`,
    ...points.map((point) => `${point.x},${point.y}`),
    `${points[points.length - 1]?.x ?? padding.left},${padding.top + chartHeight}`,
  ].join(" ");

  return (
    <div className="admin-surface rounded-xl border p-5">
      <h3 className="mb-4 text-small font-semibold">{title}</h3>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto w-full"
        role="img"
        aria-label={title}
      >
        <defs>
          <linearGradient id="admin-line-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={area} fill="url(#admin-line-fill)" />
        <polyline
          points={polyline}
          fill="none"
          stroke="#7c3aed"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {points.map((point) => (
          <g key={point.label}>
            <circle cx={point.x} cy={point.y} r="4" fill="#7c3aed" />
            <text
              x={point.x}
              y={height - 6}
              textAnchor="middle"
              className="fill-muted-foreground text-[10px]"
            >
              {point.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
