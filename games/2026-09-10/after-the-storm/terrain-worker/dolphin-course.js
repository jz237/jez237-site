// Approximate transcription of 64DREAM Dec 1996, pp90–91. See source/dolphin-map.json.
const islandShore=[[177,262],[184,237],[202,205],[229,178],[252,158],[278,143],[306,126],[335,130],[360,119],[399,116],[435,118],[469,132],[492,154],[502,185],[481,214],[452,218],[414,216],[374,222],[337,237],[310,262],[294,289],[282,319],[290,347],[310,378],[335,403],[370,422],[391,445],[397,467],[382,486],[350,501],[320,494],[280,479],[251,466],[222,438],[204,412],[187,377],[172,337],[169,298]];
const islets=[[[651,266],[662,245],[690,241],[721,250],[751,266],[762,286],[745,307],[713,309],[687,294],[660,286]],[[629,390],[641,363],[665,342],[697,340],[725,357],[742,385],[738,410],[723,441],[695,455],[665,450],[639,432],[626,409]]];
const jettyCenterline=[[292,266],[367,305],[351,336],[398,353],[389,378],[422,384]];
const jettySideSpurs=[[[329,286],[344,273]],[[367,308],[350,322]],[[398,354],[393,337]],[[389,378],[382,392]],[[417,381],[426,363]]];
const boundary=[[35,337],[37,292],[47,244],[65,199],[88,164],[113,135],[136,110],[169,85],[205,67],[246,49],[284,38],[328,30],[374,26],[418,22],[468,23],[518,23],[565,30],[610,41],[654,54],[695,75],[734,101],[764,126],[797,158],[821,196],[820,295],[819,393],[814,437],[786,477],[748,516],[702,547],[659,567],[615,579],[516,588],[466,587],[413,587],[350,587],[295,583],[246,574],[196,558],[149,533],[111,501],[82,468],[61,429],[45,385]];
const ringCentersInTravelOrder=[[500,409],[527,344],[549,280],[532,129],[483,89],[407,78],[335,81],[109,378],[132,424],[359,540]];
const rampCentersInTravelOrder=[[192,149],[150,197],[124,253],[185,465]];
const checkpointsInTravelOrder=[[[542,192],[619,231]],[[226,67],[276,137]],[[61,305],[153,308]],[[419,503],[495,540]]];

export function createDolphinCourse(polygonDistance){
 const map=rows=>rows.map(([x,z])=>[(x-420)*.5,(z-310)*.5]);
 const shore=map(islandShore),islands=islets.map(map);
 const anchors=map([[457,522],[500,409],[527,344],[549,280],[580,211],[532,129],[483,89],[407,78],[335,81],[251,102],[192,149],[150,197],[124,253],[107,306],[109,378],[132,424],[185,465],[260,520],[359,540]]);
 const pier=(a,b)=>{const [[x,z],[ex,ez]]=map([a,b]),length=Math.hypot(ex-x,ez-z);return {x:(x+ex)/2,z:(z+ez)/2,tx:(ex-x)/length,tz:(ez-z)/length,length,depth:2.8,bottom:2.9,top:3.3,material:'wood',pileSpacing:8};};
 const crossbars=[...jettyCenterline.slice(1).map((p,i)=>pier(jettyCenterline[i],p)),...jettySideSpurs.map(([a,b])=>pier(a,b))];
 // Rock arch axis is an initial north/south estimate; all dimensions are shared
 // by terrain, visible arch and solid roof. Source height calibration pending.
 const [ax,az]=map([[707,277]])[0],span=45,count=16,soffit=u=>6.5*Math.sqrt(Math.max(0,1-u*u))-.6;
 for(let i=0;i<count;i++){const u=-1+(i+.5)*2/count;crossbars.push({kind:'stone-arch',arch:'dolphin',x:ax+u*span/2,z:az,tx:1,tz:0,length:span/count,depth:18,bottom:soffit(u),soffitBefore:soffit(u-1/count),soffitAfter:soffit(u+1/count),top:1.4+8.1*Math.sqrt(Math.max(0,1-u*u))});}
 const headingAt=(x,z)=>{let index=0,best=Infinity;for(let i=0;i<anchors.length;i++){const q=anchors[i],dist=Math.hypot(q[0]-x,q[1]-z);if(dist<best){best=dist;index=i;}}const a=anchors[(index+anchors.length-1)%anchors.length],b=anchors[(index+1)%anchors.length],length=Math.hypot(b[0]-a[0],b[1]-a[1]);return {tx:(b[0]-a[0])/length,tz:(b[1]-a[1])/length};};
 const rings=map(ringCentersInTravelOrder).map(([x,z])=>({x,z,...headingAt(x,z),y:1.35,radius:2.8,type:'water',floating:true}));
 const ramps=map(rampCentersInTravelOrder).map(([x,z],i)=>({id:200+i,name:'PARK JUMP '+(i+1),x,z,...headingAt(x,z),width:17,length:14,height:3.1,floating:true,solidBack:true}));
 const checkpoints=checkpointsInTravelOrder.map((row,section)=>{const [a,b]=map(row),x=(a[0]+b[0])/2,z=(a[1]+b[1])/2,length=Math.hypot(b[0]-a[0],b[1]-a[1]),h=headingAt(x,z);let tx=(b[1]-a[1])/length,tz=-(b[0]-a[0])/length;if(tx*h.tx+tz*h.tz<0){tx=-tx;tz=-tz;}return {x,z,tx,tz,width:length/2,section,limit:38};});
 return {name:'Dolphin Park',theme:'park',tag:'00 / DOLPHIN PARK',layoutRevision:1,description:'A curved tropical island, a sheltered inner jetty and a rocky arch. The stunt route groups three western jumps before a final coast jump.',anchors,boundary:map(boundary),crossbars,obstacles:[],resistance:[],raceRamps:[],stuntLayout:{rings,ramps,checkpoints},
 ground(x,z){const main=-polygonDistance(shore,x,z)*.4,small=-polygonDistance(islands[1],x,z)*.4;let arch=-polygonDistance(islands[0],x,z)*.55;if(Math.abs(x-ax)<15)arch=Math.min(arch,-6);return Math.max(-8,Math.min(5.5,Math.max(main,small,arch)));}};
}
