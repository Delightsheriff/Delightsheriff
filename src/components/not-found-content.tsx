import Link from "next/link";
import { StatusPage } from "@/components/status-page";

const LINK =
  "link-u rounded-sm text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background";

export function NotFoundContent() {
  return (
    <StatusPage
      label="404"
      title="Offside."
      description="That page isn't on the pitch. It doesn't exist, or it moved."
      actions={
        <>
          <Link href="/" className={`${LINK} text-foreground`}>
            Back home
          </Link>
          <Link href="/#projects" className={LINK}>
            See projects
          </Link>
        </>
      }
    />
  );
}
