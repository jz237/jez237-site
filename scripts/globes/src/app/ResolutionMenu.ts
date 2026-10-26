// The betta bowl's resolution menu (resolution.mjs): a button in the page's link bar, "Resolution:
// Auto", and above it a short list to choose from - Auto, the sharpest picture that keeps frames
// coming 35 a second or more (TARGET_FPS), or a size held however slowly frames then come -
// remembered on this device.

import { TARGET_FPS } from './quality/controller.mjs';
import { choiceFor, describeRatio, fixedRatios, ownRatio, parseChoice, ratioOf, STORAGE_KEY } from './resolution.mjs';

export type ResolutionChoice = 'auto' | 'screen' | number;

export interface ResolutionHost {
  /** The screen's pixel ratio now. */
  screen: () => number;
  /** The stage's size (CSS px). */
  stage: () => [number, number];
  /** The picture's ratio now (what Auto has it at). */
  ratioNow: () => number;
  /** The GPU's largest texture side (no picture is larger). */
  most: number;
}

export class ResolutionMenu {
  choice: ResolutionChoice;
  /** Called with the ratio to hold (null: Auto) whenever the choice changes. */
  onChange: ((ratio: number | null) => void) | null = null;
  private readonly button: HTMLButtonElement;
  private readonly menu: HTMLElement;
  private readonly list: HTMLElement;

  constructor(
    bar: HTMLElement,
    private readonly host: ResolutionHost,
  ) {
    let kept: string | null = null;
    try {
      kept = localStorage.getItem(STORAGE_KEY);
    } catch {
      // (Storage blocked: Auto, as for a first visit.)
    }
    this.choice = parseChoice(kept, host.screen()) as ResolutionChoice;

    const button = (this.button = document.createElement('button'));
    button.type = 'button';
    button.className = 'res-button';
    button.setAttribute('aria-haspopup', 'dialog');
    button.setAttribute('aria-expanded', 'false');
    button.title = 'How sharp the picture is drawn';
    button.addEventListener('click', () => this.toggle());
    bar.append(button);

    const menu = (this.menu = document.createElement('div'));
    menu.className = 'res-menu';
    menu.setAttribute('role', 'dialog');
    menu.setAttribute('aria-label', 'Resolution');
    menu.hidden = true;
    menu.innerHTML = `<p class="res-head">Resolution</p><div class="res-list" role="radiogroup" aria-label="Resolution"></div><p class="res-note">Auto keeps ${TARGET_FPS} frames a second or more. A fixed size stays sharp however slowly frames come.</p>`;
    this.list = menu.querySelector('.res-list')!;
    document.body.append(menu);
    // (Put away by a press anywhere else, or Escape.)
    document.addEventListener('pointerdown', (e) => {
      if (!menu.hidden && !menu.contains(e.target as Node) && !button.contains(e.target as Node)) this.close(false);
    });
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !menu.hidden) this.close(true);
    });
    this.label();
  }

  /** The ratio the choice holds the picture at (null: Auto). */
  get ratio(): number | null {
    return ratioOf(this.choice, this.host.screen());
  }

  private toggle(): void {
    if (this.menu.hidden) this.open();
    else this.close(false);
  }

  /** The list, as things are now (the stage's size, the screen's ratio, Auto's ratio). */
  private open(): void {
    const h = this.host;
    const screen = h.screen();
    const own = ownRatio(screen);
    const [w, hgt] = h.stage();
    const option = (value: string, name: string, detail: string, checked: boolean): HTMLLabelElement => {
      const label = document.createElement('label');
      label.className = 'res-option';
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = 'res';
      input.value = value;
      input.checked = checked;
      input.addEventListener('change', () => this.set(value));
      // (A tap or a click on one puts the list away; the arrow keys go through it, each choice
      // taken as they come to it, until Escape.)
      label.addEventListener('click', (e) => {
        if (e.detail > 0) this.close(false);
      });
      const nameEl = document.createElement('span');
      nameEl.className = 'res-name';
      nameEl.textContent = name;
      const detailEl = document.createElement('span');
      detailEl.className = 'res-detail';
      detailEl.textContent = detail;
      label.append(input, nameEl, detailEl);
      return label;
    };
    const now = describeRatio(Math.round(h.ratioNow() * 100) / 100, w, hgt, h.most);
    const options = [option('auto', 'Auto', this.choice === 'auto' ? `Now ${now.ratio}, ${now.size}` : `Sharpest at ${TARGET_FPS}+ fps`, this.choice === 'auto')];
    for (const r of fixedRatios(screen)) {
      const d = describeRatio(r, w, hgt, h.most);
      const what = r === own ? ' · the screen’s own' : r > own ? ' · supersampled' : '';
      const choice = choiceFor(r, screen);
      options.push(option(String(choice), `${d.ratio}${what}`, d.size, choice === this.choice));
    }
    this.list.replaceChildren(...options);
    this.menu.hidden = false;
    this.button.setAttribute('aria-expanded', 'true');
    this.list.querySelector<HTMLInputElement>('input:checked')?.focus();
  }

  private close(refocus: boolean): void {
    this.menu.hidden = true;
    this.button.setAttribute('aria-expanded', 'false');
    if (refocus) this.button.focus();
  }

  private set(value: string): void {
    this.choice = parseChoice(value, this.host.screen()) as ResolutionChoice;
    try {
      localStorage.setItem(STORAGE_KEY, String(this.choice));
    } catch {
      // (Not remembered.)
    }
    this.label();
    this.onChange?.(this.ratio);
  }

  private label(): void {
    const r = this.ratio;
    this.button.textContent = `Resolution: ${r === null ? 'Auto' : `${r}×`}`;
  }
}
