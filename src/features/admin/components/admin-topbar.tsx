"use client";

import { Bell, ExternalLink, LogOut, Search, UserCircle2 } from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";

import { ADMIN_ROUTES } from "@/config/admin-routes.config";
import { ROUTES } from "@/constants/routes";
import { adminTr } from "@/features/admin/i18n/tr";
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
    <header className="admin-topbar">
      <div className="admin-topbar__inner">
        <div className="admin-topbar__search">
          <Search className="admin-topbar__search-icon" aria-hidden />
          <Input
            type="search"
            placeholder={adminTr.topbar.searchPlaceholder}
            className="admin-topbar__search-input"
            aria-label={adminTr.topbar.searchLabel}
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
            <div className="admin-topbar__search-results">
              {isSearching ? (
                <p className="px-4 py-3 text-caption text-muted-foreground">
                  {adminTr.common.searching}
                </p>
              ) : results.length === 0 ? (
                <p className="px-4 py-3 text-caption text-muted-foreground">
                  {adminTr.common.noResults}
                </p>
              ) : (
                <ul className="max-h-72 overflow-y-auto py-1">
                  {results.map((result) => (
                    <li key={`${result.type}-${result.id}`}>
                      <Link
                        href={result.href}
                        className="admin-topbar__search-result"
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

        <div className="admin-topbar__actions">
          <Link href={ROUTES.home} className="admin-topbar__view-site" target="_blank">
            <ExternalLink className="h-3.5 w-3.5" aria-hidden />
            {adminTr.topbar.viewSite}
          </Link>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            aria-label={adminTr.topbar.notifications}
            disabled
            title={adminTr.topbar.notificationsTitle}
          >
            <Bell className="h-4 w-4" />
          </Button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setIsMenuOpen((current) => !current)}
              className={cn("admin-topbar__user-trigger", FOCUS_RING_CLASS)}
              aria-expanded={isMenuOpen}
              aria-haspopup="menu"
            >
              <UserCircle2 className="h-8 w-8 text-muted-foreground" />
              <div className="hidden sm:block">
                <p className="text-small font-medium">{userName ?? adminTr.topbar.admin}</p>
                <p className="text-caption text-muted-foreground">{userEmail}</p>
              </div>
            </button>

            {isMenuOpen ? (
              <div role="menu" className="admin-topbar__user-menu">
                <div className="admin-topbar__user-meta">
                  <p className="text-small font-medium">{userName ?? adminTr.topbar.admin}</p>
                  <p className="text-caption text-muted-foreground">{userEmail}</p>
                </div>
                <button
                  type="button"
                  role="menuitem"
                  className="admin-topbar__logout"
                  onClick={() => {
                    setIsMenuOpen(false);
                    void signOut({ callbackUrl: ADMIN_ROUTES.login });
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  {adminTr.topbar.logout}
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
