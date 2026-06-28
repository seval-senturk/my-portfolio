export default function AdminLoading() {
  return (
    <div className="animate-pulse space-y-6 p-2">
      <div className="h-8 w-48 rounded-lg bg-muted" />
      <div className="h-4 w-72 max-w-full rounded bg-muted" />
      <div className="admin-surface h-64 rounded-xl bg-muted/60" />
    </div>
  );
}
