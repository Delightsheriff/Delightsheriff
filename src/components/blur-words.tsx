import type { CSSProperties } from "react";

// Each word blurs into place in turn. Pure CSS, so the text is there without JavaScript.
// `start` offsets the stagger so several runs of text can continue one sequence.
export function BlurWords({ text, start = 0, className }: { text: string; start?: number; className?: string }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, i) => (
        <span key={i}>
          <span className={`word-in ${className ?? ""}`} style={{ "--i": start + i } as CSSProperties}>
            {word}
          </span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </>
  );
}
