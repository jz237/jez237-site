// The betta bowl's Follow button (follow.mjs): a pill in the page's link bar, a sighting ring and
// "Follow", pressed while the camera is drawn in close on the fish and kept on it. (Not kept from one
// visit to the next: a page opens on the whole bowl.) Escape lets the fish go too.

export class FollowToggle {
  on = false;
  /** Called with following (true) or not as it is pressed. */
  onChange: ((on: boolean) => void) | null = null;
  private readonly button: HTMLButtonElement;

  /** bar: the page's link bar (it goes at its end). */
  constructor(bar: HTMLElement) {
    const button = (this.button = document.createElement('button'));
    button.type = 'button';
    button.className = 'follow-button';
    button.title = 'Zoom in close on the fish and follow it as it swims';
    button.setAttribute('aria-label', 'Follow the fish');
    button.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="6.5"/><circle cx="12" cy="12" r="1.6"/><path d="M12 2.5v3.2M12 18.3v3.2M2.5 12h3.2M18.3 12h3.2"/></svg><span class="pill-text">Follow</span>';
    button.setAttribute('aria-pressed', 'false');
    button.addEventListener('click', () => this.set(!this.on));
    bar.append(button);
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.on) this.set(false);
    });
  }

  set(on: boolean): void {
    if (on === this.on) return;
    this.on = on;
    this.button.setAttribute('aria-pressed', String(on));
    this.onChange?.(on);
  }
}
