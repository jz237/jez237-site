// The grove remembers: discovered reactions and best runs persist across
// sessions (localStorage), shown on the title as the meta-progression hook.

const KEY = 'lumen_journal_v1';

function load() {
  try { return { mixes: {}, best: {}, runs: 0, ...(JSON.parse(localStorage.getItem(KEY)) || {}) }; }
  catch { return { mixes: {}, best: {}, runs: 0 }; }
}

const state = load();

function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { } }

export const journal = {
  get() { return state; },
  addMix(id) {
    if (state.mixes[id]) return false;
    state.mixes[id] = true;
    save();
    return true;
  },
  recordRun(mapId, wave, score, won) {
    state.runs++;
    const b = state.best[mapId];
    if (!b || wave > b.wave || (wave === b.wave && score > b.score)) {
      state.best[mapId] = { wave, score, won: !!won };
    } else if (won && !b.won) b.won = true;
    save();
  },
};
