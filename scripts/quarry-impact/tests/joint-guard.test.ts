import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
test('every joint is checked for stretch before the solver steps, from the bodies themselves, so a teleport never yanks',()=>{
 const src=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
 const guard=src.indexOf('  if(bumperLocks.length||bumperTethers.length)guardJoints();\n  physics.step(events);');
 assert.ok(guard>0,'guardJoints runs right before physics.step');
 const body=src.slice(src.indexOf('function guardJoints(){'),src.indexOf('/** Draw each wire from where the car is shown'));
 assert.ok(body.includes('fromBody(lock.hooker,lock.hookerAnchor).distanceTo(fromBody(lock.caught,lock.caughtAnchor))'),'locks: from body poses');
 assert.ok(body.includes('t.debris.translation()')&&body.includes('fromBody(t.car,t.anchor)'),'dragged parts: from body poses');
 assert.ok(!body.includes('.current'),'Vehicle.current lags a teleport until postStep');
 assert.ok(body.includes('Number.isFinite(gap)'),'a broken pose lets go too');
});
