import test from 'node:test';import assert from 'node:assert/strict';
import {prepareNativeRaceCameraInput as inputUpdate} from '../native-race-camera-input.js';
import {prepareNativeRaceCameraInputUpdate as update,prepareNativeRaceResultDisplayUpdate as display,prepareNativeRaceStateOperations} from '../native-race-state.js';
import {createNativeRaceCameraStorage} from '../native-race-camera-storage.js';
const F=Math.fround,hi=a=>(a-0x7788)/4;
const bits=n=>{const v=new DataView(new ArrayBuffer(4));v.setFloat32(0,n);return v.getUint32(0);};
const value=(s,a)=>{const v=new DataView(new ArrayBuffer(4));v.setUint32(0,s.hudWords7788[hi(a)]);return v.getFloat32(0);};
function sample(players=1){return {players,hudWords7788:Array(1442).fill(0),controllerPortsByView:[0,1],pressedButtonsByController:[0,0,0,0],
 bodyStatesBySlot:[{actorStateC54:22},{actorStateC54:22}],cameraModeWords3940:[72,75,90,90,200,140,90,80,23,23,23,30,0,0,12,62].map(bits),
 cameraBlendWords6018:[.3,.2,.07,.15].map(bits)};}
function state(input){return {scene:{players:input.players},hudWords7788:input.hudWords7788,raceWords1f94:Array(1693).fill(0)};}
const sounds=r=>r.effects.filter(o=>o.kind==='audioEntry').map(o=>o.arguments);

test('camera buttons prepare ordered toggle, mode sound and auxiliary writes on one HUD owner',()=>{
 const q=sample();q.pressedButtonsByController[0]=10;q.hudWords7788[hi(0x7d6c)]=1;
 const before=structuredClone(q),r=update(state(q),q);
 assert.deepEqual(q,before);assert.deepEqual(sounds(r),[[0x11,0],[0x1d,0]]);
 assert.equal(r.state.hudWords7788[hi(0x7d6c)],2);assert.equal(r.state.hudWords7788[hi(0x7d78)],1);
 assert.equal(r.state.hudWords7788[hi(0x7f74)],1);
 assert.equal(value(r.state,0x7ed4),90);assert.equal(value(r.state,0x7f40),90);assert.equal(value(r.state,0x7f58),23);
 for(const a of [0x7f5c,0x7f44,0x7ed8])assert.equal(value(r.state,a),F(.2));
 assert.equal(value(r.state,0x7d7c),F(F(12)*F(.2)));
 assert.deepEqual(r.operations.slice(0,3).map(o=>o.kind),['hudWrite','audioEntry','hudWrite']);
});

test('mode wrap determines sound by resulting signed order and preserves raw toggle bits',()=>{
 for(const [mode,button,next,sound]of [[0,4,3,0x1d],[3,8,0,0x1e],[-2147483648,0,3,0x1d],[2147483647,8,3,0x1e]]){
  const q=sample();q.hudWords7788[hi(0x7d6c)]=mode>>>0;q.pressedButtonsByController[0]=button;
  const r=update(state(q),q);assert.equal(r.state.hudWords7788[hi(0x7d6c)],next);assert.deepEqual(sounds(r),[[sound,0]]);
  assert.equal(value(r.state,0x7f5c),F(.3));
 }
 const q=sample();q.hudWords7788[hi(0x7d6c)]=3;q.hudWords7788[hi(0x7d78)]=0x80000000;q.pressedButtonsByController[0]=15;
 const r=update(state(q),q);assert.equal(r.state.hudWords7788[hi(0x7d6c)],3);
 assert.equal(r.state.hudWords7788[hi(0x7d78)],0x80000001);assert.deepEqual(sounds(r),[[0x11,0]]);
 assert.equal(value(r.state,0x7d7c),F(F(62)*F(.07)));
 q.hudWords7788[hi(0x7d78)]=1;assert.deepEqual(sounds(update(state(q),q)),[[0x16,0]]);
});

test('actor-specific targets and blend rates read actual body state and the frame56 boundary',()=>{
 for(const [actor,frame,target,rate]of [[22,undefined,12,.07],[7,55,0,.07],[7,56,12,.07],[23,undefined,10,.15],[24,undefined,10,.15],[25,undefined,10,.07]]){
  const q=sample();q.hudWords7788[hi(0x7d6c)]=2;q.hudWords7788[hi(0x7d7c)]=bits(20);
  q.bodyStatesBySlot[0]={actorStateC54:actor,animationFrameC58:frame};const r=update(state(q),q);
  assert.equal(value(r.state,0x7d7c),F(F(20)+F(F(target-20)*F(rate))));
  assert.equal(r.diagnostic.views[0].target,target);assert.equal(r.diagnostic.views[0].blend,F(rate));
 }
 for(const mode of [0,1,2,3]){
  const q=sample();q.hudWords7788[hi(0x7d6c)]=mode;
  assert.equal(inputUpdate(q).diagnostic.views[0].blend,F(.07),'unchanged rate is fixed, not indexed by mode');
 }
});

test('controller remapping affects button selection but body reads retain view ordinal',()=>{
 const q=sample(2);q.controllerPortsByView=[3,1];q.pressedButtonsByController=[0,4,0,8];
 q.hudWords7788[hi(0x7d6c)]=1;q.hudWords7788[hi(0x7e78)]=2;
 q.bodyStatesBySlot=[{actorStateC54:23},{actorStateC54:7,animationFrameC58:55}];
 const r=update(state(q),q);assert.deepEqual(sounds(r),[[0x1d,0],[0x1e,1]]);
 assert.deepEqual(r.diagnostic.views.map(v=>[v.controllerPort,v.mode,v.actorStateC54,v.target]),[[3,2,23,10],[1,1,7,0]]);
 assert.equal(value(r.state,0x7d7c),F(10*F(.15)));assert.equal(value(r.state,0x7e88),0);
});

test('water-camera transport preserves retained input fields and auxiliary state',()=>{
 const q=sample(2);q.pressedButtonsByController=[9,6,0,0];let current=update(state(q),q).state;
 const before=structuredClone(current),storage=createNativeRaceCameraStorage({players:2,readState:()=>current,
  commit:operations=>{current=prepareNativeRaceStateOperations(current,operations).state;}});
 const camera={eyeNative:[1,2,3],forward:[0,0,1],up:[0,1,0],targetNative:[4,5,6],horizontalForward:[0,1],fovDegrees:60,nearNative:10,projectionOffset:[0,0]};
 storage.write([camera,camera]);
 for(const base of [0x7c80,0x7d8c])for(const offset of [0xec,0xf8,0xfc])assert.equal(current.hudWords7788[hi(base+offset)],before.hudWords7788[hi(base+offset)]);
 assert.deepEqual(current.hudWords7788.slice(hi(0x7e98),hi(0x8058)),before.hudWords7788.slice(hi(0x7e98),hi(0x8058)));
 assert.equal(storage.read()[0].eyeNative[0],1);
});

test('result dispatcher expands camera input before result state changes and only on game40',()=>{
 const q=sample(2);q.pressedButtonsByController[0]=8;
 const s={...state(q),scene:{players:2,initLatch63c:0,gameStateAb24:40,courseIndex:1,mode608:1,mode620:1,activity624:-1,
  phase650:3,simulation648:3,primaryHumanIndex:0,secondaryHumanIndex:1,missesEnabled72e:1,result6f0:0},
  i1Words9440:Array(168).fill(0),profileWordsB330:Array(52).fill(0)};
 s.i1Words9440[0]=0xffffffff;s.raceWords1f94[(0x2938-0x1f94)/4+189]=1;
 const options={expandCameraInput:true,cameraInput:q,externalReturns:{'8009328c':0x81050000,'801e5554':0x81050020}};
 const r=display(s,options);assert.equal(r.state.scene.gameStateAb24,42);assert.equal(r.state.hudWords7788[hi(0x7d6c)],1);
 assert.equal(r.effects.some(o=>o.consumer==='801de3cc'),false);
 const cameraWrite=r.operations.findIndex(o=>o.kind==='hudWrite'&&o.byteOffset===0x7d6c-0x7788),resultWrite=r.operations.findIndex(o=>o.field==='gameStateAb24');
 assert.ok(cameraWrite>=0&&cameraWrite<resultWrite);
 const held=display(r.state,{...options,cameraInput:undefined});assert.equal(held.state.hudWords7788[hi(0x7d6c)],1);
 assert.throws(()=>display(s,{...options,cameraInput:undefined}),/camera|hud/i);
 assert.throws(()=>display(s,{...options,expandCameraInput:1}),/boolean/);
});

test('nonpositive views skip all dependencies and late failures leave inputs unchanged',()=>{
 for(const players of [0,-1])assert.deepEqual(inputUpdate({players}),{operations:[],diagnostic:{views:[]}});
 assert.throws(()=>inputUpdate({players:3}),/at most two/);
 const q=sample(2),before=structuredClone(q);q.bodyStatesBySlot[1]=undefined;
 const invalid=structuredClone(q);assert.throws(()=>inputUpdate(q),/body slot1/);assert.deepEqual(q,invalid);
 q.bodyStatesBySlot=before.bodyStatesBySlot;q.controllerPortsByView[1]=4;assert.throws(()=>inputUpdate(q),/controller port/);
 const single=sample();single.cameraModeWords3940[1]=0x7fc00000;single.cameraBlendWords6018[3]=0x7fc00000;
 assert.doesNotThrow(()=>inputUpdate(single));single.bodyStatesBySlot[0]={actorStateC54:7};assert.throws(()=>inputUpdate(single),/animation frame/);
 single.bodyStatesBySlot[0]={actorStateC54:22};single.hudWords7788[hi(0x7d7c)]=0x7f800000;
 assert.throws(()=>inputUpdate(single),/finite float32/);
});
