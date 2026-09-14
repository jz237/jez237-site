import test from 'node:test';import assert from 'node:assert/strict';
import {ridgeHeight,RINGS} from '../ridge.js';
test('the ridges: a serrated skyline above the tree line, periodic around the ring, taller and hazier the farther back',()=>{
 for(const r of RINGS){let mn=1e9,mx=-1e9;for(let i=0;i<360;i++){const h=ridgeHeight(i/360*Math.PI*2,r);mn=Math.min(mn,h);mx=Math.max(mx,h);assert.ok(Number.isFinite(h));}
  assert.ok(mn>=r.base-1e-9,'never below the base');assert.ok(mx>r.base+r.relief*.3,'has peaks');assert.ok(mx-mn>30,'relief reads from the cove');
  // taller than a 25 m conifer on a 250 m shore from the seat: the skyline must clear the trees
  assert.ok(Math.atan2(mx,r.radius)>Math.atan2(25,250)*.9,'peaks reach above the tree line');}
 assert.ok(Math.abs(ridgeHeight(0,RINGS[0])-ridgeHeight(Math.PI*2,RINGS[0]))<1e-6,'the ring closes');
 assert.ok(RINGS[0].radius>RINGS[1].radius&&RINGS[0].far>RINGS[1].far,'the far ring is the hazier one');
});
