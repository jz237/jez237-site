import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareNativeRaceResultCodeSelection as select,prepareNativeRetirementSupportProbe as probe} from '../native-race-body-fields.js';
import {createNativeRaceState,nativeRaceResultCodeView} from '../native-race-state.js';
const fixture=()=>({racerIndex:0,bodyResultCodes16c8:[-1,-1,-1,-1],raceWords1f94:Array(1693).fill(0),profileWordsB330:[...Array(50).fill(0),0x00010001,0x00010001],
 scene:{mode620:4,players:1,simulation648:2,primaryHumanIndex:0,secondaryHumanIndex:1,resultEffect393c:0},
 resultTableWords47fc:[0,4,1,2,3,6,0,1,2,3,4]});
const word=(q,a,v)=>q.raceWords1f94[(a-0x1f94)/4]=v>>>0;
const rec=(q,slot,offset,v)=>word(q,0x2938+slot*0x378+offset,v);
const write=(racerIndex,value)=>({kind:'bodyResultCodeWrite',racerIndex,value});

test('result selection preserves the one-time retained gate and canonical zero-simulation bypass',()=>{
 assert.deepEqual(select({racerIndex:2,bodyResultCodes16c8:[null,null,3]}).operations,[]);
 const q=fixture();q.scene.simulation648=0;
 const s=createNativeRaceState({...q,hudWords7788:Array(1442).fill(0)});
 assert.equal(nativeRaceResultCodeView(s).diagnostic.reason,'zero-simulation');
 assert.throws(()=>select({racerIndex:0,bodyResultCodes16c8:[-1]}),/raceWords/);
});

test('solo source results prioritize finish, distinguish record modes, and preserve table overwrite',()=>{
 const q=fixture();rec(q,0,0x2f4,1);rec(q,0,0x2ec,1);
 assert.deepEqual(select(q).operations,[write(0,4),write(0,3)]);
 q.profileWordsB330[50]=0x00000001;delete q.resultTableWords47fc;
 assert.deepEqual(select(q).operations,[write(0,4)]);
 q.scene.mode620=0;word(q,0x2650,1);assert.deepEqual(select(q).operations,[write(0,6)]);
 word(q,0x2650,2);assert.deepEqual(select(q).operations,[write(0,3)]);
 q.scene.mode620=11;
 for(const [place,code]of [[0,3],[1,1],[2,2],[-1,2]]){word(q,0x2928,place);assert.deepEqual(select(q).operations,[write(0,code)]);}
});

test('versus ties write secondary before primary and retain duplicate writes for aliased slots',()=>{
 const q=fixture();q.scene.players=2;
 rec(q,0,0x2f4,1);rec(q,1,0x2f4,1);rec(q,0,0x19c,47);rec(q,1,0x19c,47);
 assert.deepEqual(select(q).operations,[write(1,3),write(0,3)]);
 q.scene.secondaryHumanIndex=0;
 assert.deepEqual(select(q).operations,[write(0,3),write(0,3)]);
 q.scene.secondaryHumanIndex=1;rec(q,1,0x19c,48);rec(q,1,4,1);
 assert.deepEqual(select(q).operations,[write(0,1),write(1,2)]);
});

test('versus retirement handles both selected flags and the current body index without testing rendered crashes',()=>{
 const q=fixture();q.scene.players=2;rec(q,0,0x2ec,1);
 assert.deepEqual(select(q).operations,[write(0,4),write(1,1)]);
 rec(q,1,0x2ec,1);assert.deepEqual(select(q).operations,[write(1,3),write(0,3)]);
 rec(q,0,0x2ec,0);q.racerIndex=1;assert.deepEqual(select(q).operations,[write(0,1),write(1,4)]);
 q.scene.simulation648=1;q.scene.resultEffect393c=2;
 assert.deepEqual(select(q).operations,[write(1,1)]);
});

test('retirement support uses float32 point90, strict lower bound, floor-before-box and sixteen-unit steps',()=>{
 const q={point90Native:{x:1.00000007,y:10,z:-33.125},datum2458:0,queryReturns:[0,0,0,-0.25]};
 const out=probe(q);assert.equal(out.supported,true);
 assert.deepEqual(out.operations.map(o=>[o.consumer,o.positionNative.y]),[['8007f448',0],['8007fae4',0],['8007f448',-16],['8007fae4',-16]]);
 assert.equal(out.operations[0].positionNative.x,Math.fround(q.point90Native.x));
 assert.equal(probe({...q,point90Native:{...q.point90Native,y:-40},queryReturns:[]}).supported,false);
 assert.equal(probe({...q,queryReturns:[-1]}).operations.length,1);
 assert.throws(()=>probe({...q,queryReturns:[0]}),/query return/);
 assert.equal(probe({...q,queryReturns:Array(8).fill(0)}).supported,false);
});

test('solo retirement emits the reached queries before its result and never mutates shared owners',()=>{
 const q=fixture();rec(q,0,0x2ec,1);q.supportProbe={point90Native:{x:20,y:10,z:30},datum2458:0,queryReturns:[1]};
 const state=createNativeRaceState({...q,hudWords7788:Array(1442).fill(0)}),before=structuredClone(state);
 const result=nativeRaceResultCodeView(state,q);
 assert.equal(result.operations[0].kind,'supportProbeQuery');assert.deepEqual(result.operations.at(-1),write(0,4));
 assert.deepEqual(state,before);assert.deepEqual(q.bodyResultCodes16c8,[-1,-1,-1,-1]);
 assert.ok(Object.isFrozen(result.operations[0].positionNative));
 q.supportProbe.queryReturns=Array(8).fill(0);assert.deepEqual(select(q).operations.at(-1),write(0,5));
});
