import { Skeleton } from "@/components/skeleton";

// Mirrors a case study: back link in the gutter, then title, summary, facts and the lead visual.
export default function Loading() {
  return (
    <main aria-busy="true" className="mx-auto w-full max-w-[960px] flex-1 px-6 py-24 sm:py-32">
      <p role="status" className="sr-only">
        Loading project
      </p>

      <div className="grid gap-5 md:grid-cols-[168px_minmax(0,1fr)] md:gap-x-12">
        <div className="flex flex-col gap-4">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-20" />
        </div>

        <div className="flex min-w-0 flex-col gap-12">
          <div className="flex flex-col gap-5">
            <Skeleton className="h-10 w-2/3 max-w-sm" />
            <div className="flex flex-col gap-2.5">
              <Skeleton className="h-4 w-full max-w-[58ch]" />
              <Skeleton className="h-4 w-[90%] max-w-[58ch]" />
              <Skeleton className="h-4 w-[60%] max-w-[58ch]" />
            </div>
            <div className="grid grid-cols-1 gap-5 border-y border-border py-5 sm:grid-cols-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="flex gap-6">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>

          <Skeleton className="aspect-[16/10] w-full rounded-xl" />

          <div className="flex max-w-[58ch] flex-col gap-8">
            {[0, 1, 2].map((item) => (
              <div key={item} className="flex flex-col gap-2.5">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
