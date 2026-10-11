import {
  MAX_AGE, CACHE_MAX_AGE, REFRESH_INTERVAL, cacheIsRecent, direction, escapeHtml as esc,
  fetchLayers, historyTime, mapFeature, mapPosition, matchingFeatures, number, officialUrl,
  position, probability, riskColor, basinFor, validateLayerCollection, validateForecastCollection, wind
} from './hurricane-data.mjs?v=20261010-10';
import { combinedStorms, fetchWpcForecasts, validateWpcCollection } from './hurricane-wpc.mjs?v=20261010-10';
import { createSatelliteOverlay } from './hurricane-satellite.mjs?v=20261010-5';
import { createRegionalContext } from './hurricane-regions.mjs?v=20261010-11';

const root = document.getElementById('weather-hurricanes');
const $ = selector => root.querySelector(selector);
const CACHE_KEY = 'jez237-hurricane-map-v1';
const UNIT_KEY = 'jez237-hurricane-units';
const LABELS = { points: 'storm positions', cones: 'forecast cones', history: 'past tracks', outlook: 'development areas', warnings: 'coastal alerts', remnants: 'inland systems (WPC)' };
const WATCHES = { HWR: ['Hurricane warning', '#ff676b'], HWA: ['Hurricane watch', '#f2a3d0'], TWR: ['Tropical storm warning', '#64b3ff'], TWA: ['Tropical storm watch', '#ffe083'] };
const BOUNDS = { atlantic: [[3, -102], [49, -18]], pacific: [[1, -179], [43, -79]], all: [[1, -173], [52, -25]] };
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const state = { basin: 'all', selected: null, step: 0, unit: 'mph', storms: [], bundle: null, cached: false, expiredCache: false, failedRefresh: false, loading: false, inView: true, initialized: false, lastAttempt: 0, basemapError: false, regionsError: false, layers: { cones: true, history: true, outlook: true, warnings: true } };
let map, graphics, highlight, labelLayer, playback, satellite, land, regions;
let observer, resizeObserver, cacheExpiry;
const outlookLayers = new Map();

function formatTime(value, date = true) {
  if (!Number.isFinite(value)) return 'Time not supplied';
  return new Intl.DateTimeFormat(undefined, { ...(date ? { month: 'short', day: 'numeric' } : {}), hour: 'numeric', minute: '2-digit', timeZoneName: 'short' }).format(new Date(value));
}

function selectedStorm() { return state.storms.find(s => s.id === state.selected); }
function pointCaption(storm, point) {
  if (point.hour === 0) return 'Advisory position';
  const lead = Number.isFinite(point.time) && Number.isFinite(storm.issuedAt) ? (point.time - storm.issuedAt) / 3600000 : null;
  return lead !== null && lead > 0 ? `+${Math.round(lead * 10) / 10} hours after advisory` : 'Forecast position';
}
function visibleStorms() { return state.storms.filter(s => state.basin === 'all' || s.basin === state.basin); }
function visibleOutlooks() { return (state.bundle?.layers.outlook?.features || []).filter(f => state.basin === 'all' || basinFor(f.properties) === state.basin); }
function isOldFeature(feature) {
  const date = number(feature.properties?.idp_filedate);
  return date === null || Date.now() - date > MAX_AGE || date - Date.now() > 3600000;
}
function showNotice(text) { $('#hurricane-notice').textContent = text; $('#hurricane-notice').hidden = !text; }
function showMapMessage(text) { $('#hurricane-map-message').textContent = text; $('#hurricane-map-message').hidden = !text; }
function stormSymbol() {
  return '<svg viewBox="0 0 36 36" aria-hidden="true"><path fill="currentColor" d="M18 7c-7 0-12 4-14 11 0-10 7-16 16-16l-2 5Zm0 22c7 0 12-4 14-11 0 10-7 16-16 16l2-5Z"/><circle cx="18" cy="18" r="9.5" fill="none" stroke="currentColor" stroke-width="5"/><circle cx="18" cy="18" r="3" fill="currentColor" opacity=".5"/></svg>';
}

function loadCache() {
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY));
    if (!cached || !cacheIsRecent(cached.checkedAt)) return null;
    if (!cached.layers?.points) return null;
    validateForecastCollection(cached.layers.points);
    cached.errors = Array.isArray(cached.errors) ? cached.errors.filter(name => Object.hasOwn(LABELS, name)) : [];
    for (const [name, data] of Object.entries(cached.layers)) {
      if (name === 'points') continue;
      try { name === 'remnants' ? validateWpcCollection(data) : validateLayerCollection(name, data); }
      catch { delete cached.layers[name]; if (Object.hasOwn(LABELS, name) && !cached.errors.includes(name)) cached.errors.push(name); }
    }
    return cached;
  } catch { return null; }
}

function renderList() {
  const focusedId = document.activeElement?.closest('#hurricane-storm-list [data-storm]')?.dataset.storm;
  const storms = visibleStorms();
  const available = !!state.bundle?.layers.points;
  $('#hurricane-storm-list').innerHTML = storms.length ? storms.map(storm => `
    <button class="hurricane-storm-button" type="button" data-storm="${esc(storm.id)}" aria-pressed="${state.selected === storm.id}" style="--storm-color:${storm.color}" aria-label="${esc(storm.name)}, ${esc(storm.label)}, ${wind(storm.current.wind, state.unit)} ${esc(state.unit)}${storm.stale ? ', older advisory' : ''}">
      <span class="hurricane-storm-symbol">${stormSymbol()}</span><span><strong>${esc(storm.name)}</strong><small>${esc(storm.label)}${storm.stale ? ' · older data' : ''}</small></span><span class="hurricane-list-wind">${wind(storm.current.wind, state.unit)}<small>${esc(state.unit)}</small></span>
    </button>`).join('') : `<p class="hurricane-empty">${available ? `No systems in the available forecast feeds for the ${state.basin === 'atlantic' ? 'Atlantic' : state.basin === 'pacific' ? 'eastern or central Pacific' : 'monitored basins'}. Check the development outlook below and official advisories.` : 'Storm positions are unavailable. Please use the official advisory links or try Refresh.'}</p>`;
  $('#hurricane-storm-list').querySelectorAll('[data-storm]').forEach(button => button.addEventListener('click', () => selectStorm(button.dataset.storm, true)));
  if (focusedId) [...$('#hurricane-storm-list').querySelectorAll('[data-storm]')].find(button => button.dataset.storm === focusedId)?.focus({ preventScroll:true });
}

function renderDetail() {
  const storm = selectedStorm();
  if (!storm) { $('#hurricane-storm-detail').innerHTML = ''; $('#hurricane-table-content').innerHTML = ''; return; }
  const coneAvailable = storm.source !== 'WPC' && matchingFeatures(state.bundle.layers.cones, storm, true).length > 0;
  const warnings = storm.source === 'WPC' ? [] : matchingFeatures(state.bundle.layers.warnings, storm, true);
  const warningNames = [...new Set(warnings.map(f => WATCHES[f.properties.tcww]?.[0]).filter(Boolean))];
  const [lat, mapLon] = storm.current.latlng;
  const lon = ((mapLon + 540) % 360) - 180;
  const warningLayerUpdating = storm.source !== 'WPC' && matchingFeatures(state.bundle.layers.warnings, storm).length > 0 && !warnings.length;
  $('#hurricane-storm-detail').innerHTML = `
    <div class="hurricane-storm-details" style="--storm-color:${storm.color}">
      <div class="hurricane-detail-heading"><span class="hurricane-category">${esc(storm.label)}</span></div>
      <dl class="hurricane-stat-grid">
        <div><dt>Sustained wind</dt><dd>${wind(storm.current.wind, state.unit)} <small>${esc(state.unit)}</small></dd></div>
        <div><dt>Gusts</dt><dd>${wind(storm.current.gust, state.unit)} <small>${esc(state.unit)}</small></dd></div>
        <div><dt>Pressure</dt><dd>${storm.pressure ?? '—'} <small>mb</small></dd></div>
        <div><dt>Movement ${esc(storm.direction)}</dt><dd>${wind(storm.movement, state.unit)} <small>${esc(state.unit)}</small></dd></div>
      </dl>
      <p class="hurricane-advisory-time">${storm.source} advisory ${esc(storm.advisory)} · ${esc(formatTime(storm.issuedAt))}<br>${Math.abs(lat).toFixed(1)}°${lat >= 0 ? 'N' : 'S'} · ${Math.abs(lon).toFixed(1)}°${lon >= 0 ? 'E' : 'W'}${storm.stale ? `<br><strong>Older advisory — check ${storm.source} for an update.</strong>` : ''}</p>
      <a class="hurricane-detail-link" href="${officialUrl(storm)}" target="_blank" rel="noopener noreferrer">${esc(storm.name)} ${storm.source} forecast &amp; advisory ↗</a>
      ${storm.source === 'WPC' ? '<p class="hurricane-layer-note">NOAA’s Weather Prediction Center continues tracking this inland system. The marker shows its position at the advisory time above. Flooding and wind hazards can continue after a storm becomes post-tropical.</p>' : ''}
      ${Number.isFinite(storm.dissipatedAt) ? `<p class="hurricane-layer-note">Forecast to dissipate by ${esc(formatTime(storm.dissipatedAt))}. Only published positions are plotted.</p>` : ''}
      ${warningNames.length ? `<div class="hurricane-coastal-note">Coastal map: ${warningNames.map(esc).join(' · ')}. Open the NHC advisory for affected locations.</div>` : ''}
      ${!coneAvailable ? `<p class="hurricane-layer-note">${storm.source === 'WPC' ? 'No uncertainty cone is supplied with this WPC track.' : 'A matching forecast cone is not available for this advisory.'}</p>` : ''}
      ${warningLayerUpdating ? '<p class="hurricane-layer-note">The coastal alert map is awaiting this advisory’s update. Check the NHC advisory for current watches and warnings.</p>' : ''}
    </div>`;
  renderForecastTable(storm);
}

function renderForecastTable(storm) {
  const target = $('#hurricane-table-content');
  const focusedStep = document.activeElement?.closest('#hurricane-table-content [data-forecast]')?.dataset.forecast;
  target.innerHTML = `<table aria-label="${esc(storm.name)} official forecast positions"><caption>${esc(storm.name)} · Advisory ${esc(storm.advisory)}. Select a time to highlight its official position.</caption><thead><tr><th scope="col">Time · local</th><th scope="col">Wind / status</th><th scope="col">Position</th></tr></thead><tbody>${storm.points.map((point, index) => {
    const [lat, mapLon] = point.latlng;
    const lon = ((mapLon + 540) % 360) - 180;
    return `<tr data-forecast-row="${index}"><th scope="row"><button type="button" data-forecast="${index}" aria-label="${esc(storm.name)}, ${esc(pointCaption(storm, point))}, ${esc(formatTime(point.time))}. Show position on map."><strong>${point.hour === 0 ? 'Advisory' : esc(pointCaption(storm, point).replace(' after advisory', ''))}</strong><small>${esc(formatTime(point.time))}</small></button></th><td><strong style="color:${point.color}">${wind(point.wind, state.unit)} ${esc(state.unit)}</strong><small>${esc(point.label)}</small></td><td><span>${Math.abs(lat).toFixed(1)}°${lat >= 0 ? 'N' : 'S'}</span><span>${Math.abs(lon).toFixed(1)}°${lon >= 0 ? 'E' : 'W'}</span></td></tr>`;
  }).join('')}</tbody></table>`;
  target.querySelectorAll('[data-forecast]').forEach(button => button.addEventListener('click', () => setStep(button.dataset.forecast, true)));
  if (focusedStep !== undefined) target.querySelector(`[data-forecast="${focusedStep}"]`)?.focus({ preventScroll:true });
}

function renderOutlooks() {
  const available = !!state.bundle?.layers.outlook;
  const features = visibleOutlooks();
  $('#hurricane-outlook-list').innerHTML = `<div class="hurricane-outlook-title">Areas to watch · 7 days</div>${features.length ? features.map((f, i) => {
    const p = f.properties || {};
    const seven = probability(p.prob7day), two = probability(p.prob2day);
    return `<button type="button" class="hurricane-outlook-button" data-outlook="${i}" style="--area-color:${riskColor(seven)}" aria-label="${basinFor(p) === 'atlantic' ? 'Atlantic' : 'Pacific'} development area ${i + 1}, ${seven ?? 'unknown'} percent formation chance in 7 days. Show on map."><span>${basinFor(p) === 'atlantic' ? 'Atlantic' : 'Pacific'} area ${i + 1}<small>${two === null ? '2-day chance unavailable' : `${two}% within 2 days`}${isOldFeature(f) ? ' · older outlook' : ''}</small></span><strong>${seven === null ? '—' : `${seven}%`}</strong></button>`;
  }).join('') : `<p class="hurricane-layer-note">${available ? 'No development areas in this basin’s latest map layer.' : 'Development outlook unavailable.'}</p>`}`;
  $('#hurricane-outlook-list').querySelectorAll('[data-outlook]').forEach(button => button.addEventListener('click', () => {
    const index = Number(button.dataset.outlook);
    if (!state.layers.outlook) { state.layers.outlook = true; $('[data-layer="outlook"]').checked = true; drawMap(); }
    const layer = outlookLayers.get(index);
    if (layer && map) { map.fitBounds(layer.getBounds(), { padding: [40, 40], maxZoom: 5.5, animate: !reducedMotion.matches }); layer.openPopup(); }
  }));
}

function renderStatus() {
  const bundle = state.bundle;
  if (!bundle) return;
  const unavailable = !bundle.layers.points;
  const old = state.cached || state.storms.some(s => s.stale) || visibleOutlooks().some(isOldFeature);
  root.dataset.feed = unavailable ? 'error' : old ? 'stale' : 'fresh';
  $('#hurricane-feed-status').textContent = unavailable && state.expiredCache ? 'Saved storm data expired' : `${state.cached ? 'Saved data' : 'NOAA checked'} · ${formatTime(bundle.checkedAt, false)}`;
  const count = visibleStorms().length, areas = visibleOutlooks().length;
  $('#hurricane-basin-count').textContent = `${unavailable ? 'Storm feed unavailable' : `${count} forecast ${count === 1 ? 'system' : 'systems'}`} · ${bundle.layers.outlook ? `${areas} ${areas === 1 ? 'area' : 'areas'} to watch` : 'Outlook unavailable'}`;
  const messages = [];
  if (state.basemapError) messages.push('The coastline map could not load. Storm coordinates and advisory details remain available.');
  if (state.regionsError) messages.push('State and province boundaries could not load. Storm positions remain available.');
  if (state.cached && state.failedRefresh) messages.push(`The feed could not be refreshed. Showing saved data checked ${formatTime(bundle.checkedAt)}.`);
  else if (unavailable) messages.push(`${state.expiredCache ? 'The saved storm data has expired. ' : ''}NOAA storm positions are temporarily unavailable. This does not mean there are no storms.`);
  if (state.storms.some(s => s.stale)) messages.push('Some advisories are more than 12 hours old or have an unverified time. Check the official advisory before using them.');
  if (visibleOutlooks().some(isOldFeature)) messages.push('The development outlook has an older or unverified publication time.');
  const missing = (bundle.errors || []).filter(name => name !== 'points');
  if (!state.cached && missing.length) messages.push(`Unavailable map layers: ${missing.map(name => LABELS[name]).join(', ')}.`);
  showNotice(messages.join(' '));
  if (!map) return;
  if (unavailable) showMapMessage('Storm positions unavailable · use NHC advisories');
  else if (!count && !areas) showMapMessage('No forecast systems or development areas in this view');
  else showMapMessage('');
}

function mapFeatureCollection(features) { return { type: 'FeatureCollection', features }; }

function drawMap() {
  if (!map || !state.bundle) return;
  const L = window.L;
  const focusedMarkerId = document.activeElement?.closest('#hurricane-map .hurricane-map-marker')?.dataset.markerStorm;
  graphics.clearLayers();
  highlight.clearLayers();
  outlookLayers.clear();
  if (state.layers.outlook) visibleOutlooks().forEach((feature, i) => {
    const p = feature.properties || {};
    const seven = probability(p.prob7day), two = probability(p.prob2day);
    const area = L.geoJSON(mapFeature(feature, basinFor(p)), { pane: 'hurricane-outlook', style: { color: riskColor(seven), weight: 1.6, dashArray: '5 5', fillColor: riskColor(seven), fillOpacity: .12 } }).addTo(graphics);
    area.bindPopup(`<strong>${basinFor(p) === 'atlantic' ? 'Atlantic' : 'Pacific'} development area</strong>${seven === null ? '7-day chance unavailable' : `${seven}% chance of formation within 7 days`}<br>${two === null ? '2-day chance unavailable' : `${two}% within 2 days`}<br><small>Published ${esc(formatTime(number(p.idp_filedate)))}${isOldFeature(feature) ? ' · older outlook' : ''}</small>`, { maxWidth:240, autoPanPadding:[16,16] });
    outlookLayers.set(i, area);
  });
  for (const storm of visibleStorms()) {
    const selected = storm.id === state.selected;
    const opacity = selected ? 1 : .63;
    if (state.layers.cones && storm.source !== 'WPC') {
      L.geoJSON(mapFeatureCollection(matchingFeatures(state.bundle.layers.cones, storm, true).map(f => mapFeature(f, storm.basin))), {
        pane: 'hurricane-cones', interactive: false,
        style: { color: storm.color, weight: 1.2, opacity: opacity * .8, fillColor: storm.color, fillOpacity: selected ? .14 : .05 }
      }).addTo(graphics);
    }
    if (state.layers.history) {
      const past = matchingFeatures(state.bundle.layers.history, storm).filter(f => position(f)).sort((a, b) => (historyTime(a.properties) || 0) - (historyTime(b.properties) || 0));
      if (past.length > 1) L.polyline(past.map(f => mapPosition(position(f), storm.basin)), { pane: 'hurricane-tracks', color: '#9ab8ca', weight: 1.8, opacity: selected ? .75 : .35, dashArray: '3 5', interactive: false }).addTo(graphics);
    }
    if (state.layers.warnings && storm.source !== 'WPC') {
      L.geoJSON(mapFeatureCollection(matchingFeatures(state.bundle.layers.warnings, storm, true).map(f => mapFeature(f, storm.basin))), {
        pane: 'hurricane-warnings', style: f => ({ color: WATCHES[f.properties.tcww]?.[1] || '#d2dce3', weight: 5, opacity: .95 }),
        onEachFeature: (feature, layer) => layer.bindPopup(`<strong>${esc(WATCHES[feature.properties.tcww]?.[0] || 'Coastal watch / warning')}</strong>${esc(storm.name)} · Advisory ${esc(storm.advisory)}<br><a href="${officialUrl(storm)}" target="_blank" rel="noopener noreferrer">Affected locations and official guidance ↗</a>`)
      }).addTo(graphics);
    }
    if (storm.points.length > 1) {
      L.polyline(storm.points.map(p => p.latlng), { pane: 'hurricane-tracks', color: '#041626', weight: selected ? 6 : 4, opacity: .8, interactive: false }).addTo(graphics);
      L.polyline(storm.points.map(p => p.latlng), { pane: 'hurricane-tracks', color: storm.color, weight: selected ? 2.6 : 1.8, opacity, interactive: false }).addTo(graphics);
    }
    storm.points.slice(1).forEach((point, index) => {
      const marker = L.circleMarker(point.latlng, { pane: 'hurricane-points', radius: selected ? 5 : 4, color: '#051a28', weight: 2, fillColor: point.color, fillOpacity: 1, opacity });
      marker.bindTooltip(`${esc(storm.name)} · ${esc(pointCaption(storm, point))}<br>${esc(formatTime(point.time))}<br>${wind(point.wind, state.unit)} ${esc(state.unit)} · ${esc(point.label)}`, { className: 'hurricane-storm-tooltip', direction: 'top' });
      marker.on('click', () => { selectStorm(storm.id, false); setStep(index + 1, true); });
      marker.addTo(graphics);
    });
    const marker = L.marker(storm.current.latlng, {
      pane: 'hurricane-centers', zIndexOffset: selected ? 100 : 0,
      icon: L.divIcon({ className: `hurricane-map-marker${selected ? ' is-selected' : ''}`, html: `<span class="hurricane-center-icon" style="--storm-color:${storm.color}"><strong>${esc(storm.badge)}</strong></span>`, iconSize: [38, 38], iconAnchor: [19, 19] }),
      title: `${storm.name}: ${storm.label}, ${wind(storm.current.wind, state.unit)} ${state.unit}`,
      alt: `${storm.name} current advisory position`, keyboard: true, riseOnHover: true
    });
    marker.on('click', () => selectStorm(storm.id, false));
    marker.bindTooltip(esc(storm.name), { permanent: true, direction: 'bottom', offset: [0, 19], className: 'hurricane-storm-tooltip' });
    marker.addTo(graphics);
    const element = marker.getElement();
    element.dataset.markerStorm = storm.id;
    element.setAttribute('aria-label', `${storm.name}, ${storm.label}, ${wind(storm.current.wind, state.unit)} ${state.unit}. Show storm details.`);
    element.addEventListener('keydown', event => {
      if (event.key === ' ') { event.preventDefault(); selectStorm(storm.id, false); }
    });
    if (focusedMarkerId === storm.id) element.focus({ preventScroll:true });
  }
  renderTimeline();
  regions?.update();
}

function setStep(value, stop = false) {
  if (stop) stopPlayback();
  const storm = selectedStorm();
  state.step = storm ? Math.max(0, Math.min(storm.points.length - 1, Number(value) || 0)) : 0;
  renderTimeline();
}

function renderTimeline() {
  const storm = selectedStorm();
  const panel = $('#hurricane-timeline');
  panel.hidden = !storm;
  highlight?.clearLayers();
  if (!storm) { stopPlayback(); return; }
  state.step = Math.min(state.step, storm.points.length - 1);
  const point = storm.points[state.step];
  const slider = $('#hurricane-forecast-step');
  slider.max = String(storm.points.length - 1);
  slider.value = String(state.step);
  slider.disabled = storm.points.length < 2;
  slider.setAttribute('aria-valuetext', `${storm.name}: ${pointCaption(storm, point)}, ${formatTime(point.time)}, ${wind(point.wind, state.unit)} ${state.unit}, ${point.label}`);
  $('#hurricane-previous').disabled = state.step === 0;
  $('#hurricane-next').disabled = state.step === storm.points.length - 1;
  $('#hurricane-play').disabled = storm.points.length < 2;
  $('#hurricane-forecast-readout').innerHTML = `<strong>${esc(storm.name)} · ${esc(pointCaption(storm, point))}</strong> · <span style="color:${point.color}">${wind(point.wind, state.unit)} ${esc(state.unit)}</span><small>${esc(formatTime(point.time))} · ${esc(point.label)}</small>`;
  root.querySelectorAll('[data-forecast]').forEach(button => {
    const current = Number(button.dataset.forecast) === state.step;
    if (current) button.setAttribute('aria-current', 'step');
    else button.removeAttribute('aria-current');
    button.closest('tr').classList.toggle('is-current', current);
  });
  if (map && state.step > 0) {
    window.L.circleMarker(point.latlng, { pane: 'hurricane-selection', radius: 11, weight: 2, color: '#effbff', fillColor: point.color, fillOpacity: .22, interactive: false }).addTo(highlight);
  }
}

function stopPlayback() {
  if (playback) clearInterval(playback);
  playback = null;
  $('#hurricane-play').textContent = '▶ Play';
  $('#hurricane-play').setAttribute('aria-pressed', 'false');
}

function selectStorm(id, zoom) {
  stopPlayback();
  state.selected = id;
  state.step = 0;
  renderList(); renderDetail(); drawMap();
  const storm = selectedStorm();
  if (zoom && map && storm) map.fitBounds(storm.points.map(p => p.latlng), { padding: [55, 60], maxZoom: 5.4, animate: !reducedMotion.matches });
}

function fitView() {
  if (!map) return;
  const coords = visibleStorms().flatMap(storm => storm.points.map(p => p.latlng));
  if (state.basin === 'all' && coords.length) {
    const bounds = window.L.latLngBounds(coords);
    for (const area of outlookLayers.values()) bounds.extend(area.getBounds());
    map.fitBounds(bounds, { padding: [45, 50], maxZoom: 4.5, animate: false });
  } else map.fitBounds(BOUNDS[state.basin === 'all' ? 'atlantic' : state.basin], { padding: [12, 18], animate: false });
}

function renderBundle(bundle, cached = false, initialFit = false) {
  clearTimeout(cacheExpiry);
  state.bundle = bundle;
  state.cached = cached;
  state.storms = bundle.layers.points ? combinedStorms(bundle.layers.points, bundle.layers.remnants) : [];
  if (!visibleStorms().some(s => s.id === state.selected)) { state.selected = visibleStorms()[0]?.id || null; state.step = 0; }
  renderList(); renderDetail(); renderOutlooks(); drawMap(); renderStatus();
  if (initialFit) fitView();
  if (bundle.layers.points) cacheExpiry = setTimeout(expireSavedData, Math.max(0, bundle.checkedAt + CACHE_MAX_AGE - Date.now()) + 1);
}

function expireSavedData() {
  const bundle = state.bundle;
  if (!bundle?.layers.points || cacheIsRecent(bundle.checkedAt)) return;
  state.expiredCache = true;
  state.failedRefresh = true;
  try { localStorage.removeItem(CACHE_KEY); } catch { /* Storage remains optional. */ }
  renderBundle({ checkedAt:bundle.checkedAt, layers:{}, errors:Object.keys(LABELS) });
}

async function refresh() {
  if (state.loading) return;
  expireSavedData();
  satellite?.refresh();
  regions?.refresh();
  state.loading = true;
  state.lastAttempt = Date.now();
  $('#hurricane-refresh').disabled = true;
  $('#hurricane-refresh').textContent = 'Checking…';
  try {
    const [bundle, remnants] = await Promise.all([fetchLayers(), fetchWpcForecasts().then(data=>({data}),()=>({error:true}))]);
    if (remnants.error) bundle.errors.push('remnants');
    else bundle.layers.remnants = remnants.data;
    expireSavedData();
    const initialFit = !state.bundle?.layers.points;
    if (!bundle.layers.points && state.bundle?.layers.points) {
      state.failedRefresh = true;
      renderBundle(state.bundle, true);
    } else {
      state.failedRefresh = false;
      if (bundle.layers.points) state.expiredCache = false;
      renderBundle(bundle, false, initialFit);
      if (bundle.layers.points) try { localStorage.setItem(CACHE_KEY, JSON.stringify(bundle)); } catch { /* Private browsing or storage quota must not prevent live data. */ }
    }
  } catch {
    state.failedRefresh = true;
    expireSavedData();
    if (state.bundle?.layers.points) renderBundle(state.bundle, true);
    else renderBundle({ checkedAt:Date.now(), layers:{}, errors:Object.keys(LABELS) });
  } finally {
    state.loading = false;
    $('#hurricane-refresh').disabled = false;
    $('#hurricane-refresh').textContent = 'Refresh';
  }
}

function addMapLabels() {
  labelLayer.clearLayers();
  const zoom = map.getZoom();
  const cities = [
    [40.06,-75.08,'Philadelphia',3], [25.76,-80.19,'Miami',3], [29.95,-90.07,'New Orleans',3],
    [29.76,-95.37,'Houston',4], [32.78,-79.93,'Charleston',4], [18.47,-66.11,'San Juan',3],
    [36.172,-86.782,'Nashville',4.5], [33.739,-84.368,'Atlanta',4.5], [35.970,-83.920,'Knoxville',5.5],
    [35.773,-78.647,'Raleigh',5], [37.552,-77.452,'Richmond',5], [40.432,-80.002,'Pittsburgh',5],
    [43.665,-79.389,'Toronto',4.5], [44.650,-63.600,'Halifax',4.5], [42.332,-71.072,'Boston',4.5],
    [23.11,-82.37,'Havana',4], [21.16,-86.85,'Cancún',4], [18.49,-69.93,'Santo Domingo',4],
    [32.31,-64.75,'Bermuda',3], [13.10,-59.61,'Barbados',4], [28.13,-15.44,'Canary Is.',3],
    [14.69,-17.45,'Dakar',3], [32.72,-117.16,'San Diego',3], [22.89,-109.92,'Cabo San Lucas',3],
    [20.65,-105.23,'Puerto Vallarta',4], [16.86,-99.88,'Acapulco',4], [19.43,-99.13,'Mexico City',3],
    [8.98,-79.52,'Panama City',4], [21.31,-157.86,'Honolulu',3], [19.70,-155.09,'Hilo',4]
  ];
  for (const [lat, lon, text, minZoom] of cities) if (zoom >= minZoom) {
    window.L.marker([lat, lon], { pane: 'hurricane-labels', interactive: false, keyboard: false, icon: window.L.divIcon({ className: 'hurricane-city-label', html: esc(text), iconSize: [110, 12], iconAnchor: [3, 6] }) }).addTo(labelLayer);
  }
  for (const [lat, lon, text] of [[30,-46,'ATLANTIC OCEAN'], [15,-138,'PACIFIC OCEAN'], [24,-91,'GULF'], [14,-73,'CARIBBEAN SEA']]) {
    window.L.marker([lat,lon], { pane: 'hurricane-labels', interactive: false, keyboard: false, icon: window.L.divIcon({ className: 'hurricane-ocean-label', html: text, iconSize: [150,20], iconAnchor: [75,10] }) }).addTo(labelLayer);
  }
}

async function initializeMap() {
  if (!window.L) { $('#hurricane-satellite').disabled = true; showMapMessage('Interactive map unavailable · storm details are listed below'); return; }
  const L = window.L;
  map = L.map('hurricane-map', {
    zoomSnap: .25, zoomDelta: .5, minZoom: 1.25, maxZoom: 6.5,
    maxBounds: [[-15,-205],[78,25]], maxBoundsViscosity: .8,
    scrollWheelZoom: false, preferCanvas: false, zoomAnimation: !reducedMotion.matches,
    fadeAnimation: !reducedMotion.matches, markerZoomAnimation: !reducedMotion.matches
  });
  map.attributionControl.setPrefix('<a href="https://leafletjs.com/" target="_blank" rel="noopener noreferrer">Leaflet</a>');
  map.attributionControl.addAttribution('<a href="https://www.naturalearthdata.com/" target="_blank" rel="noopener noreferrer">Natural Earth</a> · <a href="https://www.nhc.noaa.gov/" target="_blank" rel="noopener noreferrer">NOAA/NHC</a> · <a href="https://www.wpc.ncep.noaa.gov/" target="_blank" rel="noopener noreferrer">WPC</a>');
  for (const [name, z] of [['land',200],['satellite',205],['grid',210],['regions',245],['labels',250],['outlook',300],['cones',310],['tracks',320],['warnings',330],['points',340],['selection',350],['centers',410]]) {
    map.createPane(`hurricane-${name}`).style.zIndex = String(z);
    if (name !== 'centers') map.getPane(`hurricane-${name}`).setAttribute('aria-hidden', 'true');
    if (['land','satellite','grid','regions','labels'].includes(name)) map.getPane(`hurricane-${name}`).style.pointerEvents = 'none';
  }
  satellite = createSatelliteOverlay({ map, L, input:$('#hurricane-satellite'), panel:$('#hurricane-satellite-info'), status:$('#hurricane-satellite-status'), retry:$('#hurricane-satellite-retry'), formatTime,
    onDisplay:active => {
      root.classList.toggle('hurricane-satellite-active', active);
      map.getPane('hurricane-land').style.zIndex = active ? '240' : '200';
      land?.setStyle({ fillOpacity:active ? 0 : 1, color:active ? '#92b2c1' : '#45667a' });
    }
  });
  const grid = L.layerGroup().addTo(map);
  for (let lon = -180; lon <= 10; lon += 10) L.polyline([[-8,lon],[72,lon]], { pane: 'hurricane-grid', color:'#7da6bc', opacity:.09, weight:1, interactive:false }).addTo(grid);
  for (let lat = 0; lat <= 70; lat += 10) L.polyline([[lat,-180],[lat,12]], { pane: 'hurricane-grid', color:'#7da6bc', opacity:.09, weight:1, interactive:false }).addTo(grid);
  graphics = L.layerGroup().addTo(map);
  highlight = L.layerGroup().addTo(map);
  labelLayer = L.layerGroup().addTo(map);
  map.on('zoomend', addMapLabels);
  regions = createRegionalContext({map,L,escapeHtml:esc,onError:error=>{state.regionsError=error;if(state.bundle) renderStatus();}});
  fitView();
  addMapLabels();
  resizeObserver = new ResizeObserver(() => { map.closePopup(); map.invalidateSize({ animate:false }); });
  resizeObserver.observe($('#hurricane-map'));
  try {
    const response = await fetch(new URL('./data/basemap.geojson?v=20261010-4', import.meta.url), { signal: AbortSignal.timeout(10000) });
    if (!response.ok) throw new Error('Basemap unavailable');
    const active = root.classList.contains('hurricane-satellite-active');
    land = L.geoJSON(await response.json(), { pane:'hurricane-land', interactive:false, style:{ color:active ? '#92b2c1' : '#45667a', weight:.7, fillColor:'#1b3a4b', fillOpacity:active ? 0 : 1 } }).addTo(map);
  } catch { state.basemapError = true; showNotice('The coastline map could not load. Storm coordinates and advisory details remain available.'); }
  if (state.bundle) { drawMap(); renderStatus(); fitView(); }
}

function bindExpandedMap() {
  const dialog = document.getElementById('hurricane-expanded');
  const openButton = $('#hurricane-expand');
  if (!dialog?.showModal) { openButton.hidden = true; return; }
  let placeholder, scrollPosition, previousOverflow;
  openButton.addEventListener('click', () => {
    if (dialog.open) return;
    stopPlayback();
    scrollPosition = [window.scrollX, window.scrollY];
    previousOverflow = document.body.style.overflow;
    placeholder = document.createElement('div');
    placeholder.style.height = `${root.getBoundingClientRect().height}px`;
    placeholder.style.margin = getComputedStyle(root).margin;
    placeholder.setAttribute('aria-hidden', 'true');
    root.before(placeholder);
    dialog.append(root);
    openButton.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    dialog.showModal();
    document.getElementById('hurricane-close').focus({ preventScroll:true });
  });
  document.getElementById('hurricane-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    stopPlayback();
    placeholder?.replaceWith(root);
    placeholder = null;
    openButton.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = previousOverflow || '';
    window.scrollTo({ left:scrollPosition?.[0] || 0, top:scrollPosition?.[1] || 0, behavior:'instant' });
    openButton.focus({ preventScroll:true });
  });
}

function bindControls() {
  bindExpandedMap();
  root.querySelectorAll('[data-basin]').forEach(button => button.addEventListener('click', () => {
    stopPlayback();
    state.basin = button.dataset.basin;
    root.querySelectorAll('[data-basin]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    if (state.bundle) renderBundle(state.bundle, state.cached, true);
    else fitView();
  }));
  root.querySelectorAll('[data-layer]').forEach(input => input.addEventListener('change', () => { state.layers[input.dataset.layer] = input.checked; drawMap(); }));
  $('#hurricane-units').addEventListener('change', event => {
    state.unit = event.target.value;
    try { localStorage.setItem(UNIT_KEY, state.unit); } catch { /* Optional preference. */ }
    if (state.bundle) { renderList(); renderDetail(); drawMap(); }
  });
  $('#hurricane-refresh').addEventListener('click', refresh);
  $('#hurricane-reset-view').addEventListener('click', fitView);
  $('#hurricane-forecast-step').addEventListener('input', event => setStep(event.target.value, true));
  $('#hurricane-previous').addEventListener('click', () => setStep(state.step - 1, true));
  $('#hurricane-next').addEventListener('click', () => setStep(state.step + 1, true));
  $('#hurricane-play').addEventListener('click', () => {
    if (playback) { stopPlayback(); return; }
    const storm = selectedStorm();
    if (!storm || storm.points.length < 2) return;
    if (state.step === storm.points.length - 1) setStep(0);
    $('#hurricane-play').textContent = 'Ⅱ Pause';
    $('#hurricane-play').setAttribute('aria-pressed','true');
    playback = setInterval(() => {
      const current = selectedStorm();
      if (!current || state.step >= current.points.length - 1) { stopPlayback(); return; }
      setStep(state.step + 1);
    }, 1500);
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopPlayback();
    else {
      expireSavedData();
      if (state.inView && Date.now() - state.lastAttempt >= REFRESH_INTERVAL) refresh();
    }
  });
}

async function initialize() {
  if (state.initialized) return;
  state.initialized = true;
  try { const preference = localStorage.getItem(UNIT_KEY); if (['mph','km/h','kt'].includes(preference)) state.unit = preference; } catch { /* Optional preference. */ }
  $('#hurricane-units').value = state.unit;
  bindControls();
  const cached = loadCache();
  if (cached) renderBundle(cached, true);
  const mapPromise = initializeMap();
  await refresh();
  await mapPromise;
  setInterval(() => {
    if (document.hidden) return;
    expireSavedData();
    if (state.inView && Date.now() - state.lastAttempt >= REFRESH_INTERVAL) refresh();
  }, 60000);
}

if (root) {
  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver(entries => {
      state.inView = entries[0].isIntersecting;
      if (state.inView) {
        initialize();
        if (state.initialized && !state.loading && Date.now() - state.lastAttempt >= REFRESH_INTERVAL) refresh();
      } else stopPlayback();
    }, { rootMargin:'200px' });
    observer.observe(root);
  } else initialize();
}
