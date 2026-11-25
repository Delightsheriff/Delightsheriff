import { Skeleton } from "@/components/skeleton";

export default function Loading() {
  return (
    <main aria-busy="true" className="mx-auto w-full max-w-[960px] flex-1 px-6 py-24 sm:py-32">
      <p role="status" className="sr-only">
        Loading post
      </p>

      <div className="grid gap-5 md:grid-cols-[168px_minmax(0,1fr)] md:gap-x-12">
        <Skeleton className="h-3 w-16" />
        <div className="flex min-w-0 flex-col gap-10">
          <div className="flex flex-col gap-4">
            <Skeleton className="h-10 w-3/4 max-w-lg" />
            <Skeleton className="h-3 w-28" />
          </div>
          <div className="flex max-w-[58ch] flex-col gap-3">
            {["w-full", "w-full", "w-[85%]", "w-full", "w-2/3"].map((width, index) => (
              <Skeleton key={index} className={`h-4 ${width}`} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
