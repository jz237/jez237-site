import { Vector3, type Camera } from 'three';

/**
 * The page's own HTML over the game — Breakout's HUD: glass panels with the score, the wave and the
 * lives; points rising from where they were won; chips for running power-ups; a wave's name sweeping
 * across; the banner between games. This writes into it and puts classes on and off; the motion is CSS.
 */
export interface Chip {
  id: string;
  label: string;
  left: number;
  total: number;
}

const $ = (id: string): HTMLElement => {
  const found = document.getElementById(id);
  if (!found) throw new Error(`index.html has no #${id}`);
  return found;
};

export class Hud {
  private readonly el = {
    ui: $('ui'),
    bar: $('hud'),
    score: $('score'),
    hi: $('hi'),
    level: $('level'),
    lives: $('lives'),
    bombs: $('bombs'),
    combo: $('combo'),
    effects: $('effects'),
    popups: $('popups'),
    flash: $('flash'),
    intro: $('intro'),
    introStage: $('intro-stage'),
    introName: $('intro-name'),
    introTell: $('intro-tell'),
    banner: $('banner'),
    pause: $('pause-menu'),
    pauseLine: $('pause-line'),
    headline: $('headline'),
    hint: $('hint'),
    splash: $('splash'),
    upgrade: $('upgrade'),
    upLine: $('up-line'),
    bomb: $('bomb'),
    bombCount: $('bomb-count'),
    pauseButton: $('pause'),
    sound: $('sound'),
    fade: $('fade'),
  };
  private readonly popupTemplate = $('popup') as HTMLTemplateElement;
  private readonly chipTemplate = $('chip') as HTMLTemplateElement;
  private shownScore = -1;
  private shownChips = '';
  private readonly v = new Vector3();
  private introTimers: number[] = [];

  playing(on: boolean): void {
    this.el.bar.classList.toggle('shown', on);
    this.el.bomb.classList.toggle('shown', on);
    this.el.pauseButton.classList.toggle('shown', on);
    this.el.splash.classList.toggle('gone', on);
    if (!on) {
      this.el.combo.textContent = '';
      this.el.effects.replaceChildren();
      this.shownChips = '';
    }
  }

  splash(on: boolean): void {
    this.el.splash.classList.toggle('gone', !on);
  }

  score(value: number): void {
    if (value === this.shownScore) return;
    this.shownScore = value;
    this.el.score.textContent = String(value).padStart(6, '0');
    this.flick(this.el.score, 'bump', 90);
  }

  /** The score to beat, beside your own. */
  hi(value: number): void {
    const text = Math.floor(value).toLocaleString('en-US');
    if (this.el.hi.textContent !== text) this.el.hi.textContent = text;
  }

  wave(n: number): void {
    this.el.level.textContent = String(n);
  }

  lives(n: number): void {
    const pips = this.el.lives;
    while (pips.children.length < n) {
      const pip = document.createElement('div');
      pip.className = 'pip';
      pip.innerHTML = '<div class="shade"></div>';
      pips.append(pip);
    }
    while (pips.children.length > n) pips.lastElementChild!.remove();
  }

  /** A life lost: the last pip bursts before it goes. */
  loseLife(left: number): void {
    const pip = this.el.lives.children[left] as HTMLElement | undefined;
    if (!pip) return this.lives(left);
    pip.classList.add('losing');
    setTimeout(() => this.lives(left), 260);
  }

  bombs(n: number): void {
    this.el.bombs.textContent = '✦'.repeat(n) || '–';
    this.el.bombCount.textContent = n ? String(n) : '';
    this.el.bomb.classList.toggle('spent', n <= 0);
  }

  combo(multiplier: number, count: number): void {
    const text = multiplier > 1 ? `×${multiplier} COMBO · ${Math.floor(count)}` : '';
    if (this.el.combo.textContent === text) return;
    this.el.combo.textContent = text;
    this.el.combo.dataset.tier = String(multiplier);
    if (text) this.flick(this.el.combo, 'bump', 90);
  }

  chips(chips: Chip[]): void {
    const names = chips.map((c) => c.id).join();
    if (names !== this.shownChips) {
      this.shownChips = names;
      this.el.effects.replaceChildren(
        ...chips.map((c) => {
          const chip = this.chipTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
          chip.classList.add(c.id);
          (chip.querySelector('.name') as HTMLElement).textContent = c.label;
          return chip;
        }),
      );
    }
    chips.forEach((c, i) => {
      const timer = this.el.effects.children[i]?.querySelector('.timer') as HTMLElement | null;
      if (timer) timer.style.scale = `${Math.max(0, c.left / c.total)} 1`;
    });
  }

  /** Text rising from a point of the world. `kind` colours it: 'hot', 'good', 'bad', 'big'. */
  popup(text: string, x: number, y: number, z: number, camera: Camera, kind = ''): void {
    this.v.set(x, y, z).project(camera);
    if (this.el.popups.childElementCount > 40) this.el.popups.firstElementChild?.remove();
    const label = this.popupTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
    if (kind) label.classList.add(kind);
    label.textContent = text;
    label.style.left = `calc(${((this.v.x + 1) / 2) * 100}% + ${Math.round((Math.random() - 0.5) * 24)}px)`;
    label.style.top = `calc(${((1 - this.v.y) / 2) * 100}% - ${Math.round(Math.random() * 18)}px)`;
    label.addEventListener('transitionend', (e) => e.propertyName === 'opacity' && label.remove());
    this.el.popups.append(label);
    requestAnimationFrame(() => requestAnimationFrame(() => label.classList.remove('start')));
    setTimeout(() => label.remove(), 2000);
  }

  flash(kind: 'bad' | 'white' | 'gold' = 'bad'): void {
    this.el.flash.dataset.kind = kind;
    this.flick(this.el.flash, 'on', 70);
  }

  /** A wave's number and name across the screen: in from the right, held, out to the left. */
  intro(stage: string, name: string, tell: string): void {
    for (const t of this.introTimers) clearTimeout(t);
    const intro = this.el.intro;
    this.el.introStage.textContent = stage;
    this.el.introName.textContent = name;
    this.el.introTell.textContent = tell;
    intro.classList.remove('shown', 'leave');
    intro.classList.add('enter');
    this.introTimers = [
      window.setTimeout(() => intro.classList.replace('enter', 'shown'), 40),
      window.setTimeout(() => intro.classList.replace('shown', 'leave'), 2100),
    ];
  }

  banner(headline: string | null, hint = '', mood: 'good' | 'bad' = 'good'): void {
    this.el.banner.classList.toggle('shown', headline !== null);
    this.el.banner.classList.toggle('bad', mood === 'bad');
    if (headline === null) return;
    this.el.headline.textContent = headline;
    this.el.hint.textContent = hint;
  }

  /** The pause menu, with the run's wave and score on it; null closes it. */
  pauseMenu(line: string | null): void {
    this.el.pause.classList.toggle('shown', line !== null);
    if (line !== null) {
      this.el.pauseLine.textContent = line;
      (this.el.pause.querySelector('[data-button="Resume"]') as HTMLElement | null)?.focus({ preventScroll: true });
    }
  }

  /** The three paths between waves: each card's tier and what its next pick does. Null hides them. */
  upgrade(cards: { id: string; title: string; text: string; closed: boolean }[] | null, line = ''): void {
    this.el.upgrade.classList.toggle('shown', cards !== null);
    if (!cards) return;
    this.el.upLine.textContent = line;
    for (const card of cards) {
      const button = $(`up-${card.id}`) as HTMLButtonElement;
      (button.querySelector('b') as HTMLElement).textContent = card.title;
      (button.querySelector('span') as HTMLElement).textContent = card.text;
      button.classList.toggle('closed', card.closed);
    }
  }

  /** Time slowed — frost or the inchworm: the edges ice over. */
  frost(on: boolean): void {
    this.el.ui.classList.toggle('frozen', on);
  }

  sound(muted: boolean): void {
    this.el.sound.classList.toggle('off', muted);
  }

  fade(shut: boolean): void {
    this.el.fade.classList.toggle('shut', shut);
  }

  portrait(on: boolean): void {
    this.el.ui.classList.toggle('portrait', on);
  }

  private flick(element: HTMLElement, name: string, ms: number): void {
    element.classList.add(name);
    setTimeout(() => element.classList.remove(name), ms);
  }
}
