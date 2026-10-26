// Water mode's chart (the panel, panel.ts): the nitrogen cycle over the simulation's days, as a test
// kit would have read it - ammonia and nitrite on one scale, nitrate (which runs far higher) on its
// own below, both against the same days. Canvas 2D, drawn at the device's pixel ratio, only when
// asked (the panel redraws it at most twice a second while it shows). A finger or the pointer on it
// reads the values at that time.

import { clockText } from './care.mjs';
import { DAY } from './chemistry.mjs';
import { CHART } from './content';

/** The series (chemistry.mjs history: [t, ammonia, nitrite, nitrate]): their names, and colours (a
 *  categorical set checked for colour-blind separation and contrast on the panel). */
export const SERIES = [
  { key: 1, name: 'Ammonia', colour: '#28a679' },
  { key: 2, name: 'Nitrite', colour: '#9085e9' },
  { key: 3, name: 'Nitrate', colour: '#e66767' },
] as const;
/** Ink for the axes and their labels, the grid, the crosshair. */
const INK = '#94c9ce';
const GRID = 'rgba(148, 201, 206, 0.16)';
/** The panel behind (for the ring round the end dots). */
const SURFACE = '#0a2c39';
/** Layout (CSS px): the plots' heights, the gap between, the axis band below, the labels' gutter. */
const TOP = 74;
const BOTTOM = 46;
const GAP = 22;
const AXIS = 16;
const LEFT = 26;
const RIGHT = 8;
export const CHART_HEIGHT = 6 + TOP + GAP + BOTTOM + AXIS;

/** A round number at or above x, from 1, 2, 2.5, 5 times a power of ten. */
function niceMax(x: number): number {
  const p = 10 ** Math.floor(Math.log10(x));
  for (const m of [1, 2, 2.5, 5, 10]) if (m * p >= x) return m * p;
  return 10 * p;
}

export class WaterChart {
  readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly tip: HTMLElement;
  private history: readonly (readonly number[])[] = [];
  /** The pointer's x on the chart (CSS px), or null. */
  private hover: number | null = null;
  /** Its width (CSS px; 0 while the panel is folded), kept by a ResizeObserver so that drawing
   *  never makes the page lay itself out. */
  private width = 0;

  constructor(parent: HTMLElement) {
    const canvas = (this.canvas = document.createElement('canvas'));
    canvas.className = 'water-chart-plot';
    canvas.style.height = `${CHART_HEIGHT}px`;
    canvas.setAttribute('role', 'img');
    canvas.setAttribute('aria-label', CHART.title);
    this.ctx = canvas.getContext('2d')!;
    const tip = (this.tip = document.createElement('p'));
    tip.className = 'water-chart-tip';
    tip.setAttribute('aria-hidden', 'true');
    parent.append(canvas, tip);
    const at = (e: PointerEvent): void => {
      this.hover = e.clientX - canvas.getBoundingClientRect().left;
      this.draw();
    };
    canvas.addEventListener('pointerdown', at);
    canvas.addEventListener('pointermove', at);
    const leave = (): void => {
      this.hover = null;
      this.draw();
    };
    canvas.addEventListener('pointerleave', leave);
    canvas.addEventListener('pointercancel', leave);
    new ResizeObserver(([e]) => {
      this.width = e.contentRect.width;
      this.draw();
    }).observe(canvas);
  }

  /** New samples to draw (the model's history: [t s, ammonia, nitrite, nitrate ppm] each). */
  set(history: readonly (readonly number[])[]): void {
    this.history = history;
    this.draw();
  }

  draw(): void {
    const c = this.canvas;
    const w = this.width;
    if (w === 0) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    const pw = Math.round(w * dpr);
    const ph = Math.round(CHART_HEIGHT * dpr);
    if (c.width !== pw || c.height !== ph) {
      c.width = pw;
      c.height = ph;
    }
    const g = this.ctx;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, w, CHART_HEIGHT);
    const h = this.history;
    // The days shown: from the first sample kept (the start, or 120 days back) to now, a week at
    // least.
    const from = h.length ? Math.floor(h[0][0] / DAY) : 0;
    const days = Math.max(7, h.length ? h[h.length - 1][0] / DAY - from : 0);
    const x0 = LEFT;
    const x1 = w - RIGHT;
    const xOf = (t: number): number => x0 + ((t / DAY - from) / days) * (x1 - x0);
    let topMax = 1;
    let bottomMax = 20;
    for (const s of h) {
      topMax = Math.max(topMax, s[1], s[2]);
      bottomMax = Math.max(bottomMax, s[3]);
    }
    topMax = niceMax(topMax);
    bottomMax = niceMax(bottomMax);
    const plots = [
      { y: 6, height: TOP, max: topMax, series: [SERIES[0], SERIES[1]] },
      { y: 6 + TOP + GAP, height: BOTTOM, max: bottomMax, series: [SERIES[2]] },
    ];
    g.font = '10px Inter Variable, Inter, system-ui, sans-serif';
    g.lineWidth = 1;
    for (const p of plots) {
      const yOf = (v: number): number => p.y + p.height - (v / p.max) * p.height;
      // Grid: the baseline, the middle and the top, each labelled.
      g.textAlign = 'right';
      g.textBaseline = 'middle';
      for (const v of [0, p.max / 2, p.max]) {
        const y = Math.round(yOf(v)) + 0.5;
        g.strokeStyle = GRID;
        g.beginPath();
        g.moveTo(x0, y);
        g.lineTo(x1, y);
        g.stroke();
        g.fillStyle = INK;
        g.fillText(String(Math.round(v * 100) / 100), x0 - 5, y);
      }
      // The series: 2 px lines, round joins.
      g.lineWidth = 2;
      g.lineJoin = 'round';
      g.lineCap = 'round';
      for (const s of p.series) {
        g.strokeStyle = s.colour;
        g.beginPath();
        h.forEach((d, i) => (i ? g.lineTo(xOf(d[0]), yOf(d[s.key])) : g.moveTo(xOf(d[0]), yOf(d[s.key]))));
        g.stroke();
      }
      // Now: a dot on each, ringed in the panel's colour.
      const last = h[h.length - 1];
      if (last) {
        for (const s of p.series) {
          g.beginPath();
          g.arc(xOf(last[0]), yOf(last[s.key]), 4, 0, Math.PI * 2);
          g.fillStyle = s.colour;
          g.strokeStyle = SURFACE;
          g.lineWidth = 2;
          g.fill();
          g.stroke();
        }
      }
      g.lineWidth = 1;
    }
    // The days along the bottom (their numbers, as the clock counts them): every day, two, a week
    // or four, as they fit.
    const step = [1, 2, 7, 14, 28, 56].find((s) => ((x1 - x0) / days) * s >= 34) ?? 56;
    g.textAlign = 'center';
    g.textBaseline = 'top';
    g.fillStyle = INK;
    const axisY = 6 + TOP + GAP + BOTTOM + 4;
    for (let d = 0; d <= days; d += step) g.fillText(String(from + d + 1), Math.min(Math.max(xOf((from + d) * DAY), x0 + 8), x1 - 8), axisY);
    g.textAlign = 'right';
    g.fillText(CHART.day, x0 - 5, axisY);
    // The pointer's time: a crosshair, and the readings then.
    if (this.hover !== null && h.length) {
      const t = (from + ((this.hover - x0) / (x1 - x0)) * days) * DAY;
      let k = 0;
      for (let i = 1; i < h.length; i++) if (Math.abs(h[i][0] - t) < Math.abs(h[k][0] - t)) k = i;
      const d = h[k];
      const x = Math.round(xOf(d[0])) + 0.5;
      g.strokeStyle = INK;
      g.beginPath();
      g.moveTo(x, 6);
      g.lineTo(x, 6 + TOP + GAP + BOTTOM);
      g.stroke();
      this.tip.textContent = `${clockText(d[0])} · ${SERIES.map((s) => `${s.name} ${d[s.key].toFixed(s.key === 3 ? 1 : 2)}`).join(' · ')}`;
      this.tip.classList.add('is-on');
    } else {
      this.tip.classList.remove('is-on');
    }
    // (For a screen reader, the chart in words: now, and the peaks so far.)
    if (h.length) {
      const last = h[h.length - 1];
      const peak = (key: number): string => Math.max(...h.map((s) => s[key])).toFixed(key === 3 ? 0 : 2);
      c.setAttribute('aria-label', `${CHART.title}: day ${Math.floor(last[0] / DAY) + 1}. Ammonia ${last[1].toFixed(2)} ppm (peak ${peak(1)}), nitrite ${last[2].toFixed(2)} (peak ${peak(2)}), nitrate ${last[3].toFixed(0)} (peak ${peak(3)}).`);
    }
  }
}
