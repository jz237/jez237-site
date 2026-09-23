import assert from 'node:assert/strict';
import * as T from 'three';
import {buildAnemones} from '../Anemones.ts';
import {tissueFlow} from '../AnemoneFlow.ts';
let seed=91;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
const {mesh,tentacles}=buildAnemones([new T.Vector3(3,1,.8),new T.Vector3(-3,.8,1)],{value:0},random,p=>p.y-.28);
assert.equal(tentacles,540);
assert.ok(mesh.geometry.index, 'retain shared vertices without discarding detail');
const bytes=Object.values(mesh.geometry.attributes).reduce((sum,a)=>sum+a.array.byteLength,0)+mesh.geometry.index.array.byteLength;
assert.ok(bytes<8000000, 'anemone geometry buffers remain below 8 MB');
const p=mesh.geometry.getAttribute('position'),n=mesh.geometry.getAttribute('normal'),flex=mesh.geometry.getAttribute('anemoneFlex');
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
assert.equal(ends.size,540);assert.ok([...ends.values()].every(e=>e.root>0&&e.tip>0));
console.log('Anemone buffers:',bytes,'bytes;',mesh.geometry.index.count/3,'triangles.');
console.log(`Anemone geometry passed: ${tentacles} anchored tentacles, ${(100*facingOut/total).toFixed(2)}% outward normals.`);
// A central depression belongs to the oral disc, without a cylinder cap filling it.
const ray=new T.Raycaster(new T.Vector3(3,3,.8),new T.Vector3(0,-1,0));
const centerHit=ray.intersectObject(mesh)[0];ray.set(new T.Vector3(3.10,3,.8),new T.Vector3(0,-1,0));const lipHit=ray.intersectObject(mesh)[0];
assert.ok(lipHit.point.y-centerHit.point.y>.05,'oral center is recessed below its surrounding lip');
// Closed tip vertices all have a stable unit normal, rather than zero normals.
let tips=0;for(let i=0;i<p.count;i++)if(flex.getX(i)===1){assert.ok(new T.Vector3().fromBufferAttribute(n,i).length()>.999);tips++;}
assert.equal(tips,540*9);
// The first and last vertex in each circular row share shading after UV removal.
for(let i=0;i<p.count-8;i++)if(flex.getW(i)>0&&flex.getX(i)<1&&i+8<p.count&&p.getX(i)===p.getX(i+8)&&p.getY(i)===p.getY(i+8))assert.ok(new T.Vector3().fromBufferAttribute(n,i).distanceTo(new T.Vector3().fromBufferAttribute(n,i+8))<1e-6);
assert.equal(mesh.geometry.getAttribute('uv'),undefined,'no unused UV allocation for the vertex-colored skin');
// Packed curved axes must follow the actual centerline; the small signed buffer
// keeps the extra shading data below the existing8MB geometry budget.
const axes=mesh.geometry.getAttribute('anemoneAxis');assert.equal(axes.normalized,true);assert.ok(axes.array instanceof Int16Array);
const decode=i=>{let x=axes.getX(i),y=axes.getY(i),z=1-Math.abs(x)-Math.abs(y);if(z<0){const old=x;x=(1-Math.abs(y))*(x>=0?1:-1);y=(1-Math.abs(old))*(y>=0?1:-1);}return new T.Vector3(x,y,z).normalize();};
const strands=new Map();for(let i=0;i<p.count;i++)if(flex.getW(i)>0){const phase=flex.getY(i),list=strands.get(phase)||[];list.push(i);strands.set(phase,list);}
let worstDot=1,minDeterminant=Infinity;
for(const ids of strands.values()){
 const centers=[];for(let row=0;row<19;row++){const center=new T.Vector3();for(let j=0;j<8;j++)center.add(new T.Vector3().fromBufferAttribute(p,ids[row*9+j]));centers.push(center.multiplyScalar(1/8));}
 for(let row=1;row<18;row++){
  const i=ids[row*9],axis=decode(i),a=flex.getX(i)-flex.getX(ids[(row-1)*9]),b=flex.getX(ids[(row+1)*9])-flex.getX(i);
  const direction=centers[row].clone().sub(centers[row-1]).multiplyScalar(b/a).addScaledVector(centers[row+1].clone().sub(centers[row]),a/b).normalize();worstDot=Math.min(worstDot,axis.dot(direction));
  const t=flex.getX(i),phase=flex.getY(i),arc=flex.getZ(i),scale=Math.min(flex.getW(i),arc*.85);
  for(const time of [0,1,3,7,15,31]){
   const f=tissueFlow(time,t,phase),d=new T.Vector3((f[2]*t*t+2*t*f[0])*scale,0,(f[3]*t*t+2*t*f[1])*scale);
   minDeterminant=Math.min(minDeterminant,1+axis.dot(d)/arc);
   const h=1e-5,before=tissueFlow(time,t-h,phase),after=tissueFlow(time,t+h,phase);
   for(let k=0;k<2;k++)assert.ok(Math.abs((after[k]*(t+h)**2-before[k]*(t-h)**2)/(2*h)-(f[k+2]*t*t+2*t*f[k]))<1e-6,'analytic bending derivative matches actual deformation');
  }
 }
}
assert.ok(worstDot>.97,'compressed axis follows curved tissue: '+worstDot);assert.ok(minDeterminant>.4,'sampled motion does not fold the local deformation inside out: '+minDeterminant);
console.log('Curved tissue shading passed: axis alignment',worstDot,'minimum sampled deformation determinant',minDeterminant);
mesh.geometry.dispose();mesh.material.dispose();
