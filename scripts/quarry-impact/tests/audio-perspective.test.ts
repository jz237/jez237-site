import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {Sound} from '../src/audio';
import {audioListenerPosition,AudioListenerMotion} from '../src/audio-perspective';
const near=(a:number,b:number)=>assert.ok(Math.abs(a-b)<1e-8,`${a} != ${b}`);
const parameter=(value=0)=>({value,setTargetAtTime(v:number){this.value=v;}});
const loop=()=>({source:{playbackRate:parameter(1)},gain:{gain:parameter()},pan:{positionX:parameter(),positionY:parameter(),positionZ:parameter()}});
function fixture(){
 const sound=new Sound(),camera=new T.PerspectiveCamera();camera.position.set(0,100,0);camera.lookAt(0,0,0);
 const listener=Object.fromEntries(['positionX','positionY','positionZ','forwardX','forwardY','forwardZ','upX','upY','upZ'].map(k=>[k,parameter()]));
 sound.ctx={currentTime:0,listener} as any;sound.ready=true;
 const cars=[0,5].map(id=>({id,kind:'coupe',current:new T.Vector3(),velocity:new T.Vector3(),health:100,rpm:2200,engineDamage:0,engineStall:0,speed:20,slip:2,surface:'gravel',input:{throttle:.5},gear:2,controller:{wheelIsInContact:()=>true}}));
 for(const car of cars)sound.loops.set(car.id,new Map(['low','load','tires','gravel'].map(name=>[name,loop()])) as any);
 const shots:string[]=[];sound.shot=(id:string)=>{shots.push(id);};
 const update=(id=5,view:'overview'|'trackside'|'chase'|'hood'='overview',wreck=false)=>sound.update(cars as any,camera,1/60,wreck,{id,view});
 const gain=(id:number,name:string)=>sound.loops.get(id)!.get(name)!.gain.gain.value;
 const rate=(id:number)=>sound.loops.get(id)!.get('low')!.source.playbackRate.value;
 return{sound,camera,listener,cars,shots,update,gain,rate};
}
test('overview, drone and distant chase keep subject audible while physical cameras retain their position',()=>{
 const focus=new T.Vector3(30,4,-20),camera=new T.Vector3(30,204,-20),original=camera.clone();
 for(const view of ['overview','drone','chase'] as const){const p=audioListenerPosition(camera,focus,view);near(p.distanceTo(focus),18);near(p.y,22);}
 for(const view of ['hood','trackside','orbit','director',undefined] as const)assert.deepEqual(audioListenerPosition(camera,focus,view),camera);
 assert.deepEqual(camera,original);assert.deepEqual(audioListenerPosition(focus.clone().addScalar(2),focus,'chase'),focus.clone().addScalar(2));
 assert.deepEqual(audioListenerPosition(camera,undefined,'overview'),camera);
});
test('listener movement tracks ordinary travel and rejects cuts, target switches, teleports and pause gaps',()=>{
 const m=new AudioListenerMotion(),p=new T.Vector3();assert.equal(m.velocity(p,1/60,'a').length(),0);
 near(m.velocity(p.set(1,0,0),.1,'a').x,10);
 assert.equal(m.velocity(p.set(100,0,0),.1,'a').length(),0);
 assert.equal(m.velocity(p.set(101,0,0),.1,'b').length(),0);
 assert.equal(m.velocity(p.set(102,0,0),2,'b').length(),0);
 m.reset();assert.equal(m.velocity(p.set(103,0,0),.1,'b').length(),0);
 for(const dt of [0,-1,NaN,Infinity])assert.equal(m.velocity(p.addScalar(1),dt,'b').length(),0);
});
test('actual Sound mix boosts the followed car, moves the listener and resets Doppler on camera cuts',()=>{
 const f=fixture();f.update();near(f.gain(5,'low'),.38);near(f.gain(0,'low'),.22);near(f.listener.positionY.value,18);
 const rate=f.rate(5);f.camera.position.set(900,10,0);f.update(5,'trackside');near(f.listener.positionX.value,900);near(f.rate(5),rate);
 f.update(0,'hood');near(f.gain(0,'low'),.38);near(f.gain(5,'low'),.22);near(f.rate(0),rate);
 f.update(99,'chase');near(f.gain(0,'low'),.38);assert.ok(Number.isFinite(f.rate(0)),'missing target safely follows the first existing car');
});
test('airborne vehicles silence tyre and gravel contact loops and cannot trigger a skid; landing remains audible',()=>{
 const f=fixture();f.update();assert.ok(f.gain(5,'tires')>0&&f.gain(5,'gravel')>0);
 f.cars[1].controller.wheelIsInContact=()=>false;f.cars[1].slip=6;f.update();assert.equal(f.gain(5,'tires'),0);assert.equal(f.gain(5,'gravel'),0);assert.ok(f.gain(5,'low')>0);assert.ok(!f.shots.includes('skid'));
 f.cars[1].controller.wheelIsInContact=()=>true;f.update();assert.ok(f.shots.includes('suspension'));assert.ok(f.gain(5,'gravel')>0);
 f.cars[1].surface='asphalt';f.update();assert.equal(f.gain(5,'gravel'),0);near(f.gain(5,'tires'),.35);
 f.update(5,'overview',true);for(const id of [0,5])for(const name of ['low','load','tires','gravel'])assert.equal(f.gain(id,name),0,'wreck inspection stays silent');
});
test('remote grounding evidence is respected and stalled engines stay silent through perspective changes',()=>{
 const f=fixture();Object.assign(f.cars[1],{remoteGrounded:false,engineStall:1});f.update();assert.equal(f.gain(5,'low'),0);assert.equal(f.gain(5,'load'),0);assert.equal(f.gain(5,'gravel'),0);
 Object.assign(f.cars[1],{remoteGrounded:true,engineStall:0});f.update(5,'hood');assert.ok(f.gain(5,'low')>0&&f.gain(5,'gravel')>0);
});
