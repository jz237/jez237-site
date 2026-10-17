import test from 'node:test';import assert from 'node:assert/strict';
import {ReplayRecorder,replayCarStride,encodeReplay,decodeReplay,replayFile,readReplayFile,type ReplayBurst} from '../src/replay-data';
import {ReplayBurstPlayback} from '../src/replay-burst-audio';
import {Sound} from '../src/audio';import {stockSetup} from '../src/garage';
const burst=(time:number):ReplayBurst=>({time,position:[2,3,4]});
function recorder(){
 const r=new ReplayRecorder({version:1,mode:'derby',reverse:false,thermalModel:1,cars:[{id:0,kind:'coupe',setup:stockSetup('coupe')}],props:0,created:'2026-10-16'});
 const values=new Float32Array(replayCarStride(r.meta));values[6]=1;values[14]=100;for(let i=0;i<4;i++)values[21+i*8]=1;
 r.capture(0,()=>values);r.capture(1,()=>values.slice());return r;
}
test('burst recordings survive compressed exports without aliasing or inventing old events',async()=>{
 const r=recorder(),e=burst(.1);r.burst(e);e.position[0]=999;assert.equal(r.bursts[0].position[0],2);
 const doc=r.document();doc.bursts![0].position[1]=999;assert.equal(r.bursts[0].position[1],3);
 const saved=r.document();assert.deepEqual(decodeReplay(encodeReplay(saved)),saved);assert.deepEqual(await readReplayFile(new File([await replayFile(saved)],'test.qir')),saved);
 delete saved.bursts;assert.equal(decodeReplay(encodeReplay(saved)).bursts,undefined);
});
test('malformed, unordered and over-limit bursts cannot enter playback',()=>{
 for(const e of [burst(NaN),burst(-1),burst(1801),{time:.1,position:[Infinity,0,0]},{time:.1,position:[0,1]}]){
  const r=recorder();r.burst(e);assert.equal(r.bursts.length,0);const doc=r.document();doc.bursts=[e];assert.throws(()=>decodeReplay(encodeReplay(doc)));
 }
 const r=recorder();r.burst(burst(.5));r.burst(burst(.4));assert.equal(r.bursts.length,1);
 for(const list of [[burst(.5),burst(.4)],new Array(50001).fill(burst(.5)),null]){const doc=r.document();doc.bursts=list as any;assert.throws(()=>decodeReplay(encodeReplay(doc)));}
 r.bursts.push(...new Array(49999).fill(burst(.5)));r.burst(burst(.6));assert.equal(r.limited,true);
});
test('forward replay drives real explosion layers and spatial source once; seek and pause stay silent',()=>{
 const sound=new Sound(),heard:any[]=[];sound.ready=true;sound.ctx={currentTime:0} as any;sound.shot=(...args:any[])=>heard.push(args);
 const p=new ReplayBurstPlayback([burst(.1),burst(.2)],sound);
 assert.equal(p.step(0,.1,true,false,true),1);assert.deepEqual(heard.map(e=>e[0]),['vehicle-burst','debris']);assert.deepEqual(heard[0][1].toArray(),[2,3,4]);assert.equal(heard[1][3].delay,.17);
 assert.equal(p.step(.1,.1,true,false,true),0);heard.length=0;
 for(const args of [[.1,.2,false,false,true],[.1,.2,false,true,true],[.2,0,true,false,true],[0,.2,true,false,false]]as const)assert.equal(p.step(...args),0);
 assert.deepEqual(heard,[]);p.step(0,.1,true,true,true);p.step(.1,.1,false,true,true);assert.equal(p.step(.1,.1,true,false,true),0);
 assert.equal(p.step(.1,.2,true,false,true),1);assert.equal(heard.length,2);
});
