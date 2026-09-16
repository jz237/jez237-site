// Original object order from source/fort-stunt-map.json; manually fitted to
// the race map. Dimensions and timing remain estimates pending footage calibration.
export function fortStuntLayout(){
 const map=([x,z])=>({x:(x-210)*.8,z:(z-300)*.8});
 const rows=[[81,192],[37,156],[38,128],[54,89],[79,68],[148,94],[201,160],[264,179],[337,185],[384,227],[225,493],[168,510],[90,398],[68,369],[94,340]];
 const path=[[81,273],...rows.slice(0,5),[104,60],rows[5],[156,131],[176,144],...rows.slice(6,8),[300,181],...rows.slice(8,10),[373,247],[307,251],[290,270],[283,345],[279,423],[260,466],...rows.slice(10,12),[105,516],[81,499],[81,461],...rows.slice(12)];
 const points=path.map(map),anchors=points.map(p=>[p.x,p.z]);
 const tangent=p=>{let index=0,d=Infinity;points.forEach((q,i)=>{const distance=Math.hypot(q.x-p.x,q.z-p.z);if(distance<d){d=distance;index=i;}});const a=points[(index+points.length-1)%points.length],b=points[(index+1)%points.length],length=Math.hypot(b.x-a.x,b.z-a.z);return {tx:(b.x-a.x)/length,tz:(b.z-a.z)/length};};
 const rings=rows.map(row=>{const p=map(row);return {...p,...tangent(p),y:1.35,radius:2.8,type:'water',floating:true};});
 const ramps=[[176,144],[81,461]].map((row,i)=>{const p=map(row);const aim=i===0?map([201,160]):map([81,398]),len=Math.hypot(aim.x-p.x,aim.z-p.z);return {...p,tx:(aim.x-p.x)/len,tz:(aim.z-p.z)/len,id:240+i,name:'FORTRESS JUMP '+(i+1),width:17,length:14,height:3.1,floating:true,solidBack:true};});
 const checkpoints=[[104,60],[300,181],[105,516],[81,273]].map((row,section)=>{const p=map(row);return {...p,...tangent(p),width:20,limit:38,section};});
 const ring=i=>({...rings[i],kind:'ring',speed:i>=12?9:13}),cp=i=>({...checkpoints[i],kind:'checkpoint'}),ramp=i=>({...ramps[i],kind:'ramp'}),way=row=>{const p=map(row);return {...p,...tangent(p),kind:'waypoint'};};
 const verificationTargets=[...rings.slice(0,5).map((_,i)=>ring(i)),cp(0),ring(5),way([156,131]),ramp(0),ring(6),ring(7),cp(1),ring(8),ring(9),way([373,247]),way([307,251]),way([290,270]),way([283,345]),way([279,423]),way([260,466]),ring(10),ring(11),cp(2),way([81,499]),ramp(1),ring(12),ring(13),ring(14),cp(3)];
 return {anchors,rings,ramps,checkpoints,verificationTargets};
}
