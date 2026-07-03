interface FooterDecorSvgProps {
  className?: string;
}

const STROKE = "rgba(161, 166, 180, 0.12)";
const STROKE_ACCENT = "rgba(124, 131, 255, 0.1)";

export function FooterDecorSvg({ className }: FooterDecorSvgProps) {
  return (
    <svg
      aria-hidden
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 400 400"
      fill="none"
    >
      <circle cx="400" cy="400" r="80" stroke={STROKE} strokeWidth="1" />
      <circle cx="400" cy="400" r="140" stroke={STROKE} strokeWidth="1" />
      <circle cx="400" cy="400" r="200" stroke={STROKE} strokeWidth="1" />
      <circle cx="400" cy="400" r="260" stroke={STROKE_ACCENT} strokeWidth="1" />
      <circle cx="400" cy="400" r="320" stroke={STROKE} strokeWidth="1" />
    </svg>
  );
}
