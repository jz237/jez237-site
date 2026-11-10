// Slider bounds are convenient editing windows, never safety recommendations or
// replacements for the calculator's full validated numeric domain.
import {convert,sgFromPpt,flowGuide} from './calculators.mjs';
const unitWindows={
  '%':[100,1],L:[400,1],'L/h':[4000,10],cm:[200,.5],mm:[50,.5],m:[10,.1],kg:[100,.1],
  '°C':[40,.5],pH:[10,.05],dKH:[30,.1],ppt:[50,.1],'mg/L':[100,.5],mL:[100,.5],
  g:[100,.5],'kg/L':[3,.01],'g/L':[60,.5],days:[30,1],hours:[72,.5],changes:[20,1],
  heaters:[10,1],doses:[24,1],seconds:[300,1],W:[1000,5],'W/L':[5,.1],fish:[60,1],
  '$/kWh':[1,.01],'$/m³':[20,.1],'$/kg':[30,.1],'$/m²':[200,1],': 1':[10,.1],
  '×/hour':[30,.5],'drops/s':[10,.1],'drops/mL':[40,1],'µmol/m²/s':[500,5]
};
const overrides={
  // Front and back depths share one window so the two sliders read alike.
  tank:{displacement:[50,1]},substrate:{front:[25,.5],back:[25,.5],bag:[30,.5],bagWeight:[25,.1]},head:{e90:[12,1],e45:[12,1],valves:[6,1],checks:[6,1]},
  sump:{drop:[10,.1],pipe:[30,.1],reserve:[100,1]},ro:{rate:[40,.1],feed:[1000,5],product:[100,1]},
  label:{bottle:[1000,5],dose:[50,.5]},stock:{stock:[5000,10],target:[1000,5],final:[1000,5]},
  ammonia:{tan:[8,.05]},salt:{bag:[25000,100],target:[45,.5]},ato:{daily:[10,.1],reserve:[100,1]},sg:{value:[45,.5]},
  stocking:{size:[40,.5]},heater:{room:[35,.5],target:[35,.5]},drip:{v:[4,.05]},watercost:{evap:[10,.1],salt:[60,1]},
  co2cylinder:{full:[10,.01],tare:[10,.01],daily:[30,.1],reserve:[200,1]},
  doser:{collected:[100,.1],daily:[100,.1],reserve:[2000,10]}
};
const nice=v=>{if(v<=0)return 1;const p=10**Math.floor(Math.log10(v));return [1,2,5,10].find(n=>n*p>=v-1e-10)*p;};
export function sliderWindow(calc,field,a,us=false,sg=false){
  // Salinity can be shown as specific gravity. The saved value stays in ppt.
  if(sg&&field.unit==='ppt'){
    const domainMin=sgFromPpt(field.min),domainMax=sgFromPpt(field.max),value=Number(sgFromPpt(a[field.key]).toFixed(4));
    let min=domainMin,max=Math.min(domainMax,1.035);
    if(Number.isFinite(value)&&value>=domainMin&&value<=domainMax)max=Math.max(max,value);
    return {min:Number(min.toFixed(4)),max:Number(max.toFixed(4)),step:.0005,value,domainMin,domainMax};
  }
  let [high,step]=overrides[calc.id]?.[field.key]||unitWindows[field.unit]||[Math.max(20,nice(field.value*2)),.1];
  // These selectors change the measurement scale without changing its field schema.
  if(calc.id==='supplement'&&['current','target','rise'].includes(field.key)){
    [high,step]=a.parameter==='mg/L'?(field.key==='rise'?[100,1]:[2000,5]):(field.key==='rise'?[5,.1]:[20,.1]);
  }
  if(calc.id==='consumption'&&['start','end'].includes(field.key))[high,step]=a.parameter==='mg/L'?[2000,5]:[20,.1];
  if(calc.id==='hardness')[high,step]=a.unit==='ppm'?[500,1]:a.unit==='meq'?[10,.1]:[30,.1];
  if(calc.id==='mix'&&['high','low','target'].includes(field.key))[high,step]=a.measure==='mg/L'?[1000,5]:[30,.1];
  const unit=field.displayUnit||field.unit;
  const display=v=>us?convert(v,unit,true):v;
  const domainMin=display(field.min),domainMax=display(field.max),value=display(a[field.key]);
  if(us&&unit!=='°C'&&convert(1,unit,true)!==1){
    high=nice(display(high));step=nice(display(step));
  }else if(us&&field.unit==='°C'){high=display(high);step=1;}
  if(us&&calc.id==='substrate'&&field.key==='bagWeight'){high=50;step=.5;}
  // The flow window follows the tank, so the usual range sits mid-slider for a nano tank and a large reef alike.
  if(calc.id==='turnover'&&field.key==='flow'&&flowGuide[a.kind]&&Number.isFinite(a.v)&&a.v>0){high=nice(display(a.v*flowGuide[a.kind][1]*2));step=nice(high/100);}
  // Tape measures read in quarter inches.
  if(us&&unit==='cm')step=.25;
  // The low edge lies on the editing increment where practical. Tiny manually
  // entered values remain representable; exact typing never changes precision.
  let min=Math.max(domainMin,Math.ceil(domainMin/step-1e-9)*step);
  let max=Math.min(domainMax,Math.max(high,min+step));
  if(Number.isFinite(value)&&value>=domainMin&&value<=domainMax){
    min=Math.min(min,value);if(value>max)max=Math.min(domainMax,nice(value*1.2));
  }
  return {min,max,step,value,domainMin,domainMax};
}
export function sliderValue(value,{min,max,step}){
  // Home/End retain the exact endpoints. Rounding AFTER clamping could put a
  // converted inch/gallon endpoint outside the calculator's numeric domain.
  if(value<=min)return min;
  if(value>=max)return max;
  return Math.max(min,Math.min(max,Number((Math.round(value/step)*step).toPrecision(12))));
}
