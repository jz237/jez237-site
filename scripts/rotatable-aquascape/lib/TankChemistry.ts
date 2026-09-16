/** Freshwater teaching chemistry. Hours, mg/L gases, mg N/L nitrogen pools,
 * mg/L as CaCO3 alkalinity, mmol/L dissolved inorganic carbon. See CHEMISTRY.md. */
export const VOLUME_L=180;
export const FOOD_N_FRACTION=.07;
export const FEED_MG=120;
export const DKH=17.848;
const clamp=(x:number,a:number,b:number)=>Math.max(a,Math.min(b,x));
export const chemistryDefaults=()=>({flow:65,co2:24,temperature:24,light:65,agitation:35,photoperiod:8,lightMode:'cycle' as 'cycle'|'day'|'night'});
export type ChemistryEnvironment=ReturnType<typeof chemistryDefaults>;
export function oxygenSaturation(celsius:number){
 // Freshwater, sea-level approximation (mg/L), restricted to aquarium temperatures.
 const t=clamp(celsius,10,35);return 14.652-.41022*t+.007991*t*t-.000077774*t*t*t;
}
export function ammoniaFraction(ph:number,temperature:number){return 1/(1+10**(.09018+2729.92/(temperature+273.15)-ph));}
export function chemistryInitial(){
 // Assumed tissue N: original community 2 + two small angelfish at .4 each.
 // This is an illustrative biomass budget, not a measured weight/stocking limit.
 const s={hours:0,co2:24,oxygen:8.1,temperature:24,ammonia:.015,nitrite:.01,nitrate:4.5,waste:.08,digesting:0,plantN:6,fishN:2.8,
  biomass:1,bacteria:.95,ph:6.7,alkalinity:4*DKH,carbon:24/44.01+4*DKH/50,nh3:0,kh:4,
  nitrogenStart:0,nitrogenAdded:0,nitrogenExported:0};
 s.nitrogenStart=nitrogenInventory(s);speciate(s);return s;
}
export type ChemistryState=ReturnType<typeof chemistryInitial>;
export function nitrogenInventory(s:{ammonia:number;nitrite:number;nitrate:number;waste:number;digesting:number;plantN:number;fishN:number}){return s.ammonia+s.nitrite+s.nitrate+s.waste+s.digesting+s.plantN+s.fishN;}
export function nitrogenError(s:ChemistryState){return nitrogenInventory(s)+s.nitrogenExported-s.nitrogenStart-s.nitrogenAdded;}
export function speciate(s:ChemistryState){
 // Dilute carbonate-only equilibrium; 25 C constants. No humic/phosphate buffers.
 const k1=10**-6.35,k2=10**-10.33,kw=1e-14,ct=s.carbon/1000,alk=s.alkalinity/50000;
 let lo=2,hi=12;
 for(let i=0;i<32;i++){const ph=(lo+hi)/2,h=10**-ph,den=h*h+k1*h+k1*k2;
  const calculated=ct*(k1*h+2*k1*k2)/den+kw/h-h;if(calculated>alk)hi=ph;else lo=ph;}
 s.ph=(lo+hi)/2;const h=10**-s.ph;s.co2=ct*h*h/(h*h+k1*h+k1*k2)*44010;
 s.nh3=s.ammonia*ammoniaFraction(s.ph,s.temperature);s.kh=s.alkalinity/DKH;
}
export function chemistryLight(s:ChemistryState,e:ChemistryEnvironment){
 if(e.lightMode==='night')return 0;if(e.lightMode==='day')return e.light/65;
 const hour=Math.round(((12+s.hours)%24)*1e8)/1e8,start=14-e.photoperiod/2,end=14+e.photoperiod/2;
 return clamp(Math.min((hour-start)*2,(end-hour)*2),0,1)*e.light/65;
}
export function addFeed(s:ChemistryState,dryMilligrams=FEED_MG){
 if(!Number.isFinite(dryMilligrams)||dryMilligrams<=0)return 0;
 const nitrogen=dryMilligrams*FOOD_N_FRACTION/VOLUME_L;s.waste+=nitrogen;s.nitrogenAdded+=nitrogen;return nitrogen;
}
export function consumeFeed(s:ChemistryState,nitrogen:number){
 if(!Number.isFinite(nitrogen)||nitrogen<=0)return;
 // A visual bite cannot remove more nitrogen than remains in the food pool.
 const eaten=Math.min(s.waste,nitrogen);s.waste-=eaten;s.fishN+=eaten*.25;s.digesting+=eaten*.75;
}
export function nitrify(s:ChemistryState,first:number,second:number){
 const a=Math.max(0,Math.min(first,s.ammonia,s.oxygen/3.43,s.alkalinity/7.14));
 s.ammonia-=a;s.nitrite+=a;s.oxygen-=a*3.43;s.alkalinity-=a*7.14;
 const b=Math.max(0,Math.min(second,s.nitrite,s.oxygen/1.14));s.nitrite-=b;s.nitrate+=b;s.oxygen-=b*1.14;
 return {first:a,second:b};
}
export function advanceChemistry(s:ChemistryState,e:ChemistryEnvironment,hours:number){
 if(!Number.isFinite(hours)||hours<=0)return;
 let remaining=Math.min(hours,24);
 while(remaining>1e-9){const h=Math.min(remaining,1/60);remaining-=h;
  s.temperature+=(clamp(e.temperature,18,30)-s.temperature)*(1-Math.exp(-h/3));
  const light=chemistryLight(s,e),flow=clamp(e.flow,0,100)/100,gas=.1+clamp(e.agitation,0,100)/65+flow*.25;
  const thermal=2**((s.temperature-24)/10),oxygen=clamp(s.oxygen/5,0,1),delivery=.25+.75*flow;
  const availableN=s.ammonia+s.nitrate,photo=light*s.co2/(s.co2+8)*availableN/(availableN+1)*delivery*s.biomass;
  // Bidirectional exchange, then photosynthesis; respiration cannot spend absent O2.
  s.oxygen+=(oxygenSaturation(s.temperature)-s.oxygen)*(1-Math.exp(-gas*.42*h));
  const co2Input=light>1e-6?clamp(e.co2,0,45)*.13*h:0;
  const carbonExchange=(.6-s.co2)*(1-Math.exp(-gas*.12*h));
  s.carbon=Math.max(0,s.carbon+(co2Input+carbonExchange)/44.01);
  const fixedCarbon=Math.min(s.carbon,photo*.9/32*h);s.carbon-=fixedCarbon;s.oxygen+=fixedCarbon*32;
  const basalDemand=(.18*s.fishN/2+.10*s.biomass)*thermal*h;
  const respired=Math.min(s.oxygen,basalDemand);s.oxygen-=respired;s.carbon+=respired/32;
  // Oxygen-limited organic breakdown. Organic N and digestive N become TAN over hours.
  const mineralPotential=s.waste*(1-Math.exp(-.075*thermal*h))*oxygen;
  const mineral=Math.min(mineralPotential,s.oxygen/12);s.waste-=mineral;s.ammonia+=mineral;
  s.oxygen-=mineral*12;s.carbon+=mineral*12/32;s.alkalinity+=mineral*3.57;
  const excretion=s.digesting*(1-Math.exp(-.22*thermal*h));s.digesting-=excretion;s.ammonia+=excretion;s.alkalinity+=excretion*3.57;
  const basalN=Math.min(s.fishN,.001*s.fishN/2*thermal*h);s.fishN-=basalN;s.ammonia+=basalN;s.alkalinity+=basalN*3.57;
  // Nitrifiers remain on tank surfaces with the pump off; delivery and pH limit rates.
  const phFactor=clamp((s.ph-5)/2,0,1),capacity=s.bacteria*oxygen*thermal*phFactor;
  const n1=s.ammonia*(1-Math.exp(-(.2+flow)*capacity*h)),n2=s.nitrite*(1-Math.exp(-(.18+flow)*capacity*h));nitrify(s,n1,n2);
  const demand=photo*.025*h,ammonium=Math.min(s.ammonia,demand*.65,s.alkalinity/3.57),nitrate=Math.min(s.nitrate,demand-ammonium);
  s.ammonia-=ammonium;s.nitrate-=nitrate;s.plantN+=ammonium+nitrate;s.alkalinity+=(nitrate-ammonium)*3.57;
  // Turnover returns plant N to detritus; only export actually removes nitrogen.
  const turnover=s.plantN*(1-Math.exp(-.0001*h));s.plantN-=turnover;s.waste+=turnover;
  s.biomass=clamp(s.plantN/6,.05,2);s.bacteria=clamp(s.bacteria+(.0025*(1-s.bacteria)-Math.max(0,3-s.oxygen)*.001*s.bacteria)*h,.01,1);
  s.hours+=h;speciate(s);
 }
}
export function changeWater(s:ChemistryState,fraction=.3){
 if(!Number.isFinite(fraction))return;fraction=clamp(fraction,0,1);
 // Replacement water is conditioned, 24 C, 4 dKH, no dissolved nitrogen,
 // equilibrated with air. Detritus, fish, plants and attached biofilm stay put.
 const replacement=chemistryInitial();replacement.carbon=.6/44.01+4*DKH/50;
 for(const key of ['ammonia','nitrite','nitrate'] as const){s.nitrogenExported+=s[key]*fraction;s[key]*=1-fraction;}
 for(const [key,value] of [['oxygen',oxygenSaturation(24)],['temperature',24],['alkalinity',4*DKH],['carbon',replacement.carbon]] as const)s[key]+=(value-s[key])*fraction;
 speciate(s);
}
