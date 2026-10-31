// Qualitative teaching model: normalized flow and accelerated maintenance, not a
// Penguin pump curve, aquarium water-quality prediction or bacterial growth clock.
export const defaults={pump:true,flow:78,loading:18,restriction:0,water:80,maturity:78,jammed:false,primed:true};
export const SERVICE=[
 ['Power disconnected','The animation stops the pump before a person opens the filter.'],
 ['Open & lift','Lift the cover and remove the cartridge, or lift the wheel for axle inspection.'],
 ['Service the right part','Replace the cartridge. For wheel service, clean the axle and bearing seats while keeping the wheel moist.'],
 ['Seat & refill','Re-seat the parts and fill the filter box before restarting.'],
 ['Restart & observe','Check the return flow and free wheel movement. A slow or uneven wheel is not automatically a fault.']
];
export const servicePhase=p=>Math.min(4,Math.floor(p*5));
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
export function createSimulation(){
 let s;
 function reset(){s={time:0,flow:0,angle:0,speed:0,travel:0,impeller:0,wetness:.92,level:3.32,service:null,serviceTime:0,serviceProgress:0,services:0,restored:false,returnPulse:0};}
 reset();
 function service(kind){if(!s.service){s.service=kind;s.serviceTime=0;s.serviceProgress=0;s.restored=false;}}
 function step(dt,c){let remaining=Math.max(0,Math.min(dt,1));while(remaining>0){const h=Math.min(.025,remaining);remaining-=h;s.time+=h;
  if(s.service){s.serviceTime+=h;s.serviceProgress=clamp(s.serviceTime/15);if(s.serviceProgress>=.68&&!s.restored){if(s.service==='cartridge')c.loading=8;else c.jammed=false;c.primed=true;s.restored=true;}if(s.serviceTime>=15){s.service=null;s.services++;s.serviceProgress=1;}}
  const serviceStop=!!s.service,canPump=c.pump&&c.primed&&!serviceStop;
  const raw=c.flow/100*(1-c.restriction/100*.92),resistance=1-c.loading/100*.80;
  const target=canPump?raw*resistance:0;s.flow+=(target-s.flow)*(1-Math.exp(-h*2.3));if(s.flow<.0001)s.flow=0;
  s.travel+=s.flow*h;s.returnPulse+=s.flow*h;
  const pulse=.88+.12*Math.sin(s.angle*3+.7)+.045*Math.sin(s.angle*11);
  const targetSpeed=c.jammed||serviceStop||s.flow<.04?0:Math.max(0,(s.flow-.025)*1.6)*pulse;
  s.speed+=(targetSpeed-s.speed)*(1-Math.exp(-h*(c.jammed||serviceStop?12:3)));if(s.speed<.0001)s.speed=0;s.angle+=s.speed*h;
  s.impeller+=canPump?raw*h*17:0;
  // Retained moisture persists after the pump stops; the wheel is not dried on
  // every air-exposure arc. Bearing service explicitly maintains moisture.
  const moistureTarget=s.service==='bearings'?.93:s.flow>.02?.97:.18;
  s.wetness+=(moistureTarget-s.wetness)*(1-Math.exp(-h*(s.flow>.02?.65:.0025)));
  const levelTarget=c.primed?3.22+.19*s.flow+.16*(c.loading/100)*(canPump?1:0):2.64;
  s.level+=(levelTarget-s.level)*(1-Math.exp(-h*1.4));
 }}
 function snapshot(c=defaults){const bypass=!!(c.pump&&c.primed&&!s.service&&c.loading>86&&c.flow>55),aquariumLevel=1.92+c.water/100*.84;return {...s,bypass,aquariumLevel,filmPhase:Math.cos(s.angle)<-.25?'Water contact':'Moist air exposure',regime:s.service?'Human maintenance':!c.pump?'Pump off':!c.primed?'Fill before starting':c.jammed?'Axle obstructed':s.flow<.08?'Restricted flow':bypass?'Cartridge bypass':'Water-driven rotation',relativeActivity:clamp(c.maturity/100*s.wetness*(.3+.7*clamp(s.flow*2))),flowPercent:Math.round(s.flow*100)};}
 return{reset,service,step,snapshot};
}
