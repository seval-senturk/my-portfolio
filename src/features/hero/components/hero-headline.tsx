import { HeroNameUnderline } from "@/features/hero/components/hero-name-underline";

interface HeroHeadlineProps {
  greeting: string;
  name: string;
}

export function HeroHeadline({ greeting, name }: HeroHeadlineProps) {
  return (
    <div className="max-w-xl">
      <p className="font-serif-display text-display text-foreground">{greeting}</p>
      <h1
        id="hero-heading"
        className="font-serif-display text-display mt-1 text-foreground"
      >
        <span className="relative inline-block">
          {name}
          <HeroNameUnderline className="absolute -bottom-1 left-0 h-3 w-full min-w-[12rem] sm:min-w-[16rem]" />
        </span>
      </h1>
    </div>
  );
}
