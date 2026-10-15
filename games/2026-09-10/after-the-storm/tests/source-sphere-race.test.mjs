import test from 'node:test';
import assert from 'node:assert/strict';
import {sourceBoundarySpheres,createSourceFixedSphereGrid} from '../source-boundary-spheres.js';
import {constrainSourceSphereRace} from '../source-sphere-race.js';
import {createHydro} from '../hydrodynamics.js';
import {createRace,stepRace} from '../race-core.js';
import {getCourse} from '../courses.js';
import {openWaterCourse} from './support/open-water-course.mjs';

const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-9,`${a} != ${b}`);
const markers=()=>sourceBoundarySpheres([[1201*.025,1167*.025],[-100,-100],[100,100]]);
const racer=()=>({x:1231*.025,z:1140*.025,heading:0,vx:5, vz:0,speed:5,hydro:{...createHydro(),y:-2*.025,vy:0}});
test('rigid bridge preserves full source penetration and the mean of three point kicks even when departing',()=>{
 const grid=createSourceFixedSphereGrid(markers()),r=racer(),x=r.x;
 const result=constrainSourceSphereRace(grid,r);
 assert.equal(result.contacts,1);assert.equal(result.impact,0);
 near(r.x-x,7*.025);near(r.vx,5+7*.025/.01*3/12);
 near(r.hydro.y,-.05);near(r.z,1140*.025);
 assert.equal(r.sourceSphereContacts[0].id,'source-marker-0');
});
test('a racer above the finite marker spheres keeps its trajectory',()=>{
 const r=racer();r.hydro.y=1.5;const before=structuredClone(r);
 assert.equal(constrainSourceSphereRace(createSourceFixedSphereGrid(markers()),r).contacts,0);
 assert.equal(r.x,before.x);assert.equal(r.vx,before.vx);assert.equal(r.hydro.y,1.5);
});
test('live race selection builds marker grids and retains their distinct player families',()=>{
 const sunny=createRace({mode:'time',course:getCourse('greyhaven')});
 assert.equal(sunny.sourceSphereGrid.spheres.length,43);
 assert.equal(sunny.sourceSphereGrid.spheres.filter(q=>q.sourceBoundaryMarker).length,39);
 const glacier=createRace({mode:'time',course:getCourse('glacier')});
 assert.equal(glacier.sourceSphereGrid.spheres.length,108);
 assert.equal(glacier.sourceSphereGrid.spheres.filter(q=>q.breakable).length,0);
 const two=createRace({mode:'versus',course:getCourse('tempest')});assert.equal(two.sourceSphereGrid.spheres.length,105);
 assert.equal(two.sourceSphereGrid.spheres.filter(q=>q.runtimeTag===5).length,0);
});
test('live fixed contacts do not fabricate a wipeout from outgoing speed',()=>{
 const rocks=markers(),course=openWaterCourse({rocks}),s=createRace({mode:'time',course,seaState:'calm'}),r=s.racers[0];
 Object.assign(r,racer());r.hydro.initialized=true;r.vx=20;r.speed=20;s.phase='running';
 stepRace(s,{},.001);
 assert.ok(r.sourceSphereContacts.length);assert.equal(r.wipeout,undefined);assert.equal(r.misses,0);
 assert.ok(r.x>1231*.025);
});
test('jet steering can turn a wet stationary craft without requiring a collision or ambient wave shove',()=>{
 const s=createRace({mode:'time',course:openWaterCourse(),seaState:'calm'}),r=s.racers[0];s.phase='running';
 r.hydro.initialized=true;r.hydro.intake=1;r.hydro.wet=1;const heading=r.heading;
 stepRace(s,{throttle:1,steer:1},1/60);
 assert.ok(r.heading>heading);assert.ok(r.vx!==0||r.vz!==0);
});
