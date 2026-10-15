import test from 'node:test';
import assert from 'node:assert/strict';
import {createNativePrimaryStandingsLayout,createNativePrimaryStandingsState,prepareNativePrimaryStandings} from '../native-primary-standings.js';
import {createNativeRaceRankingState,prepareNativeRaceStandings} from '../native-race-ranking.js';
import {createNativeAIRoute} from '../native-ai-route.js';
import {createNativeAITargetTable,prepareNativeAITarget} from '../native-ai-target.js';
import {prepareNativeAIContext} from '../native-ai-context.js';
import {createNativeAIDriverState,prepareNativeAIDriver} from '../native-ai-driver.js';
import {createNativeWaterField} from '../native-water-field.js';

const all=[[-30000,30000,-30000,30000]];
function layout({count=2,nodes,regionsNative=all,fortressRegionsNative=[]}={}){
 nodes??=Array.from({length:count},(_,i)=>({sourceRow:i,positionNativeXZ:{x:0,z:1000*i},forwardXZ:{x:0,z:1},
  nextSourceRow:(i+1)%count,previousSourceRow:(i+count-1)%count,classification:i===0?3:1,routeGroupC0:0}));
 return createNativePrimaryStandingsLayout({nodes,regionsNative,fortressRegionsNative});
}
const state=(extra={})=>createNativePrimaryStandingsState({legalLapCounter2c58:1,finishSide2c5c:0,progressRow2940:1,metric2c64:123.25,projectionDistance39a0:-37.5,...extra});
const sample=(extra={})=>({state638:1,courseIndex:1,lap2938:1,postJudgeSourceRow2c48:0,finishSourceRow:0,primaryCount:2,
 positionNativeXZ:{x:0,z:250},finished2c2c:0,record2c24:0,...extra});

test('source legal lap and fractional progress are separate from AI navigation and HUD route percentages',()=>{
 const r=prepareNativePrimaryStandings(layout(),state(),sample());
 assert.deepEqual(r.state,{legalLapCounter2c58:1,finishSide2c5c:1,progressRow2940:0,metric2c64:1000.25,projectionDistance39a0:250});
 assert.deepEqual(r.diagnostic.walkedRows,[0]);assert.equal(r.diagnostic.fractionNative,.25);
});
test('finish plane history admits one forward legal-lap increment and exact zero belongs to the nonpositive side',()=>{
 const set=layout(),s=state({legalLapCounter2c58:0});
 const first=prepareNativePrimaryStandings(set,s,sample());assert.equal(first.state.legalLapCounter2c58,1);
 assert.equal(prepareNativePrimaryStandings(set,first.state,sample()).state.legalLapCounter2c58,1);
 const zero=prepareNativePrimaryStandings(set,first.state,sample({positionNativeXZ:{x:0,z:0}}));
 assert.equal(zero.state.finishSide2c5c,0);assert.equal(zero.state.legalLapCounter2c58,0);
});
test('backward legal-lap history stops at minus50 and interprets any prior nonzero side word',()=>{
 for(const [legalLapCounter2c58,expected]of[[-49,-50],[-50,-50],[-100,-100]]){
  const r=prepareNativePrimaryStandings(layout(),state({legalLapCounter2c58,finishSide2c5c:-7}),sample({positionNativeXZ:{x:0,z:-10}}));
  assert.equal(r.state.legalLapCounter2c58,expected);assert.equal(r.state.finishSide2c5c,0);
 }
});
test('course2 has the source longer next-link finish neighborhood',()=>{
 const set=layout({count:5}),s=state({legalLapCounter2c58:0});
 const q=sample({primaryCount:5,finishSourceRow:4,positionNativeXZ:{x:0,z:4100}});
 const ordinary=prepareNativePrimaryStandings(set,s,q),extended=prepareNativePrimaryStandings(set,s,{...q,courseIndex:2});
 assert.equal(ordinary.diagnostic.nearFinish,false);assert.equal(ordinary.state.legalLapCounter2c58,0);
 assert.equal(extended.diagnostic.nearFinish,true);assert.equal(extended.state.legalLapCounter2c58,1);
});
test('coarse overlap compares only source first and last region matches, with inclusive boundaries',()=>{
 const regionsNative=[[-100,-25,-100,100],[-100,100,-100,100],[-100,-25,-100,100]];
 const q=sample({positionNativeXZ:{x:-100,z:10}}),s=state({legalLapCounter2c58:0});
 const first=prepareNativePrimaryStandings(layout({regionsNative}),s,q);
 assert.equal(first.diagnostic.finishRegionShared,false);assert.equal(first.state.legalLapCounter2c58,0);assert.equal(first.state.finishSide2c5c,1);
 const last=prepareNativePrimaryStandings(layout({regionsNative:[...regionsNative,[-100,100,-100,100]]}),s,q);
 assert.equal(last.diagnostic.finishRegionShared,true);assert.equal(last.state.legalLapCounter2c58,1);
});
test('backtracking is bounded by the supplied primary count and does not invent a positive segment',()=>{
 const set=layout({count:5}),q=sample({primaryCount:2,positionNativeXZ:{x:0,z:-10}});
 const r=prepareNativePrimaryStandings(set,state(),q);
 assert.deepEqual(r.diagnostic.walkedRows,[0,4]);assert.equal(r.state.progressRow2940,3);assert.equal(r.state.metric2c64,1030);
 const zero=prepareNativePrimaryStandings(set,state(),{...q,primaryCount:0});
 assert.deepEqual(zero.diagnostic.walkedRows,[]);assert.equal(zero.state.progressRow2940,0);assert.equal(zero.state.metric2c64,1000);
});
test('source projection has an upper clamp and retains negative fractions',()=>{
 const upper=prepareNativePrimaryStandings(layout(),state(),sample({positionNativeXZ:{x:0,z:2000}}));
 assert.equal(upper.diagnostic.fractionNative,1);assert.equal(upper.state.metric2c64,1001);
 const nodes=structuredClone(layout().nodes);nodes[1].positionNativeXZ.z=-1000;
 const negative=prepareNativePrimaryStandings(layout({nodes}),state({legalLapCounter2c58:0}),sample({lap2938:0,positionNativeXZ:{x:0,z:100}}));
 assert.equal(negative.diagnostic.fractionNative,Math.fround(-.1));assert.equal(negative.state.metric2c64,Math.fround(-.1));
});
test('zero-length primary segment keeps the source zero length and projection',()=>{
 const nodes=structuredClone(layout().nodes);nodes[1].positionNativeXZ.z=0;
 const r=prepareNativePrimaryStandings(layout({nodes}),state(),sample());
 assert.equal(r.diagnostic.segmentLengthNative,0);assert.equal(r.state.metric2c64,1000);assert.equal(r.state.projectionDistance39a0,0);
});
test('integer metric prefix wraps as signed32 before float32 conversion',()=>{
 const set=layout(),q=sample({lap2938:0});
 assert.equal(prepareNativePrimaryStandings(set,state({legalLapCounter2c58:2147483647,finishSide2c5c:1}),q).state.metric2c64,-999.75);
 assert.equal(prepareNativePrimaryStandings(set,state({legalLapCounter2c58:-2147483648,finishSide2c5c:1}),q).state.metric2c64,.25);
});
test('finished or disqualified records retain metric and distance while legal history and progress row update',()=>{
 const set=layout(),s=state({legalLapCounter2c58:0});
 for(const extra of[{finished2c2c:1,record2c24:undefined},{record2c24:-1}]){
  const r=prepareNativePrimaryStandings(set,s,sample(extra));
  assert.equal(r.state.legalLapCounter2c58,1);assert.equal(r.state.progressRow2940,0);assert.equal(r.state.metric2c64,123.25);assert.equal(r.state.projectionDistance39a0,-37.5);
 }
});
test('inactive main state or training resets source metric fields without reading an ordinary sample',()=>{
 const set=layout(),s=state({legalLapCounter2c58:-5,finishSide2c5c:2});
 for(const q of[{state638:8,courseIndex:1},{state638:1,courseIndex:0}]){
  const r=prepareNativePrimaryStandings(set,s,q);
  assert.deepEqual(r.state,{legalLapCounter2c58:-5,finishSide2c5c:2,progressRow2940:0,metric2c64:0,projectionDistance39a0:0});
 }
});
test('current displaced centers are complete copied inputs without changing compiled geometry',()=>{
 const set=layout(),s=state(),q=sample({nodePositionsNative:[{sourceRow:1,x:0,z:1100},{sourceRow:0,x:0,z:100}]});
 const before=structuredClone({set,s,q}),r=prepareNativePrimaryStandings(set,s,q);
 assert.equal(r.state.projectionDistance39a0,150);assert.equal(r.state.metric2c64,1000.1500244140625);
 assert.deepEqual({set,s,q},before);assert.ok(Object.isFrozen(r)&&Object.isFrozen(r.diagnostic.walkedRows));
 assert.throws(()=>prepareNativePrimaryStandings(set,s,{...q,nodePositionsNative:q.nodePositionsNative.slice(1)}),/complete/);
});
test('Fortress alternate region changes the segment reference but retains the original craft-to-node delta',()=>{
 const points=[[0,0],[800,1200],[-1000,1700],[-900,-1100]],axes=[[0,1],[.6,.8],[0,-1],[1,0]];
 const nodes=points.map(([x,z],i)=>({sourceRow:i,positionNativeXZ:{x,z},forwardXZ:{x:axes[i][0],z:axes[i][1]},
  nextSourceRow:(i+1)%4,previousSourceRow:(i+3)%4,classification:[3,4,1,0][i],routeGroupC0:i===1?1:0}));
 const q=sample({courseIndex:3,postJudgeSourceRow2c48:1,primaryCount:4,positionNativeXZ:{x:1001,z:1600}});
 const r=prepareNativePrimaryStandings(layout({nodes,fortressRegionsNative:[[1000,1200,1500,1700]]}),state(),q);
 assert.equal(r.state.progressRow2940,1);assert.equal(r.state.metric2c64,1010.1231079101562);assert.equal(r.state.projectionDistance39a0,242.86264038085938);
 const ordinary=prepareNativePrimaryStandings(layout({nodes}),state(),q);assert.ok(ordinary.state.projectionDistance39a0<0);
});
test('invalid geometry or sample fails without mutating retained state or positions',()=>{
 const set=layout(),s=state(),q=sample(),before=structuredClone({set,s,q});
 assert.throws(()=>prepareNativePrimaryStandings({...set},s,q),/compiled/);
 assert.throws(()=>prepareNativePrimaryStandings(set,s,{...q,positionNativeXZ:{x:Infinity,z:0}}),/float32/);
 assert.throws(()=>prepareNativePrimaryStandings(set,s,{...q,primaryCount:3}),/primaryCount/);
 assert.throws(()=>layout({regionsNative:[[-1,-1,0,0]]}),/sentinel/);
 assert.deepEqual({set,s,q},before);
});
test('completed primary metrics feed one rank phase and the next actual AI inputs use slot-zero power and the selected human independently',()=>{
 // Coherent synthetic primary/AI table and explicit prepared physical records.
 // This exercises numeric producer boundaries, not source startup or a race.
 const set=layout(),positions=[100,800,400,200],avatars=[2,0,1,3],roles=[0,1,-1,2];
 const nodes=set.nodes.map(n=>({sourceRow:n.sourceRow,x:0,z:n.positionNativeXZ.z*.025,tx:0,tz:1,
  classification:n.classification,routeGroup:0,halfWidthNative:n.classification===3?500:0,suppressed:false}));
 const table=createNativeAITargetTable({route:createNativeAIRoute({nodes,courseIndex:1}),nodes});
 const primary=positions.map(z=>prepareNativePrimaryStandings(set,state(),sample({positionNativeXZ:{x:0,z}})).state);
 const ranked=prepareNativeRaceStandings(createNativeRaceRankingState({orderByPlace:[0,1,2,3],records:primary.map((s,i)=>({metric2c64:s.metric2c64,
  place293c:i,finished2c2c:0,record2c24:0,reconciled2c3c:0,finishTime2ad4:0}))}),
  {activity624:-1,mainState638:1,mode620:4,phase650:3,flag1fd4:0,racerCount:4,primaryHumanIndex:2});
 assert.deepEqual(ranked.state.orderByPlace,[1,2,3,0]);assert.deepEqual(ranked.state.records.map(r=>r.place293c),[3,0,1,2]);
 const racers=positions.map((z,i)=>{
  const positionNative={x:0,y:10,z},target=prepareNativeAITarget(table,{avatar:avatars[i],navigationSourceRow:0,positionNativeXZ:positionNative});
  const d=target.targetDirectionXZ;
  return {body:{positionNative,motionDirection:{x:d.x,y:0,z:d.z},forwardNative:{x:d.x,y:0,z:d.z},rightNative:{x:d.z,y:0,z:-d.x},bodyUpY:1,
   steeringDegrees:30,actorState:22,pendingActorState:-1,animationFrame:0,priorControlActive:true,markedBox15de:0,fieldC7c:8,
   floorImpactNative:0,impactNormalNative:{x:0,y:0,z:0},rawXNative:0,heldButtons:0,powerFactor:1,frameSpeedNative:20,action16f4:0,actionState16d4:0},
   record:{...ranked.state.records[i],sourceLap:1,navigationSourceRow:0}};
 });
 const waterField=createNativeWaterField(),globals={state650:3,state638:1,mode620:4,difficulty:1,courseIndex:1,reverse:false,players:1,primaryHumanIndex:2,
  datumNative:0,toggleD9914:0,trainingSelection:0,previousNavigationGlobal:0,chargeTimerNative:0};
 const geometry={selectionCircleNative:{x:100000,z:100000,radiusSquared:0},proximityObjectCentersNative:[],proximityCount:0,
  cameraCornersNative:[{x:-5000,z:-5000},{x:-5000,z:5000},{x:5000,z:-5000},{x:5000,z:5000}]};
 const powers=[];
 for(let i=0;i<4;i++){
  const context=prepareNativeAIContext({primary:table},{...globals,cityRouteFlag74:0,recordFamily:'primary',avatar:avatars[i],navigationSourceRow:0});
  const s=createNativeAIDriverState({racerIndex:i,avatar:avatars[i],role:roles[i],turnBudgetDegrees:32,
   motionState:{previousMotionDirection:{...racers[i].body.motionDirection},recoveryPhase:0,stuckFrames:0,dryMarkedContact:0,offCircleBehindFrames:0,flagB0:0,flagB4:1},
   courseEscapeFrames:0,courseEscapeActive:false,dryFloorFrames:0,fieldE0:0,flag94:0,lastRawXNative:0});
  const result=prepareNativeAIDriver(context.table,s,{globals,racers,geometry,waterField,behindThresholdNative:roles[i]===-1?40:undefined});
  assert.ok(Math.abs(result.frame.steering.rawXNative)<=56);powers.push(result.controls.basePowerFactor);
  assert.equal(result.state.motionState.offCircleBehindFrames,i===0||i===3?1:0);
 }
 assert.deepEqual(powers,[1,Math.fround(.8),Math.fround(.9),Math.fround(.7)]);
 assert.deepEqual(ranked.state.records.map(r=>r.place293c),[3,0,1,2]);
});
