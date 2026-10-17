import test from 'node:test';import assert from 'node:assert/strict';import * as T from 'three';
import {ReplayPuddles} from '../src/replay-puddles';import {REPLAY_STRIDE,replayCarStride,type ReplayDocument} from '../src/replay-data';import {stockSetup} from '../src/garage';
function fixture(count=1){
 const meta={version:1 as const,mode:'race' as const,reverse:false,tyreModel:1 as const,cars:Array.from({length:count},(_,id)=>({id,kind:'tern' as const,setup:stockSetup('tern')})),props:0,created:''};const stride=replayCarStride(meta);
 const doc:ReplayDocument={meta,events:[],limited:false,frames:Array.from({length:61},(_,i)=>{const values=new Float32Array(stride*count);for(let c=0;c<count;c++){const o=c*stride;values.set([i*.5,1,0,0,0,0,1,5,0,0,5,1500,1,0,100],o);for(let w=0;w<4;w++){values.set([w%2?1:-1,-.4,w<2?1.5:-1.5,0,0,0,1,0],o+15+w*8);values.set([0,1,0,0,1,i<30?1:0],o+REPLAY_STRIDE+w*6);}}return{time:i/10,values};})};
 const cars=Array.from({length:count},()=>{const root=new T.Group(),model=new T.Group();model.position.set(10,.3,0);root.add(model);const wheels=Array.from({length:4},()=>new T.Object3D());model.add(...wheels);return{root,wheels};});
 return{doc,cars};
}
const snapshot=(r:ReplayPuddles)=>r.effects.drops.filter(d=>d.life>0).map(d=>[...d.p.toArray(),...d.v.toArray(),d.age,d.life]);
test('recorded contact planes produce bounded water effects and deterministic reverse/paused seeks',()=>{
 const {doc,cars}=fixture(),scene=new T.Scene(),r=new ReplayPuddles(doc,scene,[{id:1,x:20,z:0,level:0,radius:6,aspect:1,phases:[0,0,0,0]}],cars);
 try{r.update(2);assert.equal(r.effects.stats.wetWheels,4);assert.ok(r.effects.stats.active>0&&r.effects.stats.ripples>0);const expected=snapshot(r);assert.ok(expected.every(d=>d[0]>13),'wheel parent offset is retained');
  r.update(2);assert.deepEqual(snapshot(r),expected);r.update(2.8);r.update(2);assert.deepEqual(snapshot(r),expected);
  r.update(5);assert.equal(r.effects.stats.active,0);assert.equal(r.effects.stats.ripples,0);r.update(2);assert.deepEqual(snapshot(r),expected);
  assert.equal(cars[0].root.position.x,0,'source transforms remain untouched');
 }finally{r.dispose();}assert.equal(scene.children.length,0);
});
test('24-car reconstruction stays bounded and unsupported recordings invent no water contact',()=>{
 const {doc,cars}=fixture(24),scene=new T.Scene(),water={id:1,x:20,z:0,level:0,radius:20,aspect:1,phases:[0,0,0,0]},r=new ReplayPuddles(doc,scene,[water],cars);
 try{const start=performance.now();r.update(2);console.log('24-car replay water rebuild ms',performance.now()-start);assert.ok(r.effects.stats.active>0&&r.effects.stats.active<=768);assert.ok(r.effects.stats.ripples<=48);}finally{r.dispose();}
 delete doc.meta.tyreModel;const legacy=new ReplayPuddles(doc,scene,[water],cars);try{legacy.update(2);assert.equal(legacy.effects.stats.emitted,0);}finally{legacy.dispose();}
});
