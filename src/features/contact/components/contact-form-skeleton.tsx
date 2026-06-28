export function ContactFormSkeleton() {
  return (
    <div
      className="animate-pulse space-y-4 rounded-xl border border-border bg-surface p-6"
      aria-hidden
    >
      <div className="h-5 w-32 rounded bg-muted" />
      <div className="h-10 w-full rounded bg-muted" />
      <div className="h-10 w-full rounded bg-muted" />
      <div className="h-24 w-full rounded bg-muted" />
      <div className="h-10 w-28 rounded bg-muted" />
    </div>
  );
}
