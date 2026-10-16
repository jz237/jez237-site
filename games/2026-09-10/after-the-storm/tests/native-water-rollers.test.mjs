import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {createNativeWaterField,locateNativeWaterCell,createNativeWaterPatch,stepNativeWaterPatch,forceNativeWaterLine} from '../native-water-field.js';
import {createNativeWaterRoller,stampNativeWaterRoller} from '../native-water-rollers.js';
import {createRaceWater,advanceRaceWaterFrame,stepRaceWater,captureRaceWater,setRaceWater,activeRaceWaterHeight,raceWaterHeight} from '../race-water.js';
import {createRace,stepRace} from '../race-core.js';
import {getCourse} from '../courses.js';
import {createSourceSunsetCourse,SUNSET_NATIVE_GEOMETRY} from '../source-sunset-course.js';
import {polygonDistance} from '../classic-courses.js';
const fixture=JSON.parse(readFileSync(new URL('./fixtures/native-water-rollers.json',import.meta.url)));
const pattern=()=>{const f=createNativeWaterField();for(let i=0;i<49152;i++){f.heightQ[i]=i*73+17;f.velocityQ[i]=i*37-913;}return f;};
// Expected hashes came from the original instructions using the same prepared
// numeric initial field. They cover every height AND velocity, not snapshots of
// this implementation. No executable bytes or private files are read in tests.
const hash=f=>{const b=Buffer.alloc(49152*4);for(let i=0;i<49152;i++){b.writeInt16BE(f.heightQ[i],i*4);b.writeInt16BE(f.velocityQ[i],i*4+2);}return createHash('sha256').update(b).digest('hex');};
test('22 original-instruction oracles cover phase limits, pause, empty crests, oblique axes and toroidal seams',()=>{
 for(const q of fixture.cases){const f=pattern(),r=createNativeWaterRoller(q.row);r.phaseIndex=q.phaseBefore;
  stampNativeWaterRoller(f,r,{state72c:q.state72c});assert.equal(r.phaseIndex,q.phaseAfter);assert.equal(hash(f),q.gridSHA256);
 }
});
test('six original frames preserve overlapping-generator priority and independent phases',()=>{
 const f=pattern(),rs=fixture.overlapRows.map(createNativeWaterRoller);
 for(const q of fixture.overlapHistory){for(const r of rs)stampNativeWaterRoller(f,r);assert.deepEqual(rs.map(r=>r.phaseIndex),q.phases);assert.equal(hash(f),q.gridSHA256);}
});
test('inactive rows retain prior water, active zero crossings still erase velocity',()=>{
 const f=pattern(),r=createNativeWaterRoller([0,0,270,180,60,1,1,64,16,2,0,1,0]);
 r.phaseIndex=3000;const before=hash(f);assert.equal(stampNativeWaterRoller(f,r).activeRows,0);assert.equal(hash(f),before);
 r.phaseIndex=3904;assert.equal(stampNativeWaterRoller(f,r).activeRows,1);
 for(const i of locateNativeWaterCell(0,0).indices){assert.equal(f.heightQ[i],0);assert.equal(f.velocityQ[i],0);}
});
test('host stamps once after both human patches and pauses without consuming phase',()=>{
 const crafts=[{x:25,z:12.5,heading:0},{x:26,z:12.5,heading:0}],rows=fixture.overlapRows;
 const s=createRaceWater({crafts,baseAmplitudeNative:15,initialNoise:false,rollerRows:rows}),f=createNativeWaterField({players:2});
 advanceRaceWaterFrame(s,crafts);
 for(const q of s.lastPlan.forcing)forceNativeWaterLine(f,q);
 for(const q of s.lastPlan.patches)stepNativeWaterPatch(f,createNativeWaterPatch(f,q));
 for(const row of rows)stampNativeWaterRoller(f,createNativeWaterRoller(row));
 assert.deepEqual(s.field.heightQ,f.heightQ);assert.deepEqual(s.field.velocityQ,f.velocityQ);assert.ok(s.rollers.every(r=>r.frames===1));
 const before=structuredClone(s);stepRaceWater(s,crafts,1,{active:false});assert.deepEqual(s,before);
 const heights=s.field.heightQ.slice(),phases=s.rollers.map(q=>q.phaseIndex);
 advanceRaceWaterFrame(s,crafts,{simulationActive:false,rollerState72c:1});assert.deepEqual(s.field.heightQ,heights);assert.deepEqual(s.rollers.map(q=>q.phaseIndex),phases);
 advanceRaceWaterFrame(s,crafts,{simulationActive:false});assert.notDeepEqual(s.field.heightQ,heights);assert.notDeepEqual(s.rollers.map(q=>q.phaseIndex),phases);
});
test('prepared source-course setup selects class/mode rows and shares stamped surface with presentation',()=>{
 // These direct row centers are stationary diagnostic anchors, not an admitted
 // driving route. Public selection is checked separately below.
 const anchorsByClass=SUNSET_NATIVE_GEOMETRY.racePrimaryByClass.map(rows=>rows.map(q=>q.slice(0,2).map(v=>v*.025)));
 const source=createSourceSunsetCourse(polygonDistance,{anchorsByClass,stuntNavigation:{anchors:anchorsByClass[0]}});
 for(const difficulty of [0,1,2,3])for(const mode of ['time','versus','stunt']){
  const course={...getCourse('amber',difficulty),...source,difficulty,gates:[source.finishGatesByClass[difficulty],...source.buoysByClass[difficulty]],anchors:anchorsByClass[difficulty]};
  const s=createRace({course,difficulty,mode,seaState:'course'});
  assert.equal(s.raceWater.rollers.length,mode==='stunt'?3:difficulty===0?4:5);
  s.phase='running';for(let i=0;i<6;i++)stepRace(s,mode==='versus'?[{},{}]:{},1/60);
  assert.equal(s.raceWater.frames,2);assert.ok(s.raceWater.rollers.every(r=>r.frames===2));
  const sample=raceWaterHeight(s.raceWater,20,12.5),view=captureRaceWater(s.raceWater);setRaceWater(view);
  assert.equal(activeRaceWaterHeight(20,12.5),sample);
 }
 assert.equal(createRace({course:getCourse('amber',0),mode:'time',seaState:'course'}).raceWater.rollers.length,4,'public Normal Sunset selects the original four roller generators');
 assert.equal(createRace({course:getCourse('greyhaven',0),mode:'time',seaState:'course'}).raceWater.rollers.length,0);
 assert.equal(createRace({course:getCourse('amber',0),mode:'time',seaState:'surf'}).raceWater,null);setRaceWater(null);
});
test('malformed configuration fails before a field update',()=>{
 const f=pattern(),r=createNativeWaterRoller(fixture.overlapRows[0]),before=hash(f);
 assert.throws(()=>stampNativeWaterRoller(f,r,{state72c:NaN}));assert.equal(hash(f),before);assert.equal(r.phaseIndex,0);
 for(const row of [[],[...fixture.overlapRows[0].slice(0,9),0,0,1,0],fixture.overlapRows[0].map((v,i)=>i===5?-1:v)])assert.throws(()=>createNativeWaterRoller(row));
});
