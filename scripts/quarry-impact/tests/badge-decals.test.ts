import test from 'node:test';
import assert from 'node:assert/strict';
import {BADGE_DECALS,trophyDecals} from '../src/badge-decals';
import {ACHIEVEMENTS} from '../src/achievements';
import {LIVERY_LIMIT,normalizeLivery} from '../src/livery';
test('every trophy decal belongs to a real badge, once, and is a valid bounded livery set',()=>{
 const ids=new Set(ACHIEVEMENTS.map(a=>a.id)),seen=new Set<string>();
 for(const d of BADGE_DECALS){
  assert.ok(ids.has(d.badge),d.badge);assert.ok(!seen.has(d.badge),'one set per badge');seen.add(d.badge);
  assert.ok(d.layers.length>0&&d.layers.length<=6,d.name);assert.ok(d.layers.length<LIVERY_LIMIT);
  // Sets survive the save normalizer unchanged, so text is never truncated and values stay in range.
  assert.deepEqual(normalizeLivery(JSON.parse(JSON.stringify(d.layers))),d.layers,d.name);
  for(const l of d.layers)if(l.face==='left'||l.face==='right'){const twin=d.layers.find(o=>o!==l&&o.face===(l.face==='left'?'right':'left')&&o.name===l.name);assert.ok(twin,d.name+' '+l.name+' has both flanks');}
 }
 assert.ok(BADGE_DECALS.length>=12);
});
test('trophy decals unlock only with their badge and name the badge when locked',()=>{
 const none=trophyDecals(undefined);assert.ok(none.every(d=>!d.unlocked));
 assert.match(none.find(d=>d.badge==='top-step')!.hint,/Top step/);
 const some=trophyDecals(['top-step','night-owl','unknown']);
 assert.deepEqual(some.filter(d=>d.unlocked).map(d=>d.badge).sort(),['night-owl','top-step']);
 // Callers get copies of the shared catalogue entries, never the catalogue itself.
 assert.notEqual(some[0],BADGE_DECALS[0]);
});
