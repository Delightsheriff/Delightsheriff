"use client";

// Studio is a separate embedded tool, not part of the portfolio site itself —
// its error state shouldn't look like "the portfolio broke." Deliberately
// plain, not styled like the rest of the site.
export default function StudioError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        gap: 12,
        padding: "3rem",
        background: "#0a0a0c",
        color: "#e5e5e7",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <p style={{ fontSize: 13, color: "#9a9aa0" }}>Studio failed to load</p>
      <p style={{ fontSize: 13, color: "#9a9aa0", maxWidth: 500 }}>{error.message}</p>
      <button
        onClick={reset}
        style={{
          fontSize: 13,
          color: "#9a9aa0",
          background: "none",
          border: "1px solid #333",
          borderRadius: 4,
          padding: "6px 12px",
          cursor: "pointer",
        }}
      >
        Retry
      </button>
    </div>
  );
}
