interface FooterDecorSvgProps {
  className?: string;
}

const STROKE = "rgba(161, 166, 180, 0.08)";
const STROKE_ACCENT = "rgba(124, 131, 255, 0.06)";

export function FooterDecorSvg({ className }: FooterDecorSvgProps) {
  return (
    <svg
      aria-hidden
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1440 520"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
    >
      <circle cx="0" cy="0" r="120" stroke={STROKE} strokeWidth="1" />
      <circle cx="0" cy="0" r="200" stroke={STROKE} strokeWidth="1" />
      <circle cx="0" cy="0" r="280" stroke={STROKE} strokeWidth="1" />
      <circle cx="0" cy="0" r="360" stroke={STROKE_ACCENT} strokeWidth="1" />

      <circle cx="1440" cy="0" r="120" stroke={STROKE} strokeWidth="1" />
      <circle cx="1440" cy="0" r="200" stroke={STROKE} strokeWidth="1" />
      <circle cx="1440" cy="0" r="280" stroke={STROKE} strokeWidth="1" />
      <circle cx="1440" cy="0" r="360" stroke={STROKE_ACCENT} strokeWidth="1" />
    </svg>
  );
}
