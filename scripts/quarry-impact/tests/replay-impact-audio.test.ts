import test from 'node:test';import assert from 'node:assert/strict';
import {ReplayRecorder,replayCarStride,encodeReplay,decodeReplay,replayFile,readReplayFile,type ReplayImpact} from '../src/replay-data';
import {ReplayImpactPlayback} from '../src/replay-impact-audio';
import {Sound} from '../src/audio';import {stockSetup} from '../src/garage';
const impact=(time:number,extra:Partial<ReplayImpact>={}):ReplayImpact=>({time,severity:20,position:[2,3,4],glass:true,debris:true,...extra});
function recorder(){
 const r=new ReplayRecorder({version:1,mode:'derby',reverse:false,audioModel:1,cars:[{id:0,kind:'coupe',setup:stockSetup('coupe')}],props:0,created:'2026-10-16'});
 const values=new Float32Array(replayCarStride(r.meta));values[6]=1;values[14]=100;for(let i=0;i<4;i++)values[15+i*8+6]=1;
 r.capture(0,()=>values);r.capture(1,()=>values.slice());return r;
}
test('recorded collision sound events survive binary and compressed replay export with independent snapshots',async()=>{
 const r=recorder(),event=impact(.2);r.impact(event);event.position[0]=999;assert.equal(r.impacts[0].position[0],2);r.impact(impact(.2,{glass:false}));
 const doc=r.document();doc.impacts![0].position[1]=999;assert.equal(r.impacts[0].position[1],3);
 const saved=r.document();assert.deepEqual(decodeReplay(encodeReplay(saved)),saved);assert.deepEqual(await readReplayFile(new File([await replayFile(saved)],'test.qir')),saved);
 const legacy=r.document();delete legacy.impacts;assert.equal(decodeReplay(encodeReplay(legacy)).impacts,undefined);
});
test('invalid, unordered and oversized impact lists fail import; recorder rejects invalid data',()=>{
 for(const invalid of [impact(NaN),impact(-1),impact(1801),impact(.2,{severity:-1}),impact(.2,{severity:1001}),impact(.2,{position:[0,Infinity,0]}),impact(.2,{position:[0,1]}),impact(.2,{glass:1 as any}),impact(.2,{debris:null as any})]){
  const r=recorder();r.impact(invalid);assert.equal(r.impacts.length,0);const doc=r.document();doc.impacts=[invalid];assert.throws(()=>decodeReplay(encodeReplay(doc)));
 }
 const r=recorder();r.impact(impact(.5));r.impact(impact(.4));assert.equal(r.impacts.length,1);
 for(const list of [[impact(.5),impact(.4)],new Array(50001).fill(impact(.5)),null]){const doc=r.document();doc.impacts=list as any;assert.throws(()=>decodeReplay(encodeReplay(doc)));}
 r.impacts.push(...new Array(49999).fill(impact(.5)));r.impact(impact(.6));assert.equal(r.limited,true);assert.equal(r.impacts.length,50000);
});
test('forward playback emits actual layered sounds once, including glass, debris and final-frame impacts',()=>{
 const sound=new Sound(),heard:any[]=[];sound.shot=(...args:any[])=>heard.push(args);
 const playback=new ReplayImpactPlayback([impact(.1),impact(.2,{severity:3,glass:false,debris:false})],sound);
 assert.equal(playback.step(0,.1,true,false,true),1);assert.deepEqual(heard.map(h=>h[0]),['impact-heavy','glass','debris']);assert.deepEqual(heard[0][1].toArray(),[2,3,4]);
 heard.length=0;assert.equal(playback.step(.1,.15,true,false,true),0);assert.equal(playback.step(.15,.2,true,false,true),1);assert.equal(heard[0][0],'impact-light');
 assert.equal(playback.step(.2,.2,true,false,true),0);
});
test('pause, scrub, reverse, unavailable audio and photo mode never replay old impacts',()=>{
 const heard:number[]=[],playback=new ReplayImpactPlayback([impact(.1),impact(.2)],{impact:n=>heard.push(n)});
 for(const args of [[0,.2,false,false,true],[0,.2,false,true,true],[.2,0,true,false,true],[0,.2,true,false,false]]as const)assert.equal(playback.step(...args),0);
 assert.deepEqual(heard,[]);assert.equal(playback.step(.2,.22,true,false,true),0);
 assert.equal(playback.step(0,.1,true,true,true),0);assert.equal(playback.step(.1,.1,false,true,true),0);assert.equal(playback.step(.1,.1,true,false,true),0,'cancelled seek cannot spill historical sounds');
});
test('sliced reconstruction retains only its playback interval, with bounded catch-up for stalls and pileups',()=>{
 const heard:number[]=[],events=Array.from({length:100},(_,i)=>impact(i/100,{severity:i})),p=new ReplayImpactPlayback(events,{impact:n=>heard.push(n)});
 p.step(.1,.15,true,true,true);p.step(.15,.15,true,true,true);assert.equal(p.step(.15,.15,true,false,true),5);assert.deepEqual(heard,[11,12,13,14,15]);
 heard.length=0;assert.equal(p.step(.15,.99,true,false,true),8);assert.deepEqual(heard,[92,93,94,95,96,97,98,99]);
});
