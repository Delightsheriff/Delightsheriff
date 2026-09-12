"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-start justify-center gap-4 px-6 py-20">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">Error</p>
      <h1 className="font-heading text-3xl font-semibold tracking-tight">Something broke.</h1>
      <p className="max-w-md text-base leading-relaxed text-foreground/80">
        That&apos;s on me, not you. Try again, or come back in a minute.
      </p>
      <button
        onClick={reset}
        className="text-sm text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground"
      >
        Try again
      </button>
    </main>
  );
}
