// Authored reconstruction from course observations, in metres. Map coordinates
// describe geography, not a texture or mesh extracted from the Nintendo game.
// Source/remaining fidelity checks: COURSE-MATCH.md.
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function fromMap(points,cx,cy,scale=.75){return points.map(([x,z])=>[(x-cx)*scale,(z-cy)*scale]);}
export function polygonDistance(points,x,z){let inside=false,d=Infinity;for(let i=0,j=points.length-1;i<points.length;j=i++){
 const a=points[j],b=points[i],dx=b[0]-a[0],dz=b[1]-a[1],t=clamp(((x-a[0])*dx+(z-a[1])*dz)/(dx*dx+dz*dz),0,1);
 d=Math.min(d,Math.hypot(x-a[0]-dx*t,z-a[1]-dz*t));if((a[1]>z)!==(b[1]>z)&&x<(b[0]-a[0])*(z-a[1])/(b[1]-a[1])+a[0])inside=!inside;
 }return inside?-d:d;
}
const sunny={
 name:'Sunny Beach',theme:'beach',tag:'01 / SUNNY BEACH',layoutRevision:2,
 description:'A long sandbar separates two fast straights. Round the tight ends, keep clear of the beach, and thread the buoys.',
 anchors:[[38,32],[39,-55],[35,-133],[19,-166],[-8,-168],[-31,-145],[-36,-60],[-37,44],[-32,137],[-12,166],[12,168],[31,146],[39,88]],
 ground(x,z){const axisZ=clamp(z,-143,143),width=10.5+1.8*Math.cos(z*.015),bar=3.3-Math.hypot(x,z-axisZ)*3.3/width;
 const beach=clamp((x-(76+4*Math.cos(z*.014)))*.18,-10,9);return Math.max(-9,bar,beach);},
 obstacles:[],resistance:[],raceRamps:[]
};
const sunsetLand=fromMap([[176,55],[189,70],[190,105],[227,149],[247,182],[242,227],[249,280],[240,307],[250,343],[310,399],[345,420],[430,438],[461,443],[459,454],[193,455],[174,432],[165,340],[168,247],[170,184]],245,275);
const sunset={
 name:'Sunset Bay',theme:'resort',tag:'02 / SUNSET BAY',layoutRevision:2,
 description:'Orange evening water wraps around an L-shaped island. A race ramp offers a jump beside the pier-lined western straight.',
 anchors:fromMap([[290,302],[281,222],[258,163],[217,80],[194,49],[167,52],[142,93],[131,165],[103,190],[99,219],[117,260],[140,333],[158,402],[180,458],[268,495],[366,515],[435,494],[468,455],[448,420],[385,398],[317,376],[298,350]],245,275),
 ground(x,z){return clamp(-polygonDistance(sunsetLand,x,z)*.48,-10,5);},
 obstacles:[],resistance:[],raceRamps:[{id:100,name:'SUNSET JUMP',x:(130-245)*.75,z:(198-275)*.75,tx:0,tz:1,width:12,length:17,height:2.1,floating:false}],
 piers:[{x:(133-245)*.75,z:(144-275)*.75,tx:1,tz:0,length:61,width:3.2,deck:1.4},{x:(132-245)*.75,z:(299-275)*.75,tx:1,tz:0,length:68,width:3.2,deck:1.4}]
};
const lakeLand=fromMap([[67,108],[104,98],[174,116],[229,109],[320,76],[334,107],[329,194],[345,246],[326,295],[294,329],[273,348],[228,351],[173,343],[126,368],[77,350],[70,293],[63,254],[72,215],[62,174]],200,240);
const lakeIsland=fromMap([[127,72],[166,63],[207,66],[252,85],[224,96],[193,99],[153,88]],200,240);
const lakeOuter=fromMap([[40,73],[87,38],[170,38],[247,34],[326,18],[377,37],[399,100],[395,215],[399,295],[372,343],[342,398],[274,419],[218,450],[153,458],[92,418],[38,354],[9,272],[16,204],[6,151]],200,240);
const lake={
 name:'Drake Lake',theme:'lake',tag:'03 / DRAKE LAKE',layoutRevision:2,
 description:'A misty freshwater circuit with irregular wooded banks, a small island, timber posts and weed beds that slow a wet hull.',
 anchors:fromMap([[374,274],[366,188],[366,91],[341,60],[306,63],[246,54],[178,54],[122,61],[84,67],[59,86],[31,160],[40,212],[31,269],[52,325],[74,372],[123,404],[186,416],[243,407],[307,376],[356,336]],200,240),
 ground(x,z){return clamp(Math.max(-polygonDistance(lakeLand,x,z),-polygonDistance(lakeIsland,x,z),polygonDistance(lakeOuter,x,z))*.4,-8,13);},
 obstacles:fromMap([[182,381],[224,370],[254,355],[267,373],[290,382],[269,401],[240,391],[214,392]],200,240).map(([x,z])=>({x,z,r:.45,type:'post'})),
 resistance:[{x:(320-200)*.75,z:(352-240)*.75,rx:13,rz:9,drag:.75},{x:(129-200)*.75,z:(88-240)*.75,rx:12,rz:5,drag:.65}],raceRamps:[]
};
export const CLASSIC_COURSES={greyhaven:sunny,amber:sunset,reed:lake};
export function courseResistance(course,x,z,wet=1){let drag=0;for(const p of course.resistance||[]){const q=((x-p.x)/p.rx)**2+((z-p.z)/p.rz)**2;drag=Math.max(drag,p.drag*clamp((1-q)*3,0,1));}return drag*clamp(wet,0,1);}
