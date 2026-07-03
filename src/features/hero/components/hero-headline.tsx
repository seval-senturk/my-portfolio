interface HeroHeadlineProps {
  greeting: string;
  name: string;
  jobTitle?: string;
}

function splitDisplayName(name: string): { first: string; last: string } {
  const trimmed = name.trim();
  const spaceIndex = trimmed.indexOf(" ");

  if (spaceIndex === -1) {
    return { first: trimmed, last: "" };
  }

  return {
    first: trimmed.slice(0, spaceIndex),
    last: trimmed.slice(spaceIndex + 1),
  };
}

export function HeroHeadline({ greeting, name, jobTitle }: HeroHeadlineProps) {
  const { first, last } = splitDisplayName(name);

  return (
    <div className="hero-headline">
      <p className="hero-headline__greeting">
        <span className="hero-headline__greeting-line" aria-hidden />
        <span>{greeting}</span>
      </p>

      <h1 id="hero-heading" className="hero-headline__title">
        <span className="hero-headline__name-first">{first}</span>
        {last ? (
          <>
            <br />
            <span className="hero-headline__name-last">{last}</span>
          </>
        ) : null}
      </h1>

      {jobTitle ? <p className="hero-headline__job-title">{jobTitle}</p> : null}
    </div>
  );
}
