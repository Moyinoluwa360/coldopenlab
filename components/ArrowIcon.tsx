/** Inline SVG north-east arrow. Replaces the Unicode ↗︎ glyph which renders
 *  as a colored emoji on mobile browsers regardless of CSS overrides. */
export function ArrowIcon() {
  return (
    <svg
      aria-hidden="true"
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      style={{ display: "inline-block", verticalAlign: "middle", marginLeft: 4 }}
    >
      <path
        d="M3.5 8.5L8.5 3.5M8.5 3.5H4.5M8.5 3.5v4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
