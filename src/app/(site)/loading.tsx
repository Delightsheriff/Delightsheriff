import { Skeleton } from "@/components/skeleton";

// Mirrors the home page (hero, then the first project tiles) so nothing jumps when it arrives.
export default function Loading() {
  return (
    <main aria-busy="true" className="mx-auto flex w-full max-w-[960px] flex-1 flex-col px-6">
      <p role="status" className="sr-only">
        Loading
      </p>

      <div className="grid gap-6 py-20 sm:py-28 md:grid-cols-[168px_minmax(0,1fr)] md:gap-x-12 md:py-36">
        <div className="flex flex-col gap-2 md:pt-3">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-32" />
        </div>
        <div className="flex flex-col gap-3">
          <Skeleton className="h-9 w-full max-w-[24ch] sm:h-10" />
          <Skeleton className="h-9 w-[92%] max-w-[24ch] sm:h-10" />
          <Skeleton className="h-9 w-[70%] max-w-[24ch] sm:h-10" />
          <Skeleton className="mt-5 h-4 w-64" />
        </div>
      </div>

      <div className="grid gap-5 border-t border-border py-16 md:grid-cols-[168px_minmax(0,1fr)] md:gap-x-12">
        <Skeleton className="h-3 w-16" />
        <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2">
          {[0, 1].map((item) => (
            <div key={item} className="flex flex-col gap-3">
              <Skeleton className="aspect-[16/10] w-full rounded-xl" />
              <Skeleton className="mt-1 h-5 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
