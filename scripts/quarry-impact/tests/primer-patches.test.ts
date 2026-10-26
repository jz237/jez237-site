import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {PRIMER} from '../src/primer-patches';
const surface=readFileSync(new URL('../src/vehicle-surface.ts',import.meta.url),'utf8');
test('primer patches cover a small share of an old car’s paint, matte, with a sanded halo and filler at the heart',()=>{
  assert.ok(PRIMER.amount>0&&PRIMER.amount<.4,'a few repairs, not a camouflage');assert.ok(PRIMER.scale>2,'patch-sized, not panel-sized');
  assert.ok(PRIMER.halo>0&&PRIMER.core>0&&PRIMER.roughness>.8);
});
test('the paint shader lays them in the age block (old painted steel only), off the rust, matte and without lacquer',()=>{
  const block=surface.slice(surface.indexOf("${rusts(m.name)?`"),surface.indexOf("}`:''}\nfloat coatingSide"));
  assert.ok(block.includes('if(carRust.x>0.){'),'only on a car with age');
  assert.ok(block.includes('primerEdge=1.-${PRIMER.amount}*carRust.x;')&&block.includes('primerPatch=smoothstep(primerEdge-.008,primerEdge+.008,primerField)*(1.-ageRust);'),'more with age, never over the rust');
  assert.ok(block.includes('lacquerOff=max(lacquerOff,max(primerPatch,primerHalo*.7));'),'the lacquer gone with them');
  assert.ok(surface.includes('roughnessFactor=mix(roughnessFactor,${PRIMER.roughness},primerPatch);'),'matte');
});
test('every shader variable it adds is declared once across the injected shader code (a clash blacks out the bodywork)',()=>{
  const src=readdirSync(new URL('../src/',import.meta.url)).filter(f=>f.endsWith('.ts')).map(f=>readFileSync(new URL('../src/'+f,import.meta.url),'utf8')).join('\n');
  for(const name of ['primerPatch','primerField','primerEdge','primerHalo'])assert.equal((src.match(new RegExp(`(?:float|,)\\s*${name}\\s*=`,'g'))??[]).length,1,name);
});
