import { CAMERA_SOURCES, STREET_PLACES, GAUGE, nearestStation, streetViewUrl, observationTime }
  from './regional-data.js?v=philly-2026092006';

const node = (tag, text, className) => {
  const el = document.createElement(tag);
  if (text) el.textContent = text;
  if (className) el.className = className;
  return el;
};
const link = (text, url, className = 'local-link') => {
  const a = node('a', text, className); a.href = url;
  a.target = '_blank'; a.rel = 'noopener noreferrer'; return a;
};

export function wireRegionalViews({ getPose, motion }) {
  const dialog = document.getElementById('regionalViews');
  const openers = [document.getElementById('openLocalViews'), document.getElementById('btnLocalViews')];
  const tabs = [...dialog.querySelectorAll('[data-local-tab]')];
  const panes = [...dialog.querySelectorAll('[data-local-pane]')];
  const cameraList = dialog.querySelector('#regionalCameras');
  const weather = dialog.querySelector('#regionalWeather');
  const water = dialog.querySelector('#regionalWater');
  const refresh = dialog.querySelector('#refreshConditions');
  const cache = new Map(); let pose, station, opener, request, generation = 0, selected = 'cameras';

  function visit(place) {
    dialog.close();
    motion.flyTo({ ...place, camDist: 1700, camPitch: 45 }, { label: place.name });
  }
  for (const source of CAMERA_SOURCES) {
    const card = node('article', '', 'local-source');
    card.append(node('span', source.kind, 'local-eyebrow'), node('h3', source.name),
      node('p', source.text), node('small', source.provider));
    const actions = node('div', '', 'local-actions');
    actions.append(link('Open camera viewer ↗', source.url));
    if (source.place) {
      const b = node('button', 'Show camera host on map', 'local-secondary'); b.type = 'button';
      b.onclick = () => visit(source.place); actions.append(b);
    }
    card.append(actions); cameraList.append(card);
  }
  for (const place of STREET_PLACES) {
    dialog.querySelector('#streetShortcuts').append(link(`${place.name} ↗`, streetViewUrl(place)));
  }
  dialog.querySelector('#gaugeVisit').onclick = () => visit(GAUGE);
  dialog.querySelector('#gaugeSource').append(link('NOAA station 8545240 ↗',
    'https://tidesandcurrents.noaa.gov/stationhome.html?id=8545240'));
  dialog.querySelector('#trafficAccess').append(link('PennDOT camera feed access ↗',
    'https://www.pa.gov/services/penndot/request-access-to-transportation-related-data-feeds'));

  function showConditions(data) {
    weather.replaceChildren(); water.replaceChildren();
    const w = data?.weather, r = data?.water;
    weather.append(node('p', station.name, 'local-station'));
    if (w) {
      weather.append(node('strong', Number.isFinite(w.temperatureF)
        ? `${Math.round(w.temperatureF)}°F` : 'Temperature unavailable', 'local-reading'),
      node('p', w.description), node('p', Number.isFinite(w.windMph)
        ? `Wind ${Math.round(w.windMph)} mph` : 'Wind observation unavailable'),
      node('small', observationTime(w.timestamp), 'local-time'));
    } else weather.append(node('p',
      'Weather observations are temporarily unavailable. Try again or open NWS.'));
    weather.append(link('NWS observations ↗', `https://www.weather.gov/wrh/timeseries?site=${station.id}`));
    if (r) {
      water.append(node('strong', `${r.feet.toFixed(2)} ft`, 'local-reading'),
        node('p', `Above mean lower low water · ${r.preliminary ? 'preliminary' : 'verified'}`),
        node('small', observationTime(r.timestamp), 'local-time'));
    } else water.append(node('p',
      'River observations are temporarily unavailable. Open NOAA for station status.'));
    dialog.querySelector('#conditionsStatus').textContent = w && r
      ? 'Source observation times shown below. Readings may be delayed.'
      : 'Some observations are unavailable; official source links still work.';
  }
  async function loadConditions() {
    if (!station) return;
    const saved = cache.get(station.id);
    if (saved && Date.now() - saved.at < 300000) { showConditions(saved.data); return; }
    request?.abort(); const controller = new AbortController(); request = controller;
    const ticket = ++generation;
    refresh.disabled = true;
    dialog.querySelector('#conditionsStatus').textContent = 'Checking NWS and NOAA observations…';
    weather.textContent = 'Loading weather…'; water.textContent = 'Loading river level…';
    const timeout = setTimeout(() => controller.abort(), 12000);
    try {
      const response = await fetch(`regional-conditions?station=${station.id}`,
        { signal: controller.signal });
      if (!response.ok) throw new Error('Unavailable');
      const data = await response.json();
      if (ticket !== generation || !dialog.open) return;
      cache.set(station.id, { at: Date.now(), data }); showConditions(data);
    } catch {
      if (ticket === generation && dialog.open) showConditions(null);
    } finally {
      clearTimeout(timeout);
      if (ticket === generation) refresh.disabled = false;
    }
  }
  function selectTab(id) {
    selected = id;
    dialog.scrollTop = 0;
    for (const tab of tabs) tab.setAttribute('aria-pressed', String(tab.dataset.localTab === id));
    for (const pane of panes) pane.hidden = pane.dataset.localPane !== id;
    if (id === 'conditions') void loadConditions();
  }
  for (const tab of tabs) tab.onclick = () => selectTab(tab.dataset.localTab);
  refresh.onclick = () => { cache.delete(station?.id); void loadConditions(); };
  const close = () => dialog.close();
  dialog.querySelector('#showCameraMap').onclick = () => {
    dialog.close();
    const toggle = document.getElementById('cameraLayerToggle');
    if (!toggle.checked) toggle.click();
    toggle.focus();
  };
  dialog.querySelector('#closeRegionalViews').onclick = close;
  const opened = event => {
    opener = event.currentTarget; motion.pause(); pose = getPose(); station = nearestStation(pose);
    const street = dialog.querySelector('#streetCurrent');
    const url = streetViewUrl(pose);
    street.hidden = !url;
    if (url) street.href = url;
    dialog.querySelector('#streetLocation').textContent =
      `${pose.lat.toFixed(5)}° N, ${Math.abs(pose.lon).toFixed(5)}° W · map center when opened`;
    const forecast = dialog.querySelector('#localForecast');
    forecast.href = `https://forecast.weather.gov/MapClick.php?lat=${pose.lat.toFixed(4)}`
      + `&lon=${pose.lon.toFixed(4)}`;
    dialog.showModal(); selectTab(selected);
  };
  for (const button of openers) button.addEventListener('click', opened);
  const closed = () => {
    generation++; request?.abort(); refresh.disabled = false; opener?.focus();
  };
  dialog.addEventListener('close', closed);
  return () => {
    generation++; request?.abort();
    for (const button of openers) button.removeEventListener('click', opened);
    dialog.removeEventListener('close', closed);
  };
}
