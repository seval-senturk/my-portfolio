import { signOut } from "@/auth";
import { ADMIN_ROUTES } from "@/config/admin-routes.config";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

interface AdminTopbarProps {
  userName?: string | null;
  userEmail: string;
}

export function AdminTopbar({ userName, userEmail }: AdminTopbarProps) {
  return (
    <header className="flex items-center justify-between border-b border-border bg-surface px-6 py-4">
      <div>
        <Text as="p" className="font-medium">
          {userName ?? "Admin User"}
        </Text>
        <Text as="p" variant="small" tone="muted">
          {userEmail}
        </Text>
      </div>
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: ADMIN_ROUTES.login });
        }}
      >
        <Button type="submit" variant="outline" size="sm">
          Sign out
        </Button>
      </form>
    </header>
  );
}
