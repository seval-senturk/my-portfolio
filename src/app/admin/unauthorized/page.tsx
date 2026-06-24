import type { Metadata } from "next";

import { AuthErrorAlert } from "@/features/admin/components/auth-error-alert";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Access Denied",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminUnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center bg-background py-12">
      <Container size="narrow" className="w-full max-w-lg">
        <AuthErrorAlert code="forbidden" />
      </Container>
    </div>
  );
}
