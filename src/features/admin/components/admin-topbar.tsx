"use client";

import { Bell, LogOut, Search, UserCircle2 } from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";

import { ADMIN_ROUTES } from "@/config/admin-routes.config";
import { cn } from "@/lib/cn";
import { FOCUS_RING_CLASS } from "@/lib/accessibility";
import type { SearchResultItem } from "@/types/platform";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AdminTopbarProps {
  userName?: string | null;
  userEmail: string;
}

export function AdminTopbar({ userName, userEmail }: AdminTopbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const runSearch = useCallback(async (term: string) => {
    if (term.trim().length < 2) {
      setResults([]);
      return;
    }

    setIsSearching(true);

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(term.trim())}`);
      const payload = (await response.json()) as { results?: SearchResultItem[] };
      setResults(payload.results ?? []);
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (query.trim().length >= 2) {
        void runSearch(query);
      } else {
        setResults([]);
      }
    }, 300);

    return () => window.clearTimeout(timer);
  }, [query, runSearch]);

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-surface/95 backdrop-blur">
      <div className="flex flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:justify-between lg:px-6">
        <div className="relative max-w-md flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Blog, proje, deneyim ara…"
            className="pl-9"
            aria-label="Admin içeriğinde ara"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setShowResults(true);
            }}
            onFocus={() => setShowResults(true)}
            onBlur={() => {
              window.setTimeout(() => setShowResults(false), 150);
            }}
          />

          {showResults && query.trim().length >= 2 ? (
            <div className="absolute top-full z-30 mt-2 w-full rounded-xl border border-border bg-surface shadow-lg">
              {isSearching ? (
                <p className="px-4 py-3 text-caption text-muted-foreground">Searching…</p>
              ) : results.length === 0 ? (
                <p className="px-4 py-3 text-caption text-muted-foreground">No results found.</p>
              ) : (
                <ul className="max-h-72 overflow-y-auto py-2">
                  {results.map((result) => (
                    <li key={`${result.type}-${result.id}`}>
                      <Link
                        href={result.href}
                        className="block px-4 py-2 text-small hover:bg-muted"
                        onClick={() => setShowResults(false)}
                      >
                        <span className="font-medium">{result.title}</span>
                        <span className="ml-2 text-caption text-muted-foreground uppercase">
                          {result.type}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : null}
        </div>

        <div className="flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            aria-label="Bildirimler"
            disabled
            title="In-app notifications — platform service ready"
          >
            <Bell className="h-4 w-4" />
          </Button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setIsMenuOpen((current) => !current)}
              className={cn(
                "flex items-center gap-3 rounded-xl border border-border bg-background px-3 py-2 text-left transition-base hover:bg-muted",
                FOCUS_RING_CLASS,
              )}
              aria-expanded={isMenuOpen}
              aria-haspopup="menu"
            >
              <UserCircle2 className="h-8 w-8 text-muted-foreground" />
              <div className="hidden sm:block">
                <p className="text-small font-medium">{userName ?? "Admin"}</p>
                <p className="text-caption text-muted-foreground">{userEmail}</p>
              </div>
            </button>

            {isMenuOpen ? (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-surface p-2 shadow-lg"
              >
                <div className="border-b border-border px-3 py-2">
                  <p className="text-small font-medium">{userName ?? "Admin"}</p>
                  <p className="text-caption text-muted-foreground">{userEmail}</p>
                </div>
                <button
                  type="button"
                  role="menuitem"
                  className="mt-2 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-small text-foreground hover:bg-muted"
                  onClick={() => {
                    setIsMenuOpen(false);
                    void signOut({ callbackUrl: ADMIN_ROUTES.login });
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  Çıkış yap
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
