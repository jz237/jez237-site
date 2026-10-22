import test from 'node:test';
import assert from 'node:assert/strict';
import {DAZE_HEARING,dazeHearing} from '../src/audio';
test('dazed hearing slides from wide open to a dull thud, monotonically, and is open when clear',()=>{
 assert.equal(dazeHearing(0),DAZE_HEARING.open);assert.ok(Math.abs(dazeHearing(1)-DAZE_HEARING.dull)<1e-6);
 const v=[0,.2,.4,.6,.8,1].map(dazeHearing);assert.ok(v.every((x,i)=>!i||x<v[i-1]),'deeper daze, duller');
 assert.equal(dazeHearing(NaN),DAZE_HEARING.open);assert.equal(dazeHearing(5),dazeHearing(1));
});
test('the mix runs through the daze filter, and main feeds it only the playing player\'s daze',async()=>{
 const fs=await import('node:fs');const audio=fs.readFileSync(new URL('../src/audio.ts',import.meta.url),'utf8'),main=fs.readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
 assert.ok(audio.includes('this.master.connect(this.dazeFilter).connect(compressor)'));
 assert.ok(/sound\.daze\(state==='playing'&&!demo&&!studio&&p\?\.extendedDamage\?/.test(main));
});
