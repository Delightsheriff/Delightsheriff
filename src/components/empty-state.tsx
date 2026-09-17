type EmptyStateProps = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-dashed border-border px-5 py-6">
      <p className="font-heading text-sm font-medium text-foreground/90">{title}</p>
      <p className="mt-1 max-w-md text-sm leading-relaxed text-muted-foreground">{description}</p>
    </div>
  );
}
