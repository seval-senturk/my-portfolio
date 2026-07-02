"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

import type {
  TestimonialItem,
  TestimonialsCarouselSettings,
} from "@/types/testimonials";
import { TestimonialCard } from "@/features/testimonials/components/testimonial-card";
import { cn } from "@/lib/cn";

interface TestimonialsCarouselProps {
  items: readonly TestimonialItem[];
  settings: TestimonialsCarouselSettings;
  labelId: string;
}

function getClosestSlideIndex(track: HTMLDivElement): number {
  const slides = Array.from(track.children) as HTMLElement[];
  if (slides.length === 0) return 0;

  const trackCenter = track.scrollLeft + track.clientWidth / 2;
  let closestIndex = 0;
  let closestDistance = Number.POSITIVE_INFINITY;

  slides.forEach((slide, index) => {
    const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
    const distance = Math.abs(trackCenter - slideCenter);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = index;
    }
  });

  return closestIndex;
}

export function TestimonialsCarousel({
  items,
  settings,
  labelId,
}: TestimonialsCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const carouselId = useId();
  const [activeIndex, setActiveIndex] = useState(0);
  const autoplayTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scrollToIndex = useCallback(
    (index: number, behavior: ScrollBehavior = "smooth") => {
      const track = trackRef.current;
      if (!track || items.length === 0) return;

      let targetIndex = index;
      if (settings.loop) {
        if (targetIndex < 0) targetIndex = items.length - 1;
        if (targetIndex >= items.length) targetIndex = 0;
      } else {
        targetIndex = Math.min(Math.max(index, 0), items.length - 1);
      }

      const slide = track.children.item(targetIndex) as HTMLElement | null;
      if (!slide) return;

      const offset =
        slide.offsetLeft - (track.clientWidth - slide.offsetWidth) / 2;

      track.scrollTo({ left: offset, behavior });
      setActiveIndex(targetIndex);
    },
    [items.length, settings.loop],
  );

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const onScroll = () => {
      window.requestAnimationFrame(() => {
        setActiveIndex(getClosestSlideIndex(track));
      });
    };

    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, [items.length]);

  useEffect(() => {
    if (!settings.enabled || !settings.autoplay || items.length <= 1) {
      return undefined;
    }

    autoplayTimerRef.current = setInterval(() => {
      scrollToIndex(activeIndex + 1);
    }, Math.max(settings.autoplayDelayMs, 2000));

    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
    };
  }, [
    activeIndex,
    items.length,
    scrollToIndex,
    settings.autoplay,
    settings.autoplayDelayMs,
    settings.enabled,
  ]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      scrollToIndex(activeIndex + 1);
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      scrollToIndex(activeIndex - 1);
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div
      className="testimonials-carousel"
      role="region"
      aria-roledescription="carousel"
      aria-labelledby={labelId}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => {
        if (autoplayTimerRef.current) {
          clearInterval(autoplayTimerRef.current);
        }
      }}
      onMouseLeave={() => {
        if (!settings.enabled || !settings.autoplay || items.length <= 1) return;

        autoplayTimerRef.current = setInterval(() => {
          scrollToIndex(activeIndex + 1);
        }, Math.max(settings.autoplayDelayMs, 2000));
      }}
    >
      <div className="testimonials-carousel__viewport">
        <div ref={trackRef} className="testimonials-carousel__track" id={`${carouselId}-track`}>
          {items.map((item, index) => (
            <div
              key={item.id}
              id={`${carouselId}-slide-${index}`}
              className={cn(
                "testimonials-carousel__slide",
                index === activeIndex && "is-active",
              )}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${items.length}`}
              aria-hidden={index !== activeIndex}
            >
              <TestimonialCard item={item} isActive={index === activeIndex} />
            </div>
          ))}
        </div>
      </div>

      {items.length > 1 ? (
        <div
          className="testimonials-carousel__pagination"
          role="tablist"
          aria-label="Testimonial slides"
        >
          {items.map((item, index) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              aria-controls={`${carouselId}-slide-${index}`}
              className={cn(
                "testimonials-carousel__dot",
                index === activeIndex && "is-active",
              )}
              onClick={() => scrollToIndex(index)}
            >
              <span className="sr-only">
                Go to testimonial {index + 1} from {item.authorName}
              </span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
