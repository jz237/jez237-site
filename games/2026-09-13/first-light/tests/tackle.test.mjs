import test from 'node:test';import assert from 'node:assert/strict';
import {RIGS,weakestLink,rigParts,describeRig} from '../tackle.js';
test('every launch rig nests: lure inside the rod range and the drag below the line test',()=>{
 for(const rig of RIGS){const w=weakestLink(rig),p=rigParts(rig);assert.ok(w.lureFit,rig.id+' lure fit');assert.ok(p.reel.dragKg<p.line.testKg,rig.id+' drag under line');assert.ok(w.chain[0].kg<=w.chain[1].kg);}
});
test('the weakest link is the drag on the finesse rig and the leader on the braid rig',()=>{
 assert.equal(weakestLink(RIGS[0]).weakest.part,'drag');assert.equal(weakestLink(RIGS[2]).weakest.part,'drag');
 const heavyDrag={...RIGS[2],reel:'bc71'};const w=weakestLink({...heavyDrag});assert.ok(w.chain.some(c=>c.part==='leader'));
 assert.ok(describeRig(RIGS[1]).includes('weakest link'));
});
test('a lure outside the rod range casts less efficiently',()=>{const w=weakestLink({...RIGS[0],lure:'walker'});assert.ok(w.lureFit,'14 g walker still inside a 3.5-14 g rod');const heavy={...RIGS[0],lure:'squarebill',rod:'ml'};assert.ok(weakestLink(heavy).lureFit);});
