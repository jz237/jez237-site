// Curated editing shortcuts, not recommendations for livestock or chemical doses.
import {GAL,convert} from './calculators.mjs';
const LB=.45359237;
const choices=(title,note,options)=>({title,note,options});
const numbers=(values,unit,scale=1)=>values.map(n=>({label:`${n} ${unit}`,value:n*scale}));
export function bagSizes(mode,us){
  return mode==='volume'?numbers([3,5,8,9,10,20],'L').map(x=>({...x,label:us?`${x.value/GAL<1?'<1':'≈'+Math.round(x.value/GAL)} US gal (${x.value} L label)`:x.label})):us?numbers([5,10,20,25,50],'lb',LB):numbers([2,4,5,8,10,20,25],'kg');
}
export function fieldChoices(c,f,us,a){
  if(c.id==='substrate'){
    if(f.key==='bag')return choices('Common volume-labelled bags',us?'Match the litres in parentheses to the package label. Gallon equivalents are rounded; bag counts use the exact labelled volume.':'Match the litres printed on your package. Sizes vary by brand.',bagSizes('volume',us));
    if(f.key==='bagWeight')return choices('Common weight-labelled bags','Tap the weight on the bag, or enter a different size. These are examples, not store stock.',bagSizes('weight',us));
    if(f.key==='density')return choices('Not sure? Start with a material estimate','Rough bulk estimates only. Grain size, packing and moisture change the weight. Use your product’s bulk density if available.',[
      ...[['Gravel',1.5],['Sand',1.6],['Aquasoil',.8]].map(([name,value])=>({label:`${name} ≈ ${us?convert(value,'kg/L',true).toFixed(1):value} ${us?'lb/US gal':'kg/L'}`,value}))
    ]);
    if(['front','back'].includes(f.key))return choices('Choose a depth to plan','A layout starting point—not the right depth for every plant or animal.',us?numbers([1,2,3,4],'in',2.54):numbers([2,3,5,8,10],'cm'));
  }
  if(f.key==='v'&&f.label==='Actual water volume')return choices('Know the tank’s advertised size?','These are nominal capacities. Reduce for substrate, rocks and the air gap; add operating sump water if appropriate.',us?numbers([10,20,29,40,55,75,90,125],'US gal',GAL):numbers([30,60,100,120,180,240,300,450],'L'));
  if(c.id==='weight'&&f.key==='density')return choices('Water type estimate','Approximate density; temperature and salinity affect it.',[{label:'Freshwater',value:1},{label:'Typical reef water',value:1.023}]);
  if(f.unit==='W')return choices('Common equipment ratings','Choose the watts printed on your equipment—not a tank-size recommendation.',numbers([25,50,100,150,200,300,500],'W'));
  if(['energy','dli'].includes(c.id)&&['hours','lightHours'].includes(f.key))return choices('Timer shortcuts','Use your actual light schedule.',numbers([6,8,10,12],'hours'));
  if(f.key==='days'&&['nitrate','watercost'].includes(c.id))return choices('Time between changes','Choose the interval you actually use.',numbers([3,7,14,30],'days'));
  if(f.key==='pct'&&['change','series','nitrate','watercost'].includes(c.id))return choices('Compare change sizes','Planning examples; choose the amount for your own aquarium.',numbers([10,20,25,30,50],'%'));
  if((f.unit==='L'&&['salt','ro','drip'].includes(c.id)&&f.key==='v')||(c.id==='ato'&&f.key==='reserve'))return choices('Container sizes','Use the usable fill amount, not an overflowing container.',us?numbers([1,2,5,10,20,32],'US gal',GAL):numbers([5,10,20,40,60,100],'L'));
  if(f.unit==='mL'&&['bottle','reserve','final'].includes(f.key))return choices('Common bottle sizes','Read the label and adjust for how much is actually left.',numbers([100,250,500,1000],'mL'));
  if(c.id==='doser'&&f.key==='seconds')return choices('Calibration timer','Measure what your pump actually dispenses during the chosen interval.',numbers([30,60,120,300],'seconds'));
  if(c.id==='co2cylinder'&&f.key==='reserve')return choices('Reserve examples','This is your chosen allowance; it is not a guaranteed usable gas reserve.',numbers([25,50,100],'g'));
  return null;
}
export function extraHelp(c,f){
  if(f.key==='v'&&f.label==='Actual water volume')return 'Not sure of your volume? Use Tank volume to estimate it from measurements, then save the result.';
  if(c.id==='substrate'&&['l','w'].includes(f.key))return 'Measure across the inside bottom of the tank. A ruler or tape measure is enough.';
  if(c.id==='substrate'&&f.key==='bagMode')return 'Most gravel and sand bags show a weight (lb or kg). Some planted substrates show a volume (L). Either works here.';
  if(['label','supplement'].includes(c.id)&&['dose','labelV','rise'].includes(f.key))return 'Read the dose, water volume and strength together on this specific product’s label. They are not interchangeable between brands.';
  if(['change','target','series','nitrate','ammonia','co2','mix','consumption','supplement'].includes(c.id)&&!f.options&&!['v','dose','labelV','days','hours','pct','n'].includes(f.key))return 'Use your test result, measured trend, or deliberately chosen target. The example shown is not a reading from your tank.';
  if(c.id==='energy'&&f.key==='price')return 'Find the price per kWh on your electricity bill. Include supply and delivery charges if you want a fuller estimate.';
  if(c.id==='energy'&&f.key==='duty')return 'The fraction of time the heater is actually on—not simply plugged in. Use a smart plug or observed on/off time if available.';
  if(['turnover','pipe','head'].includes(c.id)&&f.key==='flow')return 'Use measured delivered flow where possible. A pump’s box rating is usually before plumbing losses.';
  if(['pipe','head'].includes(c.id)&&f.key==='diameter')return 'Measure the inside opening. Nominal pipe sizes and outside diameters are not the same as this number.';
  if(c.id==='dli'&&f.key==='par')return 'Use a PAR-meter reading at the plants. Lamp wattage cannot reliably be converted to PAR.';
  if(c.id==='fertilizer'&&f.key==='fraction')return 'Read the nutrient percentage on the product’s analysis. It depends on the exact chemical—not just the fertilizer name.';
  return '';
}
export function bagComparison(a,us){
 const amount=a.bagMode==='weight'?a.l*a.w*(a.front+a.back)/2000*a.density:a.l*a.w*(a.front+a.back)/2000;
 return bagSizes(a.bagMode,us).map(x=>({...x,bags:Math.ceil(amount/x.value)}));
}
