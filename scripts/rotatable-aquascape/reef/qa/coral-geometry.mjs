import assert from 'node:assert/strict';
import * as T from 'three';
import {axialCorallite,finishBranch,radialCorallites} from '../BranchAnatomy.ts';
import {branchingColony,platingColony,plateCollisionVolumes} from '../CoralMorphology.ts';
let seed=84;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
const branches=branchingColony(new T.Vector3(),1,.8,random),plate=platingColony(0,0,0,1,.4),all=[...branches,plate];
let bytes=0,triangles=0;
for(const g of all){assert.ok(g.index,'keep shared vertices');triangles+=g.index.count/3;bytes+=g.index.array.byteLength;
 for(const a of Object.values(g.attributes)){assert.ok(a.array.every(Number.isFinite));bytes+=a.array.byteLength;}
 if(g.type==='TubeGeometry'){const n=g.getAttribute('normal'),s=g.parameters.radialSegments,steps=g.parameters.tubularSegments;for(let j=0;j<=steps;j++){const a=j*(s+1),b=a+s;assert.ok(new T.Vector3().fromBufferAttribute(n,a).distanceTo(new T.Vector3().fromBufferAttribute(n,b))<1e-6,'no hard longitudinal shading seam');}}
}
const normal=plate.getAttribute('normal'),p=plate.getAttribute('position'),half=p.count/2;let up=0,down=0;
for(let i=0;i<half;i++){up+=normal.getY(i);down+=normal.getY(i+half);}assert.ok(up/half>.65&&down/half<-.65,'plate surfaces face outwards');
// Additional attached scaffolds intentionally add anatomy. Keep the denser
// fixture below 2.5MB (still below the original 2,674,320-byte expanded mesh).
assert.ok(bytes<2500000,'denser indexed colony and plate stay inside their reviewed memory budget');
console.log('Stony coral geometry passed:',triangles,'triangles,',bytes,'bytes, outward plate tissue and smooth branch seams.');

// A coral foot follows a slope without bridging a separate lower shelf.
const slope=(x,z)=>x>.09?-.24:.35*x+.15*z;
const attached=branchingColony(new T.Vector3(),1,.8,random,slope).at(-1);
assert.equal(attached.name,'Rock-conforming colony base');
const ap=attached.getAttribute('position'),an=attached.getAttribute('normal');
assert.ok(attached.index.count>150,'retain a connected crust on the supported slope');
for(const index of attached.index.array){const x=ap.getX(index),z=ap.getZ(index);assert.ok(x<.091,'do not leave disconnected tissue on the lower shelf');assert.ok(Math.abs(ap.getY(index)-slope(x,z)-.003)<1e-6,'crust hugs the actual support');assert.ok(an.getY(index)>.8,'supported tissue faces outwards');}
console.log('Coral attachment passed: sloping support, outward normals and no detached lower-shelf fragments.');

// The same random seed produces genuinely different colony architecture while
// retaining the same branch/cup detail and bounded geometry allocation.
const fixture=style=>{let state=684;return branchingColony(new T.Vector3(),1,.8,()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state/4294967296;},undefined,style);};
const forms=['canopy','bushy','antler'].map(style=>{const meshes=fixture(style),bounds=new T.Box3();let count=0;for(const g of meshes){g.computeBoundingBox();bounds.union(g.boundingBox);count+=g.index.count;}return {style,meshes,bounds,count};});
assert.equal(forms[0].count,forms[1].count);assert.equal(forms[1].count,forms[2].count,'shape diversity does not multiply geometry');
assert.ok(forms[2].bounds.max.y>forms[0].bounds.max.y*1.1,'antler form grows taller than spreading canopy');
assert.ok(forms[0].bounds.max.x-forms[0].bounds.min.x>forms[2].bounds.max.x-forms[2].bounds.min.x,'canopy spreads farther laterally');
for(const {style,meshes} of forms){
 for(const g of meshes.filter(g=>g.type==='TubeGeometry')){const p=g.getAttribute('position'),{radialSegments:s,tubularSegments:steps,path,radius}=g.parameters,center=path.getPointAt(1);let mean=0;for(let k=0;k<s;k++)mean+=new T.Vector3().fromBufferAttribute(p,steps*(s+1)+k).distanceTo(center);assert.ok(mean/s>radius*.58,'rounded tips must not taper to needle points');}
 assert.deepEqual(meshes[0].getAttribute('position').array,fixture(style)[0].getAttribute('position').array,'art geometry stays reproducible');
}
console.log('Growth forms passed: distinct canopy, bushy and antler silhouettes; same detail count; rounded tips.');
for(const {meshes} of forms){
 const primary=meshes.filter(g=>g.type==='TubeGeometry'&&g.parameters.tubularSegments===8);
 const scaffolds=meshes.filter(g=>g.name==='Interleaved scaffold');
 assert.equal(scaffolds.length,primary.length*2,'each broad primary carries staggered lower growth');
 for(const scaffold of scaffolds){const root=scaffold.parameters.path.getPointAt(0);assert.ok(primary.some(g=>{let best=Infinity;for(let i=0;i<=300;i++)best=Math.min(best,g.parameters.path.getPointAt(i/300).distanceTo(root));return best<g.parameters.radius*.15;}),'scaffold root is embedded in an existing primary');}
}
const consumed=size=>{let state=684,calls=0;const meshes=branchingColony(new T.Vector3(),size,.8,()=>{calls++;state=(Math.imul(state,1664525)+1013904223)>>>0;return state/4294967296;});meshes.forEach(g=>g.dispose());return {state,calls};};
assert.deepEqual(consumed(1),consumed(.5),'extra growth must not reshuffle later organisms through scene RNG consumption');
// Offset growth stays rooted inside an existing terminal, instead of floating.
for(const {meshes} of forms){
 const shoots=meshes.filter(g=>g.name==='Offset terminal growth');assert.ok(shoots.length>10);
 const parents=meshes.filter(g=>g.type==='TubeGeometry'&&g.parameters.tubularSegments===4);
 for(const shoot of shoots){const root=shoot.parameters.path.getPointAt(0);assert.ok(parents.some(g=>{let best=Infinity;for(let i=0;i<=200;i++)best=Math.min(best,g.parameters.path.getPointAt(i/200).distanceTo(root));return best<g.parameters.radius*.2;}),'new growth begins inside a parent branch');}
}


// Distributed primary stems stay embedded in sloping support, and never jump
// down to a disconnected ledge when the local rock sample is missing.
let rootSeed=684;const rootRandom=()=>{rootSeed=(Math.imul(rootSeed,1664525)+1013904223)>>>0;return rootSeed/4294967296;};
const stemSurface=(x,z)=>.35*x+.15*z;
const stems=branchingColony(new T.Vector3(),1,.8,rootRandom,stemSurface).filter(g=>g.type==='TubeGeometry'&&g.parameters.tubularSegments===8);
assert.ok(stems.length>=7);
for(const g of stems){const root=g.parameters.path.getPointAt(0);assert.ok(Math.hypot(root.x,root.z)>.07,'stems spread across the basal tissue');assert.ok(Math.abs(root.y-stemSurface(root.x,root.z)+.014)<1e-6,'stem sinks into its actual local support');}
const rejected=branchingColony(new T.Vector3(),1,.8,rootRandom,()=>-.4).filter(g=>g.type==='TubeGeometry'&&g.parameters.tubularSegments===8);
for(const g of rejected)assert.equal(g.parameters.path.getPointAt(0).length(),0,'unsupported roots return to the established central attachment');
// Large colonies occupy a broad, uneven attachment patch rather than a tight ring.
const rootRadii=stems.map(g=>{const r=g.parameters.path.getPointAt(0);return Math.hypot(r.x,r.z);});
assert.ok(Math.max(...rootRadii)>.24&&Math.max(...rootRadii)-Math.min(...rootRadii)>.08,'broad irregular primary attachment footprint');
// Near an edge, search inward for supported tissue rather than falling to center.
let edgeState=684;const edgeRandom=()=>{edgeState=(Math.imul(edgeState,1664525)+1013904223)>>>0;return edgeState/4294967296;};
const edgeStems=branchingColony(new T.Vector3(),1,.8,edgeRandom,(x,z)=>Math.hypot(x,z)<.14?0:null).filter(g=>g.type==='TubeGeometry'&&g.parameters.tubularSegments===8);
for(const g of edgeStems){const r=g.parameters.path.getPointAt(0);assert.ok(Math.hypot(r.x,r.z)<.14&&Math.hypot(r.x,r.z)>.05,'roots retreat inward onto continuous support');}
console.log('Primary stems passed: distributed sloping attachments and disconnected-ledge rejection.');

// Folded shelves use their real vertices for navigation volumes. Exercise
// different sizes/phases, including triangle interiors between sampled points.
for(const [size,phase] of [[.65,.4],[1.08,2.2],[.8,5.1]]){
 const shelf=platingColony(1,2,-.5,size,phase),volumes=plateCollisionVolumes(shelf),p=shelf.getAttribute('position'),index=shelf.index,point=new T.Vector3();
 const covered=point=>volumes.some(v=>v.center.distanceToSquared(point)<=v.radius*v.radius+1e-8);
 for(let i=0;i<p.count/2;i++){const thickness=p.getY(i)-p.getY(i+p.count/2);assert.ok(thickness>size*.006&&thickness<size*.046,'fine ridges do not invert the thin skeleton');}
 for(let i=0;i<p.count;i++){point.fromBufferAttribute(p,i);assert.ok(covered(point),'every shelf vertex is protected');}
 for(let i=0;i<index.count;i+=3){point.set(0,0,0);for(let j=0;j<3;j++){const n=index.getX(i+j);point.x+=p.getX(n)/3;point.y+=p.getY(n)/3;point.z+=p.getZ(n)/3;}assert.ok(covered(point),'folded triangle interiors remain protected');}
 assert.ok(volumes.length<180,'plate navigation stays locally bounded');
 assert.ok(volumes.every(v=>v.radius<.25),'avoid enclosing the whole shelf in a large solid ball');
 console.log('Folded plate coverage passed:',size,volumes.length,'local volumes.');
}

// Each axial cup is welded geometrically to its branch, with continuous normals
// at the shared boundary and a single recessed center (not an open mesh hole).
let axialCount=0;
for(let i=0;i<branches.length;i++){
 const tube=branches[i];if(tube.type!=='TubeGeometry')continue;
 const cap=branches[i+1];assert.equal(cap.name,'Axial corallite');axialCount++;
 const {radialSegments:s,tubularSegments:steps,path}=tube.parameters,tp=tube.getAttribute('position'),tn=tube.getAttribute('normal'),cp=cap.getAttribute('position'),cn=cap.getAttribute('normal');
 for(let k=0;k<=s;k++){
  const a=new T.Vector3().fromBufferAttribute(tp,steps*(s+1)+k),b=new T.Vector3().fromBufferAttribute(cp,k);
  assert.ok(a.distanceTo(b)<1e-7,'no gap at axial insertion');
  assert.ok(new T.Vector3().fromBufferAttribute(tn,steps*(s+1)+k).dot(new T.Vector3().fromBufferAttribute(cn,k))>.99999,'continuous tissue normal');
 }
 const axis=path.getTangentAt(1),center=path.getPointAt(1),depth=k=>new T.Vector3().fromBufferAttribute(cp,k).sub(center).dot(axis);
 assert.ok(depth(2*(s+1))>depth(cp.count-1),'tip cup has a raised lip around its recessed calice');
 const indices=cap.index.array,edges=new Map();
 for(let j=0;j<indices.length;j+=3){
  const a=new T.Vector3().fromBufferAttribute(cp,indices[j]),b=new T.Vector3().fromBufferAttribute(cp,indices[j+1]),c=new T.Vector3().fromBufferAttribute(cp,indices[j+2]);
  assert.ok(b.sub(a).cross(c.sub(a)).lengthSq()>1e-18,'tip has no degenerate triangles');
  for(let q=0;q<3;q++){const a=indices[j+q],b=indices[j+(q+1)%3],key=Math.min(a,b)+':'+Math.max(a,b);edges.set(key,(edges.get(key)||0)+1);}
 }
 assert.ok([...edges.values()].every(n=>n<=2),'no non-manifold tip edges');
}
assert.ok(axialCount>80);console.log('Axial corallites passed:',axialCount,'continuous attached cups, recessed centers and nondegenerate faces.');


// Check the side-cup footprint against triangles independently of the UV-like
// interpolation used by the builder, on a curved/swollen skeleton.
const path=new T.CatmullRomCurve3([new T.Vector3(),new T.Vector3(.1,.3,.04),new T.Vector3(-.05,.7,.12),new T.Vector3(.15,1,.1)]);
const tube=new T.TubeGeometry(path,8,.045,12,false);tube.setAttribute('color',new T.Float32BufferAttribute(new Float32Array(tube.getAttribute('position').count*3).fill(.3),3));
const tip=axialCorallite(tube,new T.Color(.7,.6,.5),true);finishBranch(tube,tip,[.32,.57,.75]);
const tp=tube.getAttribute('position'),idx=tube.index.array,triangle=new T.Triangle(),nearest=new T.Vector3();let worstGap=0;
for(const level of [0,1,2])for(const cup of radialCorallites(tube,level,1.7,new T.Color(.2,.3,.4),new T.Color(.8,.7,.6))){
 const cp=cup.getAttribute('position'),s=level<2?8:6;
 for(let i=0;i<=s;i++){
  const point=new T.Vector3().fromBufferAttribute(cp,i);let best=Infinity;
  for(let j=0;j<idx.length;j+=3){triangle.a.fromBufferAttribute(tp,idx[j]);triangle.b.fromBufferAttribute(tp,idx[j+1]);triangle.c.fromBufferAttribute(tp,idx[j+2]);triangle.closestPointToPoint(point,nearest);best=Math.min(best,point.distanceTo(nearest));}
  worstGap=Math.max(worstGap,best);assert.ok(best<1e-6,'side-cup foot must sit on the real branch triangles');
 }
 for(const a of Object.values(cup.attributes))assert.ok(a.array.every(Number.isFinite));
}
console.log('Radial corallite attachment passed: maximum footprint distance',worstGap);
