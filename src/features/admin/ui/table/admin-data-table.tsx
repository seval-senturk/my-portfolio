"use client";

import { useMemo, useState, type ReactNode } from "react";
import { ChevronDown, ChevronUp, Search } from "lucide-react";

import { cn } from "@/lib/cn";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";

export interface AdminTableColumn<T> {
  id: string;
  header: string;
  accessor: (row: T) => ReactNode;
  sortValue?: (row: T) => string | number;
  className?: string;
}

interface AdminDataTableProps<T extends { id: string }> {
  data: readonly T[];
  columns: readonly AdminTableColumn<T>[];
  searchPlaceholder?: string;
  searchFilter?: (row: T, query: string) => boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  pageSize?: number;
  bulkActions?: ReactNode;
  rowActions?: (row: T) => ReactNode;
}

type SortDirection = "asc" | "desc";

export function AdminDataTable<T extends { id: string }>({
  data,
  columns,
  searchPlaceholder = "Search…",
  searchFilter,
  emptyTitle = "No records found",
  emptyDescription = "Create your first entry to get started.",
  pageSize = 10,
  bulkActions,
  rowActions,
}: AdminDataTableProps<T>) {
  const [query, setQuery] = useState("");
  const [sortColumnId, setSortColumnId] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filteredData = useMemo(() => {
    if (!query.trim() || !searchFilter) {
      return [...data];
    }

    return data.filter((row) => searchFilter(row, query.trim().toLowerCase()));
  }, [data, query, searchFilter]);

  const sortedData = useMemo(() => {
    if (!sortColumnId) {
      return filteredData;
    }

    const column = columns.find((item) => item.id === sortColumnId);

    if (!column?.sortValue) {
      return filteredData;
    }

    return [...filteredData].sort((a, b) => {
      const aValue = column.sortValue!(a);
      const bValue = column.sortValue!(b);

      if (aValue < bValue) {
        return sortDirection === "asc" ? -1 : 1;
      }

      if (aValue > bValue) {
        return sortDirection === "asc" ? 1 : -1;
      }

      return 0;
    });
  }, [columns, filteredData, sortColumnId, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const allVisibleSelected =
    paginatedData.length > 0 &&
    paginatedData.every((row) => selectedIds.has(row.id));

  function toggleSort(columnId: string) {
    const column = columns.find((item) => item.id === columnId);

    if (!column?.sortValue) {
      return;
    }

    if (sortColumnId === columnId) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }

    setSortColumnId(columnId);
    setSortDirection("asc");
  }

  function toggleSelectAll() {
    setSelectedIds((current) => {
      const next = new Set(current);

      if (allVisibleSelected) {
        paginatedData.forEach((row) => next.delete(row.id));
      } else {
        paginatedData.forEach((row) => next.add(row.id));
      }

      return next;
    });
  }

  function toggleRow(id: string) {
    setSelectedIds((current) => {
      const next = new Set(current);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  }

  if (data.length === 0) {
    return (
      <div className="admin-surface flex flex-col items-center justify-center px-6 py-16 text-center">
        <Text as="p" className="font-medium">
          {emptyTitle}
        </Text>
        <Text as="p" variant="small" tone="muted" className="mt-2 max-w-sm">
          {emptyDescription}
        </Text>
      </div>
    );
  }

  return (
    <div className="admin-surface overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder={searchPlaceholder}
            className="pl-9"
            aria-label="Search table"
          />
        </div>
        {bulkActions && selectedIds.size > 0 ? (
          <div className="flex items-center gap-2">{bulkActions}</div>
        ) : null}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-small">
          <thead className="border-b border-border bg-muted/40">
            <tr>
              <th scope="col" className="w-10 px-4 py-3">
                <input
                  type="checkbox"
                  aria-label="Select all rows on this page"
                  checked={allVisibleSelected}
                  onChange={toggleSelectAll}
                />
              </th>
              {columns.map((column) => (
                <th
                  key={column.id}
                  scope="col"
                  className={cn("px-4 py-3 font-medium text-muted-foreground", column.className)}
                >
                  {column.sortValue ? (
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 hover:text-foreground"
                      onClick={() => toggleSort(column.id)}
                    >
                      {column.header}
                      {sortColumnId === column.id ? (
                        sortDirection === "asc" ? (
                          <ChevronUp className="h-3.5 w-3.5" />
                        ) : (
                          <ChevronDown className="h-3.5 w-3.5" />
                        )
                      ) : null}
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              ))}
              {rowActions ? (
                <th scope="col" className="px-4 py-3 text-right font-medium text-muted-foreground">
                  Actions
                </th>
              ) : null}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row) => (
              <tr key={row.id} className="border-b border-border last:border-b-0">
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    aria-label={`Select row ${row.id}`}
                    checked={selectedIds.has(row.id)}
                    onChange={() => toggleRow(row.id)}
                  />
                </td>
                {columns.map((column) => (
                  <td key={column.id} className={cn("px-4 py-3", column.className)}>
                    {column.accessor(row)}
                  </td>
                ))}
                {rowActions ? (
                  <td className="px-4 py-3 text-right">{rowActions(row)}</td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-border px-4 py-3">
        <Text as="p" variant="small" tone="muted">
          {sortedData.length} record{sortedData.length === 1 ? "" : "s"}
        </Text>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={currentPage <= 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
          >
            Previous
          </Button>
          <Text as="span" variant="small" tone="muted">
            {currentPage} / {totalPages}
          </Text>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages}
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
