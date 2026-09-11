import test from 'node:test';
import assert from 'node:assert/strict';
import {Texture,Scene,Vector3,Matrix4} from 'three';
import {SchoolEyes} from '../lib/SchoolEyes.ts';
import {Tetra3D} from '../lib/Tetra3D.ts';
import {bendTetra} from '../lib/TetraKinematics.ts';
import {createTetraDeformation} from '../lib/TetraDeformation.ts';

test('cached deformation preserves every body and fin vertex across swimming efforts',()=>{
 const fish=new Tetra3D(new Texture(),0,false);
 try{
  for(const [mesh,{kind,side}] of fish.fins){
   const rest=new Float32Array(mesh.geometry.getAttribute('position').array),out=new Float32Array(rest.length),expected=new Float32Array(rest.length),deform=createTetraDeformation(rest,kind,side);
   for(const effort of [0,.025,.35,1,1.5])for(const phase of [0,.7,2.1,4.8,10.3]){
    deform(out,phase,effort,phase*1.9,.63);
    for(let i=0;i<rest.length;i+=3)expected.set(bendTetra(rest[i],rest[i+1],rest[i+2],phase,effort,kind,side,phase*1.9,.63),i);
    assert.deepEqual(out,expected,`${kind}, side ${side}, effort ${effort}, phase ${phase}`);
   }
  }
 }finally{fish.dispose();}
});

test('batched eyes preserve all source geometry and independent world-space transforms',()=>{
 const scene=new Scene(),fish=Array.from({length:16},(_,i)=>{const f=new Tetra3D(new Texture(),i,false);f.group.position.set(i*.2,1+i*.08,Math.sin(i));f.group.rotation.set(.02*i,.3*i,.01*i);f.group.scale.setScalar(.48+i*.005);scene.add(f.group);return f;});
 const eyes=new SchoolEyes(scene,fish),matrix=new Matrix4();scene.updateMatrixWorld();eyes.update();
 assert.equal(eyes.batches.length,2);
 for(let kind=0;kind<2;kind++){
  const batch=eyes.batches[kind];assert.equal(batch.count,32);
  assert.deepEqual(batch.geometry.getAttribute('position').array,fish[0].eyeMeshes[kind].geometry.getAttribute('position').array);
  assert.deepEqual(batch.geometry.index.array,fish[0].eyeMeshes[kind].geometry.index.array);
  for(let f=0;f<fish.length;f++)for(let side=0;side<2;side++){
   const source=fish[f].eyeMeshes[kind+side*2];batch.getMatrixAt(f*2+side,matrix);
   const point=new Vector3(.013,-.007,.017);assert.ok(point.clone().applyMatrix4(matrix).distanceTo(point.clone().applyMatrix4(source.matrixWorld))<1e-6);
   assert.equal(source.visible,false);
  }
 }
 for(const f of fish)f.dispose();for(const b of eyes.batches){b.geometry.dispose();b.material.dispose();}
});
