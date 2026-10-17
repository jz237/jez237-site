import test from 'node:test';
import assert from 'node:assert/strict';
import {createRace,stepRace} from '../race-core.js';
import {beginGhostRace,recordGhostFrame,finishGhostRace,ghostMetadata,ghostKey,ghostCompatible,keepBestGhost,ghostSample,validateGhost,serializeGhost,importGhost,GHOST_SAMPLE_HZ,MAX_GHOST_SECONDS,MAX_GHOST_SAMPLES,MAX_GHOST_BYTES} from '../time-trial-ghost.js';

function state(){return {mode:'time',phase:'countdown',time:0,seaState:'course',waveSeed:17,difficulty:0,laps:3,course:{id:'greyhaven',layoutRevision:2,gates:[{},{}]},racers:[{id:0,human:true,x:1,z:3,heading:0,speed:0,turn:0,hydro:{y:2,pitch:0,roll:0},dq:'',finishTime:null,lap:1,next:1,passed:0,misses:0,lapTimes:[]}]};}
function complete(s){const r=s.racers[0];s.phase='results';r.finishTime=s.time;r.lapTimes=[s.time/3,s.time/3,s.time/3];r.lap=4;r.next=1;r.passed=6;}
function recording(duration=1,options={}){const s=state(),rec=beginGhostRace(s,options);s.phase='running';for(let i=1;i<=Math.round(duration*60);i++){s.time=i/60;s.racers[0].x=1+s.time*10;s.racers[0].z=3-s.time*2;s.racers[0].hydro.y=2+Math.sin(s.time);s.racers[0].hydro.pitch=Math.sin(s.time)*.2;s.racers[0].hydro.roll=Math.cos(s.time)*.3;recordGhostFrame(rec,s);}complete(s);return {s,rec,ghost:finishGhostRace(rec,s)};}

test('older custom seas remain importable but do not compete with depth-corrected water',()=>{
 const {ghost,s}=recording(),oldCustom=validateGhost({...ghost,setup:{...ghost.setup,seaState:'surf'}});
 s.seaState='surf';assert.equal(ghostCompatible(oldCustom,s),false);
 const current=validateGhost({...oldCustom,setup:{...oldCustom.setup,waterRevision:1}});
 assert.equal(ghostCompatible(current,s),true);
 s.seaState='course';assert.equal(ghostCompatible(ghost,s),true);
 assert.throws(()=>validateGhost({...ghost,setup:{...ghost.setup,waterRevision:-1}}));
});

test('records the full measured run at bounded frequency, including start and finish',()=>{
 const {s,rec,ghost}=recording(1.0333333333333);
 assert.ok(ghost);assert.equal(ghost.count,22);assert.equal(ghost.sampleHz,GHOST_SAMPLE_HZ);assert.equal(ghost.duration,s.time);assert.equal(rec.closed,true);
 const first=ghostSample(ghost,0),last=ghostSample(ghost,s.time);assert.equal(first.x,1);assert.equal(first.hydro.y,2);assert.ok(Math.abs(last.x-s.racers[0].x)<.006);assert.ok(Math.abs(last.hydro.y-s.racers[0].hydro.y)<.006);assert.ok(Math.abs(last.hydro.pitch-s.racers[0].hydro.pitch)<.00006);assert.ok(Math.abs(last.hydro.roll-s.racers[0].hydro.roll)<.00006);
 assert.equal(ghostSample(ghost,-.001),null);assert.equal(ghostSample(ghost,s.time+.001),null);assert.equal(recordGhostFrame(rec,s),false);assert.equal(finishGhostRace(rec,s),null);
});

test('playback interpolates recorded height and attitude and takes the short angle path',()=>{
 const s=state();Object.assign(s.racers[0],{heading:Math.PI-.02,speed:8,turn:.2});Object.assign(s.racers[0].hydro,{pitch:Math.PI-.04,roll:-Math.PI+.06});
 const rec=beginGhostRace(s);s.phase='running';s.time=.05;Object.assign(s.racers[0],{x:3,z:7,heading:-Math.PI+.02,speed:12,turn:-.2});Object.assign(s.racers[0].hydro,{y:4,pitch:-Math.PI+.04,roll:Math.PI-.06});recordGhostFrame(rec,s);complete(s);const ghost=finishGhostRace(rec,s),snapshot=structuredClone(s),p=ghostSample(ghost,.025);
 assert.equal(p.x,2);assert.equal(p.z,5);assert.equal(p.hydro.y,3);assert.equal(p.speed,10);assert.equal(p.turn,0);for(const v of [p.heading,p.hydro.pitch,p.hydro.roll])assert.ok(Math.abs(Math.abs(v)-Math.PI)<.0001);assert.deepEqual(s,snapshot);
});

test('countdown and pause add no frames; missing time, reset clocks and bad poses invalidate a run',()=>{
 const s=state(),rec=beginGhostRace(s);assert.equal(recordGhostFrame(rec,s),false);assert.equal(rec.frames.length,1);s.phase='paused';assert.equal(recordGhostFrame(rec,s),false);s.phase='running';s.time=.05;assert.equal(recordGhostFrame(rec,s),true);s.phase='paused';assert.equal(recordGhostFrame(rec,s),false);s.phase='running';s.time=.1;assert.equal(recordGhostFrame(rec,s),true);
 for(const mutate of [s=>s.time=.4,s=>s.time=-1,s=>s.racers[0].hydro.y=NaN,s=>s.course.layoutRevision++,s=>s.waveSeed++,s=>s.racers[0].dq='Five missed buoys']){const q=state(),r=beginGhostRace(q);q.phase='running';q.time=.05;mutate(q);assert.equal(recordGhostFrame(r,q),false);assert.ok(r.invalid);complete(q);assert.equal(finishGhostRace(r,q),null);}
});

test('only completed, non-demo time trials with all laps and checkpoints become ghosts',()=>{
 for(const mutate of [s=>s.phase='running',s=>s.mode='practice',s=>s.demoRun=true,s=>s.racers[0].dq='Course out',s=>s.racers[0].finishTime=null,s=>s.racers[0].lap=3,s=>s.racers[0].passed=5,s=>s.racers[0].next=0,s=>s.racers[0].misses=5,s=>s.racers[0].lapTimes=[.1,.1,.1]]){const s=state(),rec=beginGhostRace(s);s.phase='running';s.time=.05;recordGhostFrame(rec,s);complete(s);mutate(s);assert.equal(finishGhostRace(rec,s),null);}
 for(const change of [{mode:'practice'},{mode:'race'},{mode:'time',demoRun:true},{time:1},{phase:'results'}])assert.equal(beginGhostRace(Object.assign(state(),change)),null);
});

test('compatibility isolates course layout, class, lap count, sea, seed, rider and tuning',()=>{
 const tune={engine:.5,grip:-.25,handling:.75},{s,ghost}=recording(1,{tune});assert.ok(ghostCompatible(ghost,s,{tune}));assert.equal(ghostCompatible(ghost,s),false);assert.equal(ghostKey(ghostMetadata(s,{tune})),ghostKey(ghost.setup));
 for(const mutate of [s=>s.course.id='amber',s=>s.course.layoutRevision++,s=>s.difficulty++,s=>s.laps=4,s=>s.seaState='surf',s=>s.waveSeed++,s=>s.racers[0].id=1]){const changed=structuredClone(s);mutate(changed);assert.equal(ghostCompatible(ghost,changed,{tune}),false);}
 assert.equal(ghostCompatible(ghost,s,{tune:{...tune,engine:.500001}}),false);assert.equal(ghostCompatible({},s,{tune}),false);assert.throws(()=>ghostMetadata(s,{tune:{engine:Infinity}}));assert.throws(()=>ghostMetadata(s,{tune:{grip:'0'}}));
});

test('retains the best total time and refuses incompatible replacements',()=>{
 const slow=recording(2).ghost,fast=recording(1).ghost,tie=recording(1).ghost,other=recording(1,{tune:{engine:.5}}).ghost;
 assert.equal(keepBestGhost(slow,fast),fast);assert.equal(keepBestGhost(fast,slow),fast);assert.equal(keepBestGhost(fast,tie),fast);assert.equal(keepBestGhost(null,fast),fast);assert.throws(()=>keepBestGhost(fast,other),/incompatible/);assert.throws(()=>keepBestGhost(fast,{}));
});

test('portable compression round trips; imported objects are bounded and immutable',()=>{
 const ghost=recording(30).ghost,text=serializeGhost(ghost),copy=importGhost(text);assert.ok(ghost);assert.ok(text.length<ghost.count*35);assert.deepEqual(copy,ghost);assert.ok(Object.isFrozen(copy));assert.ok(Object.isFrozen(copy.setup.tune));assert.deepEqual(ghostSample(copy,12.025),ghostSample(ghost,12.025));
 const extra={...ghost,ignored:{payload:'x'.repeat(1000)},setup:{...ghost.setup,ignored:true}};assert.deepEqual(validateGhost(extra),ghost);assert.throws(()=>importGhost('x'.repeat(MAX_GHOST_BYTES+1)),/large/);assert.throws(()=>importGhost('{oops'),/JSON/);
});

test('rejects damaged, truncated, oversized and unsupported portable frame data',()=>{
 const ghost=recording(1).ghost;
 for(const change of [{format:'other'},{version:2},{sampleHz:60},{duration:NaN},{duration:MAX_GHOST_SECONDS+1},{count:1},{count:MAX_GHOST_SAMPLES+1},{count:ghost.count+1},{data:''},{data:'!!!!'},{data:ghost.data.slice(0,-4)},{data:ghost.data+'AAAA'},{data:'A'.repeat(MAX_GHOST_BYTES)},{duration:ghost.duration+.1}])assert.throws(()=>validateGhost({...ghost,...change}));
 for(const change of [{course:'../elsewhere'},{layoutRevision:1000},{difficulty:4},{laps:2},{seaState:'unknown'},{waveSeed:997},{rider:4},{tune:{handling:2}}])assert.throws(()=>validateGhost({...ghost,setup:{...ghost.setup,...change}}));
 const bad=Buffer.from(ghost.data,'base64');bad[0]=1;assert.throws(()=>validateGhost({...ghost,data:bad.toString('base64')}),/clock|bounds/);
 const overflow=Buffer.alloc(ghost.count*9*5,255);assert.throws(()=>validateGhost({...ghost,data:overflow.toString('base64')}),/delta/);
});

test('recording size and duration remain bounded without dropping the beginning',()=>{
 const s=state(),rec=beginGhostRace(s);s.phase='running';for(let i=1;i<=MAX_GHOST_SECONDS*GHOST_SAMPLE_HZ;i++){s.time=i/GHOST_SAMPLE_HZ;s.racers[0].x=Math.sin(i*.01)*100;s.racers[0].hydro.y=Math.sin(i*.03);recordGhostFrame(rec,s);}assert.ok(rec.frames.length<=MAX_GHOST_SAMPLES);assert.equal(rec.frames[0][0],0);complete(s);const ghost=finishGhostRace(rec,s);assert.ok(ghost);assert.ok(serializeGhost(ghost).length<=MAX_GHOST_BYTES);
 const over=state(),r=beginGhostRace(over);over.phase='running';over.time=MAX_GHOST_SECONDS+1;recordGhostFrame(r,over);assert.ok(r.invalid);complete(over);assert.equal(finishGhostRace(r,over),null);
});

test('hooks directly into createRace and its countdown without advancing physics on playback',()=>{
 const tune={engine:.5,handling:-.5},s=createRace({mode:'time',tune}),rec=beginGhostRace(s,{tune});assert.ok(rec);for(let i=0;i<240;i++){stepRace(s,{throttle:.5},1/60);recordGhostFrame(rec,s);}assert.equal(rec.invalid,null);assert.ok(rec.frames.length>=19&&rec.frames.length<=22);assert.equal(rec.frames[0][0],0);assert.ok(s.time>.9&&s.time<1.1);assert.equal(finishGhostRace(rec,s),null);
});
