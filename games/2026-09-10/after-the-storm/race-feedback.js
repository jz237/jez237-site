export function lapComparison(previousLaps,completedLap,recordLap=null){
 const candidates=[...previousLaps,recordLap].filter(v=>Number.isFinite(v)&&v>0);
 if(!candidates.length)return null;
 return completedLap-Math.min(...candidates);
}
export function trailingRival(s,r){
 const gates=s.course.gates,progress=q=>{const g=gates[q.next],a=gates[(q.next+gates.length-1)%gates.length];return q.passed-Math.hypot(q.x-g.x,q.z-g.z)/Math.max(1,Math.hypot(g.x-a.x,g.z-a.z));};
 const own=progress(r);let result=null;
 for(const q of s.racers){if(q===r||q.dq||q.finishTime!==null)continue;const gap=own-progress(q),distance=Math.hypot(q.x-r.x,q.z-r.z);if(gap>=0&&gap<2&&distance<70&&(!result||distance<result.distance))result={id:q.id,distance};}
 return result;
}
export function riderColourIndex(r,swap=false,sameRider=false){
 if(r.player===null||r.player===undefined)return r.id;
 const alternate=sameRider?r.player===1:swap?r.player===0:r.player===1;
 return r.id+(alternate?4:0);
}
