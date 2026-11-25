"use client";

import Link from "next/link";
import { StatusPage } from "@/components/status-page";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <StatusPage
      label="Error"
      title="Something broke."
      description="That's on me, not you. Try again, or come back in a minute."
      actions={
        <>
          <button
            type="button"
            onClick={reset}
            className="press rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity duration-200 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
          >
            Try again
          </button>
          <Link
            href="/"
            className="link-u rounded-sm text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
          >
            Back home
          </Link>
        </>
      }
      note={error.digest ? `Reference ${error.digest}` : undefined}
    />
  );
}
