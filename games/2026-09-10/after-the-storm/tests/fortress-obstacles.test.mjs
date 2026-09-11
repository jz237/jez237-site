import test from 'node:test';import assert from 'node:assert/strict';import {getCourse} from '../courses.js';
const pixels=c=>c.rocks.map(o=>[Math.round(o.x/.8+210),Math.round(o.z/.8+300),o.type]);
test('Fortress maps the crate and narrow timber markers separately in every class',()=>{
 const n=getCourse('citadel'),h=getCourse('citadel',1),e=getCourse('citadel',2),r=getCourse('citadel',3);
 assert.deepEqual([n,h,e,r].map(c=>c.rocks.length),[3,7,11,11]);assert.deepEqual([n,h,e,r].map(c=>c.rocks.filter(o=>o.type==='timber').length),[0,3,4,4]);
 assert.deepEqual(pixels(n),[[261,171,'crate'],[295,195,'crate'],[334,198,'crate']]);
 assert.deepEqual(pixels(e),[[263,173,'crate'],[326,179,'timber'],[245,181,'timber'],[273,181,'timber'],[287,190,'crate'],[337,192,'crate'],[310,192,'crate'],[352,205,'crate'],[323,205,'timber'],[178,266,'crate'],[126,329,'crate']]);
 assert.deepEqual(pixels(e),pixels(r));assert.deepEqual(pixels(h),[[263,173,'crate'],[326,179,'timber'],[287,190,'crate'],[270,190,'timber'],[310,192,'crate'],[334,198,'crate'],[323,205,'timber']]);
 assert.ok(e.rocks.filter(o=>o.type==='timber').every(o=>o.r===.82));
});
