// Particle identities survive capture and winding. Distances are illustrative
// model units, driven by waterPhase before capture and web travel afterward.
export function createParticleTransport(count=180){
 let previousTime=-1,previousWater=0,previousTravel=0,previousServices=0,previousRemaining=1,exported=0;
 const particles=Array.from({length:count},(_,id)=>({id,phase:'water',progress:-(id%23)/23,anchor:0,angle:0,distance:0,z:Math.sin(id*7.91)*.76,speed:.16+(id%11)*.012}));
 function reset(){for(const p of particles){p.phase='water';p.progress=-(p.id%23)/23;p.anchor=0;p.angle=0;}exported=0;}
 return {particles,update(s,length,captureDistance,rollAngle,load=100,holdId=-1){
  if(s.time<previousTime||s.travel<previousTravel||s.services>previousServices||s.remaining>previousRemaining+.3)reset();
  const dt=previousTime<0?0:Math.max(0,s.waterPhase-previousWater);
  for(const p of particles){
   if(p.phase==='water'){
    if(p.id<count*load/100)p.progress+=dt*p.speed;
    if(p.progress>=1){p.phase='captured';p.anchor=captureDistance(p.id)-s.travel;p.distance=p.anchor+s.travel;}
   }else if(p.phase==='captured'){
    p.distance=p.anchor+s.travel;
    if(p.distance>=length){p.phase='wound';p.angle=rollAngle;exported++;}
   }else if(p.id!==holdId&&rollAngle-p.angle>Math.PI*2.1){p.phase='water';p.progress=-.4;}
  }
  previousTime=s.time;previousWater=s.waterPhase;previousTravel=s.travel;previousServices=s.services;previousRemaining=s.remaining;
 },snapshot(){return {flowing:particles.filter(p=>p.phase==='water').length,captured:particles.filter(p=>p.phase==='captured').length,wound:particles.filter(p=>p.phase==='wound').length,exported};}};
}

const clamp=x=>Math.max(0,Math.min(1,x)),smooth=x=>{x=clamp(x);return x*x*(3-2*x);};
export const SERVICE_STEPS=[
 ['Release the spindle clips','A person opens the retainers and disengages the take-up coupling.'],
 ['Lift out the spent rolls','The loaded roll and empty supply core leave their bearing seats.'],
 ['Install fresh fleece','A fresh supply roll and clean take-up core are seated in the frame.'],
 ['Thread beneath the guides','The leading edge follows the supported U-shaped path to the take-up core.'],
 ['Secure, tension and check','Close the clips, attach the leading edge and check that the fabric runs straight.']
];
export function serviceStage(progress){return progress<0?-1:progress<.14?0:progress<.5?1:progress<.66?2:progress<.88?3:4;}
export function detailedServicePose(progress){
 if(progress<0)return {phase:-1,clip:0,lift:0,shift:0,visible:true,thread:1,tension:1};
 const phase=serviceStage(progress),out=smooth((progress-.14)/.20),inward=1-smooth((progress-.50)/.16);
 return {phase,clip:progress<.88?smooth(progress/.14):1-smooth((progress-.88)/.12),lift:progress<.5?out*1.2:inward*1.2,shift:progress<.5?out*.9:inward*.9,visible:progress<.38||progress>=.50,thread:progress<.14?1:progress<.66?0:smooth((progress-.66)/.22),tension:progress<.88?0:smooth((progress-.88)/.12)};
}
