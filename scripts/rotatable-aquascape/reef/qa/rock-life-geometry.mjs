import assert from 'node:assert/strict';import * as T from 'three';import {reefRockLife} from '../ReefRockLife.ts';import {erodedRock} from '../ReefRock.ts';
let state=9324;const random=()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state/4294967296;};
const support=new T.Mesh(erodedRock(0,1,0,.7,.8,.75,random));const result=reefRockLife([support],random);
assert.ok(result.stats.patches>=3);assert.ok(result.stats.pores>30);assert.ok(result.stats.triangles<30000);
let maxGap=0,minArea=Infinity;const p=support.geometry.getAttribute('position'),idx=support.geometry.index,tri=new T.Triangle(),nearest=new T.Vector3();
for(const g of [...result.crusts,...result.pores])for(const attribute of Object.values(g.attributes))assert.ok(attribute.array.every(Number.isFinite));
for(const g of result.pores){const pos=g.getAttribute('position'),n=g.getAttribute('normal'),indices=g.index;
for(let start=0;start<pos.count;start+=37){let axis=new T.Vector3(),base=new T.Vector3(),lip=new T.Vector3();
 for(let k=0;k<8;k++){const foot=new T.Vector3().fromBufferAttribute(pos,start+k);base.add(foot);lip.add(new T.Vector3().fromBufferAttribute(pos,start+18+k));let closest=Infinity;
 for(let j=0;j<idx.count;j+=3){tri.a.fromBufferAttribute(p,idx.getX(j));tri.b.fromBufferAttribute(p,idx.getX(j+1));tri.c.fromBufferAttribute(p,idx.getX(j+2));tri.closestPointToPoint(foot,nearest);closest=Math.min(closest,nearest.distanceTo(foot));}maxGap=Math.max(maxGap,closest);assert.ok(closest<=.00501,'raised tissue must meet actual support');}
 base.divideScalar(8);lip.divideScalar(8);axis.copy(lip).sub(base).normalize();const floor=new T.Vector3().fromBufferAttribute(pos,start+36);
 assert.ok(lip.clone().sub(floor).dot(axis)>.001,'osculum floor must lie below lip');
 for(let row=0;row<4;row++){const a=start+row*9,b=a+8;assert.ok(new T.Vector3().fromBufferAttribute(pos,a).distanceTo(new T.Vector3().fromBufferAttribute(pos,b))<1e-6);assert.ok(new T.Vector3().fromBufferAttribute(n,a).distanceTo(new T.Vector3().fromBufferAttribute(n,b))<1e-6);}}
for(let j=0;j<indices.count;j+=3){const a=new T.Vector3().fromBufferAttribute(pos,indices.getX(j)),b=new T.Vector3().fromBufferAttribute(pos,indices.getX(j+1)),c=new T.Vector3().fromBufferAttribute(pos,indices.getX(j+2));const area=b.sub(a).cross(c.sub(a)).length();minArea=Math.min(minArea,area);assert.ok(area>1e-10);}
for(let j=0;j<pos.count;j++){const point=new T.Vector3().fromBufferAttribute(pos,j);assert.ok(result.obstacles.some(o=>o.center.distanceTo(point)<=o.radius));}}
console.log('Rock life geometry',JSON.stringify({...result.stats,maxGap,minArea}));

// Cached attachment results preserve every attribute and collision volume.
state=9324;const supportAgain=new T.Mesh(erodedRock(0,1,0,.7,.8,.75,random));const cached=reefRockLife([supportAgain],random,result.attachments);
assert.deepEqual(cached.stats,result.stats);assert.deepEqual(cached.obstacles,result.obstacles);
for(const key of ['crusts','pores'])for(let i=0;i<result[key].length;i++){assert.deepEqual(cached[key][i].index.array,result[key][i].index.array);for(const attr of Object.keys(result[key][i].attributes))assert.deepEqual(cached[key][i].getAttribute(attr).array,result[key][i].getAttribute(attr).array);}
assert.throws(()=>reefRockLife([new T.Mesh(new T.BoxGeometry(1,1,1))],random,result.attachments),/stale/);
const fs=await import('node:fs'),{createHash}=await import('node:crypto');
const baked=JSON.parse(fs.readFileSync(new URL('../assets/rock-life/attachments.json',import.meta.url),'utf8'));
const expectedHash=createHash('sha256').update(['ReefRockLife.ts','RockRayIndex.ts','CoralCrust.ts'].map(f=>fs.readFileSync(new URL('../'+f,import.meta.url),'utf8').replaceAll('\r\n','\n')).join('\n')).digest('hex');
assert.equal(baked.sourceHash,expectedHash,'refresh scene attachment bake when its recipe changes');
console.log('Cached attachment geometry is byte-identical; stale source/rock inputs rejected.');
