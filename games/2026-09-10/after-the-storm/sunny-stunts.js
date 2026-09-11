// 64DREAM December 1996, printed p90: one jump and twelve rings.
// Hand-drawn source positions are fitted to the existing Sunny Beach shoreline.
// Crop: PDF page13, long edge4000px, x0 y1170 w880 h630.
export function sunnyStuntLayout(){
 const map=([x,y])=>({x:y<270?12+(270-y)*.4:y>430?-12-(y-430)*.4:(350-y)*.15,z:(x-375)*.42});
 const rows=[[334,167],[234,219],[76,236],[110,502],[245,463],[338,515],[552,499],[590,499],[710,451],[768,270],[640,178],[569,216]];
 const path=[[482,180],...rows.slice(0,3),[0,260],[-60,350],[0,440],...rows.slice(3,6),[418,495],[460,494],...rows.slice(6,9),[800,338],...rows.slice(9)];
 const points=path.map(map),anchors=points.map(p=>[p.x,p.z]);
 const tangent=(p)=>{let index=0,d=Infinity;points.forEach((q,i)=>{const distance=Math.hypot(q.x-p.x,q.z-p.z);if(distance<d){d=distance;index=i;}});const a=points[(index+points.length-1)%points.length],b=points[(index+1)%points.length],length=Math.hypot(b.x-a.x,b.z-a.z);return {tx:(b.x-a.x)/length,tz:(b.z-a.z)/length};};
 const rings=rows.map(row=>{const p=map(row);return {...p,...tangent(p),y:1.35,radius:2.8,type:'water',floating:true};});
 const ramps=[{...map([460,494]),tx:0,tz:1,id:210,name:'SUNNY BEACH JUMP',width:22,length:14,height:3.1,floating:true,solidBack:true}];
 // The leftmost checkpoint is cropped out of the printed map. Footage confirms
 // the end-turn checkpoint; its exact position is still an estimate.
 const checkpoints=[{...map([-60,350]),tx:-1,tz:0,width:21},{...map([418,495]),tx:0,tz:1,width:17},{...map([800,338]),tx:1,tz:0,width:21},{...map([482,180]),tx:0,tz:-1,width:22.5}].map((p,section)=>({...p,section,limit:38}));
 const ring=i=>({...rings[i],kind:'ring'}),cp=i=>({...checkpoints[i],kind:'checkpoint'}),way=row=>{const p=map(row);return {...p,...tangent(p),kind:'waypoint'};};
 const verificationTargets=[ring(0),ring(1),ring(2),way([0,260]),cp(0),way([0,440]),ring(3),ring(4),ring(5),cp(1),{...ramps[0],kind:'ramp'},ring(6),ring(7),ring(8),cp(2),ring(9),ring(10),ring(11),cp(3)];
 return {anchors,rings,ramps,checkpoints,verificationTargets};
}
