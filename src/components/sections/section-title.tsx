interface SectionTitleProps {
  id: string;
  title: string;
  titleAccent?: string | null;
  as?: "h1" | "h2";
}

export function SectionTitle({
  id,
  title,
  titleAccent = null,
  as: Heading = "h2",
}: SectionTitleProps) {
  if (!titleAccent) {
    return (
      <Heading id={id} className="home-section-header__title">
        {title}
      </Heading>
    );
  }

  const accentIndex = title.lastIndexOf(titleAccent);

  if (accentIndex === -1) {
    return (
      <Heading id={id} className="home-section-header__title">
        {title}
      </Heading>
    );
  }

  const before = title.slice(0, accentIndex);
  const after = title.slice(accentIndex + titleAccent.length);

  return (
    <Heading id={id} className="home-section-header__title">
      {before}
      <span className="home-section-header__title-accent">{titleAccent}</span>
      {after}
    </Heading>
  );
}
