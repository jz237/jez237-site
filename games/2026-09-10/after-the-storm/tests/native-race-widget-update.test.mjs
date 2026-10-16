import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareNativeRaceWidgetUpdate,prepareNativeRaceHUDAnimationUpdate} from '../native-race-widget-update.js';
import {prepareNativeRaceFadeSlotInitialization} from '../native-race-fade-initialization.js';
import {prepareNativeRaceStateOperations,prepareNativeRaceWidgetAdvance} from '../native-race-state.js';
const hi=a=>(a-0x7788)/4,base=0x8930;
const bits=v=>{const d=new DataView(new ArrayBuffer(4));d.setFloat32(0,v);return d.getUint32(0);};
const half=(s,a)=>(s.hudWords7788[(a-0x7788)>>>2]>>>(a%4===0?16:0))&65535;
const word=(s,a)=>s.hudWords7788[hi(a)]|0;
const template=Array(11).fill(0),input={frameBufferBase:0x81000000,slotTemplateWords6c50:template,
 menuBase6bd0:80,menuIndex6ee4:3,rotationWord6c80:bits(Math.PI),rotationWord6c84:bits(Math.PI),bounceWord6c88:bits(.7)};
function state(mode=0,record=1){const s={scene:{players:1,racerCount:1,mode608:mode,activity624:-1},
 raceWords1f94:Array(1693).fill(0),hudWords7788:Array(1442).fill(0)};
 s.raceWords1f94[(0x2650-0x1f94)/4]=record;return s;}
function set(s,a,value,width=4){return prepareNativeRaceStateOperations(s,[{kind:'hudWrite',byteOffset:a-0x7788,width,value:width===2?value&65535:value>>>0}]).state;}
function add(s,type,selector=0){return prepareNativeRaceStateOperations(s,prepareNativeRaceFadeSlotInitialization({
 hudWords7788:s.hudWords7788,slotTemplateWords6c50:template,type,selector}).operations).state;}
const step=s=>prepareNativeRaceWidgetAdvance(s,input);

test('finish banner reaches its record banner once, then releases its slot after the complete animation',()=>{
 let s=add(state(),1),frames=0;
 while(half(s,base)===1&&frames<30){s=step(s).state;frames++;}
 assert.equal(frames,17);assert.equal(half(s,base),2);assert.equal(half(s,base+2),0);
 assert.equal(word(s,base+24),0);assert.equal(word(s,base+8),58);
 for(let i=0;i<36;i++){s=step(s).state;assert.equal(half(s,base),2);}
 s=step(s).state;assert.equal(half(s,base),0);
 const next=step(s);assert.equal(next.operations.length,0);
 for(const [mode,record,expected]of [[0,0,0],[0,2,0],[4,0,2],[1,1,1],[11,1,1]]){
  let q=add(state(mode,record),1);for(let i=0;i<17;i++)q=step(q).state;
  assert.equal(half(q,base),expected);if(mode===4)assert.equal(word(q,base+8),120);
 }
});

test('replacement allocation sees earlier mutations without updating a new banner twice',()=>{
 let s=state();s=add(s,1);s=add(s,1);
 for(const b of [base,base+44]){s=set(s,b+2,1,2);s=set(s,b+24,10);}
 const r=step(s);
 assert.deepEqual(r.diagnostic.activeSlots,[0,1]);
 for(const b of [base,base+44]){assert.equal(half(r.state,b),2);assert.equal(half(r.state,b+2),0);assert.equal(word(r.state,b+24),0);}
 assert.deepEqual(r.effects.map(e=>e.consumer),['80048854','80048854']);
 assert.equal(r.effects[0].arguments[1],null);
});

test('retirement banner lands once, bounces to rest and preserves neighboring HUD storage',()=>{
 let s=add(state(),4),sounds=0,frames=0;s=set(s,0x8a0c,0xdeadbeef);
 const y=[];
 while(half(s,base+2)!==2&&frames<100){const r=step(s);s=r.state;frames++;y.push(word(s,base+12));sounds+=r.effects.filter(e=>e.consumer==='800c30bc').length;}
 assert.ok(frames<100);assert.deepEqual(y.slice(0,7),[-40,-37,-28,-13,8,35,63]);
 assert.equal(sounds,1);assert.equal(word(s,base+12),63);assert.equal(word(s,base+24),0);assert.equal(word(s,base+28),0);
 assert.equal(s.hudWords7788[hi(0x8a0c)],0xdeadbeef);
 const r=step(s);assert.equal(r.effects.length,0);assert.equal(half(r.state,base+2),2);
});

test('menu markers follow the source row, wrap after forty updates and release on inactive selection',()=>{
 let s=add(state(),3,0);for(let i=0;i<40;i++)s=step(s).state;
 assert.equal(word(s,base+12),146);assert.equal(word(s,base+24),0);assert.equal(word(s,base+32),415);
 s=add(state(),3,2);const inactive=step(s);assert.equal(half(inactive.state,base),0);assert.equal(inactive.effects.length,0);
 s=structuredClone(add(state(),3,2));s.scene.activity624=2;
 const active=step(s);assert.equal(word(active.state,base+12),131);assert.equal(active.effects[0].consumer,'80049a94');
 assert.equal(active.effects[0].arguments[0],0x81000900);
});

test('record banner retains the source unsigned conversion fallback before its final position snap',()=>{
 let s=add(state(),2);s=set(s,base+24,100);
 const r=step(s),matrix=r.effects[0];
 assert.equal(matrix.consumer,'80048a88');
 assert.equal(matrix.arguments[7],bits(-1));assert.equal(matrix.arguments[8],bits(-1));
 assert.equal(matrix.arguments[10],bits(30));
 assert.equal(word(r.state,base+8),120);assert.equal(word(r.state,base+12),93);
 assert.equal(half(r.state,base+2),1);assert.equal(word(r.state,base+24),0);
});

test('shared HUD animation clock preserves halfword wrap and signed word comparisons',()=>{
 let s=state();s=set(s,0x8a78,1,2);s=set(s,0x8a7a,3,2);s=set(s,0x8a80,2);
 s=step(s).state;assert.equal(half(s,0x8a7a),3);assert.equal(word(s,0x8a7c),1);
 s=step(s).state;assert.equal(half(s,0x8a7a),0);assert.equal(word(s,0x8a7c),0);
 s=set(s,0x8a7a,65535,2);s=set(s,0x8a80,1);s=step(s).state;assert.equal(half(s,0x8a7a),0);
 s=set(s,0x8a7c,2147483647);s=step(s).state;assert.equal(word(s,0x8a7c),-2147483648);
 s=set(s,0x8a78,0,2);assert.deepEqual(prepareNativeRaceHUDAnimationUpdate(s).operations,[]);
});

test('inactive/unknown widgets need no matrices; malformed reached dependencies fail atomically',()=>{
 const idle=state();assert.deepEqual(prepareNativeRaceWidgetUpdate(idle).operations,[]);
 let s=add(state(),1);s=set(s,base+2,9,2);
 assert.equal(prepareNativeRaceWidgetUpdate(s).operations.length,1);
 s=add(state(),1);const saved=structuredClone(s);
 assert.throws(()=>prepareNativeRaceWidgetAdvance(s,{}),/frameBufferBase/);assert.deepEqual(s,saved);
 assert.throws(()=>prepareNativeRaceWidgetAdvance(s,{...input,frameBufferBase:0xfffffffc}),/matrix range/);
 s=set(s,base+2,1,2);s=set(s,base+24,10);const before=structuredClone(s);
 assert.throws(()=>prepareNativeRaceWidgetAdvance(s,{...input,slotTemplateWords6c50:[]}),/11/);assert.deepEqual(s,before);
 const sparse=state();delete sparse.hudWords7788[1441];assert.throws(()=>prepareNativeRaceWidgetUpdate(sparse),/hudWords/);
});
