import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {getCourse} from '../courses.js';
import {createNativeRaceCourseRuntime} from '../native-race-course-runtime.js';
import {createNativeRaceLaunchRuntime} from '../native-race-launch-runtime.js';
import {createNativeAIRouteState,stepNativeAIRoute} from '../native-ai-route.js';
import {prepareNativeAITarget} from '../native-ai-target.js';
import {createRace} from '../race-core.js';
import {stepNativeRaceHost} from '../native-race-host.js';
import {nativeAIBodyFields} from '../native-ai-body-fields.js';
const fixture=JSON.parse(readFileSync(new URL('./fixtures/native-southern-ai-families.json',import.meta.url),'utf8'));
const base=(0x2938-0x1f94)/4,pointers={primary:0x801aee20,secondary:0x801b2f20,tertiary:0x801b7020};
function setup(difficulty=0,players=1){
 const course=getCourse('tempest',difficulty),courseRuntime=createNativeRaceCourseRuntime({course,difficulty,players});
 const racers=Array.from({length:players},(_,id)=>({id,lap:0,grid:id,power:0,misses:0}));
 const args={course,courseRuntime,courseIndex:7,players,racers};
 return {...args,owner:createNativeRaceLaunchRuntime(args)};
}
function retained(setup,family,extra={}){
 const initialState=setup.owner.snapshot();initialState.raceWords1f94[base+212]=pointers[family];Object.assign(initialState.scene,extra);
 return createNativeRaceLaunchRuntime({...setup,initialState});
}

test('all50180 Southern initialized route words match16 prepared original executions',()=>{
 assert.equal(fixture.cases.length,16);let words=0;
 for(const q of fixture.cases){
  const {courseRuntime}=setup(q.difficulty,q.mode620===1?2:1),data=courseRuntime.aiFamilies[q.family].data;
  assert.equal(data.finishSourceRow,q.finishSourceRow);
  assert.deepEqual(data.recordWordsBySourceRow,q.recordWordsBySourceRow,q.difficulty+' '+q.family+' '+q.mode620);
  words+=data.recordWordsBySourceRow.length*65;
 }
 assert.equal(words,50180);
});

test('Southern route selector matches48 original cases without rewriting retained family',()=>{
 assert.equal(fixture.selectors.length,48);
 for(const q of fixture.selectors){
  const s=setup(2,q.mode620===1?2:1),owner=retained(s,q.retainedFamily,{main638:q.main638,mode620:q.mode620}),before=owner.snapshot();
  assert.equal(owner.aiFamilyFor(0).family,q.selectedFamily);assert.deepEqual(owner.snapshot(),before);
 }
 const s=setup(),bad=s.owner.snapshot();bad.raceWords1f94[base+212]=123;
 const owner=createNativeRaceLaunchRuntime({...s,initialState:bad});assert.throws(()=>owner.aiFamilyFor(0),/selected initialized/);assert.deepEqual(owner.snapshot(),bad);
});

test('Southern alternate targets retain each initialized axis, endpoint and avatar link',()=>{
 for(let difficulty=0;difficulty<4;difficulty++){
  const {courseRuntime}=setup(difficulty);
  for(const [name,f]of Object.entries(courseRuntime.aiFamilies)){
   assert.equal(f.route.family,name);assert.equal(f.targetTable.family,name);
   assert.equal(f.data.nodes.length,courseRuntime.data.nodes.length);
   for(const n of f.targetTable.nodes){
    const source=f.data.nodes[n.sourceRow],w=f.data.recordWordsBySourceRow[n.sourceRow];
    assert.deepEqual(n.forwardXZ,source.forwardXZ);assert.deepEqual(n.endpointPlusNativeXZ,source.endpointANativeXZ);assert.deepEqual(n.endpointMinusNativeXZ,source.endpointBNativeXZ);
    for(let avatar=0;avatar<4;avatar++){assert.equal(n.nextByAvatar[avatar],w[0xcc/4+avatar]);assert.equal(n.previousByAvatar[avatar],w[0xf4/4+avatar]);}
   }
  }
  assert.notDeepEqual(courseRuntime.aiFamilies.secondary.targetTable.nodes,courseRuntime.aiFamilies.primary.targetTable.nodes);
 }
});

test('alternate navigation uses its own centers and changes only the canonical navigation row',()=>{
 for(let difficulty=0;difficulty<4;difficulty++)for(const family of ['secondary','tertiary'])for(let avatar=0;avatar<4;avatar++){
  const s=setup(difficulty),owner=retained(s,family),before=owner.snapshot(),f=owner.aiFamilyFor(0),row=owner.aiRecords()[0].navigationSourceRow;
  const node=f.route.nodes[row],body={avatar,position:{x:node.x+node.tx*2,z:node.z+node.tz*2}};
  const expected=stepNativeAIRoute(f.route,createNativeAIRouteState(f.route,{avatar,navigationSourceRow:row}),{position:body.position});
  owner.advanceNavigation({bodiesBySlot:[body],nodePositions:[{sourceRow:999,x:NaN,z:NaN}]});
  const after=owner.snapshot();assert.equal(after.raceWords1f94[base+4],expected.state.navigationSourceRow);
  before.raceWords1f94[base+4]=expected.state.navigationSourceRow;assert.deepEqual(after,before);
 }
});

test('live AI aiming follows the retained Southern family and ignores primary motion samples',()=>{
 const craft=createRace({course:getCourse('greyhaven'),mode:'time',physics:'native'});
 stepNativeRaceHost(craft.nativeHost,.05,[{}]);const body=nativeAIBodyFields(craft.nativeHost.world.adapters[0]);
 for(const family of ['secondary','tertiary']){
  const s=setup(),owner=retained(s,family,{phase650:3});
  owner.initializeAI({hullProfilesB64:[0,0,0,0],avatarsB68:[0,0,0,0],objectTypes4c:[]});
  const record=owner.aiRecords()[0],f=owner.aiFamilyFor(0);
  const expected=prepareNativeAITarget(f.targetTable,{avatar:0,navigationSourceRow:record.navigationSourceRow,positionNativeXZ:body.positionNative,sourceLap:record.sourceLap});
  const result=owner.sampleAI(0,{bodiesBySlot:[body],waterField:craft.raceWater.field,geometry:{
   selectionCircleNative:{x:0,z:0,radiusSquared:100000000},proximityObjectCentersNative:[],nodePositionsNative:[{sourceRow:999,x:NaN,z:NaN}]}});
  assert.equal(result.frame.phase,'driving');assert.deepEqual(result.frame.target,expected);
 }
});
