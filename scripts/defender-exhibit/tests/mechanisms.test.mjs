import {test} from 'node:test';
import assert from 'node:assert/strict';
import {Vector3} from 'three';
import {buildDetailedCabinet} from '../model-detail.mjs';
import {harnessCurve,mechanismPose,speakerMix} from '../src/Mechanics.ts';
import {DefenderSound} from '../src/DefenderSound.ts';

test('service hinges preserve attachment points, leave the coin fascia and cashbox fixed, and move plug endpoints',()=>{
 const root=buildDetailedCabinet();root.updateMatrixWorld(true);
 const hinge=root.getObjectByName('coin_hinge'),plug=root.getObjectByName('coin_harness_plug'),fascia=root.getObjectByName('coin_fascia'),box=root.getObjectByName('coin_cashbox');
 const before=hinge.getWorldPosition(new Vector3()),plugBefore=plug.getWorldPosition(new Vector3()),fixed=[fascia,box].map(o=>o.getWorldPosition(new Vector3()));
 hinge.rotation.y=-1.28;root.updateMatrixWorld(true);
 assert(hinge.getWorldPosition(new Vector3()).distanceTo(before)<1e-8);
 assert(plug.getWorldPosition(new Vector3()).distanceTo(plugBefore)>.1);
 [fascia,box].forEach((o,i)=>assert(o.getWorldPosition(new Vector3()).distanceTo(fixed[i])<1e-8));
 const control=root.getObjectByName('controls_hinge'),button=root.getObjectByName('button_2');const point=button.getWorldPosition(new Vector3());control.rotation.x=-1.02;root.updateMatrixWorld(true);assert(button.getWorldPosition(new Vector3()).distanceTo(point)>.1);
 for(const t of [0,.25,.5,.75,1]){hinge.rotation.y=-1.28*t;control.rotation.x=-1.02*t;root.updateMatrixWorld(true);for(const [a,b]of [['coin_harness_plug','cabinet_coin_socket'],['control_harness_plug','cabinet_control_socket']]){const start=root.getObjectByName(a).getWorldPosition(new Vector3()),end=root.getObjectByName(b).getWorldPosition(new Vector3()),curve=harnessCurve(start,end);assert(curve.getPoint(0).distanceTo(start)<1e-8);assert(curve.getPoint(1).distanceTo(end)<1e-8);assert(curve.getLength()>start.distanceTo(end));}}
});
test('demonstrations release contacts and settle after their finite duration',()=>{
 assert(mechanismPose('button',.5).press>.99);assert.equal(mechanismPose('button',4).press,0);assert(mechanismPose('button',4).done);
 assert(mechanismPose('joystick',.5).joystick>0);assert(mechanismPose('joystick',1.5).joystick<0);assert.equal(mechanismPose('joystick',5).joystick,0);
 assert.equal(mechanismPose('coin',0).coin,0);assert.equal(mechanismPose('coin',3).coin,1);
});
test('speaker mix softens with distance and behind the cabinet while preserving left/right direction',()=>{
 const near=speakerMix(1,0,1),far=speakerMix(8,0,1),behind=speakerMix(1,0,-1);
 assert(near.gain>far.gain);assert(near.gain>behind.gain);assert(near.cutoff>behind.cutoff);
 assert(speakerMix(2,-.7,1).pan<0);assert(speakerMix(2,.7,1).pan>0);
 for(const d of [0,1,10,100])for(const side of [-2,0,2])for(const facing of [-1,0,1]){const mix=speakerMix(d,side,facing);assert(Object.values(mix).every(Number.isFinite));assert(mix.gain>=0&&mix.gain<=1);assert(Math.abs(mix.pan)<=.85);}
});
test('positional processing remains downstream of master mute and schedules smoothed changes',async()=>{
 const originalFetch=globalThis.fetch;globalThis.fetch=async()=>({ok:true,arrayBuffer:async()=>new ArrayBuffer(8)});
 const param=()=>({value:0,calls:[],setTargetAtTime(value,time,smoothing){this.value=value;this.calls.push({value,time,smoothing});}});
 const nodes=[];const node=()=>{const n={gain:param(),frequency:param(),pan:param(),connect(next){this.next=next;return next;},start(){},stop(){},disconnect(){},getFloatTimeDomainData(v){v.fill(0)}};nodes.push(n);return n;};
 const context={currentTime:1,state:'running',destination:{},createGain:node,createAnalyser:node,createStereoPanner:node,createBiquadFilter:node,createBufferSource:node,decodeAudioData:async()=>({duration:.1})};
 try{const sound=new DefenderSound(context);await sound.ready;sound.state(true,false,.25,false);const master=nodes[0];assert(master.gain.value>0);sound.spatial(speakerMix(4,.5,-1));sound.state(true,true,.25,false);assert.equal(master.gain.value,0);sound.spatial(speakerMix(1,-.5,1));assert.equal(master.gain.value,0,'moving the camera must not unmute audio');assert(nodes.some(n=>n.pan.calls.some(c=>c.smoothing>0)));assert(nodes.some(n=>n.frequency.calls.some(c=>c.value===15000)));}finally{globalThis.fetch=originalFetch;}
});
