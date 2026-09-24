import assert from 'node:assert/strict';
import * as T from 'three';
import {coralCrust} from '../CoralCrust.ts';
import {erodedRock} from '../ReefRock.ts';
let seed=123;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
const rock=erodedRock(0,0,0,1,.8,.9,random),mesh=new T.Mesh(rock,new T.MeshBasicMaterial({side:T.DoubleSide}));
const ray=new T.Raycaster(new T.Vector3(0,0,3),new T.Vector3(0,0,-1));
const hit=ray.intersectObject(mesh)[0],crust=coralCrust(rock,hit.point,hit.face.normal,.65,.12,4);
assert.ok(crust.index.count>300&&crust.index.count<rock.index.count);
for(const a of Object.values(crust.attributes))assert.ok(a.array.every(Number.isFinite));
const p=crust.getAttribute('position'),n=crust.getAttribute('normal');let maxGap=0;
for(let i=0;i<p.count;i+=13){const point=new T.Vector3().fromBufferAttribute(p,i),normal=new T.Vector3().fromBufferAttribute(n,i);assert.ok(normal.length()>.99);
 ray.set(point.clone().addScaledVector(normal,.04),normal.clone().negate());ray.far=.15;
 const support=ray.intersectObject(mesh)[0];assert.ok(support,'every sampled tissue point stays on actual rock');
 const gap=support.distance-.04;assert.ok(gap>-.001&&gap<.055,'thin attached tissue, no floating lobes');maxGap=Math.max(maxGap,gap);
}
for(let i=0;i<crust.index.count;i+=3){const a=new T.Vector3().fromBufferAttribute(p,crust.index.getX(i)),b=new T.Vector3().fromBufferAttribute(p,crust.index.getX(i+1)),c=new T.Vector3().fromBufferAttribute(p,crust.index.getX(i+2));assert.ok(new T.Vector3().crossVectors(b.sub(a),c.sub(a)).length()>1e-10,'clipped triangles keep nonzero area');}
const bytes=Object.values(crust.attributes).reduce((s,a)=>s+a.array.byteLength,0)+crust.index.array.byteLength;
assert.ok(bytes<160000,'resolved folds stay within the static geometry budget');
const edges=new Map();
for(let i=0;i<crust.index.count;i+=3)for(let j=0;j<3;j++){
 const key=[crust.index.getX(i+j),crust.index.getX(i+(j+1)%3)].sort((a,b)=>a-b).join(':');edges.set(key,(edges.get(key)||0)+1);
}
assert.ok([...edges.values()].every(count=>count===1||count===2),'resolved tissue has no nonmanifold seams');
assert.ok([...edges.values()].filter(count=>count===2).length>crust.index.count*.4,'interior triangles share indexed edges');
console.log('Encrusting tissue passed:',crust.index.count/3,'triangles,',bytes,'bytes, maximum sampled rock gap',maxGap);

// A small branching-colony foot must hug curved stone just as the large crust does.
ray.set(new T.Vector3(.04,2,.02),new T.Vector3(0,-1,0));ray.far=4;
const top=ray.intersectObject(mesh)[0],foot=coralCrust(rock,top.point,top.face.normal,.23,.8,17,{color:new T.Color().setHSL(.8,.52,.29),thickness:.006});
assert.ok(foot.index.count>45,'retain the supporting tissue footprint');
const fp=foot.getAttribute('position'),fn=foot.getAttribute('normal');let footGap=0;
for(let i=0;i<fp.count;i++){
 const position=new T.Vector3().fromBufferAttribute(fp,i),normal=new T.Vector3().fromBufferAttribute(fn,i);
 assert.ok(normal.length()>.99,'valid normals at clipped foot edges');
 ray.set(position.clone().addScaledVector(normal,.04),normal.clone().negate());ray.far=.08;
 const support=ray.intersectObject(mesh)[0];assert.ok(support,'foot remains directly supported by the original curved rock');
 const gap=support.distance-.04;assert.ok(gap>-.001&&gap<.014,'basal tissue cannot form a floating support disc');footGap=Math.max(footGap,gap);
}
for(let i=0;i<foot.index.count;i+=3){const a=new T.Vector3().fromBufferAttribute(fp,foot.index.getX(i)),b=new T.Vector3().fromBufferAttribute(fp,foot.index.getX(i+1)),c=new T.Vector3().fromBufferAttribute(fp,foot.index.getX(i+2));assert.ok(b.sub(a).cross(c.sub(a)).length()>1e-10,'nondegenerate clipped foot triangles');}
console.log('Clipped branching foot passed:',foot.index.count/3,'triangles; maximum sampled gap',footGap);

// On flat support, distinguish a spreading colony from a circular paint patch.
// Check the generated boundary independently of the growth-field formula.
const flat=new T.PlaneGeometry(3,3,96,96),flatCrust=coralCrust(flat,new T.Vector3(),new T.Vector3(0,0,1),1,.2,9);
const boundaryEdges=new Map();
for(let i=0;i<flatCrust.index.count;i+=3)for(let j=0;j<3;j++){
 const a=flatCrust.index.getX(i+j),b=flatCrust.index.getX(i+(j+1)%3),key=[a,b].sort((a,b)=>a-b).join(':');
 const edge=boundaryEdges.get(key);if(edge)edge.count++;else boundaryEdges.set(key,{a,b,count:1});
}
const boundaryVertices=new Set([...boundaryEdges.values()].filter(e=>e.count===1).flatMap(e=>[e.a,e.b]));
const flatP=flatCrust.getAttribute('position'),radii=[...boundaryVertices].map(i=>Math.hypot(flatP.getX(i),flatP.getY(i)));
assert.ok(Math.max(...radii)-Math.min(...radii)>.25,'spreading fronts retain deep irregular bays');
assert.ok(Math.max(...radii)<1.041,'colony remains within the conservative attachment envelope');
const adjacency=new Map();for(const e of boundaryEdges.values()){if(!adjacency.has(e.a))adjacency.set(e.a,[]);if(!adjacency.has(e.b))adjacency.set(e.b,[]);adjacency.get(e.a).push(e.b);adjacency.get(e.b).push(e.a);}
const visited=new Set(),pending=[0];while(pending.length){const i=pending.pop();if(visited.has(i))continue;visited.add(i);pending.push(...(adjacency.get(i)||[]).filter(j=>!visited.has(j)));}
assert.equal(visited.size,flatP.count,'growth fronts form one connected colony');
console.log('Connected growth fronts passed:',flatP.count,'vertices; boundary radius range',Math.min(...radii),Math.max(...radii));

// Thin lobed mantles resolve their rough tissue while staying attached to the
// curved support. Verify real ray distance, not just the displacement formula.
const mantle=coralCrust(rock,hit.point,hit.face.normal,.46,.8,2309231804,{color:new T.Color('#a481a1'),thickness:.014,lobed:true});
const mp=mantle.getAttribute('position'),mn=mantle.getAttribute('normal');let mantleGap=0;
for(let i=0;i<mp.count;i+=7){const pos=new T.Vector3().fromBufferAttribute(mp,i),normal=new T.Vector3().fromBufferAttribute(mn,i);ray.set(pos.clone().addScaledVector(normal,.04),normal.clone().negate());ray.far=.15;const support=ray.intersectObject(mesh)[0];assert.ok(support);const gap=support.distance-.04;assert.ok(gap>-.001&&gap<.045,'mantle remains a thin attached layer');mantleGap=Math.max(mantleGap,gap);}
mantle.computeBoundingSphere();for(let i=0;i<mp.count;i++)assert.ok(new T.Vector3().fromBufferAttribute(mp,i).distanceTo(mantle.boundingSphere.center)<=mantle.boundingSphere.radius+1e-6,'navigation sphere contains every new tissue vertex');
console.log('Thin lobed mantle passed:',mantle.index.count/3,'triangles; max sampled gap',mantleGap);

// A thin growing margin must inherit the actual support pigment, including
// clipped/interpolated edge vertices, without changing its physical surface.
const pigmented=new T.PlaneGeometry(3,3,96,96),gp=pigmented.getAttribute('position'),ground=[];
for(let i=0;i<gp.count;i++)ground.push(.3+gp.getX(i)*.05,.4+gp.getY(i)*.04,.2);
pigmented.setAttribute('color',new T.Float32BufferAttribute(ground,3));
const profile={color:new T.Color('#be7238'),thickness:0,lobed:true,film:true},gain=new T.Color(1,1,1);
const plain=coralCrust(pigmented,new T.Vector3(),new T.Vector3(0,0,1),1,.2,9,profile),blended=coralCrust(pigmented,new T.Vector3(),new T.Vector3(0,0,1),1,.2,9,{...profile,grounded:true});
assert.deepEqual(blended.index.array,plain.index.array);for(const name of ['position','uv'])assert.deepEqual(blended.getAttribute(name).array,plain.getAttribute(name).array);
assert.deepEqual(Object.keys(blended.attributes).sort(),Object.keys(plain.attributes).sort(),'pigment adds no GPU attributes');
const pigmentEdges=new Map();for(let i=0;i<blended.index.count;i+=3)for(let j=0;j<3;j++){const a=blended.index.getX(i+j),b=blended.index.getX(i+(j+1)%3),key=[a,b].sort((a,b)=>a-b).join(':');const e=pigmentEdges.get(key);if(e)e.count++;else pigmentEdges.set(key,{a,b,count:1});}
const rim=new Set([...pigmentEdges.values()].filter(e=>e.count===1).flatMap(e=>[e.a,e.b])),bp=blended.getAttribute('position'),bc=blended.getAttribute('color');let maxPigmentError=0;
for(const i of rim){const expected=[(.3+bp.getX(i)*.05)*gain.r,(.4+bp.getY(i)*.04)*gain.g,.2*gain.b],actual=[bc.getX(i),bc.getY(i),bc.getZ(i)];for(let k=0;k<3;k++)maxPigmentError=Math.max(maxPigmentError,Math.abs(expected[k]-actual[k]));}
assert.ok(maxPigmentError<1e-6,'clipped growing edges meet spatially varying rock pigment');
assert.ok(bc.array.every(Number.isFinite));assert.notDeepEqual(bc.array,plain.getAttribute('color').array);
let tissue=0;for(let i=0;i<bp.count;i++)if(Math.abs(bc.getX(i)-(.3+bp.getX(i)*.05)*gain.r)>.03)tissue++;
assert.ok(tissue>bp.count*.15,'retain substantial colored living tissue rather than erase colonies');
console.log('Rock-aware growing margins passed:',rim.size,'clipped boundary vertices; maximum pigment error',maxPigmentError);

const film=coralCrust(rock,hit.point,hit.face.normal,.46,.8,2309231804,{...profile,grounded:true});
const filmP=film.getAttribute('position'),filmN=film.getAttribute('normal');let minAlignment=1;
for(let i=0;i<filmP.count;i+=7){const pos=new T.Vector3().fromBufferAttribute(filmP,i),normal=new T.Vector3().fromBufferAttribute(filmN,i);ray.set(pos.clone().addScaledVector(normal,.04),normal.clone().negate());ray.far=.10;const support=ray.intersectObject(mesh)[0];assert.ok(support);assert.ok(Math.abs((support.distance-.04)-.0014)<.0001,'microscopic film hugs actual curved support');minAlignment=Math.min(minAlignment,normal.dot(support.normal.clone().normalize()));}
assert.ok(minAlignment>.9999,'clipped film normals continue the underlying curved rock shading');console.log('Film shading continuity passed:',minAlignment);
