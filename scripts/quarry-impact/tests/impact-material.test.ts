import test from 'node:test';import assert from 'node:assert/strict';import * as T from 'three';
import {colliderImpactMaterial} from '../src/impact-material';import {Sound} from '../src/audio';import {ReplayImpactPlayback} from '../src/replay-impact-audio';
import {ReplayRecorder,replayCarStride,encodeReplay,decodeReplay} from '../src/replay-data';import {stockSetup} from '../src/garage';
test('actual fixed colliders use their authored material, with dynamic and unknown contacts retaining metal',async()=>{
 const {default:R}=await import('@dimforge/rapier3d-compat');await R.init();const world=new R.World({x:0,y:0,z:0});
 try{for(const [i,material]of ['concrete','stripe','timber','rubber','steel'].entries()){
  const body=world.createRigidBody(R.RigidBodyDesc.fixed().setTranslation(i*5,2,0)),collider=world.createCollider(R.ColliderDesc.cuboid(1,2,1),body),records=[{x:i*5,y:2,z:0,material}];
  assert.equal(colliderImpactMaterial(world,collider.handle,records),['concrete','concrete','wood','rubber','metal'][i]);
  assert.equal(colliderImpactMaterial(world,collider.handle,[{...records[0],x:records[0].x+.1}]),'metal','nearby decoration must not classify a different collider');
 }
 const body=world.createRigidBody(R.RigidBodyDesc.dynamic().setTranslation(0,2,0)),collider=world.createCollider(R.ColliderDesc.cuboid(1,1,1),body);assert.equal(colliderImpactMaterial(world,collider.handle,[{x:0,y:2,z:0,material:'timber'}]),'metal');
 }finally{world.free();}
});
test('body impacts change tone while glass and debris keep their own layers',()=>{
 const sound=new Sound(),heard:any[]=[];sound.shot=(...args:any[])=>heard.push(args);
 sound.impact(20,new T.Vector3(),true,true);const original=heard.splice(0);
 for(const material of ['concrete','wood','rubber']as const){sound.impact(20,new T.Vector3(),true,true,material);const layers=heard.splice(0);assert.equal(layers.length,3);assert.ok(layers[0][3].lowpass>0);assert.notEqual(layers[0][3].rate,original[0][3].rate);assert.deepEqual(layers.slice(1),original.slice(1));}
});
test('material survives replay roundtrip and playback; legacy omission and invalid values are handled',()=>{
 const r=new ReplayRecorder({version:1,mode:'derby',reverse:false,audioModel:1,cars:[{id:0,kind:'coupe',setup:stockSetup('coupe')}],props:0,created:'2026-10-16'}),values=new Float32Array(replayCarStride(r.meta));values[6]=1;values[14]=100;for(let i=0;i<4;i++)values[15+i*8+6]=1;r.capture(0,()=>values);r.capture(1,()=>values.slice());
 const base={time:.2,severity:20,position:[1,2,3],glass:false,debris:false};r.impact({...base,material:'wood'});r.impact({...base,time:.3});
 const decoded=decodeReplay(encodeReplay(r.document()));assert.equal(decoded.impacts![0].material,'wood');assert.equal('material'in decoded.impacts![1],false);
 const heard:any[]=[];new ReplayImpactPlayback(decoded.impacts!,{impact:(...args)=>heard.push(args)}).step(.1,.3,true,false,true);assert.equal(heard[0][4],'wood');assert.equal(heard[1][4],undefined);
 const invalid=r.document();invalid.impacts![0].material='constructor' as any;assert.throws(()=>decodeReplay(encodeReplay(invalid)));
});
test('material filter is connected and released with its voice',()=>{
 const sound=new Sound(),nodes:any[]=[];const node=()=>{const n:any={links:[],disconnected:false,connect(to:any){this.links.push(to);return to;},disconnect(){this.disconnected=true;}};nodes.push(n);return n;};
 const param=()=>({value:0,setValueAtTime(){},exponentialRampToValueAtTime(){}});let source:any,filter:any,gain:any,pan:any;
 sound.ctx={currentTime:0,createBufferSource(){return source=Object.assign(node(),{playbackRate:param(),start(){},stop(){}});},createBiquadFilter(){return filter=Object.assign(node(),{frequency:param(),Q:param()});},createGain(){return gain=Object.assign(node(),{gain:param()});},createPanner(){return pan=Object.assign(node(),{positionX:param(),positionY:param(),positionZ:param()});}}as any;sound.fxBus=node();sound.ready=true;sound.buffers.set('impact-heavy',{duration:2}as any);
 sound.impact(20,new T.Vector3(),false,false,'wood');assert.equal(filter.type,'lowpass');assert.equal(filter.frequency.value,2200);assert.equal(source.links[0],filter);assert.equal(filter.links[0],gain);assert.equal(gain.links[0],pan);source.onended();assert.ok(filter.disconnected);assert.equal(sound.activeVoices,0);
});

test('all real Foundry collision barriers resolve as concrete',async()=>{
 const {default:R}=await import('@dimforge/rapier3d-compat');await R.init();const {buildFoundryPhysics,FOUNDRY_BARRIERS}=await import('../src/foundry-arena');const world=new R.World({x:0,y:-9.81,z:0});
 try{buildFoundryPhysics(R,world);let concrete=0;world.forEachCollider(c=>{if(colliderImpactMaterial(world,c.handle,FOUNDRY_BARRIERS)==='concrete')concrete++;});assert.equal(concrete,FOUNDRY_BARRIERS.length);}finally{world.free();}
});
