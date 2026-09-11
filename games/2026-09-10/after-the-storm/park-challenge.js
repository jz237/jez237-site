export const PARK_TRICKS=['flip','left','right','stand','handstand','backwards','somersault','dive'];
export function parkChallenge(r,course){const done=r.stunt.completedTricks||{},tricks=PARK_TRICKS.filter(k=>done[k]),rings=r.stunt.ringStatus.filter(s=>s==='hit').length;
 return {tricks:tricks.length,rings,totalRings:course.rings?.length||0,missing:PARK_TRICKS.filter(k=>!done[k]),earned:course.id==='practice'&&course.stunt&&r.stunt.complete&&!r.dq&&tricks.length===PARK_TRICKS.length&&rings===course.rings.length};}
export function awardParkBonus(save,r,course){if(save.dolphin||!parkChallenge(r,course).earned)return false;save.dolphin=true;return true;}
// Smoothed progress on the centre of the existing safe-water route.
export function guidePosition(course,time){const gates=course.gates,n=gates.length,total=gates.reduce((d,a,i)=>d+Math.hypot(a.x-gates[(i+1)%n].x,a.z-gates[(i+1)%n].z),0);let d=(time*7)%total;
 for(let i=0;i<n;i++){const a=gates[i],b=gates[(i+1)%n],length=Math.hypot(b.x-a.x,b.z-a.z);if(d<=length){const t=d/length;return {x:a.x+(b.x-a.x)*t,z:a.z+(b.z-a.z)*t,heading:Math.atan2(b.x-a.x,b.z-a.z)};}d-=length;}
 return {x:gates[0].x,z:gates[0].z,heading:0};}
