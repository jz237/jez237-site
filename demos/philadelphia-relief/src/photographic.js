import { selectPhotoMode, photoAllowed, photoWanted, photoCamera, photoReady, photoTileReady,
  photoLandmarkVisible, photoBudget, photoFailure, photoViewMoved, PHOTO_PRELOAD }
  from './photo-policy.js?v=philly-2026092121';
import { createVisibleTimeout } from './visible-timeout.js?v=philly-2026101001';
import { createPhotoTraffic } from './photo-traffic.js?v=philly-2026101502';

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
  let viewer, tileset, photoTraffic, loading = false, failed = false, disposed = false;
  let active = false, wanted = false, firstViewReady = false, visibleTiles = 0;
  let pending = 0, lastPoseKey = '', lastMotion = -Infinity, motionAnchor, lastStatus = '';
  let drawnPose, deferredPose = false, previousMovingFrame, slowFrames = 0;
  let detailPending = false, nextDetailStep = 0;
  let progressPhase, progressAt = -Infinity, flightBackground;
  let lastPose, width = 1, height = 1, detailTiles = 0, bestError = Infinity, generation = 0;
  let press, exhibitBounds, conservative=false,budget;
  const resourceDeadline=createVisibleTimeout(document,()=>unavailable(null,'timeout'),45000);
  const firstViewDeadline=createVisibleTimeout(document,()=>unavailable(null,'timeout'),90000);
  // Keep a warm renderer through brief zoom/layer changes, then free its GPU
  // resources if the user stays outside photographic coverage.
  const idleRelease=createVisibleTimeout(document,()=>release(),30000);
  let resizedWidth = 0, resizedHeight = 0, budgetQuality, budgetDpr;

  function report(text, phase) {
    if (phase && progressPhase === phase && performance.now() - progressAt < 250) return;
    if (phase) progressAt = performance.now();
    progressPhase = phase;
    if (text === lastStatus) return;
    lastStatus = text; message.textContent = text;
  }
  function viewSettled() {
    return !!tileset?.tilesLoaded && pending === 0 && !detailPending;
  }
  function updateDetail(target, time) {
    const current = tileset.maximumScreenSpaceError;
    const adjusted = tileset.memoryAdjustedScreenSpaceError;
    const used = tileset.totalMemoryUsageInBytes;
    detailPending = false;

    // The Cesium setter also resets its memory-adjusted error. Preserve that
    // learned limit unless navigation calls for a materially coarser view.
    const constrained = adjusted > current;
    if (current === target || (constrained && target <= (target > current ? adjusted * 1.25 : adjusted))) {
      if (current === target) nextDetailStep = 0;
      if (constrained && target < adjusted && used < tileset.cacheBytes) {
        // Paused traffic and power saving still need real draws while Cesium
        // relaxes its limit, even when our configured target already matches.
        detailPending = true; viewer.scene.requestRender();
      }
      return;
    }

    // The overflow allowance keeps the previous block visible while loading
    // the next one. At the normal cache limit, refine one level at a time and
    // let its requests enter the queue before asking for another level.
    let next = target;
    if (target < current && used >= tileset.cacheBytes) {
      detailPending = true;
      if (!tileset.tilesLoaded || time < nextDetailStep) return;
      next = Math.max(target, current / 2);
    }
    detailPending = next !== target;
    nextDetailStep = detailPending ? time + 160 : 0;
    tileset.maximumScreenSpaceError = next;
    viewer.scene.requestRender();
  }
  function applyBudget(w, h, quality) {
    const dpr = window.devicePixelRatio;
    const resized = w !== resizedWidth || h !== resizedHeight;
    if (!budget || resized || quality !== budgetQuality || dpr !== budgetDpr) {
      budget = photoBudget(w, h, dpr, quality, conservative);
      budgetQuality = quality; budgetDpr = dpr;
      const scaleChanged = viewer.resolutionScale !== budget.scale;
      if (scaleChanged) viewer.resolutionScale = budget.scale;
      if (resized || scaleChanged) viewer.resize();
      resizedWidth = w; resizedHeight = h;
    }
    if (tileset) {
      if (tileset.cacheBytes !== budget.cacheBytes) tileset.cacheBytes = budget.cacheBytes;
      if (tileset.maximumCacheOverflowBytes !== budget.overflowBytes) {
        tileset.maximumCacheOverflowBytes = budget.overflowBytes;
      }
    }
  }
  function present(on) {
    if (active === on) return;
    active = on;
    photoTraffic?.show(on);
    host.classList.toggle('visible', on);
    document.body.classList.toggle('photographic-view', on);
    credits.hidden = !on;
  }
  function unavailable(error,phase='render') {
    if(disposed||failed)return;
    const ticket=++generation;
    failed = true; loading = false; present(false);
    firstViewDeadline.cancel(); resourceDeadline.cancel(); idleRelease.cancel();
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
    drawnPose = { ...pose, aspect: w / h }; deferredPose = false;
    updateLandmarks(pose);
    camera.frustum.fov = mapped.fov;
    const flight = !!pose.flightView;
    if (flightBackground !== flight) {
      viewer.scene.backgroundColor = C.Color.fromCssColorString(flight ? '#bacfdc' : '#203b43');
      flightBackground = flight;
    }
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
      const visible=photoLandmarkVisible(entity.reliefPlace,pose,exhibitBounds);
      if(entity.show!==visible)entity.show=visible;
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
      photoTraffic=createPhotoTraffic(C,viewer);
      // The relief rig owns the camera. Tile collision data is used only to
      // anchor labels to their actual roofs, not to move that shared camera.
      viewer.scene.screenSpaceCameraController.enableCollisionDetection = false;
      applyBudget(width, height, store.value('quality'));
      viewer.scene.postProcessStages.fxaa.enabled = true;
      setCamera(lastPose, width, height);
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
      // In request-render mode an update may leave the previous frame on screen.
      // Count tiles during actual draws so paused traffic keeps the visible view's statistics.
      viewer.scene.preRender.addEventListener(() => {
        visibleTiles = 0; detailTiles = 0; bestError = Infinity;
      });
      tileset.tileVisible.addEventListener(tile => {
        visibleTiles++;
        bestError = Math.min(bestError, tile.geometricError);
        if (photoTileReady(tile.geometricError, lastPose?.flightView?.height, lastPose?.dist)) detailTiles++;
      });
      tileset.loadProgress.addEventListener((requests, processing) => {
        pending = requests + processing;
      });
      viewer.scene.postRender.addEventListener(() => {
        const data = message.dataset;
        const visible = String(visibleTiles), detail = String(detailTiles);
        if (data.visibleTiles !== visible) data.visibleTiles = visible;
        if (data.detailTiles !== detail) data.detailTiles = detail;
        if (Number.isFinite(bestError)) {
          const error = String(Math.round(bestError));
          if (data.bestError !== error) data.bestError = error;
        } else if (data.bestError !== undefined) delete data.bestError;
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
  const unsubscribe = store.subscribe((state, changed) => {
    if (changed.has('photoMode')) select.value = state.photoMode;
  });
  select.value = store.value('photoMode');
  select.onchange = () => store.set(selectPhotoMode(select.value), { source: 'photo-mode' });
  function destroyRenderer(){
    photoTraffic?.dispose();photoTraffic=undefined;
    if (viewer && !viewer.isDestroyed()) viewer.destroy();
    viewer=undefined;tileset=undefined;
    firstViewReady = false; lastPoseKey = ''; pending = 0;
    motionAnchor=undefined;lastMotion=-Infinity;flightBackground=undefined;
    drawnPose=undefined;deferredPose=false;previousMovingFrame=undefined;slowFrames=0;
    detailPending=false;nextDetailStep=0;
    budget=undefined;resizedWidth=0;resizedHeight=0;
    visibleTiles=0;detailTiles=0;bestError=Infinity;
    host.replaceChildren();credits.replaceChildren();
    delete message.dataset.visibleTiles;delete message.dataset.detailTiles;delete message.dataset.bestError;
  }
  function release() {
    generation++; firstViewDeadline.cancel(); resourceDeadline.cancel(); idleRelease.cancel();
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
    stats: () => ({ active, wanted, loading, failed, pending, settled: viewSettled(),
      firstViewReady, visibleTiles, detailTiles, traffic:photoTraffic?.stats() }),
    update(pose, state, w, h, cars) {
      if(disposed)return false;
      lastPose = pose; width = w; height = h;
      if (state.lightweight) {
        if (viewer || loading || failed) release();
        wanted = false; report('Lighter graphics · photographic 3D paused'); return false;
      }
      if (state.photoMode === 'relief') {
        // Explicitly leaving Photo also cancels pending initialization. Its
        // late promises must not recreate a hidden viewer or stale error.
        if (viewer || loading || failed) release();
        wanted = false; report('Diorama · photographic detail off'); return false;
      }
      wanted = !isOverlayActive() && photoWanted(state, pose.dist, wanted);
      if (!wanted) {
        present(false);
        previousMovingFrame=undefined;slowFrames=0;
        detailPending=false;nextDetailStep=0;
        firstViewDeadline.cancel();
      }
      if (failed) return false;
      const preload = !isOverlayActive() && photoAllowed(state)
        && (wanted || pose.dist <= PHOTO_PRELOAD);
      if (preload) idleRelease.cancel();
      if (preload && !viewer) void start();
      if (!preload) {
        if (viewer || loading) idleRelease.start();
        report(photoAllowed(state) ? 'Diorama · zoom in for photographic 3D'
          : 'Relief map · historical or map layers active');
        return false;
      }
      if (!viewer || !tileset || loading) return false;
      const resized = w !== resizedWidth || h !== resizedHeight;
      applyBudget(w, h, state.quality);
      // Warm the engine near the boundary without requesting a second,
      // regional photographic scene while the miniature is still in use.
      if (!wanted) {
        firstViewDeadline.cancel();
        report('Diorama · photographic engine ready');
        return false;
      }
      if (!firstViewReady) firstViewDeadline.start();
      const time = performance.now();
      const key = [pose.lon, pose.lat, pose.dist, pose.pitch, pose.bearing,
        pose.fov, pose.targetAltitude, pose.flightView?.lon, pose.flightView?.lat,
        pose.flightView?.height, pose.flightView?.heading, pose.flightView?.pitch,
        pose.flightView?.clearance, w, h].join(':');
      if (key !== lastPoseKey) {
        lastPoseKey = key;
        if (resized || photoViewMoved(motionAnchor, pose, h)) {
          motionAnchor = { ...pose }; lastMotion = time;
        }
        // Each Cesium camera change rechecks the surface beneath the eye.
        // Accumulate fractional pixels and apply the exact final pose once.
        if (resized || drawnPose?.aspect !== w / h || photoViewMoved(drawnPose, pose, h, .5)) {
          setCamera(pose, w, h);
        }
        else deferredPose = true;
      } else if (deferredPose) {
        setCamera(pose, w, h);
      }
      // Establish complete neighborhood coverage before requesting the finest
      // level. Stationary detail follows the current device/retry budget.
      const moving = time - lastMotion < 180;
      // A sustained slow gesture can traverse hundreds of meshes per frame.
      // Hold the lighter moving target through that gesture to avoid tile churn.
      const adaptMotion = firstViewReady && moving
        && (state.quality === 'auto' || state.quality === 'performance');
      if (adaptMotion) {
        const interval = time - previousMovingFrame;
        if (interval >= 1000) slowFrames = 0;
        else if (slowFrames < 3) slowFrames = interval > 32 ? slowFrames + 1 : 0;
        previousMovingFrame = time;
      } else {
        previousMovingFrame = undefined; slowFrames = 0;
      }
      updateDetail(!firstViewReady ? 16 : moving ? (slowFrames === 3 ? 24 : 12) : budget.detail, time);
      if (viewer.entities.show !== state.layers.landmarks) viewer.entities.show = state.layers.landmarks;
      try {
        if (cars) photoTraffic.update(cars, moving);
        viewer.render();
      } catch(error) { unavailable(error,'render'); return false; }
      if(failed||disposed)return false;
      // Keep the miniature visible through the initial coarse/empty frames.
      // Require neighborhood geometry AND a completed initial view; a handful
      // of fine tiles must not reveal a mostly coarse, partially loaded scene.
      if (!firstViewReady && photoReady(detailTiles, visibleTiles, tileset.tilesLoaded)) {
        firstViewReady = true; firstViewDeadline.cancel();
      }
      present(wanted && firstViewReady);
      if (active && !viewSettled()) {
        const progress = pending ? `Photographic 3D · refining ${pending} tiles`
          : 'Photographic 3D · refining detail';
        report(progress, 'refining');
      } else if (active) {
        report(moving ? 'Photographic 3D · navigating' : 'Photographic 3D · full detail');
      } else {
        const progress = pending ? `Preparing photographic detail · ${pending} tiles`
          : 'Preparing photographic detail…';
        report(progress, pending ? 'preparing' : undefined);
      }
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
      disposed = true; resourceDeadline.dispose(); firstViewDeadline.dispose(); idleRelease.dispose();
      unsubscribe();
      stage.removeEventListener('pointerdown', down); stage.removeEventListener('pointerup', up);
      destroyRenderer();present(false);host.remove();select.onchange=null;retry.onclick=null;
    },
  };
}
