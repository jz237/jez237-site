const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
// Exact critically damped spring. Animation is driven by simulation signals,
// never random frame offsets, and cannot feed forces back into the race.
function spring(memory,key,target,frequency,dt){
 const value=memory[key]??target,velocity=memory[key+'Velocity']??0;
 const displacement=value-target,c=velocity+frequency*displacement,e=Math.exp(-frequency*dt);
 memory[key]=target+(displacement+c*dt)*e;
 memory[key+'Velocity']=(velocity-frequency*c*dt)*e;
 return memory[key];
}
export function riderMotion(memory,time,turn,motion={}){
 const reset=memory.time===undefined||time<memory.time||time-memory.time>1;
 if(reset){for(const key of Object.keys(memory))delete memory[key];memory.speed=motion.speed||0;}
 // Rendering can run more often than the 60 Hz simulation, including many
 // identical samples while paused. Deriving both the spring and acceleration
 // from render dt would pump the spring and dilute acceleration at high FPS.
 // The exact spring is stable across a slow frame without dropping elapsed
 // simulation time. An explicit zero dt still freezes inspection frames.
 const dt=motion.dt===0?0:clamp(time-(memory.time??time),0,1);
 const acceleration=dt>0?clamp(((motion.speed||0)-memory.speed)/dt,-16,12):0;
 memory.speed=motion.speed||0;memory.time=time;
 const forward=spring(memory,'forward',clamp(motion.lean||0,-1,1)*.10-acceleration*.008,9,dt);
 const lean=spring(memory,'lean',clamp(turn,-1,1),12,dt);
 const compression=spring(memory,'compression',clamp(motion.compression??(motion.impact||0)*.035,0,.38),18,dt);
 const flight=spring(memory,'flight',motion.airborne?1:0,10,dt);
 const load=spring(memory,'load',clamp((motion.load??1)-1,-1,3),10,dt);
 const wetness=spring(memory,'wetness',clamp(.25+(motion.speed||0)/35+(motion.impact||0)*.08,0,1),2,dt);
 return {...motion,turn:lean,forwardShift:forward,compression,flightBlend:flight,loadShift:load,wetness};
}
