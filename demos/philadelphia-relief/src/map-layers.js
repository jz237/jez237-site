import { createMapSurfaces } from './map-surface.js?v=philly-2026092121';
import { createMapPoints } from './map-point-layer.js?v=philly-2026092121';
import { ageLabel, gaugeTrend } from './map-layer-data.js?v=philly-2026092121';

const el = (tag, text = '', cls = '') => {
  const e = document.createElement(tag); e.textContent = text; e.className = cls; return e;
};
const $ = id => document.getElementById(id);
const format = (value, unit) => Number.isFinite(value)
  ? `${value.toLocaleString('en-US')} ${unit}` : 'Unavailable';
const link = (text, href) => {
  const a = el('a', text); a.href = href;
  a.target = '_blank'; a.rel = 'noopener noreferrer'; return a;
};
const fetchDoc = async (url, signal) => {
  const response = await fetch(url, { signal }); if (!response.ok) throw new Error('Data unavailable');
  return response.json();
};

export function createMapLayers(THREE, { scene, stage, projection, sampleElevation, photographic,
  landmarks, motion, getPose, camera, onLandmark, onArchive = () => {}, invalidate = () => {} }) {
  const card = el('section', '', 'map-data-card'); card.hidden = true;
  card.setAttribute('aria-label', 'Map layer details'); document.body.append(card);
  let disposed = false, selected, cardRequest, lastUpdate = 0, press;
  let frames = [], frameIndex = 0, playing = false, animation, radarBusy = false;
  let radarRevision = 0, frameRevision = 0;
  const jobs = new Map(), rows = { ship: [], gauge: [] };
  function status(type, text) { $(`${type}Status`).textContent = text; }
  const surfaces = createMapSurfaces(THREE, { scene, projection, sampleElevation, status });
  const points = createMapPoints(THREE, { scene, stage, projection, sampleElevation, photographic,
    onCluster: showCluster,
    onSelect: (type, data) => {
      if (type === 'ship') showShip(data);
      else if (type === 'gauge') void showGauge(data);
      else { close(); onLandmark(data.name); }
    } });
  function close() { selected = null; card.hidden = true; cardRequest?.abort(); }
  function open(type, title, id) {
    if (window.matchMedia('(max-width: 1024px)').matches) $('mapControls').open = false;
    close(); selected = { type, id }; card.hidden = false; card.replaceChildren();
    const head = el('div', '', 'map-data-head'), x = el('button', '×'); x.type = 'button';
    x.setAttribute('aria-label', 'Close map layer details'); x.onclick = close;
    const titles = el('div'); titles.append(el('small', type.toUpperCase()), el('h3', title));
    head.append(titles, x); card.append(head);
  }
  function showCluster(type, members) {
    open('nearby on the map', `${members.length} ${type}s`, 'cluster');
    card.append(el('p', 'Choose a name to see its details and move closer.', 'map-data-note'));
    const list = el('div', '', 'map-cluster-list');
    for (const row of [...members].sort((a, b) => a.name.localeCompare(b.name))) {
      const button = el('button', row.name); button.type = 'button';
      button.onclick = () => {
        const current = rows[type].find(r => r.id === row.id);
        if (!current) {
          button.disabled = true; button.textContent = `${row.name} · no longer in feed`; return;
        }
        if (type === 'ship') showShip(current); else void showGauge(current);
        motion.flyTo({ ...current, camDist: type === 'ship' ? 4500 : 6500 }, { label: current.name });
      };
      list.append(button);
    }
    card.append(list); list.querySelector('button')?.focus({ preventScroll: true });
  }
  function facts(items, host = card) {
    const dl = el('dl', '', 'map-data-facts');
    for (const [name, text] of items) { const row = el('div');
      row.append(el('dt', name), el('dd', text || 'Not reported')); dl.append(row); }
    host.append(dl);
  }
  function showShip(ship) {
    open('ship', ship.name, ship.id);
    const age = Math.max(0, Math.round((Date.now() - ship.observedAt) / 1000));
    facts([['MMSI', ship.id], ['Speed', format(ship.speed, 'knots')],
      ['Course', format(ship.course, '°')],
      ['Reported destination', ship.destination || 'Not received yet']]);
    card.append(el('p', `${age > 120 ? 'Last-known position · ' : ''}${ageLabel(ship.observedAt)}
      · ${age}s ago`, 'map-data-note'));
    card.append(el('p', 'Destination is entered by the vessel crew and may be outdated. '
      + 'Generic ship model, enlarged for visibility. Positions update as AIS reports arrive.',
    'map-data-note'));
    card.append(link('AISStream data source ↗', 'https://aisstream.io/'));
    const button = el('button', 'Zoom to vessel', 'map-data-action'); button.type = 'button';
    button.onclick = () => motion.flyTo({ lon: ship.lon, lat: ship.lat, camDist: 4500, camPitch: 45 },
      { label: ship.name }); card.append(button);
  }
  function chart(series, host) {
    if (series.length < 2) return;
    const ns = 'http://www.w3.org/2000/svg', svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', '0 0 280 70'); svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'Recent observed river level trend');
    svg.classList.add('gauge-chart');
    const min = Math.min(...series.map(p => p.value)), max = Math.max(...series.map(p => p.value));
    const start = Date.parse(series[0].time);
    const span = Date.parse(series.at(-1).time) - start || 1;
    const line = document.createElementNS(ns, 'polyline');
    line.setAttribute('points', series.map(p => `${4 + 272 * (Date.parse(p.time) - start) / span},`
      + `${62 - (p.value - min) / (max - min || 1) * 50}`).join(' '));
    line.setAttribute('fill', 'none'); line.setAttribute('stroke', '#81d7d7');
    line.setAttribute('stroke-width', '2');
    svg.append(line); host.append(svg);
  }
  async function showGauge(gauge) {
    open('river gauge', gauge.name, gauge.id);
    facts([['Observed level', format(gauge.observed, gauge.unit)],
      ['Observed at', ageLabel(gauge.time)], ['Reported category', gauge.category.replaceAll('_', ' ')],
      ['Forecast value', format(gauge.forecast, gauge.forecastUnit)],
      ['Forecast valid at', gauge.forecastTime ? ageLabel(gauge.forecastTime) : 'No current forecast']]);
    card.append(el('p', 'Gauge height uses this station’s local reference level. It is not water depth '
      + 'or a flood extent map. Observations may be delayed.', 'map-data-note'));
    const detail = el('div', 'Loading recent observations…', 'map-data-note'); card.append(detail);
    card.append(link('Official gauge observations & forecast ↗',
      `https://water.noaa.gov/gauges/${gauge.id}`));
    const request = new AbortController(); cardRequest = request;
    const timeout = setTimeout(() => request.abort(), 15000);
    try {
      const doc = await fetchDoc(`river-gauges?id=${gauge.id}`, request.signal);
      if (disposed || selected?.id !== gauge.id || request.signal.aborted) return;
      detail.textContent = gaugeTrend(doc.observed); chart(doc.observed, detail);
      if (doc.observed?.length) detail.append(el('small',
        `${ageLabel(doc.observed[0].time)} → ${ageLabel(doc.observed.at(-1).time)} · ${doc.unit}`));
    } catch { if (!request.signal.aborted && selected?.id === gauge.id) {
      detail.textContent = 'Recent trend unavailable; current station readings are shown above.';
    } } finally { clearTimeout(timeout); }
  }
  function populate(type, list) {
    const select = $(type === 'ship' ? 'shipSelect' : 'gaugeSelect'), previous = select.value;
    select.replaceChildren(el('option', `Choose a ${type}…`)); select.firstChild.value = '';
    for (const row of [...list].sort((a, b) => a.name.localeCompare(b.name))) {
      const option = el('option', row.name); option.value = row.id; select.append(option);
    }
    select.value = previous;
  }
  function cancelJob(name) {
    const old = jobs.get(name); if (!old) return;
    clearTimeout(old.timer); old.controller?.abort(); jobs.delete(name);
  }
  function startJob(name, url, interval, accept) {
    cancelJob(name); const job = { revision: 0 }; jobs.set(name, job);
    async function run() {
      if (disposed || jobs.get(name) !== job || document.hidden) return;
      const ticket = ++job.revision, controller = new AbortController();
      job.controller = controller; const timeout = setTimeout(() => controller.abort(), 14000);
      try {
        const doc = await fetchDoc(url, controller.signal);
        if (disposed || jobs.get(name) !== job || ticket !== job.revision) return;
        accept(doc);
      } catch { if (jobs.get(name) === job && ticket === job.revision) status(name,
        name === 'ships' ? 'Ship relay unavailable · computer must be running. Retrying in 30 seconds.'
          : 'Source unavailable · last readings may be old. Retrying shortly.'); }
      finally {
        clearTimeout(timeout);
        if (!disposed && !document.hidden && jobs.get(name) === job && ticket === job.revision) {
          job.timer = setTimeout(run, interval);
        }
      }
    }
    job.run = run; void run();
  }
  function shipChanged() {
    const on = $('shipsToggle').checked; $('shipsOptions').hidden = !on; points.enable('ship', on);
    if (selected?.type === 'ship') close();
    if (!on) { cancelJob('ships'); rows.ship = []; points.set('ship', []); return; }
    status('ships', 'Connecting to the regional ship feed…');
    startJob('ships', 'ships', 30000, doc => {
      rows.ship = doc.vessels || []; points.set('ship', rows.ship); populate('ship', rows.ship);
      status('ships', !doc.configured ? 'Ship feed needs a free AISStream key.'
        : doc.state === 'unavailable' ? 'Ship provider unavailable · reconnecting automatically.'
          : `${rows.ship.length} vessels heard · ${doc.state === 'connected' ? 'listening' : 'connecting'}
            · AISStream via home relay${rows.ship.length ? '' : ' · waiting for regional radio reports'}`);
      if (selected?.type === 'ship') {
        const ship = rows.ship.find(s => s.id === selected.id); if (ship) showShip(ship); else close();
      }
    });
  }
  function gaugeChanged() {
    const on = $('gaugesToggle').checked; $('gaugesOptions').hidden = !on; points.enable('gauge', on);
    if (!on) { cancelJob('gauges'); if (selected?.type === 'river gauge') close(); return; }
    status('gauges', 'Loading regional observation stations…');
    startJob('gauges', 'river-gauges', 300000, doc => {
      rows.gauge = doc.gauges || []; points.set('gauge', rows.gauge); populate('gauge', rows.gauge);
      status('gauges', `${rows.gauge.length} gauges · NOAA / NWS · updated ${ageLabel(doc.checkedAt)}`);
    });
  }
  async function radarFrame(index) {
    if (!frames[index] || !$('radarToggle').checked || disposed) return;
    const ticket = ++frameRevision; frameIndex = index; radarBusy = true;
    $('radarFrame').value = String(index); status('radar', `Loading radar · ${ageLabel(frames[index])}`);
    try {
      await surfaces.radar(frames[index]);
      if (ticket === frameRevision) {
        status('radar', `${ageLabel(frames[index])} · frame ${index + 1}/${frames.length}`);
      }
    } catch { if (ticket === frameRevision) {
      status('radar', 'Radar image unavailable. Try Refresh enabled live layers.');
    } }
    finally { if (ticket === frameRevision) radarBusy = false; }
  }
  function setPlaying(on) {
    playing = on; clearInterval(animation); $('radarPlay').textContent = on ? 'Pause radar' : 'Play radar';
    if (on) animation = setInterval(() => {
      if (!radarBusy && !document.hidden && frames.length) void radarFrame((frameIndex + 1) % frames.length);
    }, 1000);
  }
  function radarChanged() {
    const on = $('radarToggle').checked; $('radarOptions').hidden = !on; radarRevision++;
    setPlaying(false); frameRevision++; radarBusy = false;
    if (!on) { cancelJob('radar'); void surfaces.radar(null); banner(); return; }
    status('radar', 'Finding the latest NOAA radar observations…');
    const ticket = radarRevision;
    startJob('radar', 'radar-frames', 300000, doc => {
      if (ticket !== radarRevision) return;
      frames = doc.frames || []; $('radarFrame').max = String(Math.max(0, frames.length - 1));
      $('radarFrame').disabled = $('radarPlay').disabled = !frames.length;
      if (frames.length) void radarFrame(frames.length - 1);
    }); banner();
  }
  function archiveChanged() {
    const year = $('archiveYear').value; $('archiveOptions').hidden = year === 'off';
    if (year !== 'off') onArchive();
    surfaces.setArchive(year);
    $('imageryCredit').textContent = year === 'off' ? 'Aerial imagery: USDA / USGS The National Map'
      : `${year} aerial survey: City of Philadelphia · current imagery outside loaded coverage`;
    if (year !== 'off') status('archive', `${year} · loading historical survey tiles…`);
    swipeChanged(); banner();
  }
  function swipeChanged() {
    const on = $('archiveYear').value !== 'off' && $('archiveSwipe').checked;
    const percent = Math.max(0, Math.min(100, Number($('archiveDivider').value)));
    $('archiveSwipeOverlay').hidden = !on; $('archiveDivider').disabled = !on;
    $('archivePastLabel').textContent = `${$('archiveYear').value} aerial`;
    $('archivePastLabel').hidden = percent === 0;
    $('archiveSwipeOverlay').querySelector('.current').hidden = percent === 100;
    $('archiveSwipeOverlay').style.setProperty('--archive-split', `${percent}%`);
    $('archiveSwipeHandle').setAttribute('aria-valuenow', String(percent));
    $('archiveSwipeHandle').setAttribute('aria-valuetext',
      `${percent}% historical aerial; rest current aerial`);
    surfaces.setSwipe(on ? percent / 100 : 1);
    invalidate();
  }
  const swipeHandle = $('archiveSwipeHandle');
  const moveDivider = event => {
    const rect = stage.getBoundingClientRect();
    const percent = (event.clientX - rect.left) / rect.width * 100;
    $('archiveDivider').value = String(Math.max(0, Math.min(100, percent)));
    swipeChanged();
  };
  swipeHandle.onpointerdown = e => { e.preventDefault(); e.stopPropagation();
    swipeHandle.setPointerCapture(e.pointerId); moveDivider(e); };
  swipeHandle.onpointermove = e => { if (swipeHandle.hasPointerCapture(e.pointerId)) moveDivider(e); };
  swipeHandle.onpointerup = e => { if (swipeHandle.hasPointerCapture(e.pointerId)) {
    swipeHandle.releasePointerCapture(e.pointerId);
  } };
  swipeHandle.onkeydown = e => {
    const delta = e.shiftKey ? 10 : 2;
    const values = { ArrowLeft: Number($('archiveDivider').value) - delta,
      ArrowRight: Number($('archiveDivider').value) + delta, Home: 0, End: 100 };
    if (!(e.key in values)) return;
    e.preventDefault(); e.stopPropagation();
    $('archiveDivider').value = String(values[e.key]); swipeChanged();
  };
  function banner() {
    const messages = [];
    if ($('archiveYear').value !== 'off') messages.push(`${$('archiveYear').value} aerials · today's terrain
      · current imagery outside survey / loaded tiles`);
    if ($('radarToggle').checked) messages.push('NOAA weather radar · observed echoes');
    $('mapLayerBanner').hidden = !messages.length; $('mapLayerBanner').textContent = messages.join(' | ');
  }
  async function inspect(lon, lat) {
    open('property information', 'Nearby city records', `${lon},${lat}`);
    const at = selected.id, result = el('div', 'Looking up nearby addresses…'); card.append(result);
    const request = new AbortController(); cardRequest = request;
    const timeout = setTimeout(() => request.abort(), 14000);
    try {
      const doc = await fetchDoc(`property-info?lon=${lon.toFixed(5)}&lat=${lat.toFixed(5)}`, request.signal);
      if (disposed || selected?.id !== at || request.signal.aborted) return;
      result.replaceChildren();
      if (!doc.properties?.length) result.append(el('p', 'No Philadelphia city property records within 60 m. '
        + 'This source does not cover surrounding counties or New Jersey.'));
      for (const p of doc.properties || []) {
        const item = el('details', '', 'property-record'); item.open = doc.properties.length === 1;
        item.append(el('summary', `${p.address} · ${p.distance ?? '?'} m from selected point`));
        facts([['Building', p.type], ['Use', p.use], ['Year built (city record)', p.year],
          ['Storeys', p.stories === null ? null : String(p.stories)], ['Floor area', format(p.area, 'sq ft')],
          ['Zoning', p.zoning]], item);
        item.append(link('Open address, permits & city records in Atlas ↗',
          `https://atlas.phila.gov/${encodeURIComponent(p.address)}`)); result.append(item);
      }
      result.append(el('p', 'Nearest address records, not a surveyed parcel selection. Year-built entries '
        + 'may be approximate. Source: Philadelphia Office of Property Assessment.', 'map-data-note'));
    } catch { if (!request.signal.aborted && selected?.id === at) {
      result.textContent = 'City records temporarily unavailable. Try another location or try again shortly.';
    } } finally { clearTimeout(timeout); }
  }
  const propertyChanged = () => {
    const on = $('propertyToggle').checked; $('propertyOptions').hidden = !on; points.enable('landmark', on);
    stage.classList.toggle('property-pick-mode', on); if (!on) close();
  };
  points.set('landmark', (landmarks?.landmarks || []).map(p => ({
    id: p.n, name: p.n, lon: p.lon, lat: p.lat })));
  const down = event => {
    press = $('propertyToggle').checked && event.button === 0 && event.target.tagName === 'CANVAS'
      ? { x: event.clientX, y: event.clientY, at: performance.now() } : null;
  };
  const up = event => {
    const start = press; press = null;
    if (!start || Math.hypot(start.x - event.clientX, start.y - event.clientY) > 4
      || performance.now() - start.at > 600) return;
    const rect = stage.getBoundingClientRect(), x = event.clientX - rect.left, y = event.clientY - rect.top;
    if (photographic.active) {
      const location = photographic.pickLocation(x, y);
      if (location) void inspect(location.lon, location.lat);
      return;
    }
    const ray = new THREE.Raycaster();
    ray.setFromCamera(new THREE.Vector2(x / rect.width * 2 - 1, 1 - y / rect.height * 2), camera);
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), point = new THREE.Vector3();
    for (let i = 0; i < 5; i++) {
      if (!ray.ray.intersectPlane(plane, point)) return;
      plane.constant = -sampleElevation(projection.xToLon(point.x), projection.zToLat(point.z)) * lastExag;
    }
    const lon = projection.xToLon(point.x), lat = projection.zToLat(point.z);
    if (projection.contains(lon, lat)) void inspect(lon, lat);
  };
  let lastExag = 1;
  const visibility = () => {
    for (const job of jobs.values()) { job.revision++; clearTimeout(job.timer); job.controller?.abort(); }
    if (!document.hidden) for (const job of jobs.values()) void job.run();
  };
  const escape = e => { if (e.key === 'Escape') close(); };
  $('shipsToggle').onchange = shipChanged; $('gaugesToggle').onchange = gaugeChanged;
  $('radarToggle').onchange = radarChanged; $('archiveYear').onchange = archiveChanged;
  $('propertyToggle').onchange = propertyChanged;
  $('shipSelect').onchange = e => { const row = rows.ship.find(r => r.id === e.target.value);
    if (row) { showShip(row); motion.flyTo({ ...row, camDist: 6000 }, { label: row.name }); } };
  $('gaugeSelect').onchange = e => { const row = rows.gauge.find(r => r.id === e.target.value);
    if (row) { void showGauge(row); motion.flyTo({ ...row, camDist: 8500 }, { label: row.name }); } };
  $('radarPlay').onclick = () => setPlaying(!playing);
  $('radarFrame').oninput = e => { setPlaying(false); void radarFrame(Number(e.target.value)); };
  $('radarOpacity').oninput = e => surfaces.radarOpacity(Number(e.target.value) / 100);
  $('archiveOpacity').oninput = e => surfaces.archiveOpacity(Number(e.target.value) / 100);
  $('archiveSwipe').onchange = swipeChanged; $('archiveDivider').oninput = swipeChanged;
  $('archiveVisit').onclick = () => motion.flyTo({ lon: -75.1635, lat: 39.9526, camDist: 7500,
    camPitch: 10 }, { label: 'Center City historical aerial survey' });
  $('propertyCenter').onclick = () => { const pose = getPose(); void inspect(pose.lon, pose.lat); };
  $('refreshMapLayers').onclick = () => {
    if ($('shipsToggle').checked) shipChanged(); if ($('gaugesToggle').checked) gaugeChanged();
    if ($('radarToggle').checked) radarChanged();
  };
  stage.addEventListener('pointerdown', down); stage.addEventListener('pointerup', up);
  document.addEventListener('visibilitychange', visibility); document.addEventListener('keydown', escape);
  return {
    get propertyMode() { return $('propertyToggle').checked; },
    get archiveActive() { return $('archiveYear').value !== 'off'; },
    get reliefOnly() { return $('archiveYear').value !== 'off' || $('radarToggle').checked; },
    clearArchive() { $('archiveYear').value = 'off'; archiveChanged(); },
    inspect,
    update(activeCamera, ctx) {
      lastExag = ctx.exaggeration; points.update(activeCamera, ctx);
      if (performance.now() - lastUpdate > 250) {
        lastUpdate = performance.now(); surfaces.update(ctx.pose, ctx.exaggeration, !photographic.active);
      }
    },
    dispose() {
      disposed = true;
      for (const name of [...jobs.keys()]) cancelJob(name); setPlaying(false);
      close(); points.dispose(); surfaces.dispose(); card.remove();
      stage.removeEventListener('pointerdown', down); stage.removeEventListener('pointerup', up);
      document.removeEventListener('visibilitychange', visibility);
      document.removeEventListener('keydown', escape);
    },
  };
}
