/** Illustrative 180 L freshwater model. All time is simulated hours; gases mg/L,
 * dissolved nitrogen mg N/L. Constants are teaching parameters, not calibration. */
export const defaults=()=>({light:65,co2:24,flow:65,agitation:35,temperature:24,photoperiod:8,feed:1,fertilizer:1,kh:4});
export type Environment=ReturnType<typeof defaults>;
export const initial=()=>({hours:0,co2:24,oxygen:8.1,temperature:24,ammonia:.015,nitrite:.01,nitrate:4.5,waste:.3,algae:.04,biomass:1,bacteria:.95,ph:6.7});
export type Ecology=ReturnType<typeof initial>;
export const scenarios=['Balanced mature aquarium','Newly cycled aquarium','CO₂ turned off','Excessive light','Overfeeding event','Clogged filter','Missed water changes','Post-trim recovery','Algae bloom and correction','Day to night'] as const;
export function preset(name:string):{state:Ecology;environment:Environment;explanation:string}{
 const state=initial(),environment=defaults();let explanation='A mature biological filter, moderate light and distributed carbon support steady growth. Try 1 day per second to observe several light cycles.';
 switch(name){
 case scenarios[1]:state.bacteria=.35;state.ammonia=.15;state.nitrite=.1;explanation='Recently cycled filters have less reserve capacity. Watch bacterial capacity develop over days; additional food can still overwhelm it.';break;
 case scenarios[2]:environment.co2=0;explanation='Dissolved carbon declines over hours. Plant growth slows; under the same light, algae pressure builds over days. Restore carbon and allow recovery time.';break;
 case scenarios[3]:environment.light=100;environment.photoperiod=14;explanation='Long, intense light increases demand for carbon and nutrients. Algae pressure accumulates if demand outpaces supply. Shorten the photoperiod to recover.';break;
 case scenarios[4]:state.waste=5;explanation='Uneaten food becomes organic waste. Mineralization releases ammonia; nitrification consumes oxygen and produces nitrite, then nitrate.';break;
 case scenarios[5]:environment.flow=8;explanation='Restricted circulation reduces delivery to the filter and plants. Organic waste accumulates. Restore flow and watch gases recover before slower biology.';break;
 case scenarios[6]:state.nitrate=18;state.waste=3;explanation='Accumulated nitrogen and organic material reflect missed maintenance. A water change dilutes dissolved waste; it does not instantly erase algae.';break;
 case scenarios[7]:state.biomass=.55;explanation='Trimming reduces photosynthetic area immediately. Biomass and roots recover gradually as light reaches lower growth points.';break;
 case scenarios[8]:state.algae=.7;environment.light=45;environment.photoperiod=6;explanation='The bloom begins with corrected conditions. Established algae declines gradually; remove some manually, restore carbon and keep maintenance consistent.';break;
 case scenarios[9]:state.hours=5.8;explanation='The photoperiod ends at 18:00. Photosynthesis stops, while plants, fish and microbes keep respiring. Surface gas exchange becomes especially important.';break;
 }return {state,environment,explanation};
}
const clamp=(x:number,a:number,b:number)=>Math.max(a,Math.min(b,x));
export function illumination(s:Ecology,e:Environment){const hour=(12+s.hours)%24,start=14-e.photoperiod/2,end=14+e.photoperiod/2;return clamp(Math.min((hour-start)*2,(end-hour)*2),0,1)*e.light/65;}
export function advance(s:Ecology,e:Environment,hours:number){
 // Bound each integration step to one minute, irrespective of playback speed.
 let remaining=Math.max(0,hours);while(remaining>1e-9){const h=Math.min(remaining,1/60);remaining-=h;
 const light=illumination(s,e),flow=e.flow/100,gas=.1+e.agitation/65+flow*.25;
 const carbon=s.co2/(s.co2+8),nutrient=s.nitrate/(s.nitrate+1),delivery=.25+.75*flow;
 const photo=light*carbon*nutrient*delivery*s.biomass;
 const resp=.18+.10*s.biomass+.035*s.waste;
 s.co2+=((light>0?e.co2:0)*.13+resp*1.35-(s.co2-.6)*gas*.12-photo*.48)*h;
 const mineral=Math.min(s.waste/h,s.waste*.075);s.waste+=(e.feed*.032-mineral)*h;
 const n1=Math.min(s.ammonia/h,s.ammonia*(.2+flow)*s.bacteria*clamp(s.oxygen/5,0,1));
 const n2=Math.min(s.nitrite/h,s.nitrite*(.18+flow)*s.bacteria*clamp(s.oxygen/5,0,1));
 s.ammonia+=(mineral*.18-n1)*h;s.nitrite+=(n1-n2)*h;
 s.nitrate=Math.max(0,s.nitrate+(n2+e.fertilizer*.014-photo*.025)*h);
 const saturation=8.4-(s.temperature-24)*.16;
 s.oxygen=clamp(s.oxygen+((saturation-s.oxygen)*gas*.42+photo*.9-resp-n1*3.43-n2*1.14)*h,.2,14);
 s.co2=clamp(s.co2,.1,100);s.temperature+=(e.temperature-s.temperature)*Math.min(1,h/3);
 const stress=Math.max(0,light-(carbon*nutrient*delivery*1.8))+.08*s.waste;
 s.algae=clamp(s.algae+(stress*.011-s.algae*.006)*h,0,1);
 s.biomass=clamp(s.biomass+(photo*.0028-s.biomass*.0004-s.algae*.0003)*h,.15,2);
 s.bacteria=clamp(s.bacteria+(.0025*(1-s.bacteria)-Math.max(0,3-s.oxygen)*.001*s.bacteria)*h,.05,1);
 // Carbonate-only estimate: assumes KH supplied entirely by carbonate/bicarbonate.
 s.ph=7-Math.log10(s.co2/(3*e.kh));s.hours+=h;
 }return s;
}
export function waterChange(s:Ecology,fraction=.3){for(const key of ['ammonia','nitrite','nitrate','waste'] as const)s[key]*=1-fraction;}
export function factors(s:Ecology,e:Environment){return {oxygen:clamp((s.oxygen-2)/5,0,1),nitrogen:clamp(1-(s.ammonia+s.nitrite)*2,0,1),circulation:e.flow/100,algae:1-s.algae};}
export function balance(s:Ecology,e:Environment){const f=factors(s,e);return Math.round(100*(f.oxygen*.35+f.nitrogen*.35+f.circulation*.15+f.algae*.15));}
