import { NavLink } from "@/components/nav-link";

export function NotFoundContent() {
  return (
    <main id="main-content" tabIndex={-1} className="mx-auto flex w-full max-w-[960px] flex-1 flex-col items-start justify-center gap-4 px-6 py-20 md:pl-[264px]">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">404</p>
      <h1 className="font-heading text-3xl font-semibold tracking-tight">
        Nothing here.
      </h1>
      <p className="max-w-md text-base leading-relaxed text-foreground/80">
        Whatever you were looking for doesn&apos;t exist, or moved.
      </p>
      <NavLink href="/" direction="back">
        Back home
      </NavLink>
    </main>
  );
}
