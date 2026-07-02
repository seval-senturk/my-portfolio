import { AboutHomeTitle } from "@/features/about-home/components/about-home-title";

interface CareerJourneySectionHeaderProps {
  label: string;
  title: string;
  titleAccent?: string | null;
  description: string;
  headingId: string;
}

export function CareerJourneySectionHeader({
  label,
  title,
  titleAccent = null,
  description,
  headingId,
}: CareerJourneySectionHeaderProps) {
  return (
    <header className="career-journey__header">
      <p className="about-home__label">{label}</p>
      <AboutHomeTitle id={headingId} title={title} titleAccent={titleAccent} />
      <p className="about-home__description career-journey__description">{description}</p>
    </header>
  );
}
