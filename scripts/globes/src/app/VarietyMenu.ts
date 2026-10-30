// The betta's variety (fish/varieties.mjs): the fish's name among its controls is a button, "Living
// Silk · Koi Marble", and under it a short list to choose from, each with a swatch of its body and its
// fins; remembered on this device. A tap on one shows it and puts the list away; the arrow keys go
// through them, each shown as they come to it, until Escape or a press anywhere else.

import { keepVariety, keptVariety, VARIETIES, varietyOf } from '../fish/varieties.mjs';

export class VarietyMenu {
  variety: string;
  /** Called with the variety's id whenever the choice changes. */
  onChange: ((variety: string) => void) | null = null;
  private readonly button: HTMLButtonElement;
  private readonly name: HTMLElement;
  private readonly menu: HTMLElement;

  /** controls: the fish's controls (the button takes the name's place, first among them). */
  constructor(controls: HTMLElement) {
    this.variety = keptVariety(() => localStorage);

    const button = (this.button = document.createElement('button'));
    button.type = 'button';
    button.className = 'variety-button';
    button.setAttribute('aria-haspopup', 'dialog');
    button.setAttribute('aria-expanded', 'false');
    button.title = 'Choose the fish’s colours';
    button.innerHTML = 'Living Silk · <span class="variety-name"></span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';
    this.name = button.querySelector('.variety-name')!;
    button.addEventListener('click', () => this.toggle());
    controls.prepend(button);

    const menu = (this.menu = document.createElement('div'));
    menu.className = 'variety-menu';
    menu.setAttribute('role', 'dialog');
    menu.setAttribute('aria-label', 'Variety');
    menu.hidden = true;
    const list = document.createElement('div');
    list.className = 'variety-list';
    list.setAttribute('role', 'radiogroup');
    list.setAttribute('aria-label', 'Variety');
    for (const v of VARIETIES) {
      const label = document.createElement('label');
      label.className = 'variety-option';
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = 'variety';
      input.value = v.id;
      input.addEventListener('change', () => this.set(v.id));
      // (A tap or a click on one puts the list away; the arrow keys go through it, each choice
      // shown as they come to it, until Escape.)
      label.addEventListener('click', (e) => {
        if (e.detail > 0) this.close(false);
      });
      const swatch = document.createElement('span');
      swatch.className = 'variety-swatch';
      swatch.style.setProperty('--body', v.swatch[0]);
      swatch.style.setProperty('--fins', v.swatch[1]);
      const name = document.createElement('span');
      name.textContent = v.name;
      label.append(input, swatch, name);
      list.append(label);
    }
    menu.append(list);
    controls.append(menu);
    // (Put away by a press anywhere else, or Escape: that Escape only, not Follow's nor Learn's card's
    // too, so a fish being followed stays followed as its varieties are tried.)
    document.addEventListener('pointerdown', (e) => {
      if (!menu.hidden && !menu.contains(e.target as Node) && !button.contains(e.target as Node)) this.close(false);
    });
    window.addEventListener(
      'keydown',
      (e) => {
        if (e.key !== 'Escape' || menu.hidden) return;
        e.stopPropagation();
        this.close(true);
      },
      true,
    );
    this.label();
  }

  private toggle(): void {
    if (this.menu.hidden) this.open();
    else this.close(false);
  }

  private open(): void {
    for (const input of this.menu.querySelectorAll<HTMLInputElement>('input')) input.checked = input.value === this.variety;
    this.menu.hidden = false;
    this.button.setAttribute('aria-expanded', 'true');
    this.menu.querySelector<HTMLInputElement>('input:checked')?.focus();
  }

  private close(refocus: boolean): void {
    this.menu.hidden = true;
    this.button.setAttribute('aria-expanded', 'false');
    if (refocus) this.button.focus();
  }

  private set(variety: string): void {
    this.variety = variety;
    keepVariety(() => localStorage, variety);
    this.label();
    this.onChange?.(variety);
  }

  private label(): void {
    const name = varietyOf(this.variety).name;
    this.name.textContent = name;
    this.button.setAttribute('aria-label', `Living Silk, ${name}: choose the variety`);
  }
}
