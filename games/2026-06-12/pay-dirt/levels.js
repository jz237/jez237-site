/* Pay Dirt — levels.js
   Campaign maps, solvability checker, seeded Daily Dig generator.
   Levels are authored with tiny builder helpers (put/tier/lad/...) so every row
   is guaranteed 28 chars; the solvability checker gates everything at load. */
'use strict';
const LEVELS = (() => {
  const COLS = 28, ROWS = 16;

  /* ---------- builders ---------- */
  const fill = ch => ch.repeat(COLS);
  function base(){
    const L = [];
    for (let r = 0; r < ROWS - 1; r++) L.push(fill('.'));
    L.push(fill('X'));
    return L;
  }
  function put(L, r, c, s){ L[r] = L[r].slice(0, c) + s + L[r].slice(c + s.length); }
  function tier(L, r, c0, c1){ put(L, r, c0 === undefined ? 0 : c0, '#'.repeat((c1 === undefined ? COLS - 1 : c1) - (c0 || 0) + 1)); }
  function lad(L, c, r0, r1){ for (let r = r0; r <= r1; r++) put(L, r, c, 'H'); }
  function bar(L, r, c0, c1){ put(L, r, c0, '-'.repeat(c1 - c0 + 1)); }
  function ext(L, c, r0, r1){ for (let r = r0; r <= r1; r++) put(L, r, c, 'E'); }
  function g$(L, c, r){ put(L, r, c, '$'); }

  /* ---------- campaign ---------- */
  const names = [
    'First Strike', 'Hand Over Hand', 'Break Ground', 'Claim Jumpers', 'False Floors',
    'The Belt Line', 'Rotten Rock', 'One Way Out', 'Powder Keg', 'Quick Hands',
    'The Mason', 'Deep Vein', 'Mother Lode',
  ];

  // L1 — run, climb, collect. No guards, no digging.
  function lvl1(){
    const L = base();
    tier(L, 3); tier(L, 7); tier(L, 11);
    lad(L, 3, 3, 6); lad(L, 22, 3, 6);
    lad(L, 7, 7, 10); lad(L, 20, 7, 10);
    lad(L, 11, 11, 14); lad(L, 24, 11, 14);
    ext(L, 0, 0, 2);
    g$(L, 5, 2); g$(L, 13, 2); g$(L, 21, 2);
    g$(L, 10, 6); g$(L, 16, 6);
    g$(L, 13, 10); g$(L, 17, 10);
    g$(L, 2, 14); g$(L, 18, 14);
    put(L, 14, 7, 'P');
    return L;
  }

  // L2 — bars over a pit, first guard.
  function lvl2(){
    const L = base();
    tier(L, 3); tier(L, 7); tier(L, 11);
    put(L, 7, 9, '.........');          // pit gap in tier 7, cols 9-17
    bar(L, 6, 9, 17);                    // bar spans the gap
    lad(L, 4, 3, 6); lad(L, 21, 3, 6);
    lad(L, 6, 7, 10); lad(L, 24, 7, 10);
    lad(L, 13, 11, 14); lad(L, 26, 11, 14);
    ext(L, 27, 0, 2);
    g$(L, 2, 2); g$(L, 25, 2);
    g$(L, 12, 10); g$(L, 15, 10);        // pit floor, under the bar
    g$(L, 3, 14); g$(L, 20, 14);
    put(L, 14, 2, 'P');
    put(L, 2, 24, 'G');
    return L;
  }

  // L3 — dig introduced: covered pockets hold the gold.
  function lvl3(){
    const L = base();
    tier(L, 3); tier(L, 7); tier(L, 11);
    // pocket A: sub-floor at row 5 under tier 3; dig in from row 2, dig out to row 6
    tier(L, 5, 9, 13);
    g$(L, 10, 4); g$(L, 12, 4);
    // pocket B: sealed cellar over the bottom: gold on row 14 below tier 11 covered stretch (no ladder near)
    g$(L, 4, 10);
    lad(L, 6, 3, 6); lad(L, 24, 3, 6);
    lad(L, 17, 7, 10); lad(L, 2, 7, 10);
    lad(L, 20, 11, 14); lad(L, 8, 11, 14);
    ext(L, 0, 0, 2);
    g$(L, 15, 2); g$(L, 22, 6); g$(L, 12, 14); g$(L, 25, 14);
    put(L, 14, 14, 'P');
    put(L, 2, 6, 'G');
    return L;
  }

  // L4 — two claim jumpers; chokepoint ladders; trap practice.
  function lvl4(){
    const L = base();
    tier(L, 3); tier(L, 7); tier(L, 11);
    put(L, 3, 13, '..');                 // small gap in top tier
    lad(L, 2, 3, 6); lad(L, 24, 3, 6);   // a ladder for each top segment
    lad(L, 25, 7, 10);
    lad(L, 13, 11, 14);
    lad(L, 5, 7, 10);
    ext(L, 27, 0, 2);
    g$(L, 6, 2); g$(L, 20, 2);
    g$(L, 3, 6); g$(L, 11, 6); g$(L, 22, 6);
    g$(L, 8, 10); g$(L, 18, 10);
    g$(L, 24, 14); g$(L, 2, 14);
    put(L, 14, 16, 'P');
    put(L, 2, 8, 'G'); put(L, 6, 20, 'G');
    return L;
  }

  // L5 — trapdoors: the floor lies.
  function lvl5(){
    const L = base();
    tier(L, 3); tier(L, 7); tier(L, 11);
    put(L, 3, 8, 'T'); put(L, 3, 19, 'T');       // fall-through shortcuts (and hazards)
    put(L, 7, 12, 'TT');
    put(L, 11, 5, 'T');
    lad(L, 3, 3, 6); lad(L, 12, 3, 6); lad(L, 24, 3, 6); // trapdoors isolate segments; ladder each

    lad(L, 10, 7, 10); lad(L, 22, 7, 10);
    lad(L, 16, 11, 14); lad(L, 2, 11, 14);
    ext(L, 0, 0, 2);
    g$(L, 12, 2); g$(L, 26, 2);
    g$(L, 6, 6); g$(L, 19, 6);
    g$(L, 12, 10); g$(L, 26, 10);
    g$(L, 7, 14); g$(L, 20, 14);
    put(L, 14, 12, 'P');
    put(L, 2, 16, 'G'); put(L, 10, 4, 'G');
    put(L, 6, 8, '2');                            // speed boots
    return L;
  }

  // L6 — conveyor belts fight (or help) you.
  function lvl6(){
    const L = base();
    tier(L, 3); tier(L, 7); tier(L, 11);
    put(L, 3, 6, '>>>>'); put(L, 3, 18, '<<<<');
    put(L, 7, 4, '<<<<'); put(L, 7, 16, '>>>>');
    put(L, 11, 10, '>>>>>>>>');
    lad(L, 2, 3, 6); lad(L, 25, 3, 6);
    lad(L, 13, 7, 10);
    lad(L, 6, 11, 14); lad(L, 21, 11, 14);
    ext(L, 27, 0, 2);
    g$(L, 8, 2); g$(L, 20, 2);
    g$(L, 5, 6); g$(L, 18, 6);
    g$(L, 12, 10); g$(L, 15, 10);
    g$(L, 3, 14); g$(L, 24, 14);
    put(L, 14, 10, 'P');
    put(L, 2, 12, 'G'); put(L, 6, 24, 'G');
    return L;
  }

  // L7 — crumbling rock: one-shot crossings. Scout debut.
  function lvl7(){
    const L = base();
    tier(L, 3); tier(L, 7); tier(L, 11);
    put(L, 3, 10, 'CCC');
    put(L, 7, 6, 'CC'); put(L, 7, 20, 'CC');
    put(L, 11, 14, 'CCCC');
    lad(L, 2, 3, 6); lad(L, 24, 3, 6);
    lad(L, 8, 7, 10); lad(L, 18, 7, 10);
    lad(L, 4, 11, 14); lad(L, 26, 11, 14);
    ext(L, 0, 0, 2);
    g$(L, 11, 2); g$(L, 18, 2);
    g$(L, 4, 6); g$(L, 21, 6);
    g$(L, 10, 10); g$(L, 15, 10);
    g$(L, 8, 14); g$(L, 21, 14);
    put(L, 14, 13, 'P');
    put(L, 2, 20, 'S');
    put(L, 10, 16, '3');                          // phase cloak
    return L;
  }

  // L8 — one-way gates: committing is the puzzle.
  function lvl8(){
    const L = base();
    tier(L, 3); tier(L, 7); tier(L, 11);
    put(L, 2, 9, ']'); put(L, 2, 18, '[');        // gold alley on top row: enter both sides, exits one-way
    put(L, 6, 5, '['); put(L, 6, 22, ']');
    put(L, 10, 13, ']');
    lad(L, 2, 3, 6); lad(L, 25, 3, 6);
    lad(L, 11, 7, 10); lad(L, 16, 7, 10);
    lad(L, 7, 11, 14); lad(L, 20, 11, 14);
    ext(L, 27, 0, 2);
    g$(L, 13, 2); g$(L, 14, 2);
    g$(L, 3, 6); g$(L, 24, 6);
    g$(L, 9, 10); g$(L, 18, 10);
    g$(L, 2, 14); g$(L, 25, 14);
    put(L, 14, 13, 'P');
    put(L, 2, 21, 'G'); put(L, 10, 3, 'G');
    return L;
  }

  // L9 — powder keg: blast through the vault.
  function lvl9(){
    const L = base();
    tier(L, 3); tier(L, 7); tier(L, 11);
    // powder pocket: dig in through tier 7, crates bookend the sub-floor for fast blasting
    tier(L, 9, 20, 24);
    put(L, 9, 20, 'B'); put(L, 9, 24, 'B');
    g$(L, 22, 8); g$(L, 23, 8);
    lad(L, 2, 3, 6); lad(L, 24, 3, 6);
    lad(L, 9, 7, 10); lad(L, 16, 7, 10);
    lad(L, 4, 11, 14); lad(L, 13, 11, 14);
    ext(L, 0, 0, 2);
    g$(L, 8, 2); g$(L, 17, 2);
    g$(L, 5, 6); g$(L, 20, 6);
    g$(L, 12, 10);
    g$(L, 17, 14); g$(L, 26, 14);
    put(L, 14, 7, 'P');
    put(L, 2, 12, 'G'); put(L, 6, 18, 'G'); put(L, 10, 2, 'G');
    put(L, 6, 10, '1');                           // a TNT charge to crack the vault
    return L;
  }

  // L10 — quick hands: scouts and combo lines.
  function lvl10(){
    const L = base();
    tier(L, 3); tier(L, 7); tier(L, 11);
    lad(L, 2, 3, 6); lad(L, 25, 3, 6);
    lad(L, 13, 7, 10);
    lad(L, 6, 11, 14); lad(L, 21, 11, 14);
    ext(L, 27, 0, 2);
    for (const c of [6, 9, 12, 15, 18, 21]) g$(L, c, 2);   // the combo line
    g$(L, 4, 6); g$(L, 23, 6);
    g$(L, 10, 10); g$(L, 17, 10);
    g$(L, 3, 14); g$(L, 24, 14);
    put(L, 14, 14, 'P');
    put(L, 2, 8, 'S'); put(L, 6, 19, 'S');
    put(L, 10, 4, '2');                           // boots for the line
    return L;
  }

  // L11 — the mason reseals your work.
  function lvl11(){
    const L = base();
    tier(L, 3); tier(L, 7); tier(L, 11);
    // pockets that need digging while the mason patrols
    tier(L, 5, 8, 11); g$(L, 9, 4); g$(L, 10, 4);
    tier(L, 9, 16, 19); g$(L, 17, 8); g$(L, 18, 8);
    lad(L, 3, 3, 6); lad(L, 24, 3, 6);
    lad(L, 13, 7, 10); lad(L, 5, 7, 10);
    lad(L, 18, 11, 14); lad(L, 9, 11, 14);
    ext(L, 0, 0, 2);
    g$(L, 16, 2); g$(L, 21, 6); g$(L, 2, 10); g$(L, 13, 14); g$(L, 24, 14);
    put(L, 14, 21, 'P');
    put(L, 2, 12, 'M'); put(L, 6, 8, 'G');
    put(L, 10, 21, '1');
    return L;
  }

  // L12 — deep vein: dig through two layers; everything is far down.
  function lvl12(){
    const L = base();
    tier(L, 3); tier(L, 7); tier(L, 11);
    // double-deck pocket: rows 5 and 9 sub-floors stacked under tier 3 cover
    tier(L, 5, 14, 18); g$(L, 15, 4); g$(L, 17, 4);
    tier(L, 9, 14, 18); g$(L, 15, 8); g$(L, 17, 8);
    lad(L, 2, 3, 6); lad(L, 25, 3, 6);
    lad(L, 8, 7, 10); lad(L, 21, 7, 10);
    lad(L, 12, 11, 14); lad(L, 4, 11, 14);
    ext(L, 27, 0, 2);
    g$(L, 7, 2); g$(L, 21, 2); g$(L, 5, 6); g$(L, 10, 14); g$(L, 19, 14);
    put(L, 14, 24, 'P');
    put(L, 2, 10, 'G'); put(L, 6, 16, 'S'); put(L, 10, 6, 'M');
    put(L, 6, 24, '4'); put(L, 10, 10, '3');
    return L;
  }

  // L13 — mother lode: everything at once.
  function lvl13(){
    const L = base();
    tier(L, 3); tier(L, 7); tier(L, 11);
    put(L, 3, 13, 'TT');
    put(L, 7, 5, 'CC'); put(L, 7, 21, '>>>');
    put(L, 11, 9, '<<<');
    // strongroom bottom-right: dig in through the roof, leave by the one-way door
    put(L, 13, 22, '#B###');
    put(L, 14, 22, '#.$.' + ']');
    lad(L, 27, 11, 14);                  // escape shaft outside the door
    // covered pocket top-left
    tier(L, 5, 3, 6); g$(L, 4, 4); g$(L, 5, 4);
    lad(L, 9, 3, 6); lad(L, 18, 3, 6);
    lad(L, 3, 7, 10); lad(L, 14, 7, 10); lad(L, 26, 7, 10);
    lad(L, 7, 11, 14); lad(L, 17, 11, 14);
    ext(L, 0, 0, 2);
    g$(L, 16, 2); g$(L, 24, 2);
    g$(L, 11, 6); g$(L, 24, 6);
    g$(L, 5, 10); g$(L, 21, 10);
    g$(L, 2, 14); g$(L, 12, 14);
    put(L, 14, 10, 'P');
    put(L, 2, 22, 'G'); put(L, 6, 12, 'G'); put(L, 10, 24, 'S'); put(L, 2, 6, 'M');
    put(L, 6, 7, '1'); put(L, 10, 13, '5');
    return L;
  }

  const campaign = [lvl1(), lvl2(), lvl3(), lvl4(), lvl5(), lvl6(), lvl7(), lvl8(), lvl9(), lvl10(), lvl11(), lvl12(), lvl13()];

  /* ---------- solvability checker ---------- */
  // Reachability over the player's verbs: walk, climb, swing, fall, dig-descend,
  // crumble-fall. Conservative: ignores guards, hole timing, belt drift.
  function analyze(rows){
    const grid = [], golds = [], exits = [];
    let spawn = null;
    for (let r = 0; r < ROWS; r++){
      const out = [];
      for (let c = 0; c < COLS; c++){
        let ch = rows[r][c];
        if (ch === 'P'){ spawn = {c, r}; ch = '.'; }
        else if (ch === '$'){ golds.push({c, r}); ch = '.'; }
        else if ('GSM12345'.includes(ch)) ch = '.';
        out.push(ch);
      }
      grid.push(out);
    }
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++)
      if (grid[r][c] === 'E') exits.push({c, r});
    return {grid, golds, exits, spawn};
  }

  function solvable(rows){
    const A = analyze(rows);
    if (!A.spawn) return {ok: false, why: 'no spawn'};
    if (!A.exits.some(e => e.r === 0)) return {ok: false, why: 'no exit reaching row 0'};
    if (!A.golds.length) return {ok: false, why: 'no gold'};
    const tile = (c, r) => (c < 0 || c >= COLS || r < 0 || r >= ROWS) ? 'X' : A.grid[r][c];
    const ladder = (c, r, rev) => { const t = tile(c, r); return t === 'H' || (rev && t === 'E'); };
    const occ = (c, r) => { const t = tile(c, r); return !(t === '#' || t === 'X' || t === 'B' || t === 'C'); };
    const solidBelow = (c, r, rev) => {
      if (r + 1 >= ROWS) return true;
      const t = tile(c, r + 1);
      return t === '#' || t === 'X' || t === 'B' || t === 'C' || t === 'H' || t === '<' || t === '>' || (rev && t === 'E');
    };
    const supported = (c, r, rev) => solidBelow(c, r, rev) || ladder(c, r, rev) || tile(c, r) === '-';
    const enterH = (c, r, dir) => {
      if (!occ(c, r)) return false;
      const t = tile(c, r);
      if (t === '[') return dir < 0;
      if (t === ']') return dir > 0;
      return true;
    };
    const fallTo = (c, r, rev) => { let rr = r; while (rr < ROWS - 1 && !supported(c, rr, rev) && occ(c, rr + 1)) rr++; return rr; };

    function neighbors(c, r, rev){
      const out = [];
      if (!supported(c, r, rev)){ out.push([c, fallTo(c, r, rev)]); return out; }
      for (const dir of [-1, 1]){
        const nc = c + dir;
        if (enterH(nc, r, dir)) out.push([nc, fallTo(nc, r, rev)]);
      }
      if (ladder(c, r, rev) && occ(c, r - 1)) out.push([c, r - 1]);
      if (occ(c, r + 1) && (ladder(c, r, rev) || ladder(c, r + 1, rev))) out.push([c, r + 1]);
      if (tile(c, r) === '-' && occ(c, r + 1) && !solidBelow(c, r, rev)) out.push([c, fallTo(c, r + 1, rev)]);
      // dig-descend: hole at (c±1, r+1) then fall through it
      if (solidBelow(c, r, rev) && r + 1 < ROWS){
        for (const dir of [-1, 1]){
          const hc = c + dir;
          if (tile(hc, r + 1) === '#' && occ(hc, r)){
            let rr = r + 1;
            while (rr < ROWS - 1 && !solidBelow(hc, rr, rev) && occ(hc, rr + 1)) rr++;
            out.push([hc, rr]);
          }
        }
      }
      // crumble-fall: stand on C, it gives way
      if (tile(c, r + 1) === 'C'){
        let rr = r + 1;
        while (rr < ROWS - 1 && !solidBelow(c, rr, rev) && occ(c, rr + 1)) rr++;
        out.push([c, rr]);
      }
      return out;
    }

    function bfs(sc, sr, rev){
      const seen = new Uint8Array(COLS * ROWS);
      const q = [sr * COLS + sc];
      seen[q[0]] = 1;
      for (let qi = 0; qi < q.length; qi++){
        const n = q[qi], c = n % COLS, r = (n / COLS) | 0;
        for (const [nc, nr] of neighbors(c, r, rev)){
          const m = nr * COLS + nc;
          if (!seen[m]){ seen[m] = 1; q.push(m); }
        }
      }
      return seen;
    }

    const R1 = bfs(A.spawn.c, A.spawn.r, false);
    for (const g of A.golds)
      if (!R1[g.r * COLS + g.c]) return {ok: false, why: 'gold unreachable at ' + g.c + ',' + g.r};
    const top = A.exits.find(e => e.r === 0);
    for (const g of A.golds.concat([A.spawn])){
      const R2 = bfs(g.c, g.r, true);
      if (!R2[top.c]) return {ok: false, why: 'exit unreachable from ' + g.c + ',' + g.r};
    }
    return {ok: true};
  }

  /* ---------- daily generator ---------- */
  function hashStr(s){
    let h = 2166136261 >>> 0;
    for (let i = 0; i < s.length; i++){ h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function mulberry32(a){
    return function(){
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function dailyDateUTC(){
    const d = new Date();
    return d.getUTCFullYear() + '-' + String(d.getUTCMonth() + 1).padStart(2, '0') + '-' + String(d.getUTCDate()).padStart(2, '0');
  }

  function generate(seed){
    const rng = mulberry32(seed);
    const ri = n => (rng() * n) | 0;
    const L = base();
    const tiers = [3, 7, 11];
    const ladderCols = [[], [], []];

    for (let ti = 0; ti < 3; ti++){
      const r = tiers[ti];
      tier(L, r);
      // 1-2 gaps per tier (not at the edges)
      const gaps = 1 + ri(2);
      for (let gi = 0; gi < gaps; gi++){
        const w = 2 + ri(3);
        const c0 = 3 + ri(COLS - 6 - w);
        put(L, r, c0, '.'.repeat(w));
        if (rng() < 0.5 && w >= 3) bar(L, r - 1, c0, c0 + w - 1); // bar over the gap
      }
      // sprinkle modern tiles into remaining brick
      const sprinkle = (ch, n) => {
        for (let i = 0; i < n; i++){
          const c = 1 + ri(COLS - 2);
          if (L[r][c] === '#') put(L, r, c, ch);
        }
      };
      if (rng() < 0.5) sprinkle('T', 1 + ri(2));
      if (rng() < 0.4) sprinkle('C', 2);
      if (rng() < 0.3){
        const c = 2 + ri(COLS - 8);
        const w = 3 + ri(3);
        if (L[r].slice(c, c + w) === '#'.repeat(w)) put(L, r, c, (rng() < 0.5 ? '<' : '>').repeat(w));
      }
    }
    // ladders between layers: 2-3 per layer pair, on brick columns
    for (let ti = 0; ti < 3; ti++){
      const rTop = tiers[ti], rBot = ti < 2 ? tiers[ti + 1] : ROWS - 1;
      const n = 2 + ri(2);
      for (let i = 0; i < n; i++){
        for (let tries = 0; tries < 20; tries++){
          const c = 1 + ri(COLS - 2);
          if (L[rTop][c] === '#' && (rBot === ROWS - 1 || '#<>'.includes(L[rBot][c]))){
            lad(L, c, rTop, rBot - 1);
            ladderCols[ti].push(c);
            break;
          }
        }
      }
    }
    // exit shaft
    const exitC = rng() < 0.5 ? ri(3) : COLS - 1 - ri(3);
    ext(L, exitC, 0, 2);
    if (L[3][exitC] !== '#') put(L, 3, exitC, '#');
    // pocket: covered gold under the top tier
    if (rng() < 0.75){
      const pc = 5 + ri(COLS - 12);
      if (L[3].slice(pc, pc + 3) === '###' && L[4].slice(pc, pc + 3) === '...'){
        tier(L, 5, pc, pc + 2);
        g$(L, pc + 1, 4);
      }
    }
    // gold on walk rows
    const walkRows = [2, 6, 10, 14];
    let placed = 0, want = 8 + ri(4);
    for (let tries = 0; tries < 300 && placed < want; tries++){
      const r = walkRows[ri(4)];
      const c = 1 + ri(COLS - 2);
      if (L[r][c] === '.' && '#X<>CTB'.includes(L[r + 1][c])){ g$(L, c, r); placed++; }
    }
    // power-ups
    for (let i = 0, n = 1 + ri(2); i < n; i++){
      for (let tries = 0; tries < 40; tries++){
        const r = walkRows[ri(4)], c = 1 + ri(COLS - 2);
        if (L[r][c] === '.' && '#X<>'.includes(L[r + 1][c])){ put(L, r, c, String(1 + ri(5))); break; }
      }
    }
    // spawn bottom, guards far away
    let pc2 = 2 + ri(COLS - 4);
    for (let tries = 0; tries < 30 && L[14][pc2] !== '.'; tries++) pc2 = 2 + ri(COLS - 4);
    put(L, 14, pc2, 'P');
    const kinds = ['G', 'G', 'S', 'M'];
    const nGuards = 2 + ri(3);
    let placedG = 0;
    for (let tries = 0; tries < 120 && placedG < nGuards; tries++){
      const r = walkRows[ri(3)]; // not the bottom row
      const c = 1 + ri(COLS - 2);
      if (L[r][c] === '.' && Math.abs(c - pc2) + Math.abs(r - 14) > 10){
        put(L, r, c, kinds[ri(kinds.length)]);
        placedG++;
      }
    }
    return L;
  }

  function generateDaily(dateStr){
    const date = dateStr || dailyDateUTC();
    const baseSeed = hashStr('pay-dirt:' + date);
    for (let attempt = 0; attempt < 80; attempt++){
      const rows = generate((baseSeed + attempt * 0x9E3779B9) >>> 0);
      const s = solvable(rows);
      if (s.ok) return {rows, date, attempt};
    }
    // deterministic fallback: a vetted campaign map reskinned as the daily
    return {rows: campaign[3], date, attempt: -1};
  }

  return { campaign, names, solvable, generateDaily, dailyDateUTC, generate, hashStr };
})();
