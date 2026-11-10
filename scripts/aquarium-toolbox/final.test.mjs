// Final pass, 2026-11-10: what a visitor reads when something is wrong, and the
// "math & sources" text beside each answer. See FINAL_PASS_20261110.md.
import test from 'node:test';
import assert from 'node:assert/strict';
import {calculators,defaults,calculate,normalizeInputs,convert,usUnit,labelFor,pptFromSg,GAL} from '../../aquarium-toolbox/calculators.mjs';
import {formulaFor} from '../../aquarium-toolbox/us-copy.mjs';
const calc=id=>calculators.find(c=>c.id===id);
const message=(id,a,us,sg)=>{try{calculate(id,a,us,sg);}catch(e){return e.message;}return null;};
const RANGE=/^“(.+)” (must be more than 0|cannot be negative|must be at least (.+)|must be no more than (.+)|must be between (.+) and (.+))\.$/;
// Significant digits of every number in a message: a converted internal limit such as 0.03937008 has eight.
const digits=text=>(text.match(/\d[\d,]*(\.\d+)?/g)||[]).map(n=>n.replace(/,/g,'').replace(/^0+\.?0*/,'').replace('.','').replace(/0+$/,'').length);
const number=text=>Number(text.replace(/[,$%]/g,'').replace('−','-').match(/-?\d+(\.\d+)?/)[0]);

test('Out-of-range messages are short, name the field as shown, and never show a converted internal limit',()=>{
  let seen=0;
  for(const [us,sg] of [[true,false],[false,false],[true,true]])for(const c of calculators)for(const f of c.fields.filter(f=>!f.options)){
    for(const v of [0,-5,f.min/2,f.max*10]){
      if(v>=f.min&&v<=f.max)continue;
      const a={...defaults(c,us),[f.key]:v},text=message(c.id,a,us,sg),where=`${c.id}.${f.key} ${v} ${us?'US':'metric'}${sg?' SG':''}`;
      assert.ok(text,where+' is rejected');
      const m=text.match(RANGE);assert.ok(m,where+': '+text);seen++;
      assert.equal(m[1],labelFor(c.id,f,a),where);
      const tail=text.slice(m[1].length+2);
      assert.doesNotMatch(tail,/mg\/L|undefined|NaN|Infinity| {2}| \.$|e[+-]\d/,where+': '+text);
      for(const n of digits(tail))assert.ok(n<=(sg&&f.unit==='ppt'?5:4),where+' shows a short number: '+text);
      assert.ok(text.length<=110,where+' is one short line: '+text);
    }
  }
  assert.ok(seen>700);
});

test('Every limit a message states is itself accepted',()=>{
  for(const [us,sg] of [[true,false],[false,false],[true,true]])for(const c of calculators)for(const f of c.fields.filter(f=>!f.options)){
    if(sg&&f.unit!=='ppt')continue;
    const unit=f.displayUnit||f.unit,toSI=v=>sg?pptFromSg(v):us?convert(v,unit,false):v;
    for(const v of [f.min/2,f.min-1,f.max*10]){
      if(v>=f.min&&v<=f.max)continue;
      const a={...defaults(c,us),[f.key]:v},m=message(c.id,a,us,sg).match(RANGE);
      for(const stated of [m[3],m[4],m[5],m[6]].filter(Boolean)){
        const accepted=normalizeInputs(c.id,{...defaults(c,us),[f.key]:toSI(number(stated))},us,sg);
        assert.ok(accepted[f.key]>=f.min&&accepted[f.key]<=f.max,`${c.id}.${f.key}: ${stated}`);
      }
    }
  }
});

test('The wording fits the limit: zero, negative, too small, too large, or a real range',()=>{
  const says=(id,a,us=true,sg=false)=>message(id,{...defaults(calc(id),us),...a},us,sg);
  assert.equal(says('tank',{l:0}),'“Inside length” must be more than 0.');
  assert.equal(says('tank',{l:-3}),'“Inside length” must be more than 0.');
  assert.equal(says('tank',{l:.01}),'“Inside length” must be at least 0.04 in.');
  assert.equal(says('tank',{l:.01},false),'“Inside length” must be at least 0.1 cm.');
  assert.equal(says('tank',{l:1e9}),'“Inside length” must be no more than 1,960 in.');
  assert.equal(says('tank',{fill:0}),'“How full is it?” must be between 1 and 100%.');
  assert.equal(says('tank',{fill:150}),'“How full is it?” must be between 1 and 100%.');
  assert.equal(says('tank',{displacement:99}),'“Space taken up by gravel, rock & décor” must be no more than 95%.');
  assert.equal(says('stocking',{count:-1}),'“Number of fish” cannot be negative.');
  assert.equal(says('stocking',{v:0}),'“Water in your tank” must be more than 0.');
  assert.equal(says('stocking',{v:1e12}),'“Water in your tank” must be no more than 2,640,000 US gal.');
  assert.equal(says('change',{current:-1}),'“Reading in the tank now” cannot be negative.');
  assert.equal(says('change',{current:1e9}),'“Reading in the tank now” must be no more than 10,000,000 ppm.');
  assert.equal(says('ammonia',{ph:3}),'“pH” must be between 4 and 10.');
  assert.equal(says('ammonia',{ph:11}),'“pH” must be between 4 and 10.');
  assert.equal(says('ammonia',{temp:-20}),'“Water temperature” must be between 32 and 104 °F.');
  assert.equal(says('ammonia',{temp:-20},false),'“Water temperature” must be between 0 and 40 °C.');
  assert.equal(says('heater',{room:-40},false),'“Coldest the room gets” must be between −10 and 45 °C.');
  assert.equal(says('co2',{ph:2}),'“pH” must be between 5.5 and 9.');
  assert.equal(says('label',{dose:0}),'“The label says to use” must be more than 0.');
  assert.equal(says('label',{labelV:0}),'“…for this much water” must be more than 0.');
  assert.equal(says('series',{n:0}),'“Number of changes” must be between 1 and 52.');
  assert.equal(says('nitrate',{days:400}),'“Days between changes” must be no more than 365.');
  assert.equal(says('supplement',{days:0}),'“Spread the dose over” must be between 1 and 365 days.');
  assert.equal(says('doser',{events:0}),'“Doses per day” must be at least 1.');
  assert.equal(says('energy',{price:1e4}),'“Electricity price” must be no more than $100/kWh.');
  assert.equal(says('energy',{lightHours:30}),'“Hours the lights are on each day” must be no more than 24.');
  assert.equal(says('glass',{t:0}),'“Glass thickness” must be between 0.04 and 3.93 in.');
  assert.equal(says('glass',{t:0},false),'“Glass thickness” must be between 1 and 100 mm.');
  assert.equal(says('ro',{ratio:500}),'“Waste water per part of RO water” must be no more than 100.');
  assert.equal(says('salt',{target:0}),'“Salinity you want” must be between 1 and 60 ppt.');
  assert.equal(says('salt',{target:0},true,true),'“Salinity you want” must be between 1.0008 and 1.0452 specific gravity.');
  assert.equal(says('adjust',{target:pptFromSg(.99)},true,true),'“Salinity you want” must be between 1.000 and 1.0754 specific gravity.');
  assert.equal(says('turnover',{kind:'sps',flow:-1}),'“Total flow of all your pumps and wavemakers” cannot be negative.');
});

test('A blank field is named the way it is written on screen',()=>{
  const blank=(id,a)=>message(id,{...defaults(calc(id),true),...a},true);
  assert.equal(blank('tank',{shape:'cylinder',l:NaN}),'Enter a number for “Inside diameter”.');
  assert.equal(blank('ro',{v:NaN}),'Enter a number for “RO water you need”.');
  assert.equal(blank('co2',{kh:NaN}),'Enter a number for “KH (carbonate hardness)”.');
  assert.equal(blank('ammonia',{ph:undefined}),'Enter a number for “pH”.');
  assert.equal(blank('tank',{shape:'triangle'}),'Choose one of the options for “Tank shape”.');
});

test('US “math & sources” text is in US units and gives the number the calculator uses',()=>{
  const close=(a,b,tolerance)=>assert.ok(Math.abs(a/b-1)<=tolerance,`${a} vs ${b}`);
  for(const c of calculators)assert.doesNotMatch(formulaFor(c,true),/\bkg\b|litre|\bcm\b|3\.785411784|mg\/L/,c.id+' US formula');
  // Tank volume names all six shapes, in both unit systems.
  for(const us of [true,false])for(const shape of ['rectangle','Cylinder','Oval','Corner','Hexagon','Bow-front'])assert.match(formulaFor(calc('tank'),us),new RegExp(shape),shape);
  const tank=shape=>calculate('tank',{shape,l:20*2.54,w:10*2.54,w2:12*2.54,h:15*2.54,fill:100,displacement:0},true).metrics[0].value/GAL;
  close(tank('corner'),Math.PI*20*20/4*15/231,1e-9);close(tank('ellipse'),Math.PI*20*10/4*15/231,1e-9);close(tank('hexagon'),.866*20*20*15/231,1e-4);
  // Weight: 8.345 lb per US gallon fresh, about 8.54 salt.
  assert.match(formulaFor(calc('weight'),true),/8\.345 lb per US gallon fresh, about 8\.54 salt/);
  const water=kind=>calculate('weight',{...defaults(calc('weight'),true),v:100*GAL,water:kind},true).metrics[1].value/.45359237;
  close(water('fresh'),834.5,1e-4);close(water('salt'),854,1e-3);
  // Pipe speed: 0.00681 × GPH ÷ in².
  assert.match(formulaFor(calc('pipe'),true),/0\.00681 × flow \(US GPH\) ÷ inside diameter \(in\)²/);
  close(calculate('pipe',{flow:600*GAL,diameter:25.4},true).metrics[0].value/.3048,.00681*600/1,1e-3);
  close(calculate('pipe',{flow:1200*GAL,diameter:1.5*25.4},true).metrics[0].value/.3048,.00681*1200/2.25,1e-3);
  // Heat-up energy: gallons × °F × 0.00245 ÷ share kept.
  assert.match(formulaFor(calc('heatup'),true),/US gallons × temperature rise \(°F\) × 0\.00245 ÷ the share of heat kept/);
  close(calculate('heatup',{v:20*GAL,start:(60-32)*5/9,target:(78-32)*5/9,power:300,eff:80,price:.2},true).metrics[1].value,20*18*.00245/.8,2e-3);
  // Fertilizer: ppm × gallons × 3.785 ÷ (1,000 × share).
  assert.match(formulaFor(calc('fertilizer'),true),/rise wanted \(ppm\) × water \(US gal\) × 3\.785 ÷ \[1,000 × nutrient share\]/);
  close(calculate('fertilizer',{v:40*GAL,rise:7.5,fraction:61.3,stock:50,bottle:500},true).metrics[0].value,7.5*40*3.785/(1000*.613),2e-4);
});

test('A reference link is only shown where it is the source of the method',()=>{
  for(const id of ['label','supplement','consumption','sg','tank','turnover'])assert.equal(calc(id).reference,null,id+' shows the method line');
  for(const id of ['change','target','series','nitrate','mix','stock','adjust','salinity','ato'])assert.match(calc(id).reference[1],/Dilution/,id);
  for(const c of calculators)if(c.reference){assert.match(c.reference[1],/^https:\/\//);assert.ok(c.reference[0].length>8);}
});

test('Search words cover what people type; a top-off that would over-concentrate the tank says so plainly',()=>{
  for(const id of ['co2','co2cylinder'])assert.match(calc(id).keywords,/\bco2\b/);
  assert.match(calc('label').keywords,/chlorine.*chloramine/);assert.match(calc('heater').keywords,/betta/);
  for(const id of ['change','target'])assert.match(calc(id).keywords,/nitrite/);
  assert.match(calc('tank').keywords,/liters/);assert.match(calc('stocking').keywords,/goldfish/);assert.match(calc('turnover').keywords,/turnover/);assert.match(calc('doser').keywords,/doser/);
  const text=message('ato',{v:100,daily:99,reserve:20,salinity:35,days:1});
  assert.equal(text,'That much evaporation would leave the water saltier than 100 ppt, about three times seawater, which is more than this estimate covers. Use fewer days.');
  assert.equal(usUnit('L'),'US gal');
});
