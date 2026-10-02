import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {templates} from '../src/assets';
import {stockSetup} from '../src/garage';
import {landscapeHeight} from '../src/quarry-layout';
import {replayCarStride,type ReplayDocument} from '../src/replay-data';
import {ReplayScene,type ReplayProp} from '../src/replay-scene';

await R.init();

// Small real Three/Rapier fixtures isolate lifecycle behavior from artwork.
function fixture(){
 const scene=new T.Scene(),world=new R.World({x:0,y:-9.81,z:0}),model=new T.Group(),before=templates.get('tern');
 const material=new T.MeshStandardMaterial({name:'paint_Test'}),panel=new T.Mesh(new T.BoxGeometry(1,.2,2),material);panel.name='panel_Test';model.add(panel);
 for(const [i,name]of ['FL','FR','RL','RR'].entries()){const wheel=new T.Group();wheel.name='wheel_'+name;wheel.position.set(i%2?.69:-.69,.32,i<2?1.18:-1.18);model.add(wheel);}
 let carClones=0,failCarClone=0;const clone=model.clone;model.clone=function(recursive){carClones++;if(carClones===failCarClone)throw Error('car clone failed');return clone.call(this,recursive);};templates.set('tern',model);
 const props:ReplayProp[]=[];for(let i=0;i<2;i++){
  const mesh=new T.Mesh(new T.BoxGeometry(1,1,1),new T.MeshStandardMaterial());mesh.name='retained-prop-'+i;mesh.position.set(10+i*3,.5,20);scene.add(mesh);
  const body=world.createRigidBody(R.RigidBodyDesc.fixed().setTranslation(mesh.position.x,mesh.position.y,mesh.position.z));world.createCollider(R.ColliderDesc.cuboid(.5,.5,.5),body);props.push({mesh,body});
 }
 const children=scene.children.slice(),snapshot=world.takeSnapshot();
 return{scene,world,props,model,children,snapshot,get carClones(){return carClones;},failCarClone(n:number){failCarClone=n;},
  unchanged(){assert.deepEqual(scene.children,children);assert.deepEqual(world.takeSnapshot(),snapshot);},
  dispose(){if(before)templates.set('tern',before);else templates.delete('tern');world.free();panel.geometry.dispose();material.dispose();for(const p of props){p.mesh.geometry.dispose();(p.mesh.material as T.Material).dispose();}}
 };
}
function document():ReplayDocument{
 const meta={version:1 as const,mode:'race' as const,reverse:false,cars:[{id:0,kind:'tern' as const,setup:stockSetup('tern')}],props:2,created:'2026-10-02T17:00:00Z',tyreModel:1 as const},values=new Float32Array(replayCarStride(meta)+14);
 values.set([2,.89,3,0,0,0,1]);values[14]=100;
 for(let i=0;i<4;i++){values[15+i*8+6]=1;values[56+i*6+1]=1;}
 values.set([10,.5,20,0,0,0,1,13,.5,20,0,0,0,1],80);
 return{meta,frames:[{time:0,values}],events:[],limited:false};
}

test('replay scene rejects unknown courses and missing, excess or sparse props before any scene or world mutation',()=>{
 const f=fixture();try{
  for(const id of ['unknown-course',null]){const doc=document();(doc.meta as any).courseId=id;assert.throws(()=>new ReplayScene(doc,f.scene,f.world,f.props),/unsupported course/);f.unchanged();}
  const nonRace=document();Object.assign(nonRace.meta,{courseId:'ironfield-figure-eight-v1',mode:'derby'});assert.throws(()=>new ReplayScene(nonRace,f.scene,f.world,f.props),/circuit races/);f.unchanged();
  for(const props of [[],f.props.slice(0,1),[...f.props,f.props[0]],new Array<ReplayProp>(2)]){assert.throws(()=>new ReplayScene(document(),f.scene,f.world,props),/recorded course prop set/);f.unchanged();}
  assert.equal(f.carClones,0,'Preflight must finish before even cloning a vehicle');
 }finally{f.dispose();}
});

test('failed replay construction removes prior vehicle and prop copies without disposing retained source resources',()=>{
 for(const failure of ['second-car','second-prop']){
  const f=fixture();let disposedGeometry=0,disposedMaterial=0,sourceDisposed=0;
  f.scene.addEventListener('childadded',event=>{const panel=event.child.getObjectByName('panel_Test') as T.Mesh|undefined;if(panel){panel.geometry.addEventListener('dispose',()=>disposedGeometry++);(panel.material as T.Material).addEventListener('dispose',()=>disposedMaterial++);}});
  for(const p of f.props){p.mesh.geometry.addEventListener('dispose',()=>sourceDisposed++);(p.mesh.material as T.Material).addEventListener('dispose',()=>sourceDisposed++);}
  try{
   const doc=document();if(failure==='second-car'){doc.meta.cars.push({...doc.meta.cars[0],id:1});f.failCarClone(2);}else f.props[1].mesh.clone=()=>{throw Error('prop clone failed');};
   assert.throws(()=>new ReplayScene(doc,f.scene,f.world,f.props),failure==='second-car'?/car clone failed/:/prop clone failed/);
   assert.deepEqual(f.scene.children,f.children);assert.equal(f.world.bodies.len(),2);assert.equal(f.world.colliders.len(),2);assert.equal(f.world.vehicleControllers.size,0);
   assert.equal(disposedGeometry,1);assert.equal(disposedMaterial,1);assert.equal(sourceDisposed,0);
   for(const p of f.props){assert.deepEqual({...p.body.translation()},{x:p.mesh.position.x,y:p.mesh.position.y,z:p.mesh.position.z});assert.equal(p.body.isEnabled(),true);}
  }finally{f.dispose();}
 }
});

test('replay copies use an optional venue sampler while omitted legacy terrain and recorded prop poses remain intact',()=>{
 const f=fixture();try{
  const old=document(),legacy=new ReplayScene(old,f.scene,f.world,f.props);assert.equal(Object.hasOwn(old.meta,'courseId'),false);legacy.cars[0].place(77.8,64,0);assert.equal(legacy.cars[0].current.y,landscapeHeight(77.8,64)+.89);legacy.dispose();
  const doc=document();doc.meta.courseId='ironfield-figure-eight-v1';const ground={height:()=>0,surface:()=>'asphalt' as const},replay=new ReplayScene(doc,f.scene,f.world,f.props,ground);
  try{
   assert.equal(replay.cars[0].ground,ground);assert.equal(replay.cars[0].body.isEnabled(),false);replay.cars[0].place(77.8,64,0);assert.equal(replay.cars[0].current.y,.89);
   replay.seek(0);assert.deepEqual(replay.cars[0].current.toArray(),Array.from(doc.frames[0].values.slice(0,3)));assert.deepEqual(replay.props.map(p=>p.position.toArray()),[[10,.5,20],[13,.5,20]]);
   assert.ok(replay.props.every((p,i)=>p!==f.props[i].mesh&&p.geometry===f.props[i].mesh.geometry));assert.equal(f.world.bodies.len(),3);assert.equal(f.world.vehicleControllers.size,1);
  }finally{replay.dispose();}
  assert.deepEqual(f.scene.children,f.children);assert.equal(f.world.bodies.len(),2);assert.equal(f.world.colliders.len(),2);assert.equal(f.world.vehicleControllers.size,0);
 }finally{f.dispose();}
});
