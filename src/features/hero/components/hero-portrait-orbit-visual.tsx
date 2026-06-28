const HERO_PORTRAIT_ORBIT = {
  radii: [190, 300, 410] as const,
  middleArcIndex: 1,
  viewBoxHeight: 560,
  viewBoxWidth: 420,
} as const;

const STROKE = "rgba(255, 255, 255, 0.11)";
const STROKE_MIDDLE = "rgba(255, 255, 255, 0.15)";

export function HeroPortraitOrbitVisual() {
  const centerY = HERO_PORTRAIT_ORBIT.viewBoxHeight / 2;
  const { radii, middleArcIndex, viewBoxWidth, viewBoxHeight } =
    HERO_PORTRAIT_ORBIT;

  return (
    <svg
      aria-hidden
      className="hero-portrait-orbit-visual h-full w-full"
      viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      {radii.map((radius, index) => (
        <path
          key={radius}
          d={`M 0 ${centerY - radius} A ${radius} ${radius} 0 0 1 0 ${centerY + radius}`}
          stroke={index === middleArcIndex ? STROKE_MIDDLE : STROKE}
          strokeWidth={index === middleArcIndex ? 1.5 : 1}
        />
      ))}
    </svg>
  );
}
