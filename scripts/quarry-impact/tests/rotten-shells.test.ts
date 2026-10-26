import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {ROT,rotFactor,rustFlakes} from '../src/age-rust';
import {exposedDamage} from '../src/damage-handling';
test('a rotten shell lets more of a blow through, in step with its rust; a sound one none',()=>{
  assert.equal(rotFactor(0,ROT.crush),1);assert.equal(rotFactor(1,ROT.crush),1+ROT.crush);assert.equal(rotFactor(.5,ROT.dent),1+ROT.dent/2);
  assert.equal(rotFactor(3,ROT.crush),1+ROT.crush,'capped');assert.equal(rotFactor(NaN,ROT.crush),1);assert.equal(rotFactor(-1,ROT.dent),1);
  const sound=exposedDamage(.2,.4,rotFactor(0,ROT.crush)),rotten=exposedDamage(.2,.4,rotFactor(1,ROT.crush));
  assert.equal(sound,.4);assert.ok(Math.abs(rotten-(.2+.2*(1+ROT.crush)))<1e-9,'the extra on the blow only');assert.equal(exposedDamage(.9,1,rotFactor(1,ROT.crush)),1,'never past wrecked');
});
test('a hard knock low on a rotten flank shakes loose rust flakes, more the older and the harder',()=>{
  assert.equal(rustFlakes(.2,20,.1),0,'barely rusty');assert.equal(rustFlakes(.9,4,.1),0,'a tap');assert.equal(rustFlakes(.9,20,.9),0,'high on the body');
  const few=rustFlakes(ROT.flakes,ROT.min,0),most=rustFlakes(1,ROT.full*2,0);
  assert.ok(few>=ROT.count[0]&&most===ROT.count[1]&&few<most,'within the shower');assert.ok(rustFlakes(.6,20,.2)<rustFlakes(.9,20,.2)&&rustFlakes(.9,10,.2)<rustFlakes(.9,25,.2));
  assert.equal(rustFlakes(NaN,20,0),0);assert.equal(rustFlakes(.9,NaN,0),0);assert.equal(rustFlakes(.9,20,NaN),0);
});
test('the vehicle feeds its rust into each blow, offline only; main showers the flakes',()=>{
  const vehicle=readFileSync(new URL('../src/vehicle.ts',import.meta.url),'utf8'),main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
  assert.ok(vehicle.includes('if(this.surfaceFinish.rustAge>0)for(let k=0;k<components.structure.length;k++)components.structure[k]=exposedDamage(structureBefore[k],components.structure[k],rotFactor(this.surfaceFinish.rustAge,ROT.crush));'),'into the structure');
  assert.ok(vehicle.includes('const dentDamage=bodyworkDentDamage(damage)*(this.extendedDamage?rotFactor(this.surfaceFinish.rustAge,ROT.dent):1);'),'deeper dents');
  const at=vehicle.indexOf('rotFactor(this.surfaceFinish.rustAge,ROT.crush)'),guard=vehicle.lastIndexOf('if(this.extendedDamage&&structureBefore&&components.structure){',at);assert.ok(guard>0&&at-guard<2000,'inside the offline block');
  assert.ok(main.includes('count=rustFlakes(r.x,damage,car.model.worldToLocal(p.clone()).y-r.y);if(count){rustShowers++;fx.scatterLitter(p,\'paint\',car.id*151+(++n),car.current,ROT.colour,count);}'),'rust-coloured flakes where it lands');
  assert.ok(main.includes("car.onPaintChips=(p,damage)=>{if(damage>=LITTER.paint.min)fx.scatterLitter(p,'paint',car.id*139+(++n)"),'paint chips kept');
});
