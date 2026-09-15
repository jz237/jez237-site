import test from 'node:test';
import assert from 'node:assert/strict';
import {renderPixelRatio} from '../render-budget.js';

test('phone low quality preserves CSS-pixel clarity within its raster budget',()=>{
 assert.equal(renderPixelRatio(390,780,3,'low'),1);
 assert.equal(renderPixelRatio(780,390,3,'low'),1);
 for(const quality of ['low','medium','high'])for(const [w,h] of [[390,780],[844,390],[1920,1080],[3840,2160]]){
  const r=renderPixelRatio(w,h,3,quality),budget=quality==='high'?2300000:quality==='medium'?1200000:620000;
  assert.ok(w*h*r*r<=budget+1);assert.ok(r>0&&r<=1.75);
 }
 assert.equal(renderPixelRatio(390,780,1,'high'),1);
});
