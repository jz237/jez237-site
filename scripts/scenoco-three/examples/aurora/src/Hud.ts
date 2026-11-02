import { Vector3, type Camera } from 'three';

/**
 * The page's own HTML over the battle — Breakout's HUD: glass panels for the score, the wave and the
 * cities; each battery's ammunition under it; chain counts and points rising where they were won; the
 * wave's name sweeping across; the commander's words; the end-of-wave tally; arrows over warheads still
 * above the frame. This writes into it and puts classes on and off; the motion is CSS.
 */
const $ = (id: string): HTMLElement => {
  const found = document.getElementById(id);
  if (!found) throw new Error(`index.html has no #${id}`);
  return found;
};

export interface Card {
  id: string;
  title: string;
  text: string;
}

export class Hud {
  constructor() {
    // The page never scrolls: a focused button or an overflowing label must not slide the game sideways.
    const pin = () => {
      if (window.scrollX || window.scrollY) window.scrollTo(0, 0);
      for (const el of [document.documentElement, document.body, document.getElementById('ui')]) if (el && (el.scrollLeft || el.scrollTop)) el.scrollLeft = el.scrollTop = 0;
    };
    window.addEventListener('scroll', pin, true);
    document.getElementById('ui')?.addEventListener('scroll', pin);
    setInterval(pin, 500);
  }

  private readonly el = {
    ui: $('ui'), bar: $('hud'), score: $('score'), hi: $('hi'), level: $('level'), cities: $('cities'),
    chain: $('chain'), chainBig: $('chain-big'), chainSmall: $('chain-small'), popups: $('popups'), flash: $('flash'),
    intro: $('intro'), introStage: $('intro-stage'), introName: $('intro-name'), introTell: $('intro-tell'),
    voice: $('voice'), tally: $('tally'), tallyCities: $('tally-cities'), tallyAmmo: $('tally-ammo'), tallyTotal: $('tally-total'),
    banner: $('banner'), headline: $('headline'), hint: $('hint'), pause: $('pause-menu'), pauseLine: $('pause-line'),
    splash: $('splash'), arsenal: $('arsenal'), arsenalLine: $('arsenal-line'), arsenalCards: $('arsenal-cards'),
    pauseButton: $('pause'), sound: $('sound'), threats: $('threats'), effects: $('effects'),
  };
  private readonly ammo = [0, 1, 2].map((i) => $(`ammo-${i}`));
  private readonly popupTemplate = $('popup') as HTMLTemplateElement;
  private readonly v = new Vector3();
  private timers: number[] = [];
  private voiceTimer = 0;
  private chainTimer = 0;
  private shown = { score: -1, ammo: ['', '', ''] };
  private readonly arrows: HTMLElement[] = [];

  playing(on: boolean): void {
    this.el.bar.classList.toggle('shown', on);
    this.el.pauseButton.classList.toggle('shown', on);
    document.getElementById('fire-hud')?.classList.toggle('shown', on);
    this.el.splash.classList.toggle('gone', on);
    for (const a of this.ammo) a.classList.toggle('shown', on);
    if (!on) {
      this.threats([], null);
      this.el.effects.textContent = '';
    }
  }

  score(value: number): void {
    if (value === this.shown.score) return;
    this.shown.score = value;
    this.el.score.textContent = String(value).padStart(7, '0');
  }

  hi(value: number): void {
    const text = Math.floor(value).toLocaleString('en-US');
    if (this.el.hi.textContent !== text) this.el.hi.textContent = text;
  }

  wave(n: number): void {
    this.el.level.textContent = String(n);
  }

  cities(alive: boolean[], shields: number[]): void {
    const pips = this.el.cities;
    while (pips.children.length < alive.length) {
      const pip = document.createElement('div');
      pip.className = 'pip';
      pips.append(pip);
    }
    alive.forEach((on, i) => {
      const pip = pips.children[i] as HTMLElement;
      pip.classList.toggle('spent', !on);
      pip.classList.toggle('shielded', on && (shields[i] ?? 0) > 0);
    });
  }

  /** Each battery's rounds, under it on screen. */
  silos(list: { x: number; y: number; ammo: number; alive: boolean }[], camera: Camera): void {
    list.forEach((s, i) => {
      const el = this.ammo[i];
      if (!el) return;
      // Above the dome on a wide screen; below it, on the ground, on an upright one, clear of the cities.
      const small = this.el.ui.classList.contains('portrait') || innerHeight < 520;
      this.v.set(s.x, s.y + (small ? 2.6 : 1.75), 0.8).project(camera);
      el.style.left = `${((this.v.x + 1) / 2) * 100}%`;
      el.style.top = `${((1 - this.v.y) / 2) * 100}%`;
      const text = s.alive ? String(s.ammo) : 'OUT';
      if (this.shown.ammo[i] !== text) {
        this.shown.ammo[i] = text;
        el.textContent = text;
        el.classList.toggle('low', s.alive && s.ammo <= 3);
        el.classList.toggle('out', !s.alive || s.ammo === 0);
      }
    });
  }

  chain(count: number, multiplier: number): void {
    this.el.chainBig.textContent = `CHAIN ×${count}`;
    this.el.chainSmall.textContent = `MULTIPLIER ${multiplier.toFixed(2)} · SKY ON FIRE`;
    this.el.chain.classList.add('shown');
    clearTimeout(this.chainTimer);
    this.chainTimer = window.setTimeout(() => this.el.chain.classList.remove('shown'), 700);
  }

  /** A banner-sized message in the chain plate: SATELLITE DOWN, BATTERIES REBUILT… */
  plate(big: string, small: string, ms = 1400): void {
    this.el.chainBig.textContent = big;
    this.el.chainSmall.textContent = small;
    this.el.chain.classList.add('shown');
    clearTimeout(this.chainTimer);
    this.chainTimer = window.setTimeout(() => this.el.chain.classList.remove('shown'), ms);
  }

  popup(text: string, x: number, y: number, camera: Camera, kind = ''): void {
    this.v.set(x, y, 0.5).project(camera);
    if (this.el.popups.childElementCount > 40) this.el.popups.firstElementChild?.remove();
    const label = this.popupTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
    if (kind) label.classList.add(kind);
    label.textContent = text;
    label.style.left = `calc(${((this.v.x + 1) / 2) * 100}% + ${Math.round((Math.random() - 0.5) * 20)}px)`;
    label.style.top = `calc(${((1 - this.v.y) / 2) * 100}% - ${Math.round(Math.random() * 14)}px)`;
    this.el.popups.append(label);
    requestAnimationFrame(() => requestAnimationFrame(() => label.classList.remove('start')));
    setTimeout(() => label.remove(), 1800);
  }

  flash(kind: 'bad' | 'white' | 'gold' | 'violet' = 'bad'): void {
    this.el.flash.dataset.kind = kind;
    this.el.flash.classList.add('on');
    setTimeout(() => this.el.flash.classList.remove('on'), 70);
  }

  intro(stage: string, name: string, tell: string, boss = false): void {
    for (const t of this.timers) clearTimeout(t);
    const intro = this.el.intro;
    this.el.introStage.textContent = stage;
    this.el.introName.textContent = name;
    this.el.introTell.textContent = tell;
    intro.classList.toggle('boss', boss);
    intro.classList.remove('shown', 'leave');
    intro.classList.add('enter');
    this.timers = [
      window.setTimeout(() => intro.classList.replace('enter', 'shown'), 40),
      window.setTimeout(() => intro.classList.replace('shown', 'leave'), 2300),
    ];
  }

  /** The commander's words while a line plays; '' takes them down at once. */
  voice(text: string): void {
    clearTimeout(this.voiceTimer);
    if (!text) return void this.el.voice.classList.remove('shown');
    this.el.voice.textContent = text;
    this.el.voice.classList.add('shown');
    clearTimeout(this.voiceTimer);
    this.voiceTimer = window.setTimeout(() => this.el.voice.classList.remove('shown'), 1700);
  }

  tally(state: { cities: number; cityPoints: number; ammo: number; ammoPoints: number } | null): void {
    this.el.tally.classList.toggle('shown', state !== null);
    if (!state) return;
    this.el.tallyCities.textContent = `${state.cities} × 150 = ${state.cityPoints.toLocaleString('en-US')}`;
    this.el.tallyAmmo.textContent = `${state.ammo} × 8 = ${state.ammoPoints.toLocaleString('en-US')}`;
    this.el.tallyTotal.textContent = `+${(state.cityPoints + state.ammoPoints).toLocaleString('en-US')}`;
  }

  /** Arrows along the top edge over warheads not yet in view; null `camera` clears them. */
  threats(xs: { x: number; y: number; kind: string }[], camera: Camera | null): void {
    while (this.arrows.length < xs.length) {
      const a = document.createElement('div');
      a.className = 'threat';
      a.textContent = '▼';
      this.el.threats.append(a);
      this.arrows.push(a);
    }
    this.arrows.forEach((a, i) => {
      const t = xs[i];
      if (!t || !camera) {
        a.style.display = 'none';
        return;
      }
      this.v.set(t.x, t.y, 0).project(camera);
      a.style.display = '';
      a.style.left = `${Math.max(2, Math.min(98, ((this.v.x + 1) / 2) * 100))}%`;
      a.dataset.kind = t.kind;
    });
  }

  /** The running Arsenal upgrades, as a line of chips. */
  effects(text: string): void {
    if (this.el.effects.textContent !== text) this.el.effects.textContent = text;
  }

  banner(headline: string | null, hint = '', mood: 'good' | 'bad' = 'good'): void {
    this.el.banner.classList.toggle('shown', headline !== null);
    this.el.banner.classList.toggle('bad', mood === 'bad');
    if (headline === null) return;
    this.el.headline.textContent = headline;
    this.el.hint.textContent = hint;
  }

  pauseMenu(line: string | null): void {
    this.el.pause.classList.toggle('shown', line !== null);
    this.el.ui.classList.toggle('paused', line !== null);
    if (line !== null) {
      this.el.pauseLine.textContent = line;
      (this.el.pause.querySelector('[data-button="Resume"]') as HTMLElement | null)?.focus({ preventScroll: true });
    }
  }

  /** The Arsenal between boss waves: three cards, keys 1 2 3. Null hides it. */
  arsenal(cards: Card[] | null, line = ''): void {
    this.el.arsenal.classList.toggle('shown', cards !== null);
    if (!cards) return;
    this.el.arsenalLine.textContent = line;
    this.el.arsenalCards.replaceChildren(
      ...cards.map((c, i) => {
        const b = document.createElement('button');
        b.className = `card up-${c.id}`;
        b.dataset.button = `Pick${i + 1}`;
        b.innerHTML = `<b></b><span></span><i>${i + 1}</i>`;
        (b.querySelector('b') as HTMLElement).textContent = c.title;
        (b.querySelector('span') as HTMLElement).textContent = c.text;
        return b;
      }),
    );
  }

  /** Both fire-mode buttons — the title's and the HUD's — say which mode is on. */
  fireMode(rapid: boolean): void {
    for (const button of document.querySelectorAll<HTMLElement>('[data-button="FireMode"]')) {
      button.classList.toggle('tap', !rapid);
      button.classList.toggle('rapid', rapid);
      const label = button.querySelector('.mode');
      const touch = matchMedia('(pointer: coarse)').matches;
      if (label) label.textContent = rapid ? 'FIRE: HOLD FOR RAPID' : touch ? 'FIRE: TAP' : 'FIRE: CLICK';
    }
    for (const id of ['how-fire', 'how-fire-touch']) {
      const how = document.getElementById(id);
      const touch = matchMedia('(pointer: coarse)').matches;
      if (how) how.textContent = rapid ? 'HOLD TO KEEP FIRING' : touch ? 'TAP WHERE IT WILL BE — ONE SHOT A TAP' : 'CLICK WHERE IT WILL BE — ONE SHOT A CLICK';
    }
  }

  difficulty(name: string): void {
    const el = document.getElementById('difficulty-value');
    if (el) el.textContent = name.toUpperCase();
  }

  sound(muted: boolean): void {
    this.el.sound.classList.toggle('off', muted);
  }

  /** Every NARRATION button — the title's and the pause menu's — says whether the commander speaks. */
  narration(on: boolean): void {
    for (const button of document.querySelectorAll<HTMLElement>('[data-button="Narration"]')) {
      button.classList.toggle('off', !on);
      button.setAttribute('aria-pressed', String(on));
      const value = button.querySelector('.narration-value');
      if (value) value.textContent = on ? 'ON' : 'OFF';
    }
  }

  portrait(on: boolean): void {
    this.el.ui.classList.toggle('portrait', on);
  }
}
