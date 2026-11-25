import { Skeleton } from "@/components/skeleton";

export default function Loading() {
  return (
    <main aria-busy="true" className="mx-auto w-full max-w-[960px] flex-1 px-6 py-24 sm:py-32">
      <p role="status" className="sr-only">
        Loading blog
      </p>

      <div className="grid gap-5 md:grid-cols-[168px_minmax(0,1fr)] md:gap-x-12">
        <Skeleton className="h-3 w-12" />
        <div className="flex min-w-0 flex-col gap-12">
          <Skeleton className="h-10 w-40" />
          <div className="flex flex-col">
            {[0, 1, 2].map((item) => (
              <div key={item} className="flex flex-col gap-2.5 border-t border-border py-6 first:border-t-0 first:pt-0">
                <Skeleton className="h-5 w-1/2" />
                <Skeleton className="h-4 w-full max-w-[58ch]" />
                <Skeleton className="h-4 w-2/3 max-w-[58ch]" />
                <Skeleton className="mt-1 h-3 w-24" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
