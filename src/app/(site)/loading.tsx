export default function Loading() {
  return (
    <main aria-busy="true" aria-label="Loading portfolio" className="mx-auto flex w-full max-w-[960px] flex-1 flex-col px-6">
      <div className="grid gap-6 py-20 sm:py-28 md:grid-cols-[168px_minmax(0,1fr)] md:gap-x-12 md:py-36">
        <div className="flex flex-col gap-2">
          <div className="h-3 w-20 animate-pulse rounded bg-muted" />
          <div className="h-3 w-28 animate-pulse rounded bg-muted" />
        </div>
        <div className="flex flex-col gap-3">
          <div className="h-8 w-full max-w-md animate-pulse rounded bg-muted" />
          <div className="h-8 w-5/6 max-w-md animate-pulse rounded bg-muted" />
          <div className="h-8 w-2/3 max-w-md animate-pulse rounded bg-muted" />
        </div>
      </div>
      <div className="grid gap-6 border-t border-border py-16 md:grid-cols-[168px_minmax(0,1fr)] md:gap-x-12">
        <div className="h-3 w-16 animate-pulse rounded bg-muted" />
        <div className="grid gap-6 sm:grid-cols-2">
          {[0, 1].map((item) => (
            <div key={item} className="flex flex-col gap-3">
              <div className="aspect-[16/10] animate-pulse rounded-xl bg-muted" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
              <div className="h-4 w-full animate-pulse rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
