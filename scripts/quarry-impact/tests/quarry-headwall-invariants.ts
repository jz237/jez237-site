import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { overlapsQuarryHeadwall, type ColliderSpec } from '../src/quarry-layout';

export const headwallBaseline=JSON.parse(readFileSync(new URL('./fixtures/quarry-headwall-baseline.json',import.meta.url),'utf8'));
const hash=(s:ColliderSpec)=>createHash('sha256').update(JSON.stringify(s)).digest('hex');
/** Preserve historical milestones instead of rewriting their original evidence. */
export function assertHeadwallEvolution(layout:ColliderSpec[]){
  const before=new Map<string,{id:string;p:{x:number;y:number;z:number};hash:string}>(headwallBaseline.colliders.map((s:{id:string})=>[s.id,s]));
  const current=new Map(layout.map(s=>[s.id,s]));assert.equal(current.size,layout.length,'shared collider IDs remain unique');
  for(const spec of layout){
    if(spec.id==='quarry-cliffs')continue; // Exact index mask and unchanged vertices checked separately.
    if(before.has(spec.id))assert.equal(hash(spec),before.get(spec.id)!.hash,`${spec.id} must preserve its shape and transform`);
    else assert.match(spec.id,/^quarry-headwall(?:$|-solid-)/,'only the new authored headwall can add physical objects');
  }
  for(const [id,spec] of before)if(!current.has(id)){
    assert.match(id,/^(scanned-rock-|scree-)/,'only obsolete scatter can disappear');
    assert.ok(overlapsQuarryHeadwall(spec.p.x,spec.p.z,12),`${id} cannot disappear outside the new footprint`);
  }
  assert.ok(current.has('quarry-headwall'),'new visible wall needs an authoritative collider');
}
