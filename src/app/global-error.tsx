"use client";

// This replaces the entire root layout on a catastrophic error, so it can't rely on
// globals.css, the fonts or the design tokens having loaded. Plain inline styles only,
// but it keeps the same shape and voice as the rest of the site.
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "7rem 1.5rem",
          background: "#0a0b0e",
          color: "#ecedf0",
          fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif",
          WebkitFontSmoothing: "antialiased",
        }}
      >
        <main style={{ width: "100%", maxWidth: 960, marginInline: "auto" }}>
          <p style={{ margin: "0 0 1.5rem", fontFamily: "ui-monospace, Menlo, monospace", fontSize: 12, color: "#959aa6" }}>
            Error
          </p>
          <h1
            style={{
              margin: 0,
              maxWidth: "24ch",
              fontSize: "clamp(1.7rem, 3.8vw, 2.55rem)",
              fontWeight: 500,
              lineHeight: 1.22,
              letterSpacing: "-0.028em",
              textWrap: "balance",
            }}
          >
            Something broke.{" "}
            <span style={{ color: "#959aa6" }}>That&apos;s on me, not you. Try again, or come back in a minute.</span>
          </h1>
          <div style={{ marginTop: "2rem", display: "flex", gap: "1.5rem", alignItems: "center", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={reset}
              style={{
                border: 0,
                borderRadius: 999,
                background: "#ecedf0",
                color: "#0a0b0e",
                padding: "0.625rem 1.25rem",
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Try again
            </button>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- this replaces the root layout, so a full page load is what we want */}
            <a href="/" style={{ color: "#959aa6", fontSize: 15 }}>
              Back home
            </a>
          </div>
          {error.digest && (
            <p style={{ margin: "1.5rem 0 0", fontFamily: "ui-monospace, Menlo, monospace", fontSize: 12, color: "#959aa6" }}>
              Reference {error.digest}
            </p>
          )}
        </main>
      </body>
    </html>
  );
}
