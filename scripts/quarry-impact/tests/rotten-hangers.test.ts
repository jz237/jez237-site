import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {HANGER,hangerDown,rottenHanger} from '../src/age-rust';
test('a share of the oldest cars have rusted-through exhaust hangers, each car its own',()=>{
  const share=Array.from({length:300},(_,id)=>rottenHanger(1,id)).filter(Boolean).length/300;assert.ok(Math.abs(share-HANGER.share)<.08,`share ${share}`);
  assert.ok(Array.from({length:300},(_,id)=>rottenHanger(HANGER.from-.01,id)).every(r=>!r),'not on younger cars');
  assert.equal(rottenHanger(.9,4),rottenHanger(.9,4));assert.equal(rottenHanger(NaN,4),false);
});
test('the loose pipe is down in bursts, each car on its own beat',()=>{
  const down=(id:number)=>Array.from({length:600},(_,k)=>hangerDown(k/60,id));
  const a=down(1),b=down(2),share=a.filter(Boolean).length/a.length;assert.ok(share>.2&&share<.45,`down ${share} of the time`);
  let bursts=0;for(let k=1;k<a.length;k++)if(a[k]&&!a[k-1])bursts++;assert.ok(bursts>=3,'in bursts');
  assert.notDeepEqual(a,b,'its own beat');assert.equal(hangerDown(NaN,1),false);
});
test('the vehicle drags a rotten-hangered exhaust as a knocked-down one, offline only',()=>{
  const vehicle=readFileSync(new URL('../src/vehicle.ts',import.meta.url),'utf8');
  assert.ok(vehicle.includes('if(this.extendedDamage&&!this.exhaustGone&&((this.structuralDamage?.[1]??0)>EXHAUST_DROP||rottenHanger(this.surfaceFinish.rustAge,this.id)&&hangerDown(time,this.id))&&Math.abs(this.speed)>4&&this.health>0){'));
  assert.ok(vehicle.includes('this.exhaustDragTime+=fxGap;if(this.exhaustDragTime>=EXHAUST_OFF.after){this.exhaustGone=true;'),'dragged long enough, it tears off as before');
});
