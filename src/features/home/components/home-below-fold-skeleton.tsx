import { Container } from "@/components/ui/container";

export function HomeBelowFoldSkeleton() {
  return (
    <div aria-hidden className="animate-pulse space-y-24 py-16">
      {[1, 2, 3].map((section) => (
        <Container key={section} size="default" className="space-y-6">
          <div className="h-8 w-48 rounded bg-muted" />
          <div className="h-4 w-full max-w-2xl rounded bg-muted" />
          <div className="grid gap-4 md:grid-cols-2">
            <div className="h-32 rounded-xl bg-muted" />
            <div className="h-32 rounded-xl bg-muted" />
          </div>
        </Container>
      ))}
    </div>
  );
}
