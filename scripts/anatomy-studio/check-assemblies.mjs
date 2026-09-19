/** Print how each nested assembly resolves against the manifest, so member regexes can be tuned against real names. */
import {readFileSync} from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const HERE = path.dirname(new URL(import.meta.url).pathname), DEMO = path.resolve(HERE, '../../demos/anatomy-studio');
const manifest = JSON.parse(readFileSync(path.join(DEMO, 'manifest.json'), 'utf8'));
const {assemblies, assemblyContext, assemblyOffset} = await import(pathToFileURL(path.join(DEMO, 'assemblies.js')).href);
let failures = 0;
const expect = {heart: 30, lungs: 25, spine: 55, brain: 60, skull: 60, eye: 10, hand: 35, knee: 15, ribcage: 45, digestive: 40, urinary: 10, face: 30, aorta: 60, pelvis: 10, shoulder: 14, larynx: 28, foot: 38, reproductive: 9};
for (const [id, a] of Object.entries(assemblies)) {
  const members = manifest.pieces.filter(p => a.match(p) && !(a.exclude && a.exclude(p)));
  const ctx = assemblyContext(a, members); const layerHits = new Array(a.layers.length).fill(0); let fallback = 0;
  for (const p of members) { const i = a.layers.findIndex(l => l.test(p)); if (i >= 0) layerHits[i]++; if (i === a.layers.length - 1) fallback++; assemblyOffset(a, p, ctx); }
  const primary = members.filter(p => a.primary?.(p));
  console.log(`\n== ${id}: ${members.length} members (${primary.length} primary), centre ${ctx.center.map(v => v.toFixed(2))}, axis ${ctx.axis.map(v => v.toFixed(2))}`);
  console.log('   layer hits', layerHits.join(' '), `| fallback layer: ${fallback}`);
  console.log('   fallback members:', members.filter(p => a.layers.findIndex(l => l.test(p)) === a.layers.length - 1).map(p => p.name + (p.side === 'M' ? '' : '/' + p.side)).slice(0, 30).join(', '));
  if (members.length < expect[id]) { console.log(`   FAIL: expected at least ${expect[id]}`); failures++; }
  if (manifest.assemblies[id]?.length !== members.length) { console.log(`   FAIL: manifest has ${manifest.assemblies[id]?.length} members; rerun prepare.mjs`); failures++; }
}
const spine = manifest.pieces.filter(p => assemblies.spine.match(p));
const vert = spine.filter(p => p.file === 'skeletal').length, discs = spine.filter(p => /^Intervertebral disc/.test(p.name)).length;
console.log(`\nspine: ${vert} vertebral elements (expect 26), ${discs} discs (expect 23)`); if (vert !== 26 || discs !== 23) failures++;
console.log(failures ? `\n${failures} FAILURE(S)` : '\nAll assemblies resolve.'); process.exit(failures ? 1 : 0);
