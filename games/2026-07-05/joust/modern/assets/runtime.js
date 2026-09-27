// Modern-shell helpers. No changes to the shared arcade simulation.
(function (root) {
  'use strict';
  const keys = () => ({p1:{left:'ArrowLeft',right:'ArrowRight',flap:'ArrowUp'},p2:{left:'KeyA',right:'KeyD',flap:'KeyW'}});
  const defaults = () => ({
    hi:0,scores:[],maxWave:1,unlockAll:false,
    stats:{games:0,kills:0,pteroKills:0,eggs:0,maxChain:0,waves:0,deaths:0},feats:{},
    opts:{sfx:.7,mus:.5,quality:'high',camShake:true,rumble:true,difficulty:'normal',lives:5,keys:keys()},
  });
  const num = (v, fallback, min, max) => typeof v === 'number' && Number.isFinite(v) ? Math.max(min, Math.min(max, v)) : fallback;
  function normalizeSave(raw) {
    const s = defaults();
    if (!raw || typeof raw !== 'object') return s;
    s.hi = Math.floor(num(raw.hi,0,0,1e10));
    s.maxWave = Math.floor(num(raw.maxWave,1,1,99));
    s.unlockAll = raw.unlockAll === true;
    if (Array.isArray(raw.scores)) s.scores = raw.scores.filter(x => x && /^[A-Z]{3}$/.test(x.initials) && Number.isFinite(x.score) && x.score >= 0).map(x => ({initials:x.initials,score:Math.floor(x.score),wave:Math.floor(num(x.wave,1,1,99))})).sort((a,b)=>b.score-a.score).slice(0,10);
    for (const k in s.stats) s.stats[k] = Math.floor(num(raw.stats?.[k],0,0,1e10));
    if (raw.feats && typeof raw.feats === 'object') for (const [k,v] of Object.entries(raw.feats)) if (typeof v === 'number' && Number.isFinite(v) && v > 0) s.feats[k] = v;
    const o = raw.opts || {};
    for (const k of ['sfx','mus']) s.opts[k] = num(o[k],s.opts[k],0,1);
    for (const k of ['camShake','rumble']) if (typeof o[k] === 'boolean') s.opts[k] = o[k];
    if (['low','medium','high'].includes(o.quality)) s.opts.quality = o.quality;
    if (['easy','normal','hard'].includes(o.difficulty)) s.opts.difficulty = o.difficulty;
    s.opts.lives = !raw._rev2 && o.lives === 3 ? 5 : Math.floor(num(o.lives,5,1,9));
    for (const p of ['p1','p2']) for (const a of ['left','right','flap']) {
      const code = o.keys?.[p]?.[a];
      if (typeof code === 'string' && /^(Key[A-Z]|Digit[0-9]|Arrow(Up|Down|Left|Right)|Space|Shift(Left|Right)|Control(Left|Right)|Numpad[0-9])$/.test(code)) s.opts.keys[p][a] = code;
    }
    s._rev2 = true;
    return s;
  }
  function capturePoses(snap) {
    const out = new Map();
    for (const list of ['players','enemies','pteros','eggs']) for (const e of snap[list] || []) out.set(e.id,{x:e.x,y:e.y,alive:e.alive,materializing:e.materializing});
    return out;
  }
  function interpolateSnapshot(snap, previous, alpha, world) {
    if (!snap || !previous || alpha >= 1) return snap;
    const a = Math.max(0, Math.min(1, alpha));
    const result = {...snap};
    for (const list of ['players','enemies','pteros','eggs']) result[list] = (snap[list] || []).map(e => {
      const p = previous.get(e.id);
      if (!p || p.alive !== e.alive || e.materializing > p.materializing || Math.abs(e.y-p.y) > 32) return e;
      const span = world.WRAP_SPAN;
      const dx = ((e.x-p.x+span*1.5)%span)-span*.5;
      const x = ((p.x+dx*a-world.WRAP_MIN)%span+span)%span+world.WRAP_MIN;
      return {...e,x,y:p.y+(e.y-p.y)*a};
    });
    return result;
  }
  const api = {normalizeSave,defaults,capturePoses,interpolateSnapshot};
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.JOUST_RUNTIME = api;
})(typeof window !== 'undefined' ? window : globalThis);
