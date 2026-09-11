// Source pixel ordering: source/drake-map.json. Coordinates below fit that rotated
// diagram to the existing race shoreline; scale and timing are not yet calibrated.
export function drakeStuntLayout(){
 const map=([x,z])=>({x:(x-200)*.75,z:(z-240)*.75});
 const rows=[[365,274],[375,210],[355,155],[352,75],[292,53],[247,49],[219,48],[191,49],[163,52],[98,62],[59,101],[53,355],[87,396],[221,414],[268,389],[307,368]];
 const path=[[368,310],...rows.slice(0,3),[367,115],...rows.slice(3,11),[41,140],[35,188],[35,232],[35,276],...rows.slice(11,13),[128,416],...rows.slice(13),[352,341]];
 const points=path.map(map),anchors=points.map(p=>[p.x,p.z]);
 const tangent=p=>{let index=0,d=Infinity;points.forEach((q,i)=>{const distance=Math.hypot(q.x-p.x,q.z-p.z);if(distance<d){d=distance;index=i;}});const a=points[(index+points.length-1)%points.length],b=points[(index+1)%points.length],length=Math.hypot(b.x-a.x,b.z-a.z);return {tx:(b.x-a.x)/length,tz:(b.z-a.z)/length};};
 const rings=rows.map(row=>{const p=map(row);return {...p,...tangent(p),y:1.35,radius:2.8,type:'water',floating:true};});
 const ramps=[188,232,276].map((z,i)=>({...map([35,z]),tx:0,tz:1,id:230+i,name:'DRAKE JUMP '+(i+1),width:17,length:14,height:3.1,floating:true,solidBack:true}));
 const checkpoints=[[367,115],[41,140],[128,416],[368,310]].map((row,section)=>{const p=map(row);return {...p,...tangent(p),width:20,limit:38,section};});
 const ring=i=>({...rings[i],kind:'ring'}),cp=i=>({...checkpoints[i],kind:'checkpoint'}),ramp=i=>({...ramps[i],kind:'ramp'}),way=row=>{const p=map(row);return {...p,...tangent(p),kind:'waypoint'};};
 const verificationTargets=[ring(0),ring(1),ring(2),cp(0),...rings.slice(3,11).map((_,i)=>ring(i+3)),cp(1),ramp(0),ramp(1),ramp(2),ring(11),ring(12),cp(2),ring(13),ring(14),ring(15),way([352,341]),cp(3)];
 return {anchors,rings,ramps,checkpoints,verificationTargets};
}
