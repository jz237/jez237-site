import { sampleRiverbed } from './bathymetry-shader.js?v=philly-2026092201';

/** An opt-in static survey layer: no polling, no extra draw calls or renderer. */
export function createBathymetry(THREE, { terrain, water, projection, store, motion,
  getPose, clearArchive, invalidate }) {
  const $ = id => document.getElementById(id);
  const toggle = $('bathymetryToggle'), options = $('bathymetryOptions');
  const status = $('bathymetryStatus'), legend = $('bathymetryLegend');
  let current = terrain, texture, pixels, meta, request, ticket = 0, disposed = false;
  let enabled = false, loaded = false, scale = 6, lastProbe = '';
  const uniforms = terrain.uniforms;
  const names = ['uBathymetry', 'uBathBounds', 'uBathTexel', 'uBathOn', 'uBathScale'];
  const releaseState = store.subscribe((state) => {
    if (enabled && (state.era !== 'present' || state.compareMode !== 'off'
      || !state.layers.terrain)) setEnabled(false);
  });
  function attach(next) {
    current = next;
    if (!texture) uniforms.uBathymetry.value = next.uniforms.uHeight.value;
    for (const name of names) next.uniforms[name] = uniforms[name];
    for (const entry of water) {
      for (const name of names) entry.material.uniforms[name] = uniforms[name];
      entry.material.uniforms.uRegionSize = next.uniforms.uRegionSize;
    }
  }
  attach(terrain);
  function report(text) { status.textContent = text; }
  function sync() {
    uniforms.uBathOn.value = enabled && loaded ? 1 : 0;
    uniforms.uBathScale.value = scale;
    legend.hidden = !enabled || !loaded;
    document.body.classList.toggle('riverbed-view', enabled && loaded);
    $('bathymetryScaleValue').textContent = `${scale}×`;
    $('bathymetryScaleNote').textContent = scale === 1
      ? 'Riverbed uses the map’s terrain scale.'
      : `Riverbed relief ×${scale} on top of the map’s terrain scale.`;
    invalidate();
  }
  async function load() {
    if (loaded) { report('Survey layer ready · NOAA BlueTopo'); sync(); return; }
    const revision = ++ticket;
    request?.abort(); request = new AbortController();
    const controller = request, signal = controller.signal;
    const timeout = setTimeout(() => controller.abort(), 20000);
    report('Loading surveyed riverbed…'); $('bathymetryRetry').hidden = true;
    let bitmap;
    try {
      const [json, image] = await Promise.all([
        fetch('data/bathymetry/manifest.json?v=1', { signal }),
        fetch('data/bathymetry/riverbed.png?v=1', { signal }),
      ]);
      if (!json.ok || !image.ok) throw new Error('Survey download failed');
      const doc = await json.json();
      bitmap = await createImageBitmap(await image.blob(),
        { colorSpaceConversion: 'none', premultiplyAlpha: 'none' });
      if (disposed || revision !== ticket || !enabled) return;
      if (doc.version !== 1 || bitmap.width !== doc.width || bitmap.height !== doc.height) {
        throw new Error('Survey dimensions do not match');
      }
      const canvas = document.createElement('canvas');
      canvas.width = doc.width; canvas.height = doc.height;
      const context = canvas.getContext('2d', { willReadFrequently: true });
      context.drawImage(bitmap, 0, 0);
      const data = context.getImageData(0, 0, doc.width, doc.height).data;
      // Verify source probes before rendering; never silently display mangled depths.
      for (const probe of doc.probes) {
        const actual = sampleRiverbed(data, doc, probe.lon, probe.lat);
        if (actual !== probe.elevationM) throw new Error('Survey decoding failed');
      }
      pixels = data; meta = doc;
      texture = new THREE.DataTexture(data, doc.width, doc.height, THREE.RGBAFormat);
      texture.minFilter = texture.magFilter = THREE.LinearFilter;
      texture.generateMipmaps = false; texture.flipY = false; texture.needsUpdate = true;
      uniforms.uBathymetry.value = texture;
      const b = doc.bounds, r = projection.bounds;
      uniforms.uBathBounds.value.set((b.west-r.west)/(r.east-r.west),
        (r.north-b.north)/(r.north-r.south), (b.east-r.west)/(r.east-r.west),
        (r.north-b.south)/(r.north-r.south));
      uniforms.uBathTexel.value.set((b.east-b.west)/(r.east-r.west)/doc.width,
        (b.north-b.south)/(r.north-r.south)/doc.height);
      canvas.width = canvas.height = 1;
      loaded = true;
      report('NOAA BlueTopo · approximately 20 m display sampling · source surveys '
        + `${doc.surveyDateRange[0].slice(0,4)}–${doc.surveyDateRange[1].slice(0,4)}`);
      sync();
    } catch {
      if (disposed || revision !== ticket || !enabled) return;
      report('Riverbed data could not load. The normal map is still available.');
      $('bathymetryRetry').hidden = false;
    } finally { bitmap?.close(); clearTimeout(timeout); }
  }
  function setEnabled(on) {
    enabled = !!on; toggle.checked = enabled; options.hidden = !enabled;
    if (enabled) {
      clearArchive();
      store.set({ era: 'present', compareMode: 'off', layers: { terrain: true } },
        { source: 'riverbed' });
      void load();
    } else {
      ++ticket; request?.abort();
      // Release the large optional texture immediately on older computers.
      texture?.dispose(); texture = null; pixels = null; meta = null; loaded = false;
      uniforms.uBathymetry.value = current.uniforms.uHeight.value;
    }
    lastProbe = ''; sync();
  }
  const visits = {
    delaware: { lon: -75.136, lat: 39.944, camDist: 5800, camPitch: 48, camBearing: 25 },
    schuylkill: { lon: -75.214, lat: 39.90, camDist: 3800, camPitch: 48, camBearing: -20 },
    bristol: { lon: -74.851, lat: 40.095, camDist: 6500, camPitch: 45, camBearing: 20 },
  };
  toggle.onchange = () => setEnabled(toggle.checked);
  $('bathymetryRetry').onclick = () => void load();
  $('bathymetryClose').onclick = () => setEnabled(false);
  $('bathymetryScale').oninput = event => { scale = Number(event.target.value); sync(); };
  for (const button of document.querySelectorAll('[data-riverbed-visit]')) {
    button.onclick = () => {
      motion.flyTo(visits[button.dataset.riverbedVisit], { label: button.textContent });
      if (window.matchMedia('(max-width: 1024px)').matches) $('mapControls').open = false;
    };
  }
  queueMicrotask(() => { if (!disposed && toggle.checked && !enabled) setEnabled(true); });
  return {
    get active() { return enabled; },
    setTerrain: attach,
    disable: () => setEnabled(false),
    stats: () => ({ enabled, loaded, bytes: pixels?.byteLength || 0, scale }),
    update() {
      if (!enabled || !loaded) return;
      const pose = getPose(), key = `${pose.lon.toFixed(5)},${pose.lat.toFixed(5)}`;
      if (key === lastProbe) return;
      lastProbe = key;
      const h = sampleRiverbed(pixels, meta, pose.lon, pose.lat);
      $('bathymetryReading').textContent = h === null
        ? 'Map center: no surveyed riverbed here'
        : `Map center: ${(-h).toFixed(1)} m below NAVD88`;
    },
    dispose() {
      disposed = true; enabled = false; ++ticket; request?.abort(); releaseState();
      texture?.dispose(); pixels = null;
      toggle.onchange = null; legend.hidden = true;
    },
  };
}
