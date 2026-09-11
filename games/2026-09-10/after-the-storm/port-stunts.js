// Original sequence: source/port-stunt-map.json. This preliminary fit retains
// the current dock channel; exact roof/ring correspondence still needs footage.
export function portStuntLayout(){
 const map=([x,z])=>({x:(x-220)*.8,z:(z-285)*.8});
 const rows=[[60,175],[69,140],[87,103],[194,114],[227,120],[246,137],[249,155],[236,171],[220,186],[216,203],[250,291],[224,295],[195,305],[167,417],[148,471],[124,500]];
 const path=[[60,260],[60,215],...rows.slice(0,3),[123,84],[162,101],...rows.slice(3,10),[222,214],[245,213],[263,222],[272,243],[273,270],[263,279],...rows.slice(10,13),[175,325],...rows.slice(13),[96,480],[79,438],[79,420],[70,378],[65,330]];
 const points=path.map(map),anchors=points.map(p=>[p.x,p.z]);
 const tangent=p=>{let index=0,d=Infinity;points.forEach((q,i)=>{const distance=Math.hypot(q.x-p.x,q.z-p.z);if(distance<d){d=distance;index=i;}});const a=points[(index+points.length-1)%points.length],b=points[(index+1)%points.length],length=Math.hypot(b.x-a.x,b.z-a.z);return {tx:(b.x-a.x)/length,tz:(b.z-a.z)/length};};
 const rings=rows.map(row=>{const p=map(row);return {...p,...tangent(p),y:1.35,radius:2.8,type:'water',floating:true};});
 const ramps=[[60,215],[79,420],[70,378]].map((row,i)=>{const p=map(row);return {...p,...tangent(p),id:250+i,name:'PORT JUMP '+(i+1),width:17,length:14,height:3.1,floating:true,solidBack:true};});
 const checkpoints=[[123,84],[175,325],[96,480],[60,260]].map((row,section)=>{const p=map(row);return {...p,...tangent(p),width:18,limit:38,section};});
 // Hold the low exit-turn speed until the first outdoor ring is crossed.
 const ring=i=>({...rings[i],kind:'ring',speed:i===10?6:i>=3&&i<10?9:13}),cp=i=>({...checkpoints[i],kind:'checkpoint'}),ramp=i=>({...ramps[i],kind:'ramp',speed:12}),way=row=>{const p=map(row);return {...p,...tangent(p),kind:'waypoint',speed:row[0]===263&&row[1]===279?5:9};};
 const verificationTargets=[ramp(0),ring(0),ring(1),ring(2),cp(0),way([162,101]),...rings.slice(3,10).map((_,i)=>ring(i+3)),way([222,214]),way([245,213]),way([263,222]),way([272,243]),way([273,270]),way([263,279]),ring(10),ring(11),ring(12),cp(1),ring(13),ring(14),ring(15),cp(2),way([79,438]),ramp(1),ramp(2),way([65,330]),cp(3)];
 return {anchors,rings,ramps,checkpoints,verificationTargets,forwardPassage:true};
}

