#!/usr/bin/env node
// Structural audit of one assembly (or the whole bee): ids, names, info text, materials per part, budgets, bounds.
//   node audit.cjs head            -> builds only js/assemblies/head.js and checks it against the contract
//   node audit.cjs all             -> builds everything
// Exit code 0 = no FAIL lines. WARN lines are advisory.
const { spawnSync } = require('child_process');
const path = require('path');

const ASM = {
  head: { top: ['head-shell', 'head-frame', 'neural-processor', 'mandibles', 'neck-joint'], leaves: 28, tris: 320000, meshes: 130, ms: 900 },
  optics: { top: ['eye-r', 'eye-l', 'ocelli', 'antenna-r', 'antenna-l'], leaves: 28, tris: 300000, meshes: 130, ms: 900 },
  thorax: { top: ['thorax-armor', 'thorax-chassis'], leaves: 32, tris: 360000, meshes: 130, ms: 1100 },
  flight: { top: ['wing-mount-r', 'wing-mount-l', 'flight-motor'], leaves: 28, tris: 320000, meshes: 150, ms: 900 },
  wings: { top: ['wing-r', 'wing-l'], leaves: 8, tris: 260000, meshes: 60, ms: 900 },
  abdomen: { top: ['abdomen-shell', 'abdomen-frame', 'petiole-joint'], leaves: 32, tris: 360000, meshes: 130, ms: 1000 },
  tail: { top: ['stabilizer', 'stinger'], leaves: 25, tris: 300000, meshes: 120, ms: 800 },
  core: { top: ['power-core', 'pollination-module'], leaves: 36, tris: 360000, meshes: 140, ms: 1000 },
  legs: { top: ['leg-front-r', 'leg-mid-r', 'leg-rear-r', 'leg-front-l', 'leg-mid-l', 'leg-rear-l'], leaves: 72, tris: 480000, meshes: 300, ms: 1600 },
};

const name = process.argv[2] || 'all';
const names = name === 'all' ? Object.keys(ASM) : name.split(',');
const cfg = { names, asm: ASM };

const expr = `(() => {
  const cfg = ${JSON.stringify(cfg)};
  const A = window.__apx, bee = A.bee;
  const issues = [], warn = [];
  const allowed = new Set(), want = [];
  for (const n of cfg.names) { for (const t of cfg.asm[n].top) { allowed.add(t); want.push(t); } }
  const budget = (k) => cfg.names.reduce((s, n) => s + cfg.asm[n][k], 0);
  const seen = new Set();
  const tri = (m) => { const g = m.geometry; return ((g.index ? g.index.count : g.attributes.position.count) / 3) * (m.isInstancedMesh ? m.count : 1); };
  let leaves = 0, furStrands = 0;
  for (const p of bee.parts) {
    if (seen.has(p.id)) issues.push('duplicate id ' + p.id);
    seen.add(p.id);
    if (!/^[a-z0-9][a-z0-9-]*(\\/[a-z0-9][a-z0-9-]*)*$/.test(p.id)) issues.push('bad id (lower-case kebab segments only): ' + p.id);
    if (p.selectable) {
      if (!p.name || p.name === p.localId) issues.push('no display name: ' + p.id);
      if (!p.info || p.info.length < 24) issues.push('missing/short info text: ' + p.id);
      if (p.meshes.some((m) => !m.userData.fur && !m.layers.isEnabled(6)) ) leaves++;
    }
    if (!p.group) issues.push('no group: ' + p.id);
    const mats = new Set(p.meshes.filter((m) => !m.userData.fur && !m.layers.isEnabled(6)).map((m) => m.material));
    if (mats.size > 3) warn.push('more than 3 materials (' + mats.size + '): ' + p.id);
    for (const m of p.meshes) if (m.userData.fur) furStrands += m.geometry.attributes.position.count / 7;
    if (p.meshes.length === 0 && p.children.length === 0) issues.push('empty part (no geometry, no children): ' + p.id);
    if (p.tag === 'shell' && p.meshes.length === 0) warn.push("tag 'shell' on a part without own meshes (x-ray ghosts only own meshes): " + p.id);
  }
  for (const t of bee.tops) {
    if (!allowed.has(t.id) && !cfg.names.some((n) => t.id.startsWith(n + '-'))) issues.push('unexpected top-level id: ' + t.id);
  }
  for (const id of want) if (!bee.get(id)) issues.push('missing required top-level id: ' + id);
  const st = bee.stats();
  if (st.tris > budget('tris')) issues.push('triangles over budget: ' + st.tris + ' > ' + budget('tris'));
  if (st.meshes > budget('meshes')) issues.push('meshes over budget: ' + st.meshes + ' > ' + budget('meshes'));
  if (leaves < budget('leaves')) issues.push('too few named leaf parts: ' + leaves + ' < ' + budget('leaves'));
  const ms = (A.report || []).filter((r) => cfg.names.includes(r.name));
  for (const r of ms) {
    if (!r.ok) issues.push('assembly failed to build: ' + r.name + ' ' + (r.error || ''));
    else if (r.ms > cfg.asm[r.name].ms) warn.push('build time ' + r.ms + ' ms > ' + cfg.asm[r.name].ms + ' ms: ' + r.name);
  }
  const box = new A.THREE.Box3();
  const r1 = (v) => Math.round(v * 10) / 10;
  const tops = bee.tops.map((t) => {
    const parts = [...t.walk()];
    let tris = 0, meshes = 0, leafN = 0;
    for (const q of parts) { for (const m of q.meshes) { tris += tri(m); meshes++; } if (q.selectable && q.meshes.length) leafN++; }
    bee.setExplode(0, true);
    bee.worldBounds(box, parts);
    const b0 = box.isEmpty() ? null : [box.min, box.max].map((v) => [r1(v.x), r1(v.y), r1(v.z)]);
    return { id: t.id, group: t.group, parts: parts.length, leaves: leafN, meshes, tris: Math.round(tris), box: b0 };
  });
  bee.setExplode(1, true);
  const tops1 = bee.tops.map((t) => { bee.worldBounds(box, [...t.walk()]); return box.isEmpty() ? null : [box.min, box.max].map((v) => [r1(v.x), r1(v.y), r1(v.z)]); });
  tops.forEach((t, i) => { t.boxExploded = tops1[i]; });
  bee.setExplode(0, true);
  return { issues, warn, stats: st, leaves, furStrands: Math.round(furStrands), report: A.report, tops };
})()`;

const shot = path.join(__dirname, 'shot.cjs');
const tmp = path.join(require('os').tmpdir(), 'apx9-audit-' + process.pid + '.png');
const r = spawnSync('node', [shot, '--q', name === 'all' ? '' : 'only=' + names.join(','), '--snap', '{"explode":0}', '--out', tmp, '--eval', expr, '--w', '640', '--h', '400'], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, timeout: 400000 });
const out = (r.stdout || '') + (r.stderr || '');
const m = out.match(/^\[eval\] (.*)$/m);
const errs = out.split('\n').filter((l) => /^\[(pageerror|FAILED|error|console\.error)\]/.test(l) && !/brand\.svg|404/.test(l));
if (!m) { console.log(out.slice(-3000)); console.log('FAIL audit produced no result'); process.exit(1); }
const j = JSON.parse(m[1]);
const fmt = (b) => (b ? `[${b[0].join(',')}]..[${b[1].join(',')}]` : '-');
console.log(`audit ${names.join(',')}: parts ${j.stats.parts}, named leaves ${j.leaves}, meshes ${j.stats.meshes}, tris ${j.stats.tris}, fur strands ${j.furStrands}`);
console.log('build ms: ' + j.report.map((x) => `${x.name}${x.ok ? '' : '(FAILED)'}=${x.ms ?? '?'}`).join(' '));
for (const t of j.tops) console.log(`  ${t.id.padEnd(22)} g=${String(t.group).padEnd(14)} parts ${String(t.parts).padStart(3)} leaves ${String(t.leaves).padStart(3)} meshes ${String(t.meshes).padStart(3)} tris ${String(t.tris).padStart(7)}  rest ${fmt(t.box)}  exploded ${fmt(t.boxExploded)}`);
for (const e of errs) console.log('FAIL console: ' + e.slice(0, 300));
for (const w of j.warn) console.log('WARN ' + w);
for (const i of j.issues) console.log('FAIL ' + i);
const bad = j.issues.length + errs.length;
console.log(bad ? `${bad} FAIL` : 'PASS (no FAIL lines)');
process.exit(bad ? 1 : 0);
