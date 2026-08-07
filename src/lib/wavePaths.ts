/**
 * Hero background wave ribbons, ported from the Claude Design source
 * (buildRibbon/smoothPath). The original animates these by recomputing the
 * path `d` on every animation frame via a rAF loop; here the curves are
 * computed once at build time (t = 0) and the flowing motion instead comes
 * from a lightweight CSS transform animation on each ribbon group
 * (`dg-waveA` / `dg-waveB` in global.css) — same visual language, no
 * per-frame JS on the client.
 */

export interface RibbonDef {
  id: string;
  gradId: "dgW1" | "dgW2";
  baseY: number;
  amp: number;
  freq: number;
  phase: number;
  lines: number;
  spacing: number;
  speed: number;
  driftSpeed: number;
  driftAmp: number;
  driftPhase: number;
}

export const ribbonDefs: RibbonDef[] = [
  { id: "r1", gradId: "dgW1", baseY: 290, amp: 58, freq: 1.25, phase: 0.0, lines: 13, spacing: 7, speed: 0.4, driftSpeed: 0.22, driftAmp: 55, driftPhase: 0 },
  { id: "r2", gradId: "dgW2", baseY: 420, amp: 50, freq: 1.05, phase: 2.4, lines: 11, spacing: 8, speed: -0.32, driftSpeed: 0.17, driftAmp: 48, driftPhase: 1.7 },
  { id: "r3", gradId: "dgW1", baseY: 200, amp: 40, freq: 1.5, phase: 4.1, lines: 9, spacing: 6, speed: 0.5, driftSpeed: 0.26, driftAmp: 38, driftPhase: 3.2 },
];

interface Point {
  x: number;
  y: number;
}

function smoothPath(points: Point[]): string {
  let d = `M${points[0]!.x.toFixed(1)},${points[0]!.y.toFixed(1)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i]!;
    const p1 = points[i + 1]!;
    const mx = (p0.x + p1.x) / 2;
    const my = (p0.y + p1.y) / 2;
    d += ` Q${p0.x.toFixed(1)},${p0.y.toFixed(1)} ${mx.toFixed(1)},${my.toFixed(1)}`;
  }
  const last = points[points.length - 1]!;
  d += ` L${last.x.toFixed(1)},${last.y.toFixed(1)}`;
  return d;
}

export interface RibbonLine {
  d: string;
  opacity: number;
  width: number;
}

export interface BuiltRibbon {
  id: string;
  gradId: RibbonDef["gradId"];
  glowD: string;
  lines: RibbonLine[];
}

export function buildRibbon(rb: RibbonDef, t: number): BuiltRibbon {
  const drift = Math.sin(t * rb.driftSpeed + rb.driftPhase) * rb.driftAmp;
  const centerY = rb.baseY + drift;
  const xs: number[] = [];
  for (let i = 0; i <= 17; i++) xs.push(-120 + i * (1640 / 17));

  const n = rb.lines;
  const lines: RibbonLine[] = [];
  for (let j = 0; j < n; j++) {
    const off = (j - (n - 1) / 2) * rb.spacing;
    const points = xs.map((x) => ({
      x,
      y: centerY + off + Math.sin((x / 1400) * Math.PI * 2 * rb.freq + t * rb.speed + rb.phase + j * 0.02) * rb.amp,
    }));
    const distRatio = Math.abs(off) / (((n - 1) / 2) * rb.spacing || 1);
    lines.push({
      d: smoothPath(points),
      opacity: Math.max(0.1, 0.82 * (1 - distRatio * 0.82)),
      width: 0.5 + (1 - distRatio) * 0.55,
    });
  }

  const glowPoints = xs.map((x) => ({
    x,
    y: centerY + Math.sin((x / 1400) * Math.PI * 2 * rb.freq + t * rb.speed + rb.phase) * rb.amp,
  }));

  return { id: rb.id, gradId: rb.gradId, glowD: smoothPath(glowPoints), lines };
}

export function buildAllRibbons(): BuiltRibbon[] {
  return ribbonDefs.map((rb) => buildRibbon(rb, 0));
}
