export default function Loading() {
  return (
    <main aria-busy="true" aria-label="Loading portfolio" className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-16 px-6 py-20 sm:py-28">
      <div className="rounded-2xl border border-border p-6 sm:p-9">
        <div className="flex flex-col gap-4">
          <div className="h-3 w-28 animate-pulse rounded bg-muted" />
          <div className="h-12 w-3/4 animate-pulse rounded bg-muted" />
          <div className="h-5 w-48 animate-pulse rounded bg-muted" />
          <div className="mt-2 flex flex-col gap-2">
            <div className="h-4 w-full animate-pulse rounded bg-muted" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
          </div>
          <div className="mt-2 flex gap-3">
            <div className="h-9 w-32 animate-pulse rounded-full bg-muted" />
            <div className="h-9 w-36 animate-pulse rounded-full bg-muted" />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-5 border-t border-border pt-10">
        <div className="h-3 w-24 animate-pulse rounded bg-muted" />
        {[0, 1, 2].map((item) => (
          <div key={item} className="flex flex-col gap-2">
            <div className="h-5 w-1/2 animate-pulse rounded bg-muted" />
            <div className="h-4 w-full animate-pulse rounded bg-muted" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>
    </main>
  );
}
