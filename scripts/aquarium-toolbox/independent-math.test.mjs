// Independent reference examples and conservation/inverse properties. Do not use
// production helper functions to compute the expected physics/chemistry values.
import test from 'node:test';
import assert from 'node:assert/strict';
import {calculators,calculate,defaults,convert,convertHardness,wholeUp,wholeDown,sgFromPpt,pptFromSg} from '../../aquarium-toolbox/calculators.mjs';
import {bagComparison} from '../../aquarium-toolbox/presets.mjs';
const run=(id,a={})=>calculate(id,{...defaults(calculators.find(c=>c.id===id)),...a});
const near=(a,b,msg='')=>assert.ok(Math.abs(a-b)<=2e-10*Math.max(1,Math.abs(b)),`${msg}: ${a} != ${b}`);
const examples={
 tank:[{l:10,w:20,h:30,fill:50,displacement:10},[2.7,6,.3]],
 substrate:[{l:100,w:50,front:2,back:4,bagWeight:10},[15,22.5,3]],
 stocking:[{v:75.70823568,l:60.96,w:30.48,size:3.81,count:10},[75,38.1,13]],
 weight:[{v:10,glass:1,stand:2,rock:3,gear:4,l:100,w:50},[20,10,40]],
 system:[{display:10,sump:2,refugium:3,pipe:4},[19,9]],
 sump:[{l:100,w:50,drop:2,pipe:5,margin:20,reserve:20},[15,18,2]],
 glass:[{l:100,w:50,h:50,t:5,price:10},[2,25,20]],
 change:[{v:100,pct:30,current:40,fresh:10},[31,30,9]], // comes down by 9; the label carries the direction
 target:[{v:100,current:50,target:20,fresh:10},[75,75]],
 series:[{v:100,current:80,fresh:0,pct:50,n:3},[10,50,150]],
 nitrate:[{rise:12,fresh:5,pct:25,days:6},[53,41,2]],
 mix:[{v:20,high:12,low:2,target:7},[10,10,7]],
 ro:[{v:50,rate:5,ratio:4,feed:200,product:4},[10,200,250,98]],
 label:[{v:20,dose:5,labelV:10,bottle:100},[10,10]],
 // Emerson at 25C and pH 8, published freshwater equilibrium fraction ~0.05366.
 ammonia:[{tan:1,ph:8,temp:25,basis:'NH3'},[.053662336661957411886,5.3662336661957411886,.04413447937071952562]],
 hardness:[{unit:'degree',value:10},[10,178.48,3.5696]],
 stock:[{stock:1000,target:250,final:200},[50,150,200]],
 salt:[{v:10,target:35,recipe:38,bag:3800},[380,100,380/285]],
 adjust:[{v:100,current:40,target:35,fresh:0},[12.5,12.5]],
 salinity:[{a:30,sa:40,b:10,sb:0},[30,40]],
 sg:[{value:35},[1.02639,35]],
 ato:[{v:100,daily:2,reserve:10,salinity:35,days:5},[5,10,350/9]],
 supplement:[{v:100,current:7,target:9,dose:10,labelV:50,rise:1,days:2},[40,20,1]],
 consumption:[{start:9,end:8,hours:12,days:3},[2,6]],
 turnover:[{v:100,flow:600,kind:'community'},[6,400,600]],
 // No flow: Darcy loss and K losses are zero even with fittings; lift remains.
 head:[{flow:0,lift:2,length:3,e90:3},[2,0,0]],
 pump:[{h1:1,q1:2000,h2:3,q2:1000,head:1.5},[1750]],
 pipe:[{diameter:20,flow:3600},[3.183098861837907,314.1592653589793]],
 drip:[{drops:2,size:20,v:.6},[100,6]],
 // At exactly 8 US gal and 10F rise: 0.85 * 4 * 10 = 34 W -> next size 50.
 heater:[{v:30.283294272,room:20,target:20+50/9,installed:0},[50,34,1.122731222522130765]],
 energy:[{lights:100,lightHours:10,pumps:25,heater:100,duty:25,other:0,price:.2},[13.3925,2.2,160.71]],
 heatup:[{v:10,start:10,target:20,power:100,eff:100,price:.2},[1.162777777777778,.1162777777777778,.02325555555555556]],
 watercost:[{v:100,pct:20,days:30.4375,evap:0,waste:4,waterprice:5,salt:40,saltprice:10},[8.5,100,.5,8]],
 co2:[{kh:4,ph:7},[12]],
 co2cylinder:[{full:3,tare:2,daily:10,reserve:100},[90,1]],
 fertilizer:[{v:100,rise:5,fraction:50,stock:50,bottle:500},[1,10,500]],
 doser:[{collected:12,seconds:60,daily:8,events:4,reserve:500},[10,12,2,62.5]],
 dli:[{par:100,hours:10},[3.6]]
};
assert.deepEqual(Object.keys(examples).sort(),calculators.map(c=>c.id).sort());
for(const [id,[inputs,expected]] of Object.entries(examples))test(`${id}: independently specified reference result`,()=>{
 const result=run(id,inputs);assert.equal(result.metrics.length,expected.length);
 expected.forEach((v,i)=>near(result.metrics[i].value,v,id+' '+result.metrics[i].label));
});

test('All six tank geometries and the shallow-bow limit',()=>{
 const a={l:20,w:10,h:10,fill:100,displacement:0};
 near(run('tank',{...a,shape:'rectangle'}).metrics[0].value,2);
 near(run('tank',{...a,shape:'cylinder'}).metrics[0].value,Math.PI);
 near(run('tank',{...a,shape:'ellipse'}).metrics[0].value,Math.PI/2);
 near(run('tank',{...a,shape:'hexagon'}).metrics[0].value,3.4641016151377544);
 near(run('tank',{...a,shape:'corner'}).metrics[0].value,Math.PI);
 near(run('tank',{...a,shape:'bowfront',w2:20}).metrics[0].value,2+Math.PI/2);
 const flat=run('tank',{...a,shape:'bowfront',w2:10}).metrics[0].value;
 const shallow=run('tank',{...a,shape:'bowfront',w2:10.0000001}).metrics[0].value;
 assert.ok(shallow>flat,'a positive bow must add area even when angle - sin(angle) cancels');
 near(shallow,flat+20*(.0000001)*2/3*10/1000);
});

test('Exact bag and dose boundaries are not lost to binary floating point',()=>{
 near(run('label',{v:1,labelV:10,dose:.1,bottle:.07}).metrics[1].value,7);
 const a={l:7.62,w:30.48,front:2.54,back:2.54,bagMode:'volume',bag:.08427632914285714};
 assert.equal(run('substrate',a).metrics[2].value,7);
 assert.equal(wholeUp(2+1e-8),3);assert.equal(wholeDown(2-1e-8),1);
 assert.equal(wholeUp(1e-12),1);assert.equal(wholeDown(1e-12),0);
 // Compare shortcut counts with the actual calculator for the identical bags.
 for(const mode of ['weight','volume'])for(const us of [false,true]){
  const a={...defaults(calculators.find(c=>c.id==='substrate')),bagMode:mode,l:60.96,w:30.48,front:5.08,back:7.62};
  for(const b of bagComparison(a,us))assert.equal(run('substrate',{...a,[mode==='weight'?'bagWeight':'bag']:b.value}).metrics[2].value,b.bags);
 }
});

test('Chemistry semantics: nitrogen basis, observed increase, stock volume and label strength',()=>{
 const nh=run('ammonia',{tan:17.0305,ph:8,basis:'NH3'}),n=run('ammonia',{tan:14.0067,ph:8,basis:'N'});
 for(let i=0;i<3;i++)near(n.metrics[i].value,nh.metrics[i].value);
 n.graphic.values.forEach((v,i)=>near(v,nh.graphic.values[i]));
 const rise=run('consumption',{start:8,end:9,hours:24,days:2});assert.equal(rise.metrics[0].value,1);assert.match(rise.metrics[0].label,/rise/);assert.match(rise.message,/not a negative dose/);
 const fert=run('fertilizer',{v:100,rise:10,fraction:50,stock:1,bottle:100});assert.equal(fert.metrics[1].value,200);assert.match(fert.message,/more than the whole bottle of stock solution holds/);
 const salt=run('salt',{bag:3800,v:10,recipe:38,target:35});assert.match(salt.metrics[1].label,/this salt supply/);
});

test('Nitrate chart follows interval and represents instantaneous water changes',()=>{
 for(const days of [.1,1,7,30,365]){
  const g=run('nitrate',{days}).graphic;
  assert.deepEqual(g.xValues,[0,days,days,days*2,days*2,days*3]);
  assert.equal(g.positions[1],g.positions[2]);assert.equal(g.positions[3],g.positions[4]);assert.equal(g.xUnit,'days');assert.doesNotMatch(g.axis,/weeks/);
 }
});

test('Zero/tiny times are not replaced by a nonzero invented minute or rounded to zero',()=>{
 near(run('drip',{v:.001,drops:1000,size:20}).graphic.amount,1/3000);
 assert.match(run('heatup',{v:.01,start:25,target:26,power:1000,eff:100}).graphic.labels[1],/less than 1 min/);
 assert.equal(run('heatup',{start:25,target:25}).metrics[0].value,0);
});

test('Goldfish volume boundaries agree with counts and verdicts; guidelines are not approvals',()=>{
 const gal=3.785411784;
 for(const count of [1,2,5])for(const delta of [-.0001,0,.0001]){
  const r=run('stocking',{kind:'goldfish',count,v:(10+count*10+delta)*gal});
  assert.equal(r.metrics[1].value,delta<0?count-1:count);
  assert.equal(r.graphic.status,delta<0?'low':'ok');
 }
 // The room left is the allowance minus the fish entered, never a vague promise.
 const one=run('stocking',{count:1});assert.match(one.message,new RegExp(`room for about ${one.metrics[2].value-1} more fish of this size`));
});

test('Heater capacity below estimate is not reported adequate',()=>{
 const base={v:30.283294272,room:20,target:20+50/9};
 assert.match(run('heater',{...base,installed:33}).message,/too small/);
 assert.equal(run('heater',{room:30,target:20}).metrics[0].value,0);
});

test('Hardness and US unit inverses preserve physical quantities',()=>{
 for(const from of ['degree','ppm','meq'])for(const to of ['degree','ppm','meq'])for(const v of [0,.01,1,8,20,1000])near(convertHardness(convertHardness(v,from,to),to,from),v);
 near(convertHardness(10,'degree','ppm'),178.48);near(convertHardness(1,'meq','ppm'),50);
 for(const unit of ['L','L per bag','L/h','cm','mm','m','kg','kg/L','g/L','bulk-g','W/L','m²','mm²','kg/m²','m/s','$/m³','$/kg','$/m²','gpd','cup','°C'])for(const v of [.001,1,25,1000])near(convert(convert(v,unit,true),unit,false),v,unit);
 near(convert(1,'$/m³',true),3.785411784);near(convert(1,'gpd',true),6.340129256595562);
 for(const ppt of [0,1,35,60,100])near(pptFromSg(sgFromPpt(ppt)),ppt);
});

// Deterministic randomized checks for conservation, inverses and scaling, using
// the results of different tools rather than copying their implementation.
test('500 scenarios: mass balance, target inverse, repeated changes and scaling',()=>{
 let seed=731;const rnd=()=>{seed=(1664525*seed+1013904223)>>>0;return seed/2**32;};
 for(let i=0;i<500;i++){
  const v=1+rnd()*5000,current=rnd()*200,fresh=rnd()*200,f=.01+rnd()*.98;
  const changed=run('change',{v,current,fresh,pct:f*100});
  near(changed.metrics[0].value*v,current*(v-v*f)+fresh*v*f,'mass conservation');
  const inverse=run('target',{v,current,fresh,target:changed.metrics[0].value});near(inverse.metrics[0].value,v*f,'target inverse');
  const repeat=run('series',{v,current,fresh,pct:f*100,n:3});
  let reading=current;for(let j=0;j<3;j++)reading=run('change',{v,current:reading,fresh,pct:f*100}).metrics[0].value;
  near(repeat.metrics[0].value,reading,'repeat');
  const s=rnd()*50,t=run('salinity',{a:v,sa:s,b:v,sb:0});near(t.metrics[0].value,s/2,'salinity mass');
  const label=run('label',{v}),double=run('label',{v:v*2});near(double.metrics[0].value,2*label.metrics[0].value,'dose scaling');
 }
});
test('Nitrate equilibrium is a fixed point of change + production',()=>{
 for(const pct of [.01,1,25,100])for(const rise of [0,.1,10,100]){
  const r=run('nitrate',{pct,rise,fresh:3}),peak=r.metrics[0].value,low=r.metrics[1].value;
  near(run('change',{pct,current:peak,fresh:3}).metrics[0].value,low);
  near(low+rise,peak);
 }
});
test('Laminar head agrees with the independent Hagen–Poiseuille equation',()=>{
 const a={flow:3.6,diameter:10,length:1,lift:0,e90:0,e45:0,valves:0,checks:0};
 const r=run('head',a),Q=1e-6,d=.01,g=9.80665,nu=1.004e-6;
 near(r.metrics[1].value,128*nu*1*Q/(Math.PI*g*d**4));
 const speed=Q/(Math.PI*d*d/4);near(r.metrics[2].value,1.5*speed*speed/(2*g));
 near(r.metrics[0].value,r.metrics[1].value+r.metrics[2].value);
});
test('Unit-converted endpoints remain in domain without admitting real out-of-range values',()=>{
 for(const c of calculators)for(const f of c.fields.filter(f=>!f.options))for(const endpoint of [f.min,f.max]){
  const back=convert(convert(endpoint,f.displayUnit||f.unit,true),f.displayUnit||f.unit,false);
  try{calculate(c.id,{...defaults(c),[f.key]:back},true);}catch(e){assert.doesNotMatch(e.message,/must be between/,c.id+'.'+f.key+' converted endpoint');}
 }
 const c=calculators.find(c=>c.id==='salt');
 assert.doesNotThrow(()=>calculate('salt',{...defaults(c),target:pptFromSg(sgFromPpt(1))},false,true));
 assert.throws(()=>calculate('salt',{...defaults(c),target:.999999},false,true),/must be between/);
});
test('CO2 status matches its stated 20–30 ppm comparison band',()=>{
 // At pH 7 the estimate is 3 × KH: 12, 18, 24, 33 and 42 ppm.
 for(const [kh,word]of [[4,'low side'],[6,'Just under the 20–30 ppm'],[8,'Right in the 20–30 ppm range'],[11,'A little above the usual 20–30 ppm'],[14,'High'],[20/3,'Right in'],[10,'Right in']])assert.match(run('co2',{ph:7,kh}).message,new RegExp(word));
});
test('Evaporation does not extrapolate dissolved salinity to impossible concentrations',()=>{
 assert.throws(()=>run('ato',{v:100,daily:99,days:1,salinity:35}),/outside this dissolved-salt approximation/);
 near(run('ato',{v:100,daily:20,days:1,salinity:35}).metrics[2].value,43.75);
 near(run('ato',{v:100,daily:99,days:1,salinity:0}).metrics[2].value,0);
});
test('Huge whole-dose counts are not presented as precise unsafe integers',()=>{
 assert.throws(()=>run('label',{v:.01,labelV:1e7,dose:.001,bottle:1e7}),/count is outside/);
});
test('Messages follow the numbers: direction, peaks, short runs and the visitor’s own figures',()=>{
 // Water change: the third card says which way the reading moves.
 let r=run('change',{v:100,pct:30,current:40,fresh:10});assert.equal(r.metrics[2].label,'Reading comes down by');assert.doesNotMatch(r.message,/raises it/);
 r=run('change',{v:100,pct:30,current:10,fresh:40});assert.equal(r.metrics[2].label,'Reading goes up by');near(r.metrics[2].value,9,'rise');assert.match(r.message,/new water has a higher reading than the tank/);
 // Repeated changes: 4 × 25% replaces 1 − 0.75⁴ = 68.4% of the old water, not 100%.
 assert.match(run('series',{pct:25,n:4}).message,/4 changes of 25% replace about 68\.4% of the old water, not 100%/);
 assert.match(run('series',{pct:10,n:2}).message,/2 changes of 10% replace about 19% of the old water, not 20%/);
 for(const v of [{pct:25,n:1},{pct:100,n:4},{pct:0,n:4}])assert.match(run('series',v).message,/Each change replaces that share/);
 // Nitrate: the verdict follows the peak (rise ÷ share changed + new water).
 assert.match(run('nitrate',{rise:10,fresh:0,pct:10,days:7}).message,/above the roughly 40 ppm/);          // peak 100
 assert.match(run('nitrate',{rise:10,fresh:0,pct:30,days:7}).message,/stays under about 40 ppm/);          // peak 33.3
 assert.match(run('nitrate',{rise:5,fresh:0,pct:50,days:7}).message,/stays under about 20 ppm/);           // peak 10
 assert.match(run('nitrate',{rise:10,fresh:45,pct:50,days:7}).message,/new water itself is at or above 40 ppm/);
 assert.equal(run('nitrate',{days:7}).graphic.axis,'Water changes every 7 days');assert.equal(run('nitrate',{days:1}).graphic.axis,'Water changes every 1 day');
 // Dosing pump: 8 mL a day in 1,440 doses at 12 mL/min is a 0.028 s run.
 assert.match(run('doser',{events:1440}).message,/shorter than one second/);assert.doesNotMatch(run('doser').message,/shorter than one second/);
 // Flow above the usual range is not a fault; heater chart and card agree.
 assert.equal(run('turnover',{v:100,flow:5000,kind:'community'}).graphic.status,'above');
 const h=run('heater',{v:20*3.785411784,room:20,target:20+50/9});assert.equal(h.graphic.values[0],63);assert.equal(h.metrics[1].digits,0);
 const tiny=run('heater',{v:20*3.785411784,room:25,target:25+.5/1.8});assert.equal(tiny.metrics[1].digits,1);near(tiny.graphic.values[0],3.1,'tiny need');
 // Substrate: a custom material is described as the visitor's own weight.
 assert.match(run('substrate',{material:'custom'}).message,/weight you entered/);assert.match(run('substrate',{material:'sand'}).message,/typical weight/);
 // Ammonia figure labels.
 assert.deepEqual(run('ammonia').graphic.labels,['Your test','Toxic part']);assert.deepEqual(run('ammonia',{basis:'N'}).graphic.labels,['Your test as NH₃','Toxic part']);
});
