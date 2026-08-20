export function ContactFormSkeleton() {
  return (
    <div className="contact-form-panel animate-pulse" aria-hidden>
      <div className="contact-form-panel__inner space-y-4">
        <div className="contact-form__grid">
          <div className="h-[3.25rem] rounded-[0.85rem] bg-muted/40" />
          <div className="h-[3.25rem] rounded-[0.85rem] bg-muted/40" />
          <div className="h-[3.25rem] rounded-[0.85rem] bg-muted/40" />
          <div className="h-[3.25rem] rounded-[0.85rem] bg-muted/40" />
        </div>
        <div className="h-32 rounded-[0.85rem] bg-muted/40" />
        <div className="h-12 w-40 rounded-[1rem] bg-muted/40" />
      </div>
    </div>
  );
}
