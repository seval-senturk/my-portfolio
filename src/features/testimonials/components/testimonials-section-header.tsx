import { AboutHomeTitle } from "@/features/about-home/components/about-home-title";

interface TestimonialsSectionHeaderProps {
  label: string;
  title: string;
  titleAccent?: string | null;
  description: string;
  headingId: string;
}

export function TestimonialsSectionHeader({
  label,
  title,
  titleAccent = null,
  description,
  headingId,
}: TestimonialsSectionHeaderProps) {
  return (
    <header className="testimonials-section__header">
      <p className="testimonials-section__label">{label}</p>
      <AboutHomeTitle id={headingId} title={title} titleAccent={titleAccent} />
      <p className="testimonials-section__description">{description}</p>
    </header>
  );
}
