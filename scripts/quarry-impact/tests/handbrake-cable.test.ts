import test from 'node:test';
import assert from 'node:assert/strict';
import {HANDBRAKE_CABLE,handbrakeSnaps} from '../src/damage-handling';
test('only a big hit at a crushed rear can part the handbrake cables, about HANDBRAKE_CABLE.chance of the time',()=>{
 let n=0;for(let seed=0;seed<1000;seed++)if(handbrakeSnaps(.6,20,true,seed))n++;assert.ok(Math.abs(n/1000-HANDBRAKE_CABLE.chance)<.05,`${n}`);
 for(let seed=0;seed<200;seed++){assert.ok(!handbrakeSnaps(HANDBRAKE_CABLE.crush-.01,20,true,seed));assert.ok(!handbrakeSnaps(.6,HANDBRAKE_CABLE.blow-.1,true,seed));assert.ok(!handbrakeSnaps(.6,20,false,seed),'a hit elsewhere');}
 assert.ok(!handbrakeSnaps(NaN,20,true,1)&&!handbrakeSnaps(.6,20,true,NaN));
});
test('with the cables parted the lever does nothing; a failure moment with its own toast',async()=>{
 const fs=await import('node:fs'),vehicle=fs.readFileSync(new URL('../src/vehicle.ts',import.meta.url),'utf8'),main=fs.readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
 assert.ok(vehicle.includes('const handbrake=this.handbrakeCable?false:raw.handbrake;'));
 assert.ok(vehicle.includes('this.ownInput={...raw,steer,throttle,handbrake};'),'the physics reads the modified input');
 assert.ok(main.includes("handbrake:{label:'HANDBRAKE CABLE SNAPPED',score:20}")&&main.includes("what==='handbrake'?'HANDBRAKE CABLE SNAPPED':"));
});
