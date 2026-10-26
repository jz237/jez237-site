// Learn mode, on the betta bowl's page: captions that explain what the fish does as it does it
// (captions.mjs says when), a card about whatever a tap lands on in the bowl (pick.mjs finds it,
// through the glass and the water), and advice as the fish is fed (feedLog.mjs counts its food). The
// words are content.ts's. It is off until asked for (the Learn button among the fish's controls,
// remembered on this device); off, it does nothing in a frame, and a tap does what it always did.

import * as THREE from 'three/webgpu';
import { BOWL } from '../../render/bowl';
import { BED, LEAF } from '../../render/bowlScape';
import type { Betta } from '../../fish/Betta';
import type { FishFood } from '../../fish/FishFood';
import type { BowlLid } from '../../interaction/BowlLid';
import type { BowlLife } from '../../interaction/BowlLife';
import type { FeedState, Feeding } from '../../interaction/Feeding';
import type { GlobeController } from '../../interaction/GlobeController';
import { CaptionClock, MODE_CAPTIONS } from './captions.mjs';
import { CAPTIONS, FEEDING, INTRO, TOPICS, type CaptionId, type LearnCard, type TopicId } from './content';
import { FeedLog } from './feedLog.mjs';

/** Where the choice is kept on this device. */
const STORAGE_KEY = 'betta.learn';
/** How long a card stays up (s): so long, and so long again for each word. A caption comes unasked
 *  and goes after a few seconds; a card asked for (a tap, a meal) leaves time to read it twice.
 *  (Held while the pointer is on it, or focus in it.) */
const CAPTION_TIME = [5, 0.12] as const;
const ASKED_TIME = [8, 0.2] as const;
/** How long a card takes to fade (ms; styles.css .learn-card), after which its words are cleared. */
const FADE_MS = 500;
/** A nest of fewer bubbles than this hardly shows: a tap there is on the water. */
const NEST_SHOWN = 8;

/** What Learn mode reads of the page. */
export interface LearnHost {
  camera: THREE.Camera;
  canvas: HTMLCanvasElement;
  controller: GlobeController;
  betta: Betta;
  life: BowlLife;
  food: FishFood;
  feeding: Feeding;
  lid: BowlLid;
  /** The glass's radii. */
  glass: { outerRadius: number; innerRadius: number };
  /** The water's resting height (the sim frame). */
  level: () => number;
}

type Picking = typeof import('./pick.mjs');

export class Learn {
  on = false;
  private readonly button: HTMLButtonElement;
  private readonly card: HTMLElement;
  private readonly text: HTMLElement;
  private readonly close: HTMLButtonElement;
  private readonly clock = new CaptionClock();
  private readonly log = new FeedLog();
  /** The furnishings' BVH, once built (furnishings.ts: its texels and its meshes). */
  private scape: { data: Float32Array; parts: [string, number][] } | null = null;
  /** The picking module, loaded once Learn mode is first turned on (it brings the BVH's tracer). */
  private picking: Promise<void> | null = null;
  private pickBowl: Picking['pickBowl'] | null = null;
  private readonly raycaster = new THREE.Raycaster();
  private readonly ndc = new THREE.Vector2();
  private readonly origin = new THREE.Vector3();
  private readonly dir = new THREE.Vector3();
  /** The card up: until when (s; 0: none), and whether the pointer is on it or focus in it. */
  private until = 0;
  private held = false;
  private clearing = 0;
  /** What the page was doing last frame: the meal's state, the fins flared at the button, the
   *  nest's bubbles. */
  private feedState: FeedState = 'idle';
  private flared = false;
  private bubbles = 0;

  /** controls: the fish's controls (the Learn button joins them); stage: where the card goes;
   *  besideStats: ?stats' figures are up (on a narrow screen the card goes up top, clear of them). */
  constructor(
    controls: HTMLElement,
    stage: HTMLElement,
    private readonly host: LearnHost,
    besideStats: boolean,
  ) {
    const button = (this.button = document.createElement('button'));
    button.type = 'button';
    button.dataset.action = 'learn';
    button.textContent = 'Learn';
    button.title = 'Explain what the fish does, and what is in the bowl (tap anything)';
    button.setAttribute('aria-pressed', 'false');
    button.addEventListener('click', () => this.set(!this.on));
    controls.append(button);

    const card = (this.card = document.createElement('div'));
    card.className = besideStats ? 'learn-card beside-stats' : 'learn-card';
    // (Its close button first: floated, the words run round it.)
    card.innerHTML = '<button type="button" class="learn-close" aria-label="Close" inert><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7l10 10M17 7L7 17"/></svg></button><div class="learn-text" role="status" aria-live="polite" aria-atomic="true"></div>';
    this.text = card.querySelector('.learn-text')!;
    this.close = card.querySelector('.learn-close')!;
    this.close.addEventListener('click', () => this.hide());
    card.addEventListener('pointerenter', () => (this.held = true));
    card.addEventListener('pointerleave', () => (this.held = card.contains(document.activeElement)));
    card.addEventListener('focusin', () => (this.held = true));
    card.addEventListener('focusout', () => (this.held = card.matches(':hover')));
    stage.append(card);
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.until > 0) this.hide();
    });
    // (Every pellet is counted, Learn mode on or off: the advice is for the whole visit.)
    host.feeding.onDrop = () => this.log.drop(performance.now() / 1000);

    let kept = false;
    try {
      kept = localStorage.getItem(STORAGE_KEY) === '1';
    } catch {
      // (Storage blocked: off, as for a first visit.)
    }
    if (kept) this.set(true, false);
  }

  /** The furnishings' BVH (furnishings.ts), for taps on them. */
  setScape(data: Float32Array, parts: [string, number][]): void {
    this.scape = { data, parts };
  }

  /** Turns it on (with a word on what it does, unless restored) or off, and remembers which. */
  set(on: boolean, intro = true): void {
    this.on = on;
    this.button.setAttribute('aria-pressed', String(on));
    try {
      localStorage.setItem(STORAGE_KEY, on ? '1' : '0');
    } catch {
      // (Not remembered.)
    }
    if (!on) {
      this.hide();
      return;
    }
    this.picking ??= import('./pick.mjs').then(
      (m) => {
        this.pickBowl = m.pickBowl;
      },
      (err: unknown) => console.warn('[globes] Learn mode: taps unavailable:', err),
    );
    // (Only what changes from now on is news.)
    const h = this.host;
    this.feedState = h.feeding.state;
    this.flared = h.betta.flared;
    this.bubbles = h.life.bubbles;
    // (Turned on, a word on what it does; on again from the last visit, a while to look first.)
    if (intro) this.show(INTRO, true);
    else this.clock.closed(performance.now() / 1000);
  }

  /** Each frame while on (after the fish, the nest and the food have moved): advice as a meal is
   *  asked for, a caption as the fish does something worth one, and the card's time up. */
  frame(): void {
    const t = performance.now() / 1000;
    const h = this.host;
    const fed = h.feeding.state;
    if (fed !== this.feedState) {
      // (Away from idle is a meal asked for: waiting for the bowl to stand still, or, standing
      // still already, opening in the same frame.)
      if (this.feedState === 'idle') this.advise(t);
      this.feedState = fed;
    }
    // Things that happen at a moment: the fins flared at the button (asked for: shown at once), the
    // nest grown (the fish back from the film), a pellet sunk to the sand uneaten.
    const flared = h.betta.flared;
    if (flared && !this.flared && this.clock.event('flare', t, this.busy, true)) this.caption('flare');
    this.flared = flared;
    const bubbles = h.life.bubbles;
    if (bubbles > this.bubbles && this.clock.event('nest', t, this.busy)) this.caption('nest');
    this.bubbles = bubbles;
    if (h.food.landed > 0 && this.clock.event('sunk', t, this.busy)) this.caption('sunk');
    // What the fish is doing.
    this.clock.watch((MODE_CAPTIONS as Record<string, CaptionId | undefined>)[h.betta.swim.mode] ?? null, t);
    const due = this.clock.due(t, this.busy) as CaptionId | null;
    if (due) this.caption(due);
    if (this.until > 0 && t > this.until && !this.held) this.hide();
  }

  /** A tap (a press let go where it began) at client px: with Learn mode on, a card about what it
   *  is on (or, off the bowl, the card put away), and true; off, false (the tap is the page's). */
  tap(clientX: number, clientY: number): boolean {
    if (!this.on) return false;
    if (!this.pickBowl) {
      void this.picking?.then(() => {
        if (this.pickBowl) this.tap(clientX, clientY);
      });
      return true;
    }
    const topic = this.pick(clientX, clientY);
    if (topic) this.show(TOPICS[topic], true);
    else this.hide();
    return true;
  }

  /** What is under client px (x, y), as the viewer sees it through the glass and the water
   *  (pick.mjs), or null: off the bowl, something it has no card for, or the picking not loaded. */
  pick(clientX: number, clientY: number): TopicId | null {
    const pickBowl = this.pickBowl;
    if (!pickBowl) return null;
    const h = this.host;
    const r = h.canvas.getBoundingClientRect();
    this.raycaster.setFromCamera(this.ndc.set(((clientX - r.left) / r.width) * 2 - 1, 1 - ((clientY - r.top) / r.height) * 2), h.camera);
    const ray = this.raycaster.ray;
    // (BowlLife's matrix: the leaf's middle and heading, that it is there; the nest's heart, the
    // glass's bearing there, its bubbles.)
    const e = h.life.matrix.elements;
    const hit = pickBowl(ray.origin.clone().sub(h.controller.center).toArray(), ray.direction.toArray(), {
      outer: h.glass.outerRadius,
      inner: h.glass.innerRadius,
      mouth: BOWL.mouth,
      rotation: h.controller.rotation.elements,
      level: h.level(),
      bed: BED.level,
      scape: this.scape,
      fish: h.betta.active ? h.betta.probePoints() : null,
      leaf: e[4] > 0.5 ? { at: [e[0], e[1], e[2]], yaw: e[3], length: LEAF.length, width: LEAF.width } : null,
      nest: e[12] >= NEST_SHOWN ? { at: [e[8], e[9], e[10]], bearing: e[11] } : null,
      lid: (o: number[], d: number[]) => h.lid.hits(this.origin.fromArray(o), this.dir.fromArray(d)),
    });
    return (hit?.topic ?? null) as TopicId | null;
  }

  private get busy(): boolean {
    return this.until > 0;
  }

  /** The advice for a meal asked for at t (s), by what the fish has had (feedLog.mjs). */
  private advise(t: number): void {
    const a = this.log.advise(t);
    this.show(a.advice === 'over' ? FEEDING.over(a.pellets, a.minutes) : a.advice === 'again' ? FEEDING.again(a.pellets, a.minutes) : FEEDING.rule, true);
    // (The fish feeds while that card is up, and the rule's card says how: no caption after.)
    this.clock.told('feed', t);
  }

  private caption(id: CaptionId): void {
    this.show(CAPTIONS[id], false);
  }

  /** A card up (in place of any other), for as long as its words take to read. */
  private show(c: LearnCard, asked: boolean): void {
    window.clearTimeout(this.clearing);
    const line = (cls: string, words: string): HTMLParagraphElement => {
      const p = document.createElement('p');
      p.className = cls;
      p.textContent = words;
      return p;
    };
    this.text.replaceChildren(line('learn-kicker', c.kicker), line('learn-title', c.title), line('learn-body', c.body));
    const [base, perWord] = asked ? ASKED_TIME : CAPTION_TIME;
    this.until = performance.now() / 1000 + base + perWord * `${c.title} ${c.body}`.split(/\s+/).length;
    this.card.classList.add('is-on');
    this.close.inert = false;
  }

  /** The card put away (faded out, then its words cleared, so the same card again is news to a
   *  screen reader); no caption for a while. */
  private hide(): void {
    if (this.until === 0) return;
    this.until = 0;
    this.held = false;
    if (this.card.contains(document.activeElement)) this.button.focus();
    this.card.classList.remove('is-on');
    this.close.inert = true;
    this.clock.closed(performance.now() / 1000);
    this.clearing = window.setTimeout(() => this.text.replaceChildren(), FADE_MS);
  }
}
