/** Viewport coverage, bounded streaming, and directional look-ahead. */
import { fetchTile } from './tile-cache.js?v=philly-2026090907';
export { fetchTile };
import { imageryFocus, detailResolutionM } from './imagery-detail.js?v=philly-2026090907';

export const TILE_SPECS = [
  { tier: 'tile-inspection', lon: 0.0032, lat: 0.0024, range: 600 },
  { tier: 'tile-rooftop', lon: 0.0128, lat: 0.0096, range: 2400 },
  { tier: 'tile-ultra', lon: 0.0512, lat: 0.0384, range: 9600 },
  { tier: 'tile-detail', lon: 0.1024, lat: 0.0768, range: Infinity },
];
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
const RAD = Math.PI / 180;

export function tileAt(lon, lat, region, level) {
  const spec = TILE_SPECS[level];
  // Same origin, quantization and boundary clamping as the image endpoint.
  const x = clamp(region.west + Math.round((lon - region.west) / spec.lon) * spec.lon,
    region.west + spec.lon / 2, region.east - spec.lon / 2);
  const y = clamp(region.south + Math.round((lat - region.south) / spec.lat) * spec.lat,
    region.south + spec.lat / 2, region.north - spec.lat / 2);
  return { tier: spec.tier, level, lon: x, lat: y,
    key: `${spec.tier}:${x.toFixed(4)},${y.toFixed(4)}`,
    bounds: { west: x - spec.lon / 2, east: x + spec.lon / 2,
      south: y - spec.lat / 2, north: y + spec.lat / 2 } };
}

/** Ray / target-height plane intersection; rays above the horizon are omitted. */
export function groundPoint(pose, projection, aspect, sx, sy, horizon = false) {
  const p = pose.pitch * RAD, b = pose.bearing * RAD;
  const lens = Math.tan((pose.fov || 42) * RAD / 2);
  const dy = -Math.cos(p) + sy * lens * Math.sin(p);
  const rayLength = Math.sqrt(1 + lens * lens * (sx * sx * aspect * aspect + sy * sy));
  if (dy >= -0.015 && !horizon) return null;
  const t = horizon ? Math.min(24000 / rayLength, dy < 0 ? pose.dist * Math.cos(p) / -dy : Infinity)
    : pose.dist * Math.cos(p) / -dy;
  const forward = Math.sin(p) + sy * lens * Math.cos(p);
  const east = -pose.dist * Math.sin(p) * Math.sin(b)
    + t * (forward * Math.sin(b) + sx * lens * aspect * Math.cos(b));
  const north = -pose.dist * Math.sin(p) * Math.cos(b)
    + t * (forward * Math.cos(b) - sx * lens * aspect * Math.sin(b));
  const distance = t * Math.sqrt(1 + lens * lens * (sx * sx * aspect * aspect + sy * sy));
  if (distance > 24000.001) return null;
  return { lon: pose.lon + east / projection.metersPerDegLon,
    lat: pose.lat + north / projection.metersPerDegLat, distance };
}

export function planImageryTiles(pose, region, projection, aspect = 1, mode = 'standard', previous = null) {
  if (pose.dist > 24000) return { visible: [], ahead: [] };
  const focus = imageryFocus(pose, projection);
  const found = new Map();
  const samples = [];
  // Each screen quad contributes the cells covering its ground bounding box.
  // This fills between samples, including on wide screens and rotated views.
  for (let y = 0; y <= 4; y++) {
    samples[y] = [];
    for (let x = 0; x <= 4; x++) {
      samples[y][x] = groundPoint(pose, projection, aspect, x / 2 - 1, y / 2 - 1, true);
    }
  }
  for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) {
    const points = [samples[y][x], samples[y][x + 1], samples[y + 1][x],
      samples[y + 1][x + 1]].filter(Boolean);
    if (!points.length) continue;
    const distance = Math.max(...points.map(p => p.distance));
    let level = mode === 'data' ? 3 : TILE_SPECS.findIndex(s => distance <= s.range);
    const west = Math.max(region.west, Math.min(...points.map(p => p.lon)));
    const east = Math.min(region.east, Math.max(...points.map(p => p.lon)));
    const south = Math.max(region.south, Math.min(...points.map(p => p.lat)));
    const north = Math.min(region.north, Math.max(...points.map(p => p.lat)));
    if (west > east || south > north) continue;
    while (level < 3 && (east - west) / TILE_SPECS[level].lon
        * (north - south) / TILE_SPECS[level].lat > 12) level++;
    const spec = TILE_SPECS[level];
    for (let yy = south; yy <= north + spec.lat / 2; yy += spec.lat / 2) {
      for (let xx = west; xx <= east + spec.lon / 2; xx += spec.lon / 2) {
        const cell = tileAt(Math.min(xx, east), Math.min(yy, north), region, level);
        cell.priority = Math.hypot((cell.lon - focus.lon) * projection.metersPerDegLon,
          (cell.lat - focus.lat) * projection.metersPerDegLat) + level * 100;
        found.set(cell.key, cell);
      }
    }
  }
  const visible = [...found.values()].sort((a, b) => a.priority - b.priority).slice(0, 24);
  const ahead = [];
  if (previous && mode !== 'data' && visible.length) {
    const dx = pose.lon - previous.lon, dy = pose.lat - previous.lat;
    if (Math.hypot(dx * projection.metersPerDegLon, dy * projection.metersPerDegLat) > 2) {
      const spec = TILE_SPECS[visible[0].level];
      const length = Math.hypot(dx / spec.lon, dy / spec.lat);
      const candidates = visible.map(cell => tileAt(cell.lon + dx / length,
        cell.lat + dy / length, region, cell.level));
      for (const cell of candidates) {
        if (!found.has(cell.key) && !ahead.some(c => c.key === cell.key)) ahead.push(cell);
        if (ahead.length === 2) break;
      }
    }
  }
  return { visible, ahead };
}

/** Predict the next closer level without changing the visible coverage plan. */
export function zoomAhead(pose, previous, region, projection, aspect, mode, visible) {
  if (mode === 'data' || !previous || pose.dist >= previous.dist * .985) return [];
  const next = { ...pose, dist: Math.max(200, pose.dist * .65) };
  const current = new Set(visible.map(c => c.key));
  const level = Math.min(...visible.map(c => c.level));
  return planImageryTiles(next, region, projection, aspect, mode).visible
    .filter(c => c.level < level && !current.has(c.key)).slice(0, 2);
}

/** Central refinement first; bounded, measured concurrency and opportunistic zoom preparation. */
export function createTileStream({ region, projection, load = fetchTile, install, remove,
  onStatus = () => {}, now = Date.now, connection = () => globalThis.navigator?.connection }) {
  const cache = new Map(), pending = new Map(), failed = new Map();
  let desired = [], ahead = [], zoom = [], previous = null, active = false, disposed = false, clock = 0;
  let lastStatus = { state: 'regional' }, finalSize = 2048, dataSaver = false;
  let direction = { lon: 0, lat: 0 }, travelledAt = 0, zoomedAt = 0;
  let limit = 3, fast = 0, typicalMs = 2000;
  const workSize = cell => cache.has(cell.key) ? finalSize : 512;
  const needsWork = cell => (cache.get(cell.key)?.size || 0) < finalSize;
  const cancel = (key, job) => { job.controller.abort(); pending.delete(key); };
  function report() {
    const shown = desired.map(c => cache.get(c.key)).filter(Boolean), first = shown[0];
    const visiblePending = desired.filter(c => pending.has(c.key)).length;
    const incomplete = active && desired.some(needsWork);
    lastStatus = { state: !active ? 'regional' : visiblePending ? 'loading'
      : incomplete ? 'unavailable' : shown.length ? 'active' : 'unavailable',
      active: !!shown.length, tier: first?.cell.tier.replace('tile-', '') || null,
      size: first?.size || 0,
      resolutionM: first ? detailResolutionM(first.cell, first.size, projection) : null,
      source: [...new Set(shown.map(e => e.source))].join(' · ') || null,
      visible: desired.length, loaded: shown.length, pending: pending.size,
      refining: shown.length === desired.length && !!visiblePending,
      preparing: pending.size - visiblePending, concurrency: dataSaver ? 2 : limit };
    onStatus(lastStatus);
  }
  function evict() {
    const wanted = new Set([...desired, ...ahead, ...zoom].map(c => c.key));
    let bytes = [...cache.values()].reduce((n, e) => n + e.size * e.size * 3, 0);
    for (const [key, entry] of [...cache].sort((a, b) => a[1].used - b[1].used)) {
      if (cache.size <= 32 && bytes <= 144 * 1024 * 1024) break;
      if (wanted.has(key)) continue;
      remove(key); cache.delete(key); bytes -= entry.size * entry.size * 3;
    }
  }
  function measure(ms, success) {
    typicalMs = typicalMs * .75 + Math.min(ms, 15000) * .25;
    if (!success || ms > 5000) { fast = 0; limit = 2; }
    else if (ms < 1800) { if (++fast >= 3) { limit = Math.min(5, limit + 1); fast = 0; } }
    else { fast = 0; limit = Math.max(2, limit - 1); }
  }
  function pump() {
    if (!active || disposed) return;
    const central = desired.slice(0, 2), outer = desired.slice(2);
    const entry = cell => ({ cell, size: workSize(cell) });
    const centralReady = central.every(c => cache.has(c.key));
    const queue = [
      ...central.filter(needsWork).map(entry),
      ...(!dataSaver && centralReady ? zoom.filter(needsWork)
        .map(cell => ({ cell, size: finalSize, speculative: true })) : []),
      ...outer.filter(c => !cache.has(c.key)).map(entry),
      ...outer.filter(c => cache.has(c.key) && needsWork(c)).map(entry),
      ...(!dataSaver && desired.every(c => !needsWork(c))
        ? ahead.filter(c => !cache.has(c.key)).map(cell => ({ cell, size: 512, speculative: true })) : []),
    ];
    const budget = dataSaver ? 2 : limit;
    for (const { cell, size, speculative = false } of queue) {
      if (pending.has(cell.key) || (failed.get(cell.key) || 0) > now()) continue;
      const jobs = [...pending.values()];
      if (speculative && (jobs.some(j => j.speculative) || pending.size >= budget
        || budget <= 2 && desired.some(needsWork))) continue;
      let rescue = false;
      if (pending.size >= budget) {
        // One rescue slot keeps a slow peripheral request from blocking central sharpness.
        const blocked = jobs.some(j => !central.some(c => c.key === j.cell.key)
          && (j.retainedUntil || now() - j.started > 4000));
        if (dataSaver || speculative || !central.some(c => c.key === cell.key)
          || !blocked || jobs.some(j => j.rescue) || pending.size >= 6) continue;
        rescue = true;
      }
      const controller = new AbortController();
      const job = { controller, cell, size, speculative, rescue, started: now(),
        progress: null, retainedUntil: 0 };
      pending.set(cell.key, job);
      const options = { maxSize: finalSize, progress: value => { job.progress = value; } };
      load(cell, size, controller.signal, options)
        .then(result => {
          if (disposed || controller.signal.aborted) return;
          if (!result.cached) measure(now() - job.started, true);
          const actualSize = result.size || size;
          if ((cache.get(cell.key)?.size || 0) > actualSize) return;
          const value = { ...result, cell, size: actualSize, used: ++clock };
          cache.set(cell.key, value); install(value); evict();
        }).catch(() => {
          if (!controller.signal.aborted) { failed.set(cell.key, now() + 30000); measure(0, false); }
        }).finally(() => {
          if (pending.get(cell.key) === job) pending.delete(cell.key);
          if (!disposed) { pump(); report(); }
        });
    }
  }
  return {
    consider(pose, enabled, width, ratio, quality, mode = 'standard', height = width) {
      active = enabled && pose.dist <= 24000;
      const network = connection();
      dataSaver = mode === 'data' || !!network?.saveData || /(^|-)2g$/.test(network?.effectiveType || '');
      if (previous) {
        const lon = pose.lon - previous.lon, lat = pose.lat - previous.lat;
        if (Math.hypot(lon * projection.metersPerDegLon, lat * projection.metersPerDegLat) > 2) {
          direction = { lon, lat }; travelledAt = now();
        }
        if (Math.abs(pose.dist - previous.dist) > pose.dist * .25) direction = { lon: 0, lat: 0 };
      }
      if (now() - travelledAt > 3500) direction = { lon: 0, lat: 0 };
      const lookBehind = { ...pose, lon: pose.lon - direction.lon, lat: pose.lat - direction.lat };
      const plan = active ? planImageryTiles(pose, region, projection, width / height, mode,
        lookBehind) : { visible: [], ahead: [] };
      const predicted = active && !dataSaver ? zoomAhead(pose, previous, region, projection,
        width / height, mode, plan.visible) : [];
      const jumped = previous && Math.hypot((pose.lon - previous.lon) * projection.metersPerDegLon,
        (pose.lat - previous.lat) * projection.metersPerDegLat) > Math.max(2000, pose.dist);
      if (predicted.length) { zoom = predicted; zoomedAt = now(); }
      else if (!active || dataSaver || jumped || now() - zoomedAt > 1800
        || previous && pose.dist > previous.dist * 1.05) zoom = [];
      previous = { ...pose }; desired = plan.visible; ahead = dataSaver ? [] : plan.ahead;
      zoom = zoom.filter(c => !desired.some(d => d.key === c.key));
      // Unchanged output detail policy; network adaptation never lowers resolution.
      finalSize = mode === 'data' || (quality === 'performance' && mode !== 'maximum')
        || desired.length > 12 ? 1024 : 2048;
      const wanted = new Set([...desired, ...ahead, ...zoom].map(c => c.key));
      let retained = 0;
      for (const [key, job] of pending) {
        if (!active) { cancel(key, job); continue; }
        if (job.retainedUntil && job.retainedUntil <= now() && !wanted.has(key)) {
          cancel(key, job); continue;
        }
        const age = now() - job.started, progress = job.progress;
        const nearlyDone = progress?.complete
          || progress?.total > 0 && progress.loaded / progress.total >= .7
          || age >= typicalMs * .7 && age < Math.min(8000, typicalMs * 1.5);
        const close = Math.hypot((job.cell.lon - pose.lon) * projection.metersPerDegLon,
          (job.cell.lat - pose.lat) * projection.metersPerDegLat) < Math.max(800, pose.dist * 1.2);
        const focusWaiting = desired.slice(0, 2).some(c => needsWork(c) && !pending.has(c.key));
        const preempt = job.speculative && focusWaiting && !nearlyDone;
        const unwanted = !wanted.has(key) || job.speculative && dataSaver || preempt;
        if (unwanted) {
          if (!dataSaver && !jumped && nearlyDone && close && retained++ < 1) {
            job.retainedUntil ||= now() + 1500;
          } else cancel(key, job);
        } else { job.retainedUntil = 0; job.speculative = !desired.some(c => c.key === key); }
      }
      for (const cell of desired) if (cache.has(cell.key)) cache.get(cell.key).used = ++clock;
      evict(); pump(); report();
    },
    stats() { return { ...lastStatus, visible: desired.length,
      cached: cache.size, pending: pending.size }; },
    retry() { failed.clear(); pump(); },
    dispose() { disposed = true; for (const job of pending.values()) job.controller.abort();
      for (const key of cache.keys()) remove(key); cache.clear(); pending.clear(); },
  };
}
/** Draped tile patches reuse the terrain's height texture and lighting uniforms. */
export function createImageryTiles(THREE, options) {
  let terrain = options.terrain;
  const { region, projection, sceneProjection, onStatus } = options;
  const group = new THREE.Group(); group.name = 'streamed-aerial-tiles';
  const entries = new Map();
  const vertexShader = `
    uniform sampler2D uHeight; uniform float uExag; uniform float uReliefOn;
    varying vec2 vUv; varying vec3 vWorld; varying float vElev;
    void main() { vUv = uv; vElev = texture2D(uHeight, position.xy).r;
      vWorld = vec3(position.z, vElev * uExag * uReliefOn + 0.12, normal.x);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(vWorld, 1.0); }
  `;
  const fragmentShader = `
    uniform sampler2D uTile; uniform float uCompareMode; uniform float uComparePosition;
    uniform sampler2D uPrevious; uniform float uBlend; uniform float uArrival;
    uniform float uViewportWidth; uniform vec3 uCameraPos; uniform float uFogDensity;
    uniform vec3 uFogColor; uniform float uImageryOn; varying vec2 vUv;
    varying vec3 vWorld; varying float vElev;
    void main() {
      if (uCompareMode > 0.5 && uCompareMode < 2.5) {
        if (gl_FragCoord.x / max(uViewportWidth, 1.0) > uComparePosition) discard;
      } else if (uImageryOn < 0.5) discard;
      vec3 c = mix(texture2D(uPrevious, vUv).rgb, texture2D(uTile, vUv).rgb, uBlend);
      c = pow(max(c, vec3(0.0)), vec3(0.98));
      c = mix(vec3(dot(c, vec3(0.2126,0.7152,0.0722))), c, 1.08);
      c = clamp((c - 0.5) * 1.055 + 0.5, 0.0, 1.0);
      float depth = length(vWorld-uCameraPos) * uFogDensity * exp(-max(0.0,vElev)/260.0);
      vec2 edgeDistance = min(vUv, 1.0-vUv);
      vec2 aa = max(fwidth(vUv), vec2(.00001));
      float edge = smoothstep(0.0, aa.x*.6, edgeDistance.x) * smoothstep(0.0, aa.y*.6, edgeDistance.y);
      gl_FragColor = vec4(mix(c, uFogColor, clamp(1.0-exp(-depth*depth),0.0,1.0)), uArrival * edge);
    }
  `;
  function remove(key) {
    const entry = entries.get(key); if (!entry) return;
    const previous = entry.material.uniforms.uPrevious.value;
    if (previous !== entry.material.uniforms.uTile.value) previous.dispose();
    group.remove(entry); entry.geometry.dispose(); entry.material.uniforms.uTile.value.dispose();
    entry.material.dispose(); entries.delete(key); options.onTileRemoved?.(key);
  }
  const stream = createTileStream({ region, projection, onStatus, remove,
    install({ cell, image }) {
      options.onTile?.(cell, image);
      const tex = new THREE.Texture(image); tex.flipY = false; tex.colorSpace = THREE.SRGBColorSpace;
      tex.minFilter = THREE.LinearMipmapLinearFilter; tex.magFilter = THREE.LinearFilter;
      tex.anisotropy = Math.min(8, options.maxAnisotropy || 8); tex.needsUpdate = true;
      const existing = entries.get(cell.key);
      if (existing) {
        const u = existing.material.uniforms;
        if (u.uPrevious.value !== u.uTile.value) u.uPrevious.value.dispose();
        u.uPrevious.value = u.uTile.value; u.uTile.value = tex;
        u.uBlend.value = options.reducedMotion ? 1 : 0; return;
      }
      const b = cell.bounds;
      const segments = Math.min(128, Math.max(16,
      Math.ceil((b.east-b.west)*projection.metersPerDegLon / 22)));
      const geometry = new THREE.PlaneGeometry(1, 1, segments, segments);
      const pos = geometry.attributes.position, uv = geometry.attributes.uv,
      normal = geometry.attributes.normal;
      for (let i = 0; i < pos.count; i++) {
        const u = uv.getX(i), v = 1 - uv.getY(i);
        const lon = b.west + u * (b.east-b.west), lat = b.north - v * (b.north-b.south);
        pos.setXYZ(i, (lon-region.west)/(region.east-region.west),
      (region.north-lat)/(region.north-region.south), sceneProjection.lonToX(lon));
        normal.setXYZ(i, sceneProjection.latToZ(lat), 0, 0); uv.setXY(i, u, v);
      }
      const material = new THREE.ShaderMaterial({ uniforms: { ...terrain.uniforms, uTile: { value: tex },
        uPrevious: { value: tex }, uBlend: { value: 1 },
        uArrival: { value: options.reducedMotion ? 1 : 0 } },
        vertexShader, fragmentShader, transparent: true, depthWrite: false, side: THREE.DoubleSide,
        polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
      const mesh = new THREE.Mesh(geometry, material); mesh.frustumCulled = false;
      mesh.renderOrder = 1 + (3 - cell.level) * 0.1;
      mesh.userData.cell = cell;
      group.add(mesh); entries.set(cell.key, mesh);
    },
  });
  return { ...stream, group,
    consider(...args) { group.visible = !!args[1] && args[0].dist <= 24000; stream.consider(...args); },
    roofTiles(pose) {
      return [...entries.values()].filter(mesh => mesh.userData.cell.level < 2)
        .sort((a,b) => {
          const score = m => m.userData.cell.level * 1000
            + Math.hypot((m.userData.cell.lon-pose.lon)*projection.metersPerDegLon,
              (m.userData.cell.lat-pose.lat)*projection.metersPerDegLat);
          return score(a)-score(b);
        }).slice(0,4).map(mesh => ({ texture: mesh.material.uniforms.uTile.value,
          bounds: mesh.userData.cell.bounds }));
    },
    tick(dt) {
      for (const mesh of entries.values()) {
        const u = mesh.material.uniforms;
        u.uBlend.value = Math.min(1, u.uBlend.value + dt / .45);
        u.uArrival.value = Math.min(1, u.uArrival.value + dt / .35);
        if (u.uBlend.value === 1 && u.uPrevious.value !== u.uTile.value) {
          u.uPrevious.value.dispose(); u.uPrevious.value = u.uTile.value;
        }
      }
    },
    attachTerrain(next) { terrain = next; for (const mesh of entries.values()) {
      const { uTile, uPrevious, uBlend, uArrival } = mesh.material.uniforms;
      mesh.material.uniforms = { ...next.uniforms, uTile, uPrevious, uBlend, uArrival };
    } },
  };
}
