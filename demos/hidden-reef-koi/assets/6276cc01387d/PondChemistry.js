/** Independent teaching model. Nitrogen species are tracked as mg/L N;
 * pH is a user-supplied sample, never a guessed carbonate equilibrium. */
export const ammoniaFraction=(temperature,pH)=>1/(1+10**(.09018+2729.92/(temperature+273.15)-pH));
export const oxygenSaturation=t=>14.652-.41022*t+.007991*t*t-.000077774*t*t*t;
export class PondChemistry{
 constructor(){this.reset();}
 reset(){this.state={temperature:22,pH:7.6,oxygen:8,ammonia:.02,nitrite:.006,nitrate:4,alkalinity:110,organic:.04};this.aeration=true;this.filter=true;this.hours=0;this.history=[];this.lastChange=null;this.record('Start');}
 record(event='Hourly sample'){this.history.push({...this.state,hour:this.hours,event,aeration:this.aeration,filter:this.filter,saturation:oxygenSaturation(this.state.temperature),unionized:this.unionized});if(this.history.length>97)this.history.shift();}
 fork(){const copy=new PondChemistry();copy.state={...this.state};copy.aeration=this.aeration;copy.filter=this.filter;copy.hours=this.hours;copy.history=[];copy.record('Comparison start');return copy;}
 feed(){this.state.organic+=.24;this.record('Extra food');}
 waterChange(fraction=.25){if(!Number.isFinite(fraction)||fraction<0||fraction>1)throw new RangeError('Water-change fraction must be between zero and one.');const before={...this.state};const fresh={oxygen:8.5,ammonia:0,nitrite:0,nitrate:0,alkalinity:110,organic:0};for(const key in fresh)this.state[key]=this.state[key]*(1-fraction)+fresh[key]*fraction;this.lastChange={before,after:{...this.state},fraction,hour:this.hours};this.record(`${Math.round(fraction*100)}% water change`);}
 advance(hours=6){for(let hour=0;hour<hours;hour++){
  const s=this.state,thermal=2**((s.temperature-22)/10),decompose=Math.min(s.organic,s.organic*.14*thermal);s.organic-=decompose;s.ammonia+=decompose+.0025*thermal;
  const oxygenFactor=Math.min(1,Math.max(0,(s.oxygen-1)/4)),bufferFactor=Math.min(1,s.alkalinity/40);
  const first=this.filter?Math.min(s.ammonia,s.ammonia*.62*thermal*oxygenFactor*bufferFactor,s.oxygen/3.43,s.alkalinity/7.14):0;
  s.ammonia-=first;s.nitrite+=first;s.oxygen-=first*3.43;s.alkalinity-=first*7.14;
  const second=this.filter?Math.min(s.nitrite,s.nitrite*.48*thermal*oxygenFactor,Math.max(0,s.oxygen)/1.14):0;s.nitrite-=second;s.nitrate+=second;s.oxygen-=second*1.14;
  s.nitrate=Math.max(0,s.nitrate-.003);s.oxygen=Math.max(0,s.oxygen-.16*thermal-decompose*.6);
  const exchange=this.aeration?.34:.018;s.oxygen=Math.max(0,s.oxygen+(oxygenSaturation(s.temperature)-s.oxygen)*exchange);
  this.hours++;this.record();
 }return this.state;}
 get unionized(){return this.state.ammonia*ammoniaFraction(this.state.temperature,this.state.pH);}
 get message(){if(this.state.oxygen<5)return 'Oxygen is falling. Warm water holds less oxygen, while fish and microbes keep using it. Compare the same scenario with aeration on.';if(this.state.ammonia>.1||this.state.nitrite>.05)return 'Nitrogen waste is accumulating. The biological filter needs oxygen and time; a water change dilutes waste but does not replace a working filter.';return 'The filter is keeping up in this example. In a real pond, test ammonia and nitrite regularly and aim for no detectable reading.';}
}
