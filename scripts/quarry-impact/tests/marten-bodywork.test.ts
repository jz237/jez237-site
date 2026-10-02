import test from 'node:test';import assert from 'node:assert/strict';import * as T from 'three';import R from '@dimforge/rapier3d-compat';import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {buildMartenAsset} from '../src/marten-asset';import {martenWindscreenBow} from '../src/marten-greenhouse';import {martenBodyWidth,martenNoseZ,martenBonnetLip,martenFrontWingZ} from '../src/marten-bodywork';
import {loadCarWithoutImages} from '../tools/car-asset-audit';import {loadCars} from '../src/assets';import {Vehicle} from '../src/vehicle';import {stockSetup} from '../src/garage';
import {ReplayRecorder,replayFile,readReplayFile} from '../src/replay-data';import {ReplayScene,captureReplayFrame} from '../src/replay-scene';import {verifyMartenRevision} from './marten-invariants';
await R.init();const original=GLTFLoader.prototype.loadAsync;try{GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/(coupe|sedan|hatch|muscle|wagon|utility|compact|van|tern|marten|buggy|wheel-machining)\.glb$/.exec(String(url))![1]);await loadCars(()=>{});}finally{GLTFLoader.prototype.loadAsync=original;}
const root=buildMartenAsset(),v=(x:number,y:number,z:number)=>new T.Vector3(x,y,z),mesh=(name:string)=>root.getObjectByName(name) as T.Mesh;
function distance(p:T.Vector3,m:T.Mesh){const a=m.geometry.attributes.position,triangle=new T.Triangle(),q=new T.Vector3();let min=Infinity;for(let i=0;i<a.count;i+=3){triangle.a.fromBufferAttribute(a,i).applyMatrix4(m.matrixWorld);triangle.b.fromBufferAttribute(a,i+1).applyMatrix4(m.matrixWorld);triangle.c.fromBufferAttribute(a,i+2).applyMatrix4(m.matrixWorld);triangle.closestPointToPoint(p,q);min=Math.min(min,q.distanceTo(p));}return min;}

test('the rounded Marten nose has closed outward skins and genuine clear lamp openings',()=>{
 const nose=mesh('panel_FrontValanceMarten'),p=nose.geometry.attributes.position,edges=new Map<string,number>();let volume=0;const key=(q:T.Vector3)=>q.toArray().map(x=>x.toFixed(6)).join(',');
 for(let i=0;i<p.count;i+=3){const tri=[0,1,2].map(j=>new T.Vector3().fromBufferAttribute(p,i+j));volume+=tri[0].dot(tri[1].clone().cross(tri[2]))/6;for(let j=0;j<3;j++){const e=[key(tri[j]),key(tri[(j+1)%3])].sort().join('|');edges.set(e,(edges.get(e)??0)+1);}}
 assert.ok([...edges.values()].every(n=>n===2));assert.ok(volume>1e-4);assert.ok(martenNoseZ(0)-martenNoseZ(.735)>.14,'Nose corners wrap backwards');
 const n=nose.geometry.attributes.normal;for(let i=0;i<p.count;i++)if(p.getY(i)>.42&&n.getZ(i)>.1&&Math.abs(p.getZ(i)-martenNoseZ(p.getX(i)))<.00002)assert.ok(Math.abs(n.getY(i))<1e-6,'Smooth front skin normals must not inherit folded-edge shading');
 for(const side of [-1,1])for(let i=0;i<16;i++){const a=i*Math.PI/8,x=side*.51+Math.cos(a)*.10,y=.678+Math.sin(a)*.10;assert.equal(new T.Raycaster(v(x,y,2.5),v(0,0,-1)).intersectObject(nose).length,0);}
});

test('bonnet and wing returns meet the curved nose without open corners or exposed underfloor',()=>{
 const nose=mesh('panel_FrontValanceMarten'),hood=mesh('panel_hoodMarten');
 for(let i=0;i<=32;i++){const x=T.MathUtils.lerp(-.652,.652,i/32),point=v(x,martenBonnetLip(x),martenNoseZ(x));assert.ok(distance(point,nose)<.004,'Nose upper edge');assert.ok(distance(point,hood)<.005,`Bonnet lip at ${x}`);}
 for(const side of [-1,1]){
  const shoulder=mesh('panel_FrontShoulderMarten'+(side<0?'L':'R'));
  for(let j=0;j<=12;j++){const t=j/12,x=side*T.MathUtils.lerp(martenBodyWidth(.815,1.96),.652,t),point=v(x,.815+.02*Math.sin(t*Math.PI/2),martenNoseZ(x));assert.ok(distance(point,nose)<.0015,`Folded shoulder return ${t}`);}
  for(let i=0;i<=28;i++){const t=i/28,z=T.MathUtils.lerp(.62,1.96,t),point=v(side*.652,T.MathUtils.lerp(1.045,.835,t),martenFrontWingZ(side*.652,z)+(1-t)**2*martenWindscreenBow(side*.652));assert.ok(distance(point,hood)<.005,'Bonnet side');assert.ok(distance(point,shoulder)<.005,'Shoulder side');}
  for(const y of [.375,.4366,.5774,.705,.815]){const x=side*martenBodyWidth(y,1.96);assert.ok(distance(v(x,y,martenNoseZ(x)),nose)<.005,'Nose-to-wing corner return');}
 }
 const floor=new T.Box3().setFromObject(mesh('Structure Marten floor'));assert.ok(floor.max.x<martenBodyWidth(.375,floor.max.z)-.01);
});

const fx={emit(){},mark(){},detach(m:T.Mesh){m.visible=false;}}as any;
const noseState=(c:Vehicle)=>c.panels.filter(p=>/FrontValanceMarten|HeadlightMarten|hoodMarten|FrontPlateMarten/.test(p.name)).map(p=>({name:p.name,positions:[...p.geometry.attributes.position.array],visible:p.visible}));
test('the production coupe keeps enamel paint and visible daylight lens detail without changing existing vehicles',()=>{
 const w=new R.World({x:0,y:0,z:0}),scene=new T.Scene(),a=new Vehicle(0,'marten',0x6e929a,scene,w,fx),b=new Vehicle(1,'coupe',0xffffff,scene,w,fx);
 try{const paint=a.panels.find(p=>(p.material as T.Material).name.startsWith('paint'))!.material as T.MeshPhysicalMaterial;assert.equal(paint.metalness,.12);assert.equal(paint.roughness,.36);assert.equal(paint.clearcoat,.85);
  const lamp=a.model.getObjectByName('panel_HeadlightMartenLens1') as T.Mesh,material=lamp.material as T.MeshPhysicalMaterial;assert.equal(material.emissiveIntensity,.35);assert.ok(a.model.getObjectByName('panel_HeadlightMartenFlutes1'));a.model.traverse(o=>{if(o instanceof T.Mesh&&/WaistTrim|Shutline|Flutes/.test(o.name))assert.equal(o.castShadow,false,'Fine trim should not cast dotted sub-pixel shadows on its paint');});
  const old=b.panels.find(p=>(p.material as T.Material).name.includes('Headlight'))!.material as T.MeshPhysicalMaterial;assert.equal(old.emissiveIntensity,3);
 }finally{a.dispose();b.dispose();w.free();}
});

test('new nose, lamp detail and bonnet damage remain independent and reproduce through replay and repair',async()=>{
 const scene=new T.Scene(),w=new R.World({x:0,y:-9.81,z:0}),setup=stockSetup('marten'),a=new Vehicle(0,'marten',setup.paint,scene,w,fx,setup),b=new Vehicle(1,'marten',setup.paint,scene,w,fx,setup);a.place(2,4,.2);a.render(1);a.root.updateMatrixWorld(true);
 const r=new ReplayRecorder({version:1,mode:'derby',reverse:false,cars:[{id:0,kind:'marten',setup}],props:0,created:'2026-10-02T06:00:00Z'});a.onVisualEvent=e=>r.event(0,.5,e);
 try{const intact=noseState(a),untouched=noseState(b);assert.ok(intact.some(p=>p.name==='panel_FrontValanceMarten'));r.capture(0,()=>captureReplayFrame([a],[],[0]),true);
  a.hit(v(.48,.68,2.01).applyMatrix4(a.model.matrixWorld),v(0,0,-1).applyQuaternion(a.root.quaternion),29,.5,true);r.capture(1,()=>captureReplayFrame([a],[],[0]),true);const damaged=noseState(a);assert.notDeepEqual(damaged,intact);assert.deepEqual(noseState(b),untouched);assert.ok(damaged.every(p=>p.positions.every(Number.isFinite)));
  const doc=await readReplayFile(new File([await replayFile(r.document())],'marten-body.qir')),replay=new ReplayScene(doc,scene,w,[]);try{replay.seek(1);assert.deepEqual(noseState(replay.cars[0]),damaged);replay.seek(0);assert.deepEqual(noseState(replay.cars[0]),intact);replay.seek(1);assert.deepEqual(noseState(replay.cars[0]),damaged);}finally{replay.dispose();}a.repair();assert.deepEqual(noseState(a),intact);
 }finally{a.dispose();b.dispose();w.free();}
});

test('bodywork refinement preserves all ten vehicle identities, physics and previous release layers',verifyMartenRevision);
