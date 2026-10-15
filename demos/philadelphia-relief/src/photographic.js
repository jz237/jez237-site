import { photoAllowed, photoWanted, photoCamera, photoReady, photoTileReady,
  photoLandmarkVisible, photoBudget, photoFailure, PHOTO_PRELOAD }
  from './photo-policy.js?v=philly-2026092121';
import { createVisibleTimeout } from './visible-timeout.js?v=philly-2026101001';

// Serve the pinned engine and its workers from the same origin as the map.
// This also works when an extension or network blocks third-party script CDNs.
const ENGINE = '/demos/philadelphia-relief/vendor/cesium-1.145.0/';
let enginePromise;
function loadEngine() {
  if (window.Cesium) return Promise.resolve(window.Cesium);
  if (enginePromise) return enginePromise;
  enginePromise = new Promise((resolve, reject) => {
    const css = document.createElement('link');
    css.rel = 'stylesheet'; css.href = `${ENGINE}Widgets/widgets.css`;
    document.head.append(css);
    const script = document.createElement('script');
    window.CESIUM_BASE_URL=ENGINE;
    script.src = `${ENGINE}Cesium.js`;
    script.onload = () => window.Cesium ? resolve(window.Cesium) : reject(new Error('engine'));
    script.onerror = () => reject(new Error('network'));
    document.head.append(script);
  });
  return enginePromise;
}
function loadResources(){
  return Promise.all([loadEngine(),import('../../philadelphia-cesium/config.js?v=philly-2026092121')]);
}

/** A second renderer, driven by the SAME geographic camera and controls. */
export function createPhotographic({ stage, store, sampleElevation, landmarks, onSelect,
  isOverlayActive = () => false, resources = loadResources }) {
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
  let lastPose, width = 1, height = 1, detailTiles = 0, bestError = Infinity, generation = 0;
  let press, exhibitBounds, conservative=false,budget;
  const resourceDeadline=createVisibleTimeout(document,()=>unavailable(null,'timeout'),45000);
  const firstViewDeadline=createVisibleTimeout(document,()=>unavailable(null,'timeout'),90000);
  let resizedWidth = 0, resizedHeight = 0;

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
  function unavailable(error,phase='render') {
    if(disposed||failed)return;
    const ticket=++generation;
    failed = true; loading = false; present(false);
    firstViewDeadline.cancel(); resourceDeadline.cancel();
    retry.hidden = false;
    report(`${photoFailure(error,phase)} Diorama still works.`);
    // renderError can fire inside Cesium's render traversal. Free the failed
    // viewer and its tile cache after that call returns, without touching a
    // renderer created by a subsequent retry.
    queueMicrotask(()=>{
      if(!disposed&&failed&&ticket===generation)destroyRenderer();
    });
  }
  function setCamera(pose, w, h) {
    const C = window.Cesium;
    const camera = viewer.camera, mapped = photoCamera(pose, w / h);
    updateLandmarks(pose);
    camera.frustum.fov = mapped.fov;
    viewer.scene.backgroundColor = C.Color.fromCssColorString(pose.flightView ? '#bacfdc' : '#203b43');
    if (pose.flightView) {
      const ride = pose.flightView;
      camera.lookAtTransform(C.Matrix4.IDENTITY);
      camera.setView({ destination: C.Cartesian3.fromDegrees(ride.lon, ride.lat,
        Math.max(sampleElevation(ride.lon, ride.lat) + (ride.clearance ?? 35), ride.height)),
      orientation: { heading: C.Math.toRadians(ride.heading),
        pitch: C.Math.toRadians(ride.pitch), roll: 0 } });
      viewer.scene.requestRender(); return;
    }
    camera.lookAt(C.Cartesian3.fromDegrees(pose.lon, pose.lat,
      Number.isFinite(pose.targetAltitude)
        ? Math.max(sampleElevation(pose.lon, pose.lat) + 35, pose.targetAltitude)
        : sampleElevation(pose.lon, pose.lat)),
    new C.HeadingPitchRange(mapped.heading, mapped.pitch, mapped.range));
    camera.lookAtTransform(C.Matrix4.IDENTITY);
    viewer.scene.requestRender();
  }
  function updateLandmarks(pose=lastPose) {
    if(!viewer)return;
    for (const entity of viewer.entities.values) {
      entity.show=photoLandmarkVisible(entity.reliefPlace,pose,exhibitBounds);
    }
  }
  function applyExhibit() {
    if (!tileset || !viewer) return true;
    updateLandmarks();
    if (!exhibitBounds) { tileset.clippingPolygons = undefined; return true; }
    const C = window.Cesium, b = exhibitBounds;
    if (!C.ClippingPolygonCollection.isSupported(viewer.scene)) return false;
    tileset.clippingPolygons = new C.ClippingPolygonCollection({ inverse: true,
      polygons: [new C.ClippingPolygon({ positions: C.Cartesian3.fromDegreesArray([
        b.west, b.north, b.east, b.north, b.east, b.south, b.west, b.south,
      ]) })] });
    viewer.scene.requestRender(); return true;
  }
  async function start() {
    if (loading || viewer || failed || disposed) return;
    const ticket = ++generation;
    loading = true; report('Preparing photographic detail…');
    resourceDeadline.start();
    let phase='resources';
    try {
      const [C, config] = await resources();
      if (disposed || failed || ticket !== generation) return;
      C.Ion.defaultAccessToken = config.ionToken;
      phase='graphics';
      budget=photoBudget(width,height,window.devicePixelRatio,store.value('quality'),conservative);
      viewer = new C.Viewer(host, {
        globe: false, baseLayer: false, geocoder: false, baseLayerPicker: false,
        animation: false, timeline: false, homeButton: false, sceneModePicker: false,
        navigationHelpButton: false, fullscreenButton: false, infoBox: false,
        selectionIndicator: false, skyBox: false, skyAtmosphere: false, scene3DOnly: true,
        requestRenderMode: true, maximumRenderTimeChange: Infinity, useDefaultRenderLoop: false,
        msaaSamples:1,contextOptions:{webgl:{antialias:false}},
        creditContainer: credits, creditViewport: document.body,
      });
      viewer.scene.screenSpaceCameraController.enableInputs = false;
      // The relief rig owns the camera. Tile collision data is used only to
      // anchor labels to their actual roofs, not to move that shared camera.
      viewer.scene.screenSpaceCameraController.enableCollisionDetection = false;
      viewer.resolutionScale = budget.scale;
      viewer.scene.backgroundColor = C.Color.fromCssColorString('#203b43');
      viewer.scene.postProcessStages.fxaa.enabled = true;
      viewer.resize(); setCamera(lastPose, width, height);
      resizedWidth = width; resizedHeight = height;
      // Local curated place lookup uses no external geocoding service.
      const googleOptions = { onlyUsingWithGoogleGeocoder: true };
      phase='tiles';
      const loadedTiles = await C.createGooglePhotorealistic3DTileset(googleOptions, {
        maximumScreenSpaceError: 16, dynamicScreenSpaceError: false,
        enableCollision: true,
        cacheBytes: budget.cacheBytes, maximumCacheOverflowBytes: budget.overflowBytes,
        preloadFlightDestinations: false, showCreditsOnScreen: true,
      });
      if (disposed || failed || ticket !== generation) { loadedTiles.destroy(); return; }
      tileset = loadedTiles;
      viewer.scene.primitives.add(tileset);
      applyExhibit();
      tileset.tileVisible.addEventListener(tile => {
        visibleTiles++;
        bestError = Math.min(bestError, tile.geometricError);
        if (photoTileReady(tile.geometricError, lastPose?.flightView?.height, lastPose?.dist)) detailTiles++;
      });
      tileset.loadProgress.addEventListener((requests, processing) => {
        pending = requests + processing;
      });
      viewer.scene.renderError.addEventListener((_scene,error)=>unavailable(error,'render'));
      for (const place of landmarks?.landmarks || []) {
        if (place.r > 1 && !/Bauder|Hidden Reef/.test(place.n)) continue;
        const entity = viewer.entities.add({
          position: C.Cartesian3.fromDegrees(place.lon, place.lat, 3),
          point: { pixelSize: 7, color: C.Color.fromCssColorString('#f4c679'),
            outlineColor: C.Color.fromCssColorString('#16313b'), outlineWidth: 2,
            heightReference: C.HeightReference.RELATIVE_TO_3D_TILE,
            disableDepthTestDistance: 0 },
          label: { text: place.n, font: '600 12px sans-serif', showBackground: true,
            backgroundColor: C.Color.fromCssColorString('#16313be8'),
            pixelOffset: new C.Cartesian2(0, -24), backgroundPadding: new C.Cartesian2(8, 5),
            heightReference: C.HeightReference.RELATIVE_TO_3D_TILE,
            disableDepthTestDistance: 0,
            distanceDisplayCondition: new C.DistanceDisplayCondition(0, 22000) },
        });
        entity.reliefPlace = place;
      }
      applyExhibit();
      loading = false; resourceDeadline.cancel();
    } catch (error) {
      // Provider resource URLs can contain credentials: never log raw errors.
      if (!disposed && ticket === generation) unavailable(error,phase);
    }
  }
  const unsubscribe = store.subscribe(state => { select.value = state.photoMode; });
  select.value = store.value('photoMode');
  select.onchange = () => store.set({ photoMode: select.value,
    ...(select.value === 'photo' ? { lightweight: 0 } : {}) }, { source: 'photo-mode' });
  function destroyRenderer(){
    if (viewer && !viewer.isDestroyed()) viewer.destroy();
    viewer=undefined;tileset=undefined;
    firstViewReady = false; lastPoseKey = ''; pending = 0;
    visibleTiles=0;detailTiles=0;bestError=Infinity;
    host.replaceChildren();credits.replaceChildren();
    delete message.dataset.visibleTiles;delete message.dataset.detailTiles;delete message.dataset.bestError;
  }
  function release() {
    generation++; firstViewDeadline.cancel(); resourceDeadline.cancel();
    destroyRenderer();failed=false;loading=false;
    present(false);
    retry.hidden = true;
  }
  retry.onclick = () => {
    conservative=true;
    release(); enginePromise = undefined;
    if (store.value('lightweight')) return;
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
    setExhibit(bounds) { exhibitBounds = bounds; return applyExhibit(); },
    get exhibitSupported() {
      return !viewer || window.Cesium.ClippingPolygonCollection.isSupported(viewer.scene);
    },
    get active() { return active; },
    get aircraftViewer() { return !failed && viewer && !viewer.isDestroyed() ? viewer : null; },
    pickLocation(x, y) {
      if (!active || !viewer) return null;
      const C = window.Cesium;
      try {
        const position = viewer.scene.pickPosition(new C.Cartesian2(x, y)); if (!position) return null;
        const point = C.Cartographic.fromCartesian(position);
        return { lon: C.Math.toDegrees(point.longitude), lat: C.Math.toDegrees(point.latitude),
          height: point.height, surface: true };
      } catch { return null; }
    },
    projectLocation(place) {
      if (!active || !viewer) return null;
      const C = window.Cesium;
      const world = C.Cartesian3.fromDegrees(place.lon, place.lat, place.elevation + 12);
      const delta = C.Cartesian3.subtract(world, viewer.camera.positionWC, new C.Cartesian3());
      if (C.Cartesian3.dot(delta, viewer.camera.directionWC) <= 0) return null;
      return C.SceneTransforms.worldToWindowCoordinates(viewer.scene, world);
    },
    stats: () => ({ active, wanted, loading, failed, pending, firstViewReady, visibleTiles, detailTiles }),
    update(pose, state, w, h) {
      if(disposed)return false;
      lastPose = pose; width = w; height = h;
      if (state.lightweight) {
        if (viewer || loading || failed) release();
        wanted = false; report('Lighter graphics · photographic 3D paused'); return false;
      }
      wanted = !isOverlayActive() && photoWanted(state, pose.dist, wanted);
      if (!wanted) {
        present(false);
        firstViewDeadline.cancel();
      }
      if (failed) return false;
      const preload = !isOverlayActive() && photoAllowed(state) && state.photoMode !== 'relief'
        && (wanted || pose.dist <= PHOTO_PRELOAD);
      if (preload && !viewer) void start();
      if (!preload) {
        report(photoAllowed(state) ? state.photoMode === 'relief' ? 'Diorama · photographic detail off'
          : 'Diorama · zoom in for photographic 3D'
          : 'Relief map · historical or map layers active');
        return false;
      }
      if (!viewer || !tileset || loading) return false;
      const nextBudget=photoBudget(w,h,window.devicePixelRatio,state.quality,conservative);
      if(viewer.resolutionScale!==nextBudget.scale){viewer.resolutionScale=nextBudget.scale;viewer.resize();}
      budget=nextBudget;tileset.cacheBytes=budget.cacheBytes;
      tileset.maximumCacheOverflowBytes=budget.overflowBytes;
      // Warm the engine near the boundary without requesting a second,
      // regional photographic scene while the miniature is still in use.
      if (!wanted) {
        firstViewDeadline.cancel();
        report('Diorama · photographic engine ready');
        return false;
      }
      if (!firstViewReady) firstViewDeadline.start();
      const key = [pose.lon, pose.lat, pose.dist, pose.pitch, pose.bearing,
        pose.fov, pose.targetAltitude, pose.flightView?.lon, pose.flightView?.lat,
        pose.flightView?.height, pose.flightView?.heading, pose.flightView?.pitch, w, h].join(':');
      if (key !== lastPoseKey) {
        lastPoseKey = key; lastMotion = performance.now();
        if (w !== resizedWidth || h !== resizedHeight) {
          viewer.resize(); resizedWidth = w; resizedHeight = h;
        }
        setCamera(pose, w, h);
      }
      // Establish complete neighborhood coverage before requesting the finest
      // level. Stationary detail follows the current device/retry budget.
      const detail = !firstViewReady ? 16 : performance.now() - lastMotion < 180 ? 12 : budget.detail;
      if (tileset.maximumScreenSpaceError !== detail) {
        tileset.maximumScreenSpaceError = detail; viewer.scene.requestRender();
      }
      viewer.entities.show = state.layers.landmarks;
      visibleTiles = 0; detailTiles = 0; bestError = Infinity;
      try { viewer.render(); } catch(error) { unavailable(error,'render'); return false; }
      if(failed||disposed)return false;
      if (visibleTiles) {
        message.dataset.visibleTiles = String(visibleTiles);
        message.dataset.detailTiles = String(detailTiles);
        message.dataset.bestError = String(Math.round(bestError));
      }
      // Keep the miniature visible through the initial coarse/empty frames.
      // Require neighborhood geometry AND a completed initial view; a handful
      // of fine tiles must not reveal a mostly coarse, partially loaded scene.
      if (!firstViewReady && photoReady(detailTiles, visibleTiles, tileset.tilesLoaded)) {
        firstViewReady = true; firstViewDeadline.cancel();
      }
      present(wanted && firstViewReady);
      report(active ? pending ? `Photographic 3D · refining ${pending} tiles`
        : 'Photographic 3D · full detail' : pending
        ? `Preparing photographic detail · ${pending} tiles` : 'Preparing photographic detail…');
      return active;
    },
    capture() {
      viewer.scene.requestRender(); viewer.render();
      const source = viewer.canvas, canvas = document.createElement('canvas');
      canvas.width = source.width;
      const ctx = canvas.getContext('2d');
      ctx.font = '14px sans-serif';
      const words = ('Google Maps · Cesium ion · ' + credits.textContent).replace(/\s+/g, ' ').split(' ');
      const lines = []; let line = '';
      for (const word of words) {
        if (ctx.measureText(line + word).width > canvas.width - 36) {
          lines.push(line); line = '';
        }
        line += `${word} `;
      }
      lines.push(line);
      canvas.height = source.height + Math.max(60, lines.length * 19 + 24);
      ctx.drawImage(source, 0, 0); ctx.fillStyle = '#152f3b';
      ctx.fillRect(0, source.height, canvas.width, canvas.height - source.height);
      ctx.fillStyle = '#fff'; ctx.font = '14px sans-serif';
      lines.forEach((text, i) => ctx.fillText(text, 16, source.height + 24 + i * 19));
      return canvas;
    },
    dispose() {
      disposed = true; resourceDeadline.dispose(); firstViewDeadline.dispose(); unsubscribe();
      stage.removeEventListener('pointerdown', down); stage.removeEventListener('pointerup', up);
      destroyRenderer();present(false);host.remove();select.onchange=null;retry.onclick=null;
    },
  };
}
