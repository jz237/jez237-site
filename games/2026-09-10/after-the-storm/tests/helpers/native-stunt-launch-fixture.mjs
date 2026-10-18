import {createNativeStuntCourseRuntime} from '../../native-stunt-course-runtime.js';
import {createNativeRaceLaunchRuntime} from '../../native-race-launch-runtime.js';
const F=Math.fround;

// Prepared physical samples only: this does not drive or teleport a live hull.
export function stuntLaunchFixture(courseIndex,{running=false,patch}={}){
 const courseRuntime=createNativeStuntCourseRuntime({courseIndex});
 const racers=()=>[{id:0,lap:0,grid:0,power:0,misses:0,dq:''}];
 let riders=racers(),runtime=createNativeRaceLaunchRuntime({courseRuntime,courseIndex,players:1,racers:riders});
 if(running||patch){
  const initialState=runtime.snapshot();
  if(running)Object.assign(initialState.scene,{phase650:3,simulation648:3,clockStopped817c:0});
  patch?.(initialState);riders=racers();
  runtime=createNativeRaceLaunchRuntime({courseRuntime,courseIndex,players:1,racers:riders,initialState});
 }
 function body(sourceRow,distance,move=0,arc=40){
  const n=courseRuntime.data.nodes[sourceRow],p={x:F(n.centerNativeXZ.x+F(n.forwardXZ.x*distance)),y:0,z:F(n.centerNativeXZ.z+F(n.forwardXZ.z*distance))};
  return {positionNative:p,priorBodyPointNative:{x:F(p.x-n.forwardXZ.x*20),y:0,z:F(p.z-n.forwardXZ.z*20)},forwardXZ:{...n.forwardXZ},
   speedB90Native:20,frameSpeedB98:60,speedBbc:60,speedBc0:40,field15c0:0,field16d0:0,actorState:22,stuntMove1604:move,stuntArc15ecNative:arc};
 }
 function camera(b){
  const p=b.positionNative,f=b.forwardXZ;
  runtime.cameraStorage.write([{eyeNative:[F(p.x-f.x*800),300,F(p.z-f.z*800)],targetNative:[p.x,0,p.z],
   forward:[f.x,0,f.z],horizontalForward:[f.x,f.z],up:[0,1,0],fovDegrees:60,nearNative:1,projectionOffset:[0,0]}]);
 }
 function advance(b,{display=true,rings=true}={}){
  camera(b);const result=runtime.advanceStunt({bodiesBySlot:[b],pressedButtonsB58BySlot:[0]});
  const ring=rings?runtime.advanceStuntRings(b.positionNative):null;
  const popup=display?runtime.advanceStuntDisplay():null;
  return {result,ring,popup};
 }
 return {courseRuntime,runtime,riders,body,camera,advance};
}

// One prepared start/route/finish sequence. Hooks can compare each reached
//79528 against independent original execution before the later ring/display.
export function stuntLaunchTrace(courseIndex,hook=()=>{}){
 const f=stuntLaunchFixture(courseIndex,{running:true}),{runtime,courseRuntime}=f;
 let frame=0;
 function step(row,distance,move=0,stage='route'){
  const b=f.body(row,distance,move);f.camera(b);
  const before=runtime.snapshot(),input={bodiesBySlot:[b],pressedButtonsB58BySlot:[0]};
  const result=runtime.advanceStunt(input);hook({stage,frame:frame++,before,input,result,after:runtime.snapshot(),fixture:f});
  runtime.advanceStuntRings(b.positionNative);runtime.advanceStuntDisplay();
 }
 step(0,-20,0,'start-before');step(0,20,0,'start-cross');
 let row=courseRuntime.data.nodes[0].nextSourceRowA0,budget=64;
 while(row!==0){
  if(--budget<0)throw new Error('Unclosed prepared source route');
  step(row,-20);step(row,20,0,courseRuntime.data.nodes[row].checkpointFlag9c===1?'checkpoint':'route');
  row=courseRuntime.data.nodes[row].nextSourceRowA0;
 }
 // Hold a handstand across the finish: bonus remains delayed for20 calls.
 step(0,-20,1);step(0,20,1,'finish');
 for(let i=0;i<48;i++)step(0,40,0,i===19?'delayed-bonus':i===47?'record':'coast');
 return f;
}
