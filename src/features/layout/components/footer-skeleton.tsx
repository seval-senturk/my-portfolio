import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/container";

interface FooterSkeletonProps {
  className?: string;
}

export function FooterSkeleton({ className }: FooterSkeletonProps) {
  return (
    <footer className={cn("site-footer animate-pulse", className)} aria-hidden>
      <Container size="wide" className="site-footer__main">
        <div className="site-footer__grid">
          <div className="space-y-4">
            <div className="h-8 w-48 rounded bg-white/10" />
            <div className="h-3 w-36 rounded bg-white/10" />
            <div className="h-16 w-full max-w-xs rounded bg-white/10" />
            <div className="flex gap-2">
              <div className="h-10 w-10 rounded-lg bg-white/10" />
              <div className="h-10 w-10 rounded-lg bg-white/10" />
              <div className="h-10 w-10 rounded-lg bg-white/10" />
            </div>
          </div>
          <div className="space-y-3">
            <div className="h-3 w-24 rounded bg-white/10" />
            <div className="h-4 w-20 rounded bg-white/10" />
            <div className="h-4 w-24 rounded bg-white/10" />
            <div className="h-4 w-16 rounded bg-white/10" />
          </div>
          <div className="space-y-3">
            <div className="h-3 w-24 rounded bg-white/10" />
            <div className="h-4 w-28 rounded bg-white/10" />
            <div className="h-4 w-24 rounded bg-white/10" />
          </div>
          <div className="space-y-3">
            <div className="h-3 w-28 rounded bg-white/10" />
            <div className="h-12 w-full max-w-xs rounded-full bg-white/10" />
          </div>
        </div>
        <div className="site-footer__bottom">
          <div className="h-4 w-64 rounded bg-white/10" />
          <div className="h-8 w-28 rounded bg-white/10" />
        </div>
      </Container>
    </footer>
  );
}
