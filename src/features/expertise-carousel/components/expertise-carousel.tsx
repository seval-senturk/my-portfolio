"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

import type { ExpertiseCarouselItem } from "@/types/expertise-carousel";
import { ExpertiseCarouselCard } from "@/features/expertise-carousel/components/expertise-carousel-card";
import { cn } from "@/lib/cn";

interface ExpertiseCarouselProps {
  items: readonly ExpertiseCarouselItem[];
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

  const gapValue = getComputedStyle(track).gap || getComputedStyle(track).columnGap || "0";
  const gap = Number.parseFloat(gapValue) || 0;
  return firstSlide.offsetWidth + gap;
}

export function ExpertiseCarousel({ items, labelId }: ExpertiseCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const carouselId = useId();
  const [slidesPerView, setSlidesPerView] = useState(1);
  const [activeIndex, setActiveIndex] = useState(0);

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

      const clampedIndex = Math.min(Math.max(index, 0), pageCount - 1);
      const target = track.children.item(clampedIndex) as HTMLElement | null;
      target?.scrollIntoView({
        behavior: "smooth",
        inline: "start",
        block: "nearest",
      });
      setActiveIndex(clampedIndex);
    },
    [items.length, pageCount],
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

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      scrollToIndex(Math.min(activeIndex + 1, pageCount - 1));
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      scrollToIndex(Math.max(activeIndex - 1, 0));
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div
      className="expertise-carousel"
      role="region"
      aria-roledescription="carousel"
      aria-labelledby={labelId}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className="expertise-carousel__viewport">
        <div
          ref={trackRef}
          className="expertise-carousel__track"
          id={`${carouselId}-track`}
        >
          {items.map((item, index) => (
            <div
              key={item.id}
              id={`${carouselId}-slide-${index}`}
              className="expertise-carousel__slide"
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${items.length}`}
            >
              <ExpertiseCarouselCard item={item} />
            </div>
          ))}
        </div>
      </div>

      {pageCount > 1 ? (
        <div
          className="expertise-carousel__pagination"
          role="tablist"
          aria-label="Carousel pages"
        >
          {Array.from({ length: pageCount }, (_, pageIndex) => (
            <button
              key={pageIndex}
              type="button"
              role="tab"
              aria-selected={pageIndex === activeIndex}
              aria-controls={`${carouselId}-slide-${pageIndex}`}
              className={cn(
                "expertise-carousel__dot",
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
