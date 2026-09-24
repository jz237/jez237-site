import assert from 'node:assert/strict';
import * as T from 'three';
import {buildAnemones,discPoint} from '../Anemones.ts';
import {tissueFlow} from '../AnemoneFlow.ts';
let seed=91;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
const {mesh,tentacles,behavior}=buildAnemones([new T.Vector3(3,1,.8),new T.Vector3(-3,.8,1)],{value:0},random,p=>p.y-.28);
assert.equal(tentacles,800);
assert.deepEqual(behavior.hosts.map(h=>h.strands.length),[360,260,180]);
assert.equal(behavior.brushTexture.image.width,tentacles+1);
assert.equal(behavior.brushData.length,(tentacles+1)*4);
assert.ok(mesh.geometry.index, 'retain shared vertices without discarding detail');
const bytes=Object.values(mesh.geometry.attributes).reduce((sum,a)=>sum+a.array.byteLength,0)+mesh.geometry.index.array.byteLength;
assert.ok(bytes<29000000, 'retain all800 strands and24 axial sections with12-sided shafts and24-sided crowns within29MB; extra radial detail is restricted to the final eight rings');
const opticalWidth=mesh.geometry.getAttribute('anemoneThickness');
assert.equal(opticalWidth.normalized,true);assert.ok(opticalWidth.array instanceof Uint8Array);
assert.equal(opticalWidth.count,mesh.geometry.getAttribute('position').count);
assert.ok([...opticalWidth.array].every(v=>v>0),'tissue always has finite optical thickness');
assert.ok(Math.max(...opticalWidth.array.subarray(4000,10000))-Math.min(...opticalWidth.array.subarray(4000,10000))>30,'different strand widths and thick oral tissue retain optical variation');
const p=mesh.geometry.getAttribute('position'),n=mesh.geometry.getAttribute('normal'),flex=mesh.geometry.getAttribute('anemoneFlex');
const colors=mesh.geometry.getAttribute('color');
assert.ok(colors.array instanceof Uint16Array&&colors.normalized,'linear tissue color retains 16-bit precision in a compact buffer');
for(let host=0;host<3;host++)for(const r of [.1,.4,.7,1]){
 assert.ok(discPoint(r,0,1,host).distanceTo(discPoint(r,Math.PI*2,1,host))<1e-12,'folded disc closes periodically');
}
// The hidden root bed must retain pigmentation variation without uncolored
// islands. Bright uniform oral tissue looked like a plastic tray.
let bodyMin=Infinity,bodyMax=0,bodyCount=0;
for(let i=0;i<p.count;i++)if(flex.getW(i)===0){
 const value=colors.getX(i)+colors.getY(i)+colors.getZ(i);
 assert.ok(value>0&&Number.isFinite(value));bodyMin=Math.min(bodyMin,value);bodyMax=Math.max(bodyMax,value);bodyCount++;
}
assert.ok(bodyCount>20000&&bodyMax/bodyMin>3,'resolved folds retain sheltered roots and varied radial pigmentation');
const rings=new Map();
for(let i=0;i<p.count;i++){
 assert.ok(Number.isFinite(p.getX(i)+p.getY(i)+p.getZ(i)+n.getX(i)+n.getY(i)+n.getZ(i)),'finite positions and normals');
 const t=flex.getX(i);if(t<=0||t>=.94)continue;
 const key=flex.getY(i)+':'+t;
 const r=rings.get(key)||{x:0,y:0,z:0,count:0,ids:[]};r.x+=p.getX(i);r.y+=p.getY(i);r.z+=p.getZ(i);r.count++;r.ids.push(i);rings.set(key,r);
}
let facingOut=0,total=0;
for(const r of rings.values()){r.x/=r.count;r.y/=r.count;r.z/=r.count;for(const i of r.ids){const dot=(p.getX(i)-r.x)*n.getX(i)+(p.getY(i)-r.y)*n.getY(i)+(p.getZ(i)-r.z)*n.getZ(i);if(dot>0)facingOut++;total++;}}
assert.ok(facingOut/total>.99,'tentacle skins face outward; inverted tubes appear as split leaves');
// Every tentacle has anchored root vertices and a rounded, joined tip.
const ends=new Map();for(let i=0;i<p.count;i++){if(flex.getW(i)===0)continue;const phase=flex.getY(i),e=ends.get(phase)||{root:0,tip:0};if(flex.getX(i)===0)e.root++;if(flex.getX(i)===1)e.tip++;ends.set(phase,e);}
assert.equal(ends.size,800);assert.ok([...ends.values()].every(e=>e.root>0&&e.tip>0));
console.log('Anemone buffers:',bytes,'bytes;',mesh.geometry.index.count/3,'triangles.');
console.log(`Anemone geometry passed: ${tentacles} anchored tentacles, ${(100*facingOut/total).toFixed(2)}% outward normals.`);
// A central depression belongs to the oral disc, without a cylinder cap filling it.
const ray=new T.Raycaster(new T.Vector3(3,3,.8),new T.Vector3(0,-1,0));
const centerHit=ray.intersectObject(mesh)[0];ray.set(new T.Vector3(3.10,3,.8),new T.Vector3(0,-1,0));const lipHit=ray.intersectObject(mesh)[0];
assert.ok(lipHit.point.y-centerHit.point.y>.05,'oral center is recessed below its surrounding lip');
// Closed tip vertices all have a stable unit normal, rather than zero normals.
let tips=0;for(let i=0;i<p.count;i++)if(flex.getX(i)===1){assert.ok(new T.Vector3().fromBufferAttribute(n,i).length()>.999);tips++;}
assert.equal(tips,800*25);
// The first and last vertex in each circular row share shading after UV removal.
for(const ring of rings.values()){const first=ring.ids[0],last=ring.ids.at(-1);assert.ok(new T.Vector3().fromBufferAttribute(n,first).distanceTo(new T.Vector3().fromBufferAttribute(n,last))<1e-6,'both crown and shaft seams retain continuous shading');}
assert.equal(mesh.geometry.getAttribute('uv'),undefined,'no unused UV allocation for the vertex-colored skin');
// Packed curved axes must follow the actual centerline; the small signed buffer
// keeps the extra shading data below the reviewed11MB geometry budget.
const axes=mesh.geometry.getAttribute('anemoneAxis');assert.equal(axes.normalized,true);assert.ok(axes.array instanceof Int16Array);
const decode=i=>{let x=axes.getX(i),y=axes.getY(i),z=1-Math.abs(x)-Math.abs(y);if(z<0){const old=x;x=(1-Math.abs(y))*(x>=0?1:-1);y=(1-Math.abs(old))*(y>=0?1:-1);}return new T.Vector3(x,y,z).normalize();};
const strands=new Map();for(let i=0;i<p.count;i++)if(flex.getW(i)>0){const phase=flex.getY(i),list=strands.get(phase)||[];list.push(i);strands.set(phase,list);}
// Attached roots should follow folded tissue rather than a flat pedestal.
const rootHeights=[];
for(const ids of [...strands.values()].slice(0,180))rootHeights.push(ids.slice(0,12).reduce((sum,i)=>sum+p.getY(i),0)/12);
assert.ok(Math.max(...rootHeights)-Math.min(...rootHeights)>.15,'tentacle attachments follow the raised and lowered disc folds');
let worstDot=1,minDeterminant=Infinity,minFeedingDeterminant=Infinity,minBrushDeterminant=Infinity;const lobeRatios=[];
for(const ids of strands.values()){
 const rowMap=new Map();for(const i of ids){const t=flex.getX(i),row=rowMap.get(t)||[];row.push(i);rowMap.set(t,row);}
 const rowIds=[...rowMap.values()],rows=rowIds.length,cap=rows-5;
 assert.equal(rows,25);assert.ok(rowIds.every((row,j)=>row.length===(j<=16?13:25)),'extra radial detail is confined to the crown');
 for(const row of rowIds)assert.ok(new T.Vector3().fromBufferAttribute(n,row[0]).distanceTo(new T.Vector3().fromBufferAttribute(n,row.at(-1)))<1e-6,'adaptive crown rings have no shading seam');
 const centers=rowIds.map(ids=>ids.slice(0,-1).reduce((center,i)=>center.add(new T.Vector3().fromBufferAttribute(p,i)),new T.Vector3()).multiplyScalar(1/(ids.length-1)));
 const ringRadius=row=>rowIds[row].slice(0,-1).reduce((sum,i)=>sum+new T.Vector3().fromBufferAttribute(p,i).distanceTo(centers[row]),0)/(rowIds[row].length-1);
 // The crown has deliberately pinched lobes, while staying full in every
 // direction. This bounds the organic lobing without allowing a flattened leaf.
 for(const row of [cap,cap+1,cap+2]){
  const idsAt=rowIds[row].slice(0,-1),axis=decode(rowIds[row][0]);
  const offsets=idsAt.map(i=>new T.Vector3().fromBufferAttribute(p,i).sub(centers[row]));
  const radii=offsets.map(o=>o.length());
  const aspect=Math.min(...radii)/Math.max(...radii);
  assert.ok(aspect>.53&&aspect<.84,'crown has visible fleshy lobes without collapsing into a flat spoon: '+aspect);
  assert.ok(offsets.every(o=>Math.abs(o.clone().normalize().dot(axis))<.001),'cap frame stays perpendicular to curve tangent');
 }
 const capAspect=centers[cap].distanceTo(centers.at(-1))/ringRadius(cap);
 assert.ok(capAspect>.82&&capAspect<.90,'softly flattened crown closes within one tissue radius: '+capAspect);
 const strand=behavior.hosts.flatMap(h=>h.strands).find(s=>Math.fround(s.phase)===flex.getY(ids[0]));
 assert.ok(strand&&centers.at(-1).distanceTo(strand.tip)<1e-5,'feeding and brushing use the actual crown endpoint');
 lobeRatios.push(Math.max(...Array.from({length:cap-Math.floor(cap*.7)},(_,i)=>Math.floor(cap*.7)+i).map(ringRadius))/ringRadius(Math.floor(cap*.55)));
 for(let row=1;row<rows-1;row++){
  const i=rowIds[row][0],axis=decode(i),a=flex.getX(i)-flex.getX(rowIds[row-1][0]),b=flex.getX(rowIds[row+1][0])-flex.getX(i);
  const direction=centers[row].clone().sub(centers[row-1]).multiplyScalar(b/a).addScaledVector(centers[row+1].clone().sub(centers[row]),a/b).normalize();worstDot=Math.min(worstDot,axis.dot(direction));
  const t=flex.getX(i),phase=flex.getY(i),arc=flex.getZ(i),scale=Math.min(flex.getW(i),arc*.85);
  for(const time of [0,1,3,7,15,31]){
   const f=tissueFlow(time,t,phase),d=new T.Vector3((f[2]*t*t+2*t*f[0])*scale,0,(f[3]*t*t+2*t*f[1])*scale);
   minDeterminant=Math.min(minDeterminant,1+axis.dot(d)/arc);
   const shrink=1-.20*t*t*(3-2*t),host=behavior.hosts[Math.floor(phase/8)].center;
   const flowed=centers[row].clone().add(new T.Vector3(f[0]*t*t*scale,0,f[1]*t*t*scale));
   const deformation=d.clone().multiplyScalar(shrink).addScaledVector(host.clone().sub(flowed),.20*6*t*(1-t));
   minFeedingDeterminant=Math.min(minFeedingDeterminant,shrink*shrink*(shrink+axis.dot(deformation)/arc));
   minBrushDeterminant=Math.min(minBrushDeterminant,shrink*shrink*(shrink+axis.dot(deformation)/arc-.18*6*t*(1-t)*(1-.20*2.5)));
   const h=1e-5,before=tissueFlow(time,t-h,phase),after=tissueFlow(time,t+h,phase);
   for(let k=0;k<2;k++)assert.ok(Math.abs((after[k]*(t+h)**2-before[k]*(t-h)**2)/(2*h)-(f[k+2]*t*t+2*t*f[k]))<1e-6,'analytic bending derivative matches actual deformation');
  }
 }
}
assert.ok(minFeedingDeterminant>.08,'maximum contact contraction must not invert tentacle skin: '+minFeedingDeterminant);
console.log('Minimum feeding deformation determinant:',minFeedingDeterminant,'with worst brush',minBrushDeterminant);
assert.ok(minBrushDeterminant>.025,'simultaneous brush and feeding must remain orientation preserving');
assert.ok(worstDot>.97,'compressed axis follows curved tissue: '+worstDot);assert.ok(minDeterminant>.4,'sampled motion does not fold the local deformation inside out: '+minDeterminant);
assert.ok(Math.min(...lobeRatios)>1.5,'each terminal knob is visibly wider than its slender shaft');
assert.ok(Math.max(...lobeRatios)-Math.min(...lobeRatios)>.4,'slender and inflated tentacles keep individual anatomical variation');
console.log('Curved tissue shading passed: axis alignment',worstDot,'minimum sampled deformation determinant',minDeterminant);
// The twelve-to-twenty-four-sided transition must remain a closed skin. Weld
// only the intentional angular seams and closed pole, then inspect edge use.
const selected=new Set([...strands.values()][0]),weld=new Map(),edges=new Map(),index=mesh.geometry.index;
for(const i of selected){const key=[p.getX(i),p.getY(i),p.getZ(i)].map(v=>Math.round(v*1e6)).join(':');weld.set(i,key);}
for(let i=0;i<index.count;i+=3){const a=index.getX(i),b=index.getX(i+1),c=index.getX(i+2);if(!selected.has(a))continue;assert.ok(selected.has(b)&&selected.has(c));const v=[weld.get(a),weld.get(b),weld.get(c)];if(new Set(v).size<3)continue;for(let j=0;j<3;j++){const key=[v[j],v[(j+1)%3]].sort().join('|');edges.set(key,(edges.get(key)||0)+1);}}
assert.ok([...edges.values()].every(n=>n===1||n===2),'no nonmanifold adaptive-ring joins');
assert.equal([...edges.values()].filter(n=>n===1).length,12,'only the anchored root is open; crown transition has no cracks');
mesh.geometry.dispose();mesh.material.dispose();
