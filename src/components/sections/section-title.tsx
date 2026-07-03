interface SectionTitleProps {
  id: string;
  title: string;
  titleAccent?: string | null;
}

export function SectionTitle({
  id,
  title,
  titleAccent = null,
}: SectionTitleProps) {
  if (!titleAccent) {
    return (
      <h2 id={id} className="home-section-header__title">
        {title}
      </h2>
    );
  }

  const accentIndex = title.lastIndexOf(titleAccent);

  if (accentIndex === -1) {
    return (
      <h2 id={id} className="home-section-header__title">
        {title}
      </h2>
    );
  }

  const before = title.slice(0, accentIndex);
  const after = title.slice(accentIndex + titleAccent.length);

  return (
    <h2 id={id} className="home-section-header__title">
      {before}
      <span className="home-section-header__title-accent">{titleAccent}</span>
      {after}
    </h2>
  );
}
