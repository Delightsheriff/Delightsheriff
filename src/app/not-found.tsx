import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-start justify-center gap-4 px-6 py-20">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">404</p>
      <h1 className="font-heading text-3xl font-semibold tracking-tight">
        Nothing here.
      </h1>
      <p className="max-w-md text-base leading-relaxed text-foreground/80">
        Whatever you were looking for doesn&apos;t exist, or moved.
      </p>
      <Link
        href="/"
        className="text-sm text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground"
      >
        ← Back home
      </Link>
    </main>
  );
}
