import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {prepareNativeCameraBoot as boot} from '../native-camera-boot.js';
import {createNativeRaceMemory} from '../native-race-memory.js';
import {createNativeRaceState} from '../native-race-state.js';
const source=JSON.parse(readFileSync(new URL('./fixtures/native-camera-boot.json',import.meta.url)));
const hi=a=>(a-0x7788)/4;
test('camera bootstrap matches every original write and retains unrelated warm words',()=>{
 for(const c of source.cases){
  const hud=Array.from({length:1442},(_,i)=>c.seed?(c.seed+i*7919)>>>0:0),before=[...hud],q=boot({hudWords7788:hud});
  assert.deepEqual(q.operations,c.operations);assert.deepEqual(hud,before);
  const b=Buffer.alloc(1442*4);q.hudWords7788.forEach((v,i)=>b.writeUInt32BE(v,i*4));
  assert.equal(createHash('sha256').update(b).digest('hex'),c.hudSHA256);
  assert.ok(Object.isFrozen(q.hudWords7788));
 }
});
test('fresh solo memory initializes both script slots and retained state does not repeat boot',()=>{
 const s=createNativeRaceMemory({racers:[{lap:0,grid:0,power:0,misses:0}],courseIndex:1,players:1,mode620:0});
 for(let i=0;i<2;i++){
  const c=0x7c80+i*0x10c,p=0x8058+i*0x38;
  assert.equal(s.hudWords7788[hi(c+0xe8)],i);assert.equal(s.hudWords7788[hi(c+0xec)],1);
  assert.equal(s.hudWords7788[hi(p)],0x80227e98+i*0xe0);assert.equal(s.hudWords7788[hi(p+12)],0x802280c8+i*0x20);
 }
 const warm=structuredClone(s);warm.hudWords7788[hi(0x805c)]=0x80223d98;warm.hudWords7788[hi(0x8060)]=17;
 warm.hudWords7788[hi(0x7d6c)]=3;warm.hudWords7788[hi(0x80c8)]=24;
 assert.deepEqual(createNativeRaceState(warm),warm);
});
