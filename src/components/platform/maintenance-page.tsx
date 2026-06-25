import { siteConfig } from "@/config/site.config";

interface MaintenancePageProps {
  message?: string | null;
}

export function MaintenancePage({ message }: MaintenancePageProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <p className="text-caption font-medium tracking-wide text-muted-foreground uppercase">
        Maintenance
      </p>
      <h1 className="mt-3 text-h2 font-semibold tracking-tight">{siteConfig.name}</h1>
      <p className="mt-4 max-w-lg text-body text-muted-foreground">
        {message?.trim() ||
          "We are performing scheduled maintenance. Please check back soon."}
      </p>
    </div>
  );
}
