// Qualitative exposure model. No calibrated dose, kill rate or aquarium sizing.
export const defaults={flow:55,clarity:90,fouling:12,output:92,pump:true,lamp:true};
export const SERVICE_SECONDS=24;
export const SERVICE=[
 ['Disconnect & isolate','Disconnect UV power, isolate the water supply and allow the unit to cool. The lamp is dark for the entire open-unit sequence.'],
 ['Withdraw straight','Unscrew the cap and withdraw the lamp assembly along its axis. Support the glass; do not lever the lamp sideways.'],
 ['Inspect the dry lamp','Separate the lamp from its socket. Fit the correct replacement by aligning its pins; avoid handling the glass with bare fingers.'],
 ['Clean & inspect the sleeve','The separate sleeve shields the lamp from water. Inspect it and its sealing surfaces; clean only as the manufacturer directs.'],
 ['Reseat & seal','Reinstall the sleeve, lamp and cap. Inspect seals and seat the assembly without forcing the glass.'],
 ['Refill before UV power','Restore water flow and check for leaks with UV power disconnected. Only after the housing is closed and filled is UV power restored.']
];
export const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
export function physics(s,service=false){
 const flow=s.pump&&!service?clamp(s.flow/100):0;
 const lamp=!!s.lamp&&flow>.01&&!service;
 const transmission=clamp(s.clarity/100)*(1-.82*clamp(s.fouling/100));
 const intensity=lamp?clamp(s.output/100)*transmission:0;
 const residence=flow>.01?.55/flow:0;
 const exposure=flow>.01?intensity*residence:0;
 return {flow,lamp,transmission,intensity,residence,exposure,paths:[.66,1,1.24].map(f=>exposure*f),regime:service?'Power isolated · human service':!s.pump||flow<=.01?'No circulation · UV held off':!s.lamp?'Water moving · UV off':s.output<25?'Lamp output diminished':s.fouling>60?'Sleeve limits transmission':s.clarity<45?'Water attenuates UV':'Closed chamber · UV operating'};
}
export function createSimulation(){let time=0,travel=0,serviceTime=null,completed=0;
 return {reset(){time=travel=completed=0;serviceTime=null;},startService(){serviceTime=0;},cancelService(){serviceTime=null;},
 step(dt,state){dt=clamp(Number.isFinite(dt)?dt:0,0,.1);time+=dt;
  if(serviceTime!==null){serviceTime+=dt;if(serviceTime>=SERVICE_SECONDS){serviceTime=null;completed++;state.fouling=0;state.output=100;}}
  const p=serviceTime!==null&&serviceTime>=20?physics({...state,lamp:false}):physics(state,serviceTime!==null);travel+=dt*p.flow;
 },snapshot(state){const service=serviceTime!==null,p=service&&serviceTime>=20?{...physics({...state,lamp:false}),regime:'Refilling · UV disconnected'}:physics(state,service);return {time,travel,service,serviceProgress:service?serviceTime/SERVICE_SECONDS:0,servicePhase:service?Math.min(5,Math.floor(serviceTime/4)):-1,completed,...p};}};
}
