// Curated editing shortcuts, not recommendations for livestock or chemical doses.
import {GAL,convert,pptFromSg,substrateDensity,wholeUp} from './calculators.mjs';
const LB=.45359237,INCH=2.54;
const choices=(title,note,options)=>({title,note,options});
const numbers=(values,unit,scale=1)=>values.map(n=>({label:`${n} ${unit}`,value:n*scale}));
const named=(pairs,scale=1)=>pairs.map(([label,n])=>({label,value:n*scale}));
export function bagSizes(mode,us){
  return mode==='volume'?numbers([3,5,8,9,10,20],'L').map(x=>({...x,label:us?`${x.value/GAL<1?'<1':'≈'+Math.round(x.value/GAL)} US gal (${x.value} L label)`:x.label})):us?numbers([5,10,20,25,50],'lb',LB):numbers([2,4,5,8,10,20,25],'kg');
}
// Standard US glass aquariums: name, nominal gallons, outside length × width ×
// height (in), typical glass thickness (in) and empty weight (lb). Makers differ
// slightly; the buttons are a starting point and every field stays editable.
export const standardTanks=[
  ['5.5 gallon',5.5,16.2,8.4,10.5,.125,7],['10 gallon',10,20.25,10.5,12.6,.125,11],['15 gallon',15,24.25,12.5,12.75,.1875,21],
  ['20 gallon high',20,24.25,12.5,16.75,.1875,25],['20 gallon long',20,30.25,12.5,12.75,.1875,25],['29 gallon',29,30.25,12.5,18.75,.1875,40],
  ['30 gallon breeder',30,36.2,18.25,12.9,.25,48],['40 gallon breeder',40,36.2,18.25,16.9,.25,58],['55 gallon',55,48.25,12.75,21,.25,78],
  ['75 gallon',75,48.5,18.5,21.1,.25,98],['90 gallon',90,48.5,18.5,25.1,.375,135],['125 gallon',125,72.5,18.5,23.1,.375,177],
  ['150 gallon',150,72.5,18.5,29.5,.5,281],['180 gallon',180,72.5,24.5,25.6,.5,282]
];
// Common metric tanks: outside length × width × height (cm).
const metricTanks=[[30,20,20],[40,25,25],[60,30,30],[60,35,40],[80,35,40],[100,40,40],[100,40,50],[120,40,50],[120,50,50],[150,50,60]];
const quarter=v=>Math.round(v*4)/4;
function tankOptions(us){
  if(us)return standardTanks.map(([name,gal,l,w,h,glass,lb])=>({label:`${name} · ${Math.floor(l)} × ${Math.floor(w)} × ${Math.floor(h)} in`,volume:gal*GAL,
    // The frame lifts the bottom pane about half an inch; inside sizes are rounded to a quarter inch.
    inside:[quarter(l-2*glass)*INCH,quarter(w-2*glass)*INCH,quarter(h-glass-.5)*INCH],outside:[l*INCH,w*INCH,h*INCH],empty:lb*LB}));
  return metricTanks.map(([l,w,h])=>{const glass=l<=60?.5:l<=100?.8:1.2;return {label:`${Math.round(l*w*h/1000)} L · ${l} × ${w} × ${h} cm`,volume:l*w*h/1000,inside:[l-2*glass,w-2*glass,h-glass],outside:[l,w,h]};});
}
// One pick that fills in several measurements at once.
export function formPresets(c,us){
  if(!['tank','substrate','stocking','weight','sump'].includes(c.id))return null;
  const options=tankOptions(us).map(t=>{
    const [l,w,h]=t.inside,[ol,ow]=t.outside;
    const values=c.id==='tank'?{shape:'rectangle',l,w,h}:c.id==='substrate'?{l,w}:c.id==='stocking'?{v:t.volume,l,w}:c.id==='sump'?{l,w}:{v:t.volume,l:ol,w:ow,...(t.empty?{glass:t.empty}:{})};
    return {label:t.label,values};
  });
  return {title:c.id==='sump'?'Standard display tank':'Standard tank size',placeholder:'Pick your tank to fill in its measurements',options,
    note:c.id==='weight'&&!us?'Fills in the advertised volume and footprint. Enter your tank’s actual empty weight separately.':c.id==='weight'?'Fills in the advertised volume, the empty weight of a typical glass tank and its footprint. Adjust anything that differs.':c.id==='stocking'?'Fills in the advertised volume and the size of the water surface.':'Typical inside measurements for that size. Brands differ slightly, so measure yours for the best answer.'};
}
const salinityChoices=sg=>sg?[[1.020,'fish-only low'],[1.023,''],[1.025,''],[1.026,'reef / seawater']].map(([gravity,label])=>({label:`${gravity.toFixed(3)}${label?' · '+label:''}`,value:pptFromSg(gravity)})):[[30,'fish-only low'],[32,''],[34,''],[35,'reef / seawater']].map(([ppt,label])=>({label:`${ppt} ppt${label?' · '+label:''}`,value:ppt}));
export function fieldChoices(c,f,us,a,sg=false){
  if(c.id==='substrate'){
    if(f.key==='bag')return choices('Common volume-labelled bags',us?'Match the litres in parentheses to the package label. Gallon equivalents are rounded; bag counts use the exact labelled volume.':'Match the litres printed on your package. Sizes vary by brand.',bagSizes('volume',us));
    if(f.key==='bagWeight')return choices('Common bag sizes','Tap the weight on the bag, or type a different one. These are examples, not store stock.',bagSizes('weight',us));
    if(['front','back'].includes(f.key))return choices('Common depths','About 2 in suits most tanks; rooted plants like 2–3 in. Deeper at the back adds a sense of depth.',us?numbers([1,2,3,4],'in',INCH):numbers([2,3,5,8,10],'cm'));
  }
  if(c.id==='tank'&&f.key==='fill')return choices('How full?','Most tanks are filled to about an inch below the rim, which is roughly 95%.',named([['To the brim · 100%',100],['Normal · 95%',95],['A little low · 90%',90]]));
  if(c.id==='tank'&&f.key==='displacement')return choices('What is in the tank?','A rough guide. Solid rock and deep gravel take up the most room.',named([['Bare tank · 0%',0],['Gravel & a few ornaments · 10%',10],['Lots of rock or wood · 15%',15],['Reef rockwork · 20%',20]]));
  if(c.id==='stocking'&&f.key==='size'){
    const sizes=a.kind==='marine'?[['2 in · neon goby, clown goby',2,5],['3 in · clownfish, royal gramma, firefish',3,8],['4 in · flame angel, cardinalfish',4,10]]
      :[['1 in · ember tetra, chili rasbora',1,2.5],['1.5 in · neon tetra, male guppy',1.5,4],['2 in · most tetras, platies, danios',2,5],['2.5 in · corydoras, black skirt tetra',2.5,6.5],['3.5 in · mollies, dwarf gourami',3.5,9]];
    return choices('Typical adult sizes','Look up your own fish if you are not sure. Store fish are usually babies.',sizes.map(([label,inch,cm])=>({label:us?label:label.replace(/^[\d.]+ in/,`${cm} cm`),value:us?inch*INCH:cm})));
  }
  if(f.profile)return choices('Know the size on the box?','',us?numbers([5,10,20,29,40,55,75,125],'US gal',GAL):numbers([30,60,100,120,180,240,300,450],'L'));
  if(c.id==='heater'&&f.key==='room')return choices('Typical room lows','Use the coldest it gets where the tank sits.',us?numbers([60,65,68,72],'°F').map(x=>({...x,value:convert(x.value,'°C',false)})):numbers([16,18,20,22],'°C'));
  if(c.id==='heater'&&f.key==='target')return choices('Common tank temperatures','Most tropical fish and reef tanks do well at 76–80 °F (24–27 °C). Bettas and discus like it warmer; goldfish usually need no heater.',us?numbers([76,78,80,82],'°F').map(x=>({...x,value:convert(x.value,'°C',false)})):numbers([24,25,26,28],'°C'));
  if(c.id==='energy'&&f.key==='other')return null;
  if(c.id==='energy'&&f.key==='lights')return choices('Typical lights','LED lights for most home tanks use 10–60 W; reef lights often use 100 W or more. The watts are on the light or its power supply.',numbers([10,20,30,60,100,150],'W'));
  if(c.id==='energy'&&f.key==='pumps')return choices('Typical filters & pumps','Add together everything that runs all day. Small filters use about 5 W, canister filters 10–20 W, reef return pumps 30–80 W.',numbers([5,10,20,30,50,80],'W'));
  if(f.unit==='W')return choices('Common ratings','Choose the watts printed on your equipment.',numbers([25,50,100,150,200,300,500],'W'));
  if(['energy','dli'].includes(c.id)&&['hours','lightHours'].includes(f.key))return choices('Timer shortcuts','Use your actual light schedule.',numbers([6,8,10,12],'hours'));
  if(f.key==='days'&&['nitrate','watercost'].includes(c.id))return choices('How often?','Choose the interval you actually use.',named([['Twice a week',3.5],['Weekly',7],['Every 2 weeks',14],['Monthly',30]]));
  if(f.key==='pct'&&['change','series','nitrate','watercost'].includes(c.id))return choices('Common change sizes','Weekly changes of 20–30% suit most tanks.',numbers([10,20,25,30,50],'%'));
  if(c.id==='ro'&&f.key==='rate')return choices('Rated size of the unit','The gallons-per-day (GPD) number on the membrane or box.',us?numbers([50,75,100,150,200],'GPD',GAL/24):named([['190 L/day (50 GPD)',50],['285 L/day (75 GPD)',75],['380 L/day (100 GPD)',100],['570 L/day (150 GPD)',150],['760 L/day (200 GPD)',200]],GAL/24));
  if(c.id==='ro'&&f.key==='ratio')return choices('Typical waste ratios','Check the flow restrictor or the maker’s specifications.',named([['High-efficiency · 1 : 1',1],['Water-saver · 2 : 1',2],['3 : 1',3],['Standard · 4 : 1',4]]));
  if(c.id==='watercost'&&f.key==='waste')return choices('Where does the water come from?','RO units send some water down the drain for every part they make.',named([['Tap water',0],['Water-saver RO · 2 : 1',2],['Standard RO · 4 : 1',4]]));
  if(c.id==='watercost'&&f.key==='salt')return choices('Freshwater or salt?','A typical reef salt mix uses about 1/2 cup per US gallon (38 g per litre) for each water change.',named([['Freshwater · no salt',0],['Saltwater · typical mix',38]]));
  if(['head','pipe'].includes(c.id)&&f.key==='diameter')return choices(us?'Standard PVC pipe sizes':'Common inside diameters',us?'These are the inside diameters of Schedule 40 PVC. Flexible tubing is sold by its inside diameter, so type that directly.':'Measure the opening, not the outside of the pipe.',us?named([['1/2 in pipe',.602],['3/4 in pipe',.804],['1 in pipe',1.029],['1 1/4 in pipe',1.36],['1 1/2 in pipe',1.59],['2 in pipe',2.047]],25.4):numbers([12,16,20,25,32,40],'mm'));
  if(c.id==='drip'&&f.key==='v')return choices('How much to add','Roughly the amount of water the fish or shrimp arrived in doubles it.',us?named([['1 cup',1],['2 cups',2],['4 cups · 1 quart',4],['8 cups · 1/2 gal',8]],GAL/16):numbers([.25,.5,1,2],'L'));
  if(f.unit==='ppt'){
    if(['target','value'].includes(f.key)&&['salt','adjust','sg'].includes(c.id))return choices('Common targets','Natural seawater is about 35 ppt (1.026). Fish-only tanks are sometimes kept a little lower.',salinityChoices(sg));
    if(c.id==='adjust'&&f.key==='fresh')return choices('What are you adding?','Fresh RO water lowers salinity. Extra-salty water raises it.',sg?[{label:'1.000 · fresh RO water',value:0},{label:'1.026 · new saltwater',value:35},{label:'1.030 · extra-salty mix',value:pptFromSg(1.03)}]:[{label:'0 ppt · fresh RO water',value:0},{label:'35 ppt · new saltwater',value:35},{label:'40 ppt · extra-salty mix',value:40}]);
    if(c.id==='ato'&&f.key==='salinity')return choices('Tank type','',sg?[{label:'Freshwater · 1.000',value:0},{label:'Reef · 1.026',value:35}]:[{label:'Freshwater · 0 ppt',value:0},{label:'Reef · 35 ppt',value:35}]);
  }
  if((f.unit==='L'&&['salt','ro','mix','heatup'].includes(c.id)&&f.key==='v')||(c.id==='ato'&&f.key==='reserve'))return choices('Common containers','A 5-gallon bucket filled to a safe carrying level holds about 4.5 gallons.',us?numbers([1,2,5,10,20,32],'US gal',GAL):numbers([5,10,20,40,60,100],'L'));
  if(c.id==='fertilizer'&&f.key==='fraction')return choices('Common dry fertilizers','The share of the named nutrient in the pure chemical.',named([['Potassium nitrate → nitrate · 61.3%',61.3],['Monopotassium phosphate → phosphate · 69.8%',69.8],['Potassium sulfate → potassium · 44.9%',44.9],['Epsom salt → magnesium · 9.86%',9.86]]));
  if(f.unit==='mL'&&['bottle','reserve','final'].includes(f.key))return choices('Common bottle sizes',c.id==='fertilizer'?'The finished volume, after topping up.':c.id==='stock'?'How much diluted solution you want to end up with.':'Adjust for how much is actually left.',numbers([100,250,500,1000],'mL'));
  if(c.id==='doser'&&f.key==='seconds')return choices('Calibration timer','Measure what your pump actually dispenses during the chosen interval.',numbers([30,60,120,300],'seconds'));
  if(c.id==='co2cylinder'&&f.key==='reserve')return choices('Reserve examples','Plan to refill before you reach this. Run nearly empty, some regulators release a sudden burst of CO₂.',numbers([25,50,100],'g'));
  return null;
}
export function extraHelp(c,f,a={},us=true){
  if(f.profile)return 'Not sure? Use Tank volume to work it out from a tape measure, then save it as your tank.';
  if(c.id==='tank'&&f.key==='l')return 'A tape measure across the inside is best. Measuring the outside reads a few percent high.';
  if(c.id==='substrate'&&['l','w'].includes(f.key))return 'Measure across the inside bottom of the tank. A ruler or tape measure is enough.';
  if(c.id==='substrate'&&f.key==='bagMode')return 'Most gravel and sand bags show a weight (lb or kg). Some planted-tank soils show litres. Either works here.';
  if(c.id==='label'&&f.key==='dose'){const water=us?['10 gallons','10']:['40 litres','40'],dose={mL:['5 mL','5'],tsp:['1 teaspoon','1'],tbsp:['1 tablespoon','1'],drops:['10 drops','10'],capfuls:['1 capful','1'],pumps:['1 pump','1'],g:['1 gram','1'],scoops:['1 scoop','1'],tablets:['1 tablet','1']}[a.unit]||['5 mL','5'];return `Example: a label that says “${dose[0]} treats ${water[0]}” means ${dose[1]} here and ${water[1]} in the next box. Doses are not interchangeable between products.`;}
  if(c.id==='supplement'&&['dose','labelV','rise'].includes(f.key))return 'Read the dose, the water volume and the rise together from this exact product’s label. They differ between brands.';
  if(['change','target','series'].includes(c.id)&&['current'].includes(f.key))return 'Your test-kit result, for example nitrate in ppm. The example is not a reading from your tank.';
  if(['mix','supplement'].includes(c.id)&&f.key==='target')return 'The reading you are aiming for. The example is not a recommendation for your tank.';
  if(['mix','consumption','supplement'].includes(c.id)&&!f.options&&['high','low','start','end','current'].includes(f.key))return 'Use your own test result. The example is not a reading from your tank.';
  if(c.id==='energy'&&f.key==='price')return 'The price per kWh on your electricity bill. The US average is around 17–18 cents.';
  if(c.id==='energy'&&f.key==='duty')return 'A heater cycles on and off. Around 25% is typical in a normal room; in a cold room it runs far more.';
  if(c.id==='energy'&&['lights','pumps','heater','other'].includes(f.key))return '';
  if(c.id==='pipe'&&f.key==='flow')return 'Use the flow the pump really delivers, not the maximum on the box.';
  if(c.id==='dli'&&f.key==='par')return 'From a PAR meter held at plant level. Lamp wattage cannot be converted to PAR.';
  if(c.id==='fertilizer'&&f.key==='fraction')return 'It depends on the exact chemical, not just the fertilizer’s name.';
  return '';
}
export function bagComparison(a,us){
 const amount=a.bagMode==='weight'?a.l*a.w*(a.front+a.back)/2000*substrateDensity(a):a.l*a.w*(a.front+a.back)/2000;
 return bagSizes(a.bagMode,us).map(x=>({...x,bags:wholeUp(amount/x.value)}));
}
