// Optional NOAA/NESDIS infrared imagery, served directly by NOAA nowCOAST.
// No imagery or metadata is requested until the visitor enables the layer.
export const SATELLITE_URL = 'https://nowcoast.noaa.gov/geoserver/observations/satellite/ows';
export const SATELLITE_LAYER = 'global_longwave_imagery_mosaic';
const MAX_IMAGE_AGE = 6 * 3600000;

export function satelliteTime(value, advertisedTimes, now = Date.now()) {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(value || '')) throw new Error('Missing satellite time');
  const time = Date.parse(value);
  if (!Number.isFinite(time) || new Date(time).toISOString().slice(0, 19) !== value.slice(0, 19)) throw new Error('Invalid satellite time');
  if (time > now + 5 * 60000 || now - time > MAX_IMAGE_AGE) throw new Error('Satellite time is out of date');
  if (!String(advertisedTimes || '').split(',').some(item => Date.parse(item.trim()) === time)) throw new Error('Satellite time is not advertised');
  return time;
}

export function readSatelliteTime(xml, now = Date.now()) {
  const doc = new DOMParser().parseFromString(xml, 'text/xml');
  if (doc.getElementsByTagName('parsererror').length) throw new Error('Invalid satellite metadata');
  const layer = [...doc.getElementsByTagNameNS('*', 'Layer')].find(element =>
    [...element.children].some(child => child.localName === 'Name' && child.textContent === SATELLITE_LAYER));
  const dimension = layer && [...layer.children].find(child => child.localName === 'Dimension' && child.getAttribute('name') === 'time');
  if (!dimension) throw new Error('Satellite time unavailable');
  return satelliteTime(dimension.getAttribute('default'), dimension.textContent, now);
}

export function createSatelliteOverlay({ map, L, input, panel, status, retry, formatTime, onDisplay = () => {} }) {
  let layer, pending, imageTime, controller, imageTimer, moveTimer, requestId = 0, checking = false;
  const imageLabel = () => `Infrared mosaic · ${formatTime(imageTime)}`;
  const say = text => { status.textContent = text; };
  const clearPending = () => {
    clearTimeout(imageTimer);
    if (pending) {
      const old = pending;
      pending = null;
      old.off();
      if (old.getElement()) old.getElement().src = L.Util.emptyImageUrl;
      map.removeLayer(old);
    }
  };
  const clearImage = () => {
    clearTimeout(moveTimer);
    clearPending();
    if (layer) { const old = layer; layer = null; map.removeLayer(old); }
    onDisplay(false);
  };
  const failed = () => {
    clearImage();
    say('Satellite imagery is unavailable. The NHC forecast map remains available.');
    retry.hidden = false;
  };
  const ready = () => {
    clearTimeout(imageTimer);
    say(imageLabel());
    retry.hidden = true;
  };

  function loadImage() {
    clearTimeout(moveTimer);
    if (!input.checked || !Number.isFinite(imageTime)) return;
    if (Date.now() - imageTime > MAX_IMAGE_AGE) { failed(); return; }
    const size = map.getSize();
    if (!size.x || !size.y) return;
    clearPending();
    const bounds = map.getBounds();
    const southWest = L.CRS.EPSG3857.project(bounds.getSouthWest());
    const northEast = L.CRS.EPSG3857.project(bounds.getNorthEast());
    const scale = Math.min(1.5, window.devicePixelRatio || 1, 1400 / size.x, 1000 / size.y, Math.sqrt(1000000 / (size.x * size.y)));
    const params = new URLSearchParams({
      service:'WMS', request:'GetMap', version:'1.3.0', layers:SATELLITE_LAYER,
      styles:'', format:'image/png', transparent:'true', crs:'EPSG:3857',
      time:new Date(imageTime).toISOString(), width:String(Math.floor(size.x * scale)), height:String(Math.floor(size.y * scale)),
      bbox:[southWest.x, southWest.y, northEast.x, northEast.y].join(',')
    });
    const next = L.imageOverlay(`${SATELLITE_URL}?${params}`, bounds, {
      pane:'hurricane-satellite', opacity:0, interactive:false,
      attribution:'<a href="https://nowcoast.noaa.gov/" target="_blank" rel="noopener noreferrer">NOAA/NESDIS satellite</a>'
    });
    pending = next;
    say(`${imageLabel()} · loading image…`);
    next.on('load', () => {
      if (pending !== next || !input.checked) return;
      pending = null;
      if (layer) map.removeLayer(layer);
      layer = next;
      next.setOpacity(.64);
      onDisplay(true);
      ready();
    });
    next.on('error', () => { if (pending === next) failed(); });
    imageTimer = setTimeout(() => { if (pending === next) failed(); }, 18000);
    next.addTo(map);
  }

  map.on('moveend resize', () => {
    clearTimeout(moveTimer);
    if (input.checked && Number.isFinite(imageTime) && (layer || pending)) moveTimer = setTimeout(loadImage, 250);
  });

  async function refresh() {
    if (!input.checked || checking) return;
    const id = ++requestId;
    checking = true;
    retry.hidden = true;
    panel.hidden = false;
    say(layer ? `${imageLabel()} · checking for an update…` : 'Checking NOAA satellite imagery…');
    controller = new AbortController();
    const requestController = controller;
    const timeout = setTimeout(() => requestController.abort(), 12000);
    try {
      const response = await fetch(`${SATELLITE_URL}?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities`, { signal:controller.signal, cache:'no-cache' });
      if (!response.ok) throw new Error('Satellite metadata unavailable');
      const time = readSatelliteTime(await response.text());
      if (id !== requestId || !input.checked) return;
      if ((layer || pending) && time === imageTime) {
        if (pending) say(`${imageLabel()} · loading image…`);
        else ready();
        return;
      }
      clearImage();
      imageTime = time;
      loadImage();
    } catch {
      if (id === requestId && input.checked) failed();
    } finally {
      clearTimeout(timeout);
      if (id === requestId) { checking = false; controller = null; }
    }
  }

  input.addEventListener('change', () => {
    if (input.checked) refresh();
    else {
      ++requestId;
      controller?.abort();
      controller = null;
      checking = false;
      clearTimeout(moveTimer);
      clearImage();
      panel.hidden = true;
    }
  });
  retry.addEventListener('click', refresh);
  return { refresh };
}
