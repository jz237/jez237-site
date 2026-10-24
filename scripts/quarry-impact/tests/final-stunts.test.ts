import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {FINAL_STUNTS,finalStunts,stuntValue} from '../src/derby-moments';
test('stunts score double in the last FINAL_STUNTS.window seconds, not before, not after the end, not in untimed events',()=>{
 assert.ok(finalStunts(FINAL_STUNTS.window)&&finalStunts(1));assert.ok(!finalStunts(FINAL_STUNTS.window+.1)&&!finalStunts(0)&&!finalStunts(-3)&&!finalStunts(Infinity)&&!finalStunts(NaN));
 assert.equal(stuntValue(15,10),15*FINAL_STUNTS.factor);assert.equal(stuntValue(15,90),15);
});
test('every stunt credit goes through the doubling, as does the toast\'s points tag; only the QA hook adds raw points',()=>{
 const src=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
 assert.equal((src.match(/combat\.destruction\(/g)??[]).length,2,'the scoreStunt helper and the QA bonus hook');
 assert.ok(src.includes('const scoreStunt=(id:number,points:number)=>combat.destruction(id,stuntPoints(points));'));
 assert.ok(src.includes("const pointsTag=(points:number)=>scoreDerby()?` +${stuntPoints(points)}`:'';"));
 assert.ok((src.match(/scoreStunt\(/g)??[]).length>=10);
 assert.ok(src.includes("toast(`FINAL ${FINAL_STUNTS.window} · STUNTS SCORE DOUBLE`,2.4,3)"),'called out once as the window opens');
});
