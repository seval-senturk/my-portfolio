interface HeroNameUnderlineProps {
  className?: string;
}

export function HeroNameUnderline({ className }: HeroNameUnderlineProps) {
  return (
    <svg
      aria-hidden
      className={className}
      viewBox="0 0 280 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      <path
        d="M2 8C48 2 92 10 138 6C184 2 228 9 278 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        className="text-muted-foreground/70"
      />
    </svg>
  );
}
