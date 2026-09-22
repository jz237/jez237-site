import { exhibitBounds } from './explore-math.js?v=philly-2026092121';
import { createExhibit } from './exhibit.js?v=philly-2026092121';
import { detailedLandmarks, DETAIL_NOTES } from './landmark-detail.js?v=philly-2026092121';
import { buildLandmarkModels } from './landmark-models.js?v=philly-2026092121';

const el = (tag, text) => { const node = document.createElement(tag); node.textContent = text; return node; };
export function createExploreModes(THREE, options) {
  const { stage, projection, sampleElevation, photographic, store, motion,
    structures, landmarks, models, stopAircraft, invalidate } = options;
  const exhibit = createExhibit(THREE, options);
  const bar = el('section', ''); bar.className = 'explore-mode-bar'; bar.hidden = true;
  bar.setAttribute('aria-label', 'Exhibit controls');
  const title = el('strong', ''), note = el('p', ''), controls = el('div', '');
  const exit = el('button', 'Return to map'); exit.type = 'button'; exit.onclick = () => leave(true);
  bar.append(title, note, controls, exit); document.body.append(bar);
  let mode = null, saved = null, bounds = null, location = null;
  let exhibitSize = 1500, disposed = false;
  const status = document.getElementById('exploreStatus');
  function button(text, action) {
    const node = el('button', text); node.type = 'button'; node.onclick = action; controls.append(node);
    return node;
  }
  function leave(restore = false) {
    const previous = saved; saved = null;
    mode = null; bounds = null; location = null;
    exhibit.clear(); structures?.setDetailedLandmarks(null);
    document.body.classList.remove('explore-exhibit');
    bar.hidden = true;
    if (previous) {
      const { camLon, camLat, camDist, camBearing, camPitch, ...settings } = previous;
      store.set(settings, { source: 'explore' });
      if (restore) store.set({ camLon, camLat, camDist, camBearing, camPitch }, { source: 'explore' });
    }
    invalidate();
  }
  function begin(next) {
    leave(true); stopAircraft(); motion.stop();
    const s = store.get();
    saved = { camLon: s.camLon, camLat: s.camLat, camDist: s.camDist, camBearing: s.camBearing,
      camPitch: s.camPitch, photoMode: s.photoMode, exaggeration: s.exaggeration,
      structureHeight: s.structureHeight, era: s.era, compareMode: s.compareMode,
      layers: { structures: s.layers.structures, terrain: s.layers.terrain } };
    mode = next; bar.hidden = false; controls.replaceChildren();
    document.getElementById('mapControls').removeAttribute('open');
    store.set({ era: 'present', compareMode: 'off', exaggeration: 1, structureHeight: 1,
      layers: { terrain: true } }, { source: 'explore' });
    invalidate();
  }
  function resizeExhibit() {
    bounds = exhibitBounds(location.lon, location.lat, exhibitSize, projection); exhibit.set(bounds);
    store.set({ camLon: location.lon, camLat: location.lat, camDist: exhibitSize * 1.65
      * Math.max(1, stage.clientHeight / Math.max(1, stage.clientWidth)),
      camPitch: 55, camBearing: 25 }, { source: 'explore' });
    invalidate();
  }
  function open(kind) {
    if (disposed || !['exhibit', 'model'].includes(kind)) return;
    const id = document.getElementById('modelPlace').value;
    const model = models?.models.find(m => m.id === id);
    const name = kind === 'model' ? model?.landmark : document.getElementById('exhibitPlace').value;
    const place = landmarks?.landmarks.find(p => p.n === name);
    if (name !== 'current' && !place) {
      status.textContent = 'This place is not available in the map data.'; return;
    }
    begin(kind);
    const s = store.get(); location = place ? { lon: place.lon, lat: place.lat }
      : { lon: s.camLon, lat: s.camLat };
    exhibitSize = kind === 'model' ? DETAIL_NOTES[id].size : name === 'current' ? 1500
      : name === 'Philadelphia City Hall' ? 2400 : 1000;
    title.textContent = `${kind === 'model' ? 'ARCHITECTURAL STUDY' : 'NEIGHBORHOOD EXHIBIT'} · `
      + (place?.n || 'Current map center');
    note.textContent = kind === 'model' ? DETAIL_NOTES[id].text
      : 'Real mapped terrain and imagery. Decorative cutaway base. Right-drag to orbit; scroll to zoom.';
    if (kind === 'model') {
      const anchors = new Map(landmarks.landmarks.map(p => [p.n, p]));
      const packed = buildLandmarkModels(detailedLandmarks(models, id), { anchors,
        toWorld: (lon, lat) => [projection.lonToX(lon), projection.latToZ(lat)],
        groundAt: (x, z) => sampleElevation(projection.xToLon(x), projection.zToLat(z)) });
      structures?.setDetailedLandmarks(packed, id);
      store.set({ photoMode: 'relief', layers: { structures: true } }, { source: 'explore' });
      const source = el('a', 'Architectural reference ↗'); source.href = DETAIL_NOTES[id].url;
      source.target = '_blank'; source.rel = 'noopener noreferrer'; controls.append(source);
    } else {
      button('Smaller area', () => { exhibitSize = Math.max(400, exhibitSize / 1.5); resizeExhibit(); });
      button('Larger area', () => { exhibitSize = Math.min(5000, exhibitSize * 1.5); resizeExhibit(); });
    }
    button('Rotate left', () => store.set({ camBearing: store.value('camBearing') - 30 },
      { source: 'explore' }));
    button('Rotate right', () => store.set({ camBearing: store.value('camBearing') + 30 },
      { source: 'explore' }));
    button('Reset exhibit', resizeExhibit);
    document.body.classList.add('explore-exhibit'); resizeExhibit(); exit.focus({ preventScroll: true });
  }
  const key = event => {
    if (!mode || event.target.matches('input,select,textarea')) return;
    if (event.key === 'Escape') { leave(true); return; }
  };
  const unsubscribe = store.subscribe((s, changed) => {
    if (mode && s.lastChangeSource !== 'explore'
      && (s.lastChangeSource === 'aircraft-follow' || s.lastChangeSource !== 'user'
        && [...changed].some(k => k.startsWith('cam')))) leave(false);
  });
  document.addEventListener('keydown', key, true);
  return { open, close: () => leave(true), get bounds() { return bounds; },
    update(camera, exaggeration) {
      if (!bounds) return;
      if (!photographic.exhibitSupported && store.value('photoMode') !== 'relief') {
        store.set({ photoMode: 'relief' }, { source: 'explore' });
        note.textContent = 'This device uses the relief exhibit; full aerial detail remains available.';
      }
      exhibit.update(camera, exaggeration);
    },
    dispose() {
      disposed = true; leave(); unsubscribe(); exhibit.dispose(); bar.remove();
      document.removeEventListener('keydown', key, true);
    },
  };
}
