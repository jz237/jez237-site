import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {DemoDirector,type DemoCamera} from '../src/demo-director';
import {landscapeHeight} from '../src/quarry-layout';
import {DEFINITIONS} from '../src/rules';

const car=(id=0,x=0,z=0)=>{const root=new T.Group();root.position.set(x,landscapeHeight(x,z)+.85,z);return{id,kind:'wagon',root,current:root.position,speed:0,health:100,finished:false}as any;};
const rig=(aspect=16/9)=>({camera:new T.PerspectiveCamera(52,aspect,.1,850),orbit:{target:new T.Vector3(),update(){}}as any});
const right=new T.Vector3(1,0,0),up=new T.Vector3(0,1,0);
const horizon=(camera:T.PerspectiveCamera)=>Math.abs(right.clone().applyQuaternion(camera.quaternion).dot(up));
const bounded=(before:T.Quaternion,camera:T.PerspectiveCamera,dt:number)=>{
 assert.ok(before.angleTo(camera.quaternion)<=Math.min(dt,.05)*Math.PI/6+1e-6,'automatic orientation is bounded to30degrees/second');
 assert.ok(horizon(camera)<1e-10,'the world horizon must stay level through the turn');
 assert.ok(camera.position.toArray().every(Number.isFinite));
 assert.ok(camera.quaternion.toArray().every(Number.isFinite));
};
function framed(c:ReturnType<typeof car>,camera:T.PerspectiveCamera){
 const d=DEFINITIONS.wagon;
 for(const x of [-d.halfWidth,d.halfWidth])for(const y of [-.55,.9])for(const z of [-d.halfLength,d.halfLength]){
  const p=new T.Vector3(x,y,z).applyQuaternion(c.root.quaternion).add(c.root.position).project(camera);
  assert.ok(Math.abs(p.x)<.865&&p.y>-.825&&p.y<.525&&p.z>-1&&p.z<1,`body corner is framed: ${p.toArray()}`);
 }
}

test('same-subject recovery blends across the circuit without a translation or angular cut',t=>{
 let maxAngle=0,maxSpeed=0;
 for(const view of ['director','drone','chase']as DemoCamera[])for(const dt of [1/60,.05])for(const [x,z]of [[30,0],[-30,0],[0,30],[0,-30],[60,0],[0,60]]){
  const c=car(),d=new DemoDirector(),{camera,orbit}=rig();d.select(view);
  for(let i=0;i<Math.round(2/dt);i++)d.update([c],camera,orbit,dt,true);
  c.root.position.set(x,landscapeHeight(x,z)+.85,z);c.root.rotation.set(Math.PI,Math.PI,0);
  for(let i=0;i<Math.round(12/dt);i++){
   const previous=camera.position.clone(),rotation=camera.quaternion.clone();d.update([c],camera,orbit,dt,true);bounded(rotation,camera,dt);
   maxAngle=Math.max(maxAngle,rotation.angleTo(camera.quaternion)*180/Math.PI);maxSpeed=Math.max(maxSpeed,camera.position.distanceTo(previous)/dt);
   assert.ok(camera.position.distanceTo(previous)<dt*75,'recovery cannot translate the whole rig by the teleport distance');assert.equal(d.followed,0);
  }
  assert.ok(orbit.target.distanceTo(c.root.position)<1.3,'the blend eventually reaches the recovered car, including the1.1m Chase look-ahead');framed(c,camera);
 }
 t.diagnostic(`Worst angular step ${maxAngle.toFixed(3)}degrees; camera translation ${maxSpeed.toFixed(3)}m/s across60m recoveries.`);
});

test('alternating opposite-side obstruction destinations never cross into an upside-down or banked view',t=>{
 let maximum=0,maxHorizon=0;
 for(const view of ['director','drone','chase']as DemoCamera[])for(const dt of [1/60,.05]){
  const c=car(),axis=new T.Vector2(view==='chase'?0:5,-10).normalize();let opposite=false;
  // Isolate the worst resolver choice, independent of changing map artwork:
  // only a narrow corridor on one side is clear, then the opposite side.
  const d=new DemoDirector(undefined,(_from,to)=>{
   const offset=new T.Vector2(to.x,to.z),along=offset.dot(axis)*(opposite?-1:1),across=Math.abs(offset.x*axis.y-offset.y*axis.x);
   return along>3&&across<along*.1?null:1;
  }),{camera,orbit}=rig();d.select(view);
  for(let i=0;i<Math.round(12/dt);i++){
   opposite=Math.floor(i*dt/.8)%2===1;const rotation=camera.quaternion.clone();d.update([c],camera,orbit,dt,false);
   if(i){bounded(rotation,camera,dt);maximum=Math.max(maximum,rotation.angleTo(camera.quaternion)*180/Math.PI);}
   maxHorizon=Math.max(maxHorizon,horizon(camera));assert.ok(camera.position.distanceTo(orbit.target)<45,'a turning camera must not zoom exponentially away');
  }
  // Once the obstruction settles, the camera must finish the move and frame
  // the subject, rather than achieving calm by freezing permanently.
  opposite=false;for(let i=0;i<Math.round(12/dt);i++)d.update([c],camera,orbit,dt,false);framed(c,camera);
 }
 t.diagnostic(`Opposite-side choices: maximum ${maximum.toFixed(3)}degrees/frame; horizon error ${maxHorizon}.`);
});

test('normal moving-car framing remains close and level at60Hz and20Hz',()=>{
 for(const view of ['director','drone','chase']as DemoCamera[])for(const aspect of [16/9,9/16])for(const dt of [1/60,.05]){
  const c=car(),d=new DemoDirector(),{camera,orbit}=rig(aspect);d.select(view);c.speed=18;
  for(let i=0;i<Math.round(8/dt);i++){
   const yaw=Math.sin(i*dt/5)*.5;c.root.quaternion.setFromAxisAngle(up,yaw);c.root.position.add(new T.Vector3(Math.sin(yaw)*18*dt,0,Math.cos(yaw)*18*dt));c.root.position.y=landscapeHeight(c.root.position.x,c.root.position.z)+.85;
   const previous=camera.quaternion.clone();d.update([c],camera,orbit,dt,true);if(i)bounded(previous,camera,dt);framed(c,camera);
   assert.ok(camera.position.distanceTo(c.root.position)<45,'ordinary driving retains visible vehicle detail');
  }
 }
});

test('explicit follow and camera selection remain immediate and reset does not inherit an old recovery',()=>{
 const a=car(0),b=car(1,60),d=new DemoDirector(),{camera,orbit}=rig();d.update([a,b],camera,orbit,1/60,false);
 d.follow(1);d.update([a,b],camera,orbit,1/60,false);assert.equal(d.followed,1);framed(b,camera);
 d.select('hood');d.update([a,b],camera,orbit,1/60,false);assert.equal(d.activeView,'hood');assert.ok(camera.position.distanceTo(b.root.position)<3);
 d.reset();d.select('director');a.root.position.set(-50,landscapeHeight(-50,0)+.85,0);d.update([a],camera,orbit,1/60,false);assert.equal(d.followed,0);assert.ok(orbit.target.distanceTo(a.root.position)<1);framed(a,camera);
});

test('zero-time updates and a long frame do not bypass the angular or horizon limits',()=>{
 const c=car(),d=new DemoDirector(),{camera,orbit}=rig();d.update([c],camera,orbit,1/60,false);
 const stationary=camera.quaternion.clone();d.update([c],camera,orbit,0,false);assert.ok(stationary.angleTo(camera.quaternion)<1e-7);
 c.root.position.set(0,landscapeHeight(0,60)+.85,60);c.root.rotation.set(Math.PI/2,Math.PI,0);
 const before=camera.quaternion.clone();d.update([c],camera,orbit,.5,true);bounded(before,camera,.5);
 assert.ok(camera.position.distanceTo(orbit.target)<45,'a hitch cannot trigger repeated zoom expansion');
 for(let i=0;i<900;i++){const q=camera.quaternion.clone();d.update([c],camera,orbit,1/60,true);bounded(q,camera,1/60);}
 framed(c,camera);
});
