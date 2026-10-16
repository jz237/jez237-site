import test from 'node:test';import assert from 'node:assert/strict';import * as T from 'three';import R from '@dimforge/rapier3d-compat';
import {TrackAcousticProbe,trackReflectionMix,TrackReflections} from '../src/track-acoustics';
import {cameraObstruction} from '../src/demo-camera-visibility';import {buildFoundryPhysics} from '../src/foundry-arena';
await R.init();const total=(m:{taps:number[]})=>m.taps.reduce((a,b)=>a+b,0);
test('open areas stay dry, room reflections are bounded, bad hits remain silent',()=>{
 const p=new T.Vector3(0,1,0);assert.equal(total(trackReflectionMix(p,()=>null)),0);
 for(const distance of [0,NaN,Infinity,-2])assert.equal(total(trackReflectionMix(p,()=>distance)),0);
 const close=trackReflectionMix(p,()=>2),far=trackReflectionMix(p,()=>20);
 assert.ok(total(close)>total(far));assert.ok(total(close)<.32);assert.ok(close.cutoff<far.cutoff);
});
test('real Foundry walls reflect, centre remains open; sensors and other cars do not become acoustic rooms',()=>{
 const w=new R.World({x:0,y:0,z:0});buildFoundryPhysics(R,w);w.step();
 const probe=(a:T.Vector3,b:T.Vector3)=>cameraObstruction(w,a,b,undefined,true);
 try{
  assert.equal(total(trackReflectionMix(new T.Vector3(0,2,0),probe)),0);
  assert.ok(total(trackReflectionMix(new T.Vector3(0,1.7,48),probe))>.02);
  w.createCollider(R.ColliderDesc.cuboid(4,3,.1).setTranslation(0,2,4).setSensor(true));
  const body=w.createRigidBody(R.RigidBodyDesc.dynamic().setTranslation(0,2,-4));w.createCollider(R.ColliderDesc.cuboid(4,3,.1),body);w.step();
  assert.equal(total(trackReflectionMix(new T.Vector3(0,2,0),probe)),0);
  w.createCollider(R.ColliderDesc.cuboid(8,.2,8).setTranslation(0,5,0));w.step();
  const roof=trackReflectionMix(new T.Vector3(0,2,0),probe);assert.ok(total(roof)>.04);assert.ok(roof.cutoff<4200);
 }finally{w.free();}
});
test('probe budget is bounded and teleports/reset sample the new environment immediately',()=>{
 const p=new TrackAcousticProbe();let calls=0;const query=()=>{calls++;return null;};
 for(let i=0;i<120;i++)p.update(new T.Vector3(),1/60,query);
 assert.ok(calls<=81&&calls>=63,String(calls));const before=calls;p.update(new T.Vector3(100,0,0),1/60,query);assert.equal(calls,before+9);
 p.reset();p.update(new T.Vector3(),0,query);assert.equal(calls,before+18);
});
test('wet graph has no feedback, honors bus routing and disconnects every resource',()=>{
 const nodes:any[]=[];const param=()=>({value:0,setTargetAtTime(v:number){this.value=v;}});
 const make=(kind:string)=>{const n={kind,gain:param(),frequency:param(),pan:param(),delayTime:param(),edges:[]as any[],connect(o:any){this.edges.push(o);return o;},disconnect(o?:any){this.edges=o?this.edges.filter(e=>e!==o):[];}};nodes.push(n);return n;};
 const ctx={currentTime:0,createGain:()=>make('gain'),createBiquadFilter:()=>make('filter'),createDelay:()=>make('delay'),createStereoPanner:()=>make('pan')};
 const engine=make('engine'),fx=make('fx'),master=make('master');engine.connect(master);fx.connect(master);
 const reflection=new TrackReflections(ctx as any,[engine,fx]as any,master as any);reflection.update({taps:[.1,.05,0,.01],cutoff:3000});
 const walk=(node:any,visited=new Set<any>())=>{assert.ok(!visited.has(node),'feedback');for(const next of node.edges)walk(next,new Set([...visited,node]));};walk(engine);walk(fx);
 assert.equal(nodes.filter(n=>n.kind==='delay').length,4);assert.ok(nodes.some(n=>n.gain.value===.1));
 reflection.dispose();assert.deepEqual(engine.edges,[master]);assert.deepEqual(fx.edges,[master]);assert.ok(nodes.filter(n=>!['engine','fx'].includes(n.kind)).every(n=>!n.edges.length));
});
