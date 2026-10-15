import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareNativeRacePrestartInitialization as initialize,prepareNativeRacePrestartStatus as status,
 prepareNativeRacePrestartStage as stage} from '../native-race-prestart-stage.js';

const ii=a=>(a-0x9440)/4,hi=a=>(a-0x7788)/4,pi=a=>(a-0xb330)/4,ri=(slot,offset)=>(0x2938-0x1f94)/4+slot*222+offset/4;
const write=(kind,byteOffset,value)=>({kind,byteOffset,width:4,value:value>>>0});
const sw=(field,value)=>({kind:'sourceWordWrite',field,value:value>>>0});
const sh=(field,value)=>({kind:'sourceHalfwordWrite',field,value:value&65535});
const call=(consumer,args=[])=>({kind:'externalCall',consumer,arguments:args});
function fixture(){
 const v={i1Words9440:Array(168).fill(0),hudWords7788:Array(1442).fill(0),raceWords1f94:Array(1693).fill(0),profileWordsB330:Array(50).fill(0),
  scene:{gameStateAb24:40,players:1,courseIndex:1,specialAb64:0,mode608:0,participantCount60e:4,mode620:0,activity624:-1,event628:0,
   returnState630:2,initLatch63c:0,phase650:0,simulation648:0,result6f0:0,restart6f8:0,ready6fc:0,missesEnabled72e:1,primaryHumanIndex:0,secondaryHumanIndex:1},
  externalReturns:{'8009328c':0x81000000,'801e5554':0x81000020,'802c6b38':0x81000040,'802c6bd8':0x81000060}};
 v.i1Words9440[ii(0x9440)]=0xffffffff;
 v.i1Words9440[ii(0x9514)]=6;v.i1Words9440[ii(0x9518)]=6;v.i1Words9440[ii(0x951c)]=7;v.i1Words9440[ii(0x96cc)]=6;
 for(let i=0;i<39;i++)v.i1Words9440[ii(0x959c)+i]=0x802c5de0;
 for(const [state,target]of [[2,0x802c5ce0],[10,0x802c5d10],[20,0x802c5d28],[30,0x802c5d40],[40,0x802c5cf8]])v.i1Words9440[ii(0x959c)+state-2]=target;
 return v;
}
function rec(v,slot,offset,value){v.raceWords1f94[ri(slot,offset)]=value>>>0;}
function calls(v){return v.operations.filter(op=>op.kind==='externalCall').map(op=>op.consumer);}

test('initializer uses pending608 and retains the display init latch',()=>{
 const v=fixture();v.scene.mode620=4;v.scene.initLatch63c=1;
 assert.deepEqual(initialize(v).operations,[write('i1Write',0,0)]);
 v.scene.mode608=4;v.scene.courseIndex=0;v.profileWordsB330[2]=2;
 for(let i=0;i<9;i++)v.i1Words9440[ii(0x94c8)+i]=100+i;
 const result=initialize(v);
 assert.deepEqual(result.operations,[write('i1Write',0,0),...Array.from({length:9},(_,i)=>write('i1Write',0x96a8-0x9440+i*4,100+i)),write('i1Write',0x96cc-0x9440,7)]);
 assert.equal(v.scene.initLatch63c,1);assert.equal(v.i1Words9440[0],0xffffffff);
});

test('initializer reads only reached owners and rejects difficulty aliases',()=>{
 assert.deepEqual(initialize({scene:{mode608:0},i1Words9440:Array(168).fill(7)}).operations,[write('i1Write',0,0)]);
 const v=fixture();v.scene.mode608=4;v.scene.courseIndex=1;v.profileWordsB330[2]=1;
 assert.deepEqual(initialize(v).operations,[write('i1Write',0,0),write('i1Write',0x96cc-0x9440,6)]);
 v.profileWordsB330[2]=3;assert.throws(()=>initialize(v),/difficultyB338/);
 v.scene.difficulty=0;assert.throws(()=>initialize(v),/overlaps/);
});

test('ordinary solo starts on the tenth call, with both source counter stores',()=>{
 const v=fixture();v.i1Words9440[0]=8;
 assert.deepEqual(status(v).operations,[write('i1Write',0,9)]);
 v.i1Words9440[0]=9;
 assert.deepEqual(status(v).operations,[write('i1Write',0,10),sw('phase650',1),write('i1Write',0,-1)]);
 assert.equal(v.scene.phase650,0);
});

test('other single-player modes wait fifty calls and two-player waits forty-six',()=>{
 for(const [players,mode,old,threshold]of [[1,4,49,50],[1,11,9,10],[2,0,45,46],[2,4,45,46]]){
  const v=fixture();Object.assign(v.scene,{players,mode620:mode,mode608:4});v.i1Words9440[0]=old;
  assert.deepEqual(status(v).operations,[write('i1Write',0,threshold),sw('phase650',1),write('i1Write',0,-1)]);
 }
 const v=fixture();v.i1Words9440[0]=0x7fffffff;
 assert.deepEqual(status(v).operations,[write('i1Write',0,0x80000000)]);
});

test('course zero requires actual readiness and phase two controls simulation separately',()=>{
 const v=fixture();Object.assign(v.scene,{courseIndex:0,ready6fc:0,phase650:2});v.i1Words9440[0]=0;
 assert.deepEqual(status(v).operations,[]);
 v.scene.ready6fc=1;
 assert.deepEqual(status(v).operations,[sw('phase650',1),write('i1Write',0,-1)]);
 v.i1Words9440[0]=0xffffffff;
 assert.deepEqual(status(v).operations,[sw('simulation648',3)]);
 v.scene.activity624=0;assert.deepEqual(status(v).operations,[]);
});

test('transition callbacks use the actual HUD halfword and source active mode',()=>{
 const v=fixture();v.hudWords7788[hi(0x8a14)]=0xbeef0001;
 assert.deepEqual(status(v).operations,[call('800bfdd0',[0x80192610]),call('800bfef8',[0x80192630])]);
 Object.assign(v.scene,{courseIndex:0,mode620:4,specialAb64:1});
 assert.deepEqual(status(v).operations,[call('800bfe70',[0x80192610]),call('800bfef8',[0x80192630])]);
 v.scene.gameStateAb24=43;assert.deepEqual(status(v).operations,[]);
});

test('solo final-round award uses signed points, actual placement, and preserves record words',()=>{
 const v=fixture();Object.assign(v.scene,{mode608:4,primaryHumanIndex:3});v.profileWordsB330[1]=6;v.profileWordsB330[4]=9;
 rec(v,3,0x2f4,1);rec(v,3,4,0);rec(v,3,0x19c,12345);const before=structuredClone(v);
 assert.deepEqual(status(v).operations,[write('profileWrite',0xb3e8-0xb330,12345),write('i1Write',0x9510-0x9440,1),call('802c6fe0')]);
 assert.deepEqual(v,before);
 v.profileWordsB330[4]=8;assert.deepEqual(status(v).operations,[write('profileWrite',0xb3e8-0xb330,12345),call('802c6fe0')]);
 v.profileWordsB330[4]=0x7fffffff;assert.equal(status(v).operations.some(op=>op.kind==='i1Write'),false);
});

test('solo DQ checks misses72e and receives no finish-placement award',()=>{
 const v=fixture();Object.assign(v.scene,{mode608:4,missesEnabled72e:0});v.profileWordsB330[1]=6;v.profileWordsB330[4]=16;
 rec(v,0,0x2ec,1);rec(v,0,4,999);rec(v,0,0x19c,54321);
 assert.deepEqual(status(v).operations,[]);
 v.scene.missesEnabled72e=1;
 assert.deepEqual(status(v).operations,[write('profileWrite',0xb3e8-0xb330,54321),write('i1Write',0x9510-0x9440,1),sh('result6f0',1),call('802c6dcc')]);
});

test('versus finish beats DQ and compares signed time with an exact tie branch',()=>{
 const v=fixture();v.scene.players=2;rec(v,0,0x2f4,1);rec(v,1,0x2f4,1);rec(v,0,0x2ec,1);rec(v,1,0x2ec,1);
 rec(v,0,0x19c,0x80000000);rec(v,1,0x19c,20);
 assert.deepEqual(status(v).operations,[sh('result6f0',2),write('profileWrite',0xb3f0-0xb330,1),call('802c6fe0'),write('hudWrite',0x8aa8-0x7788,1)]);
 rec(v,0,0x19c,20);
 assert.deepEqual(status(v).operations,[sh('result6f0',3),call('802c7394'),write('hudWrite',0x8aa8-0x7788,3)]);
});

test('versus win counters increment only below signed ninety-nine',()=>{
 const v=fixture();v.scene.players=2;rec(v,1,0x2f4,1);v.profileWordsB330[49]=99;
 assert.deepEqual(status(v).operations,[sh('result6f0',1),call('802c6fe0'),write('hudWrite',0x8aa8-0x7788,2)]);
 v.profileWordsB330[49]=0x80000000;
 assert.equal(status(v).operations[1].value,0x80000001);
});

test('versus DQ updates opposite win counter and retains stale result semantics',()=>{
 const v=fixture();v.scene.players=2;rec(v,0,0x2ec,1);
 assert.deepEqual(status(v).operations,[sh('result6f0',1),write('profileWrite',0xb3f4-0xb330,1),write('hudWrite',0x8aa8-0x7788,2),call('802c6dcc')]);
 rec(v,0,0x2ec,0);v.scene.result6f0=1;
 assert.deepEqual(status(v).operations,[call('802c6dcc')]);
 v.scene.missesEnabled72e=0;assert.deepEqual(status(v).operations,[]);
 v.scene.missesEnabled72e=1;rec(v,0,0x2ec,1);rec(v,1,0x2ec,1);
 assert.deepEqual(status(v).operations,[sh('result6f0',3),call('802c7394'),write('hudWrite',0x8aa8-0x7788,3)]);
});

test('init display branch clears latch and calls source initializer without inventing a head',()=>{
 const v={scene:{initLatch63c:2,gameStateAb24:40}};
 assert.deepEqual(stage(v),{operations:[sw('initLatch63c',0),call('80093c44')],displayListHead:null});
 assert.equal(v.scene.initLatch63c,2);
});

test('opaque display-head returns compose in source order before numeric status',()=>{
 const v=fixture();Object.assign(v.scene,{players:2,courseIndex:0,mode608:4,gameStateAb24:40});
 const result=stage(v);
 assert.deepEqual(result.operations,[{...call('8009328c'),returnWord:0x81000000},{...call('801e5554',[0x81000000]),returnWord:0x81000020},
  {...call('802c6b38',[0x81000020]),returnWord:0x81000040},{...call('802c6bd8',[0x81000040]),returnWord:0x81000060},
  {kind:'presentationWordWrite',address:0x81000060,width:4,value:0x06000000},
  {kind:'presentationWordWrite',address:0x81000064,width:4,value:0x0106f1b8},call('801de3cc')]);
 assert.equal(result.displayListHead,0x81000068);
});

test('dispatcher selects status stages and expands game forty numeric work once',()=>{
 for(const [game,consumer]of [[41,'802c63b4'],[42,'802c6550'],[44,'802c6b00']]){
  const v=fixture();v.scene.gameStateAb24=game;assert.deepEqual(calls(stage(v)).slice(-1),[consumer]);
 }
 const v=fixture();v.i1Words9440[0]=9;const result=stage(v);
 assert.deepEqual(calls(result),['8009328c','801e5554','801de3cc']);
 assert.deepEqual(result.operations.slice(-3),[write('i1Write',0,10),sw('phase650',1),write('i1Write',0,-1)]);
});

test('return stage follows loaded jump selector and clears only four current-round words',()=>{
 const v=fixture();Object.assign(v.scene,{gameStateAb24:43,returnState630:30});v.hudWords7788[hi(0x8a14)]=1;
 v.profileWordsB330.fill(99);v.profileWordsB330[0]=0;v.profileWordsB330[1]=7;
 const result=stage(v);
 assert.deepEqual(result.operations.slice(4),[sh('activity624',-1),sh('event628',0),sh('participantCount60e',4),
  ...Array.from({length:4},(_,i)=>write('profileWrite',0xb350-0xb330+7*16+i*4,0)),write('profileWrite',4,8),call('801eb91c'),call('800ad3c4')]);
 assert.equal(v.profileWordsB330[1],7);assert.equal(v.profileWordsB330[8+6*4],99);
 v.profileWordsB330[0]=1;v.profileWordsB330[2]=0;
 assert.deepEqual(stage(v).operations.slice(4),[sh('activity624',-1),sh('event628',0),sw('restart6f8',1),write('profileWrite',4,0),write('profileWrite',4,1),call('801eb91c'),call('800ad3c4')]);
});

test('return selector bounds and loaded targets do not infer frontend behavior',()=>{
 const v=fixture();Object.assign(v.scene,{gameStateAb24:43,returnState630:1});v.hudWords7788[hi(0x8a14)]=1;
 assert.deepEqual(stage(v).operations.slice(4),[sh('activity624',-1),sh('event628',0)]);
 for(const [state,consumer]of [[2,'801eb180'],[10,'801ebd28'],[20,'801ebfe4'],[40,'8009345c']]){
  v.scene.returnState630=state;assert.deepEqual(calls(stage(v)).slice(-2),[consumer,'800ad3c4']);
 }
 v.i1Words9440[ii(0x959c)+38]=0x802c1234;assert.throws(()=>stage(v),/dispatch target/);
});

test('missing or invalid late dependencies reject atomically',()=>{
 const v=fixture();Object.assign(v.scene,{players:2,courseIndex:0,mode608:4});delete v.externalReturns['802c6bd8'];const before=structuredClone(v);
 assert.throws(()=>stage(v),/actual return/);assert.deepEqual(v,before);
 v.externalReturns['802c6bd8']=0x81000001;assert.throws(()=>stage(v),/aligned/);
 const w=fixture();w.scene.players=2;rec(w,0,0x2f4,1);w.profileWordsB330[0]=NaN;assert.throws(()=>status(w),/profileWords/);
});

test('outputs are deeply frozen and later caller edits cannot alter captured operations',()=>{
 const v=fixture(),result=stage(v),saved=structuredClone(result);v.externalReturns['8009328c']=0;v.i1Words9440[0]=3;
 assert.deepEqual(result,saved);assert.equal(Object.isFrozen(result.operations),true);assert.equal(Object.isFrozen(result.operations[0].arguments),true);
 assert.throws(()=>result.operations.push(call('none')),TypeError);
});
