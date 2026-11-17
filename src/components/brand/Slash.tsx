/**
 * The NextResume "/" — a mint lattice beam, the brand's signature element.
 * Pure SVG so it scales with the headline it cuts through.
 */
const W = 120;
const H = 300;
const BEAM = 44; // beam width
const SHIFT = 72; // horizontal lean from bottom to top
const SEGMENTS = 9;

// x of the beam's left edge at height y (y = 0 top)
const leftAt = (y: number) => 4 + SHIFT * (1 - y / H);

export function Slash({ className }: { className?: string }) {
  const rungs: string[] = [];
  for (let i = 0; i <= SEGMENTS; i++) {
    const y = (H / SEGMENTS) * i;
    const x = leftAt(y);
    rungs.push(`M${x} ${y}h${BEAM}`);
    if (i < SEGMENTS) {
      const y2 = (H / SEGMENTS) * (i + 1);
      const x2 = leftAt(y2);
      // cross bracing in both directions
      rungs.push(`M${x} ${y}L${x2 + BEAM} ${y2}`);
      rungs.push(`M${x + BEAM} ${y}L${x2} ${y2}`);
    }
  }
  const outline = `M${leftAt(0)} 0h${BEAM}L${leftAt(H) + BEAM} ${H}h${-BEAM}Z`;
  // inner rails, inset from the outline
  const inset = 6;
  const rails = `M${leftAt(0) + inset} 0L${leftAt(H) + inset} ${H}M${leftAt(0) + BEAM - inset} 0L${leftAt(H) + BEAM - inset} ${H}`;

  return (
    <svg
      viewBox={`-2 -2 ${W + 4} ${H + 4}`}
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="nr-slash-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#17e2a5" stopOpacity="0.28" />
          <stop offset="1" stopColor="#17e2a5" stopOpacity="0.08" />
        </linearGradient>
      </defs>
      <path d={outline} fill="url(#nr-slash-fill)" />
      <path d={rungs.join("")} stroke="#17e2a5" strokeWidth="1" fill="none" opacity="0.85" />
      <path d={rails} stroke="#17e2a5" strokeWidth="1.5" fill="none" />
      <path d={outline} stroke="#17e2a5" strokeWidth="4" strokeLinejoin="round" fill="none" />
    </svg>
  );
}
