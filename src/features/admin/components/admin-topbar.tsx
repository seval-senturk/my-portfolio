"use client";

import { Bell, LogOut, Moon, Search, UserCircle2 } from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";

import { ADMIN_ROUTES } from "@/config/admin-routes.config";
import { cn } from "@/lib/cn";
import { FOCUS_RING_CLASS } from "@/lib/accessibility";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AdminTopbarProps {
  userName?: string | null;
  userEmail: string;
}

export function AdminTopbar({ userName, userEmail }: AdminTopbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-surface/95 backdrop-blur">
      <div className="flex flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:justify-between lg:px-6">
        <div className="relative max-w-md flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search content, projects, messages…"
            className="pl-9"
            aria-label="Search admin content"
            disabled
          />
          <span className="absolute top-1/2 right-3 -translate-y-1/2 text-caption text-muted-foreground">
            Soon
          </span>
        </div>

        <div className="flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            aria-label="Notifications"
            disabled
            title="Notifications coming soon"
          >
            <Bell className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            aria-label="Theme toggle"
            disabled
            title="Theme switching coming soon"
          >
            <Moon className="h-4 w-4" />
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
                <p className="text-small font-medium">{userName ?? "Admin User"}</p>
                <p className="text-caption text-muted-foreground">{userEmail}</p>
              </div>
            </button>

            {isMenuOpen ? (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-surface p-2 shadow-lg"
              >
                <div className="border-b border-border px-3 py-2">
                  <p className="text-small font-medium">{userName ?? "Admin User"}</p>
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
                  Sign out
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
