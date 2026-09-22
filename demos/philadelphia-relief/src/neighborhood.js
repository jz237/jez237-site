import { neighborhoodLabels } from './neighborhood-data.js?v=philly-2026092121';

export function createNeighborhood({ onData }) {
  const cache = new Map();
  let current = null, pending = null, candidate = '', failedUntil = 0, failedKey = '';
  let generation = 0, disposed = false;
  function cancelPending() {
    if (!pending) return;
    generation++; clearTimeout(pending.timer); pending.controller.abort(); pending = null;
  }
  function install(doc) {
    if (current?.key === doc.key) return;
    current = doc; onData(doc, neighborhoodLabels(doc));
  }
  return {
    consider(pose, state) {
      const enabled = state.era === 'present' && pose.dist < 3200
        && state.layers.structures;
      if (!enabled) {
        cancelPending();
        return;
      }
      if (current) {
        const b = current.bounds;
        if (pose.lon > b.west + 0.0015 && pose.lon < b.east - 0.0015
            && pose.lat > b.south + 0.001 && pose.lat < b.north - 0.001) {
          cancelPending(); candidate = ''; return;
        }
      }
      const lon = Math.round((pose.lon + 75.8) / 0.004) * 0.004 - 75.8;
      const lat = Math.round((pose.lat - 39.7) / 0.003) * 0.003 + 39.7;
      const key = `${lon.toFixed(4)},${lat.toFixed(4)}`;
      if (pending && pending.key !== key) cancelPending();
      if (pending?.key === key || failedKey === key && Date.now() < failedUntil) return;
      if (cache.has(key)) { install(cache.get(key)); return; }
      if (candidate !== key) { candidate = key; return; }
      cancelPending();
      const controller = new AbortController(), revision = ++generation;
      const timer = setTimeout(() => controller.abort(), 55000);
      pending = { key, controller, timer };
      fetch(`street-detail?lon=${lon.toFixed(4)}&lat=${lat.toFixed(4)}&v=2`, {
        signal: controller.signal, credentials: 'same-origin',
      }).then(response => {
        if (!response.ok) throw new Error('Neighborhood detail unavailable');
        return response.json();
      }).then(doc => {
        if (disposed || revision !== generation || controller.signal.aborted) return;
        cache.set(key,doc);
        if (cache.size > 6) cache.delete(cache.keys().next().value);
        install(doc);
      }).catch(() => {
        if (!disposed && revision === generation) { failedKey = key; failedUntil = Date.now() + 60000; }
      }).finally(() => { clearTimeout(timer); if (revision === generation) pending = null; });
    },
    hasCoverage(pose) {
      const b = current?.bounds;
      return !!b && pose.lon > b.west && pose.lon < b.east && pose.lat > b.south && pose.lat < b.north;
    },
    dispose() { disposed = true; cancelPending(); generation++; cache.clear(); },
  };
}
