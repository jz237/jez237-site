import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {FishRespiration} from '../lib/FishRespiration.ts';
import {Tetra3D} from '../lib/Tetra3D.ts';
import {createTetraDeformation} from '../lib/TetraDeformation.ts';
import {CoryModels} from '../lib/CoryModels.ts';

test('resting ventilation has delayed gill pulses, individual timing, and freezes on pause',()=>{
 const a=new FishRespiration(0),b=new FishRespiration(2),mouth=[],gill=[];
 for(let i=0;i<120;i++){a.update(1/60,0);b.update(1/60,0);mouth.push(a.mouth);gill.push(a.gill);}
 assert.ok(Math.max(...gill)>.98&&Math.min(...gill)<.01);
 const firstMouth=mouth.findIndex(v=>v>.98),firstGill=gill.findIndex(v=>v>.98);
 assert.ok(firstGill-firstMouth>10&&firstGill-firstMouth<22);
 assert.notEqual(a.gill,b.gill);
 const held=[a.mouth,a.gill];a.update(0,1);assert.deepEqual([a.mouth,a.gill],held);
 a.update(1/60,1);assert.ok(Math.abs(a.gill-held[1])<.15,'effort change does not reset breathing phase');
});

test('tetra gill surfaces and lips expand while the eye region and rear body retain their swimming pose',()=>{
 const fish=new Tetra3D(new T.Texture(),0,false),body=fish.group.children[0].geometry;
 const rest=body.attributes.position.array.slice(),closed=new Float32Array(rest.length),open=new Float32Array(rest.length),deform=createTetraDeformation(rest,'body');
 deform(closed,0,0,0,0,0,0);deform(open,0,0,0,0,1,1);
 let gillMotion=0,mouthMotion=0;
 for(let i=0;i<rest.length;i+=3){const x=rest[i],delta=Math.hypot(open[i]-closed[i],open[i+1]-closed[i+1],open[i+2]-closed[i+2]);
  if(x>.405&&x<.455||x<.29)assert.ok(delta<1e-7,'eyes and trunk do not pump');
  if(x>.31&&x<.39)gillMotion=Math.max(gillMotion,delta);
  if(x>.455)mouthMotion=Math.max(mouthMotion,delta);
  assert.ok(delta<.014,'ventilatory movement fits within the existing fish clearance');
 }
 assert.ok(gillMotion>.004&&mouthMotion>.006,'both movements are visible at close-up scale');
 assert.equal(fish.group.children.length,10,'no extra fish draw calls');fish.dispose();
});

test('Corydoras breathe individually in the existing two instanced draws, including between feeding bites',()=>{
 const model=new CoryModels(2),before=model.meshes.map(m=>m.geometry.attributes.position.array.slice());
 for(let i=0;i<80;i++){model.pose(0,new T.Vector3(),0,0,1,0,0,i/60,false);model.pose(1,new T.Vector3(),0,0,1,0,0,i/60,true);}
 assert.equal(model.meshes.length,2);
 const g=model.meshes[0].geometry,parts=g.attributes.coryPart,p=g.attributes.position;let eyes=0;
 for(let i=0;i<parts.count;i++)if(parts.getX(i)===11){eyes++;assert.ok(p.getX(i)>.168&&p.getX(i)<.237&&p.getY(i)>.119&&p.getY(i)<.183,'only eye geometry receives the fixed-eye mask');}
 assert.ok(eyes>100,'eye geometry is explicitly excluded from ventilation');
 assert.notEqual(model.respiration.getX(0),model.respiration.getX(1));
 assert.ok(model.respiration.getY(0)>0,'mouth breathes without a feeding flag');
 assert.equal(model.motion.getW(0),0);assert.equal(model.motion.getW(1),1,'feeding motion is retained');
 const held=model.respiration.array.slice();model.pose(0,new T.Vector3(),0,0,1,0,0,79/60,false);assert.deepEqual(model.respiration.array,held);
 model.meshes.forEach((m,i)=>{assert.deepEqual(m.geometry.attributes.position.array,before[i]);assert.equal(m.geometry.attributes.coryRespiration,model.respiration);});
});
