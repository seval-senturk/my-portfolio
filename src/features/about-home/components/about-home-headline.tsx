interface AboutHomeHeadlineProps {
  id: string;
  title: string;
  titleAccent?: string | null;
}

function renderLineWithAccent(line: string, titleAccent: string | null | undefined) {
  if (!titleAccent) {
    return line;
  }

  const accentIndex = line.indexOf(titleAccent);
  if (accentIndex === -1) {
    return line;
  }

  const before = line.slice(0, accentIndex);
  const after = line.slice(accentIndex + titleAccent.length);

  return (
    <>
      {before}
      <span className="about-home__title-accent">{titleAccent}</span>
      {after}
    </>
  );
}

export function AboutHomeHeadline({ id, title, titleAccent = null }: AboutHomeHeadlineProps) {
  const lines = title.split("\n").filter(Boolean);

  return (
    <h2 id={id} className="about-home__title">
      {lines.map((line, index) => (
        <span key={`${line}-${index}`} className="about-home__title-line">
          {renderLineWithAccent(line, titleAccent)}
        </span>
      ))}
    </h2>
  );
}
