import test from 'node:test';
import assert from 'node:assert/strict';
import {WALL_WORK,wallWork} from '../src/derby-driving';
const arena={x:0,z:0,radius:40};
test('a target near the wall, come at from the inside, is worth going for; from the outside, or out in the open, it is not',()=>{
 assert.equal(wallWork({x:0,z:20},{x:0,z:36},arena),WALL_WORK.bonus,'pushing it straight into the wall');
 assert.equal(wallWork({x:10,z:30},{x:0,z:36},arena),WALL_WORK.bonus,'at an angle, still outward');
 assert.equal(wallWork({x:0,z:38},{x:0,z:36},arena),0,'from the wall side it would be pushed into the open');
 assert.equal(wallWork({x:0,z:0},{x:0,z:40-WALL_WORK.near-1},arena),0,'out in the open');
 assert.equal(wallWork({x:0,z:20},{x:0,z:36},null),0,'no arena, no wall');assert.equal(wallWork({x:0,z:36},{x:0,z:36},arena),0);
});
test('the bonus is part of every charging driver\'s target choice, and only theirs (online cars do not charge)',async()=>{
 const src=(await import('node:fs')).readFileSync(new URL('../src/derby-driving.ts',import.meta.url),'utf8');
 assert.ok(src.includes('+(car.charge?wallWork(car.current,other.current,arena):0);'));
});
