export default function Loading() {
  return (
    <main aria-busy="true" aria-label="Loading projects" className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-16 px-6 py-20 sm:py-28">
      <div className="flex flex-col gap-4">
        <div className="h-3 w-14 animate-pulse rounded bg-muted" />
        <div className="h-9 w-48 animate-pulse rounded bg-muted" />
      </div>

      <div className="flex flex-col border-t border-border pt-10">
        <div className="h-3 w-20 animate-pulse rounded bg-muted" />
        <div className="mt-6 flex flex-col gap-6">
          {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-start gap-4 border-t border-border pt-6 first:border-t-0 first:pt-0">
                <div className="h-3 w-5 animate-pulse rounded bg-muted" />
                <div className="flex flex-1 flex-col gap-2">
                <div className="h-5 w-32 animate-pulse rounded bg-muted" />
                <div className="h-4 w-full animate-pulse rounded bg-muted" />
                <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
                </div>
              </div>
          ))}
        </div>
      </div>
    </main>
  );
}
