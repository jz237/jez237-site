import test from 'node:test';import assert from 'node:assert/strict';import * as T from 'three';
import {ReplayFire} from '../src/replay-fire';import {replayCarStride,type ReplayDocument} from '../src/replay-data';import {stockSetup} from '../src/garage';
function doc(count=1):ReplayDocument{
 const meta={version:1 as const,mode:'derby' as const,reverse:false,thermalModel:1 as const,cars:Array.from({length:count},(_,id)=>({id,kind:'tern' as const,setup:stockSetup('tern')})),props:0,created:''};const stride=replayCarStride(meta);
 return{meta,events:[],limited:false,frames:Array.from({length:101},(_,i)=>{const values=new Float32Array(stride*count);for(let c=0;c<count;c++){values[c*stride+54]=i>=90?1:0;values.set([i>=90?0:.8,i/10,1,c*2],c*stride+stride-4);}return{time:i/10,values};})};
}
const camera=()=>{const c=new T.PerspectiveCamera();c.position.set(0,5,30);c.lookAt(0,1,0);c.updateMatrixWorld();return c;};
const snapshot=(f:ReplayFire)=>f.fire.particles.filter(p=>p.life>0).map(p=>[p.owner,p.kind,p.age,p.life,...p.p.toArray(),p.seed,p.strength]);
test('replay fire seeks deterministically, keeps smoke trails and clears repair epochs',()=>{
 const scene=new T.Scene(),f=new ReplayFire(doc(),scene),c=camera();
 try{f.update(5,c);const expected=snapshot(f);assert.ok(expected.length>10);const flames=f.fire.particles.filter(p=>p.life>0&&p.kind===1),smoke=f.fire.particles.filter(p=>p.life>0&&p.kind===0);assert.ok(flames.every(p=>Math.abs(p.p.x-5)<.21));assert.ok(smoke.some(p=>p.p.x<4));assert.ok(f.fire.lights.some(l=>l.intensity>0));
 f.update(5,c);assert.deepEqual(snapshot(f),expected,'paused output stays fixed');f.update(8,c);f.update(5,c);assert.deepEqual(snapshot(f),expected,'reverse seek is independent of prior updates');
 f.update(9.1,c);assert.equal(snapshot(f).length,0);assert.ok(f.fire.lights.every(l=>l.intensity===0));f.update(0,c);assert.ok(f.fire.particles.filter(p=>p.life>0).every(p=>p.age===0));
 }finally{f.dispose();}assert.equal(scene.children.length,0);
});
test('full field stays within the particle budget and legacy recordings invent no fire',()=>{
 const scene=new T.Scene(),f=new ReplayFire(doc(24),scene);try{f.update(6,camera());assert.ok(snapshot(f).length<=640);assert.equal(new Set(snapshot(f).map(p=>p[0])).size,24);assert.ok(f.fire.mesh.geometry.instanceCount<=640);}finally{f.dispose();}
 const old=doc();delete old.meta.thermalModel;const legacy=new ReplayFire(old,scene);try{legacy.update(5,camera());assert.equal(snapshot(legacy).length,0);}finally{legacy.dispose();}
});
