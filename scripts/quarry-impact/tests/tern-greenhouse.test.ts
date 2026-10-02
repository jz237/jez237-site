import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {loadCarWithoutImages} from '../tools/car-asset-audit';
import {loadCars,templates} from '../src/assets';
import {Vehicle} from '../src/vehicle';
import {stockSetup} from '../src/garage';
import {ReplayRecorder,replayFile,readReplayFile} from '../src/replay-data';
import {ReplayScene,captureReplayFrame} from '../src/replay-scene';
import {verifyTernGreenhouseRevision} from './tern-greenhouse-invariants';
import {newLayer} from '../src/livery';

const beforeBytes=gunzipSync(readFileSync(new URL('./fixtures/tern-greenhouse/public-models-tern.glb.gz',import.meta.url)));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
assert.equal(hash(beforeBytes),'4d0b777656191c76aa0b76ac62163dcd353045ac7bac229cdfc24c2e19081e5a','Independent published Tern at git5d824c9');
const oldModel=()=>new GLTFLoader().parseAsync(Uint8Array.from(beforeBytes).buffer,'');
const before=(await oldModel()).scene,current=(await loadCarWithoutImages('tern')).scene;
await R.init();const originalLoad=GLTFLoader.prototype.loadAsync;let beforePrepared:T.Group,currentPrepared:T.Group;
try{
 GLTFLoader.prototype.loadAsync=async url=>{const name=/\/([^/]+)\.glb$/.exec(String(url))![1];return name==='tern'?oldModel():loadCarWithoutImages(name);};
 await loadCars(()=>{});beforePrepared=templates.get('tern')!;
 GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/([^/]+)\.glb$/.exec(String(url))![1]);await loadCars(()=>{});currentPrepared=templates.get('tern')!;
}finally{GLTFLoader.prototype.loadAsync=originalLoad;}
const fx={emit(){},mark(){},detach(m:T.Mesh){m.visible=false;},reset(){}} as any;
const corners=['FL','FR','RL','RR'] as const,zero={x:0,y:0,z:0};
const near=(a:number,b:number,tolerance=1e-6)=>assert.ok(Math.abs(a-b)<=tolerance,`${a} != ${b}`);
const arrayBytes=(array:ArrayBufferView)=>Buffer.from(array.buffer,array.byteOffset,array.byteLength);
const materialState=(material:T.Material)=>{const state=material.toJSON();delete state.uuid;delete state.metadata;return state;};
function nodeState(o:T.Object3D){
 const row:any={name:o.name,parent:o.parent?.name??'',type:o.type,p:o.position.toArray(),q:o.quaternion.toArray(),scale:o.scale.toArray()};
 if(o instanceof T.Mesh){row.attributes=Object.fromEntries(Object.entries(o.geometry.attributes).map(([name,a])=>[name,{itemSize:a.itemSize,normalized:a.normalized,bytes:arrayBytes(a.array)}]));row.index=o.geometry.index?arrayBytes(o.geometry.index.array):null;row.materials=(Array.isArray(o.material)?o.material:[o.material]).map(materialState);}return row;
}
function treeState(root:T.Object3D){const rows:any[]=[];root.traverse(o=>rows.push(nodeState(o)));return rows;}
function counts(root:T.Object3D){let meshes=0,triangles=0,vertices=0,casters=0;root.traverse(o=>{if(o instanceof T.Mesh){meshes++;vertices+=o.geometry.attributes.position.count;triangles+=(o.geometry.index?.count??o.geometry.attributes.position.count)/3;casters+=Number(o.castShadow);}});return{meshes,triangles,vertices,casters};}
function stockSignature(car:Vehicle){
  const h=createHash('sha256');
  car.model.traverse(o=>{
    h.update(JSON.stringify([o.name,o.position.toArray(),o.quaternion.toArray(),o.scale.toArray()]));
    if(o instanceof T.Mesh){
      for(const key of Object.keys(o.geometry.attributes).sort()){const a=o.geometry.attributes[key].array;h.update(key);h.update(new Uint8Array(a.buffer,a.byteOffset,a.byteLength));}
      for(const m of (Array.isArray(o.material)?o.material:[o.material]) as T.MeshPhysicalMaterial[])h.update(JSON.stringify([m.name,m.color?.toArray(),m.roughness,m.metalness,m.clearcoat,m.clearcoatRoughness,m.emissive?.toArray(),m.emissiveIntensity,m.opacity]));
    }
  });return h.digest('hex');
}
function makeCar(world:R.World,previous=false,id=0,livery=false,armor=0){
 if(previous)templates.set('tern',beforePrepared);
 const setup=stockSetup('tern');setup.armor=armor;if(livery)setup.livery=[newLayer('number','right'),newLayer('checker','top')];
 try{return new Vehicle(id,'tern',setup.paint,new T.Scene(),world,fx,setup);}finally{templates.set('tern',currentPrepared);}
}
function pose(car:Vehicle,x=2,y=2,z=4,yaw=.31){
 const p=new T.Vector3(x,y,z),q=new T.Quaternion().setFromAxisAngle(new T.Vector3(0,1,0),yaw);
 car.body.setTranslation(p,true);car.body.setRotation(q,true);car.current.copy(p);car.previous.copy(p);car.currentQ.copy(q);car.previousQ.copy(q);car.root.position.copy(p);car.root.quaternion.copy(q);car.root.updateMatrixWorld(true);
}
const changedNames=new Set([
 'panel_RoofTern','panel_FrontHeaderTern','panel_TailgateTernHeader',
 ...['L','R'].flatMap(side=>['panel_BodyDoor'+side+'TernSeal','panel_QuarterTern'+side+'Seal']),
 ...['L','R'].flatMap(side=>['panel_BodyDoor'+side+'TernHeader','panel_QuarterHeaderTern'+side,...['A','B','C'].map(letter=>'panel_'+letter+'pillarTern'+side)]),
 ...['FrontTern','TailgateTernRear'].flatMap(stem=>['panel_'+stem+'Frame','panel_'+stem+'Seal','panel_'+stem+'Trim','glass_'+stem]),
]);
assert.equal(changedNames.size,25);
const greenhouse=(car:Vehicle)=>[...car.panels,...car.glass].filter(o=>changedNames.has(o.name));
const appearance=(car:Vehicle)=>greenhouse(car).map(o=>({name:o.name,visible:o.visible,matrix:o.matrix.toArray(),attributes:Object.fromEntries(['position','normal','impactWear','transferPaint'].map(name=>[name,Array.from(o.geometry.getAttribute(name)?.array??[])]))}));
function sameAppearance(actual:ReturnType<typeof appearance>,expected:ReturnType<typeof appearance>){
 assert.equal(actual.length,expected.length);for(const [i,a]of actual.entries()){const b=expected[i];assert.equal(a.name,b.name);assert.equal(a.visible,b.visible);a.matrix.forEach((n,j)=>near(n,b.matrix[j],2e-5));for(const name of Object.keys(a.attributes)){assert.equal(a.attributes[name].length,b.attributes[name].length);a.attributes[name].forEach((n,j)=>near(n,b.attributes[name][j],2e-5));}}
}
// Weld only coincident coordinates for topology checks. Component volumes catch
// a wholly reversed closed pressing even when its vertex normals are also reversed.
function closedOutward(mesh:T.Mesh){
 const geometry=mesh.geometry,p=geometry.attributes.position,n=geometry.attributes.normal,count=(geometry.index?.count??p.count)/3;
 const parent=Array.from({length:count},(_,i)=>i),volume:number[]=[],edges=new Map<string,{face:number;direction:number}[]>();
 const find=(i:number):number=>parent[i]===i?i:(parent[i]=find(parent[i]));
 const key=(v:T.Vector3)=>v.toArray().map(x=>Math.round(x*1e6)).join(',');
 for(const [name,a]of Object.entries(geometry.attributes))assert.ok(Array.from(a.array).every(Number.isFinite),mesh.name+' finite '+name);
 for(let face=0;face<count;face++){
  const ids=[0,1,2].map(j=>geometry.index?.getX(face*3+j)??face*3+j),q=ids.map(i=>new T.Vector3().fromBufferAttribute(p,i));
  const cross=q[1].clone().sub(q[0]).cross(q[2].clone().sub(q[0]));assert.ok(cross.lengthSq()>1e-18,mesh.name+' nondegenerate face '+face);
  for(const i of ids){const normal=new T.Vector3().fromBufferAttribute(n,i);near(normal.length(),1,2e-6);assert.ok(cross.dot(normal)>=-1e-10,mesh.name+' outward shaded face '+face);}
  volume.push(q[0].dot(q[1].clone().cross(q[2]))/6);
  for(let j=0;j<3;j++){const a=key(q[j]),b=key(q[(j+1)%3]),edge=a<b?a+'|'+b:b+'|'+a,rows=edges.get(edge)??[];rows.push({face,direction:a<b?1:-1});edges.set(edge,rows);}
 }
 for(const [edge,rows]of edges){assert.equal(rows.length,2,mesh.name+' closed edge '+edge);assert.equal(rows[0].direction+rows[1].direction,0,mesh.name+' consistent winding');parent[find(rows[1].face)]=find(rows[0].face);}
 const components=new Map<number,number>();for(let face=0;face<count;face++){const id=find(face);components.set(id,(components.get(id)??0)+volume[face]);}
 for(const signed of components.values())assert.ok(signed>1e-12,mesh.name+' every closed component points outward');
 return components.size;
}

test('the formed Tern greenhouse changes only its 25 named geometries while wheels, side glazing and every other body byte stay exact',t=>{
 const previous=treeState(before),candidate=treeState(current);assert.equal(candidate.length,previous.length);
 for(const [i,a]of candidate.entries()){
  const b=previous[i];assert.equal(a.name,b.name,'No semantic panel is renamed or reordered');
  if(changedNames.has(a.name)){
   assert.notDeepEqual(a.attributes,b.attributes,a.name+' actually receives the revised surface');
   const {attributes:aa,index:ai,...identityA}=a,{attributes:ba,index:bi,...identityB}=b;assert.deepEqual(identityA,identityB,a.name+' retains material, local transform and ownership');
  }else assert.deepEqual(a,b,a.name+' outside the explicit greenhouse scope stays byte exact');
 }
 for(const name of changedNames)assert.ok(current.getObjectByName(name),name);
 for(const corner of corners)assert.deepEqual(treeState(current.getObjectByName('wheel_'+corner)!),treeState(before.getObjectByName('wheel_'+corner)!));
 assert.deepEqual(readFileSync(new URL('../public/models/tern.glb',import.meta.url)),readFileSync(new URL('../public/models/tern-candidate.glb',import.meta.url)));
 t.diagnostic(JSON.stringify({published:counts(before),candidate:counts(current)}));
});

test('revised metal pressings are closed and outward with finite glazing, trim and continuous outer-skin normals',()=>{
 for(const name of changedNames){
  const mesh=current.getObjectByName(name) as T.Mesh,p=mesh.geometry.attributes.position,n=mesh.geometry.attributes.normal;
  for(const [attribute,a]of Object.entries(mesh.geometry.attributes))assert.ok(Array.from(a.array).every(Number.isFinite),name+' finite '+attribute);
  for(let i=0;i<p.count;i+=3){
   const a=new T.Vector3().fromBufferAttribute(p,i),b=new T.Vector3().fromBufferAttribute(p,i+1),c=new T.Vector3().fromBufferAttribute(p,i+2),face=b.sub(a).cross(c.sub(a));assert.ok(face.lengthSq()>1e-18,name+' nondegenerate');
   for(let j=0;j<3;j++){const normal=new T.Vector3().fromBufferAttribute(n,i+j);near(normal.length(),1,2e-6);assert.ok(face.dot(normal)>=-1e-10,name+' outward vertex shading');}
  }
  if(name.startsWith('panel_')&&!/Seal$|Trim$/.test(name))closedOutward(mesh);
 }
});

const modelTriangles=new WeakMap<T.Mesh,T.Triangle[]>();
function distance(point:T.Vector3,mesh:T.Mesh){
 let triangles=modelTriangles.get(mesh);if(!triangles){mesh.updateWorldMatrix(true,false);const p=mesh.geometry.attributes.position,index=mesh.geometry.index;triangles=[];for(let face=0;face<(index?.count??p.count)/3;face++)triangles.push(new T.Triangle(...[0,1,2].map(j=>new T.Vector3().fromBufferAttribute(p,index?.getX(face*3+j)??face*3+j).applyMatrix4(mesh.matrixWorld)) as [T.Vector3,T.Vector3,T.Vector3]));modelTriangles.set(mesh,triangles);}
 const q=new T.Vector3();let best=Infinity;for(const triangle of triangles){triangle.closestPointToPoint(point,q);best=Math.min(best,q.distanceTo(point));}return best;
}

test('rolled roof eaves and wrapped screens meet the fixed opening boundaries without the former upper-quarter overhang or gasket crossings',t=>{
 before.updateMatrixWorld(true);current.updateMatrixWorld(true);const mesh=(name:string)=>current.getObjectByName(name) as T.Mesh,roof=mesh('panel_RoofTern'),front=mesh('panel_FrontHeaderTern'),rear=mesh('panel_TailgateTernHeader'),bounds=new T.Box3().setFromObject(roof);
 near(bounds.min.x,-.639,1e-6);near(bounds.max.x,.639,1e-6);near(bounds.min.z,-1.02,1e-6);near(bounds.max.z,.094,1e-6);assert.ok(bounds.max.y<=1.516001);
 const height=(x:number)=>{const hit=new T.Raycaster(new T.Vector3(x,3,-.463),new T.Vector3(0,-1,0)).intersectObject(roof)[0];assert.ok(hit);return hit.point.y;};
 assert.ok(height(0)-1.478>.033&&height(0)-1.478<.039,'The broad centre retains a bounded crown');
 for(const side of [-1,1]){
  assert.ok(height(side*.579)-1.478>.025,'The outer60mm forms a distinct rolled shoulder');assert.ok(height(0)-height(side*.579)<.009,'The central roof does not remain an exaggerated narrow dome');
  for(const [quarter,zs]of [[true,[-1.01,-.95,-.85,-.73]],[false,[-.69,-.45,-.15,.09]]] as const){const header=mesh(quarter?'panel_QuarterHeaderTern'+(side<0?'L':'R'):'panel_BodyDoor'+(side<0?'L':'R')+'TernHeader');
   for(const z of zs){const point=new T.Vector3(side*.639,1.478,z);assert.ok(distance(point,roof)<1e-6);assert.ok(distance(point,header)<1e-6,'Side header shares the rolled roof edge');}
   const p=header.geometry.attributes.position,toModel=header.matrixWorld;for(let i=0;i<p.count;i++){const q=new T.Vector3().fromBufferAttribute(p,i).applyMatrix4(toModel);if(quarter&&q.y>1.47799)assert.ok(q.z>=-1.020001,'The20mm upper-quarter overhang is removed');}
  }
 }
 // Inspect the actual exported common edge, not just two helper evaluations.
 const p=roof.geometry.attributes.position,frontEdge=new Map<number,number>();
 for(let i=0;i<p.count;i++)if(Math.abs(p.getZ(i)-.094)<1e-6)frontEdge.set(p.getX(i),Math.max(frontEdge.get(p.getX(i))??-Infinity,p.getY(i)));
 assert.ok(frontEdge.size>=12);for(const [x,y]of frontEdge)assert.ok(distance(new T.Vector3(x,y,.094),front)<1e-6,'Front header closes every actual roof-edge station');
 assert.ok(distance(new T.Vector3(0,1.490,.094),roof)<1e-6,'Front crown adds the approved12mm roll');
 for(let i=0;i<=32;i++){const q=new T.Vector3(T.MathUtils.lerp(-.639,.639,i/32),1.478,-1.02);assert.ok(distance(q,roof)<1e-6);assert.ok(distance(q,rear)<1e-6,'Hatch header keeps its exact fixed hinge boundary');}
 for(const forward of [true,false]){
  const stem=forward?'FrontTern':'TailgateTernRear',frame=mesh('panel_'+stem+'Frame'),header=forward?front:rear,lowerHalf=forward?.769:.737,lowerZ=forward?.62:-1.76,upperZ=forward?.12:-1.04,bow=forward?.018:-.010;
  for(const x of [-.60,-.45,-.25,0,.25,.45,.60]){const q=new T.Vector3(x,1.43,upperZ+bow*(1-(x/.631)**2));assert.ok(distance(q,frame)<.0016,'Exported screen surround follows the bounded wrap');assert.ok(distance(q,header)<.0016,'Rolled header meets the same screen edge');}
  for(const x of [-.55,0,.55])assert.ok(distance(new T.Vector3(x,1.02,lowerZ),frame)<1e-6,'The cowl/hatch lower edge remains fixed');
  for(const side of [-1,1])for(const q of [new T.Vector3(side*lowerHalf,1.02,lowerZ),new T.Vector3(side*.631,1.43,upperZ)])assert.ok(distance(q,frame)<.0021,'Original rounded aperture corner remains anchored');
 }
 // Actual outer-skin normals turn fully into the side-header tangent.
 const n=roof.geometry.attributes.normal;let samples=0;
 for(let i=0;i<p.count;i++)if(Math.abs(Math.abs(p.getX(i))-.639)<1e-6&&Math.abs(p.getY(i)-1.478)<1e-6&&p.getZ(i)>-1.019&&p.getZ(i)<.093){assert.ok(n.getX(i)*Math.sign(p.getX(i))>.999);assert.ok(Math.abs(n.getY(i))<1e-5);samples++;}
 assert.ok(samples>=16,'Both rolled eaves carry tangent normals');
 // On the published four side apertures the black landing must sit above
 // the painted return before dropping into the unchanged glass recess.
 // The former two-row diagonal crossed the painted band at these stations.
 let previousCrossings=0,landingMinimum=Infinity;
 for(const side of [-1,1])for(const quarter of [false,true]){
  const suffix=side<0?'L':'R',stem=quarter?'QuarterTern'+suffix:'BodyDoor'+suffix+'Tern';
  const corners=(quarter?[[side*.769,1.02,-.72],[side*.737,1.02,-1.76],[side*.631,1.43,-1.04],[side*.631,1.43,-.72]]:[[side*.769,1.02,.62],[side*.769,1.02,-.70],[side*.631,1.43,-.70],[side*.631,1.43,.12]]).map(p=>new T.Vector3(...p as [number,number,number]));
  const width=(corners[0].distanceTo(corners[1])+corners[3].distanceTo(corners[2]))/2,height=(corners[0].distanceTo(corners[3])+corners[1].distanceTo(corners[2]))/2,normal=corners[1].clone().sub(corners[0]).cross(corners[3].clone().sub(corners[0])).normalize().multiplyScalar(side);
  const boundaryEdges=(seal:T.Mesh)=>{const p=seal.geometry.attributes.position,index=seal.geometry.index,edges=new Map<string,number>(),vertex=(i:number)=>[p.getX(i),p.getY(i),p.getZ(i)].join(',');for(let i=0;i<(index?.count??p.count);i+=3)for(let j=0;j<3;j++){const key=[vertex(index?.getX(i+j)??i+j),vertex(index?.getX(i+(j+1)%3)??i+(j+1)%3)].sort().join('|');edges.set(key,(edges.get(key)??0)+1);}return[...edges].filter(([,n])=>n===1).map(([edge])=>edge).sort();};
  const previousSeal=before.getObjectByName('panel_'+stem+'Seal') as T.Mesh,seal=mesh(previousSeal.name),outerAndInner=boundaryEdges(previousSeal);assert.equal(outerAndInner.length,40);assert.deepEqual(boundaryEdges(seal),outerAndInner,stem+' retains both published outer and glass-recess contours exactly');
  const stations=[.25,.5,.75].flatMap(t=>[[t,.0254/height],[t,1-.0254/height],[.0254/width,t],[1-.0254/width,t]]);
  for(const [u,v]of stations){
   const point=corners[0].clone().lerp(corners[1],u).lerp(corners[3].clone().lerp(corners[2],u),v),ray=new T.Raycaster(point.clone().addScaledVector(normal,.2),normal.clone().negate(),0,.4);
   const frame=mesh('panel_'+stem+'Frame'),hits=ray.intersectObjects([seal,frame],false),first=hits[0],paint=hits.find(h=>h.object===frame);assert.ok(first&&paint,stem+' has both landing and painted return');
   assert.equal(first.object,seal,stem+' rubber landing covers the former dotted paint crossing');assert.ok(paint.distance-first.distance>.0003,stem+' retains visible separation from the painted band');landingMinimum=Math.min(landingMinimum,paint.distance-first.distance);
   const oldHits=ray.intersectObjects([before.getObjectByName(seal.name)!,before.getObjectByName(frame.name)!],false);previousCrossings+=Number(oldHits[0]?.object.name===frame.name);
  }
 }
 assert.ok(previousCrossings>=12,'Independent published geometry demonstrates the former gasket/frame crossing');t.diagnostic(JSON.stringify({gasketRays:48,previousCrossings,minimumLandingClearance:landingMinimum}));
});

test('formed fixed posts stay on the body while the original doors and hatch retain their exact hinge membership and pivot bounds',()=>{
 const world=new R.World(zero),car=makeCar(world),previous=makeCar(world,true,1);pose(car);pose(previous,10);
 try{
  const oldAssemblies=previous.wreckParts.assemblies.map(a=>({name:a.name,members:a.members.map(m=>m.mesh.name),min:a.bounds.min.toArray(),max:a.bounds.max.toArray()}));
  const assemblies=car.wreckParts.assemblies.map(a=>({name:a.name,members:a.members.map(m=>m.mesh.name),min:a.bounds.min.toArray(),max:a.bounds.max.toArray()}));
  assert.deepEqual(assemblies.map(({name,members})=>({name,members})),oldAssemblies.map(({name,members})=>({name,members})),'Original semantic assemblies stay exact');
  for(const [i,a]of assemblies.entries())for(const edge of ['min','max'] as const)a[edge].forEach((n,j)=>near(n,oldAssemblies[i][edge][j],1e-6));
  const fixed=greenhouse(car).filter(m=>!m.name.includes('BodyDoor')&&!m.name.includes('Tailgate')),fixedState=fixed.map(m=>m.matrix.toArray());
  for(const corner of corners)assert.deepEqual(treeState(car.model.getObjectByName('wheel_'+corner)!),treeState(previous.model.getObjectByName('wheel_'+corner)!),'Prepared wheels remain byte exact');
  for(const point of [new T.Vector3(-.79,1.13,.05),new T.Vector3(0,1.34,-1.2)])car.wreckParts.hit(point,new T.Vector3(1,0,0),60);
  car.wreckParts.poseAt(1,.5);
  for(const name of ['door-left','tailgate']){
   const assembly=car.wreckParts.assemblies.find(a=>a.name===name)!;assert.ok(assembly.loose>0);const first=assembly.members[0],delta=first.mesh.matrix.clone().multiply(first.matrix.clone().invert());
   for(const member of assembly.members){const actual=member.mesh.matrix.clone().multiply(member.matrix.clone().invert());actual.elements.forEach((n,i)=>near(n,delta.elements[i],1e-6));}
   assert.ok(assembly.members.some(m=>changedNames.has(m.mesh.name)),name+' contains the revised moving header/surround');
  }
  assert.deepEqual(fixed.map(m=>m.matrix.toArray()),fixedState,'Roof, front glass and fixed posts never follow a loosened door or hatch');
  car.repair();for(const assembly of car.wreckParts.assemblies)for(const member of assembly.members)assert.deepEqual(member.mesh.matrix.toArray(),member.matrix.toArray());
 }finally{car.dispose();previous.dispose();world.free();}
});

test('the formed shell stays inside the accepted coarse collision envelope with identical wheels, armor and collider state',t=>{
 const world=new R.World(zero),cars:Vehicle[]=[],metrics:any[]=[];
 try{
  for(const armor of [0,3]){
   const old=makeCar(world,true,0,false,armor),car=makeCar(world,false,0,false,armor);cars.push(old,car);
   const colliders=(v:Vehicle)=>Array.from({length:v.body.numColliders()},(_,i)=>{const c=v.body.collider(i);return{shape:c.shapeType(),vertices:c.vertices(),indices:c.indices(),position:c.translationWrtParent(),rotation:c.rotationWrtParent(),mass:c.mass(),friction:c.friction(),events:c.activeEvents()};});
   assert.deepEqual(colliders(car),colliders(old),'Artwork cannot change actual physics construction');
   const vertices=car.roof.vertices(),points=[];for(let i=0;i<vertices.length;i+=3)points.push(Array.from(vertices.slice(i,i+3)));
   const published=[[-.76,1.015,.62],[.76,1.015,.62],[-.632,1.478,.094],[.632,1.478,.094],[-.632,1.478,-1.02],[.632,1.478,-1.02],[-.734,1.015,-1.76],[.734,1.015,-1.76]].map(([x,y,z])=>Array.from(Float32Array.of(x,y-.8200195,z)));
   assert.deepEqual(points.sort(),published.sort(),'Published roof hull stays byte exact');
   const kit=(v:Vehicle)=>v.panels.filter(m=>m.name.startsWith('panel_Reinforcement_')).map(nodeState);assert.deepEqual(kit(car),kit(old),'Existing physical armor keeps its exact fitted artwork');
   const prior=counts(old.model),candidate=counts(car.model);assert.equal(candidate.meshes,prior.meshes);assert.equal(candidate.casters,prior.casters);assert.ok(candidate.triangles<=prior.triangles,'Formed surfaces do not increase prepared drawing complexity');assert.deepEqual([candidate.meshes,candidate.triangles,candidate.casters],armor===0?[139,66448,100]:[147,69264,104]);
   if(armor===0)assert.equal(stockSignature(old),'392d0fc407b8d688ff22cc4626f2f621481d10a90754f326971998d0de8f21ba','Frozen actualGLB reproduces the independent preceding stock signature');metrics.push({armor,published:prior,candidate,stockSignature:armor===0?stockSignature(car):undefined});
  }
  const probes:{name:string;at:T.Vector3;normal:T.Vector3}[]=[],add=(name:string,at:[number,number,number],normal:[number,number,number])=>probes.push({name,at:new T.Vector3(...at),normal:new T.Vector3(...normal).normalize()});
  // Independent published collider-facing stations, not surface-helper outputs.
  for(const z of [-.9,-.463,0])for(const x of [-.62,-.579,0,.579,.62])add(`roof ${x},${z}`,[x,1.478,z],[0,1,0]);
  for(const x of [-.5,0,.5]){add(`front header ${x}`,[x,1.454,.111],[0,.5,.41]);add(`rear header ${x}`,[x,1.454,-1.03],[0,.72,-.41]);}
  for(const side of [-1,1])for(const [which,z]of [['A',.37],['C',-1.40]] as const)add(`${which} post ${side}`,[side*.70,1.225,z],[side,0,0]);
  const shell=(model:T.Group)=>{model.updateMatrixWorld(true);const list:T.Mesh[]=[];model.traverse(o=>{if(o instanceof T.Mesh&&/^panel_.*(?:RoofTern|Header|pillarTern|FrontTernFrame|TailgateTernRearFrame)/.test(o.name))list.push(o);});return list;},oldShell=shell(before),newShell=shell(current),fit=[];
  for(const probe of probes){
   const origin=probe.at.clone().addScaledVector(probe.normal,2),direction=probe.normal.clone().negate(),bodyOrigin=origin.clone();bodyOrigin.y-=.8200195;
   const physical=cars[0].roof.castRayAndGetNormal(new R.Ray(bodyOrigin,direction),4,true);assert.ok(physical,probe.name+' meets the fixed collision hull');
   const distances=[oldShell,newShell].map(meshes=>{const hit=new T.Raycaster(origin,direction,0,4).intersectObjects(meshes,false)[0];assert.ok(hit,probe.name+' has real metal, excluding intentional glazing apertures');return physical.timeOfImpact-hit.distance;});
   const [oldGap,gap]=distances;assert.ok(gap<=.038001&&gap>=-.021,probe.name+' remains within the accepted38mm crown/21mm inner envelope');
   assert.ok(Math.max(0,-gap)<=Math.max(0,-oldGap)+.006,probe.name+' adds at most6mm to the existing coarse inward gap');
   fit.push({name:probe.name,published:oldGap,candidate:gap});
  }
  t.diagnostic(JSON.stringify({prepared:metrics,fit}));
 }finally{cars.forEach(car=>car.dispose());world.free();}
});

test('current Tern paint stays attached through actual greenhouse dents, repair and compressed backward replay',async()=>{
 const world=new R.World(zero),car=makeCar(world,false,0,true),other=makeCar(world,false,1,true),stock=makeCar(world,false,2,false);pose(car);pose(other,10);pose(stock,20);for(const vehicle of [car,other,stock])vehicle.render(1);
 const panels=greenhouse(car),painted=panels.filter(m=>(m.material as T.Material).name.startsWith('paint'));
 assert.ok(painted.length>=6);assert.ok(painted.every(m=>m.geometry.hasAttribute('liveryNormal')));assert.ok(stock.panels.every(m=>!m.geometry.hasAttribute('liveryNormal')));
 const livery=painted.map(m=>({name:m.name,rest:Array.from(m.geometry.attributes.wreckPosition.array),normal:Array.from(m.geometry.attributes.liveryNormal.array)}));
 const otherRest=appearance(other),intact=appearance(car),wheels=car.wheels.map(treeState);
 const material=painted[0].material as T.Material,shader={uniforms:{} as Record<string,T.IUniform>,vertexShader:T.ShaderLib.physical.vertexShader,fragmentShader:T.ShaderLib.physical.fragmentShader};material.onBeforeCompile(shader as any,{} as any);
 assert.equal(shader.uniforms.liveryAtlas,car.livery.atlas);assert.ok(shader.vertexShader.includes('vLiveryPosition=wreckPosition'));assert.ok(shader.fragmentShader.includes('texture2D(liveryAtlas'));assert.notEqual(material,other.panels.find(m=>m.name===painted[0].name)!.material);
 let time=0,epoch=0;const recorder=new ReplayRecorder({version:1,mode:'playground',reverse:false,cars:[{id:0,kind:'tern',setup:car.setup}],props:0,created:'2026-10-02',tyreModel:1});
 car.onVisualEvent=e=>{if(e.kind!=='hit')epoch++;recorder.event(0,time,e);};
 const capture=()=>{car.render(1);recorder.capture(time,()=>captureReplayFrame([car],[],[epoch],1),true);};let replay:ReplayScene|undefined;
 try{
  capture();time=1;
  for(const [point,direction]of [[new T.Vector3(-.39,1.45,.15),new T.Vector3(.2,-.8,-.4).normalize()],[new T.Vector3(-.73,1.25,-.2),new T.Vector3(1,-.1,0).normalize()]] as const){car.root.updateMatrixWorld(true);car.hit(point.clone().applyMatrix4(car.model.matrixWorld),direction.clone().applyQuaternion(car.root.quaternion),24,time,true,new T.Color(0xb3462e));}
  capture();const damaged=appearance(car);assert.notDeepEqual(damaged,intact);assert.ok(damaged.every(row=>Object.values(row.attributes).every(a=>a.every(Number.isFinite))));
  assert.ok(damaged.some(row=>row.attributes.impactWear.some(n=>n>0)));assert.ok(damaged.some(row=>row.attributes.transferPaint.some(n=>n>0)));
  for(const [i,m]of painted.entries()){assert.deepEqual(Array.from(m.geometry.attributes.wreckPosition.array),livery[i].rest);assert.deepEqual(Array.from(m.geometry.attributes.liveryNormal.array),livery[i].normal);}
  sameAppearance(appearance(other),otherRest);time=2;car.repair();capture();sameAppearance(appearance(car),intact);assert.deepEqual(car.wheels.map(treeState),wheels);
  const doc=await readReplayFile(new File([await replayFile(recorder.document())],'tern-greenhouse.qir'));replay=new ReplayScene(doc,car.scene,world,[]);
  for(const [at,expected]of [[1,damaged],[0,intact],[2,intact],[1,damaged],[0,intact],[2,intact]] as const){replay.seek(at);const restored=replay.cars[0];assert.equal(restored.body.isEnabled(),false);assert.deepEqual(restored.setup.livery,car.setup.livery);sameAppearance(appearance(restored),expected);for(const row of livery){const mesh=restored.model.getObjectByName(row.name) as T.Mesh;assert.deepEqual(Array.from(mesh.geometry.attributes.wreckPosition.array),row.rest);assert.deepEqual(Array.from(mesh.geometry.attributes.liveryNormal.array),row.normal);}}
  sameAppearance(appearance(car),intact);sameAppearance(appearance(other),otherRest);
 }finally{replay?.dispose();car.dispose();other.dispose();stock.dispose();world.free();}
});

test('the Tern greenhouse extends the immutable wheel release with driving and camera inputs unchanged',verifyTernGreenhouseRevision);
