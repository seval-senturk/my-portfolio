import { Quote, Star } from "lucide-react";

import type { TestimonialItem } from "@/types/testimonials";
import { cn } from "@/lib/cn";

interface TestimonialCardProps {
  item: TestimonialItem;
  isActive?: boolean;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function TestimonialAvatar({ url, name }: { url?: string | null; name: string }) {
  if (url?.trim()) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={url} alt="" className="testimonial-card__avatar-image" loading="lazy" />
    );
  }

  return <span className="testimonial-card__avatar-fallback">{getInitials(name)}</span>;
}

export function TestimonialCard({ item, isActive = false }: TestimonialCardProps) {
  const roleLine = `${item.authorTitle} — ${item.company}`;

  return (
    <article
      className={cn("testimonial-card", isActive && "testimonial-card--active")}
      aria-label={`Testimonial from ${item.authorName}`}
    >
      <Quote className="testimonial-card__quote-icon" aria-hidden />

      <blockquote className="testimonial-card__quote">
        <p>{item.quote}</p>
      </blockquote>

      {item.rating && item.rating > 0 ? (
        <div
          className="testimonial-card__rating"
          aria-label={`${item.rating} out of 5 stars`}
        >
          {Array.from({ length: 5 }, (_, index) => (
            <Star
              key={index}
              className={cn(
                "testimonial-card__star",
                index < item.rating! && "testimonial-card__star--filled",
              )}
              aria-hidden
            />
          ))}
        </div>
      ) : null}

      <footer className="testimonial-card__author">
        <div className="testimonial-card__avatar" aria-hidden>
          <TestimonialAvatar url={item.avatarUrl} name={item.authorName} />
        </div>

        <div className="testimonial-card__author-meta">
          <p className="testimonial-card__author-name">{item.authorName}</p>
          <p className="testimonial-card__author-role">
            {item.companyLogoUrl?.trim() ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.companyLogoUrl}
                alt=""
                className="testimonial-card__company-logo"
                loading="lazy"
              />
            ) : null}
            <span>{roleLine}</span>
          </p>
        </div>
      </footer>
    </article>
  );
}
