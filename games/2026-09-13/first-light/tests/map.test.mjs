import test from 'node:test';import assert from 'node:assert/strict';
import {mapFrame,worldToMap,depthBand,catchSpots,bearingTo,nearestFeature,coverLine,MAP} from '../map-model.js';
test('the frame keeps the whole cove inside the canvas with a margin and puts the centre in the middle',()=>{
 const f=mapFrame(560,760,560);const c=worldToMap(f,0,0);assert.equal(c.x,380);assert.equal(c.y,280);
 const e=worldToMap(f,280,280);assert.ok(e.x<760*(1-MAP.pad)+1&&e.y<560*(1-MAP.pad)+1,'the far corner stays inside the margin');
 const w=worldToMap(f,-280,-280);assert.ok(w.x>=760*MAP.pad-1&&w.y>=560*MAP.pad-1);
 assert.equal(depthBand(.5),'land');assert.equal(depthBand(-.5),'shallow');assert.equal(depthBand(-2),'mid');assert.equal(depthBand(-4),'deep');assert.equal(depthBand(-9),'channel');
});
test('catches cluster into spots with a count and a top species, and old entries land on their cover',()=>{
 const features=[{type:'dock',x:100,z:-40},{type:'laydown',x:-60,z:20}];
 const spots=catchSpots([{species:'largemouth',x:3,z:2,lengthIn:14},{species:'largemouth',x:5,z:-3,lengthIn:17},{species:'bluegill',x:4,z:1,lengthIn:7},{species:'catfish',spot:'dock',lengthIn:20},{species:'carp',spot:'nowhere'}],features);
 assert.equal(spots.length,2);const s=spots.find(s=>s.count===3);assert.equal(s.top,'largemouth');assert.equal(s.best,17);
 const d=spots.find(s=>s.count===1);assert.equal(d.x,96);assert.equal(d.z,-36,'the dock entry snapped to the grid near the dock');
});
test('bearings read as a compass with north up the map, and the cover line names the nearest feature',()=>{
 assert.equal(bearingTo({x:0,z:0},{x:0,z:-100}).word,'N');assert.equal(bearingTo({x:0,z:0},{x:100,z:0}).word,'E');assert.equal(bearingTo({x:0,z:0},{x:0,z:100}).word,'S');assert.equal(bearingTo({x:0,z:0},{x:-70,z:-70}).word,'NW');
 assert.equal(bearingTo({x:0,z:0},{x:30,z:-40}).m,50);
 const features=[{type:'dock',x:100,z:-40},{type:'laydown',x:-60,z:20}];assert.equal(nearestFeature({x:-50,z:10},features).feature.type,'laydown');
 assert.match(coverLine({x:0,z:0},features),/Laydown · 63 m W/);assert.equal(coverLine({x:0,z:0},[]),'');
});
