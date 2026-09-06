/**
 * Orbit / pan / zoom / pitch / bearing rig.
 *
 * The camera always looks at a target point on the ground, described in the
 * store as lon/lat plus an orbit distance, bearing and pitch. Keeping the pose
 * in geographic terms (rather than as a raw position vector) is what lets
 * presets, the URL hash and the readout all speak the same language.
 *
 * Pointer events cover mouse, pen and touch in one path:
 *   drag                    pan the target across the ground
 *   right / middle / shift  orbit (bearing + pitch)
 *   wheel / pinch           zoom
 *   two-finger drag         orbit; pinch distance zooms at the same time
 */

import { damp, clamp, normalizeAngle, shortestAngleDelta } from './geo.js?v=philly-2026090610';
import { CAMERA } from './schema.js?v=philly-2026090610';

const DEG = Math.PI / 180;

export function createCameraRig(THREE, options) {
  const { store, dom, projection, sampleElevation, getExaggeration, onInteract } = options;

  const camera = new THREE.PerspectiveCamera(42, 1, 8, 400000);

  const want = poseFromStore(store.get());
  const now = { ...want };
  let revision = 0;
  let lastExaggeration = NaN;
  let projectionAspect = NaN;
  let projectionNear = NaN;
  let projectionFar = NaN;
  let userActive = false;
  let idleTimer = 0;

  const pointers = new Map();
  let mode = null;              // 'pan' | 'orbit'
  let last = null;
  let lastPinch = 0;
  let captured = false;
  let pressStart = null;

  function poseFromStore(state) {
    return {
      lon: state.camLon,
      lat: state.camLat,
      dist: state.camDist,
      bearing: state.camBearing,
      pitch: state.camPitch,
      fov: state.fov,
    };
  }

  /** Ground metres covered by one screen pixel at the orbit target. */
  function metersPerPixel() {
    const h = dom.clientHeight || 1;
    return (2 * Math.tan((now.fov * DEG) / 2) * now.dist) / h;
  }

  function pushToStore() {
    store.set({
      camLon: want.lon,
      camLat: want.lat,
      camDist: want.dist,
      camBearing: want.bearing,
      camPitch: want.pitch,
    }, { source: 'user' });
  }

  function markInteraction() {
    userActive = true;
    idleTimer = 0;
    if (onInteract) onInteract();
  }

  function pan(dxPx, dyPx) {
    const mpp = metersPerPixel();
    // Screen-space drag, rotated into world space by the current bearing.
    const b = now.bearing * DEG;
    const sin = Math.sin(b);
    const cos = Math.cos(b);
    // Dragging down should pull the ground toward the viewer, so the sign of
    // the forward component follows the pitch-projected screen axis.
    const forward = dyPx * mpp / Math.max(0.35, Math.sin(now.pitch * DEG));
    const right = -dxPx * mpp;

    const east = right * cos + forward * sin;
    const north = -right * sin + forward * cos;

    const lat = want.lat + north / projection.metersPerDegLat;
    const lon = want.lon + east / projection.metersPerDegLon;
    const clamped = projection.clamp(lon, lat);
    want.lon = clamped.lon;
    want.lat = clamped.lat;
  }

  function orbit(dxPx, dyPx) {
    want.bearing = normalizeAngle(want.bearing - dxPx * 0.25);
    want.pitch = clamp(want.pitch - dyPx * 0.22, CAMERA.camPitch.min, CAMERA.camPitch.max);
  }

  function zoom(factor, anchorPx) {
    const before = want.dist;
    want.dist = clamp(want.dist * factor, CAMERA.camDist.min, CAMERA.camDist.max);
    if (!anchorPx || before === want.dist) return;

    // Keep the ground under the cursor roughly fixed while zooming, which is
    // what makes wheel-zoom feel like it is pulling toward a place rather than
    // toward the centre of the screen.
    const rect = dom.getBoundingClientRect();
    const offX = anchorPx.x - (rect.left + rect.width / 2);
    const offY = anchorPx.y - (rect.top + rect.height / 2);
    const shift = (before - want.dist) / Math.max(before, 1);
    const mpp = (2 * Math.tan((now.fov * DEG) / 2) * before) / (rect.height || 1);
    const b = now.bearing * DEG;
    const east = (offX * mpp * Math.cos(b)
      + (offY * mpp / Math.max(0.35, Math.sin(now.pitch * DEG))) * Math.sin(b)) * shift;
    const north = (-offX * mpp * Math.sin(b)
      + (offY * mpp / Math.max(0.35, Math.sin(now.pitch * DEG))) * Math.cos(b)) * shift;
    const clamped = projection.clamp(
      want.lon + east / projection.metersPerDegLon,
      want.lat + north / projection.metersPerDegLat);
    want.lon = clamped.lon;
    want.lat = clamped.lat;
  }

  // ---- pointer plumbing ---------------------------------------------------

  function onPointerDown(event) {
    if (event.button !== undefined && event.button > 2) return;
    // Capture is taken lazily, on the first real movement. The rig listens on
    // the whole stage so a drag that begins on a map label still pans; taking
    // capture immediately would retarget pointerup and swallow the label's
    // own click, so a clean tap must never trigger it.
    pressStart = { x: event.clientX, y: event.clientY, id: event.pointerId };
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.size === 1) {
      mode = (event.button === 2 || event.button === 1 || event.shiftKey) ? 'orbit' : 'pan';
      last = { x: event.clientX, y: event.clientY };
    } else if (pointers.size === 2) {
      mode = 'orbit';
      lastPinch = pinchDistance();
      last = pinchCenter();
    }
    markInteraction();
  }

  function onPointerMove(event) {
    if (!pointers.has(event.pointerId)) return;
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (!captured && pressStart && pressStart.id === event.pointerId
      && Math.hypot(event.clientX - pressStart.x, event.clientY - pressStart.y) > 3) {
      dom.setPointerCapture?.(event.pointerId);
      captured = true;
    }
    markInteraction();

    if (pointers.size >= 2) {
      const dist = pinchDistance();
      const center = pinchCenter();
      if (lastPinch > 0 && dist > 0) zoom(lastPinch / dist, center);
      if (last) orbit((center.x - last.x) * 0.7, (center.y - last.y) * 0.7);
      lastPinch = dist;
      last = center;
    } else if (last) {
      const dx = event.clientX - last.x;
      const dy = event.clientY - last.y;
      if (mode === 'orbit') orbit(dx, dy); else pan(dx, dy);
      last = { x: event.clientX, y: event.clientY };
    }
    pushToStore();
  }

  function onPointerUp(event) {
    pointers.delete(event.pointerId);
    if (captured) {
      try { dom.releasePointerCapture?.(event.pointerId); } catch { /* already released */ }
      captured = false;
    }
    pressStart = null;
    if (pointers.size === 0) {
      mode = null;
      last = null;
      lastPinch = 0;
    } else if (pointers.size === 1) {
      const only = [...pointers.values()][0];
      last = { x: only.x, y: only.y };
      mode = 'pan';
      lastPinch = 0;
    }
  }

  function pinchDistance() {
    const [a, b] = [...pointers.values()];
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  function pinchCenter() {
    const [a, b] = [...pointers.values()];
    return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
  }

  function onWheel(event) {
    event.preventDefault();
    markInteraction();
    // Normalise line/page deltas so a trackpad and a mouse wheel agree.
    const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? 400 : 1;
    const delta = clamp(event.deltaY * unit, -240, 240);
    zoom(Math.exp(delta * 0.0016), { x: event.clientX, y: event.clientY });
    pushToStore();
  }

  function onContextMenu(event) {
    event.preventDefault();
  }

  dom.addEventListener('pointerdown', onPointerDown);
  dom.addEventListener('pointermove', onPointerMove);
  dom.addEventListener('pointerup', onPointerUp);
  dom.addEventListener('pointercancel', onPointerUp);
  dom.addEventListener('wheel', onWheel, { passive: false });
  dom.addEventListener('contextmenu', onContextMenu);

  // External state changes (presets, flythrough, URL, keyboard) retarget the
  // rig without fighting whatever the pointer is doing.
  const unsubscribe = store.subscribe((state, changed) => {
    if (state.lastChangeSource === 'user') return;
    let touched = false;
    for (const key of ['camLon', 'camLat', 'camDist', 'camBearing', 'camPitch', 'fov']) {
      if (changed.has(key)) touched = true;
    }
    if (!touched) return;
    const next = poseFromStore(state);
    want.lon = next.lon; want.lat = next.lat; want.dist = next.dist;
    want.bearing = next.bearing; want.pitch = next.pitch; want.fov = next.fov;
  });

  const targetVec = new THREE.Vector3();

  return {
    camera,

    get interacting() {
      return userActive;
    },

    /** True while a pointer is actually down on the canvas. */
    get dragging() {
      return pointers.size > 0;
    },

    /** Changes only while the camera matrix actually changes. */
    get revision() {
      return revision;
    },

    /** Current smoothed pose, for the readout. */
    pose() {
      return { ...now };
    },

    metersPerPixel,

    /** Nudge the pose from the keyboard. */
    nudge(patch) {
      markInteraction();
      if (patch.bearing) want.bearing = normalizeAngle(want.bearing + patch.bearing);
      if (patch.pitch) {
        want.pitch = clamp(want.pitch + patch.pitch, CAMERA.camPitch.min, CAMERA.camPitch.max);
      }
      if (patch.zoom) {
        want.dist = clamp(want.dist * patch.zoom, CAMERA.camDist.min, CAMERA.camDist.max);
      }
      if (patch.panX || patch.panY) pan(patch.panX || 0, patch.panY || 0);
      pushToStore();
    },

    update(dt, opts = {}) {
      const snap = opts.snap === true;
      const prevLon = now.lon;
      const prevLat = now.lat;
      const prevDist = now.dist;
      const prevPitch = now.pitch;
      const prevBearing = now.bearing;
      const prevFov = now.fov;
      const targetFov = store.get().fov;
      // A follow that is fast enough to feel direct while still smoothing out
      // pointer jitter and the flythrough's per-frame retargeting.
      const hl = snap ? 0 : 0.075;
      now.lon = damp(now.lon, want.lon, hl, dt);
      now.lat = damp(now.lat, want.lat, hl, dt);
      now.dist = Math.exp(damp(Math.log(now.dist), Math.log(want.dist), hl, dt));
      now.pitch = damp(now.pitch, want.pitch, hl, dt);
      now.fov = damp(now.fov, targetFov, snap ? 0 : 0.12, dt);
      // Bearing wraps, so damp the delta rather than the absolute value.
      now.bearing = normalizeAngle(
        now.bearing + shortestAngleDelta(now.bearing, want.bearing)
          * (snap ? 1 : 1 - Math.pow(2, -dt / 0.075)));

      // Exponential smoothing otherwise approaches forever. Snap only once
      // the remaining differences are far below a visible sub-pixel change,
      // allowing projection and label work to become genuinely idle.
      if (Math.abs(now.lon - want.lon) < 1e-9) now.lon = want.lon;
      if (Math.abs(now.lat - want.lat) < 1e-9) now.lat = want.lat;
      if (Math.abs(now.dist - want.dist) < 1e-4) now.dist = want.dist;
      if (Math.abs(now.pitch - want.pitch) < 1e-6) now.pitch = want.pitch;
      if (Math.abs(now.fov - targetFov) < 1e-6) now.fov = targetFov;
      if (Math.abs(shortestAngleDelta(now.bearing, want.bearing)) < 1e-6) {
        now.bearing = want.bearing;
      }

      const exag = getExaggeration();
      const groundY = sampleElevation(now.lon, now.lat) * exag;
      targetVec.set(projection.lonToX(now.lon), groundY, projection.latToZ(now.lat));

      const changed = now.lon !== prevLon || now.lat !== prevLat
        || now.dist !== prevDist || now.pitch !== prevPitch
        || now.bearing !== prevBearing || now.fov !== prevFov
        || exag !== lastExaggeration;

      const pitchRad = now.pitch * DEG;
      const bearingRad = now.bearing * DEG;
      const horizontal = now.dist * Math.sin(pitchRad);
      const vertical = now.dist * Math.cos(pitchRad);

      if (changed) {
        camera.position.set(
          targetVec.x - Math.sin(bearingRad) * horizontal,
          targetVec.y + vertical,
          targetVec.z + Math.cos(bearingRad) * horizontal);
      }

      // Exaggeration multiplies the vertical world, so a steep pitch at close
      // range can put the camera inside a hillside — the ground rears up as
      // giant spikes and the shot is ruined. Lift the eye clear of whatever is
      // actually underneath it and re-aim; the effective pitch eases off, which
      // is exactly what a pilot would do.
      if (changed) {
        const eye = projection.clamp(
          projection.xToLon(camera.position.x), projection.zToLat(camera.position.z));
        const groundUnderEye = sampleElevation(eye.lon, eye.lat) * exag;
        const clearance = Math.max(45, now.dist * 0.06);
        if (camera.position.y < groundUnderEye + clearance) {
          camera.position.y = groundUnderEye + clearance;
        }

        camera.up.set(0, 1, 0);
        camera.lookAt(targetVec);
        revision += 1;
      }

      if (camera.fov !== now.fov) {
        camera.fov = now.fov;
        camera.updateProjectionMatrix();
      }
      lastExaggeration = exag;

      if (userActive && pointers.size === 0) {
        idleTimer += dt;
        if (idleTimer > 0.35) userActive = false;
      }
      return { target: targetVec, groundY, changed };
    },

    setAspect(aspect) {
      // Near/far track the orbit distance so precision stays usable at both
      // the source-quality close-view floor and 190 km without clipping.
      const near = clamp(now.dist * 0.008, 2, 400);
      const far = Math.max(60000, now.dist * 6 + 260000);
      if (aspect !== projectionAspect || near !== projectionNear || far !== projectionFar) {
        projectionAspect = aspect;
        projectionNear = near;
        projectionFar = far;
        camera.aspect = aspect;
        camera.near = near;
        camera.far = far;
        camera.updateProjectionMatrix();
      }
    },

    dispose() {
      unsubscribe();
      dom.removeEventListener('pointerdown', onPointerDown);
      dom.removeEventListener('pointermove', onPointerMove);
      dom.removeEventListener('pointerup', onPointerUp);
      dom.removeEventListener('pointercancel', onPointerUp);
      dom.removeEventListener('wheel', onWheel);
      dom.removeEventListener('contextmenu', onContextMenu);
    },
  };
}
