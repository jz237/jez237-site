import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareNativeRaceStartupOverlay,prepareNativeRaceStartupPalette} from '../native-race-startup-overlay.js';

const hudIndex=address=>(address-0x7788)/4,raceIndex=address=>(address-0x1f94)/4;
function fixture(){
 const hudWords7788=Array.from({length:1442},(_,i)=>(0x12340000+i)>>>0),raceWords1f94=Array.from({length:1693},(_,i)=>(0x34560000+i)>>>0);
 for(let t=0;t<4;t++)for(let row=0;row<5;row++)for(let axis=0;axis<3;axis++)
  hudWords7788[hudIndex([0x7888,0x78c4,0x7900,0x793c][t])+row*3+axis]=t*100+row*10+axis;
 hudWords7788[hudIndex(0x7998)]=7;hudWords7788[hudIndex(0x8d20)]=1;hudWords7788[hudIndex(0x8d1c)]=2;
 raceWords1f94[raceIndex(0x1fd8)]=0;
 [2,0,1,3].forEach((p,i)=>{raceWords1f94[raceIndex(0x293c+i*0x378)]=p;});
 return {hudWords7788,raceWords1f94,globals:{activity624:-1,players:2,mode620:4,courseIndex:1,racerCount:4,primaryHumanIndex:2,secondaryHumanIndex:0}};
}
function applyHud(input,operations){
 const words=[...input];for(const op of operations)if(op.kind==='hudWrite'){
  const i=op.byteOffset>>2;if(op.width===4)words[i]=op.value;
  else{const shift=(3-(op.byteOffset&3))*8;words[i]=((words[i]&~(255<<shift))|(op.value<<shift))>>>0;}
 }return words;
}
const get=(words,address)=>words[hudIndex(address)];
const writes=(result,address)=>result.operations.filter(op=>op.kind==='hudWrite'&&op.byteOffset===address-0x7788);

test('palette uses retained phase/bank before advancing them and keeps all unrelated words',()=>{
 const q=fixture(),before=structuredClone(q),r=prepareNativeRaceStartupPalette(q),h=applyHud(q.hudWords7788,r.operations);
 assert.deepEqual(q,before);assert.deepEqual(h.slice(hudIndex(0x8aac),hudIndex(0x8ad8)+1),[25,26,27,125,126,127,225,226,227,325,326,327]);
 assert.equal(get(h,0x8d20),0);assert.equal(get(h,0x8d1c),3);
 assert.deepEqual(writes(r,0x8d20).map(o=>o.value),[2,0]);assert.deepEqual(writes(r,0x8d1c).map(o=>o.value),[3,3]);
 assert.equal(get(h,0x8d18),get(q.hudWords7788,0x8d18));assert.ok(Object.isFrozen(r.operations));
});

test('palette signed truncation and finish latch affect only the final two triples',()=>{
 const q=fixture();q.hudWords7788[hudIndex(0x8d1c)]=0;q.raceWords1f94[raceIndex(0x1fd8)]=-1>>>0;
 [-7,11,25,4,32,-10].forEach((v,i)=>{q.hudWords7788[hudIndex(0x7888)+i]=v>>>0;});
 const r=prepareNativeRaceStartupPalette(q),h=applyHud(q.hudWords7788,r.operations);
 assert.deepEqual(h.slice(hudIndex(0x8aac),hudIndex(0x8ad8)+1),[-1>>>0,21,7,105,106,107,200,201,202,300,301,302]);
 assert.equal(r.diagnostic.fixedFinalTables,true);
});

test('inactive activity still interpolates but does not advance retained phase/bank',()=>{
 const q=fixture();q.globals.activity624=0;const r=prepareNativeRaceStartupPalette(q),h=applyHud(q.hudWords7788,r.operations);
 assert.equal(r.operations.length,12);assert.equal(get(h,0x8d20),1);assert.equal(get(h,0x8d1c),2);
 q.globals.activity624=-1;q.hudWords7788[hudIndex(0x8d1c)]=3;
 const next=applyHud(q.hudWords7788,prepareNativeRaceStartupPalette(q).operations);assert.equal(get(next,0x8d1c),0);assert.equal(get(next,0x8d20),0);
});

test('palette converts integer endpoints to float32 before multiplying and adding',()=>{
 const q=fixture();q.hudWords7788[hudIndex(0x8d1c)]=0;
 for(const [a,v]of [[0x7888,16777217],[0x7894,16777218],[0x788c,-16777217],[0x7898,-16777218]])q.hudWords7788[hudIndex(a)]=v>>>0;
 const h=applyHud(q.hudWords7788,prepareNativeRaceStartupPalette(q).operations);
 assert.equal(get(h,0x8aac),16777216);assert.equal(get(h,0x8ab0),-16777216>>>0);
});

test('terminal expands helper before reset and returns conditional flag writes in source order',()=>{
 const q=fixture(),before=structuredClone(q),r=prepareNativeRaceStartupOverlay(q),h=applyHud(q.hudWords7788,r.operations);
 assert.deepEqual(q,before);assert.deepEqual(r.operations[0],{kind:'hudWrite',byteOffset:0x7998-0x7788,width:4,value:0});
 assert.deepEqual(r.diagnostic.numericCalls,[{consumer:'801ee9c0',operationIndex:1,prepared:true}]);
 assert.deepEqual(h.slice(hudIndex(0x8aac),hudIndex(0x8ad8)+1),[25,26,27,125,126,127,225,226,227,325,326,327]);
 assert.deepEqual(writes(r,0x8d20).map(o=>o.value),[2,0,0]);assert.deepEqual(writes(r,0x8d1c).map(o=>o.value),[3,3,0]);
 assert.equal(get(h,0x8a90),60);assert.equal(get(h,0x8a98),0);assert.equal(get(h,0x8a9c),0);
 q.hudWords7788[hudIndex(0x7998)]=0;const quiet=prepareNativeRaceStartupOverlay(q);
 assert.equal(writes(quiet,0x7998).length,0);assert.equal(quiet.diagnostic.numericCalls[0].operationIndex,0);
});

test('opaque presentation copies preserve bits, source word order and buffer separation',()=>{
 const q=fixture();q.hudWords7788[0]=0x7fc01234;q.hudWords7788[1]=0x80000000;
 const r=prepareNativeRaceStartupOverlay(q),ops=r.operations.filter(o=>o.kind==='presentationBufferWrite');
 assert.equal(ops.length,128);assert.deepEqual(ops.slice(0,16).map(o=>o.byteOffset),[128,132,136,140,4,0,8,12,68,64,72,76,196,192,200,204]);
 const buffers=Array.from({length:2},()=>Array(64).fill(0));for(const op of ops)buffers[op.bufferIndex][op.byteOffset/4]=op.value;
 const expected=[...q.hudWords7788.slice(16,32),...q.hudWords7788.slice(32,48),...q.hudWords7788.slice(0,16),...q.hudWords7788.slice(48,64)];
 assert.deepEqual(buffers,[expected,expected]);assert.equal(buffers[0][32],0x7fc01234);assert.equal(buffers[0][33],0x80000000);
 buffers[0][0]=0;assert.equal(buffers[1][0],expected[0]);
});

test('selected actual race places produce independent per-player offsets without changing race words',()=>{
 const q=fixture(),before=[...q.raceWords1f94],r=prepareNativeRaceStartupOverlay(q),h=applyHud(q.hudWords7788,r.operations);
 const positions=player=>Array.from({length:4},(_,i)=>get(h,0x8d28+player*0x50+i*0x14+0xc));
 assert.deepEqual(positions(0),[52,0,24,76]);assert.deepEqual(positions(1),[48,0,24,76]);
 for(let p=0;p<2;p++)for(let i=0;i<4;i++){
  const a=0x8d28+p*0x50+i*0x14;assert.equal(get(h,a+4),get(h,a+12));
  for(const offset of [0,8,16])assert.equal(get(h,a+offset),0);
 }
 assert.deepEqual(q.raceWords1f94,before);assert.equal(r.operations.some(o=>o.kind==='recordWordWrite'),false);
});

test('byte latches and partially reset structures preserve unrelated retained bits',()=>{
 const q=fixture();q.globals.racerCount=2;q.hudWords7788[hudIndex(0x8b58)]=0xaabbccdd;
 const h=applyHud(q.hudWords7788,prepareNativeRaceStartupOverlay(q).operations);
 assert.equal(get(h,0x8b58),0x0000ccdd);
 for(let group=0;group<2;group++)for(let row=0;row<3;row++){
  const a=0x8c30+group*0x54+row*0x1c;assert.equal(get(h,a+0x10),get(q.hudWords7788,a+0x10));
  for(const offset of [0,4,8,12,20,24])assert.equal(get(h,a+offset),0);
 }
 assert.equal(get(h,0x8d14),get(q.hudWords7788,0x8d14));assert.equal(get(h,0x8d18),get(q.hudWords7788,0x8d18));
});

test('course/mode/player defaults and warning limits use actual independent source gates',()=>{
 for(const [players,mode,course,limit,offset,warning,latches]of [[1,4,1,100,100,119,0],[1,0,1,100,0,119,0],
  [2,11,1,50,0,119,0x01010101],[2,4,0,50,50,219,0x01010101],[1,11,0,100,0,119,0x01010101]]){
  const q=fixture();Object.assign(q.globals,{players,mode620:mode,courseIndex:course});
  const h=applyHud(q.hudWords7788,prepareNativeRaceStartupOverlay(q).operations);
  assert.equal(get(h,0x8d10),limit);assert.equal(get(h,0x8d0c),offset);assert.equal(get(h,0x8b5c),warning);
  assert.equal(get(h,0x8b58),latches);assert.equal(get(h,0x8d08),0);
 }
});

test('zero active count does not read selectors or reset unvisited player rows',()=>{
 const q=fixture();q.globals.racerCount=0;delete q.globals.primaryHumanIndex;delete q.globals.secondaryHumanIndex;
 const r=prepareNativeRaceStartupOverlay(q),h=applyHud(q.hudWords7788,r.operations);
 for(const a of [0x8b58,0x8b88,0x8bd8,0x8d28,0x8d78])assert.equal(get(h,a),get(q.hudWords7788,a));
 q.globals.players=1;q.globals.racerCount=1;q.globals.primaryHumanIndex=2;
 assert.doesNotThrow(()=>prepareNativeRaceStartupOverlay(q));
});

test('signed place multiplication wraps and compares original signed places',()=>{
 const q=fixture();q.globals.players=1;q.globals.primaryHumanIndex=1;
 [2147483647,-2147483648,0,-1].forEach((v,i)=>{q.raceWords1f94[raceIndex(0x293c+i*0x378)]=v>>>0;});
 const h=applyHud(q.hudWords7788,prepareNativeRaceStartupOverlay(q).operations);
 assert.deepEqual(Array.from({length:4},(_,i)=>get(h,0x8d28+i*0x14+12)),[-20>>>0,0,4,-20>>>0]);
});

test('malformed spans, invalid native conversions and late selectors reject without input mutation',()=>{
 const q=fixture(),before=structuredClone(q);
 assert.throws(()=>prepareNativeRaceStartupOverlay({...q,hudWords7788:q.hudWords7788.slice(1)}),/1442/);
 assert.throws(()=>prepareNativeRaceStartupOverlay({...q,raceWords1f94:q.raceWords1f94.slice(1)}),/1693/);
 q.hudWords7788[hudIndex(0x8d1c)]=4;assert.throws(()=>prepareNativeRaceStartupOverlay(q),/bank8d1c/);
 Object.assign(q,structuredClone(before));q.globals.secondaryHumanIndex=4;const late=structuredClone(q);
 assert.throws(()=>prepareNativeRaceStartupOverlay(q),/secondaryHumanIndex/);assert.deepEqual(q,late);
 Object.assign(q,structuredClone(before));q.hudWords7788[hudIndex(0x8d20)]=0x7fffffff;
 assert.throws(()=>prepareNativeRaceStartupOverlay(q),/conversion/);
 Object.assign(q,structuredClone(before));q.globals.activity624=32768;assert.throws(()=>prepareNativeRaceStartupPalette(q),/activity624/);
});
