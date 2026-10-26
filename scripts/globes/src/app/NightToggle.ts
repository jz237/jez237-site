// The betta bowl's Night button (night.mjs): a pill in the page's link bar, a moon and "Night", pressed
// while the room is dark and the lamp in its moonlight mode; remembered on this device.

import { keepNight } from './night.mjs';

export class NightToggle {
  on: boolean;
  /** Called with night (true) or day (false) as it is pressed. */
  onChange: ((on: boolean) => void) | null = null;
  private readonly button: HTMLButtonElement;

  /** bar: the page's link bar (it goes at its end); on: night already (kept from the last visit). */
  constructor(bar: HTMLElement, on: boolean) {
    this.on = on;
    const button = (this.button = document.createElement('button'));
    button.type = 'button';
    button.className = 'night-button';
    button.title = 'Turn the room’s lights off: the lamp’s blue night light, the fish asleep';
    button.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 14.3A8.6 8.6 0 0 1 9.7 3.5a8.6 8.6 0 1 0 10.8 10.8z"/></svg>Night';
    button.setAttribute('aria-pressed', String(on));
    button.addEventListener('click', () => this.set(!this.on));
    bar.append(button);
  }

  private set(on: boolean): void {
    this.on = on;
    this.button.setAttribute('aria-pressed', String(on));
    keepNight(() => localStorage, on);
    this.onChange?.(on);
  }
}
