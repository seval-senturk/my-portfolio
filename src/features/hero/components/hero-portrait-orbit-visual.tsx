const HERO_PORTRAIT_ORBIT = {
  radii: [120, 210, 300, 390] as const,
  viewBoxWidth: 520,
  viewBoxHeight: 640,
} as const;

const STROKE = "rgba(255, 255, 255, 0.08)";
const STROKE_ACCENT = "rgba(124, 131, 255, 0.14)";

export function HeroPortraitOrbitVisual() {
  const { radii, viewBoxWidth, viewBoxHeight } = HERO_PORTRAIT_ORBIT;
  const centerX = viewBoxWidth * 0.42;
  const centerY = viewBoxHeight * 0.52;

  return (
    <svg
      aria-hidden
      className="hero-portrait-orbit-visual"
      viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      {radii.map((radius, index) => (
        <circle
          key={radius}
          cx={centerX}
          cy={centerY}
          r={radius}
          stroke={index % 2 === 0 ? STROKE : STROKE_ACCENT}
          strokeWidth={index === 1 ? 1.25 : 1}
        />
      ))}
    </svg>
  );
}
