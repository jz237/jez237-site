import {CLASSIC_COURSES,polygonDistance} from './classic-courses.js';
import {configurePassage,passageDistance} from './course-passages.js';
import {tideLevel} from './course-environment.js';
// Course geometry is shared by navigation, collision, terrain and presentation.
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const definitions=[
 {id:'greyhaven',name:'Greyhaven Circuit',theme:'coast',tag:'01 / OPEN COAST',description:'A wide coastal opener with two fast straights and tight headland turns.',anchors:[[0,110],[48,70],[51,-30],[25,-108],[-25,-108],[-51,-30],[-48,70]],storm:.12,sky:[0xa6c2c5,0x397aa7],water:0x277f89},
 {id:'amber',name:'Amber Bay',theme:'resort',tag:'02 / GOLDEN HOUR',description:'An L-shaped lagoon under the setting sun. Sweep around the resort and marina.',anchors:[[-75,105],[35,105],[55,50],[32,-10],[75,-65],[60,-115],[-15,-125],[-48,-65],[-45,0],[-100,35]],storm:.22,sky:[0xe8b889,0x656e92],water:0x267e88},
 {id:'reed',name:'Reedwater Lake',theme:'lake',tag:'03 / MORNING MIST',description:'Still freshwater, reed beds and timber posts. Fog lifts as the race develops.',anchors:[[-75,100],[35,108],[100,58],[94,-60],[30,-113],[-80,-100],[-111,-30]],storm:.02,sky:[0xaebbb0,0x688b94],water:0x395f56},
 {id:'citadel',name:'Citadel Sound',theme:'fortress',tag:'04 / ATLANTIC SWELL',description:'Stone bastions split rough water. On Hard and above, the sluice opens from lap two; the outer channel stays available.',anchors:[[-95,105],[35,120],[110,58],[80,-24],[110,-94],[12,-137],[-105,-98],[-125,0]],storm:.6,sky:[0x9aadb7,0x344f6d],water:0x315260},
 {id:'port',name:'Port Meridian',theme:'port',tag:'05 / WORKING HARBOUR',description:'Crane-lined harbour bends. Hard and above open a shorter, narrow service tunnel; watch its walls and low roof.',anchors:[[-108,105],[15,108],[113,80],[110,0],[70,-40],[108,-103],[20,-123],[-85,-108],[-95,-30],[-55,30]],storm:.17,sky:[0xa2bec8,0x4281a5],water:0x326b76},
 {id:'neon',name:'Neon Reach',theme:'city',tag:'06 / NIGHT RACE',description:'A floodlit city canal with fast bends, reflected windows and glowing bridge spans.',anchors:[[-90,112],[5,122],[93,70],[111,-20],[55,-105],[-25,-124],[-102,-83],[-62,-5],[-120,40]],storm:.28,sky:[0x334761,0x08152f],water:0x12394e},
 {id:'glacier',name:'Glacier Passage',theme:'ice',tag:'07 / ARCTIC WATER',description:'Blue ice walls and drifting bergs narrow a long cold-water course.',anchors:[[-55,135],[45,115],[102,40],[65,-45],[115,-120],[25,-155],[-78,-118],[-100,-32],[-58,42]],storm:.35,sky:[0xc1d4dc,0x6198b3],water:0x328398},
 {id:'tempest',name:'Tempest Island',theme:'island',tag:'08 / OPEN OCEAN FINAL',description:'An ebbing tide exposes the coral shoal inside the northeast bend. Swell builds as the rain front arrives.',anchors:[[0,145],[92,100],[131,10],[75,-88],[0,-132],[-115,-77],[-140,38],[-78,103]],storm:.42,sky:[0xa8b6bd,0x4c778f],water:0x267b80},
 {id:'practice',name:'Pelican Park',theme:'park',tag:'WARM UP / FREE WATER',description:'A sheltered training basin with pontoons, open water and a winding practice route.',anchors:[[-65,65],[25,85],[85,30],[45,-35],[45,-88],[-30,-88],[-85,-15]],storm:.03,sky:[0xb4d4d3,0x438dab],water:0x319493}
];
function catmull(p0,p1,p2,p3,t){const t2=t*t,t3=t2*t;return [0,1].map(k=>.5*((2*p1[k])+(-p0[k]+p2[k])*t+(2*p0[k]-5*p1[k]+4*p2[k]-p3[k])*t2+(-p0[k]+3*p1[k]-3*p2[k]+p3[k])*t3));}
export function sampleRoute(anchors,n=24){const dense=[];for(let i=0;i<anchors.length;i++)for(let j=0;j<24;j++)dense.push(catmull(anchors[(i+anchors.length-1)%anchors.length],anchors[i],anchors[(i+1)%anchors.length],anchors[(i+2)%anchors.length],j/24));let length=0;const distances=[0];for(let i=1;i<=dense.length;i++){const a=dense[i-1],b=dense[i%dense.length];length+=Math.hypot(b[0]-a[0],b[1]-a[1]);distances.push(length);}return Array.from({length:n},(_,i)=>{const target=i/n*length;let j=1;while(distances[j]<target)j++;const t=(target-distances[j-1])/(distances[j]-distances[j-1]),a=dense[j-1],b=dense[j%dense.length];return {x:a[0]+(b[0]-a[0])*t,z:a[1]+(b[1]-a[1])*t};});}
export function buildGates(points,difficulty=0){return points.map((p,i)=>{const prev=points[(i+points.length-1)%points.length],next=points[(i+1)%points.length],d=Math.hypot(next.x-prev.x,next.z-prev.z),tx=(next.x-prev.x)/d,tz=(next.z-prev.z)/d,side=i===0?0:i%2?1:-1,offset=7-difficulty*.75;return {...p,tx,tz,side,offset,bx:p.x+tz*side*offset,bz:p.z-tx*side*offset,width:23-difficulty*2};});}
export function routeDistance(course,x,z){let best=Infinity;const gates=course.gates;for(let i=0;i<gates.length;i++){const a=gates[i],b=gates[(i+1)%gates.length],dx=b.x-a.x,dz=b.z-a.z,t=clamp(((x-a.x)*dx+(z-a.z)*dz)/(dx*dx+dz*dz),0,1);best=Math.min(best,Math.hypot(x-a.x-dx*t,z-a.z-dz*t));}return best;}
export function insideRoute(course,x,z){let inside=false;const p=course.gates;for(let i=0,j=p.length-1;i<p.length;j=i++){if((p[i].z>z)!==(p[j].z>z)&&x<(p[j].x-p[i].x)*(z-p[i].z)/(p[j].z-p[i].z)+p[i].x)inside=!inside;}return inside;}
function coastNoise(x,z){const hash=(a,b)=>{const n=Math.sin(a*127.1+b*311.7)*43758.5453;return n-Math.floor(n);};const i=Math.floor(x),j=Math.floor(z);let u=x-i,v=z-j;u=u*u*(3-2*u);v=v*v*(3-2*v);return (hash(i,j)*(1-u)+hash(i+1,j)*u)*(1-v)+(hash(i,j+1)*(1-u)+hash(i+1,j+1)*u)*v;}
export function terrainHeight(course,x,z){if(CLASSIC_COURSES[course.id])return CLASSIC_COURSES[course.id].ground(x,z);const d=routeDistance(course,x,z),inside=insideRoute(course,x,z),theme=course.theme;
 if(theme==='park'){return Math.max(-5,Math.min(12,(Math.hypot(x,z)-120)*.22),9-Math.hypot(x+8,z+7)*.30);}
 const industrial=theme==='port'||theme==='city';let h=-5.8+Math.max(0,d-19)*(industrial?.42:.23);
 if(industrial)return Math.min(inside?3.5:5,h);
 if(theme==='island'){const reef=Math.exp(-(((x-101)/15)**2+((z-72)/27)**2));h=Math.max(h,-5.8+5.5*reef);}
 const rough=Math.sin(x*.047+Math.cos(z*.024)*2)*2+Math.cos(z*.061-x*.028)*1.2;
 h+=clamp((d-34)/35,0,1)*rough;
 if(!inside){const mountain=theme==='ice'?40:theme==='lake'?28:theme==='fortress'?15:10;h+=clamp((d-48)/85,0,1)*mountain*(.6+.4*Math.sin(x*.008+z*.013)**2);}
 // Eroded banks use the same heights for rendering, vegetation and hull contact.
 const erosion=(coastNoise(x*.075,z*.075)-.5)*3.8+(coastNoise(x*.21,z*.21)-.5)*1.2;
 return Math.min(theme==='ice'?65:theme==='lake'?45:22,h)+erosion*clamp((d-45)/24,0,1);
}
export const COURSES=definitions.map(original=>{const d={...original,...CLASSIC_COURSES[original.id]};return {...d,gates:buildGates(sampleRoute(d.anchors)),rocks:[],laps:3};});
export function getCourse(id='greyhaven',difficulty=0){const base=COURSES.find(c=>c.id===id)||COURSES[0],reverse=difficulty===3,level=Math.min(2,difficulty),anchors=level===2&&base.expertAnchors?base.expertAnchors:base.anchors;let points=sampleRoute(anchors,24+level*4);if(reverse)points=[points[0],...points.slice(1).reverse()];
 let route=sampleRoute(anchors,384);if(reverse)route=[route[0],...route.slice(1).reverse()];const course={...base,anchors,closedAreas:level===2?base.expertClosedAreas||[]:[],requiredPassage:level===2&&!!base.expertAnchors,difficulty,reverse,route,gates:buildGates(points,level),rocks:[...(base.obstacles||[]),...(level?(base.extraObstacles||[]).slice(0,level===1?4:99):[])].map(o=>({...o})),ramps:(base.raceRamps||[]).map(r=>({...r,tx:reverse?-r.tx:r.tx,tz:reverse?-r.tz:r.tz}))};
 // Navigation obstacles grow with difficulty, but keep a safe central racing line.
 for(let i=3;!CLASSIC_COURSES[id]&&i<course.gates.length;i+=level===2?3:5){const g=course.gates[i],side=i%2?1:-1;course.rocks.push({x:g.x+g.tz*side*(15-level),z:g.z-g.tx*side*(15-level),r:level?1.6:1.1,type:base.theme==='ice'?'ice':base.theme==='lake'?'post':'float'});}
 configurePassage(course);const passageFloor=(x,z)=>course.passage?-5.8+Math.max(0,passageDistance(course.passage,x,z)-course.passage.width-2)*.8:Infinity;const closure=(x,z)=>course.closedAreas.some(area=>polygonDistance(area,x,z)<0)?6:-Infinity;course.ground=(x,z)=>Math.max(closure(x,z),Math.min(terrainHeight(course,x,z),passageFloor(x,z)));if(base.renderGround)course.renderGround=(x,z)=>Math.min(base.renderGround(x,z),passageFloor(x,z));return course;
}
export function conditions(course,time,lap=1){const rising=course.id==='tempest'?Math.min(.5,(lap-1)*.20+time*.0005):Math.sin(time*.018)*.035;return {seaLevel:tideLevel(course,time),storm:clamp(course.storm+rising,0,1),fog:course.theme==='lake'?Math.max(.003,.017-time*.00011):course.theme==='ice'?.0035:course.theme==='city'?.002:.0018,night:course.theme==='city'};}
export const CIRCUITS=[['greyhaven','amber','reed','citadel','port','tempest'],['greyhaven','amber','reed','citadel','port','neon','tempest'],['greyhaven','amber','reed','citadel','port','neon','glacier','tempest']];


