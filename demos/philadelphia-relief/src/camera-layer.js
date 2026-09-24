import { WEBCAMS, trafficCameras, regionalCameras, discoveredCameras, cameraMatchesFilter,
  hasCameraPreview, groupCameras, popupPosition }
  from './camera-data.js?v=philly-2026092203';
import { controlBoxes, overlapsBox } from './label-policy.js?v=philly-2026092121';

import { mountCameraMedia, mountCameraPlayer } from './camera-media.js?v=philly-2026092202';

const element = (tag, className, text) => {
  const node = document.createElement(tag); node.className = className;
  if (text) node.textContent = text;
  return node;
};
const external = (text, url, className = '') => {
  const a = element('a', className, text); a.href = url;
  a.target = '_blank'; a.rel = 'noopener noreferrer'; return a;
};

export function createCameraLayer(THREE, { stage, projection, sampleElevation, photographic, motion }) {
  const toggle = document.getElementById('cameraLayerToggle');
  const controls = document.getElementById('cameraLayerOptions');
  const filter = document.getElementById('cameraLayerFilter');
  const jump = document.getElementById('cameraLayerJump');
  const status = document.getElementById('cameraLayerStatus');
  const root = element('div', 'camera-map-layer');
  root.setAttribute('aria-label', 'Cameras on the map'); root.hidden = true; stage.append(root);
  const card = element('section', 'camera-map-card'); card.hidden = true;
  card.setAttribute('aria-label', 'Camera preview'); document.body.append(card);
  const pool = [], projected = new THREE.Vector3();
  let items = [], enabled = false, loaded = false, loading = false, disposed = false, dirty = true;
  let previewItem, minimizedPreview;
  let selected, selectionKey = '', closeTimer, previewTimer, mediaCleanup, request, pinned = false;
  let lastKey = '', lastUpdate = 0, viewWidth = 1, viewHeight = 1, lastDistance = 80000;

  function prepare(list) {
    return list.map(p => ({ ...p, x: projection.lonToX(p.lon), z: projection.latToZ(p.lat),
      elevation: sampleElevation(p.lon, p.lat) }));
  }
  items = prepare(WEBCAMS);
  function populateJump() {
    jump.replaceChildren(element('option', '', 'Find a camera…'));
    jump.firstChild.value = '';
    const choices = items.filter(p => (hasCameraPreview(p) || p.discovered)
      && cameraMatchesFilter(p, filter.value));
    for (const item of choices) {
      const option = element('option', '', `${item.name} · ${item.provider}`);
      option.value = item.id; jump.append(option);
    }
  }
  populateJump();
  function report() {
    const previews = items.filter(hasCameraPreview).length;
    status.textContent = loading ? 'Loading mapped camera locations…'
      : `${items.length} mapped views · ${previews} with preview support. `
        + (loaded ? `${items.filter(p => p.discovered).length} discoveries in purple. `
          + 'Gold/purple pins open their camera; numbers let you choose. Public coverage is incomplete.'
          : 'Some camera sources unavailable; toggle to retry.');
  }
  async function load() {
    if (loaded || loading || disposed) return;
    loading = true; report(); request = new AbortController();
    const timeout = setTimeout(() => request?.abort(), 12000);
    try {
      const sources = [['data/camera-locations.json?v=20260920-2', trafficCameras],
        ['data/regional-cameras.json?v=20260924-2', regionalCameras],
        ['data/discovered-cameras.json?v=20260924-3', discoveredCameras]];
      const results = await Promise.allSettled(sources.map(async ([url, parse]) => {
        const response = await fetch(url, { signal: request.signal });
        if (!response.ok) throw new Error('Camera inventory unavailable');
        return parse(await response.json());
      }));
      if (disposed) return;
      items = prepare([...WEBCAMS, ...results.flatMap(r => r.status === 'fulfilled' ? r.value : [])]);
      loaded = results.every(r => r.status === 'fulfilled'); dirty = true; populateJump();
    } catch { /* Public webcams remain available if the inventory fails. */ }
    finally { clearTimeout(timeout); loading = false; if (!disposed) report(); }
  }
  function clearPreview() {
    clearTimeout(previewTimer); mediaCleanup?.(); mediaCleanup = undefined;
    card.querySelector('iframe')?.remove();
  }
  function close() {
    clearTimeout(closeTimer); clearPreview();
    card.hidden = true; selected = undefined; selectionKey = ''; pinned = false;
    for (const pin of pool) pin.classList.remove('selected');
  }
  function deferClose() {
    clearTimeout(closeTimer);
    closeTimer = setTimeout(() => { if (!pinned) close(); }, 450);
  }
  function hold() { clearTimeout(closeTimer); }
  function placeCard(x, y) {
    const p = popupPosition(x, y, viewWidth, viewHeight, card.offsetWidth, card.offsetHeight);
    card.style.left = `${p.left}px`; card.style.top = `${p.top}px`;
  }
  function flyToGroup(group) {
    const lon = group.items.reduce((sum, p) => sum + p.lon, 0) / group.items.length;
    const lat = group.items.reduce((sum, p) => sum + p.lat, 0) / group.items.length;
    close(); motion.flyTo({ lon, lat, camDist: Math.max(350, lastDistance * .32) },
      { label: 'Camera locations' }); dirty = true;
  }
  function header(title, subtitle) {
    const top = element('div', 'camera-card-head');
    const titleBox = element('div', '');
    titleBox.append(element('small', '', subtitle), element('h3', '', title));
    const button = element('button', 'camera-card-close', '×'); button.type = 'button';
    button.setAttribute('aria-label', 'Close camera preview'); button.onclick = close;
    top.append(titleBox, button); card.append(top);
  }
  function preview(item, anchor) {
    previewItem = item;
    clearPreview(); card.replaceChildren();
    header(item.name, item.discovered ? 'DISCOVERED PUBLIC CAMERA'
      : hasCameraPreview(item) ? 'CAMERA PREVIEW' : 'TRAFFIC CAMERA LOCATION');
    if (hasCameraPreview(item)) {
      const picture = external('', item.url, 'camera-preview-image');
      picture.setAttribute('aria-label', `Open full camera page: ${item.name}`);
      const note = element('p', 'camera-card-note', 'Loading preview…'); note.setAttribute('role', 'status');
      const retry = element('button', 'camera-card-retry', 'Retry preview'); retry.type = 'button';
      const mount = () => {
        clearTimeout(previewTimer); mediaCleanup?.();
        if (card.hidden || selected !== anchor || document.hidden) return;
        mediaCleanup = mountCameraMedia(picture, item, { onStatus: text => { note.textContent = text; } });
      };
      retry.onclick = () => { hold(); pinned = true; mount(); };
      card.append(picture, note, retry); previewTimer = setTimeout(mount, 350);
      if (item.player) {
        const play = element('button', 'camera-card-retry', 'Play provider video here');
        play.type = 'button';
        const playerHost = element('div', 'camera-player-host'); card.insertBefore(playerHost, note);
        play.onclick = () => {
          clearPreview(); hold(); pinned = true;
          picture.hidden = true; retry.hidden = true; play.hidden = true;
          mediaCleanup = mountCameraPlayer(playerHost, item, { onExpired: () => {
            play.hidden = false; play.textContent = 'Watch another minute';
            note.textContent = 'Video paused after one minute to save bandwidth. '
              + 'Play again or open the full camera page.';
            placeCard(anchor.x, anchor.y);
          } });
          note.textContent = 'Provider video · one-minute preview. '
            + 'If unavailable, open the full camera page.';
          placeCard(anchor.x, anchor.y);
        }; card.append(play);
      }
    } else card.append(element('p', 'camera-card-notice',
      item.notice || 'Click this gold pin or the link below to open this specific camera on 511PA. '
      + 'Traffic video plays in the provider’s viewer; availability varies.'));
    card.append(element('p', 'camera-card-location', item.location),
      element('small', 'camera-card-source', `${item.provider} · ${item.id}`));
    if (!item.traffic) card.append(element('small', 'camera-card-source', item.area
      ? 'Pin marks the approximate viewed area, not the camera mount.'
      : 'Pin marks the approximate camera host location.'));
    card.append(external(item.stream ? 'Open large camera viewer ↗'
      : item.traffic ? 'Open this camera on 511PA ↗' : 'Open full camera page ↗',
      item.url, 'camera-card-open'));
    if (item.publisherUrl) card.append(external('Publisher’s current cameras ↗',
      item.publisherUrl, 'camera-card-open'));
    placeCard(anchor.x, anchor.y);
  }
  function show(group, pin) {
    hold();
    const key = group.items.map(p => p.id).join('|');
    if (key === selectionKey && !card.hidden) return;
    close(); motion.pause(); selected = group; selectionKey = key; card.hidden = false;
    pin?.classList.add('selected');
    if (group.items.length === 1) preview(group.items[0], group);
    else {
      previewItem = undefined;
      card.replaceChildren(); header(`${group.items.length} cameras here`,
        group.discovered ? 'DISCOVERED PUBLIC CAMERAS'
          : group.traffic ? 'TRAFFIC CAMERAS' : 'REGIONAL WEBCAMS');
      const list = element('div', 'camera-cluster-list');
      for (const item of group.items) {
        if (item.traffic && !hasCameraPreview(item)) {
          const link = external(`${item.name} ↗`, item.url);
          link.setAttribute('aria-label', `${item.name} · open camera on 511PA in a new tab`);
          list.append(link); continue;
        }
        const button = element('button', '', item.name); button.type = 'button';
        button.onclick = () => {
          hold(); pinned = true; preview(item, group); card.querySelector('button')?.focus();
        }; list.append(button);
      }
      const zoom = element('button', 'camera-card-open', 'Zoom to these cameras'); zoom.type = 'button';
      zoom.onclick = () => flyToGroup(group); card.append(list, zoom); placeCard(group.x, group.y);
    }
  }
  function makePin(index, direct) {
    const pin = direct ? external('', '#', 'camera-map-pin') : element('button', 'camera-map-pin');
    if (!direct) pin.type = 'button';
    const icon = element('span', 'camera-pin-icon'); icon.setAttribute('aria-hidden', 'true');
    const count = element('span', 'camera-pin-count'); pin.append(icon, count);
    pin.addEventListener('pointerenter', e => { if (e.pointerType !== 'touch') show(pin.group, pin); });
    pin.addEventListener('pointerleave', e => { if (e.pointerType !== 'touch') deferClose(); });
    pin.addEventListener('focus', () => show(pin.group, pin));
    pin.addEventListener('blur', e => { if (!card.contains(e.relatedTarget)) deferClose(); });
    pin.addEventListener('click', e => {
      e.stopPropagation();
      if (direct) return; // Preserve native link behavior, including touch and modified clicks.
      // Clicking a marker pins its preview; the image and full-view link are ordinary links.
      show(pin.group, pin); hold(); pinned = true;
      if (e.detail === 0) card.querySelector('button')?.focus();
    });
    root.append(pin); pool[index] = pin; return pin;
  }
  const changed = () => {
    enabled = toggle.checked; controls.hidden = !enabled; root.hidden = !enabled;
    document.body.classList.toggle('camera-layer-enabled', enabled);
    close(); dirty = true; if (enabled) void load();
  };
  toggle.addEventListener('change', changed);
  filter.onchange = () => { close(); populateJump(); dirty = true; };
  jump.onchange = () => {
    const item = items.find(p => p.id === jump.value); if (!item) return;
    close(); motion.flyTo({ lon: item.lon, lat: item.lat, camDist: 5500, camPitch: 48 },
      { label: item.name }); jump.value = ''; dirty = true;
  };
  const escape = e => {
    if (e.key !== 'Escape' || card.hidden) return;
    close(); toggle.focus(); e.stopPropagation();
  };
  const background = e => {
    if (!root.contains(e.target) && !card.contains(e.target)) close();
  };
  const visibility = () => { if (document.hidden) close(); };
  card.addEventListener('map-window-collapse', () => {
    minimizedPreview = { item: previewItem, group: selected };
    clearPreview(); hold(); pinned = true;
  });
  card.addEventListener('map-window-restore', () => {
    const saved = minimizedPreview;
    if (!enabled || !saved?.group) { close(); return; }
    selected = saved.group; card.hidden = false; hold(); pinned = true;
    if (saved.item) preview(saved.item, saved.group);
    else { selectionKey = ''; show(saved.group); pinned = true; }
  });
  card.addEventListener('pointerenter', hold);
  card.addEventListener('pointerleave', e => { if (e.pointerType !== 'touch') deferClose(); });
  card.addEventListener('pointerdown', () => { pinned = true; });
  card.addEventListener('focusin', () => { hold(); pinned = true; });
  card.addEventListener('focusout', e => { if (!card.contains(e.relatedTarget)) deferClose(); });
  document.addEventListener('keydown', escape, true);
  document.addEventListener('pointerdown', background);
  document.addEventListener('visibilitychange', visibility);
  if (toggle.checked) changed();

  return {
    update(camera, ctx) {
      if (!enabled || disposed) return;
      viewWidth = ctx.width; viewHeight = ctx.height; lastDistance = ctx.pose.dist;
      const key = [ctx.pose.lon, ctx.pose.lat, ctx.pose.dist, ctx.pose.pitch, ctx.pose.bearing,
        ctx.pose.fov, ctx.pose.targetAltitude, ctx.width, ctx.height,
        ctx.exaggeration, photographic.active].join(':');
      const time = performance.now();
      if (!dirty && key === lastKey) return;
      if (!dirty && time - lastUpdate < 70) return;
      dirty = false; lastKey = key; lastUpdate = time;
      // A changing view dismisses the hover card so it cannot drift away from its marker.
      close();
      const blocked = controlBoxes();
      const points = [];
      for (const item of items) {
        if (!cameraMatchesFilter(item, filter.value)) continue;
        let point;
        if (photographic.active) point = photographic.projectLocation(item);
        else {
          projected.set(item.x, item.elevation * ctx.exaggeration + 12, item.z).project(camera);
          if (projected.z < -1 || projected.z > 1) continue;
          point = { x: (projected.x * .5 + .5) * ctx.width,
            y: (-projected.y * .5 + .5) * ctx.height };
        }
        if (!point || !Number.isFinite(point.x) || !Number.isFinite(point.y)) continue;
        if (point.x < 24 || point.x > ctx.width - 24 || point.y < 24 || point.y > ctx.height - 24) continue;
        const box = { l: point.x - 18, r: point.x + 18, t: point.y - 18, b: point.y + 18 };
        if (blocked.some(b => overlapsBox(b, box, 5))) continue;
        points.push({ ...point, item });
      }
      const groups = groupCameras(points, ctx.width < 600 ? 46 : 40);
      groups.forEach((group, i) => {
        const direct = (group.traffic || group.discovered) && group.items.length === 1;
        if (pool[i] && (pool[i].tagName === 'A') !== direct) {
          pool[i].remove(); pool[i] = undefined;
        }
        const pin = pool[i] || makePin(i, direct); pin.group = group; pin.hidden = false;
        if (direct) pin.href = group.items[0].url;
        pin.classList.toggle('traffic', group.traffic);
        pin.classList.toggle('discovered', group.discovered);
        pin.classList.toggle('cluster', group.items.length > 1);
        pin.querySelector('.camera-pin-count').textContent = group.items.length > 1
          ? group.items.length : '';
        pin.setAttribute('aria-label', (group.discovered ? 'Discovered public camera · ' : '')
          + (group.items.length > 1 ? `${group.items.length} cameras: `
          + group.items.slice(0, 2).map(p => p.name).join(', ') : `Camera: ${group.items[0].name}`
          + (direct ? ' · open camera in a new tab' : '')));
        pin.style.left = `${Math.round(group.x)}px`; pin.style.top = `${Math.round(group.y)}px`;
      });
      for (let i = groups.length; i < pool.length; i++) pool[i].hidden = true;
    },
    dispose() {
      disposed = true; close(); request?.abort(); root.remove(); card.remove();
      document.body.classList.remove('camera-layer-enabled');
      toggle.removeEventListener('change', changed);
      document.removeEventListener('keydown', escape, true);
      document.removeEventListener('pointerdown', background);
      document.removeEventListener('visibilitychange', visibility);
    },
  };
}
