import { Container } from "@/components/ui/container";

export default function SiteLoading() {
  return (
    <Container size="wide" className="py-16">
      <div className="mx-auto max-w-xl animate-pulse space-y-4">
        <div className="h-8 w-2/3 rounded-lg bg-muted" />
        <div className="h-4 w-full rounded bg-muted" />
        <div className="h-4 w-5/6 rounded bg-muted" />
        <div className="mt-8 h-40 rounded-xl bg-muted" />
      </div>
    </Container>
  );
}
