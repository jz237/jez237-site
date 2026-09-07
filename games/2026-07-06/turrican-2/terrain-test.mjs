import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {contours,area,cliffGeometry} from './src/cliffs.mjs';
const D=createRequire(import.meta.url)('./assets/data.js');
for(let w=0;w<5;w++)for(let s=0;s<D.STAGES_PER_WORLD[w];s++){
 const l=D.buildLevel(w,s),before=JSON.stringify(l),loops=contours(l);
 const expected=l.tiles.filter(t=>t===1).length*400;
 assert.equal(-loops.reduce((n,p)=>n+area(p),0),expected,'Contour must preserve every solid and open space');
 const g=cliffGeometry(l);assert.ok(g.attributes.position.count>0);
 assert.ok([...g.attributes.position.array].every(Number.isFinite));
 assert.equal(JSON.stringify(l),before,'Art must not alter collisions');g.dispose();
 console.log(`Terrain ${w+1}.${s+1}: continuous contours cover ${expected} square units`);
}
