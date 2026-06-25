import type { ReactNode } from "react";

import { MaintenancePage } from "@/components/platform/maintenance-page";
import { A11Y } from "@/lib/accessibility";
import { isMaintenanceModeActive, getPlatformSettings } from "@/services/platform/settings.service";

import { Footer } from "@/features/layout/components/footer";
import { Header } from "@/features/layout/components/header";

interface SiteLayoutProps {
  children: ReactNode;
}

export default async function SiteLayout({ children }: SiteLayoutProps) {
  const maintenanceActive = await isMaintenanceModeActive();

  if (maintenanceActive) {
    const settings = await getPlatformSettings();

    return (
      <>
        <Header />
        <main id={A11Y.mainContentId} className="flex flex-1 flex-col">
          <MaintenancePage message={settings.maintenanceMessage} />
        </main>
        <Footer />
      </>
    );
  }

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
