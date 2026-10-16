import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareNativeNameEntryInput as prepare,prepareNativeNameEntryStickSpeed as speed} from '../native-name-entry.js';
import {createNativeRaceState,prepareNativeNameEntryInputUpdate as update} from '../native-race-state.js';
const hi=a=>(a-0x7788)/4,ni=a=>(a-0x61c4)/4;
function fixture({phase=1,selected=0,length=0,pressed=0,held=0,x=0,port=0,queued=0}={}){
 const scratch=Array(14).fill(0x12345678);scratch[0]=selected;scratch[1]=phase;scratch[8]=length;
 const hud=Array(1442).fill(0xabcdef12);for(let i=0;i<16;i++)hud[hi(0x87e8)+i]=i<8?i:i+15;
 hud[hi(0x88e8)]=0x41424344;hud[hi(0x88ec)]=(queued<<16|0xbeef)>>>0;
 const device=new DataView(new ArrayBuffer(40));device.setUint16(port*10,held);device.setInt8(port*10+8,x);
 return {state:createNativeRaceState({nameEntryWords61c4:scratch,hudWords7788:hud,raceWords1f94:Array(1693).fill(0),
  menuWordsE658:[0x77770000+pressed,...Array(20).fill(0)],deviceWords4308:Array.from({length:10},(_,i)=>device.getUint32(i*4)),scene:{mode608:0}}),
  views:{controllerPort4330:port,wheelAngleWord6324:0x40c90fdb,wheelAngleWord6328:0x40c90fdb,wheelAngleWord632c:0x40c90fdb,wheelAngleWord6330:0x40c90fdb,minimumSpeedWord6334:0x3e800000}};
}
const unused=()=>{throw Error('unreached input');};
const writes=(q,address)=>q.operations.filter(o=>o.kind==='nameEntryWrite'&&o.byteOffset===address-0x61c4).map(o=>o.value);
const sound=q=>q.effects.filter(o=>o.consumer==='800c37f4').map(o=>o.arguments);

test('inactive phases need no buttons, devices or wheel data',()=>{
 for(const phase of [0,6,7,8,9]){
  const {state}=fixture({phase}),s={nameEntryWords61c4:state.nameEntryWords61c4};
  for(const key of ['scene','menuWordsE658','hudWords7788','deviceWords4308'])Object.defineProperty(s,key,{get:unused});
  assert.deepEqual(prepare(s).operations,[]);
 }
});

test('confirm precedes delete and starts animation without inserting a character',()=>{
 for(const pressed of [0x8000,0x2000,0x1000,0xf000]){
  const {state,views}=fixture({pressed}),q=update(state,views);
  assert.deepEqual(writes(q,0x61c8),[4]);assert.deepEqual(writes(q,0x61e0),[0]);assert.deepEqual(sound(q),[[0x1a,0]]);
  assert.equal(q.state.hudWords7788[hi(0x88e8)],0x41424344);assert.equal(q.state.nameEntryWords61c4[8],0);
 }
});

test('full names ignore ordinary symbols but accept delete and end symbols',()=>{
 for(const [selected,audio]of [[0,null],[14,0x1a],[15,0x30]]){
  const {state,views}=fixture({length:3,selected,pressed:0x8000}),q=update(state,views);
  assert.deepEqual(sound(q),audio===null?[]:[[audio,0]]);assert.deepEqual(writes(q,0x61c8),audio===null?[]:[4]);
 }
});

test('delete clears the correct byte, including the empty-name case, and preserves its neighbors',()=>{
 for(const [length,name]of [[0,0x00424344],[1,0x00424344],[2,0x41004344],[3,0x41420044]]){
  const {state,views}=fixture({length,pressed:0x4000}),q=update(state,views);
  assert.equal(q.state.hudWords7788[hi(0x88e8)],name);assert.equal(q.state.nameEntryWords61c4[8],Math.max(0,length-1));
  assert.deepEqual(writes(q,0x61e4),length?[length-1]:[]);assert.deepEqual(sound(q),[[0x12,0]]);
 }
});

test('presses during movement do not restart selection or delete',()=>{
 for(const phase of [2,3,4,11,-1])for(const pressed of [0x8000,0x4000]){
  const {state}=fixture({phase:phase>>>0,pressed}),s={...state};Object.defineProperty(s,'deviceWords4308',{get:unused});
  assert.deepEqual(prepare(s).operations,[]);
 }
});

test('digital direction priority and analog dead zone follow the physical selected port',()=>{
 for(const port of [0,1,2,3])for(const [held,x,expected]of [[0,-12,null],[0,12,null],[0,-13,2],[0,13,3],[0x300,127,2],[0x100,-13,2],[0x100,0,3]]){
  const {state,views}=fixture({port,held,x}),q=update(state,views);
  assert.deepEqual(writes(q,0x61c8),expected===null?[]:[expected]);
  if(expected!==null)assert.equal(q.state.nameEntryWords61c4[6]&65535,0x5678);
  assert.deepEqual(q.state.deviceWords4308,state.deviceWords4308);assert.deepEqual(q.state.menuWordsE658,state.menuWordsE658);
 }
});

test('digital rotation uses unit speed without reading the analog minimum',()=>{
 const {state,views}=fixture({held:0x200});Object.defineProperty(views,'minimumSpeedWord6334',{get:unused});
 const q=update(state,views);assert.deepEqual(writes(q,0x61d8),[0x3f800000]);assert.deepEqual(writes(q,0x61dc),[0]);
 assert.deepEqual(writes(q,0x61c4),[0xffffffff,15]);assert.deepEqual(sound(q),[[0x2e,0]]);
});

test('analog speed clamps the magnitude before applying the loaded minimum',()=>{
 for(const x of [-128,-127,-71,-70,70,71,127])assert.equal(speed(x,0),0x40000000);
 for(const x of [-12,0,12])assert.equal(speed(x,0x3e800000),0x3e800000);
 assert.equal(speed(13,0x40400000),0x40400000);assert.equal(speed(13,0xbe800000),0x3d0d3dcb);
 assert.throws(()=>speed(128,0),RangeError);assert.throws(()=>speed(0,0x7f800000),RangeError);
});

test('right wrap calculates the angle with slot16 before storing slot0',()=>{
 const {state,views}=fixture({selected:15,held:0x100}),q=update(state,views);
 assert.deepEqual(q.operations.filter(o=>o.kind==='nameEntryWrite'&&[0,16].includes(o.byteOffset)).map(o=>[o.byteOffset,o.value]),[[0,16],[16,0x40c90fdb],[0,0]]);
});

test('queued rotation prioritizes left and clears its upper halfword only at the end symbol',()=>{
 const {state,views}=fixture({phase:10,queued:3}),q=update(state,views);
 assert.deepEqual(writes(q,0x61c8),[8]);assert.equal(q.state.hudWords7788[hi(0x88ec)],0xbeef);
 assert.equal(q.state.nameEntryWords61c4[5],state.nameEntryWords61c4[5]);
 const f=fixture({phase:10,queued:2,selected:14}),right=update(f.state,f.views);
 assert.equal(right.state.hudWords7788[hi(0x88ec)],0xbeef);
 const g=fixture({phase:10,queued:2,selected:1});assert.equal(update(g.state,g.views).state.hudWords7788[hi(0x88ec)],0x2beef);
});

test('exit retains ordered save, format and mode-specific menu calls without pretending to persist',()=>{
 for(const [mode,last]of [[0,'801ec20c'],[4,'801e2b8c'],[11,'801ed004'],[1,null]]){
  const f=fixture({phase:5}),s=structuredClone(f.state);s.scene.mode608=mode;
  const q=update(s);assert.deepEqual(q.effects.map(o=>o.consumer),['801e2c14','800ca210',...(last?[last]:[])]);
  assert.deepEqual(q.effects[1].arguments,[0x801ce700,0x80226284,0x802288e8]);assert.deepEqual(q.state,s);assert.equal(q.diagnostic.recordsPersisted,false);
 }
});

test('invalid late rotation data is atomic and canonical duplicate input ownership is rejected',()=>{
 const {state,views}=fixture({held:0x200}),before=structuredClone(state);views.wheelAngleWord632c=0x7fc00000;
 assert.throws(()=>update(state,views),RangeError);assert.deepEqual(state,before);assert.equal(Object.isFrozen(views),false);
 const duplicate=structuredClone(state);duplicate.scene.pressed65a=0;
 assert.throws(()=>update(duplicate,views),/overlaps/);
 const q=update(state,{...views,wheelAngleWord632c:0x40c90fdb});assert.ok(Object.isFrozen(q.state.nameEntryWords61c4));
});
