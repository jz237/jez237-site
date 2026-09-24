import { ageSeconds, flightMatches, flightPosition, appendFlightSample, flightDisplayHeight,
  STALE_AFTER, EXPIRE_AFTER, inFlightBounds } from './aircraft-data.js?v=philly-2026092121';
import { aircraftGeometry } from './aircraft-model.js?v=philly-2026092121';
import { controlBoxes, overlapsBox } from './label-policy.js?v=philly-2026092121';
import { aircraftRouteCard } from './aircraft-route-card.js?v=philly-2026092121';
import { createAircraftSession } from './aircraft-session.js?v=philly-2026092121';
import { createElevationCache } from './frame-work.js?v=philly-2026092121';
import { flightView, FLIGHT_VIEWS, viewDelay } from './flight-view.js?v=philly-2026092121';
import { SPOTTERS, observerView } from './explore-math.js?v=philly-2026092121';
import { createAirportCamera } from './airport-camera.js?v=philly-2026092204';

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
  const trailGround = createElevationCache(sampleElevation);
  const back = document.getElementById('aircraftReturn');
  const retry = document.getElementById('aircraftRetry');
  const limitNote = el('small', 'aircraft-source', 'Automatically turns off after 30 minutes.');
  toggle.closest('.aircraft-controls').append(limitNote);
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
  const airportCamera = createAirportCamera();
  const rideBar = el('section', 'aircraft-ride-bar'); rideBar.hidden = true;
  rideBar.setAttribute('aria-label', 'Simulated aircraft ride-along');
  const rideTitle = el('strong', '', 'SIMULATED RIDE-ALONG');
  const rideStatus = el('span', 'aircraft-ride-status');
  const rideControls = el('div', 'aircraft-view-buttons');
  const spotterStation = el('select', 'spotter-station');
  spotterStation.setAttribute('aria-label', 'Virtual airport viewpoint');
  SPOTTERS.forEach((station, i) => {
    const option = el('option', '', station.name); option.value = String(i); spotterStation.append(option);
  });
  spotterStation.hidden = true;
  const realCamera = el('button', '', 'Real PHL camera ↗'); realCamera.type = 'button';
  realCamera.onclick = airportCamera.open;
  for (const [mode, label] of Object.entries(FLIGHT_VIEWS)) {
    const button = el('button', '', label); button.type = 'button'; button.dataset.view = mode;
    button.onclick = () => startRide(following, mode); rideControls.append(button);
  }
  const exitRide = el('button', '', 'Return to map'); exitRide.type = 'button';
  exitRide.onclick = () => { stopFollow(true); close(); };
  rideBar.append(rideTitle, rideStatus, rideControls, spotterStation, realCamera, exitRide);
  document.body.append(rideBar);
  let rideMode = null, currentView = null, lastRideReport = 0;
  let enabled = false, disposed = false, controller, timer, generation = 0, loading = false;
  let selected = null, following = null, returnPose, failed = false, lastPoll = 0, lastDraw = 0;
  let retrySeconds = 30;
  let accessRequired = false, relayUnavailable = false, homeRelay = false;
  let lastReport = 0, lastFollow = 0, viewWidth = 1, viewHeight = 1, cesiumViewer, datasource;
  let closeTimer, pinned = false, playbackAt = Date.now();
  const session = createAircraftSession({ expire: () => {
    toggle.checked = false; changed();
    limitNote.textContent = 'Aircraft switched off after 30 minutes. Check the box to start again.';
  } });
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function stopFollow(restore = false) {
    rideMode = null; currentView = null; rideBar.hidden = true;
    document.body.classList.remove('aircraft-riding');
    following = null; back.hidden = true;
    if (restore && returnPose) motion.flyTo(returnPose, { label: 'Previous map view' });
    returnPose = null;
  }
  function remove(record) {
    record.pin.remove(); group.remove(record.mesh, record.line); record.line.geometry.dispose();
    if (record.entity && datasource) datasource.entities.remove(record.entity);
    records.delete(record.data.id);
    if (selected === record.data.id) close();
    if (following === record.data.id) stopFollow(true);
  }
  function visibleRecords() {
    return [...records.values()].filter(r => flightMatches(r.data, filter.value)
      && ageSeconds(r.data) < EXPIRE_AFTER);
  }
  function report() {
    const rows = visibleRecords(), fresh = rows.filter(r => ageSeconds(r.data) <= STALE_AFTER).length;
    const age = lastPoll ? Math.round((Date.now() - lastPoll) / 1000) : 0;
    const unavailable = relayUnavailable
      ? 'Home relay reconnecting or provider unavailable. '
        + 'Keep the host PC awake; recovery retries automatically'
      : 'Feed unavailable';
    const waiting = `${rows.length} last-known aircraft. Retry in up to ${retrySeconds}s.`;
    status.textContent = loading && !lastPoll ? 'Finding aircraft over the Delaware Valley…'
      : accessRequired ? 'Live aircraft need provider approval. Tracking is not active.'
      : failed ? `${unavailable} · ${waiting}`
      : `${rows.length} aircraft · ${fresh} recent · checked ${age}s ago${homeRelay ? ' · home relay' : ''}`;
    retry.hidden = !failed || loading;
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
    if (session.check()) return;
    if (!enabled || disposed || document.hidden || loading) return;
    const ticket = generation; loading = true; report();
    const request = new AbortController(); controller = request;
    const timeout = setTimeout(() => request.abort(), 12000);
    try {
      // Versioned URL also avoids an hour-long failure cached by earlier releases.
      const response = await fetch('aircraft?v=philly-2026092121', {
        signal: request.signal, cache: 'no-store' });
      const doc = await response.json();
      if (ticket !== generation || disposed || !enabled) return;
      if (!response.ok) {
        accessRequired = doc.accessRequired === true;
        relayUnavailable = doc.relayUnavailable === true;
        retrySeconds = Math.max(30, Math.min(86400, Number(doc.retryAfter) || 30));
        throw new Error('Feed unavailable');
      }
      if (!Array.isArray(doc.aircraft) || !Number.isFinite(doc.timestamp)) throw new Error('Invalid feed');
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
      failed = false; accessRequired = false; relayUnavailable = false;
      homeRelay = doc.relay === 'home'; lastPoll = Date.now(); populate();
    } catch { if (ticket === generation && enabled && !document.hidden) failed = true; }
    finally {
      clearTimeout(timeout);
      if (ticket === generation) {
        loading = false; report();
        if (enabled && !disposed && !document.hidden && !accessRequired) {
          timer = setTimeout(poll, failed ? retrySeconds * 1000 : 15000);
        }
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
    rideMode = null; currentView = null; rideBar.hidden = true;
    document.body.classList.remove('aircraft-riding');
    motion.stop(); following = id; back.hidden = false; pinned = true; show(id);
    store.set({ camDist: 4500, camPitch: 55 }, { source: 'aircraft-follow' });
  }
  function startRide(id, mode) {
    const r = records.get(id);
    if (!r || ageSeconds(r.data) > STALE_AFTER
      || mode !== 'spotter' && !Number.isFinite(r.data.track)) return;
    if (following !== id) follow(id);
    rideMode = mode; rideBar.hidden = false; close(); lastRideReport = 0;
    document.body.classList.add('aircraft-riding');
    rideTitle.textContent = `${name(r.data)} · SIMULATED ${mode === 'spotter' ? 'AIRPORT SPOTTER' : 'VIEW'}`;
    spotterStation.hidden = mode !== 'spotter';
    for (const button of rideControls.children) {
      button.setAttribute('aria-pressed', String(button.dataset.view === mode));
    }
    // Keep the existing graphics preference, including lighter graphics on older PCs.
    store.set({ camDist: 1800 }, { source: 'aircraft-follow' });
    document.getElementById('mapControls')?.removeAttribute('open');
    exitRide.focus({ preventScroll: true });
  }
  let minimizedAircraft;
  card.addEventListener('map-window-collapse', () => {
    minimizedAircraft = selected; hold(); pinned = true;
  });
  card.addEventListener('map-window-restore', () => {
    if (records.has(minimizedAircraft)) { show(minimizedAircraft); pinned = true; }
    else close();
  });
  function show(id) {
    const r = records.get(id); if (!r) return;
    hold(); selected = id; card.hidden = false; card.replaceChildren();
    card.dataset.callsign = r.data.callsign || '';
    const header = el('div', 'aircraft-card-head');
    const title = el('div', ''); title.append(el('small', '', 'AIRCRAFT / DELAWARE VALLEY'),
      el('h3', '', name(r.data)));
    const x = el('button', '', '×'); x.type = 'button';
    x.setAttribute('aria-label', 'Close aircraft details');
    x.onclick = close; header.append(title, x); card.append(header);
    card.append(el('p', 'aircraft-identity',
      `${r.data.type || 'Type unknown'} · ${r.data.registration || 'Registration unavailable'}`));
    card.append(aircraftRouteCard(r.data, () => !disposed && !card.hidden && selected === id
      ? records.get(id)?.data : null));
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
    const ride = el('button', 'aircraft-follow aircraft-ride', 'Ride along · simulated 3D');
    ride.type = 'button'; ride.onclick = () => startRide(id, 'forward'); card.append(ride);
    const spot = el('button', 'camera-card-retry', 'Track from PHL · simulated spotter');
    spot.type = 'button'; spot.disabled = ageSeconds(r.data) > STALE_AFTER;
    spot.onclick = () => startRide(id, 'spotter'); card.append(spot);
    const airport = el('button', 'camera-card-retry', 'Watch PHL airport camera ↗');
    airport.type = 'button'; airport.onclick = airportCamera.open; card.append(airport);
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
    if (card.dataset.callsign !== (r.data.callsign || '')) { show(selected); return; }
    const age = Math.round(ageSeconds(r.data));
    card.querySelector('.aircraft-age').textContent = age > STALE_AFTER
      ? `Stale position · received ${age}s ago; movement paused`
      : `Position received ${age}s ago · adsb.fi`;
    card.querySelector('.aircraft-follow').disabled = following === selected || age > STALE_AFTER;
    card.querySelector('.aircraft-ride').disabled = age > STALE_AFTER || !Number.isFinite(r.data.track);
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
    session.stop();
    limitNote.textContent = 'Automatically turns off after 30 minutes.';
    if (enabled) session.start();
    document.body.classList.toggle('aircraft-layer-enabled', enabled);
    generation++; clearTimeout(timer); controller?.abort(); loading = false; close();
    if (enabled) void poll();
    else { stopFollow(true); for (const r of [...records.values()]) remove(r); lastPoll = 0; }
    if (datasource) datasource.show = enabled;
  };
  const visibility = () => {
    if (session.check()) return;
    generation++; controller?.abort(); clearTimeout(timer); loading = false;
    if (!document.hidden && enabled) void poll();
  };
  toggle.addEventListener('change', changed);
  filter.onchange = () => { close(); stopFollow(true); populate(); report(); };
  jump.onchange = () => { if (jump.value) { show(jump.value); follow(jump.value); } };
  back.onclick = () => { stopFollow(true); if (selected) show(selected); };
  document.getElementById('airportSpotter').onclick = () => {
    const station = SPOTTERS[0];
    const candidates = visibleRecords().filter(r => ageSeconds(r.data) <= STALE_AFTER
      && Math.hypot((r.data.lon - station.lon) * 85000, (r.data.lat - station.lat) * 111320) < 25000);
    candidates.sort((a, b) => Math.hypot(a.data.lon - station.lon, a.data.lat - station.lat)
      - Math.hypot(b.data.lon - station.lon, b.data.lat - station.lat));
    if (candidates.length) startRide(candidates[0].data.id, 'spotter');
    else status.textContent = 'No recent aircraft within 25 km of PHL. Try again after the feed updates.';
  };
  retry.onclick = () => { clearTimeout(timer); void poll(); };
  const escape = e => {
    if (e.key === 'Escape' && !document.querySelector('.airport-camera-dialog[open]')) {
      close(); stopFollow(true);
    }
  };
  const unsubscribe = store.subscribe((s, keys) => {
    if (following && s.lastChangeSource !== 'aircraft-follow'
      && [...keys].some(k => k.startsWith('cam'))) stopFollow();
  });
  card.onpointerenter = hold; card.onpointerleave = deferClose;
  card.onfocusin = () => { pinned = true; hold(); };
  document.addEventListener('visibilitychange', visibility);
  document.addEventListener('keydown', escape);
  // Chrome can restore a checked form control before its layer is constructed.
  if (toggle.checked) changed();

  return {
    stopFollow,
    get flightView() { return currentView; },
    get animating() { return enabled && records.size > 0; },
    beforeFrame() {
      if (session.check()) return undefined;
      if (!enabled || document.hidden) return undefined;
      playbackAt = Date.now() - (reducedMotion ? 0 : 20000);
      const r = records.get(following);
      if (!r) return undefined;
      if (ageSeconds(r.data) > STALE_AFTER) {
        stopFollow(true);
        limitNote.textContent = 'Ride ended: tracking became stale. Select a recent aircraft.';
        return undefined;
      }
      const p = flightPosition(r.samples, playbackAt);
      const station = SPOTTERS[Number(spotterStation.value)] || SPOTTERS[0];
      currentView = rideMode === 'spotter'
        ? observerView(station, p, sampleElevation(station.lon, station.lat))
        : rideMode ? flightView(p, rideMode, sampleElevation(p.lon, p.lat)) : null;
      if (rideMode && !currentView) { stopFollow(true); return undefined; }
      if (performance.now() - lastFollow > 80) {
        lastFollow = performance.now();
        const eye = rideMode === 'spotter' ? station : p;
        store.set({ camLon: eye.lon, camLat: eye.lat }, { source: 'aircraft-follow' });
      }
      if (rideMode && Date.now() - lastRideReport > 900) {
        lastRideReport = Date.now();
        const shownAt = Math.max(r.samples[0].observedAt,
          Math.min(playbackAt, r.samples.at(-1).observedAt));
        const bufferedAge = viewDelay({ observedAt: shownAt });
        rideStatus.textContent = `${FLIGHT_VIEWS[rideMode]} · position ~${bufferedAge}s behind · `
          + `${number(r.data.altitudeFt)} ft · ${number(r.data.speed)} kt · no camera footage`;
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
        if (!showPlane) {
          r.mesh.visible = false; r.line.visible = false; r.pin.hidden = true;
          if (r.entity) r.entity.show = false;
          continue;
        }
        const p = flightPosition(r.samples, playbackAt);
        const ground = sampleElevation(p.lon, p.lat);
        const h = flightDisplayHeight(p, ground, ctx.exaggeration);
        r.mesh.visible = showPlane; r.line.visible = showPlane && trailToggle.checked;
        const hideRidden = following === r.data.id && rideMode
          && rideMode !== 'chase' && rideMode !== 'spotter';
        if (hideRidden) { r.mesh.visible = false; r.line.visible = false; }
        r.mesh.position.set(projection.lonToX(p.lon), h, projection.latToZ(p.lat));
        r.mesh.rotation.y = ((90 - (p.track ?? 0)) * Math.PI) / 180;
        const distance = camera.position.distanceTo(r.mesh.position);
        r.mesh.scale.setScalar(Math.max(1, distance * .00055));
        const trail = trailToggle.checked
          ? [...r.samples.filter(s => s.observedAt <= playbackAt).slice(-63), p] : [];
        if (trail.length && !photographic.active) {
          const coordinates = r.line.geometry.attributes.position.array;
          trail.forEach((s, i) => {
            coordinates[i * 3] = projection.lonToX(s.lon);
            coordinates[i * 3 + 1] = flightDisplayHeight(s, trailGround(s), ctx.exaggeration);
            coordinates[i * 3 + 2] = projection.latToZ(s.lat);
          });
          r.line.geometry.attributes.position.needsUpdate = true;
          r.line.geometry.setDrawRange(0, trail.length);
        }
        let point;
        if (photographic.active && C && datasource) {
          const position = C.Cartesian3.fromDegrees(p.lon, p.lat, flightDisplayHeight(p, ground));
          if (!r.entity) r.entity = datasource.entities.add({ id: `aircraft-${r.data.id}`,
            model: { uri: 'data/aircraft.glb?v=1', minimumPixelSize: 32, maximumScale: 1000 },
            polyline: { positions: [], width: 2, material: C.Color.CYAN.withAlpha(.6) } });
          r.entity.show = showPlane; r.entity.position = position;
          if (hideRidden) r.entity.show = false;
          r.entity.orientation = C.Transforms.headingPitchRollQuaternion(position,
            new C.HeadingPitchRoll(C.Math.toRadians(p.track ?? 0), 0, 0));
          r.entity.polyline.show = trailToggle.checked;
          if (trail.length) r.entity.polyline.positions = trail.map(s => C.Cartesian3.fromDegrees(
            s.lon, s.lat, flightDisplayHeight(s, trailGround(s))));
          point = photographic.projectLocation({ ...p, elevation: flightDisplayHeight(p, ground) - 12 });
        } else {
          vector.copy(r.mesh.position).project(camera);
          if (vector.z >= -1 && vector.z <= 1) point = { x: (vector.x * .5 + .5) * ctx.width,
            y: (-vector.y * .5 + .5) * ctx.height };
        }
        const box = point && { l: point.x - 25, r: point.x + 25, t: point.y - 20, b: point.y + 35 };
        r.pin.hidden = hideRidden || !showPlane || !point || point.x < 20 || point.x > ctx.width - 20
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
          const values = card.querySelectorAll('.aircraft-facts dd');
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
      session.stop(); limitNote.remove();
      unsubscribe(); toggle.removeEventListener('change', changed);
      document.removeEventListener('visibilitychange', visibility);
      document.removeEventListener('keydown', escape);
      for (const r of [...records.values()]) remove(r);
      if (datasource && cesiumViewer && !cesiumViewer.isDestroyed()) {
        cesiumViewer.dataSources.remove(datasource, true);
      }
      scene.remove(group); geometry.dispose(); material.dispose(); lineMaterial.dispose();
      airportCamera.dispose(); rideBar.remove(); root.remove(); card.remove();
    },
  };
}
