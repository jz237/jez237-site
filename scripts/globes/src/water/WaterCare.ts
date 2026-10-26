// Water mode, on the betta bowl's page: the bowl's water simulated on a fast clock (chemistry.mjs,
// run by care.mjs), its readings and what to do about them in a panel (panel.ts), and what the water
// does to the fish and to the water's look written to the page's water.fx (effects.ts), which the
// fish and the bowl's look read. It is off until asked for (the Water button among the fish's
// controls, remembered on this device, as is the bowl itself: next visit it carries on where it
// was); off, it does nothing in a frame and water.fx is the page as it always was.
//
// The clock runs only while Water mode is on and the page is seen: Play is half an hour a second,
// Fast six hours. The routine's meals are counted without lifting the lid, the fish eating what its
// appetite allows; the Feed button's pellets are counted as the fish eats them or as they settle on
// the sand uneaten (FishFood.ts). Pellets left uneaten lie on the sand, crumbling, until they have
// rotted (the newest few are shown).

import { Care, clockText } from './care.mjs';
import { CLEAR_WATER, type WaterEffects } from './effects';
import { CONTROLS, HAPPENING } from './content';
import { WaterPanel } from './panel';
import type { Learn } from '../app/learn/Learn';
import type { FishFood } from '../fish/FishFood';
import type { Feeding } from '../interaction/Feeding';
import { BED } from '../render/bowlScape';

/** Where the choice is kept on this device, and the bowl with its settings and the panel's. */
const STORAGE_KEY = 'betta.water';
const STATE_KEY = 'betta.water.state';
/** How often (s) the panel is brought up to date, its chart redrawn, the bowl kept. */
const PANEL_EVERY = 0.25;
const CHART_EVERY = 0.5;
const SAVE_EVERY = 5;

export interface WaterHost {
  /** The page's effects of the water (main.ts: read by the fish and the bowl's look). */
  water: { fx: WaterEffects };
  /** ?water= (testing): the effects forced while Water mode is off, or null. */
  forced: WaterEffects | null;
  feeding: Feeding;
  food: FishFood;
  learn: Learn | null;
  /** The globe frame to the sim frame (column-major 3x3). */
  rotation(): ArrayLike<number>;
}

export class WaterCare {
  readonly care: Care;
  readonly panel: WaterPanel;
  private readonly button: HTMLButtonElement;
  private panelDue = 0;
  private chartDue = 0;
  private saveDue = SAVE_EVERY;
  /** The chart's last sample drawn (its time), to redraw only when there is a new one. */
  private charted = -1;
  /** Opened out by choice (null: as suits the screen), and the intro card read. */
  private open: boolean | null = null;
  private introSeen = false;

  /** controls: the fish's controls (the Water button joins them); stage: where the panel goes. */
  constructor(
    controls: HTMLElement,
    private readonly stage: HTMLElement,
    private readonly host: WaterHost,
  ) {
    const care = (this.care = new Care({ water: host.water, idle: host.forced ?? CLEAR_WATER, feeding: host.feeding, food: host.food, rotation: host.rotation, bed: BED.level }));
    const button = (this.button = document.createElement('button'));
    button.type = 'button';
    button.dataset.action = 'water';
    button.textContent = CONTROLS.open.label;
    button.title = CONTROLS.open.title;
    button.setAttribute('aria-pressed', 'false');
    button.addEventListener('click', () => this.set(!this.on));
    controls.append(button);

    // (Each choice in the panel shows at once, and is kept.)
    const act = (f: () => unknown): void => {
      f();
      this.changed();
    };
    this.panel = new WaterPanel(stage, {
      speed: (s) => act(() => (care.speed = s)),
      change: (f) =>
        act(() => {
          care.bowl.waterChange(f);
          care.bowl.sample();
        }),
      rinse: (tap) => act(() => care.bowl.rinseSponge(tap)),
      heater: (on) => act(() => (care.bowl.heater = on)),
      dechlor: (on) => act(() => (care.bowl.dechlor = on)),
      meals: (n) => act(() => (care.routine.meals = n)),
      routine: (c) => act(() => (care.routine.change = c)),
      start: (kind) => this.startOver(kind),
      expanded: (open) => {
        this.open = open;
        this.charted = -1;
        this.chartDue = 0;
        this.save();
      },
      introClosed: () => {
        this.introSeen = true;
        this.save();
      },
    });

    const keep = (): void => {
      if (this.on) this.save();
    };
    addEventListener('pagehide', keep);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) keep();
    });
    // Last visit's bowl, and Water mode on again if it was (no intro). (Storage blocked, or what it
    // holds spoilt: a first visit's new bowl.)
    try {
      const saved = JSON.parse(localStorage.getItem(STATE_KEY) ?? 'null') as { open?: unknown; intro?: unknown } | null;
      if (care.restore(saved)) {
        this.open = typeof saved?.open === 'boolean' ? saved.open : null;
        this.introSeen = saved?.intro === true;
      }
      if (localStorage.getItem(STORAGE_KEY) === '1') this.set(true, false);
    } catch (err: unknown) {
      console.warn('[globes] Water mode: starting with a new bowl:', err);
      care.startOver('new');
      if (care.on) this.render();
    }
  }

  get on(): boolean {
    return this.care.on;
  }

  /** Turns it on (the intro card the first time, unless restored) or off, and remembers which. */
  set(on: boolean, intro = true): void {
    this.care.set(on);
    this.button.setAttribute('aria-pressed', String(on));
    this.stage.classList.toggle('water-on', on);
    this.panel.show(on);
    if (this.host.learn) this.host.learn.meals = on ? this.care.meals : null;
    try {
      localStorage.setItem(STORAGE_KEY, on ? '1' : '0');
    } catch {
      // (Not remembered.)
    }
    if (!on) {
      this.save();
      return;
    }
    this.panel.expand(this.open ?? !matchMedia('(max-width: 500px), (max-height: 500px)').matches, false);
    this.panel.showIntro(intro && !this.introSeen);
    this.render();
    this.charted = -1;
    this.chartDue = 0;
  }

  /** Each frame while on (after the fish and the food have moved; dt real s): the simulation, and
   *  now and then the panel and what is kept. */
  frame(dt: number): void {
    this.care.frame(dt, document.hidden);
    if ((this.panelDue -= dt) <= 0) {
      this.panelDue = PANEL_EVERY;
      this.care.sync();
      this.render();
    }
    if ((this.chartDue -= dt) <= 0) {
      this.chartDue = CHART_EVERY;
      this.chart();
    }
    if ((this.saveDue -= dt) <= 0) {
      this.saveDue = SAVE_EVERY;
      this.save();
    }
  }

  /** A fresh start: a new bowl, a cycled one, or a neglected one. */
  startOver(kind: string): void {
    this.care.startOver(kind);
    this.changed();
  }

  /** Testing (?qa): `days` run at once with the routine, its meals counted. */
  forward(days: number): void {
    this.care.forward(days);
    this.changed();
  }

  /** The panel brought up to date. */
  private render(): void {
    const { bowl, routine, speed } = this.care;
    const r = bowl.readings();
    const c = bowl.condition();
    this.panel.update({
      clock: clockText(bowl.s.t),
      speed,
      ammonia: r.ammonia,
      nitrite: r.nitrite,
      nitrate: r.nitrate,
      ph: r.ph,
      tempF: r.tempF,
      tempC: r.tempC,
      level: c.level,
      cause: c.cause,
      news: HAPPENING[bowl.happening()],
      heater: bowl.heater,
      dechlor: bowl.dechlor,
      meals: routine.meals,
      change: routine.change,
    });
  }

  /** The chart redrawn, if it shows and there is something new. */
  private chart(): void {
    const history = this.care.bowl.s.history;
    const last = history.length ? history[history.length - 1][0] : 0;
    if (!this.panel.expanded || last === this.charted) return;
    this.charted = last;
    this.panel.chart.set(history);
  }

  /** After a choice in the panel: shown at once, and kept. */
  private changed(): void {
    this.care.sync();
    this.render();
    this.charted = -1;
    this.chart();
    this.save();
  }

  private save(): void {
    try {
      localStorage.setItem(STATE_KEY, JSON.stringify({ ...this.care.toJSON(), open: this.open, intro: this.introSeen }));
    } catch {
      // (Not kept: storage blocked or full.)
    }
  }
}
