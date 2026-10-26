import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
import {VehicleDrawBatch} from '../src/vehicle-draw-batch';
test('a batch built from the model is not re-copied when the model shakes',()=>{
  const root=new T.Group(),model=new T.Group(),material=new T.MeshStandardMaterial();root.add(model);
  for(const x of [-.5,.5]){const g=new T.BoxGeometry(.4,.4,.4);g.clearGroups();const m=new T.Mesh(g,material);m.name='panel_'+x;m.position.x=x;model.add(m);}
  root.updateMatrixWorld(true);const batch=new VehicleDrawBatch(model),position=batch.batches[0].mesh.geometry.getAttribute('position'),version=position.version;
  model.rotation.set(.02,0,-.03);model.position.y=.01;batch.sync();
  assert.equal(position.version,version,'the shake moves the batch, not its vertices');
  (model.children[0] as T.Mesh).position.x=-.6;batch.sync();assert.ok(position.version>version,'a panel that moves still updates');
});
test('the car batches from its model; a quality change keeps shadows compiled and only drops the sun’s pass and strength',()=>{
  const vehicle=readFileSync(new URL('../src/vehicle.ts',import.meta.url),'utf8'),main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
  assert.ok(vehicle.includes('syncDrawBatch(){this.drawBatch??=new VehicleDrawBatch(this.model);this.drawBatch.sync();}'));
  assert.ok(main.includes("setSceneShadows(renderer,scene,true);shadowsLive=quality!=='medium';")&&!main.includes("setSceneShadows(renderer,scene,quality !== 'medium')"),'no recompiling');
  assert.ok(main.includes('if(quarry){const sun=quarry.sun.shadow;sun.autoUpdate=shadowsLive;if(!shadowsLive){sun.needsUpdate=false;if(sun.map){sun.map.dispose();sun.map=null;}if(sun.intensity!==0){shadowStrength=sun.intensity;sun.intensity=0;}}}'));
  assert.ok(main.includes('if(quarry&&shadowsLive&&quarry.sun.shadow.intensity===0)quarry.sun.shadow.intensity=shadowStrength;'),'back on, at the strength it had');
});
