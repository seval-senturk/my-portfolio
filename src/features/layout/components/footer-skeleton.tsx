import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/container";

interface FooterSkeletonProps {
  className?: string;
}

export function FooterSkeleton({ className }: FooterSkeletonProps) {
  return (
    <footer
      className={cn("site-footer animate-pulse", className)}
      aria-hidden
    >
      <div className="site-footer__newsletter">
        <Container size="wide">
          <div className="mx-auto max-w-xl space-y-4 text-center">
            <div className="mx-auto h-3 w-32 rounded bg-white/10" />
            <div className="mx-auto h-10 w-full max-w-md rounded bg-white/10" />
            <div className="mx-auto h-4 w-80 max-w-full rounded bg-white/10" />
            <div className="mx-auto h-12 w-full max-w-lg rounded-full bg-white/10" />
          </div>
        </Container>
      </div>
      <Container size="wide" className="site-footer__main">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="h-10 rounded bg-white/10" />
          <div className="h-10 rounded bg-white/10" />
          <div className="h-10 rounded bg-white/10" />
        </div>
        <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-8 sm:flex-row sm:justify-between">
          <div className="h-4 w-64 rounded bg-white/10" />
          <div className="h-8 w-32 rounded bg-white/10" />
        </div>
      </Container>
    </footer>
  );
}
