import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createCourseScenery} from '../src/course-scenery';
import {WRENFORD} from '../src/wrenford-course';
test('windpump plot is clear without moving unrelated scenery',()=>{
 const before=JSON.parse(readFileSync(new URL('../work/longitudinal-physics/wrenford-clearance-before.json',import.meta.url),'utf8'));
 const intersects=(p:any)=>p.kind==='tree'&&Math.abs(p.x+147.5)<20+p.radius*1.2&&Math.abs(p.z-7.5)<18+p.radius*1.2;
 const removed=before.filter(intersects);assert.ok(removed.length>=5);
 const scenery=createCourseScenery(WRENFORD,'farm');
 try{assert.deepEqual(scenery.root.userData.placements,before.filter((p:any)=>!intersects(p)));console.log(`${removed.length} overlapping trees removed; other placement coordinates preserved`);}
 finally{scenery.dispose();}
});
