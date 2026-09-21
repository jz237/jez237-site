import { ageSeconds, flightMatches, flightPosition, appendFlightSample, flightDisplayHeight,
  STALE_AFTER, EXPIRE_AFTER, inFlightBounds } from './aircraft-data.js?v=philly-2026092101';
import { aircraftGeometry } from './aircraft-model.js?v=philly-2026092101';
import { controlBoxes, overlapsBox } from './label-policy.js?v=philly-2026092101';

const el = (tag, cls, text) => {
  const node = document.createElement(tag); node.className = cls;
  if (text) node.textContent = text;
  return node;
};
const name = a => a.callsign || a.registration || a.id.toUpperCase();
const number = n => n === null ? 'Not reported' : Math.round(n).toLocaleString('en-US');

export function createAircraftLayer(THREE, { stage, scene, projection, sampleElevation,
  photographic, store, motion }) {
  const toggle = document.getElementById('aircraftToggle');
  const options = document.getElementById('aircraftOptions');
  const status = document.getElementById('aircraftStatus');
  const filter = document.getElementById('aircraftFilter');
  const jump = document.getElementById('aircraftJump');
  const trailToggle = document.getElementById('aircraftTrails');
  const back = document.getElementById('aircraftReturn');
  const retry = document.getElementById('aircraftRetry');
  const root = el('div', 'aircraft-map-layer'); root.hidden = true;
  root.setAttribute('aria-label', 'Aircraft over the region'); stage.append(root);
  const card = el('section', 'aircraft-card'); card.hidden = true;
  card.setAttribute('aria-label', 'Aircraft details'); document.body.append(card);
  const group = new THREE.Group(); group.visible = false; scene.add(group);
  const data = aircraftGeometry(), geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(data.positions, 3));
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(data.normals, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(data.colors, 3));
  // The relief scene uses shader lighting, so these small symbols provide their own readable color.
  const material = new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.DoubleSide });
  const lineMaterial = new THREE.LineBasicMaterial({ color: 0x73e2ec, transparent: true, opacity: .65 });
  const records = new Map(), vector = new THREE.Vector3();
  let enabled = false, disposed = false, controller, timer, generation = 0, loading = false;
  let selected = null, following = null, returnPose, failed = false, lastPoll = 0, lastDraw = 0;
  let lastReport = 0, lastFollow = 0, viewWidth = 1, viewHeight = 1, cesiumViewer, datasource;
  let closeTimer, pinned = false, playbackAt = Date.now();
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function stopFollow(restore = false) {
    following = null; back.hidden = true;
    if (restore && returnPose) motion.flyTo(returnPose, { label: 'Previous map view' });
    returnPose = null;
  }
  function remove(record) {
    record.pin.remove(); group.remove(record.mesh, record.line); record.line.geometry.dispose();
    if (record.entity && datasource) datasource.entities.remove(record.entity);
    records.delete(record.data.id);
    if (selected === record.data.id) { selected = null; card.hidden = true; }
    if (following === record.data.id) stopFollow();
  }
  function visibleRecords() {
    return [...records.values()].filter(r => flightMatches(r.data, filter.value)
      && ageSeconds(r.data) < EXPIRE_AFTER);
  }
  function report() {
    const rows = visibleRecords(), fresh = rows.filter(r => ageSeconds(r.data) <= STALE_AFTER).length;
    const age = lastPoll ? Math.round((Date.now() - lastPoll) / 1000) : 0;
    status.textContent = loading && !lastPoll ? 'Finding aircraft over the Delaware Valley…'
      : failed ? `Feed unavailable · ${rows.length} last-known aircraft. Retrying shortly.`
      : `${rows.length} aircraft · ${fresh} recent · checked ${age}s ago`;
    retry.hidden = !failed;
  }
  function populate() {
    const selectedValue = jump.value;
    jump.replaceChildren(el('option', '', 'Choose an aircraft…')); jump.firstChild.value = '';
    for (const r of visibleRecords().sort((a, b) => name(a.data).localeCompare(name(b.data)))) {
      const option = el('option', '', `${name(r.data)} · ${number(r.data.altitudeFt)} ft`);
      option.value = r.data.id; jump.append(option);
    }
    jump.value = selectedValue;
  }
  async function poll() {
    if (!enabled || disposed || document.hidden || loading) return;
    const ticket = generation; loading = true; report();
    const request = new AbortController(); controller = request;
    const timeout = setTimeout(() => request.abort(), 12000);
    try {
      const response = await fetch('aircraft', { signal: request.signal });
      if (!response.ok) throw new Error('Feed unavailable');
      const doc = await response.json();
      if (!Array.isArray(doc.aircraft) || !Number.isFinite(doc.timestamp)) throw new Error('Invalid feed');
      if (ticket !== generation || disposed || !enabled) return;
      if (Date.now() - doc.timestamp > 120000) throw new Error('Old feed');
      for (const a of doc.aircraft.slice(0, 300)) {
        if (!inFlightBounds(a) || !/^[a-f0-9]{6}$/.test(a.id) || !Number.isFinite(a.height)
          || !Number.isFinite(a.observedAt) || ageSeconds(a) >= EXPIRE_AFTER) continue;
        let record = records.get(a.id);
        if (!record) { record = makeRecord(a); records.set(a.id, record); }
        if (a.observedAt >= record.data.observedAt) {
          record.data = a; appendFlightSample(record.samples, a);
        }
      }
      failed = false; lastPoll = Date.now(); populate();
    } catch { if (ticket === generation && enabled && !document.hidden) failed = true; }
    finally {
      clearTimeout(timeout);
      if (ticket === generation) {
        loading = false; report();
        if (enabled && !disposed && !document.hidden) timer = setTimeout(poll, failed ? 30000 : 15000);
      }
    }
  }
  function close() { clearTimeout(closeTimer); selected = null; card.hidden = true; pinned = false; }
  function deferClose() { closeTimer = setTimeout(() => { if (!pinned && !following) close(); }, 350); }
  function hold() { clearTimeout(closeTimer); }
  function follow(id) {
    const r = records.get(id); if (!r || ageSeconds(r.data) > STALE_AFTER) return;
    if (!following) {
      const s = store.get();
      returnPose = { lon: s.camLon, lat: s.camLat, camDist: s.camDist,
        camBearing: s.camBearing, camPitch: s.camPitch };
    }
    motion.stop(); following = id; back.hidden = false; pinned = true; show(id);
    store.set({ camDist: 4500, camPitch: 55 }, { source: 'aircraft-follow' });
  }
  function show(id) {
    const r = records.get(id); if (!r) return;
    hold(); selected = id; card.hidden = false; card.replaceChildren();
    const header = el('div', 'aircraft-card-head');
    const title = el('div', ''); title.append(el('small', '', 'AIRCRAFT / DELAWARE VALLEY'),
      el('h3', '', name(r.data)));
    const x = el('button', '', '×'); x.type = 'button';
    x.setAttribute('aria-label', 'Close aircraft details');
    x.onclick = close; header.append(title, x); card.append(header);
    card.append(el('p', 'aircraft-identity',
      `${r.data.type || 'Type unknown'} · ${r.data.registration || 'Registration unavailable'}`));
    const facts = el('dl', 'aircraft-facts');
    for (const [label, value] of [['Reported altitude', `${number(r.data.altitudeFt)} ft`],
      ['Ground speed', r.data.speed === null ? 'Not reported' : `${number(r.data.speed)} kt`],
      ['Track', r.data.track === null ? 'Not reported' : `${number(r.data.track)}°`],
      ['Climb / descent', r.data.verticalRate === null
        ? 'Not reported' : `${number(r.data.verticalRate)} ft/min`]]) {
      const row = el('div', ''); row.append(el('dt', '', label), el('dd', '', value)); facts.append(row);
    }
    card.append(facts, el('p', 'aircraft-age', ''));
    const button = el('button', 'aircraft-follow',
      following === id ? 'Following this aircraft' : 'Follow aircraft');
    button.type = 'button'; button.disabled = following === id || ageSeconds(r.data) > STALE_AFTER;
    button.onclick = () => follow(id); card.append(button);
    card.append(el('small', 'aircraft-disclosure',
      `${r.data.altitudeKind} altitude · `
      + `${r.data.geometric ? 'geometric' : 'barometric estimate for'} 3D height. `
      + 'Generic model, enlarged for visibility. Diorama height adjusted above exaggerated terrain.'));
    card.append(el('small', 'aircraft-disclosure',
      'Motion buffered ~20 seconds. Trails show reports collected while this layer is on.'));
    updateCard();
  }
  function updateCard() {
    const r = records.get(selected); if (!r || card.hidden) return;
    const age = Math.round(ageSeconds(r.data));
    card.querySelector('.aircraft-age').textContent = age > STALE_AFTER
      ? `Stale position · received ${age}s ago; movement paused`
      : `Position received ${age}s ago · ADSB.lol`;
    card.querySelector('.aircraft-follow').disabled = following === selected || age > STALE_AFTER;
    card.style.left = `${Math.max(10, Math.min(viewWidth - card.offsetWidth - 10, 24))}px`;
    card.style.top = `${Math.max(10, Math.min(viewHeight - card.offsetHeight - 90, 190))}px`;
  }
  function makeRecord(a) {
    const mesh = new THREE.Mesh(geometry, material);
    const trailGeometry = new THREE.BufferGeometry();
    trailGeometry.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(192), 3));
    trailGeometry.setDrawRange(0, 0);
    const line = new THREE.Line(trailGeometry, lineMaterial); line.frustumCulled = false;
    group.add(mesh, line);
    const pin = el('button', 'aircraft-pin'); pin.type = 'button';
    pin.append(el('span', '', name(a))); root.append(pin);
    pin.onpointerenter = e => { if (e.pointerType !== 'touch') show(a.id); };
    pin.onpointerleave = deferClose; pin.onfocus = () => show(a.id);
    pin.onclick = e => { e.stopPropagation(); pinned = true; show(a.id); };
    return { data: a, samples: [], mesh, line, pin, entity: null };
  }
  function syncCesium() {
    const viewer = photographic.aircraftViewer;
    if (viewer === cesiumViewer) return;
    cesiumViewer = viewer; datasource = null;
    for (const r of records.values()) r.entity = null;
    if (viewer) {
      datasource = new window.Cesium.CustomDataSource('Regional aircraft');
      void viewer.dataSources.add(datasource);
    }
  }
  const changed = () => {
    enabled = toggle.checked; options.hidden = !enabled; root.hidden = !enabled; group.visible = enabled;
    document.body.classList.toggle('aircraft-layer-enabled', enabled);
    generation++; clearTimeout(timer); controller?.abort(); loading = false; close();
    if (enabled) void poll();
    else { stopFollow(true); for (const r of [...records.values()]) remove(r); lastPoll = 0; }
    if (datasource) datasource.show = enabled;
  };
  const visibility = () => {
    generation++; controller?.abort(); clearTimeout(timer); loading = false;
    if (!document.hidden && enabled) void poll();
  };
  toggle.addEventListener('change', changed);
  filter.onchange = () => { close(); stopFollow(true); populate(); report(); };
  jump.onchange = () => { if (jump.value) { show(jump.value); follow(jump.value); } };
  back.onclick = () => { stopFollow(true); if (selected) show(selected); };
  retry.onclick = () => { clearTimeout(timer); void poll(); };
  const escape = e => { if (e.key === 'Escape') { close(); stopFollow(true); } };
  const unsubscribe = store.subscribe((s, keys) => {
    if (following && s.lastChangeSource !== 'aircraft-follow'
      && [...keys].some(k => k.startsWith('cam'))) stopFollow();
  });
  card.onpointerenter = hold; card.onpointerleave = deferClose;
  card.onfocusin = () => { pinned = true; hold(); };
  document.addEventListener('visibilitychange', visibility);
  document.addEventListener('keydown', escape);

  return {
    beforeFrame() {
      if (!enabled || document.hidden) return undefined;
      playbackAt = Date.now() - (reducedMotion ? 0 : 20000);
      const r = records.get(following);
      if (!r) return undefined;
      if (ageSeconds(r.data) > STALE_AFTER) { stopFollow(); return undefined; }
      const p = flightPosition(r.samples, playbackAt);
      if (performance.now() - lastFollow > 80) {
        lastFollow = performance.now();
        store.set({ camLon: p.lon, camLat: p.lat }, { source: 'aircraft-follow' });
      }
      return p.height;
    },
    update(camera, ctx) {
      if (!enabled || disposed || document.hidden) return;
      if (performance.now() - lastDraw < 80) return;
      lastDraw = performance.now(); viewWidth = ctx.width; viewHeight = ctx.height;
      syncCesium(); group.visible = !photographic.active;
      if (datasource) datasource.show = photographic.active;
      const blocked = controlBoxes(), time = Date.now();
      const C = window.Cesium;
      for (const r of [...records.values()]) {
        const age = ageSeconds(r.data, time);
        if (age >= EXPIRE_AFTER) { remove(r); continue; }
        const showPlane = flightMatches(r.data, filter.value);
        const p = flightPosition(r.samples, playbackAt);
        const ground = sampleElevation(p.lon, p.lat);
        const h = flightDisplayHeight(p, ground, ctx.exaggeration);
        r.mesh.visible = showPlane; r.line.visible = showPlane && trailToggle.checked;
        r.mesh.position.set(projection.lonToX(p.lon), h, projection.latToZ(p.lat));
        r.mesh.rotation.y = ((90 - (p.track ?? 0)) * Math.PI) / 180;
        const distance = camera.position.distanceTo(r.mesh.position);
        r.mesh.scale.setScalar(Math.max(1, distance * .00055));
        const trail = r.samples.filter(s => s.observedAt <= playbackAt).slice(-63); trail.push(p);
        const coordinates = [];
        for (const s of trail) coordinates.push(projection.lonToX(s.lon),
          flightDisplayHeight(s, sampleElevation(s.lon, s.lat), ctx.exaggeration), projection.latToZ(s.lat));
        r.line.geometry.attributes.position.array.set(coordinates);
        r.line.geometry.attributes.position.needsUpdate = true;
        r.line.geometry.setDrawRange(0, trail.length);
        let point;
        if (photographic.active && C && datasource) {
          const position = C.Cartesian3.fromDegrees(p.lon, p.lat, flightDisplayHeight(p, ground));
          if (!r.entity) r.entity = datasource.entities.add({ id: `aircraft-${r.data.id}`,
            model: { uri: 'data/aircraft.glb?v=1', minimumPixelSize: 32, maximumScale: 1000 },
            polyline: { positions: [], width: 2, material: C.Color.CYAN.withAlpha(.6) } });
          r.entity.show = showPlane; r.entity.position = position;
          r.entity.orientation = C.Transforms.headingPitchRollQuaternion(position,
            new C.HeadingPitchRoll(C.Math.toRadians((p.track ?? 0) - 90), 0, 0));
          r.entity.polyline.show = trailToggle.checked;
          r.entity.polyline.positions = trail.map(s => C.Cartesian3.fromDegrees(s.lon, s.lat,
            flightDisplayHeight(s, sampleElevation(s.lon, s.lat))));
          point = photographic.projectLocation({ ...p, elevation: flightDisplayHeight(p, ground) - 12 });
        } else {
          vector.copy(r.mesh.position).project(camera);
          if (vector.z >= -1 && vector.z <= 1) point = { x: (vector.x * .5 + .5) * ctx.width,
            y: (-vector.y * .5 + .5) * ctx.height };
        }
        const box = point && { l: point.x - 25, r: point.x + 25, t: point.y - 20, b: point.y + 35 };
        r.pin.hidden = !showPlane || !point || point.x < 20 || point.x > ctx.width - 20
          || point.y < 20 || point.y > ctx.height - 20 || blocked.some(b => box && overlapsBox(b, box, 3));
        r.pin.classList.toggle('stale', age > STALE_AFTER);
        r.pin.classList.toggle('selected', selected === r.data.id);
        r.pin.setAttribute('aria-label', `Aircraft ${name(r.data)} · ${number(r.data.altitudeFt)} feet`);
        if (point) { r.pin.style.left = `${point.x}px`; r.pin.style.top = `${point.y}px`; }
      }
      if (photographic.active) cesiumViewer?.scene.requestRender();
      if (time - lastReport > 1000) {
        lastReport = time; report(); updateCard();
        if (selected && !card.hidden) {
          const r = records.get(selected);
          const values = card.querySelectorAll('dd');
          if (r && values.length === 4) {
            values[0].textContent = `${number(r.data.altitudeFt)} ft`;
            values[1].textContent = r.data.speed === null ? 'Not reported' : `${number(r.data.speed)} kt`;
            values[2].textContent = r.data.track === null ? 'Not reported' : `${number(r.data.track)}°`;
            values[3].textContent = r.data.verticalRate === null
              ? 'Not reported' : `${number(r.data.verticalRate)} ft/min`;
          }
        }
      }
    },
    dispose() {
      disposed = true; generation++; controller?.abort(); clearTimeout(timer); clearTimeout(closeTimer);
      unsubscribe(); toggle.removeEventListener('change', changed);
      document.removeEventListener('visibilitychange', visibility);
      document.removeEventListener('keydown', escape);
      for (const r of [...records.values()]) remove(r);
      if (datasource && cesiumViewer && !cesiumViewer.isDestroyed()) {
        cesiumViewer.dataSources.remove(datasource, true);
      }
      scene.remove(group); geometry.dispose(); material.dispose(); lineMaterial.dispose();
      root.remove(); card.remove();
    },
  };
}
