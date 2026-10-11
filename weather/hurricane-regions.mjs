// Small, local geographic context. Load only when the map is zoomed in.
export function createRegionalContext({map,L,escapeHtml,onError}) {
  const labels = L.layerGroup().addTo(map);
  let boundaries, data, pending = false, failed = false;
  const minimumZoom = 4.5;
  const overlaps = (a,b) => a.left < b.right+3 && a.right > b.left-3 && a.top < b.bottom+3 && a.bottom > b.top-3;

  function drawLabels() {
    labels.clearLayers();
    const container = map.getContainer();
    const viewport = container.getBoundingClientRect();
    const inside = box => box.left >= viewport.left+4 && box.right <= viewport.right-4 && box.top >= viewport.top+4 && box.bottom <= viewport.bottom-4;
    const obstacles = [...container.parentElement.querySelectorAll('.leaflet-control, .hurricane-map-actions, .hurricane-map-message, .hurricane-map-marker, .hurricane-storm-tooltip')]
      .map(el=>el.getBoundingClientRect()).filter(box=>box.width && box.height);
    // Measure before writing visibility; cities and oceans retain their real coordinates.
    const contextLabels = [...container.querySelectorAll('.hurricane-city-label, .hurricane-ocean-label')]
      .map(el=>({el,box:el.getBoundingClientRect()}));
    for (const {el,box} of contextLabels) {
      const visible = inside(box) && !obstacles.some(other=>overlaps(box,other));
      el.style.visibility = visible ? '' : 'hidden';
      if (visible) obstacles.push(box);
    }
    if (!data || map.getZoom() < minimumZoom) return;
    for (const label of data.labels) {
      if (!map.getBounds().contains([label.lat,label.lon])) continue;
      const text = map.getZoom() >= 5.5 ? label.name : label.short;
      const width = Math.min(150,text.length*7+8), height = text.length > 19 ? 26 : 14;
      const point = map.latLngToContainerPoint([label.lat,label.lon]);
      const box = {left:viewport.left+point.x-width/2,right:viewport.left+point.x+width/2,top:viewport.top+point.y-height/2,bottom:viewport.top+point.y+height/2};
      // Do not move a state name outside its geographic position to make room.
      if (!inside(box) || obstacles.some(other=>overlaps(box,other))) continue;
      L.marker([label.lat,label.lon],{pane:'hurricane-regions',interactive:false,keyboard:false,icon:L.divIcon({className:'hurricane-region-label',html:escapeHtml(text),iconSize:[width,height],iconAnchor:[width/2,height/2]})}).addTo(labels);
      obstacles.push(box);
    }
  }

  async function load() {
    if (pending || failed || data) return;
    pending = true;
    try {
      const response = await fetch(new URL('./data/north-america-regions.geojson?v=20261010-11',import.meta.url),{signal:AbortSignal.timeout(10000)});
      if (!response.ok) throw new Error('Region map unavailable');
      const loaded = await response.json();
      if (loaded?.type !== 'FeatureCollection' || !Array.isArray(loaded.features) || !Array.isArray(loaded.labels)) throw new Error('Invalid region map');
      const coordinate = point => Array.isArray(point) && point.length === 2 && point.every(Number.isFinite) && Math.abs(point[0]) <= 180 && Math.abs(point[1]) <= 90;
      if (loaded.features.some(f=>f?.geometry?.type !== 'LineString' || !Array.isArray(f.geometry.coordinates) || f.geometry.coordinates.length < 2 || !f.geometry.coordinates.every(coordinate)) ||
          loaded.labels.some(label=>!label || typeof label.name !== 'string' || typeof label.short !== 'string' || label.name.length > 80 || !coordinate([label.lon,label.lat]))) throw new Error('Invalid region geometry or label');
      boundaries = L.geoJSON(loaded,{pane:'hurricane-regions',interactive:false,style:{color:'#83a5b7',weight:.85,opacity:.55,fill:false}});
      data = loaded;
      onError(false);
    } catch { failed = true; onError(true); }
    finally { pending = false; update(); }
  }

  function update() {
    const visible = map.getZoom() >= minimumZoom;
    if (visible && !data) void load();
    if (boundaries) {
      if (visible && !map.hasLayer(boundaries)) boundaries.addTo(map);
      else if (!visible && map.hasLayer(boundaries)) boundaries.remove();
    }
    drawLabels();
  }
  map.on('zoomend moveend',update);
  map.on('layeradd layerremove',event=>{ if (event.layer.options?.attribution) update(); });
  update();
  return {update,refresh(){failed=false;update();}};
}
