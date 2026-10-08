import test from 'node:test';
import assert from 'node:assert/strict';
import {CAR_KINDS} from '../src/rules';
import {stockSetup} from '../src/garage';
import {COURSE_NAMES,resolveCourseId} from '../src/course-id';
import {DEFAULT_EVENT,readEventOptions} from '../src/event-rules';
import {DEFAULT_DEMO,readDemoOptions,nextDemoMode} from '../src/demo-session';
import {ReplayRecorder,decodeReplay,encodeReplay,replayFile,readReplayFile,replayCourseId,replayCarStride} from '../src/replay-data';
import {ReplayLibrary,defaultReplayName} from '../src/replay-library';

const course='ashford-autodrome-v1' as const;
function recording(reverse=false,tyreModel?:1){
 const recorder=new ReplayRecorder({version:1,mode:'race',reverse,cars:CAR_KINDS.map((kind,id)=>({id,kind,setup:stockSetup(kind)})),props:0,created:'2026-10-02T17:00:00Z',...(tyreModel?{tyreModel}:{}),courseId:course});
 const stride=replayCarStride(recorder.meta),frame=(x:number)=>{
  const values=new Float32Array(recorder.stride);
  for(let i=0;i<CAR_KINDS.length;i++){
   const o=i*stride;values[o]=x+i*4;values[o+1]=.9;values[o+6]=1;values[o+14]=100;
   for(let j=0;j<4;j++){values[o+21+j*8]=1;if(tyreModel){values[o+57+j*6]=1;values[o+60+j*6]=1;values[o+61+j*6]=1;}}
  }
  return values;
 };
 recorder.capture(0,()=>frame(0),true);recorder.capture(1,()=>frame(10),true);return recorder.document();
}

test('Ashford event and demo preferences persist independently across all supported choices',()=>{
 assert.equal(COURSE_NAMES[course],'Ashford Autodrome');assert.equal(resolveCourseId(course),course);
 for(const direction of ['forward','reverse','opposing'] as const)for(const race of ['laps','ordered','free','random'] as const){
  const event={...DEFAULT_EVENT,course,field:24,laps:5,direction,race};assert.deepEqual(readEventOptions(JSON.stringify(event)),event);
 }
 for(const loop of ['repeat','alternate','stop'] as const){
  const demo={...DEFAULT_DEMO,course,field:11,loop};const parsed=readDemoOptions(JSON.stringify(demo));assert.deepEqual(parsed,demo);
  assert.equal(nextDemoMode('race',loop),loop==='stop'?null:loop==='repeat'?'race':'derby');assert.deepEqual(parsed,demo);
 }
 assert.equal(resolveCourseId('ashford-autodrome-v2'),'quarry-v1');
 assert.equal(readEventOptions(JSON.stringify({...DEFAULT_EVENT,course:'ashford-autodrome-v2'})).course,undefined);
});

test('Ashford recordings retain all eleven cars, direction and wheel data through compressed export/import',async()=>{
 for(const reverse of [false,true])for(const model of [undefined,1] as const){
  const doc=recording(reverse,model),raw=encodeReplay(doc),loaded=await readReplayFile(new File([await replayFile(doc)],'ashford.qir'));
  assert.deepEqual(loaded,doc);assert.deepEqual(encodeReplay(decodeReplay(raw)),raw);assert.equal(replayCourseId(loaded.meta),course);
  assert.equal(loaded.frames[0].values.length,CAR_KINDS.length*(model?80:56));
  assert.equal(defaultReplayName(loaded),'Ashford Autodrome · Race · 2026-10-02 17:00:00');
  assert.deepEqual(loaded.meta.cars.map(c=>c.kind),CAR_KINDS);
 }
});

test('derby and unknown Ashford recordings reject before opening library storage',async()=>{
 let opened=0;const library=new ReplayLibrary({open(){opened++;throw Error('Unexpected storage mutation');}} as unknown as IDBFactory);
 for(const mode of ['derby'] as const){
  const doc=recording();doc.meta.mode=mode;const before=structuredClone(doc);
  assert.throws(()=>new ReplayRecorder(doc.meta),/circuit races/);assert.throws(()=>decodeReplay(encodeReplay(doc)),/circuit races/);
  await assert.rejects(library.save(doc),/circuit races/);await assert.rejects(library.import(new File([await replayFile(doc)],'invalid.qir')),/circuit races/);
  assert.deepEqual(doc,before);
 }
 const invalid=recording();(invalid.meta as any).courseId='ashford-autodrome-v2';await assert.rejects(library.save(invalid),/unsupported course/);
 assert.equal(opened,0);
});
