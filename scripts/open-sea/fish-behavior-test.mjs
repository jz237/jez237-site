import {FishBehavior} from '../../demos/open-sea/js/fish-behavior.js';
import {mulberry32} from '../../demos/open-sea/js/math.js';
const r=mulberry32(777),fish=[];
for(let i=0;i<120;i++)fish.push({sp:i<100?0:i<118?1:2,len:i<100?.21:i<118?.55:1.4,seed:r()*1000,r:r(),r2:r(),r3:r()});
const behavior=new FishBehavior(fish),depth=fish.map(f=>[f.p[1],f.p[1]]),states=new Set();
let maxPitch=0,maxTurn=0,nonfinite=0,align=0;
for(let i=1;i<=3600;i++){
 const last=fish.map(f=>Math.atan2(f.heading[2],f.heading[0]));behavior.update(i/30,[0,0,0]);
 for(let j=0;j<fish.length;j++){const f=fish[j];states.add(f.state);maxPitch=Math.max(maxPitch,Math.abs(f.heading[1]));const yaw=Math.atan2(f.heading[2],f.heading[0]);maxTurn=Math.max(maxTurn,Math.abs(Math.atan2(Math.sin(yaw-last[j]),Math.cos(yaw-last[j])))*30);depth[j][0]=Math.min(depth[j][0],f.p[1]);depth[j][1]=Math.max(depth[j][1],f.p[1]);for(const v of [...f.p,...f.heading,f.phase,f.finPhase,f.speed])if(!Number.isFinite(v))nonfinite++;}
}
const mean=fish.slice(0,100).reduce((a,f)=>a.map((v,k)=>v+f.heading[k]/100),[0,0,0]);align=Math.hypot(...mean);
const result={seconds:120,fish:fish.length,states:[...states],maxPitchDegrees:Math.asin(maxPitch)*180/Math.PI,maxTurnRadiansPerSecond:maxTurn,meanSchoolAlignment:align,medianDepthExplored:depth.map(d=>d[1]-d[0]).sort((a,b)=>a-b)[60],nonfinite};
if(nonfinite||maxPitch>.181||maxTurn>1.01||states.size!==4||result.medianDepthExplored<1)throw new Error(JSON.stringify(result));
console.log(result);
