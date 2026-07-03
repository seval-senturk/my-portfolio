interface AboutHomeDecorProps {
  className?: string;
}

export function AboutHomeDecor({ className }: AboutHomeDecorProps) {
  return (
    <svg
      aria-hidden
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 800 400"
      fill="none"
    >
      <circle cx="680" cy="80" r="2" fill="rgba(124, 131, 255, 0.18)" />
      <circle cx="720" cy="140" r="1.5" fill="rgba(124, 131, 255, 0.12)" />
      <circle cx="640" cy="180" r="1" fill="rgba(161, 166, 180, 0.15)" />
      <line
        x1="120"
        y1="60"
        x2="200"
        y2="60"
        stroke="rgba(124, 131, 255, 0.08)"
        strokeWidth="1"
      />
      <line
        x1="600"
        y1="320"
        x2="760"
        y2="320"
        stroke="rgba(161, 166, 180, 0.06)"
        strokeWidth="1"
      />
    </svg>
  );
}
