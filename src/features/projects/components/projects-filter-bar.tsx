"use client";

import type { ProjectFilterItem } from "@/types/project";
import { cn } from "@/lib/cn";

interface ProjectsFilterBarProps {
  filters: readonly ProjectFilterItem[];
  activeFilter: string;
  onFilterChange: (slug: string) => void;
}

export function ProjectsFilterBar({
  filters,
  activeFilter,
  onFilterChange,
}: ProjectsFilterBarProps) {
  const visibleFilters = filters.filter((filter) => filter.visible);

  return (
    <div className="projects-filter" role="toolbar" aria-label="Filter projects">
      <div className="projects-filter__list" role="tablist" aria-label="Project categories">
        <button
          type="button"
          role="tab"
          aria-selected={activeFilter === "all"}
          className={cn(
            "projects-filter__pill",
            activeFilter === "all" && "projects-filter__pill--active",
          )}
          onClick={() => onFilterChange("all")}
        >
          All
        </button>

        {visibleFilters.map((filter) => (
          <button
            key={filter.id}
            type="button"
            role="tab"
            aria-selected={activeFilter === filter.slug}
            className={cn(
              "projects-filter__pill",
              activeFilter === filter.slug && "projects-filter__pill--active",
            )}
            onClick={() => onFilterChange(filter.slug)}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
}
