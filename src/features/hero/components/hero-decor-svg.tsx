interface HeroDecorSvgProps {
  className?: string;
}

const STROKE = "rgba(161, 166, 180, 0.14)";
const STROKE_ACCENT = "rgba(124, 131, 255, 0.12)";

export function HeroDecorSvg({ className }: HeroDecorSvgProps) {
  return (
    <svg
      aria-hidden
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
    >
      {/* Top-left quarter arcs */}
      <circle cx="0" cy="0" r="100" stroke={STROKE} strokeWidth="1" />
      <circle cx="0" cy="0" r="180" stroke={STROKE} strokeWidth="1" />
      <circle cx="0" cy="0" r="260" stroke={STROKE} strokeWidth="1" />
      <circle cx="0" cy="0" r="340" stroke={STROKE_ACCENT} strokeWidth="1" />

      {/* Bottom-left quarter arcs */}
      <circle cx="0" cy="900" r="90" stroke={STROKE} strokeWidth="1" />
      <circle cx="0" cy="900" r="170" stroke={STROKE} strokeWidth="1" />
      <circle cx="0" cy="900" r="250" stroke={STROKE} strokeWidth="1" />
      <circle cx="0" cy="900" r="330" stroke={STROKE_ACCENT} strokeWidth="1" />
    </svg>
  );
}
