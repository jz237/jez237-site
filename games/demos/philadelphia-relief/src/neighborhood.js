import { buildLineMesh } from './vectors.js?v=philly-2026090612';
import { neighborhoodLabels } from './neighborhood-data.js?v=philly-2026090612';

export function createNeighborhood(THREE, options) {
  const { projection, sampleElevation, onData } = options;
  const group = new THREE.Group(); group.name = 'neighborhood-road-outlines';
  const cache = new Map();
  let current = null, pending = null, candidate = '', failedUntil = 0, failedKey = '';
  let generation = 0, disposed = false, lines = [];
  function clearLines() {
    for (const entry of lines) { group.remove(entry.mesh); entry.mesh.geometry.dispose();
      entry.material.dispose(); }
    lines = [];
  }
  function install(doc) {
    if (current?.key === doc.key) return;
    current = doc; clearLines();
    const roads = doc.elements.filter(e => e.tags?.highway && e.geometry?.length > 1
      && !e.tags.tunnel && e.tags.highway !== 'steps');
    const parts = roads.map(e => e.geometry);
    for (const style of [{ width: 3.2, color: '#122632', opacity: 0.48 },
      { width: 1, color: '#e8dfbd', opacity: 0.68 }]) {
      const entry = buildLineMesh(THREE, parts, { projection, sampleElevation },
        { ...style, renderOrder: 19, name: 'neighborhood-roads' });
      if (entry) { lines.push(entry); group.add(entry.mesh); }
    }
    onData(doc, neighborhoodLabels(doc));
  }
  return {
    group,
    consider(pose, state) {
      const enabled = state.era === 'present' && pose.dist < 3200
        && (state.layers.roads || state.layers.structures);
      if (!enabled) {
        if (pending) { generation++; pending.controller.abort(); pending = null; }
        group.visible = false; return;
      }
      if (current) {
        const b = current.bounds;
        if (pose.lon > b.west + 0.0015 && pose.lon < b.east - 0.0015
            && pose.lat > b.south + 0.001 && pose.lat < b.north - 0.001) return;
      }
      const lon = Math.round((pose.lon + 75.8) / 0.004) * 0.004 - 75.8;
      const lat = Math.round((pose.lat - 39.7) / 0.003) * 0.003 + 39.7;
      const key = `${lon.toFixed(4)},${lat.toFixed(4)}`;
      if (pending?.key === key || failedKey === key && Date.now() < failedUntil) return;
      if (cache.has(key)) { install(cache.get(key)); return; }
      if (candidate !== key) { candidate = key; return; }
      if (pending) pending.controller.abort();
      const controller = new AbortController(), revision = ++generation;
      pending = { key, controller };
      fetch(`street-detail?lon=${lon.toFixed(4)}&lat=${lat.toFixed(4)}`, {
        signal: controller.signal, credentials: 'same-origin',
      }).then(response => {
        if (!response.ok) throw new Error('Neighborhood detail unavailable');
        return response.json();
      }).then(doc => {
        if (disposed || revision !== generation) return;
        cache.set(key,doc);
        if (cache.size > 6) cache.delete(cache.keys().next().value);
        install(doc);
      }).catch(() => {
        if (!controller.signal.aborted) { failedKey = key; failedUntil = Date.now() + 60000; }
      }).finally(() => { if (revision === generation) pending = null; });
    },
    update(camera, state, exaggeration, width, height) {
      group.visible = !!current && state.layers.roads && state.era === 'present' && state.camDist < 3200;
      for (const { material } of lines) {
        const u = material.uniforms;
        u.uExag.value = exaggeration; u.uLift.value = 0.65;
        u.uNear.value = camera.near; u.uResolution.value.set(width,height);
      }
    },
    hasCoverage(pose) {
      const b = current?.bounds;
      return !!b && pose.lon > b.west && pose.lon < b.east && pose.lat > b.south && pose.lat < b.north;
    },
    dispose() { disposed = true; generation++; pending?.controller.abort(); clearLines(); cache.clear(); },
  };
}
