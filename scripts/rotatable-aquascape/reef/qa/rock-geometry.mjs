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
