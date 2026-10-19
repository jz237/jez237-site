import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {prepareNativeCameraAuxiliaryMotion as motion} from '../native-camera-auxiliary-motion.js';
import {nativeSineTableWords} from '../native-math-tables.js';
import {prepareNativeIntroductionCameraScript as script} from '../native-introduction-camera-script.js';
const source=JSON.parse(readFileSync(new URL('./fixtures/native-camera-auxiliary-motion.json',import.meta.url)));
const scripts=JSON.parse(readFileSync(new URL('./fixtures/native-introduction-camera-scripts.json',import.meta.url)));
const hi=a=>(a-0x7788)/4;
function digest(words){const b=Buffer.alloc(words.length*4);words.forEach((v,i)=>b.writeUInt32BE(v,i*4));return createHash('sha256').update(b).digest('hex');}
test('all auxiliary motion writes match original type1/2/3 execution with exact sine-table phases',()=>{
 assert.equal(digest(nativeSineTableWords()),source.sineSHA256);assert.equal(source.cases.length,120);
 for(const c of source.cases){
  const hud=[...source.baseHud];for(const [i,w]of c.input.hudOverrides)hud[i]=w;
  const before=[...hud],q=motion({...c.input,hudWords7788:hud});
  assert.deepEqual(q.operations,c.operations);assert.equal(digest(q.hudWords7788),c.hudSHA256);assert.deepEqual(hud,before);
 }
});
test('all decoded introduction sequences supply finite changing camera positions throughout their shots',()=>{
 const b=new DataView(new ArrayBuffer(4)),number=w=>{b.setUint32(0,w);return b.getFloat32(0);};
 for(const sequence of scripts.sequences.filter(s=>s.cameraIndex===0)){
  let hud=[...scripts.baseHud];hud[hi(0x805c)]=sequence.scriptAddress;hud[hi(0x8060)]=0;const poses=new Set();
  for(let frame=0;frame<sequence.frames.length;frame++){
   hud=motion({hudWords7788:script({hudWords7788:hud}).hudWords7788}).hudWords7788;
   const position=hud.slice(hi(0x7ea8),hi(0x7ea8)+3).map(number);
   assert.ok(position.every(Number.isFinite));poses.add(position.join(','));
  }
  assert.ok(poses.size>10,sequence.scriptAddress.toString(16));
 }
});
test('unsupported types and invalid phase conversions fail without mutating caller storage',()=>{
 const c=source.cases.find(c=>c.input.cameraIndex===1),hud=[...source.baseHud];for(const [i,w]of c.input.hudOverrides)hud[i]=w;
 hud[hi(0x7f78)]=5;const before=[...hud];assert.throws(()=>motion({hudWords7788:hud,cameraIndex:1}),/Unsupported/);assert.deepEqual(hud,before);
 hud[hi(0x7f78)]=3;hud[hi(0x7f78+0x68)]=0x7f7fffff;const bad=[...hud];assert.throws(()=>motion({hudWords7788:hud,cameraIndex:1}),/phase exceeds/);assert.deepEqual(hud,bad);
});
