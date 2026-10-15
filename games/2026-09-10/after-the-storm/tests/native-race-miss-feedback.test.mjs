import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareNativeRaceMissFeedback,prepareNativeRaceMissFeedbackPalette} from '../native-race-miss-feedback.js';

const ri=a=>(a-0x1f94)/4,hi=a=>(a-0x7788)/4,base=i=>0x2938+i*0x378;
const data=new DataView(new ArrayBuffer(4));
function bits(value){data.setFloat32(0,value,false);return data.getUint32(0,false);}
function number(value){data.setUint32(0,value,false);return data.getFloat32(0,false);}
function put(q,racer,offset,value){q.raceWords1f94[ri(base(racer)+offset)]=value>>>0;}
function hput(q,address,value){q.hudWords7788[hi(address)]=value>>>0;}
const get=(q,racer,offset)=>q.raceWords1f94[ri(base(racer)+offset)]|0;
function sub(q,view,index,values){const a=0x8c30+view*84+index*28;
 for(const [name,value]of Object.entries(values)){const offset={x:0,y:4,dx:8,dy:12,scale:16,counter:20,state:24}[name];hput(q,a+offset,offset<20?bits(value):value);}}
function read(q,view,index){const a=0x8c30+view*84+index*28;
 return Object.fromEntries(['x','y','dx','dy','scale','counter','state'].map((key,i)=>[key,i<5?number(q.hudWords7788[hi(a)+i]):q.hudWords7788[hi(a)+i]|0]));}
function fixture(){
 const q={raceWords1f94:Array.from({length:1693},(_,i)=>(0x23450000+i)>>>0),hudWords7788:Array.from({length:1442},(_,i)=>(0x12340000+i)>>>0),
  globals:{players:1,primaryHumanIndex:0,secondaryHumanIndex:1,missLimit8174:5,main638:1,mode620:4}};
 for(let i=0;i<4;i++)for(const [offset,value]of [[0x28,0],[0x12c,3],[0x134,0],[0x13c,0],[0x314,0],[0x19c,1000],[0x2c4,1000],[0x2ec,0],[0x2f4,0]])put(q,i,offset,value);
 for(let v=0;v<2;v++)for(let i=0;i<3;i++)sub(q,v,i,{x:160,y:77,dx:4.75,dy:11.25,scale:1,counter:0,state:0});
 hput(q,0x7a44,bits(.08));hput(q,0x7a48,bits(.7));hput(q,0x8c28,1);hput(q,0x8c2c,3);
 q.raceWords1f94[ri(0x39b4)]=bits(-100000);return q;
}
function commit(q,operations){const race=[...q.raceWords1f94],hud=[...q.hudWords7788];
 for(const op of operations){
  if(op.kind==='hudWrite'){assert.equal(op.width,4);hud[op.byteOffset/4]=op.value;}
  else if(op.kind==='recordWordWrite')race[ri(base(op.racerIndex))+op.wordIndex]=op.value;
  else if(op.kind==='raceWordWrite')race[op.wordIndex]=op.value;
  else assert.fail('unexpected nonnumeric feedback operation');
 }
 return {...q,raceWords1f94:race,hudWords7788:hud};
}
function step(q){const result=prepareNativeRaceMissFeedback(q);return {q:commit(q,result.operations),result};}

test('event2 animates allowed misses through the limit and does not admit excess misses',()=>{
 for(const misses of [-1,0,4,5,6]){
  const q=fixture();put(q,0,0x28,2);put(q,0,0x134,misses);put(q,0,0x12c,0);
  const out=step(q).q;
  assert.equal(read(out,0,0).state,misses<=5?1:0);
  assert.equal(get(out,0,0x13c),0,'feedback does not fabricate miss-limit adjudication');
  if(misses<=5){assert.equal(read(out,0,0).counter,15);assert.equal(read(out,0,0).x,160);}
 }
});

test('first miss initializes the two actual trajectories and updates their countdown immediately',()=>{
 const q=fixture();put(q,0,0x28,2);put(q,0,0x134,1);
 const {q:out,result}=step(q);
 assert.deepEqual(read(out,0,0),{x:160,y:77,dx:-5.25,dy:16.75,scale:1,counter:15,state:1});
 assert.deepEqual(read(out,0,1),{x:160,y:121,dx:4.75,dy:11.25,scale:1,counter:15,state:3});
 assert.equal(get(out,0,0x12c),3);assert.equal(get(out,0,0x28),2,'event2960 retains its upstream owner');
 assert.equal(result.operations[0].byteOffset,0x8c28-0x7788);assert.equal(result.operations[1].byteOffset,0x8c2c-0x7788);
});

test('selected human views use their own source positions with one shared record owner',()=>{
 const q=fixture();Object.assign(q.globals,{players:2,primaryHumanIndex:2,secondaryHumanIndex:0});
 for(const racer of [2,0]){put(q,racer,0x28,2);put(q,racer,0x134,1);}
 const out=step(q).q;
 assert.deepEqual([read(out,0,0).y,read(out,0,0).dx,read(out,0,0).dy],[36,-9.25,9.25]);
 assert.deepEqual([read(out,1,0).y,read(out,1,0).dx,read(out,1,0).dy],[146,-9.25,9.25]);
 assert.equal(read(out,0,1).y,78);assert.equal(read(out,1,1).y,188);
 assert.equal(get(out,1,0x28),0,'unselected record retained');
});

test('source power resets to1 only when a qualifying new event interrupts subrecord state3',()=>{
 for(const boost of [0,1])for(const second of [0,3]){
  const q=fixture();put(q,0,0x28,1);put(q,0,0x12c,4);put(q,0,0x314,boost);sub(q,0,1,{state:second,counter:8});
  const out=step(q).q;
  assert.equal(get(out,0,0x12c),second===3?1:4);
  assert.equal(read(out,0,2).state,boost||second===3?2:0);
  if(boost||second===3){assert.equal(read(out,0,2).counter,11);assert.equal(read(out,0,2).x,300);assert.equal(read(out,0,2).y,206);}
 }
});

test('high power source event starts its distinct2-state timer and floors scale with two ordered writes',()=>{
 let q=fixture();put(q,0,0x28,1);put(q,0,0x314,1);put(q,0,0x12c,5);q=step(q).q;put(q,0,0x28,0);
 assert.equal(read(q,0,2).counter,1);
 for(let i=0;i<18;i++)q=step(q).q;
 assert.equal(read(q,0,2).counter,19);assert.equal(read(q,0,2).scale,1);
 q=step(q).q;assert.equal(q.hudWords7788[hi(0x8c30+56+16)],0x3f6b851f);
 for(let i=0;i<2;i++)q=step(q).q;
 const last=step(q),address=0x8c30+56+16;
 assert.equal(last.q.hudWords7788[hi(address)],0x3f333333);
 assert.equal(last.result.operations.filter(op=>op.kind==='hudWrite'&&op.byteOffset===address-0x7788).length,2);
 assert.equal(read(last.q,0,2).state,2,'high power has no invented expiry');
});

test('low power2-state expiration is separate from power0 and retirement writes',()=>{
 const q=fixture();put(q,0,0x12c,4);sub(q,0,2,{state:2,counter:0});
 const {q:out,result}=step(q);assert.equal(read(out,0,2).state,0);assert.equal(read(out,0,2).counter,-1);
 assert.equal(get(out,0,0x12c),4);assert.equal(get(out,0,0x2ec),0);assert.deepEqual(result.diagnostic.numericCalls,[]);
});

test('state3 expires only after its full countdown and then writes actual source power0',()=>{
 let q=fixture();sub(q,0,1,{state:3,counter:1});q=step(q).q;
 assert.equal(read(q,0,1).state,3);assert.equal(read(q,0,1).counter,0);assert.equal(get(q,0,0x12c),3);
 q=step(q).q;assert.equal(read(q,0,1).state,0);assert.equal(get(q,0,0x12c),0);
});

test('new miss-limit event takes17 source calls including its arming call before actual retirement',()=>{
 let q=fixture();put(q,0,0x28,2);put(q,0,0x134,5);put(q,0,0x13c,1);put(q,0,0x12c,0);
 for(let call=1;call<=16;call++){
  const prepared=step(q);q=prepared.q;assert.equal(read(q,0,0).counter,16-call);assert.equal(get(q,0,0x2ec),0);assert.deepEqual(prepared.result.diagnostic.numericCalls,[]);
 }
 const {q:out,result}=step(q);
 assert.equal(read(out,0,0).counter,-1);assert.equal(read(out,0,0).state,0);assert.equal(get(out,0,0x2ec),1);
 assert.equal(out.raceWords1f94[ri(base(0)+0x32c)],bits(-100000));assert.equal(out.raceWords1f94[ri(0x39b4)],bits(-90000));
 assert.equal(result.diagnostic.numericCalls.length,1);assert.equal(result.operations.some(op=>op.kind==='sourceWordWrite'),false);
});

test('multiple subrecords and aliased humans preserve sequential retirement allocations and power reads',()=>{
 const q=fixture();Object.assign(q.globals,{players:2,secondaryHumanIndex:0});put(q,0,0x13c,1);
 for(let view=0;view<2;view++)for(let i=0;i<3;i++)sub(q,view,i,{state:1,counter:0});
 const {q:out,result}=step(q);
 assert.equal(result.diagnostic.numericCalls.length,6,'status writes do not invent a skip in this consumer');
 assert.equal(out.raceWords1f94[ri(base(0)+0x32c)],bits(-50000));assert.equal(out.raceWords1f94[ri(0x39b4)],bits(-40000));
 const alias=fixture();Object.assign(alias.globals,{players:2,secondaryHumanIndex:0});sub(alias,0,1,{state:3,counter:0});sub(alias,1,2,{state:2,counter:20});put(alias,0,0x12c,5);
 const a=step(alias).q;assert.equal(get(a,0,0x12c),0);assert.equal(read(a,1,2).counter,19,'second view sees first view power0');
});

test('signed integer target and counter wrap precedes float conversion without an invented clamp',()=>{
 const q=fixture();q.globals.missLimit8174=2147483647;put(q,0,0x28,2);put(q,0,0x134,-2147483648);put(q,0,0x12c,0);
 assert.equal(read(step(q).q,0,0).dx,-14,'14*wrapped remaining plus62 is converted as a signed word');
 const x=fixture();sub(x,0,0,{state:1,counter:-2147483648});put(x,0,0x13c,1);
 const {q:out,result}=step(x);assert.equal(read(out,0,0).counter,2147483647);assert.equal(read(out,0,0).state,1);assert.equal(result.diagnostic.numericCalls.length,0);
});

test('motion starts only below counter9 and unknown HUD states remain intact',()=>{
 const q=fixture();sub(q,0,0,{state:1,counter:9});let out=step(q).q;assert.equal(read(out,0,0).x,160);assert.equal(read(out,0,0).counter,8);
 out=step(out).q;assert.equal(read(out,0,0).x,164.75);assert.equal(read(out,0,0).y,88.25);
 for(const state of [-1,4,2147483647]){const u=fixture();sub(u,0,0,{state});assert.deepEqual(prepareNativeRaceMissFeedback(u).operations,[]);}
});

test('lazy fields, explicit float coefficients and late invalid reads remain atomic',()=>{
 const q=fixture();delete q.globals.missLimit8174;delete q.globals.main638;delete q.globals.mode620;delete q.globals.secondaryHumanIndex;
 assert.doesNotThrow(()=>prepareNativeRaceMissFeedback(q));
 put(q,0,0x28,2);assert.throws(()=>prepareNativeRaceMissFeedback(q),/missLimit8174/);
 const x=fixture();x.globals.players=2;delete x.globals.secondaryHumanIndex;put(x,0,0x28,2);const before=structuredClone(x);
 assert.throws(()=>prepareNativeRaceMissFeedback(x),/secondaryHumanIndex/);assert.deepEqual(x,before);
 const unused=fixture();hput(unused,0x8c30,0x7fc01234);assert.doesNotThrow(()=>prepareNativeRaceMissFeedback(unused));
 sub(unused,0,0,{state:1,counter:8});assert.throws(()=>prepareNativeRaceMissFeedback(unused),/finite float32/);
 const bad=fixture();hput(bad,0x7a44,0x7fc01234);assert.throws(()=>prepareNativeRaceMissFeedback(bad),/finite float32/);
});

test('all unrelated words and original snapshots are preserved; operations are deeply immutable',()=>{
 const q=fixture();put(q,0,0x28,2);const before=structuredClone(q),result=prepareNativeRaceMissFeedback(q),out=commit(q,result.operations);
 assert.deepEqual(q,before);assert(Object.isFrozen(result));assert(Object.isFrozen(result.operations));assert(Object.isFrozen(result.operations[0]));
 const changed=new Set(result.operations.filter(o=>o.kind==='hudWrite').map(o=>o.byteOffset/4));
 for(let i=0;i<1442;i++)if(!changed.has(i))assert.equal(out.hudWords7788[i],q.hudWords7788[i]);
 assert.deepEqual(out.raceWords1f94,q.raceWords1f94);assert.throws(()=>prepareNativeRaceMissFeedback({...q,hudWords7788:Array(1441).fill(0)}),/1442/);
});

test('sparse canonical owners reject holes instead of turning missing state into zero',()=>{
 for(const owner of ['raceWords1f94','hudWords7788']){
  const q=fixture();delete q[owner][100];const before=structuredClone(q);
  assert.throws(()=>prepareNativeRaceMissFeedback(q),new RegExp(owner));assert.deepEqual(q,before);assert.equal(100 in q[owner],false);
 }
});

test('adjacent numeric palette uses retained draw values and preserves duplicate wrap stores',()=>{
 const q=fixture(),before=structuredClone(q),r=prepareNativeRaceMissFeedbackPalette(q.hudWords7788,{activity624:-1});
 assert.deepEqual(r.operations,[
  {kind:'hudWrite',byteOffset:0x8c28-0x7788,width:4,value:2},
  {kind:'hudWrite',byteOffset:0x8c28-0x7788,width:4,value:0},
  {kind:'hudWrite',byteOffset:0x8c2c-0x7788,width:4,value:4},
  {kind:'hudWrite',byteOffset:0x8c2c-0x7788,width:4,value:0}]);
 assert.deepEqual(r.drawRecipe,{sourceEntry:'801f14b4',canonicalAdvancePrepared:true,graphicsHead:'callerOwned',paletteBeforeAdvance:{phase8c28:1,bank8c2c:3}});
 assert.equal(r.diagnostic.drawingImplemented,false);assert.deepEqual(q,before);
 assert(Object.isFrozen(r.drawRecipe.paletteBeforeAdvance));
});

test('adjacent counter block has its own source-call cadence and activity gate',()=>{
 let q=fixture();hput(q,0x8c28,0);hput(q,0x8c2c,0);
 for(const activity of [0,1,32767,-32768])assert.deepEqual(prepareNativeRaceMissFeedbackPalette(q.hudWords7788,{activity624:activity}).operations,[]);
 for(let call=1;call<=8;call++){
  const p=prepareNativeRaceMissFeedbackPalette(q.hudWords7788,{activity624:-1});q=commit(q,p.operations);
  assert.equal(q.hudWords7788[hi(0x8c28)],call%2);assert.equal(q.hudWords7788[hi(0x8c2c)],Math.floor(call/2)%4);
 }
 hput(q,0x8c28,2147483647);const wrapped=prepareNativeRaceMissFeedbackPalette(q.hudWords7788,{activity624:-1});
 assert.deepEqual(wrapped.operations.map(o=>o.value),[2147483648],'signed add wraps before the>=2 test');
 delete q.hudWords7788[1];assert.throws(()=>prepareNativeRaceMissFeedbackPalette(q.hudWords7788,{activity624:-1}),/hudWords7788/);
});
