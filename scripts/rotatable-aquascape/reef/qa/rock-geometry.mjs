import fs from 'node:fs';import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {erodedRock} from '../ReefRock.ts';
import {encrustRock} from '../ReefMaterials.ts';
let seed=913;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
const rock=erodedRock(1,2,3,.8,.6,.7,random),p=rock.getAttribute('position'),n=rock.getAttribute('normal');
assert.ok(rock.index,'retain indexed rock geometry');
assert.equal(rock.index.count/3,10580,'all original surface triangles retained');
let deepest=2,outer=0;
for(let i=0;i<p.count;i++){
 const x=(p.getX(i)-1)/.8,y=(p.getY(i)-2)/.6,z=(p.getZ(i)-3)/.7,r=Math.hypot(x,y,z);
 deepest=Math.min(deepest,r);outer=Math.max(outer,r);
 assert.ok(x*n.getX(i)+y*n.getY(i)+z*n.getZ(i)>0,'cavity normals face outwards');
}
assert.ok(deepest<.85&&deepest>=.499,'deep cavities without collapsed stone');assert.ok(outer<1.18,'bounded displacement');
// Compare the retained-index path with applying the same material to expanded vertices.
const old=encrustRock(rock.toNonIndexed()),indexed=encrustRock(rock),expanded=indexed.toNonIndexed();
for(const key of Object.keys(old.attributes)){assert.deepEqual(expanded.getAttribute(key).array,old.getAttribute(key).array,'index retention preserves '+key);assert.ok(indexed.getAttribute(key).array.every(Number.isFinite));}
const bytes=g=>Object.values(g.attributes).reduce((n,a)=>n+a.array.byteLength,0)+(g.index?.array.byteLength??0);
assert.ok(bytes(indexed)<bytes(old)*.3,'retain detail with at least 70% smaller fixture buffers');
console.log('Rock geometry passed:',bytes(indexed),'indexed bytes vs',bytes(old),'expanded bytes; identical expanded surface attributes.');
assert.equal(indexed.getAttribute('rockCavity'),undefined,'temporary cavity bake never reaches the GPU');
// Shape changes must keep all seeded rocks closed, outward facing and inside
// the established obstacle envelope; a single pretty fixture is insufficient.
let globalMinimum=2,globalMaximum=0;
for(let sample=0;sample<8;sample++){
 let state=913+sample*729,calls=0;
 const rng=()=>{calls++;state=(Math.imul(state,1664525)+1013904223)>>>0;return state/4294967296;};
 const g=erodedRock(0,0,0,1,.8,.9,rng),p=g.getAttribute('position'),n=g.getAttribute('normal');
 assert.equal(calls,124,'erosion preserves scene random stream');
 const edgeCounts=new Map(),positionKey=i=>[p.getX(i),p.getY(i),p.getZ(i)].map(v=>v.toFixed(5)).join(',');
 for(let i=0;i<p.count;i++){
  const x=p.getX(i),y=p.getY(i)/.8,z=p.getZ(i)/.9,r=Math.hypot(x,y,z);
  globalMinimum=Math.min(globalMinimum,r);globalMaximum=Math.max(globalMaximum,r);
  assert.ok(r>=.499&&r<1.18,'no collapsed core or growth beyond collision envelope');
  assert.ok(x*n.getX(i)+y*n.getY(i)+z*n.getZ(i)>0,'no inverted cavity walls');
 }
 for(let i=0;i<g.index.count;i+=3)for(let j=0;j<3;j++){
  const key=[positionKey(g.index.getX(i+j)),positionKey(g.index.getX(i+(j+1)%3))].sort().join('|');edgeCounts.set(key,(edgeCounts.get(key)||0)+1);
 }
 assert.ok([...edgeCounts.values()].every(n=>n===2),'eroded surface stays sealed across UV seams');
 g.dispose();
}
console.log('Eight eroded shapes: closed surfaces, stable RNG, radial bounds',globalMinimum,globalMaximum);

// Recorded from the pre-cache constructor: every vertex, normal, UV, cavity
// attribute and index must survive topology reuse exactly.
const parity=JSON.parse(fs.readFileSync(new URL('./rock-template-parity.json',import.meta.url)));
const hash=g=>{const h=crypto.createHash('sha256');for(const [name,a] of Object.entries(g.attributes)){h.update(name);h.update(Buffer.from(a.array.buffer));}h.update(Buffer.from(g.index.array.buffer));return h.digest('hex');};
for(const {sample:k,sha256} of parity){const make=()=>{let s=913+k*729;return erodedRock(k*.21,2-k*.13,.7,.8,.6,.7,()=>{s=(Math.imul(s,1664525)+1013904223)>>>0;return s/4294967296;});};const g=make();assert.equal(hash(g),sha256);g.translate(99,99,99);g.index.array.fill(0);assert.equal(hash(make()),sha256,'modifying one rock cannot mutate the reusable source');}
console.log('Cached topology: eight complete pre-change buffer hashes and independent geometry mutations passed.');
