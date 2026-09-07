import {ridgeGeometry,fracturedRock} from './src/geology.mjs';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {shellGeometry,reliefGeometry} from './src/artisan.mjs';
import {buildVistas} from './src/vistas.mjs';
import {viewWidth,viewHeight,viewOrigin} from './src/viewport.mjs';
const D=createRequire(import.meta.url)('./assets/data.js');
for(let world=0;world<5;world++){
 const level=D.buildLevel(world,0),before=JSON.stringify(level),g=reliefGeometry(level);
 assert.ok([...g.attributes.position.array].every(Number.isFinite));assert.equal(JSON.stringify(level),before);g.dispose();
 const vista=buildVistas(world+1);vista.group.updateMatrixWorld(true);
 vista.group.traverse(m=>{assert.ok(m.matrixWorld.elements.every(Number.isFinite));if(m.isMesh)assert.ok([...m.geometry.attributes.position.array].every(Number.isFinite));});
}
const shell=shellGeometry(10,20,8);assert.ok([...shell.attributes.normal.array].every(Number.isFinite));
for(const [w,h] of [[844,390],[932,430],[1024,600],[960,540]]){
 const visible=viewWidth(w,h);assert.ok(Math.abs(w/visible-h/viewHeight(w,h))<.001,'World pixels keep the same physical scale in both axes');
 assert.equal(viewOrigin(0,visible,4000),0);assert.ok(viewOrigin(3900,visible,4000)+visible<=4000);
}
console.log('Five world asset sets, relief geometry, unchanged collision data, and proportional landscape cameras verified.');

for(const g of [ridgeGeometry(1,430),fracturedRock(20,7,5,9)]){assert.ok([...g.attributes.position.array].every(Number.isFinite));assert.ok(g.attributes.uv);g.dispose();}
