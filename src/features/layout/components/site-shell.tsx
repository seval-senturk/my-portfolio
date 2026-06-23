import type { ReactNode } from "react";

import { A11Y } from "@/lib/accessibility";

import { Footer } from "@/features/layout/components/footer";
import { Header } from "@/features/layout/components/header";

interface SiteShellProps {
  children: ReactNode;
}

export function SiteShell({ children }: SiteShellProps) {
  return (
    <>
      <Header />
      <main id={A11Y.mainContentId} className="flex flex-1 flex-col">
        {children}
      </main>
      <Footer />
    </>
  );
}
