import { exhibitBounds } from './explore-math.js?v=philly-2026092121';
import { createExhibit } from './exhibit.js?v=philly-2026092121';
import { detailedLandmarks, DETAIL_NOTES } from './landmark-detail.js?v=philly-2026092121';
import { buildLandmarkModels } from './landmark-models.js?v=philly-2026092121';

const el = (tag, text) => { const node = document.createElement(tag); node.textContent = text; return node; };
export function createExploreModes(THREE, options) {
  const { stage, scene, sky, projection, sampleElevation, photographic, store, motion,
    rig, structures, landmarks, models, stopAircraft, invalidate, getExaggeration } = options;
  const exhibit = createExhibit(THREE, options);
  const bar = el('section', ''); bar.className = 'explore-mode-bar'; bar.hidden = true;
  bar.setAttribute('aria-label', 'Viewpoint and exhibit controls');
  const title = el('strong', ''), note = el('p', ''), controls = el('div', '');
  const exit = el('button', 'Return to map'); exit.type = 'button'; exit.onclick = () => leave(true);
  bar.append(title, note, controls, exit); document.body.append(bar);
  let mode = null, saved = null, view = null, pickStart = null, bounds = null, location = null;
  let input = null, exhibitSize = 1500, disposed = false;
  const status = document.getElementById('exploreStatus');
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), plane = new THREE.Plane();
  const hit = new THREE.Vector3(); plane.normal.set(0, 1, 0);

  function button(text, action) {
    const node = el('button', text); node.type = 'button'; node.onclick = action; controls.append(node);
    return node;
  }
  function leave(restore = false) {
    const previous = saved; saved = null;
    mode = null; view = null; bounds = null; input = null; pickStart = null; location = null;
    exhibit.clear(); structures?.setDetailedLandmarks(null);
    document.body.classList.remove('explore-picking', 'explore-standing', 'explore-exhibit');
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
  function look(heading, pitch = 0) {
    if (!view) return;
    view = { ...view, heading: (view.heading + heading + 360) % 360,
      pitch: Math.max(-75, Math.min(75, view.pitch + pitch)) };
    invalidate();
  }
  function choosePoint(point) {
    location = point;
    view = { ...point, height: point.height + 2, clearance: 1.7, heading: rig.pose().bearing,
      pitch: -3, mode: 'standing' };
    mode = 'standing'; document.body.classList.remove('explore-picking');
    document.body.classList.add('explore-standing');
    title.textContent = 'STAND HERE · SIMULATED 3D';
    note.textContent = 'Drag to look around. Captured geometry, not Street View. Heights may be approximate.';
    controls.replaceChildren();
    const height = el('select', ''); height.setAttribute('aria-label', 'Viewpoint height');
    for (const [value, text] of [['surface', 'Selected surface + 2 m'],
      ['15', 'Selected surface + 15 m'], ['40', 'Selected surface + 40 m']]) {
      const option = el('option', text); option.value = value; height.append(option);
    }
    height.onchange = () => {
      view = { ...view, height: location.height + (height.value === 'surface' ? 2 : Number(height.value)) };
      invalidate();
    };
    controls.append(height);
    button('Look left', () => look(-20)); button('Look right', () => look(20));
    button('Look up', () => look(0, 10)); button('Look down', () => look(0, -10));
    button('Choose another point', () => { leave(true); open('stand'); });
    store.set({ camLon: point.lon, camLat: point.lat, camDist: 1000 }, { source: 'explore' });
    exit.focus({ preventScroll: true }); invalidate();
  }
  function pick(event) {
    const rect = stage.getBoundingClientRect();
    const x = event.clientX - rect.left, y = event.clientY - rect.top;
    if (photographic.active) return photographic.pickLocation(x, y);
    ndc.set(x / rect.width * 2 - 1, -y / rect.height * 2 + 1); ray.setFromCamera(ndc, rig.camera);
    let ground = 0;
    for (let i = 0; i < 6; i++) {
      plane.constant = -ground;
      if (!ray.ray.intersectPlane(plane, hit)) return null;
      ground = sampleElevation(projection.xToLon(hit.x), projection.zToLat(hit.z)) * getExaggeration();
    }
    const point = { lon: projection.xToLon(hit.x), lat: projection.zToLat(hit.z) };
    if (!projection.contains(point.lon, point.lat)) return null;
    const building = store.get().layers.structures ? structures?.pickBuildingAt(hit.x, hit.z, 0) : null;
    return { ...point, height: sampleElevation(point.lon, point.lat) + (building?.height || 0) };
  }
  function resizeExhibit() {
    bounds = exhibitBounds(location.lon, location.lat, exhibitSize, projection); exhibit.set(bounds);
    store.set({ camLon: location.lon, camLat: location.lat, camDist: exhibitSize * 1.65
      * Math.max(1, stage.clientHeight / Math.max(1, stage.clientWidth)),
      camPitch: 55, camBearing: 25 }, { source: 'explore' });
    invalidate();
  }
  function open(kind) {
    if (disposed) return;
    if (kind === 'stand') {
      begin('picking'); title.textContent = 'CHOOSE YOUR VIEWPOINT';
      note.textContent = 'Tap a street, bridge or roof. Zoom in first for the most precise placement.';
      document.body.classList.add('explore-picking');
      button('Use map center', () => {
        const rect = stage.getBoundingClientRect();
        const surface = photographic.active && photographic.pickLocation(rect.width / 2, rect.height / 2);
        if (surface) { choosePoint(surface); return; }
        const s = store.get(); choosePoint({ lon: s.camLon, lat: s.camLat,
          height: sampleElevation(s.camLon, s.camLat) + (structures?.pickBuildingAt(
            projection.lonToX(s.camLon), projection.latToZ(s.camLat), 0)?.height || 0) });
      });
      return;
    }
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
  const down = event => {
    if (!['picking', 'standing'].includes(mode) || event.button !== 0) return;
    event.stopImmediatePropagation(); event.preventDefault();
    if (mode === 'picking') pickStart = { x: event.clientX, y: event.clientY };
    else {
      input = { x: event.clientX, y: event.clientY, id: event.pointerId }; stage.setPointerCapture(input.id);
    }
  };
  const move = event => {
    if (!input || event.pointerId !== input.id) return;
    event.stopImmediatePropagation(); look((input.x - event.clientX) * .2, (event.clientY - input.y) * .2);
    input.x = event.clientX; input.y = event.clientY;
  };
  const up = event => {
    if (!['picking', 'standing'].includes(mode)) return;
    event.stopImmediatePropagation();
    if (input) { stage.releasePointerCapture?.(input.id); input = null; }
    const start = pickStart; pickStart = null;
    if (!start || Math.hypot(event.clientX - start.x, event.clientY - start.y) > 5) return;
    const point = pick(event);
    if (point) choosePoint(point); else note.textContent = 'No mapped surface here yet. Try a loaded area.';
  };
  const wheel = event => {
    if (mode !== 'standing') return;
    event.preventDefault(); event.stopImmediatePropagation(); look(0, event.deltaY > 0 ? -3 : 3);
  };
  const key = event => {
    if (!mode || event.target.matches('input,select,textarea')) return;
    if (event.key === 'Escape') { leave(true); return; }
    if (mode !== 'standing' || !event.key.startsWith('Arrow')) return;
    event.stopImmediatePropagation(); event.preventDefault();
    look(event.key === 'ArrowLeft' ? -10 : event.key === 'ArrowRight' ? 10 : 0,
      event.key === 'ArrowUp' ? 5 : event.key === 'ArrowDown' ? -5 : 0);
  };
  const unsubscribe = store.subscribe((s, changed) => {
    if (mode && s.lastChangeSource !== 'explore'
      && (s.lastChangeSource === 'aircraft-follow' || s.lastChangeSource !== 'user'
        && [...changed].some(k => k.startsWith('cam')))) leave(false);
  });
  stage.addEventListener('pointerdown', down, true); stage.addEventListener('pointermove', move, true);
  stage.addEventListener('pointerup', up, true); stage.addEventListener('pointercancel', up, true);
  stage.addEventListener('wheel', wheel, { capture: true, passive: false });
  document.addEventListener('keydown', key, true);
  return { open, close: () => leave(true), get view() { return view; }, get bounds() { return bounds; },
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
      stage.removeEventListener('pointerdown', down, true);
      stage.removeEventListener('pointermove', move, true);
      stage.removeEventListener('pointerup', up, true); stage.removeEventListener('pointercancel', up, true);
      stage.removeEventListener('wheel', wheel, true); document.removeEventListener('keydown', key, true);
    },
  };
}
