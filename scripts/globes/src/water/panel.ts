// Water mode's panel (WaterCare.ts runs it): the water's test readings, each with its colour on a test
// kit's card; the clock and its speed; the fish's condition; a line on what is happening; and, opened
// out, the nitrogen cycle's chart (chart.ts), the care to give, the routine and where to start over.
// A side panel on a wide screen, a column beside the bowl on a phone held sideways, and on a phone
// held upright a sheet along the foot that folds down to its readings. Plain DOM in the page's style
// (water.css); its words are content.ts's. Updated at most four times a second, and only what changed.

import './water.css';
import { WaterChart, SERIES } from './chart';
import { CAUSES, CHANGES, CHART, CONDITIONS, CONTROLS, DANGER, INTRO, MEALS, PANEL, READINGS, STARTS, type ReadingId } from './content';

export type Speed = 'pause' | 'play' | 'fast';

/** What the panel shows (WaterCare.ts, from the simulation). */
export interface PanelView {
  /** "Day 3 · 2:40 pm". */
  clock: string;
  speed: Speed;
  ammonia: number;
  nitrite: number;
  nitrate: number;
  ph: number;
  tempF: number;
  tempC: number;
  /** The fish's condition (0 Thriving .. 3 In danger) and what troubles it most (content.ts CAUSES). */
  level: number;
  cause: string | null;
  /** What is happening (content.ts HAPPENING's words). */
  news: string;
  heater: boolean;
  dechlor: boolean;
  meals: number;
  change: string;
}

/** What the panel's controls do. */
export interface PanelActions {
  speed(s: Speed): void;
  change(fraction: number): void;
  rinse(tap: boolean): void;
  heater(on: boolean): void;
  dechlor(on: boolean): void;
  meals(n: number): void;
  routine(change: string): void;
  start(kind: string): void;
  expanded(open: boolean): void;
  introClosed(): void;
}

/** A test kit's colour card (value, colour), for each reading that has one. */
const CARDS: Partial<Record<ReadingId, [number, string][]>> = {
  ammonia: [[0, '#efe04b'], [0.25, '#d9df4d'], [0.5, '#bdd653'], [1, '#9fca5b'], [2, '#78b65d'], [4, '#4f9b58'], [8, '#2f7c4f']],
  nitrite: [[0, '#80c4e6'], [0.25, '#8fa9e0'], [0.5, '#9b8fd8'], [1, '#a174cc'], [2, '#9a58b9'], [5, '#7f3a9d']],
  nitrate: [[0, '#f2e35a'], [5, '#f4cc4a'], [10, '#f2a83f'], [20, '#ee8436'], [40, '#e2552f'], [80, '#c8332a'], [160, '#951d25']],
  ph: [[6, '#e9d84b'], [6.4, '#c8cf55'], [6.6, '#a9c46a'], [6.8, '#86b67e'], [7, '#66a693'], [7.2, '#4d93a6'], [7.6, '#3b7bb5']],
};

/** The colour a kit's card shows at v (between its steps, blended). */
function kitColour(card: [number, string][], v: number): string {
  const rgb = (h: string): number[] => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  if (v <= card[0][0]) return card[0][1];
  for (let i = 1; i < card.length; i++) {
    if (v <= card[i][0]) {
      const f = (v - card[i - 1][0]) / (card[i][0] - card[i - 1][0]);
      const a = rgb(card[i - 1][1]);
      const b = rgb(card[i][1]);
      return `rgb(${a.map((x, k) => Math.round(x + (b[k] - x) * f)).join(', ')})`;
    }
  }
  return card[card.length - 1][1];
}

/** A reading in ppm: 0 under what a kit could tell from none (zero), else two places under 1, one
 *  under 10, whole numbers above. */
const ppm = (v: number, zero: number): string => (v < zero ? '0' : v < 1 ? v.toFixed(2) : v < 10 ? v.toFixed(1) : Math.round(v).toString());

/** A switch's state, written only when it changes. */
function pressed(b: HTMLElement, on: boolean): void {
  if ((b.getAttribute('aria-pressed') === 'true') !== on) b.setAttribute('aria-pressed', String(on));
}

const ICONS: Record<Speed, string> = {
  pause: '<path d="M8 6v12M16 6v12"/>',
  play: '<path d="M8 5.5l11 6.5-11 6.5z"/>',
  fast: '<path d="M4 6l8 6-8 6zM12 6l8 6-8 6z"/>',
};

export class WaterPanel {
  readonly root: HTMLElement;
  readonly chart: WaterChart;
  /** Opened out (the chart and the controls showing). */
  expanded = false;
  private readonly values = new Map<string, HTMLElement>();
  private readonly chips = new Map<string, HTMLElement>();
  private readonly clockEl: HTMLElement;
  private readonly conditionEl: HTMLElement;
  /** The news line's two parts: what troubles the fish (or, in danger, what to do), and what is
   *  happening in the bowl. */
  private readonly whyEl: HTMLElement;
  private readonly whatEl: HTMLElement;
  private readonly moreEl: HTMLButtonElement;
  private readonly intro: HTMLElement;
  private readonly speedEls: HTMLButtonElement[];
  private readonly heaterEl: HTMLButtonElement;
  private readonly dechlorEl: HTMLButtonElement;
  private readonly mealsEl: HTMLSelectElement;
  private readonly changeEl: HTMLSelectElement;
  /** What each element shows now (only changes are written). */
  private readonly shown = new Map<HTMLElement, string>();
  /** A reading tapped: its words in the news line until then (ms). */
  private aboutUntil = 0;
  private about = '';
  /** A start chosen once: until when a second tap starts over (ms), and which. */
  private sure: { kind: string; until: number } | null = null;

  constructor(stage: HTMLElement, private readonly act: PanelActions) {
    const root = (this.root = document.createElement('section'));
    root.className = 'water-panel';
    root.setAttribute('aria-label', PANEL.label);
    root.hidden = true;
    const el = <K extends keyof HTMLElementTagNameMap>(tag: K, cls: string, parent: HTMLElement, text = ''): HTMLElementTagNameMap[K] => {
      const e = document.createElement(tag);
      e.className = cls;
      if (text) e.textContent = text;
      parent.append(e);
      return e;
    };
    const button = (cls: string, parent: HTMLElement, c: { label: string; title: string }, onClick: () => void): HTMLButtonElement => {
      const b = el('button', cls, parent, c.label);
      b.type = 'button';
      if (c.title) b.title = c.title;
      b.addEventListener('click', onClick);
      return b;
    };

    // The card shown the first time.
    const intro = (this.intro = el('div', 'water-intro', root));
    intro.hidden = true;
    const close = el('button', 'learn-close', intro);
    close.type = 'button';
    close.setAttribute('aria-label', PANEL.close);
    close.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7l10 10M17 7L7 17"/></svg>';
    close.addEventListener('click', () => {
      intro.hidden = true;
      act.introClosed();
    });
    const words = el('div', 'learn-text', intro);
    el('p', 'learn-kicker', words, INTRO.kicker);
    el('p', 'learn-title', words, INTRO.title);
    el('p', 'learn-body', words, INTRO.body);

    // The strip: the readings, the clock, the fish, the news.
    const strip = el('div', 'water-strip', root);
    const readings = el('div', 'water-readings', strip);
    readings.setAttribute('role', 'group');
    readings.setAttribute('aria-label', PANEL.readings);
    for (const [id, r] of Object.entries(READINGS) as [ReadingId, (typeof READINGS)[ReadingId]][]) {
      const b = el('button', 'water-reading', readings);
      b.type = 'button';
      b.title = r.about;
      b.dataset.reading = id;
      const name = el('span', 'water-name', b, r.name);
      if (id === 'temp') this.values.set('tempC', el('span', 'water-sub', name));
      const value = el('span', 'water-value', b);
      if (CARDS[id]) {
        const chip = el('i', 'water-chip', value);
        chip.setAttribute('aria-hidden', 'true');
        this.chips.set(id, chip);
      }
      this.values.set(id, el('span', '', value));
      b.addEventListener('click', () => {
        this.about = r.about;
        this.aboutUntil = performance.now() + 6000;
        this.write(this.whyEl, r.about);
        this.write(this.whatEl, '');
      });
    }
    const bar = el('div', 'water-bar', strip);
    this.conditionEl = el('span', 'water-condition', bar);
    this.clockEl = el('span', 'water-clock', bar);
    const speeds = el('div', 'water-speed', bar);
    speeds.setAttribute('role', 'group');
    speeds.setAttribute('aria-label', PANEL.clock);
    this.speedEls = (['pause', 'play', 'fast'] as Speed[]).map((s) => {
      const b = button('', speeds, { label: '', title: CONTROLS[s].title }, () => act.speed(s));
      b.dataset.speed = s;
      b.setAttribute('aria-label', CONTROLS[s].label);
      b.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[s]}</svg>`;
      return b;
    });
    this.moreEl = button('water-more', bar, CONTROLS.expand, () => this.expand(!this.expanded));
    this.moreEl.setAttribute('aria-controls', 'water-body');
    this.moreEl.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 15l6-6 6 6"/></svg>';
    const news = el('p', 'water-news', strip);
    news.setAttribute('role', 'status');
    news.setAttribute('aria-live', 'polite');
    this.whyEl = el('span', 'water-why', news);
    this.whatEl = el('span', 'water-what', news);

    // Opened out: the chart, the care, the routine, a fresh start.
    const body = el('div', 'water-body', root);
    body.id = 'water-body';
    const chart = el('figure', 'water-chart', body);
    const legend = el('figcaption', 'water-legend', chart);
    for (const s of SERIES) {
      const key = el('span', 'water-key', legend, s.name);
      key.style.setProperty('--key', s.colour);
    }
    el('span', 'water-units', legend, CHART.unit);
    this.chart = new WaterChart(chart);

    const care = el('div', 'water-group', body);
    el('h3', 'water-heading', care, PANEL.care);
    const actions = el('div', 'water-actions', care);
    button('water-action', actions, CONTROLS.change25, () => act.change(0.25));
    button('water-action', actions, CONTROLS.change50, () => act.change(0.5));
    button('water-action water-wide', actions, CONTROLS.rinseTank, () => act.rinse(false));
    button('water-action water-wide', actions, CONTROLS.rinseTap, () => act.rinse(true));
    this.heaterEl = button('water-action water-toggle', actions, CONTROLS.heater, () => act.heater(this.heaterEl.getAttribute('aria-pressed') !== 'true'));
    this.dechlorEl = button('water-action water-toggle', actions, CONTROLS.dechlor, () => act.dechlor(this.dechlorEl.getAttribute('aria-pressed') !== 'true'));

    const routine = el('div', 'water-group', body);
    el('h3', 'water-heading', routine, PANEL.routine);
    const select = (c: { label: string; title: string }, options: readonly { value: string | number; label: string }[], onChange: (v: string) => void): HTMLSelectElement => {
      const label = el('label', 'water-select', routine);
      label.title = c.title;
      el('span', '', label, c.label);
      const s = el('select', '', label);
      for (const o of options) {
        const opt = el('option', '', s, o.label);
        opt.value = String(o.value);
      }
      s.addEventListener('change', () => onChange(s.value));
      return s;
    };
    this.mealsEl = select(CONTROLS.meals, MEALS, (v) => act.meals(Number(v)));
    this.changeEl = select(CONTROLS.routine, CHANGES, (v) => act.routine(v));

    const start = el('div', 'water-group', body);
    el('h3', 'water-heading', start, PANEL.start);
    const starts = el('div', 'water-actions water-starts', start);
    for (const s of STARTS) {
      const b = button('water-action', starts, s, () => {
        // (Twice to be sure: a fresh start loses the bowl's history.)
        if (this.sure?.kind === s.value && performance.now() < this.sure.until) {
          this.sure = null;
          b.textContent = s.label;
          act.start(s.value);
          return;
        }
        this.sure = { kind: s.value, until: performance.now() + 3000 };
        b.textContent = PANEL.sure;
        window.setTimeout(() => {
          if (b.textContent === PANEL.sure) b.textContent = s.label;
        }, 3000);
      });
      b.dataset.start = s.value;
    }

    // (The bowl's own pointer handling is the canvas's; nothing here reaches it.)
    root.addEventListener('pointerdown', (e) => e.stopPropagation());
    stage.append(root);
  }

  /** Shown (Water mode on) or not. */
  show(on: boolean): void {
    this.root.hidden = !on;
  }

  /** The intro card, shown (the first time) or not. */
  showIntro(on: boolean): void {
    this.intro.hidden = !on;
  }

  /** Opened out, or folded to the strip. */
  expand(open: boolean, tell = true): void {
    this.expanded = open;
    this.root.classList.toggle('is-open', open);
    this.moreEl.setAttribute('aria-expanded', String(open));
    const c = open ? CONTROLS.collapse : CONTROLS.expand;
    this.moreEl.title = c.title;
    this.moreEl.setAttribute('aria-label', c.label);
    if (tell) this.act.expanded(open);
  }

  /** Everything shown brought up to date (only what changed is written). */
  update(v: PanelView): void {
    this.write(this.clockEl, v.clock);
    this.reading('ammonia', ppm(v.ammonia, 0.05), v.ammonia);
    this.reading('nitrite', ppm(v.nitrite, 0.05), v.nitrite);
    this.reading('nitrate', ppm(v.nitrate, 0.5), v.nitrate);
    this.reading('ph', v.ph.toFixed(1), v.ph);
    this.reading('temp', `${v.tempF.toFixed(1)} °F`, v.tempF);
    this.write(this.values.get('tempC')!, ` ${v.tempC.toFixed(1)} °C`);
    const condition = CONDITIONS[v.level];
    const title = v.cause ? `${condition}: ${CAUSES[v.cause]}` : condition;
    if (this.conditionEl.title !== title) {
      this.conditionEl.title = title;
      this.conditionEl.dataset.level = String(v.level);
    }
    this.write(this.conditionEl, condition);
    // The news: a reading tapped, for a while; in danger, what to do; else what troubles the fish,
    // and what is happening. (Folded on a phone, only the first shows.)
    const about = performance.now() < this.aboutUntil;
    this.write(this.whyEl, about ? this.about : v.level >= 3 && v.cause ? DANGER[v.cause] : v.cause ? `${condition}: ${CAUSES[v.cause]}.` : '');
    this.write(this.whatEl, about || v.level >= 3 ? '' : v.news);
    for (const b of this.speedEls) pressed(b, b.dataset.speed === v.speed);
    pressed(this.heaterEl, v.heater);
    pressed(this.dechlorEl, v.dechlor);
    if (this.mealsEl.value !== String(v.meals)) this.mealsEl.value = String(v.meals);
    if (this.changeEl.value !== v.change) this.changeEl.value = v.change;
  }

  private reading(id: ReadingId, text: string, v: number): void {
    const value = this.values.get(id)!;
    if (this.shown.get(value) !== text) value.closest('button')!.setAttribute('aria-label', `${READINGS[id].name} ${text}${READINGS[id].unit}`);
    this.write(value, text);
    const chip = this.chips.get(id);
    const card = CARDS[id];
    if (chip && card) {
      const colour = kitColour(card, v);
      if (this.shown.get(chip) !== colour) {
        this.shown.set(chip, colour);
        chip.style.background = colour;
      }
    }
  }

  private write(e: HTMLElement, text: string): void {
    if (this.shown.get(e) === text) return;
    this.shown.set(e, text);
    e.textContent = text;
  }
}
