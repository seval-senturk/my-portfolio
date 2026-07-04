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

function getSlidesPerView(width: number): number {
  if (width >= 1024) return 3;
  if (width >= 768) return 2;
  return 1;
}

function getStepSize(track: HTMLDivElement): number {
  const firstSlide = track.children.item(0) as HTMLElement | null;
  if (!firstSlide) return 0;

  const gapValue =
    getComputedStyle(track).gap || getComputedStyle(track).columnGap || "0";
  const gap = Number.parseFloat(gapValue) || 0;
  return firstSlide.offsetWidth + gap;
}

export function TestimonialsCarousel({
  items,
  settings,
  labelId,
}: TestimonialsCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const carouselId = useId();
  const autoplayTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [slidesPerView, setSlidesPerView] = useState(1);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const pageCount = Math.max(1, items.length - slidesPerView + 1);

  useEffect(() => {
    const updateSlidesPerView = () => {
      setSlidesPerView(getSlidesPerView(window.innerWidth));
    };

    updateSlidesPerView();
    window.addEventListener("resize", updateSlidesPerView, { passive: true });
    return () => window.removeEventListener("resize", updateSlidesPerView);
  }, []);

  useEffect(() => {
    setActiveIndex((current) => Math.min(current, pageCount - 1));
  }, [pageCount]);

  const scrollToIndex = useCallback(
    (index: number) => {
      const track = trackRef.current;
      if (!track || items.length === 0) return;

      let targetIndex = index;
      if (settings.loop && pageCount > 1) {
        if (targetIndex < 0) targetIndex = pageCount - 1;
        if (targetIndex >= pageCount) targetIndex = 0;
      } else {
        targetIndex = Math.min(Math.max(index, 0), pageCount - 1);
      }

      const target = track.children.item(targetIndex) as HTMLElement | null;
      target?.scrollIntoView({
        behavior: "smooth",
        inline: "start",
        block: "nearest",
      });
      setActiveIndex(targetIndex);
    },
    [items.length, pageCount, settings.loop],
  );

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const onScroll = () => {
      const step = getStepSize(track);
      if (step <= 0) return;

      const index = Math.round(track.scrollLeft / step);
      setActiveIndex(Math.min(Math.max(index, 0), pageCount - 1));
    };

    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, [pageCount]);

  useEffect(() => {
    if (!settings.enabled || !settings.autoplay || isPaused || pageCount <= 1) {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
        autoplayTimerRef.current = null;
      }
      return;
    }

    autoplayTimerRef.current = setInterval(() => {
      setActiveIndex((current) => {
        const next = current + 1;
        scrollToIndex(next >= pageCount ? 0 : next);
        return next >= pageCount ? 0 : next;
      });
    }, Math.max(settings.autoplayDelayMs, 2000));

    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
    };
  }, [
    isPaused,
    pageCount,
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
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <div className="testimonials-carousel__viewport">
        <div
          ref={trackRef}
          className="testimonials-carousel__track"
          id={`${carouselId}-track`}
        >
          {items.map((item, index) => (
            <div
              key={item.id}
              id={`${carouselId}-slide-${index}`}
              className="testimonials-carousel__slide"
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${items.length}`}
            >
              <TestimonialCard
                item={item}
                isActive={index >= activeIndex && index < activeIndex + slidesPerView}
              />
            </div>
          ))}
        </div>
      </div>

      {pageCount > 1 ? (
        <div
          className="testimonials-carousel__pagination"
          role="tablist"
          aria-label="Testimonial slides"
        >
          {Array.from({ length: pageCount }, (_, pageIndex) => (
            <button
              key={pageIndex}
              type="button"
              role="tab"
              aria-selected={pageIndex === activeIndex}
              aria-controls={`${carouselId}-slide-${pageIndex}`}
              className={cn(
                "testimonials-carousel__dot",
                pageIndex === activeIndex && "is-active",
              )}
              onClick={() => scrollToIndex(pageIndex)}
            >
              <span className="sr-only">Go to slide {pageIndex + 1}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
