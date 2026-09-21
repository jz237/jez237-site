import { WEBCAMS } from './camera-data.js?v=philly-2026092121';
import { mountCameraMedia } from './camera-media.js?v=philly-2026092121';

/** Use the provider's published preview widget; full video stays on its source page. */
export function createAirportCamera() {
  const airport = WEBCAMS.find(p => p.id === 'philadelphia-international-airport-camera');
  const dialog = document.createElement('dialog'); dialog.className = 'airport-camera-dialog';
  dialog.setAttribute('aria-labelledby', 'airportCameraTitle');
  const heading = document.createElement('h2'); heading.id = 'airportCameraTitle';
  heading.textContent = 'PHL · Airport camera';
  const note = document.createElement('p');
  note.textContent = 'Real ground camera · FOX 29 / WMVision. The camera may pan; '
    + 'landings depend on its current view. It is not onboard or synchronized with a selected flight.';
  const preview = document.createElement('div'); preview.className = 'camera-preview-image';
  const status = document.createElement('p'); status.className = 'camera-card-note';
  status.setAttribute('role', 'status');
  const link = document.createElement('a'); link.className = 'camera-card-open';
  link.textContent = 'Open full airport video ↗'; link.href = airport.url;
  link.target = '_blank'; link.rel = 'noopener noreferrer';
  const retry = document.createElement('button'); retry.className = 'camera-card-retry';
  retry.textContent = 'Reload preview'; retry.type = 'button';
  const close = document.createElement('button'); close.className = 'camera-card-retry';
  close.textContent = 'Back to map'; close.type = 'button'; close.autofocus = true;
  let cleanup, timer;
  function stop() { cleanup?.(); cleanup = undefined; clearTimeout(timer); }
  function start() {
    stop(); if (!dialog.open || document.hidden) return;
    cleanup = mountCameraMedia(preview, airport, {
      onStatus: text => { status.textContent = text; },
    });
    timer = setTimeout(() => {
      stop(); status.textContent = 'Preview paused. Reload to watch again.';
    }, 60000);
  }
  retry.onclick = start; close.onclick = () => dialog.close();
  dialog.addEventListener('close', stop);
  const visibility = () => {
    if (document.hidden) { stop(); status.textContent = 'Preview paused while away. Reload to reconnect.'; }
  };
  document.addEventListener('visibilitychange', visibility);
  dialog.append(heading, note, preview, status, retry, close, link); document.body.append(dialog);
  const button = document.getElementById('airportCamera');
  function open() { if (!dialog.open) dialog.showModal(); start(); }
  button.onclick = open;
  return { open, dispose() {
    stop(); dialog.remove(); button.onclick = null;
    document.removeEventListener('visibilitychange', visibility);
  } };
}
