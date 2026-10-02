import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import * as T from 'three';import R from '@dimforge/rapier3d-compat';import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {buildEstateAsset,buildPlayableEstateAsset} from '../src/estate-asset';import {loadCarWithoutImages} from '../tools/car-asset-audit';import {prepareWreckGeometry,dentGeometry,repairWreckGeometry} from '../src/wreck-geometry';import {WreckAttachments} from '../src/wreck-attachments';import {verifyEstateRearRevision} from './estate-rear-invariants';
import {loadCars} from '../src/assets';import {Vehicle} from '../src/vehicle';import {stockSetup} from '../src/garage';import {ReplayRecorder,replayFile,readReplayFile} from '../src/replay-data';import {ReplayScene,captureReplayFrame} from '../src/replay-scene';
const obj=readFileSync(new URL('../public/models/brightretro-muscle/FireGTO.obj',import.meta.url),'utf8');
const authored=(name:string)=>/^panel_(?:TailgateEstate|RearQuarterEstate|RearValanceEstate|bumper_rearEstate)/.test(name);
const key=(p:T.Vector3)=>p.toArray().map(n=>n.toFixed(6)).join(',');
test('the rolled hatch shoulder closes the full lower window joint, including both rear corners',()=>{
 const root=buildEstateAsset(obj),hatch=root.getObjectByName('panel_TailgateEstateStamping')as T.Mesh;root.updateMatrixWorld(true);const p=hatch.geometry.attributes.position,edge:T.Vector3[]=[];
 for(let i=0;i<p.count;i++){const v=new T.Vector3().fromBufferAttribute(p,i).applyMatrix4(hatch.matrixWorld);if(v.y>1.02&&Math.abs(v.z+2.35)<1e-6)edge.push(v);}
 assert.ok(edge.some(v=>v.x<-.799)&&edge.some(v=>v.x>.799),'The hatch must reach both window corners in the same rear plane');
 for(const x of [-.77,-.65,-.4,0,.4,.65,.77])for(const y of [1.018,1.024,1.030,1.040]){
  const hit=new T.Raycaster(new T.Vector3(x,y,-3),new T.Vector3(0,0,1)).intersectObject(root,true)[0];assert.ok(hit);assert.match(hit.object.name,/^(panel_Tailgate|glass_Tailgate)/,'The window joint must not expose cargo furnishings');assert.ok(hit.point.z< -2.31,'The rear skin must close at the window plane');
 }
});
test('estate rear closes the hatch, corner returns and bumper without a protruding cargo floor',()=>{
 const root=buildEstateAsset(obj),hatch=root.getObjectByName('panel_TailgateEstateStamping')as T.Mesh;root.updateMatrixWorld(true);
 const p=hatch.geometry.attributes.position,edges=new Map<string,number>();
 for(let i=0;i<p.count;i+=3)for(let j=0;j<3;j++){const edge=[key(new T.Vector3().fromBufferAttribute(p,i+j)),key(new T.Vector3().fromBufferAttribute(p,i+(j+1)%3))].sort().join('|');edges.set(edge,(edges.get(edge)??0)+1);}
 assert.ok([...edges.values()].every(n=>n===2),'The hatch needs a closed inner skin and perimeter');
 for(const x of [-.65,-.5,-.3,0,.3,.5,.65])for(const y of [.60,.65,.80,.94]){
  const hit=new T.Raycaster(new T.Vector3(x,y,-3),new T.Vector3(0,0,1)).intersectObject(root,true)[0];assert.ok(hit);assert.match(hit.object.name,/^panel_TailgateEstate/,'Cargo furnishings must remain inside the hatch');
 }
 for(const side of [-1,1]){
  const hit=new T.Raycaster(new T.Vector3(side*1.1,.78,-2.20),new T.Vector3(-side,0,0)).intersectObject(root,true)[0];assert.ok(hit);assert.match(hit.object.name,/EstateReturn/,'Both rear corner returns must face outwards');
 }
 let vertices=0;root.traverse(o=>{if(!(o instanceof T.Mesh))return;vertices+=o.geometry.attributes.position.count;if(!authored(o.name))return;for(const name of ['position','normal','uv'])assert.ok([...o.geometry.attributes[name].array].every(Number.isFinite));const a=o.geometry.attributes.position;for(let i=0;i<a.count;i+=3){const [x,y,z]=[0,1,2].map(j=>new T.Vector3().fromBufferAttribute(a,i+j));assert.ok(y.sub(x).cross(z.sub(x)).lengthSq()>1e-18,o.name+' degenerate triangle');}});assert.ok(vertices<65000,`Fleet budget exceeded: ${vertices}`);
});
test('the exported hatch skin, glazing and trim hinge together at the roof while lamps, floor and wheels stay fixed',async()=>{
 const source=buildPlayableEstateAsset(obj),root=(await loadCarWithoutImages('wagon')).scene;
 for(const o of source.children)if(o instanceof T.Mesh&&authored(o.name)){const copy=root.getObjectByName(o.name)as T.Mesh;assert.ok(copy,o.name);assert.deepEqual(Array.from(copy.geometry.attributes.position.array),Array.from(o.geometry.attributes.position.array));assert.ok(copy.matrixWorld.equals(o.matrixWorld));}
 prepareWreckGeometry(root);const wheels=['FL','FR','RL','RR'].map(n=>root.getObjectByName('wheel_'+n)!),parts=new WreckAttachments(root,wheels,.914),hatch=parts.assemblies.find(a=>a.name==='tailgate')!,bumper=parts.assemblies.find(a=>a.name==='rear-bumper')!;assert.ok(hatch&&bumper);
 for(const name of ['panel_TailgateEstateStamping','panel_TailgateEstateInnerPressings','panel_TailgateEstateHandle','glass_TailgateRear','panel_TailgateRearWindowFrame','panel_TailgateRearWindowSeal','panel_TailgateRearWindowTrim'])assert.ok(hatch.members.some(m=>m.mesh.name===name),name);
 assert.ok(bumper.members.some(m=>m.mesh.name==='panel_bumper_rearEstateChrome'));assert.ok(!hatch.members.some(m=>m.mesh.name.includes('Lamp')||m.mesh.name.includes('bumper')));
 const fixed=['Interior_Estate_cargo_floor','panel_RearQuarterEstateBrakeL','panel_RearQuarterEstateBrakeR',...wheels.map(w=>w.name)].map(n=>root.getObjectByName(n)!);const matrices=fixed.map(o=>o.matrix.clone());
 parts.hit(new T.Vector3(0,.82,-2.375),new T.Vector3(0,0,1),65);parts.poseAt(1,12);assert.ok(hatch.loose>.8);
 const first=hatch.members[0],transform=first.mesh.matrix.clone().multiply(first.matrix.clone().invert());for(const member of hatch.members){const t=member.mesh.matrix.clone().multiply(member.matrix.clone().invert());assert.ok(t.elements.every((x,i)=>Math.abs(x-transform.elements[i])<1e-6),'Every hatch part must use the same hinge');}
 const bottom=hatch.bounds.getCenter(new T.Vector3());bottom.y=hatch.bounds.min.y;assert.ok(bottom.clone().applyMatrix4(transform).z<bottom.z-.20,'A failed latch must swing the bottom rearwards');fixed.forEach((o,i)=>assert.ok(o.matrix.equals(matrices[i])));
 const skin=root.getObjectByName('panel_TailgateEstateStamping')as T.Mesh,original=Array.from(skin.geometry.attributes.position.array);assert.ok(dentGeometry(skin,new T.Vector3(.3,.8,-2.35),new T.Vector3(0,0,1),25)>0);repairWreckGeometry(skin);assert.deepEqual(Array.from(skin.geometry.attributes.position.array),original);parts.reset();for(const a of parts.assemblies)for(const m of a.members)assert.ok(m.mesh.matrix.equals(m.matrix));
});
test('actual estate hatch damage, brake lights and repair survive compressed replay and backwards seeks',async()=>{
 await R.init();const original=GLTFLoader.prototype.loadAsync;GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/(coupe|sedan|hatch|muscle|wagon|utility|compact|wheel-machining)\.glb$/.exec(String(url))![1]);try{await loadCars(()=>{});}finally{GLTFLoader.prototype.loadAsync=original;}
 const world=new R.World({x:0,y:-9.81,z:0}),scene=new T.Scene(),setup=stockSetup('wagon'),fx={emit(){},mark(){},detach(m:T.Mesh){m.visible=false;}}as any,live=new Vehicle(0,'wagon',setup.paint,scene,world,fx,setup);live.place(10,5,.7);live.render(1);live.root.updateMatrixWorld(true);
 const record=new ReplayRecorder({version:1,mode:'derby',reverse:false,cars:[{id:0,kind:'wagon',setup}],props:0,created:'2026-10-01T12:00:00Z'});live.onVisualEvent=e=>record.event(0,.5,e);
 const shape=(car:Vehicle)=>car.wreckParts.assemblies.find(a=>a.name==='tailgate')!.members.map(m=>({name:m.mesh.name,visible:m.mesh.visible,points:Array.from(m.mesh.geometry.attributes.position.array),matrix:m.mesh.matrix.toArray()}));
 try{assert.ok(live.brakeLights.size>0);record.capture(0,()=>captureReplayFrame([live],[],[0]),true);const intact=shape(live),point=new T.Vector3(0,.80,-2.35).applyMatrix4(live.model.matrixWorld),direction=new T.Vector3(0,0,1).applyQuaternion(live.root.quaternion);live.hit(point,direction,22,.5,true);live.wreckParts.poseAt(1,0);assert.ok(live.wreckParts.assemblies.find(a=>a.name==='tailgate')!.loose>0);record.capture(1,()=>captureReplayFrame([live],[],[0]),true);const damaged=shape(live);assert.notDeepEqual(damaged,intact);
 const doc=await readReplayFile(new File([await replayFile(record.document())],'estate-hatch.qir')),replay=new ReplayScene(doc,scene,world,[]);try{replay.seek(1);assert.deepEqual(shape(replay.cars[0]),damaged);replay.seek(0);assert.deepEqual(shape(replay.cars[0]),intact);replay.seek(1);assert.deepEqual(shape(replay.cars[0]),damaged);live.repair();assert.deepEqual(shape(live),intact);}finally{replay.dispose();}
 }finally{live.dispose();world.free();}
});
test('estate rear refinement retains every preceding source hash',()=>verifyEstateRearRevision());
test('the estate roof hinge leaves the utility load gate and existing bumper hinge behavior unchanged',async()=>{
 const root=(await loadCarWithoutImages('utility')).scene;prepareWreckGeometry(root);const parts=new WreckAttachments(root,['FL','FR','RL','RR'].map(n=>root.getObjectByName('wheel_'+n)!),.914),gate:T.Mesh[]=[];root.traverse(o=>{if(o instanceof T.Mesh&&o.name.startsWith('panel_Tailgate'))gate.push(o);});assert.ok(gate.length>=3);const rest=gate.map(o=>o.matrix.clone());
 parts.hit(new T.Vector3(0,.85,-3),new T.Vector3(0,0,1),65);parts.poseAt(1,12);gate.forEach((o,i)=>assert.ok(o.matrix.equals(rest[i]),'The utility gate must not acquire an estate roof hinge'));assert.ok(parts.assemblies.find(a=>a.name==='rear-bumper')!.loose>0);
});
