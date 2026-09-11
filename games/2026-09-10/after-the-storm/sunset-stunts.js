// 64DREAM Dec1996 p90, PDF page13: crop x1100 y1930 w920 h700
// at4000px long edge. Fit to existing pier stations, not engine coordinates.
export function sunsetStuntLayout(){
 const station=x=>x<=300?55+(x-130)*89/170:x<=548?144+(x-300)*155/248:299+(x-548)*156/212;
 const map=([x,y])=>({x:(193+(480-y)*.77-245)*.75,z:(station(x)-275)*.75});
 const rows=[[407,310],[353,324],[295,350],[244,379],[385,543],[412,543],[689,242],[624,274],[563,335]];
 const path=[[476,310],...rows.slice(0,4),[170,385],[110,425],[90,480],[130,525],[172,543],[260,543],[341,543],...rows.slice(4,6),[548,543],[768,543],[808,520],[828,476],[824,413],[824,126],[824,80],[780,66],[725,66],[675,105],[661,172],...rows.slice(6)];
 const points=path.map(map),anchors=points.map(p=>[p.x,p.z]);
 const tangent=p=>{let index=0,d=Infinity;points.forEach((q,i)=>{const distance=Math.hypot(q.x-p.x,q.z-p.z);if(distance<d){d=distance;index=i;}});const a=points[(index+points.length-1)%points.length],b=points[(index+1)%points.length],length=Math.hypot(b.x-a.x,b.z-a.z);return {tx:(b.x-a.x)/length,tz:(b.z-a.z)/length};};
 const rings=rows.map(row=>{const p=map(row);return {...p,...tangent(p),y:1.35,radius:2.8,type:'water',floating:true};});
 const ramps=[{...map([341,543]),tx:0,tz:1,id:220,name:'SUNSET PIER JUMP',width:17,length:14,height:3.1,floating:true,solidBack:true},{...map([824,413]),tx:1,tz:0,id:221,name:'SUNSET COAST JUMP',width:17,length:14,height:3.1,floating:true,solidBack:true}];
 const checkpoints=[{...map([172,543]),tx:0,tz:1,width:24},{...map([768,543]),tx:0,tz:1,width:24},{...map([824,126]),tx:1,tz:0,width:24},{...map([476,310]),tx:0,tz:-1,width:24}].map((q,section)=>({...q,section,limit:38}));
 const ring=i=>({...rings[i],kind:'ring'}),cp=i=>({...checkpoints[i],kind:'checkpoint'}),way=row=>{const p=map(row);return {...p,...tangent(p),kind:'waypoint'};},ramp=i=>({...ramps[i],kind:'ramp'});
 const verificationTargets=[...rings.slice(0,4).map((_,i)=>ring(i)),way([170,385]),way([110,425]),way([90,480]),way([130,525]),cp(0),way([260,543]),ramp(0),ring(4),ring(5),way([548,543]),cp(1),way([808,520]),way([828,476]),ramp(1),cp(2),way([824,80]),way([780,66]),way([725,66]),way([675,105]),way([661,172]),ring(6),ring(7),ring(8),cp(3)];
 const boundary=[[484,262],[435,260],[387,262],[326,261],[270,261],[211,266],[156,281],[109,306],[71,349],[50,405],[45,460],[56,518],[89,562],[142,589],[190,605],[245,615],[298,619],[354,622],[407,624],[455,624],[500,621],[548,619],[599,621],[658,622],[717,621],[773,613],[832,614],[876,594],[901,560],[901,24],[845,38],[800,25],[750,22],[700,27],[653,54],[628,99],[619,143],[616,186],[608,230],[568,260],[526,261]].map(map).map(p=>[p.x,p.z]);
 return {anchors,rings,ramps,checkpoints,verificationTargets,boundary};
}
