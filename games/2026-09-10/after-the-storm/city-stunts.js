// Preliminary correspondence to source/city-stunt-map.json. The two opening
// branches are distinct; clipped finish positions and dimensions remain estimates.
export function cityStuntLayout(){
 const map=([x,z])=>({x:(x-200)*.8,z:(z-275)*.8});
 const inner=[[269,251],[269,243],[269,235],[269,216],[269,147],[269,88]],outer=[[358,114],[374,68],[333,31]],shared=[[185,150],[116,321],[87,349],[63,372],[48,399],[24,429],[113,488],[219,499]];
 const path=[[269,420],[269,360],[269,315],[270,285],...inner,[269,45],[229,29],[182,27],[173,55],[173,75],[185,113],shared[0],[190,169],[207,200],[204,218],[174,244],[141,278],...shared.slice(1,4),[48,383],...shared.slice(4,6),[23,458],[38,472],[65,488],[84,488],shared[6],[150,489],[175,484],[189,489],shared[7],[244,483],[266,456]];
 const points=path.map(map),anchors=points.map(p=>[p.x,p.z]);
 const tangent=p=>{let index=0,d=Infinity;points.forEach((q,i)=>{const distance=Math.hypot(q.x-p.x,q.z-p.z);if(distance<d){d=distance;index=i;}});const a=points[(index+points.length-1)%points.length],b=points[(index+1)%points.length],length=Math.hypot(b.x-a.x,b.z-a.z);return {tx:(b.x-a.x)/length,tz:(b.z-a.z)/length};};
 const ring=(row,branch,index)=>{const p=map(row),submerged=branch==='inner'&&index<3;return {...p,...tangent(p),y:submerged?-1.2:1.35,radius:submerged?2.3:2.8,type:submerged?'dive':'water',floating:true,branch};};
 const rings=[...inner.map((p,i)=>ring(p,'inner',i)),...outer.map((p,i)=>{const a=map(i?outer[i-1]:[358,139]),b=map(i<2?outer[i+1]:[277,29]),length=Math.hypot(b.x-a.x,b.z-a.z);return {...ring(p,'outer',i),tx:(b.x-a.x)/length,tz:(b.z-a.z)/length};}),...shared.map((p,i)=>ring(p,'shared',i))];
 // This ring stands in the straight channel beside the inner quay. Averaging
 // across the following bend aimed its approach through the quay corner.
 rings[13].tx=0;rings[13].tz=1;
 const ramps=[[270,285,0,-1],[185,113,0,1],[84,488,1,0],[189,489,.948683298,.316227766]].map(([x,z,tx,tz],i)=>({...map([x,z]),tx,tz,id:260+i,name:'CITY STUNT JUMP '+(i+1),width:i?14:12,length:i?14:22,height:i?2.1:2.7,floating:false,solidBack:true,diveJump:i===0}));
 const checkpoints=[[173,75],[141,278],[38,472],[269,420]].map((row,section)=>{const p=map(row);return {...p,...tangent(p),width:20,limit:section===0?20:15,section};});
 const target=i=>({...rings[i],kind:rings[i].type==='dive'?'dive':'ring',speed:i===12?9:13}),cp=i=>({...checkpoints[i],kind:'checkpoint'}),ramp=i=>({...ramps[i],kind:'ramp'}),way=row=>{const p=map(row);return {...p,...tangent(p),kind:'waypoint',speed:11};};
 const tail=[way([269,45]),way([229,29]),way([182,27]),way([173,55]),cp(0),ramp(1),target(9),way([190,169]),way([207,200]),way([204,218]),way([174,244]),cp(1),target(10),target(11),target(12),{...way([48,383]),speed:7},target(13),target(14),way([23,458]),cp(2),way([65,488]),ramp(2),target(15),way([150,489]),way([175,484]),ramp(3),target(16),way([244,483]),way([266,456]),cp(3)];
 const verificationTargets=[way([269,360]),way([269,315]),ramp(0),...inner.map((_,i)=>target(i)),...tail];
 const outerVerificationTargets=[way([288,341]),way([322,281]),way([342,239]),way([336,212]),way([352,181]),way([368,160]),way([358,139]),target(6),target(7),way([357,55]),target(8),...tail.slice(1)].map(p=>({...p}));
 const outerPoints=[map([269,420]),...outerVerificationTargets];outerVerificationTargets.forEach((p,i)=>{const a=outerPoints[i],b=outerPoints[Math.min(i+2,outerPoints.length-1)],n=Math.hypot(b.x-a.x,b.z-a.z)||1;if(p.kind==='waypoint'){p.tx=(b.x-a.x)/n;p.tz=(b.z-a.z)/n;}if(i<12)p.speed=18;});
 // Four spiked floats span the channel between the finish jumps in the
 // original footage at65s. Locations retain the mapped race-row spacing;
 // precise stunt-mode distances remain to be calibrated.
 const rocks=[[108,485],[108,496],[108,507],[108,518]].map(row=>({...map(row),r:.7,type:'ball',spiked:true}));
 return {rocks,anchors:outerPoints.slice(0,-1).map(p=>[p.x,p.z]),rings,ramps,checkpoints,verificationTargets,outerVerificationTargets,forwardPassage:true};
}
