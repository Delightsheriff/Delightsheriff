"use client";

// This replaces the entire root layout on a catastrophic error, so it can't
// rely on globals.css or the theme actually having loaded — plain inline
// styles only, as a true last-resort fallback.
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          gap: 16,
          padding: "5rem 1.5rem",
          maxWidth: 672,
          marginInline: "auto",
          background: "#0a0a0c",
          color: "#e5e5e7",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <p style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em", color: "#9a9aa0" }}>
          Error
        </p>
        <h1 style={{ fontSize: 30, fontWeight: 600, margin: 0 }}>Something broke.</h1>
        <p style={{ maxWidth: 400, lineHeight: 1.6, color: "#c5c5ca" }}>
          That&apos;s on me, not you. Try again, or come back in a minute.
        </p>
        <button
          onClick={reset}
          style={{
            fontSize: 14,
            color: "#9a9aa0",
            background: "none",
            border: "none",
            textDecoration: "underline",
            cursor: "pointer",
            padding: 0,
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
