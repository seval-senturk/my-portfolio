interface AboutHomeTitleProps {
  title: string;
  titleAccent: string | null;
  id: string;
}

export function AboutHomeTitle({ title, titleAccent, id }: AboutHomeTitleProps) {
  if (!titleAccent) {
    return (
      <h2 id={id} className="about-home__title">
        {title}
      </h2>
    );
  }

  const accentIndex = title.lastIndexOf(titleAccent);

  if (accentIndex === -1) {
    return (
      <h2 id={id} className="about-home__title">
        {title}
      </h2>
    );
  }

  const before = title.slice(0, accentIndex);
  const after = title.slice(accentIndex + titleAccent.length);

  return (
    <h2 id={id} className="about-home__title">
      {before}
      <span className="about-home__title-accent">{titleAccent}</span>
      {after}
    </h2>
  );
}
