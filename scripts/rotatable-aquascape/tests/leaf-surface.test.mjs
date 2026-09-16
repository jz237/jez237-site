import test from 'node:test';import assert from 'node:assert/strict';import {performance} from 'node:perf_hooks';
import {leafSurfaceMaps} from '../lib/LeafSurface.ts';import {leafSurfaceMaps as original} from './leaf-surface-reference.ts';
const make=()=>{const draws=[],canvas={width:0,height:0,draws};const ctx={createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),putImageData:d=>{canvas.pixels=d.data},beginPath:()=>draws.push(['begin']),moveTo:(...a)=>draws.push(['move',...a]),bezierCurveTo:(...a)=>draws.push(['bezier',...a]),quadraticCurveTo:(...a)=>draws.push(['quadratic',...a]),stroke(){draws.push(['stroke',this.strokeStyle,this.lineWidth])}};canvas.getContext=()=>ctx;return canvas;};
globalThis.document={createElement:make};
test('faster leaf map generation preserves every channel byte and vein drawing command',()=>{
 for(const [kind,seed] of [['fine',2731],['round',2732],['sword',2733],['sword',2731]]){
  const before=original(kind,seed),after=leafSurfaceMaps(kind,seed);
  for(const key of ['color','bump','roughness']){assert.deepEqual(after[key].image.pixels,before[key].image.pixels);assert.deepEqual(after[key].image.draws,before[key].image.draws);assert.equal(after[key].colorSpace,before[key].colorSpace);assert.equal(after[key].anisotropy,before[key].anisotropy);before[key].dispose();after[key].dispose();}
 }
});
if(process.env.LEAF_BENCH){const run=fn=>{const t=performance.now();for(const [k,s] of [['fine',2731],['round',2732],['sword',2733]]){const maps=fn(k,s);Object.values(maps).forEach(m=>m.dispose());}return performance.now()-t;};run(original);run(leafSurfaceMaps);const before=[],after=[];for(let i=0;i<6;i++){before.push(run(original));after.push(run(leafSurfaceMaps));}console.log(JSON.stringify({before,after}));}
