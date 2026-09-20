import { ionToken } from './config.js';

const $ = id => document.getElementById(id);
const places = {
  city: { name: 'Center City', lon: -75.1636, lat: 39.9526, height: 30, range: 3200, heading: 22, title: 'The city, in another dimension.', description: 'Follow real rooftops, bridges and streets. Zoom closer and the view refines around you.' },
  bauder: { name: 'Bauder Signs', lon: -75.09834015, lat: 39.99592532, height: 15, range: 450, heading: 25, title: 'Bauder Signs', description: '3613 Witte Street, Philadelphia. Explore the surrounding blocks in photographic 3D.' },
  reef: { name: 'The Hidden Reef', lon: -74.8827262, lat: 40.1368222, height: 25, range: 500, heading: -20, title: 'The Hidden Reef', description: '4501 New Falls Road, Levittown. Follow the neighborhood from above, then move in closer.' },
  valley: { name: 'Delaware Valley', lon: -75.08, lat: 40.02, height: 0, range: 48000, heading: 0, title: 'A wider perspective.', description: 'Trace the Delaware through the region. Drag anywhere, then zoom into the places that catch your eye.' },
};
let viewer, tileset, activePlace = 'city', orbiting = false, orbitCenter, lastTick = 0, settleTimer, watchdog;
let lastProgress = performance.now(), pending = 0, processing = 0, failedTiles = 0, disposed = false;
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

function status(message, state = '') {
  $('status').textContent = message;
  $('status-dot').className = state;
}
function fail(message) {
  $('welcome').hidden = false;
  $('welcome').classList.add('failed');
  $('welcome-message').textContent = message;
  $('retry').hidden = false;
  status('3D imagery unavailable', 'error');
}
function stopOrbit() {
  orbiting = false;
  $('orbit').setAttribute('aria-pressed', 'false');
  if (viewer) viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
}
function pointAtCenter() {
  const C = Cesium, scene = viewer.scene;
  const middle = new C.Cartesian2(scene.canvas.clientWidth / 2, scene.canvas.clientHeight / 2);
  if (scene.pickPositionSupported) {
    const point = scene.pickPosition(middle);
    if (C.defined(point)) return point;
  }
  const ellipsoidPoint = viewer.camera.pickEllipsoid(middle, C.Ellipsoid.WGS84);
  if (C.defined(ellipsoidPoint)) return ellipsoidPoint;
  const p = places[activePlace];
  return C.Cartesian3.fromDegrees(p.lon, p.lat, p.height);
}
function goTo(key, immediate = false) {
  if (!viewer) return;
  stopOrbit();
  activePlace = key;
  const p = places[key], C = Cesium;
  document.querySelectorAll('[data-place]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.place === key)));
  $('place-title').textContent = p.title;
  $('place-description').textContent = p.description;
  viewer.camera.flyToBoundingSphere(new C.BoundingSphere(C.Cartesian3.fromDegrees(p.lon, p.lat, p.height), 1), {
    offset: new C.HeadingPitchRange(C.Math.toRadians(p.heading), C.Math.toRadians(-38), p.range),
    duration: immediate || reducedMotion ? 0 : 2.2,
  });
}
function desiredDetail() { return $('detail').checked ? 2 : 8; }
function zoom(direction) {
  if (!viewer) return;
  stopOrbit();
  const range = Cesium.Cartesian3.distance(viewer.camera.positionWC, pointAtCenter());
  if (direction > 0) viewer.camera.zoomIn(Math.max(2, range * .3));
  else viewer.camera.zoomOut(Math.max(2, range * .4));
  viewer.scene.requestRender();
}

$('retry').onclick = () => location.reload();
$('help').onclick = () => {
  $('help-panel').hidden = !$('help-panel').hidden;
  $('help').setAttribute('aria-expanded', String(!$('help-panel').hidden));
};
const controls = [...document.querySelectorAll('.tools button, .places button, .readout input')];
controls.forEach(button => button.disabled = true);

async function init() {
  if (!window.Cesium) throw new Error('engine');
  const C = Cesium;
  C.Ion.defaultAccessToken = ionToken;
  viewer = new C.Viewer('map', {
    globe: false, baseLayer: false, geocoder: false, baseLayerPicker: false,
    animation: false, timeline: false, homeButton: false, sceneModePicker: false,
    navigationHelpButton: false, fullscreenButton: false, infoBox: false, selectionIndicator: false,
    requestRenderMode: true, maximumRenderTimeChange: Infinity,
    skyBox: false, skyAtmosphere: false, scene3DOnly: true,
  });
  viewer.scene.backgroundColor = C.Color.fromCssColorString('#203b43');
  viewer.scene.postProcessStages.fxaa.enabled = true;
  viewer.resolutionScale = Math.min(devicePixelRatio || 1, 2);
  viewer.scene.screenSpaceCameraController.minimumZoomDistance = 8;
  viewer.scene.screenSpaceCameraController.maximumZoomDistance = 120000;
  viewer.scene.screenSpaceCameraController.enableCollisionDetection = true;
  viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(C.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
  goTo('city', true);

  // There is no geocoding/search service in this preview; no non-Google geocoder
  // is combined with Google's data. Presets use the existing map's coordinates.
  tileset = await C.createGooglePhotorealistic3DTileset({ onlyUsingWithGoogleGeocoder: true }, {
    maximumScreenSpaceError: desiredDetail(),
    cacheBytes: (navigator.deviceMemory && navigator.deviceMemory <= 4 ? 256 : 512) * 1024 * 1024,
    maximumCacheOverflowBytes: 256 * 1024 * 1024,
    preloadFlightDestinations: true,
    dynamicScreenSpaceError: false,
    foveatedScreenSpaceError: true,
    foveatedTimeDelay: .15,
    enableCollision: true,
  });
  if (disposed) { tileset.destroy(); return; }
  viewer.scene.primitives.add(tileset);
  controls.forEach(button => button.disabled = false);
  status('Streaming the city…');

  Object.entries(places).filter(([key]) => key !== 'valley').forEach(([key, p]) => {
    viewer.entities.add({ id: key, position: C.Cartesian3.fromDegrees(p.lon, p.lat, p.height),
      point: { pixelSize: 8, color: C.Color.fromCssColorString('#edc88d'), outlineColor: C.Color.fromCssColorString('#142d32'), outlineWidth: 2, heightReference: C.HeightReference.CLAMP_TO_3D_TILE, disableDepthTestDistance: Number.POSITIVE_INFINITY },
      label: { text: p.name, font: '600 13px sans-serif', fillColor: C.Color.WHITE, showBackground: true, backgroundColor: C.Color.fromCssColorString('#142d32dd'), backgroundPadding: new C.Cartesian2(9, 6), pixelOffset: new C.Cartesian2(0, -26), heightReference: C.HeightReference.CLAMP_TO_3D_TILE, disableDepthTestDistance: Number.POSITIVE_INFINITY, distanceDisplayCondition: new C.DistanceDisplayCondition(0, key === 'city' ? 70000 : 25000) },
    });
  });
  viewer.screenSpaceEventHandler.setInputAction(event => {
    const picked = viewer.scene.pick(event.position);
    if (picked?.id && places[picked.id.id]) goTo(picked.id.id);
  }, C.ScreenSpaceEventType.LEFT_CLICK);

  let firstTile = false;
  tileset.tileVisible.addEventListener(() => {
    if (firstTile) return;
    firstTile = true;
    $('welcome').hidden = true;
    lastProgress = performance.now();
  });
  tileset.loadProgress.addEventListener((requests, working) => {
    pending = requests; processing = working; lastProgress = performance.now();
    if (requests || working) status(`Refining view · ${requests + working} tiles`);
    else status(failedTiles ? 'Some tiles unavailable · move to retry' : 'View ready', failedTiles ? 'error' : 'ready');
  });
  tileset.allTilesLoaded.addEventListener(() => {
    if (!firstTile) return;
    failedTiles = 0;
    status('View ready', 'ready');
  });
  tileset.tileFailed.addEventListener(() => {
    failedTiles++;
    status('Some tiles unavailable · move to retry', 'error');
  });
  watchdog = setInterval(() => {
    if (performance.now() - lastProgress > 25000 && !firstTile) fail('The imagery is taking longer than expected. Check your connection and try again.');
    else if ((pending || processing) && performance.now() - lastProgress > 15000) status('Waiting for imagery…');
  }, 5000);

  // Coarser tiles keep motion responsive; the exact same full-detail target
  // returns after movement. Only Cesium's bounded in-memory tile cache is used.
  viewer.camera.moveStart.addEventListener(() => {
    clearTimeout(settleTimer);
    tileset.maximumScreenSpaceError = Math.max(12, desiredDetail());
  });
  viewer.camera.moveEnd.addEventListener(() => {
    settleTimer = setTimeout(() => { tileset.maximumScreenSpaceError = desiredDetail(); viewer.scene.requestRender(); }, 180);
  });
  viewer.scene.postRender.addEventListener(() => {
    const height = viewer.camera.positionCartographic.height;
    $('altitude').textContent = height >= 1000 ? `${(height / 1000).toFixed(1)} km altitude` : `${Math.round(height)} m altitude`;
  });
  viewer.clock.onTick.addEventListener(() => {
    if (!orbiting) return;
    const now = performance.now(), dt = Math.min((now - lastTick) / 1000, .1);
    lastTick = now;
    const camera = viewer.camera;
    const range = C.Cartesian3.distance(camera.positionWC, orbitCenter);
    camera.lookAt(orbitCenter, new C.HeadingPitchRange(camera.heading + dt * .045, camera.pitch, range));
    camera.lookAtTransform(C.Matrix4.IDENTITY);
    viewer.scene.requestRender();
  });
  $('map').addEventListener('pointerdown', stopOrbit);
  $('map').addEventListener('wheel', stopOrbit, { passive: true });
  document.addEventListener('visibilitychange', () => { if (document.hidden) stopOrbit(); });
  viewer.scene.renderError.addEventListener(() => fail('The 3D renderer stopped. Try reloading, or open the relief diorama.'));
}

document.querySelectorAll('[data-place]').forEach(button => button.onclick = () => goTo(button.dataset.place));
$('home').onclick = () => goTo('city');
$('zoom-in').onclick = () => zoom(1);
$('zoom-out').onclick = () => zoom(-1);
$('overhead').onclick = () => {
  stopOrbit();
  const center = pointAtCenter(), C = Cesium;
  const range = C.Cartesian3.distance(viewer.camera.positionWC, center);
  viewer.camera.flyToBoundingSphere(new C.BoundingSphere(center, 1), { offset: new C.HeadingPitchRange(0, -C.Math.PI_OVER_TWO, range), duration: reducedMotion ? 0 : 1 });
};
$('orbit').onclick = () => {
  if (orbiting) return stopOrbit();
  orbitCenter = pointAtCenter(); lastTick = performance.now(); orbiting = true;
  $('orbit').setAttribute('aria-pressed', 'true'); viewer.scene.requestRender();
};
$('labels').onchange = () => { viewer.entities.show = $('labels').checked; viewer.scene.requestRender(); };
$('detail').onchange = () => { tileset.maximumScreenSpaceError = desiredDetail(); viewer.scene.requestRender(); };
$('fullscreen').onclick = async () => {
  try { if (document.fullscreenElement) await document.exitFullscreen(); else await document.documentElement.requestFullscreen(); }
  catch { status('Fullscreen is unavailable in this browser'); }
};
document.addEventListener('fullscreenchange', () => $('fullscreen').setAttribute('aria-label', document.fullscreenElement ? 'Exit fullscreen' : 'Enter fullscreen'));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') { stopOrbit(); $('help-panel').hidden = true; $('help').setAttribute('aria-expanded', 'false'); return; }
  if (!viewer || /INPUT|SELECT|TEXTAREA|BUTTON|A/.test(event.target.tagName) || event.ctrlKey || event.metaKey || event.altKey) return;
  if (event.key === '+' || event.key === '=') { event.preventDefault(); zoom(1); }
  if (event.key === '-') { event.preventDefault(); zoom(-1); }
  if (event.key.toLowerCase() === 'h') goTo('city');
});
window.addEventListener('pagehide', event => {
  stopOrbit();
  if (event.persisted) return;
  disposed = true; clearInterval(watchdog); clearTimeout(settleTimer);
  if (viewer && !viewer.isDestroyed()) viewer.destroy();
});
// Defer/module ordering differs between browsers; load guarantees the engine
// has settled, including a failed CDN request, before creating the viewer.
if (document.readyState !== 'complete') await new Promise(resolve => window.addEventListener('load', resolve, { once: true }));
init().catch(error => {
  // Never print the resource URL: ion tile URLs can contain access credentials.
  const code = Number(error?.statusCode);
  console.warn('3D initialization failed', Number.isFinite(code) ? code : String(error?.name || 'Error'));
  fail(code === 401 || code === 403
    ? 'The imagery token does not allow this site. Open this preview on jez237.com.'
    : 'Could not load the 3D imagery. Check your connection, then try again.');
});
