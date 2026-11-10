import test from 'node:test';
import assert from 'node:assert/strict';
import {convert,usUnit,calculators,defaults,calculate,GAL} from '../../aquarium-toolbox/calculators.mjs';
import {illustration} from '../../aquarium-toolbox/illustrations.mjs';
import {bagSizes,fieldChoices} from '../../aquarium-toolbox/presets.mjs';
import {formulaFor,noteFor} from '../../aquarium-toolbox/us-copy.mjs';
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-9*Math.max(1,Math.abs(b)),`${a} != ${b}`);
const calc=id=>calculators.find(c=>c.id===id);
test('Independent physical equivalents convert in both directions',()=>{
 for(const [unit,si,us]of [
  ['L',3.785411784,1],['L per bag',7.570823568,2],['cm',30.48,12],['mm',25.4,1],['m',.3048,1],['kg',.45359237,1],
  ['kg/L',1,8.345404452],['g/L',7.489151707307,1],['bulk-g',453.59237,1],['W/L',1,3.785411784],
  ['m²',.09290304,1],['mm²',645.16,1],['kg/m²',4.882427636,1],['m/s',.3048,1],
  ['$/m³',1,3.785411784],['$/kg',1,.45359237],['$/m²',1,.09290304],['°C',0,32],['°C',100,212],
  // A 75 gallon-per-day RO unit makes 75 × 3.785411784 ÷ 24 L/h; a US cup is 1/16 gallon.
  ['gpd',11.829411825,75],['cup',.946352946,4]
 ]){close(convert(si,unit,true),us);close(convert(convert(si,unit,true),unit,false),si);}
});
test('US tank, substrate and load agree with inch/pound arithmetic',()=>{
 const a={...defaults(calc('tank')),l:30.48,w:30.48,h:30.48,fill:100,displacement:0};
 close(convert(calculate('tank',a).metrics[0].value,'L',true),1728/231);
 const s={...defaults(calc('substrate')),l:48*2.54,w:12*2.54,front:2*2.54,back:2*2.54,material:'custom',density:convert(12,'kg/L',false),bagWeight:convert(20,'kg',false)};
 const r=calculate('substrate',s);close(convert(r.metrics[1].value,'kg',true),48*12*2/231*12);assert.equal(r.metrics[2].value,3);
 // Ten US gallons of fresh water weigh 83.454 lb; on a 24 × 12 in (2 ft²) stand that is 41.727 lb/ft².
 const w={...defaults(calc('weight')),v:10*GAL,water:'fresh',glass:0,stand:0,rock:0,gear:0,l:24*2.54,w:12*2.54};
 close(convert(calculate('weight',w).metrics[2].value,'kg/m²',true),10*8.345404452/2);
 assert.ok(calculate('weight',{...w,water:'salt'}).metrics[1].value>calculate('weight',w).metrics[1].value);
});
test('US tariff, salt and area prices preserve actual charges',()=>{
 const a={...defaults(calc('watercost')),v:100*GAL,pct:100,days:30.4375,evap:0,waste:0,waterprice:convert(10,'$/m³',false),salt:convert(4,'g/L',false),saltprice:convert(2,'$/kg',false)};
 const r=calculate('watercost',a);close(r.metrics[2].value,1);close(r.metrics[3].value,50);close(r.metrics[0].value,51);
 const g={...defaults(calc('glass')),l:30.48,w:30.48,h:30.48,price:convert(10,'$/m²',false)};close(calculate('glass',g).metrics[2].value,50);
 const s={...defaults(calc('salt')),v:10*GAL,recipe:convert(4,'g/L',false),bag:convert(5,'bulk-g',false)};
 close(convert(calculate('salt',s).metrics[0].value,'bulk-g',true),2.5);close(convert(calculate('salt',s).metrics[1].value,'L',true),20);
});
test('Diagrams change numbers with units and never mutate canonical graphics',()=>{
 const g={type:'tank',l:30.48,w:30.48,h:30.48};assert.match(illustration(g,'Tank',true),/12 × 12 × 12 in/);assert.match(illustration(g,'Tank',false),/30.48 × 30.48 × 30.48 cm/);
 const flow={type:'flow',rate:100*GAL,diameter:25.4};assert.match(illustration(flow,'Flow',true),/100 US GPH/);assert.match(illustration(flow,'Flow',true),/1 in internal bore/);
 const heat={type:'line',valueUnit:'°C',values:[20,25],labels:['Start','End']};const before=JSON.stringify(heat);const svg=illustration(heat,'Temperature',true);assert.match(svg,/>68</);assert.match(svg,/>77</);assert.match(svg,/°F/);assert.equal(JSON.stringify(heat),before);
 const small=illustration({type:'bars',valueUnit:'L',values:[.1,2.5*GAL,12.4*GAL]},'Volumes',true);assert.match(small,/&lt;0\.1/);assert.match(small,/>2\.5</);assert.match(small,/>12</);
});
test('Presets keep package litres while showing US equivalents; dosing stays conventional',()=>{
 assert.equal(bagSizes('volume',true).find(x=>x.value===9).label,'≈2 US gal (9 L label)');
 const c=calc('substrate');assert.equal(fieldChoices(c,c.fields.find(f=>f.key==='density'),true,defaults(c)),null);assert.match(noteFor(c,true),/12\.5 lb per US gallon/);
 for(const u of ['mL','g','mg/L','dKH','ppt','µmol/m²/s']){assert.equal(usUnit(u),u);assert.equal(convert(5,u,true),5);}
 assert.match(formulaFor(calc('tank'),true),/231/);assert.match(formulaFor(calc('tank'),false),/1,000/);
});
test('US validation names the matching display unit, while saved quantities remain SI',()=>{
 assert.throws(()=>calculate('salt',{...defaults(calc('salt')),bag:-1},true),/lb/);
 assert.throws(()=>calculate('tank',{...defaults(calc('tank')),l:-1},true),/in\./);
 for(const c of calculators){const a=defaults(c);assert.deepEqual(calculate(c.id,a,true).metrics,calculate(c.id,a,false).metrics);}
});
