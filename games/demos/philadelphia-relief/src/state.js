/**
 * The application store.
 *
 * Every control, layer toggle and camera value lives here. Rendering code
 * subscribes and reacts; nothing else holds its own copy. Keeping it pure (no
 * DOM, no WebGL) is what lets the Node tests drive the whole app state machine
 * — presets, layer toggles, URL round-trips — without a browser.
 */

import { defaults, coercePatch, CHEAP_KEYS, LAYERS } from './schema.js?v=philly-2026090608';

export function createStore(initial = {}) {
  let state = { ...defaults() };
  const seeded = coercePatch(initial);
  state = applyPatch(state, seeded);

  const listeners = new Set();
  let depth = 0;
  let pendingKeys = null;

  function applyPatch(base, patch) {
    const next = { ...base, ...patch };
    if (patch.layers) next.layers = { ...base.layers, ...patch.layers };
    return next;
  }

  /** Keys whose value actually changed, including 'layers' as one key. */
  function diff(before, after) {
    const changed = new Set();
    for (const key of Object.keys(after)) {
      if (key === 'layers') {
        for (const lid of Object.keys(after.layers)) {
          if (before.layers[lid] !== after.layers[lid]) changed.add(`layers.${lid}`);
        }
      } else if (before[key] !== after[key]) {
        changed.add(key);
      }
    }
    return changed;
  }

  function emit(changed) {
    if (!changed.size) return;
    // Re-entrant sets (a listener that calls set) are coalesced into the
    // outermost notification so subscribers never see a torn state.
    if (depth > 0) {
      for (const k of changed) pendingKeys.add(k);
      return;
    }
    depth = 1;
    pendingKeys = new Set(changed);
    try {
      // Drain: a listener may enqueue further changes.
      let guard = 0;
      while (pendingKeys.size) {
        const batch = pendingKeys;
        pendingKeys = new Set();
        for (const fn of listeners) fn(state, batch);
        if (++guard > 16) break;   // runaway feedback loop; stop rather than hang
      }
    } finally {
      depth = 0;
      pendingKeys = null;
    }
  }

  const store = {
    get: () => state,

    /** Read one value. */
    value: (key) => state[key],

    isLayerOn: (id) => !!state.layers[id],

    /**
     * Merge a patch. Unknown keys and out-of-range values are dropped by
     * `coercePatch`, so callers can hand this untrusted input (URL hash,
     * postMessage, a preset file) without validating first.
     */
    set(patch, meta = {}) {
      const clean = coercePatch(patch);
      if (!Object.keys(clean).length) return state;
      const before = state;
      const after = applyPatch(before, clean);
      const changed = diff(before, after);
      if (!changed.size) return state;
      state = after;
      state.lastChangeSource = meta.source || 'app';
      emit(changed);
      return state;
    },

    setLayer(id, on) {
      if (!(id in LAYERS)) return state;
      return store.set({ layers: { [id]: !!on } });
    },

    toggleLayer(id) {
      if (!(id in LAYERS)) return state;
      return store.set({ layers: { [id]: !state.layers[id] } });
    },

    /** Restore every key to its schema default. */
    reset(meta = {}) {
      const before = state;
      state = { ...defaults() };
      state.lastChangeSource = meta.source || 'reset';
      emit(diff(before, state));
      return state;
    },

    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
  };

  return store;
}

/**
 * True when every changed key is a shader-uniform or camera tweak, i.e. the
 * frame can be redrawn without rebuilding any geometry.
 */
export function isCheapChange(changedKeys) {
  for (const key of changedKeys) {
    if (key.startsWith('layers.')) return false;
    if (!CHEAP_KEYS.has(key)) return false;
  }
  return true;
}
