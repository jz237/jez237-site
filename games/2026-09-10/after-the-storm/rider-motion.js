import {helmCorrection} from './immersion-model.js';
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
 const lean=spring(memory,'lean',clamp(turn*(1+Math.min(1,(motion.speed||0)/25)*.12),-1,1),12,dt);
 const compression=spring(memory,'compression',clamp(motion.compression??(motion.impact||0)*.035,0,.38),14,dt);
 const flight=spring(memory,'flight',motion.airborne?1:0,10,dt);
 const load=spring(memory,'load',clamp((motion.load??1)-1,-1,3),10,dt);
 const helm=spring(memory,'helm',helmCorrection(turn,motion.rollVelocity||0,motion.speed||0,motion.wet??1),16,dt);
 const recovery=spring(memory,'recovery',clamp((motion.impact||0)*.022,0,.19),5,dt);
 const counter=spring(memory,'counter',clamp(-(motion.rollVelocity||0)*.045,-.09,.09),11,dt);
 const brace=spring(memory,'brace',motion.airborne?clamp(-(motion.verticalSpeed||0)/9,0,1):0,14,dt);
 const duck=spring(memory,'duck',Math.max(0,Math.min(1,motion.sprayExposure||0)),13,dt);
 const anticipation=spring(memory,'anticipation',clamp(motion.anticipation||0,0,1),18,dt);
 const airCounter=spring(memory,'airCounter',motion.airborne?clamp(-(motion.roll||0)*.18-(motion.rollVelocity||0)*.055,-.16,.16):0,8,dt);
 const headPitch=spring(memory,'headPitch',clamp(-(motion.pitchVelocity||0)*.065+(motion.impact||0)*.012,-.10,.14),9,dt);
 const headLook=spring(memory,'headLook',clamp((motion.waveLook||0)*.08,-.22,.22),5,dt);
 const shoulderLag=spring(memory,'shoulderLag',clamp(-(motion.rollVelocity||0)*.035,-.09,.09),7,dt);
 const cornerLean=spring(memory,'cornerLean',turn*clamp((motion.speed||0)/25,0,1)*.055,5,dt);
 const stand=spring(memory,'stand',motion.airborne?0:clamp((Math.abs(motion.pitchVelocity||0)*.24+Math.abs(motion.rollVelocity||0)*.12+Math.max(0,(motion.load??1)-1)*.18)*clamp((motion.speed||0)/14,0,1),0,1),6,dt);
 const wetness=spring(memory,'wetness',clamp(.25+(motion.speed||0)/35+(motion.impact||0)*.08,0,1),2,dt);
 return {...motion,stand,headPitch,headLook,shoulderLag,cornerLean,turn:lean,forwardShift:forward-duck*.08+anticipation*.035,compression:Math.min(.38,compression+duck*.13+anticipation*.16),flightBlend:flight,loadShift:load,wetness:Math.max(wetness,duck),recovery,counter:counter+airCounter,brace:Math.max(brace,duck*.7,anticipation*.7),anticipation,duck,steering:(motion.steering??turn*.3)+helm};
}
