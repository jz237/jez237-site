import { photoAllowed, photoWanted, photoCamera, PHOTO_PRELOAD }
  from './photo-policy.js?v=philly-2026092001';

const CDN = 'https://cdn.jsdelivr.net/npm/cesium@1.145.0/Build/Cesium/';
let enginePromise;
function loadEngine() {
  if (window.Cesium) return Promise.resolve(window.Cesium);
  if (enginePromise) return enginePromise;
  enginePromise = new Promise((resolve, reject) => {
    const css = document.createElement('link');
    css.rel = 'stylesheet'; css.href = `${CDN}Widgets/widgets.css`;
    document.head.append(css);
    const script = document.createElement('script');
    script.src = `${CDN}Cesium.js`;
    script.onload = () => window.Cesium ? resolve(window.Cesium) : reject(new Error('engine'));
    script.onerror = () => reject(new Error('network'));
    document.head.append(script);
  });
  return enginePromise;
}

/** A second renderer, driven by the SAME geographic camera and controls. */
export function createPhotographic({ stage, store, sampleElevation, landmarks, onSelect }) {
  const host = document.createElement('div');
  host.className = 'photographic-stage'; host.setAttribute('aria-hidden', 'true');
  stage.append(host);
  const credits = document.getElementById('photoCredits');
  const select = document.getElementById('photoMode');
  const message = document.getElementById('photoStatus');
  const retry = document.getElementById('photoRetry');
  let viewer, tileset, loading = false, failed = false, disposed = false;
  let active = false, wanted = false, firstViewReady = false, visibleTiles = 0;
  let pending = 0, lastPoseKey = '', lastMotion = 0, lastStatus = '';
  let lastPose, width = 1, height = 1, seenAt = 0, generation = 0;
  let resourceTimer, firstViewTimer, press;

  function report(text) {
    if (text === lastStatus) return;
    lastStatus = text; message.textContent = text;
  }
  function present(on) {
    active = on;
    host.classList.toggle('visible', on);
    document.body.classList.toggle('photographic-view', on);
    credits.hidden = !on;
  }
  function unavailable() {
    failed = true; loading = false; present(false);
    clearTimeout(firstViewTimer); clearTimeout(resourceTimer);
    retry.hidden = false;
    report('Photo detail unavailable · diorama still works');
  }
  function setCamera(pose, w, h) {
    const C = window.Cesium;
    const camera = viewer.camera, mapped = photoCamera(pose, w / h);
    camera.frustum.fov = mapped.fov;
    camera.lookAt(C.Cartesian3.fromDegrees(pose.lon, pose.lat,
      sampleElevation(pose.lon, pose.lat)),
    new C.HeadingPitchRange(mapped.heading, mapped.pitch, mapped.range));
    camera.lookAtTransform(C.Matrix4.IDENTITY);
    viewer.scene.requestRender();
  }
  async function start() {
    if (loading || viewer || failed || disposed) return;
    const ticket = ++generation;
    loading = true; report('Preparing photographic detail…');
    resourceTimer = setTimeout(unavailable, 45000);
    try {
      const [C, config] = await Promise.all([loadEngine(),
        import('../../philadelphia-cesium/config.js?v=philly-2026092001')]);
      if (disposed || failed || ticket !== generation) return;
      C.Ion.defaultAccessToken = config.ionToken;
      viewer = new C.Viewer(host, {
        globe: false, baseLayer: false, geocoder: false, baseLayerPicker: false,
        animation: false, timeline: false, homeButton: false, sceneModePicker: false,
        navigationHelpButton: false, fullscreenButton: false, infoBox: false,
        selectionIndicator: false, skyBox: false, skyAtmosphere: false, scene3DOnly: true,
        requestRenderMode: true, maximumRenderTimeChange: Infinity, useDefaultRenderLoop: false,
        creditContainer: credits, creditViewport: document.body,
      });
      viewer.scene.screenSpaceCameraController.enableInputs = false;
      viewer.resolutionScale = Math.min(window.devicePixelRatio || 1, 2);
      viewer.scene.backgroundColor = C.Color.fromCssColorString('#203b43');
      viewer.scene.postProcessStages.fxaa.enabled = true;
      viewer.resize(); setCamera(lastPose, width, height);
      // Local curated place lookup uses no external geocoding service.
      const loadedTiles = await C.createGooglePhotorealistic3DTileset({ onlyUsingWithGoogleGeocoder: true }, {
        maximumScreenSpaceError: 2, dynamicScreenSpaceError: false,
        cacheBytes: 384 * 1024 * 1024, maximumCacheOverflowBytes: 128 * 1024 * 1024,
        preloadFlightDestinations: false, showCreditsOnScreen: true,
      });
      if (disposed || failed || ticket !== generation) { loadedTiles.destroy(); return; }
      tileset = loadedTiles;
      viewer.scene.primitives.add(tileset);
      tileset.tileVisible.addEventListener(() => { visibleTiles++; });
      tileset.loadProgress.addEventListener((requests, processing) => {
        pending = requests + processing;
      });
      viewer.scene.renderError.addEventListener(unavailable);
      for (const place of landmarks?.landmarks || []) {
        if (place.r > 1 && !/Bauder|Hidden Reef/.test(place.n)) continue;
        const entity = viewer.entities.add({
          position: C.Cartesian3.fromDegrees(place.lon, place.lat),
          point: { pixelSize: 7, color: C.Color.fromCssColorString('#f4c679'),
            outlineColor: C.Color.fromCssColorString('#16313b'), outlineWidth: 2,
            heightReference: C.HeightReference.CLAMP_TO_3D_TILE,
            disableDepthTestDistance: Infinity },
          label: { text: place.n, font: '600 12px sans-serif', showBackground: true,
            backgroundColor: C.Color.fromCssColorString('#16313be8'),
            pixelOffset: new C.Cartesian2(0, -24), backgroundPadding: new C.Cartesian2(8, 5),
            heightReference: C.HeightReference.CLAMP_TO_3D_TILE,
            disableDepthTestDistance: Infinity,
            distanceDisplayCondition: new C.DistanceDisplayCondition(0, 22000) },
        });
        entity.reliefPlace = place;
      }
      loading = false; clearTimeout(resourceTimer);
      firstViewTimer = setTimeout(() => { if (!firstViewReady && wanted) unavailable(); }, 45000);
    } catch {
      // Provider resource URLs can contain credentials: never log raw errors.
      if (!disposed && ticket === generation) unavailable();
    }
  }
  const unsubscribe = store.subscribe(state => { select.value = state.photoMode; });
  select.value = store.value('photoMode');
  select.onchange = () => store.set({ photoMode: select.value }, { source: 'photo-mode' });
  retry.onclick = () => {
    if (viewer && !viewer.isDestroyed()) viewer.destroy();
    viewer = undefined; tileset = undefined; failed = false; loading = false;
    firstViewReady = false; seenAt = 0; lastPoseKey = ''; enginePromise = undefined;
    host.replaceChildren(); credits.replaceChildren(); retry.hidden = true;
    void start();
  };
  const down = event => { press = active && event.button === 0
    ? { x: event.clientX, y: event.clientY } : null; };
  const up = event => {
    if (!press || !active) return;
    const start = press; press = null;
    if (Math.hypot(event.clientX - start.x, event.clientY - start.y) > 4) return;
    const rect = stage.getBoundingClientRect();
    const picked = viewer.scene.pick(new window.Cesium.Cartesian2(
      event.clientX - rect.left, event.clientY - rect.top));
    if (picked?.id?.reliefPlace) onSelect(picked.id.reliefPlace);
  };
  stage.addEventListener('pointerdown', down);
  stage.addEventListener('pointerup', up);

  return {
    get active() { return active; },
    stats: () => ({ active, wanted, loading, failed, pending, firstViewReady }),
    update(pose, state, w, h) {
      lastPose = pose; width = w; height = h;
      wanted = photoWanted(state, pose.dist, wanted);
      if (!wanted) present(false);
      if (failed) return false;
      const preload = photoAllowed(state) && state.photoMode !== 'relief'
        && (wanted || pose.dist <= PHOTO_PRELOAD);
      if (preload && !viewer) void start();
      if (!preload) {
        report(photoAllowed(state) ? state.photoMode === 'relief' ? 'Diorama · photographic detail off'
          : 'Diorama · zoom in for photographic 3D'
          : 'Relief map · historical or map layers active');
        return false;
      }
      if (!viewer || !tileset || loading) return false;
      const key = [pose.lon, pose.lat, pose.dist, pose.pitch, pose.bearing, pose.fov, w, h].join(':');
      if (key !== lastPoseKey) {
        lastPoseKey = key; lastMotion = performance.now();
        viewer.resize(); setCamera(pose, w, h);
      }
      const detail = performance.now() - lastMotion < 180 ? 12 : 2;
      if (tileset.maximumScreenSpaceError !== detail) {
        tileset.maximumScreenSpaceError = detail; viewer.scene.requestRender();
      }
      viewer.entities.show = state.layers.landmarks;
      visibleTiles = 0;
      try { viewer.render(); } catch { unavailable(); return false; }
      // Keep the miniature visible through the initial coarse/empty frames.
      // Tile visibility alone can be the whole-Earth fallback; wait for the
      // current view to settle, with a bounded partial-coverage escape hatch.
      if (visibleTiles && !seenAt) seenAt = performance.now();
      if (!firstViewReady && visibleTiles && (tileset.tilesLoaded
        || (visibleTiles > 12 && performance.now() - seenAt > 5000))) {
        firstViewReady = true; clearTimeout(firstViewTimer);
      }
      present(wanted && firstViewReady);
      report(active ? pending ? `Photographic 3D · refining ${pending} tiles`
        : 'Photographic 3D · full detail' : 'Preparing photographic detail…');
      return active;
    },
    capture() {
      viewer.scene.requestRender(); viewer.render();
      const source = viewer.canvas, canvas = document.createElement('canvas');
      canvas.width = source.width; canvas.height = source.height + 88;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(source, 0, 0); ctx.fillStyle = '#152f3b';
      ctx.fillRect(0, source.height, canvas.width, 88);
      ctx.fillStyle = '#fff'; ctx.font = '14px sans-serif';
      const words = ('Google Maps · Cesium ion · ' + credits.textContent).replace(/\s+/g, ' ').split(' ');
      let line = '', y = source.height + 24;
      for (const word of words) {
        if (ctx.measureText(line + word).width > canvas.width - 36) {
          ctx.fillText(line, 16, y); y += 19; line = '';
        }
        line += `${word} `;
      }
      ctx.fillText(line, 16, y);
      return canvas;
    },
    dispose() {
      disposed = true; clearTimeout(resourceTimer); clearTimeout(firstViewTimer); unsubscribe();
      stage.removeEventListener('pointerdown', down); stage.removeEventListener('pointerup', up);
      if (viewer && !viewer.isDestroyed()) viewer.destroy();
    },
  };
}
