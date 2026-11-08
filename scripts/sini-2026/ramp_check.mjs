// Difficulty ramp check: a HUMAN-LIKE autopilot (ai.js 'human': ~0.35 s reaction with scatter, sometimes
// late, often blind behind, wobbly aim) plays each sector from its start with 3 ships and the typical
// upgrades for that sector, many times. Prints the clear rate, ships lost per checkpoint, hits taken per
// minute (the "edge" ratio, steadier than the clear rate), build and fight times and what killed it.
//   node scripts/sini-2026/ramp_check.mjs [trials=60] [sectors=1,2,3,4,5] [profile=human] [difficulty=normal] [cp=0]
// Run sectors in parallel: for s in 1 2 3 4 5; do node scripts/sini-2026/ramp_check.mjs 60 $s & done; wait
const base = 'file:///D:/Projects/Sinistar/games/2026-11-07/sini-2026/js/';
const sim = await import(base + 'sim.js?v=3');
const { Autopilot } = await import(base + 'ai.js?v=3');
const cfg = await import(base + 'config.js?v=3');

const trials = +(process.argv[2] || 60);
const sectors = (process.argv[3] || '1,2,3,4,5').split(',').map((s) => +s - 1);
const profile = process.argv[4] || 'human';
const diff = process.argv[5] || 'normal';
const cp0 = +(process.argv[6] || 0);
const LIMIT = 120 * 60 * 9;   // 9 minutes of play at most
// RP='{"2":{"fire":[0.4,0.45]}}' patches RAMP rows (sector numbers 1-5) for quick what-if runs
if (process.env.RP) for (const [k, v] of Object.entries(JSON.parse(process.env.RP))) Object.assign(cfg.RAMP[+k - 1], v);

const rows = [];
for (const s of sectors) {
  let clears = 0, deaths = [0, 0, 0], hits = [0, 0, 0], tries = [0, 0, 0], wake = [], fight = [], total = [], minutes = 0, allHits = 0, timeouts = 0, delivered = 0, self = 0, bombsWake = [];
  const cause = {};
  for (let i = 0; i < trials; i++) {
    const seed = 1000 + s * 7777 + i * 31;
    const W = sim.makeWorld({ sector: s, seed, up: { ...cfg.TYPICAL_UP[s] }, diff, noTut: false, cp: cp0, lives: cfg.START_LIVES + (cfg.DIFFICULTY[diff] || cfg.DIFFICULTY.normal).lives });
    const ai = new Autopilot(seed, profile);
    let n = 0;
    while (!W.over && n < LIMIT) {
      const me = W.players[0];
      me.input = ai.control(W, me);
      sim.step(W);
      sim.drainEvents(W);
      n++;
    }
    if (!W.over) timeouts++;
    if (W.result === 'clear') clears++;
    const st = W.stats;
    for (let k = 0; k < 3; k++) { deaths[k] += st.cpDeaths[k]; hits[k] += st.cpHits[k]; tries[k] += st.cpTries[k] ? 1 : 0; }
    for (const k in st.cause) cause[k] = (cause[k] || 0) + st.cause[k];
    if (st.wakeT >= 0) { wake.push(st.wakeT); bombsWake.push(st.bombsAtWake); }
    if (st.killT >= 0 && st.wakeT >= 0) fight.push(st.killT - st.wakeT);
    if (W.result === 'clear') total.push(W.secT);
    minutes += W.secT / 60; allHits += st.cpHits[0] + st.cpHits[1] + st.cpHits[2];
    delivered += st.delivered; self += st.self;
  }
  const avg = (a) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : NaN);
  rows.push({ s, clears, deaths, hits, tries, wake: avg(wake), fight: avg(fight), total: avg(total), edge: allHits / Math.max(0.01, minutes), cause, timeouts, delivered: delivered / trials, self: self / trials, bombsWake: avg(bombsWake) });
}
console.log(`ramp_check  ${trials} trials  profile=${profile}  difficulty=${diff}${cp0 ? '  from checkpoint ' + cp0 : ''}`);
console.log('sector  clear%  lost per try (launch/half/awake)   hits/min   wake s   fight s   clear s  gath/self  rack@wake  causes');
for (const r of rows) {
  const per = r.deaths.map((d, k) => (r.tries[k] ? (d / r.tries[k]).toFixed(2) : ' -  ')).join(' / ');
  console.log(`S${r.s + 1}      ${String(Math.round((r.clears / trials) * 100)).padStart(3)}%   ${per.padEnd(28)}   ${r.edge.toFixed(2).padStart(6)}    ${r.wake.toFixed(0).padStart(5)}    ${r.fight.toFixed(0).padStart(5)}    ${r.total.toFixed(0).padStart(5)}   ${r.delivered.toFixed(1)}/${r.self.toFixed(1)}   ${r.bombsWake.toFixed(1).padStart(5)}    ${JSON.stringify(r.cause)}${r.timeouts ? '  timeouts ' + r.timeouts : ''}`);
}
