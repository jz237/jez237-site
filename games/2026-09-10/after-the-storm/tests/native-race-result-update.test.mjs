import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareNativeRaceResultStageUpdate as update,nativeRaceStateSnapshot} from '../native-race-state.js';
const ri=a=>(a-0x1f94)/4,ii=a=>(a-0x9440)/4,hi=a=>(a-0x7788)/4;
function fixture(){return {scene:{players:1,mode608:0,gameStateAb24:42,courseIndex:1,nameIndexA9b0:0,reverseDab68:0,
 pressed65a:0,unlockAb60:0,metadataCb32c:123},raceWords1f94:Array(1693).fill(0),hudWords7788:Array(1442).fill(0),
 i1Words9440:Array(168).fill(0),profileWordsB330:Array(52).fill(0),saveWordsB280:Array(34).fill(0xaabbccdd)};}
const effects=r=>r.effects.filter(c=>c.kind==='externalCall').map(c=>c.consumer);
function setName(v,index,bytes){
 const start=0x18+index*14;for(const [i,b]of bytes.entries()){
  const offset=start+i,shift=24-(offset&3)*8,at=offset>>>2;
  v.saveWordsB280[at]=((v.saveWordsB280[at]&~(255<<shift))|(b<<shift))>>>0;
 }
}
const templates={expandTransitions:true,fadeTemplateWords6cc0:Array(9).fill(0),slotTemplateWords6c50:Array(11).fill(0x12345678)};

test('source fade initialization changes the later same-call HUD completion gate',()=>{
 const v=fixture();v.hudWords7788[hi(0x8a14)]=1;v.i1Words9440[ii(0x9504)]=1;v.i1Words9440[ii(0x9508)]=1199;
 const before=structuredClone(v),opaque=update(v,'802c6550'),expanded=update(v,'802c6550',templates);
 assert.ok(effects(opaque).includes('800ad3c4'));assert.equal(effects(expanded).includes('800ad3c4'),false);
 assert.equal(expanded.state.hudWords7788[hi(0x8a14)]&65535,0);assert.equal(expanded.state.i1Words9440[ii(0x9500)],1);
 assert.equal(expanded.state.i1Words9440[ii(0x9508)],1200);assert.deepEqual(v,before);
});

test('qualified expiry enters original state45 and resets actual HUD slots before its notice',()=>{
 const v=fixture();v.scene.gameStateAb24=41;v.i1Words9440[ii(0x9510)]=1;v.i1Words9440[ii(0x950c)]=1;
 const r=update(v,'802c63b4',templates);
 assert.equal(r.state.scene.previousGameState634,41);assert.equal(r.state.scene.gameStateAb24,45);
 assert.equal(r.state.scene.returnState630,102);assert.equal(r.state.scene.initLatch63c,1);
 assert.equal(r.state.hudWords7788[hi(0x8aa4)],1);
 assert.deepEqual(r.state.hudWords7788.slice(hi(0x8930),hi(0x8930)+55),Array(55).fill(0x12345678));
 assert.deepEqual(effects(r),['800c21f4']);assert.deepEqual(r.effects[0].arguments,[3,0]);
});

test('result delay keeps source wrap, clamping and pressed-button mask',()=>{
 const v=fixture();v.i1Words9440[ii(0x9504)]=0x80000000;
 assert.equal(update(v,'802c6550').state.i1Words9440[ii(0x9504)],0x7fffffff);
 v.i1Words9440[ii(0x9504)]=0;v.scene.pressed65a=0x4000;
 let r=update(v,'802c6550');assert.equal(r.state.i1Words9440[ii(0x9504)],0);assert.equal(r.state.i1Words9440[ii(0x9500)],0);
 assert.equal(r.operations.filter(o=>o.kind==='i1Write'&&o.byteOffset===0x9504-0x9440).length,2);
 for(const pressed of [0x1000,0x2000,0x8000]){v.scene.pressed65a=pressed;assert.equal(update(v,'802c6550').state.i1Words9440[ii(0x9500)],1);}
});

test('normal, reverse and lap record names preserve numeric records and neighboring bytes',()=>{
 for(const reverse of [0,65535]){
  const v=fixture();v.scene.reverseDab68=reverse;v.scene.nameIndexA9b0=7;v.i1Words9440[ii(0x9500)]=1;
  v.hudWords7788[hi(0x8a14)]=1;v.raceWords1f94[ri(0x2650)]=2;v.raceWords1f94[ri(0x2654)]=1;
  setName(v,7,[0x80,0xff,0x41]);const before=structuredClone(v),r=update(v,'802c6550');
  const timeName=reverse?0x23b0+20+16:0x1ff0+60+40-4,lapName=0x22c0+20+16;
  assert.equal(r.state.raceWords1f94[ri(timeName)],0x80ff4100);assert.equal(r.state.raceWords1f94[ri(lapName)],0x80ff4100);
  assert.deepEqual(r.state.raceWords1f94.filter((_,i)=>![ri(timeName),ri(lapName)].includes(i)),
   before.raceWords1f94.filter((_,i)=>![ri(timeName),ri(lapName)].includes(i)));
  assert.deepEqual(effects(r),['800ad3c4',reverse?'8007c204':'8007bea4','801ec9c8']);
  assert.equal(r.state.scene.metadataCb32c,123);assert.deepEqual(v,before);
 }
});

test('mode11 stores initials and sets the unlock bit once without losing adjacent save bytes',()=>{
 const v=fixture();v.scene.mode608=11;v.hudWords7788[hi(0x8a14)]=1;
 v.raceWords1f94[ri(0x2928)]=1;v.raceWords1f94[ri(0x2930)]=1;setName(v,0,[65,66,67]);
 const r=update(v,'802c6550');assert.equal(r.state.raceWords1f94[ri(0x26e8+48+16-4)],0x41424300);
 assert.equal(r.state.saveWordsB280[0],0xbabbccdd);assert.equal(r.state.scene.unlockAb60,1);
 assert.deepEqual(effects(r),['800ad3c4','8007c0b8','8007c494','801ecf18']);
 assert.equal(effects(update(r.state,'802c6550')).includes('8007c494'),false);
 assert.deepEqual(nativeRaceStateSnapshot(r.state).saveWordsB280,r.state.saveWordsB280);
});

test('cup DQ clears only its four standings cells and increments the current round',()=>{
 const v=fixture();v.scene.mode608=4;v.hudWords7788[hi(0x8a14)]=1;v.profileWordsB330.fill(9);
 v.profileWordsB330[0]=0;v.profileWordsB330[1]=3;
 const r=update(v,'802c63b4'),at=(0xb350-0xb330)/4+3*4;
 assert.equal(r.state.scene.participantCount60e,4);assert.equal(r.state.profileWordsB330[1],4);
 assert.deepEqual(r.state.profileWordsB330.slice(at,at+4),[0,0,0,0]);assert.equal(r.state.profileWordsB330[at-1],9);
 assert.deepEqual(effects(r),['801eb91c','800ad3c4']);
});

test('tie routing retains call order and late missing data rejects all earlier writes',()=>{
 const v=fixture();v.hudWords7788[hi(0x8a14)]=1;
 assert.deepEqual(effects(update(v,'802c6b00')),['800ad3c4','801ece50']);
 v.raceWords1f94[ri(0x2650)]=1;v.scene.nameIndexA9b0=8;const before=structuredClone(v);
 assert.throws(()=>update(v,'802c6550'),/byte offset/);assert.deepEqual(v,before);
 delete v.saveWordsB280;assert.throws(()=>update(v,'802c6550'),/saveWordsB280/);
 assert.throws(()=>update(fixture(),'802c6550',{expandTransitions:'yes'}),/boolean/);
});
