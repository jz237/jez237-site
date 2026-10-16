import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareNativeRaceResultInitialization as enter} from '../native-race-prestart-stage.js';
import {prepareNativeRaceResultStatusUpdate as status,prepareNativeRaceStateOperations as apply} from '../native-race-state.js';
const ri=(slot,word)=>(0x2938-0x1f94)/4+slot*222+word,ii=a=>(a-0x9440)/4,hi=a=>(a-0x7788)/4;
function fixture(){
 const v={raceWords1f94:Array(1693).fill(0),hudWords7788:Array(1442).fill(0),i1Words9440:Array(168).fill(0),profileWordsB330:Array(52).fill(0),
  scene:{gameStateAb24:40,players:2,courseIndex:1,mode608:1,mode620:1,phase650:3,simulation648:3,activity624:-1,
   primaryHumanIndex:0,secondaryHumanIndex:1,missesEnabled72e:1,result6f0:0},bodyResultCode16c8BySlot:[1,2,3,4]};
 v.i1Words9440[0]=0xffffffff;return v;
}
const calls=r=>r.operations.filter(op=>op.kind==='externalCall');

test('source finish commits the stage before the winner HUD and increments only the winning profile',()=>{
 const v=fixture();v.raceWords1f94[ri(1,189)]=1;v.raceWords1f94[ri(1,103)]=12345;
 const before=structuredClone(v),r=status(v);
 assert.deepEqual(v,before);assert.equal(r.state.scene.gameStateAb24,42);assert.equal(r.state.scene.previousGameState634,40);
 assert.equal(r.state.scene.result6f0,1);assert.equal(r.state.scene.initLatch63c,1);
 assert.equal(r.state.scene.simulation648,3);assert.equal(r.state.scene.activity624,-1);
 assert.equal(r.state.profileWordsB330[48],0);assert.equal(r.state.profileWordsB330[49],1);
 assert.equal(r.state.hudWords7788[hi(0x8aa8)],2);
 assert.equal(r.operations.at(-1).kind,'hudWrite');
 assert.deepEqual(calls(r).map(c=>[c.consumer,c.arguments]),[
  ['801e6fb0',[1,4,100]],['801e6a4c',[0,0]],['800c1f60',[6]],['800c21f4',[6,2]],['800bfd34',[]],['800bfd68',[]]]);
});

test('equal finish times and double disqualification select tie stage without a win',()=>{
 for(const finish of [false,true]){
  const v=fixture();for(let i=0;i<2;i++){v.raceWords1f94[ri(i,finish?189:187)]=1;v.raceWords1f94[ri(i,103)]=100;}
  const r=status(v);assert.equal(r.state.scene.gameStateAb24,44);assert.equal(r.state.scene.result6f0,3);
  assert.equal(r.state.hudWords7788[hi(0x8aa8)],3);assert.deepEqual(r.state.profileWordsB330.slice(48,50),[0,0]);
  assert.deepEqual(calls(r).map(c=>c.consumer),['801e6fb0','801e6a4c','800c1f60','800c21f4','800bfd34','800bfd68']);
 }
});

test('solo DQ preserves source music delay and reset ordering',()=>{
 for(const retained of [0,1]){
  const v=fixture();Object.assign(v.scene,{players:1,mode608:0,mode620:0});v.raceWords1f94[ri(0,187)]=2;
  v.i1Words9440[ii(0x9510)]=retained;v.i1Words9440[ii(0x96a4)]=9;v.i1Words9440[ii(0x96a0)]=8;
  const r=status(v);assert.equal(r.state.scene.gameStateAb24,41);assert.equal(r.state.i1Words9440[ii(0x96a4)],0);
  assert.equal(r.state.i1Words9440[ii(0x96a0)],0);assert.equal(r.state.i1Words9440[ii(0x950c)],retained?120:0);
  assert.equal(calls(r).some(c=>c.consumer==='801e6fb0'),!retained);
  assert.deepEqual(calls(r).find(c=>c.consumer==='801e6a4c'&&c.arguments[0]===4).arguments,[4,1]);
  assert.deepEqual(calls(r).slice(-4).map(c=>c.consumer),['800bfd34','800bfd68','800c1f60','800c21f4']);
 }
});

test('solo finish reads selected actual body code and retains mode11-specific call',()=>{
 for(const [code,duration]of [[-1,100],[0,100],[1,130],[2,140],[3,100],[4,120],[5,110],[6,100]]){
  const v=fixture();Object.assign(v.scene,{players:1,mode608:11,mode620:11,primaryHumanIndex:3});
  v.bodyResultCode16c8BySlot[3]=code;
  const prepared=enter(v,'802c6fe0'),r=apply(v,prepared.operations);
  assert.equal(r.state.i1Words9440[ii(0x9504)],duration);
  assert.deepEqual(calls(prepared)[0].arguments,[1,4,duration]);
  assert.equal(calls(prepared).some(c=>c.consumer==='800c1f60'),false);
 }
});

test('cup qualification writes four halfwords in the shared extended profile using signed comparisons',()=>{
 const v=fixture();Object.assign(v.scene,{mode608:4,field704:1,field708:0,field70c:-1,field710:2147483647,field714:-2147483648});
 v.profileWordsB330[50]=0xdeadbeef;v.profileWordsB330[51]=0xabcdef12;
 for(const [i,place]of [0,0,2147483647,-2147483648].entries())v.raceWords1f94[ri(i,1)]=place>>>0;
 const r=apply(v,enter(v,'802c6fe0').operations);
 assert.deepEqual(r.state.profileWordsB330.slice(50),[0x00010000,0x00010001]);
 assert.deepEqual(v.profileWordsB330.slice(50),[0xdeadbeef,0xabcdef12]);
 v.profileWordsB330.length=50;assert.throws(()=>enter(v,'802c6fe0'),/extended/);
});

test('unreached inputs remain lazy and a missing reached body sample is transactional',()=>{
 const v=fixture();delete v.bodyResultCode16c8BySlot;
 assert.doesNotThrow(()=>enter(v,'802c7394'));
 Object.assign(v.scene,{players:1,mode608:0,mode620:0});v.raceWords1f94[ri(0,189)]=1;
 const before=structuredClone(v);assert.throws(()=>status(v),/body result code16c8/);assert.deepEqual(v,before);
 assert.throws(()=>enter(v,'unknown'),/Unknown source result/);
});
