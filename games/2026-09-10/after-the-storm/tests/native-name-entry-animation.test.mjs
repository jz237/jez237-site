import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareNativeNameEntryAnimationPhase as prepare} from '../native-name-entry.js';
import {createNativeRaceState,prepareNativeNameEntryInitializationUpdate as initialize,
 prepareNativeNameEntryAnimationPhaseUpdate as animate,prepareNativeNameEntryInputUpdate as input} from '../native-race-state.js';
const hi=a=>(a-0x7788)/4,ni=a=>(a-0x61c4)/4;
function word(f){const d=new DataView(new ArrayBuffer(4));d.setFloat32(0,f);return d.getUint32(0);}
function fixture(){
 const pair=new DataView(new ArrayBuffer(8));pair.setFloat64(0,Math.PI*2);
 const views={controllerPort4330:0,minimumSpeedWord6334:word(.25),characterBytes60bc:Array.from({length:29},(_,i)=>65+i),
  confirmAngleWords62d0:[pair.getUint32(0),pair.getUint32(4)]};
 for(const key of ['wheelAngleWord62f4','wheelAngleWord6324','wheelAngleWord6328','wheelAngleWord632c','wheelAngleWord6330','leftWrapWord62bc','rightWrapThresholdWord62c8','rightWrapWord62cc'])views[key]=word(Math.PI*2);
 for(const key of ['introRadiusWord62b0','outroRadiusWord62e0','confirmEndRadiusWord62d8','confirmStartRadiusWord62dc'])views[key]=word(750);
 for(const key of ['queuedLeftSpeedWord62b4','queuedRightSpeedWord62c0','leftSpeedWord62b8','rightSpeedWord62c4'])views[key]=word(.15);
 const state=createNativeRaceState({raceWords1f94:Array(1693).fill(0),hudWords7788:Array(1442).fill(0),nameEntryWords61c4:Array(14).fill(0),
  deviceWords4308:Array(10).fill(0),menuWordsE658:Array(21).fill(0),scene:{mode608:0,freshNameAb6c:1,field700:0}});
 return {state:initialize(state,views).state,views};
}
function press(state,views,button){const next=structuredClone(state);next.menuWordsE658[0]=button;return input(next,views).state;}
function ticks(state,views,count){for(let i=0;i<count;i++)state=animate(state,views).state;return state;}

test('entry takes31 source updates and initializes the visible wheel window',()=>{
 const {state,views}=fixture();let s=ticks(state,views,30);
 assert.equal(s.nameEntryWords61c4[1],0);assert.equal(s.nameEntryWords61c4[7],30);
 s=animate(s,views).state;assert.equal(s.nameEntryWords61c4[1],1);assert.equal(s.nameEntryWords61c4[2],word(750));
 assert.equal(s.nameEntryWords61c4[7],0);assert.equal(s.nameEntryWords61c4[9],1);
 assert.equal(s.hudWords7788[hi(0x87e0)],13);assert.equal(s.hudWords7788[hi(0x87e4)],3);
});

test('three confirmations commit at tick16 then seek END before exit',()=>{
 const f=fixture();let s=ticks(f.state,f.views,31);
 for(let length=0;length<3;length++){
  s=press(s,f.views,0x8000);s=ticks(s,f.views,15);
  assert.equal(s.nameEntryWords61c4[8],length);assert.equal(s.nameEntryWords61c4[1],4);
  s=animate(s,f.views).state;assert.equal(s.nameEntryWords61c4[8],length+1);
 }
 assert.equal(s.hudWords7788[hi(0x88e8)],0x41414100);assert.equal(s.nameEntryWords61c4[1],10);
 assert.equal(s.hudWords7788[hi(0x88ec)],0x10000);
 s=press(s,f.views,0);assert.equal(s.nameEntryWords61c4[0],15);assert.equal(s.nameEntryWords61c4[1],8);
 assert.equal(s.hudWords7788[hi(0x88ec)],0);s=ticks(s,f.views,3);assert.equal(s.nameEntryWords61c4[1],1);
 s=press(s,f.views,0x8000);s=ticks(s,f.views,16);assert.equal(s.nameEntryWords61c4[1],7);
 s=ticks(s,f.views,30);assert.equal(s.nameEntryWords61c4[1],7);s=animate(s,f.views).state;assert.equal(s.nameEntryWords61c4[1],5);
 assert.deepEqual(input(s,f.views).effects.map(o=>o.consumer),['801e2c14','800ca210','801ec20c']);
});

test('championship END skips the exit animation',()=>{
 const f=fixture(),s=structuredClone(f.state);s.scene.mode608=4;s.nameEntryWords61c4[0]=15;s.nameEntryWords61c4[1]=4;s.nameEntryWords61c4[7]=15;
 const q=animate(s,f.views);assert.equal(q.state.nameEntryWords61c4[1],5);assert.equal(q.state.nameEntryWords61c4[7],16);
 assert.deepEqual(input(q.state,f.views).effects.at(-1),{kind:'externalCall',consumer:'801e2b8c',arguments:[0x42]});
});

test('confirmation delete clears one byte and keeps a full name inside its owner',()=>{
 const f=fixture(),s=structuredClone(f.state);s.nameEntryWords61c4[0]=14;s.nameEntryWords61c4[1]=4;s.nameEntryWords61c4[7]=15;
 s.nameEntryWords61c4[8]=3;s.hudWords7788[hi(0x88e8)]=0x41424344;
 const q=animate(s,f.views);assert.equal(q.state.nameEntryWords61c4[1],1);assert.equal(q.state.nameEntryWords61c4[8],2);
 assert.equal(q.state.hudWords7788[hi(0x88e8)],0x41420044);
});

test('confirmation pose contracts and expands around tick8 without changing the name early',()=>{
 const f=fixture(),s=structuredClone(f.state);s.nameEntryWords61c4[1]=4;
 for(const [before,radius]of [[0,700],[6,400],[7,350],[8,400],[14,700]]){
  s.nameEntryWords61c4[7]=before;const q=animate(s,f.views);
  assert.equal(q.confirmationPose.radiusWord,word(radius));assert.equal(q.state.hudWords7788[hi(0x88e8)],0);
  assert.equal(q.motionActive,true);assert.equal(q.diagnostic.matrixProjectionPending,true);
 }
});

test('manual movement refreshes analog speed and returns to idle at the target',()=>{
 const f=fixture(),s=structuredClone(f.state);s.nameEntryWords61c4[1]=3;s.nameEntryWords61c4[3]=word(.95);
 s.nameEntryWords61c4[4]=word(1);s.nameEntryWords61c4[6]=0x10099;s.deviceWords4308[2]=127<<24;
 const q=animate(s,f.views);assert.equal(q.state.nameEntryWords61c4[5],word(2));assert.equal(q.state.nameEntryWords61c4[3],word(1));
 assert.equal(q.state.nameEntryWords61c4[1],1);assert.equal(q.state.nameEntryWords61c4[6],0x10099);
});

test('queued movement preserves phase10 while queued bits remain and wraps the right angle afterward',()=>{
 const f=fixture(),s=structuredClone(f.state);s.nameEntryWords61c4[1]=9;s.nameEntryWords61c4[3]=word(6.2);
 s.nameEntryWords61c4[4]=word(Math.PI*2);s.hudWords7788[hi(0x88ec)]=0x200ff;
 const q=animate(s,f.views);assert.equal(q.state.nameEntryWords61c4[1],10);assert.equal(q.state.nameEntryWords61c4[3],word(0));
 assert.equal(q.state.hudWords7788[hi(0x88ec)],0x200ff);
});

test('visible window wraps both endpoints and initialization is a separate outer-latch responsibility',()=>{
 const f=fixture(),s=structuredClone(f.state);s.nameEntryWords61c4[1]=1;s.nameEntryWords61c4[0]=15;
 const q=prepare(s);assert.equal(q.motionActive,true);assert.equal(q.confirmationPose,null);
 assert.deepEqual(q.operations.map(o=>o.value),[12,18,2]);assert.equal(s.scene.freshNameAb6c,0);
});

test('invalid character data rejects after prepared writes without changing retained state',()=>{
 const f=fixture(),s=structuredClone(f.state);s.nameEntryWords61c4[1]=4;s.nameEntryWords61c4[7]=15;
 const before=structuredClone(s);f.views.characterBytes60bc[0]=256;
 assert.throws(()=>animate(s,f.views),RangeError);assert.deepEqual(s,before);assert.equal(Object.isFrozen(f.views),false);
});
