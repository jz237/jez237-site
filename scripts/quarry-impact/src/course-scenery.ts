import {createMidway} from './fairground-midway';
import {createFairWheel} from './fairground-wheel';
import {addCourseRockDetail} from './course-materials';
import * as T from 'three';
import type {createCountyCourse} from './county-course';

type Course=ReturnType<typeof createCountyCourse>;
export type SceneryTheme='park'|'dunes'|'canal'|'pass'|'coast'|'forest'|'farm'|'port'|'reservoir'|'club'|'ridge'|'fair'|'heath'|'canyon';
type Shape='box'|'round'|'cone'|'rock'|'leaf'|'gable'|'ring';
type Finish='bark'|'leaf'|'pine'|'stone'|'sand'|'wood'|'metal'|'white'|'red'|'ochre'|'glass'|'rubber';
const palettes={
 canyon:{ground:'#a28c67',patch:'#bea27a',rock:0xa88b69,leaf:0x79805a,pine:0x626c48,hill:0x9b8766,accent:'#aa4f32',title:'SABLE CANYON CONTACT RALLY',subtitle:'GEOLOGY ROCKS / SUSPENSION KNOCKS'},
 heath:{ground:'#747952',patch:'#9b9673',rock:0x8c8879,leaf:0x64754c,pine:0x4c6246,hill:0x727c56,accent:'#775a7c',title:'WILLOWBANK HEATH MOTOR FAIR',subtitle:'NATURAL BEAUTY / UNNATURAL BODYWORK'},
 fair:{ground:'#80794e',patch:'#a29a68',rock:0x918573,leaf:0x647343,pine:0x455b3c,hill:0x748052,accent:'#af4934',title:'COUNTY FAIR CONTACT SPORTS',subtitle:'ALL THE FUN / NONE OF THE REFUNDS'},
 ridge:{ground:'#7c7959',patch:'#9e986e',rock:0x8e8878,leaf:0x6d7447,pine:0x4c603f,hill:0x777951,accent:'#a65c30',title:'HARROWSTONE RIDGE RUN',subtitle:'HIGH GROUND / LOW EXPECTATIONS'},
 club:{ground:'#647454',patch:'#8a9470',rock:0x8c8b7c,leaf:0x5f7441,pine:0x415b36,hill:0x637850,accent:'#904535',title:'WESTMERE MOTOR CLUB',subtitle:'MEMBERS ONLY / BUMPERS NEGOTIABLE'},
 reservoir:{ground:'#687457',patch:'#879477',rock:0x8b8d7a,leaf:0x5b7147,pine:0x405d46,hill:0x617455,accent:'#387a84',title:'BRAMBLEBROOK RESERVOIR',subtitle:'HIGH WATER / LOW RESALE VALUE'},
 port:{ground:'#85877d',patch:'#a6a392',rock:0x888b7c,leaf:0x637252,pine:0x455b42,hill:0x7b8470,accent:'#d09239',title:'SALTMARSH PORT RALLYCROSS',subtitle:'IMPORTS / EXPORTS / WRITE-OFFS'},
 farm:{ground:'#7c8050',patch:'#a7a16c',rock:0x918573,leaf:0x62723e,pine:0x455c35,hill:0x758352,accent:'#a84e31',title:'DUNMERE FARM CIRCUIT',subtitle:'FRESH DENTS / LOCALLY GROWN'},
 coast:{ground:'#a19e75',patch:'#bcb48d',rock:0x938c79,leaf:0x69764b,pine:0x48614e,hill:0x7e886b,accent:'#377886',title:'SEABROOK COAST CIRCUIT',subtitle:'SEA AIR / BENT BODYWORK'},
 forest:{ground:'#596c48',patch:'#7b895d',rock:0x827b6b,leaf:0x536836,pine:0x3b5138,hill:0x51674b,accent:'#bd833a',title:'HAZELWOOD FOREST RALLY',subtitle:'LOGGING MILES / LOSING MIRRORS'},
 park:{ground:'#596847',patch:'#78805b',rock:0x858475,leaf:0x526337,pine:0x354b30,hill:0x546344,accent:'#bf4d30',title:'KINGSWELL MOTOR CLUB',subtitle:'GENTLEMEN START YOUR INSURANCE CLAIMS'},
 dunes:{ground:'#b59a67',patch:'#c9b17e',rock:0xaa9270,leaf:0x7b7950,pine:0x777449,hill:0xb09a72,accent:'#c46b27',title:'COPPERFIELD DIRT WEEKEND',subtitle:'AGGREGATE RESULTS / CRUSHING DISAPPOINTMENT'},
 canal:{ground:'#647156',patch:'#859077',rock:0x8b877a,leaf:0x596e40,pine:0x3b5336,hill:0x596950,accent:'#376e80',title:'MILLBROOK LOCKSIDE',subtitle:'LOCKS OPEN / BUMPERS OPTIONAL'},
 pass:{ground:'#6c7563',patch:'#89907a',rock:0x8b8b80,leaf:0x526545,pine:0x354b3b,hill:0x657262,accent:'#a85336',title:'GRANITE PASS RALLY',subtitle:'ALTITUDE / ATTITUDE / RECOVERY FEES'},
};
/** Large, irregular ground patches and fine aggregate. Road paint is applied afterwards. */
export function paintCourseGround(ctx:CanvasRenderingContext2D,width:number,height:number,theme:SceneryTheme){
 const p=palettes[theme];let seed=713+theme.length*128;const random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
 ctx.fillStyle=p.ground;ctx.fillRect(0,0,width,height);
 for(let i=0;i<650;i++){
  const x=random()*width,y=random()*height,r=20+random()*140,g=ctx.createRadialGradient(x,y,0,x,y,r);
  g.addColorStop(0,i%2?p.patch+'65':'#303b2b28');g.addColorStop(1,p.ground+'00');ctx.fillStyle=g;ctx.fillRect(x-r,y-r,r*2,r*2);
 }
 ctx.globalAlpha=.13;for(let i=0;i<42000;i++){ctx.fillStyle=i%2?'#eee4c8':'#263023';const size=.7+random()*2.4;ctx.fillRect(random()*width,random()*height,size,size);}ctx.globalAlpha=1;
}

/** Shared scenic dressing: bounded batches, original signage and protected placement.
 * Decorative pieces stay behind the existing walls; no driving surface is replaced. */
export function createCourseScenery(course:Course,theme:SceneryTheme,identity?:{title:string;subtitle:string}){
 const root=new T.Group();root.name=course.id+'_scenery';const p={...palettes[theme],...identity};
 let seed=8713+theme.length*659;const random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
 const geometries:Record<Shape,T.BufferGeometry>={gable:new T.BufferGeometry().setAttribute('position',new T.Float32BufferAttribute([-.5,0,0,.5,0,0,0,1,0],3)),ring:new T.TorusGeometry(.46,.025,6,32),box:new T.BoxGeometry(1,1,1),round:new T.CylinderGeometry(.5,.5,1,8),cone:new T.ConeGeometry(.5,1,9),rock:new T.IcosahedronGeometry(.5,1),leaf:new T.IcosahedronGeometry(.5,2)};
 geometries.gable.computeVertexNormals();
 // Uneven silhouettes avoid identical smooth balls and regularly stacked cubes.
 for(const shape of ['rock','leaf']as const){const attr=geometries[shape].getAttribute('position');for(let i=0;i<attr.count;i++){const x=attr.getX(i),y=attr.getY(i),z=attr.getZ(i),r=1+.12*Math.sin(x*31+y*17+z*23);attr.setXYZ(i,x*r,y*r,z*r);}geometries[shape].computeVertexNormals();if(shape==='leaf'){const n=geometries[shape].getAttribute('normal');for(let i=0;i<n.count;i++){const v=new T.Vector3(attr.getX(i),attr.getY(i),attr.getZ(i)).normalize();n.setXYZ(i,v.x,v.y,v.z);}}}
 const colors:Record<Finish,number>={bark:0x66513d,leaf:p.leaf,pine:p.pine,stone:p.rock,sand:0xc8b482,wood:0x8b7558,metal:0x505d60,white:0xcfc7ac,red:0x984636,ochre:0xc59242,glass:0x354b53,rubber:0x2a302e};
 const materials=Object.fromEntries(Object.entries(colors).map(([k,color])=>[k,new T.MeshStandardMaterial({color,roughness:k==='glass'?.35:.92,metalness:k==='metal'?.35:0})])) as Record<Finish,T.MeshStandardMaterial>;
 const foliageTextures:T.Texture[]=[];
 if(typeof document!=='undefined'){
  const canvas=document.createElement('canvas');canvas.width=128;canvas.height=128;const ctx=canvas.getContext('2d');
  if(ctx){ctx.fillStyle='#b6b6b6';ctx.fillRect(0,0,128,128);for(let i=0;i<1800;i++){const c=100+Math.floor(random()*150);ctx.fillStyle=`rgb(${c},${c},${c})`;ctx.beginPath();ctx.ellipse(random()*128,random()*128,1+random()*3,1+random()*2,random()*6.28,0,Math.PI*2);ctx.fill();}const texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;texture.wrapS=texture.wrapT=T.RepeatWrapping;texture.repeat.set(2,2);foliageTextures.push(texture);materials.leaf.map=materials.pine.map=texture;}
 }
 const stoneDetail=addCourseRockDetail(materials.stone);
 const batches=new Map<string,{shape:Shape;finish:Finish;matrices:T.Matrix4[];colors:T.Color[]}>(),q=new T.Quaternion(),matrix=new T.Matrix4();
 const treeCards:{x:number;y:number;z:number;size:number;kind:string}[]=[];
 const placements:{x:number;z:number;radius:number;kind:string;halfWidth?:number;halfDepth?:number}[]=[];
 function add(shape:Shape,finish:Finish,x:number,y:number,z:number,w:number,h:number,d:number,yaw=0){
  const key=shape+'_'+finish,b=batches.get(key)??{shape,finish,matrices:[],colors:[]};q.setFromAxisAngle(new T.Vector3(0,1,0),yaw);matrix.compose(new T.Vector3(x,y,z),q,new T.Vector3(w,h,d));b.matrices.push(matrix.clone());b.colors.push(new T.Color().setScalar(.87+random()*.24));batches.set(key,b);
 }
 const box=(f:Finish,x:number,y:number,z:number,w:number,h:number,d:number,yaw=0)=>add('box',f,x,y,z,w,h,d,yaw);
 function clear(x:number,z:number,r:number,kind:string){
  if(course.distance(x,z)<23+r)return false;
  if(theme==='canyon'&&[[-45,-5,23,16],[65,30,12,10]].some(([cx,cz,w,d])=>Math.abs(x-cx)<w+r&&Math.abs(z-cz)<d+r))return false;
  if((theme==='coast'||theme==='reservoir')&&z+r>172)return false;
  // Keep the canal's water, lock gates and towpath unobstructed.
  if(theme==='canal'&&Math.abs(x)<78+r&&z>-23-r&&z<15+r)return false;
  placements.push({x,z,radius:r,kind});return true;
 }
 function clearRectangle(x:number,z:number,w:number,d:number,kind:string){
  for(const dx of [-w/2,0,w/2])for(const dz of [-d/2,0,d/2])if(course.distance(x+dx,z+dz)<23)return false;
  placements.push({x,z,radius:0,kind,halfWidth:w/2,halfDepth:d/2});return true;
 }
 function scenicHeight(x:number,z:number){
  if(theme!=='coast'&&theme!=='forest'&&theme!=='farm'&&theme!=='port'&&theme!=='park'&&theme!=='dunes'&&theme!=='pass'&&theme!=='reservoir'&&theme!=='club'&&theme!=='ridge'&&theme!=='fair'&&theme!=='heath'&&theme!=='canyon')return course.height(x,z);
  if(Math.abs(x)<=220&&Math.abs(z)<=180)return course.height(x,z);
  const a=Math.atan2(z,x),dx=Math.cos(a),dz=Math.sin(a),edge=1/Math.max(Math.abs(dx)/220,Math.abs(dz)/180),ring=(Math.hypot(x,z)-edge)/56;
  const height=(r:number)=>{const zz=dz*(edge+r*56),ridge=(theme==='pass'?60:theme==='ridge'?38:theme==='canyon'?48:theme==='dunes'?24:19)*(1+.35*Math.sin(a*5)+.2*Math.cos(a*9));let y=r===0?course.height(dx*edge,dz*edge)-.12:course.height(dx*edge,dz*edge)+Math.sin(Math.min(1,r/5)*Math.PI*.62)*ridge+Math.sin(a*11+r)*2;if((theme==='coast'||theme==='port'||theme==='reservoir')&&zz>170)y=Math.min(y,Math.max(-6,-.12-(zz-180)*.18));return y;};
  return T.MathUtils.lerp(height(Math.floor(ring)),height(Math.ceil(ring)),ring%1)-.2;
 }
 // Build excluded decoration normally, then discard only its geometry. This
 // preserves the random sequence and all distant scenery placements.
 function decorateLandmarks(x:number,z:number,r:number,build:()=>void){
  const excluded=(course.id==='wrenford-mud-v1'?[[0,-86,65,13],[0,86,65,13],[140,0,16,47]]:theme==='dunes'?[[-249.5,-91.5,34.5,19.5],[-247,-59,9,23]]:theme==='canal'?[[0,26,27,14],[-27,12,8,13],[10,10,13,6]]:theme==='pass'?[[0,220,113,11]]:theme==='forest'?[[8,-10,9,10]]:theme==='coast'?[[200,110,18,20]]:[]).some(([cx,cz,w,d])=>Math.abs(x-cx)<w+r*1.2&&Math.abs(z-cz)<d+r*1.2);
  if(!excluded){build();return;}
  const lengths=new Map([...batches].map(([key,b])=>[key,b.matrices.length])),placed=placements.length,cards=treeCards.length;
  build();placements.length=placed;treeCards.length=cards;
  for(const[key,b]of batches){const length=lengths.get(key);if(length===undefined)batches.delete(key);else{b.matrices.length=length;b.colors.length=length;}}
 }
 function tree(x:number,z:number,size:number,pine:boolean){decorateLandmarks(x,z,size*(pine?.3:.48),()=>treeShape(x,z,size,pine));}
 function rock(x:number,z:number,size:number){decorateLandmarks(x,z,size*.75,()=>rockShape(x,z,size));}
 function treeShape(x:number,z:number,size:number,pine:boolean){
  if(theme==='port'&&(z>160||(Math.abs(x)<225&&Math.abs(z)<180)))return;
  const r=size*(pine?.3:.48);
  if(theme==='park'&&Math.abs(x)<33+r&&Math.abs(z+211)<13+r)return;
  if(theme==='heath'&&[[-45,-10,20,14],[65,20,13,11],[65,-160,24,12]].some(([cx,cz,w,d])=>Math.abs(x-cx)<w+r&&Math.abs(z-cz)<d+r))return;
  if(theme==='fair'&&[[-40,0,24,34],[55,0,31,32],[0,142,22,9],[-105,-150,25,13],[65,-150,30,13]].some(([cx,cz,w,d])=>Math.abs(x-cx)<w+r&&Math.abs(z-cz)<d+r))return;
  if(theme==='ridge'&&[[-55,-24,12,11],[80,-160,22,11],[75,45,9,8]].some(([cx,cz,w,d])=>Math.abs(x-cx)<w+r&&Math.abs(z-cz)<d+r))return;
  if(theme==='club'&&[[-35,-30,16,13],[62,-160,36,12],[-72,-35,10,6],[15,-28,10,6],[40,56,10,6]].some(([cx,cz,w,d])=>Math.abs(x-cx)<w+r&&Math.abs(z-cz)<d+r))return;
  if(!clear(x,z,r,'tree'))return;
  const y=scenicHeight(x,z),yaw=random()*6.28;
  if(typeof document!=='undefined'&&(theme==='coast'||theme==='forest'||theme==='farm'||theme==='park'||theme==='reservoir'||theme==='club'||theme==='heath'||theme==='fair'||course.distance(x,z)>40)){treeCards.push({x,y,z,size,kind:pine?(treeCards.length%2?'pine':'spruce'):'maple'});return;}
  add('round','bark',x,y+size*.36,z,.3+size*.04,size*.72,.3+size*.04);
  if(pine){for(let tier=0;tier<3;tier++)add('cone','pine',x,y+size*(.45+tier*.19),z,size*(.68-tier*.13),size*.52,size*(.68-tier*.13),yaw+tier);}
  else{for(let lobe=0;lobe<4;lobe++){const a=yaw+lobe*2.2,offset=lobe?size*.2:0;add('leaf',lobe%2?'leaf':'pine',x+Math.cos(a)*offset,y+size*(lobe?.72:.94),z+Math.sin(a)*offset,size*.67,size*(lobe?.61:.57),size*.6,a);}}
 }
 function rockShape(x:number,z:number,size:number){if(!clear(x,z,size*.75,'rock'))return;const y=scenicHeight(x,z);add('rock','stone',x,y+size*.27,z,size*1.4,size*.8,size,random()*6.28);if(size>5)add('rock','stone',x+size*.36,y+size*.12,z-size*.25,size*.8,size*.5,size*.9,random()*6.28);}
 // Naturally staggered clusters, with a clear paddock on the southern side.
 for(let i=0;i<(theme==='port'?0:theme==='forest'?650:theme==='farm'?100:theme==='heath'?150:theme==='ridge'?125:theme==='dunes'?180:240);i++){
  const x=(random()-.5)*420,z=-85+random()*257;
  if(theme==='canyon'){if(i%5===0)tree(x,z,5+random()*4,false);else rock(x,z,3+random()*8);
  }else if(theme==='dunes'){
   if(i%4===0)rock(x,z,1.5+random()*3.5);
   else if(clear(x,z,1.9,'scrub')){const y=course.height(x,z);add('leaf','leaf',x,y+.55,z,2.5,.9,2,random()*6.28);add('round','bark',x,y+.3,z,.13,.6,.13);}
  }else if(theme==='coast'&&i%3===0)rock(x,z,2+random()*5);
  else if(theme==='ridge'&&i%3===0)rock(x,z,2+random()*7);
  else if(theme==='pass'&&i%4===0)rock(x,z,3+random()*9);
  else tree(x,z,theme==='pass'?10+random()*9:7+random()*8,theme==='pass'||theme==='ridge'||(theme==='forest'?i%4!==0:i%7===0));
 }
 // Distant tree lines hide the rectangular terrain edge, with no physics cost.
 for(let i=0;i<130;i++){const a=i/130*Math.PI*2,x=Math.cos(a)*(242+random()*80),z=Math.sin(a)*(210+random()*70);if(theme==='dunes'||theme==='canyon'){if(i%3===0)rock(x,z,6+random()*10);}else tree(x,z,11+random()*11,theme==='pass'||theme==='forest'||theme==='ridge');}

 function building(x:number,z:number,w:number,d:number,h:number,finish:Finish){
  if(!clearRectangle(x,z,w+2,d+2,'building'))return;const y=course.height(x,z);
  box(finish,x,y+h/2,z,w,h,d);box('metal',x,y+h+.2,z,w+1,.4,d+1);
  for(let dx=-w/2+3;dx<w/2-1;dx+=5){box('glass',x+dx,y+h*.58,z+d/2+.06,2.8,h*.35,.12);box('white',x+dx,y+h*.77,z+d/2+.15,3.1,.15,.2);}
  for(const side of [-1,1])box('metal',x+side*(w/2-.25),y+h*.5,z+d/2+.2,.18,h,.2);
  // Corrugated roof and drainpipes give the shed a readable industrial scale.
  for(let dx=-w/2;dx<=w/2;dx+=1.5)box('metal',x+dx,y+h+.46,z,.08,.12,d+1);
 }
 function canopy(x:number,z:number,color:Finish){
  if(!clear(x,z,6,'canopy'))return;const y=course.height(x,z);
  for(const dx of [-4,4])for(const dz of [-3,3])box('white',x+dx,y+1.8,z+dz,.14,3.6,.14);
  add('cone',color,x,y+4.2,z,12,2,9,Math.PI/4);box('white',x,y+3.4,z,8.5,.2,6.5);
  box('wood',x,y+1,z+1,5,.18,1.4);for(const dx of [-1.8,1.8])box('metal',x+dx,y+.5,z+1,.12,1,1.3);
 }
 function stand(x:number,z:number){
  if(!clearRectangle(x,z-3,29,10,'grandstand'))return;const y=course.height(x,z);
  for(let tier=0;tier<5;tier++){
   const zz=z-tier*1.55,yy=y+.55+tier*.65;box('metal',x,yy,zz,27,.22,1.5);
   for(let seat=0;seat<23;seat++){if(random()<.25)continue;const xx=x-12.4+seat*1.1;add('round',seat%3===0?'red':seat%3===1?'ochre':'white',xx,yy+.55,zz,.43,.7,.4);add('rock','sand',xx,yy+1.06,zz,.35,.38,.35);}
  }
  for(const dx of [-13,13]){box('metal',x+dx,y+2.2,z-3,.2,4.4,7);box('metal',x+dx,y+5,z-6,.2,6,.2);}box('white',x,y+7.4,z-3,29,.4,10);
 }
 function serviceTruck(x:number,z:number,finish:Finish){
  if(!clear(x,z,5.5,'service-truck'))return;const y=course.height(x,z);
  box('metal',x,y+.7,z,2.8,.4,8);box(finish,x,y+2,z-1.3,2.9,2.5,5.8);box('white',x,y+1.8,z+2.7,2.9,2.2,2.5);box('glass',x,y+2.15,z+4,2.5,.9,.1);
  for(const dx of [-1.4,1.4])for(const dz of [-2.6,2.7])add('round','rubber',x+dx,y+.65,z+dz,.8,1.1,.8);
 }
 // Venue-specific southern paddocks are visible from the grid and race cameras.
 if(theme==='canyon'){
  building(65,-160,44,18,5,'ochre');stand(-95,-157);canopy(-40,-160,'red');canopy(-20,-160,'white');serviceTruck(121,-160,'ochre');
  for(const x of [-248,248])for(const z of [-75,0,75,145]){
   if(!clearRectangle(x,z,38,32,'canyon-buttress'))continue;const y=scenicHeight(x,z);
   add('rock','stone',x,y-3,z,37,25,31,.2);
   for(let tier=1;tier<4;tier++)add('rock','stone',x+Math.sin(tier+x)*2,y+5+tier*5,z+Math.cos(tier)*2,32-tier*5,12,27-tier*4,tier*.18);
  }
  if(clearRectangle(-45,-5,46,32,'canyon-arch')){
   const y=course.height(-45,-5);
   for(const x of [-60,-30]){add('rock','stone',x,y+5,-5,12,18,16,.1);add('rock','stone',x,y+14,-5,10,12,13,.3);}
   add('rock','stone',-45,y+20,-5,43,10,15,.1);
  }
  if(clearRectangle(65,30,24,20,'canyon-survey-camp')){
   const y=course.height(65,30);box('white',65,y+2,30,15,4,8);box('metal',65,y+4.2,30,16,.4,9);
   for(const x of [60,65,70])box('glass',x,y+2.5,25.9,3,1.5,.1);
   for(const x of [61,69])add('round','rubber',x,y+.6,30,1.5,1.2,1.5);
   box('metal',72,y+7,30,.15,6,.15);box('red',74,y+9,30,4,1.2,.1);
   for(let i=0;i<4;i++)box('wood',59+i*3,y+.5,35,2,1,2);
  }
 }else if(theme==='heath'){
  building(65,-160,44,18,5,'wood');stand(-90,-158);canopy(-35,-160,'white');canopy(-15,-160,'ochre');serviceTruck(120,-160,'white');
  if(clearRectangle(-45,-10,40,28,'heath-ranger-lodge')){
   const y=course.height(-45,-10);box('wood',-45,y+2.5,-10,28,5,17);add('cone','metal',-45,y+7.5,-10,40,5,30,Math.PI/4);
   box('wood',-45,y+.4,1,34,.8,7);for(const x of [-58,-32])box('wood',x,y+2,3,.2,3.2,.2);
   box('wood',-45,y+3.5,3,26,.2,.2);for(const x of [-54,-45,-36])box('glass',x,y+2.8,-1.4,5,2,.15);
   box('stone',-35,y+7,-12,2,7,2);
  }
  if(clearRectangle(65,20,26,22,'heath-bird-hide')){
   const y=course.height(65,20);for(const x of [60,70])for(const z of [16,24])box('wood',x,y+1.5,z,.4,3,.4);
   box('wood',65,y+3.2,20,12,.4,10);box('wood',65,y+5,24.8,12,3.2,.3);box('pine',65,y+7,20,14,.5,12);
   for(const x of [61,65,69])box('glass',x,y+5.7,25,2,.6,.1);
   for(let i=0;i<6;i++)box('wood',65,y+.3+i*.5,9+i,4,.3,1.2);
  }
  for(let i=0;i<100;i++){
   const x=-205+(i*61.1%410),z=-80+(i*43.7%245);if(!clear(x,z,2.2,'heath-scrub'))continue;
   if([[-45,-10,25,19],[65,20,18,16]].some(([cx,cz,w,d])=>Math.abs(x-cx)<w&&Math.abs(z-cz)<d))continue;
   const y=course.height(x,z);add('leaf','pine',x,y+.5,z,3.8,1.2,3, i*.7);add('leaf','ochre',x+.7,y+.8,z,1.2,.4,1.3);
  }
  if(clearRectangle(-90,155,40,10,'heath-trail-fence')){
   for(let x=-108;x<=-72;x+=6){const y=course.height(x,155);box('wood',x,y+.9,155,.2,1.8,.2);if(x< -72)for(const h of [.5,1.3])box('wood',x+3,y+h,155,6,.15,.15);}
  }
 }else if(theme==='fair'){
  stand(-35,-120);stand(35,-120);building(110,-150,30,18,5,'red');serviceTruck(143,-150,'ochre');
  for(const x of [-120,-100,-80,40,60,80])canopy(x,-150,x<0?'red':'ochre');
  clearRectangle(-40,0,52,38,'fair-wheel');
  clearRectangle(55,0,62,64,'fair-marquee');
  if(clearRectangle(0,142,44,18,'fair-prize-stalls')){
   const y=course.height(0,142);for(const x of [-15,0,15]){
    box('wood',x,y+1,142,12,2,6);box('red',x,y+4.5,142,13,.4,7);
    for(const dx of [-5.7,5.7])box('white',x+dx,y+2.8,142,.2,5.6,.2);
    for(let i=-4;i<=4;i+=2)add('round',i%4?'ochre':'white',x+i,y+2.5,143,.7,1,.7);
   }
  }
 }else if(theme==='ridge'){
  building(80,-160,40,18,5,'wood');stand(-100,-158);canopy(-45,-160,'ochre');canopy(-24,-160,'white');serviceTruck(127,-158,'ochre');
  if(clearRectangle(80,-160,44,22,'ridge-service')){
   for(const x of [68,80,92]){box('metal',x,2.4,-150.8,7.2,4.5,.15);for(let y=.5;y<4.5;y+=.5)box('white',x,y,-150.6,7,.08,.1);}
   box('ochre',80,5.3,-150.5,35,.65,.18);box('white',80,3.7,-150.3,2,1,.1);box('red',80,3.7,-150.2,.18,.8,.1);box('red',80,3.7,-150.15,.8,.18,.1);
   for(const x of [65,72,79]){add('round','rubber',x,.45,-167,2,.9,2);add('round','rubber',x,1.3,-167,2,.9,2);}
  }
  // Timber observation tower and climbing stairs form a clear infield landmark.
  if(clearRectangle(-55,-24,24,22,'ridge-lookout')){
   const x=-55,z=-24,y=course.height(x,z);
   for(const dx of [-5,5])for(const dz of [-4,4])box('wood',x+dx,y+4,z+dz,.55,8,.55);
   for(const h of [2,4,6])for(const side of [-1,1]){box('wood',x,y+h,z+side*4,10,.25,.25);box('wood',x+side*5,y+h,z,.25,.25,8);}
   box('wood',x,y+8,z,12,.4,10);
   for(const side of [-1,1]){box('wood',x+side*5.5,y+8.7,z,.18,1.4,10);box('wood',x,y+9.4,z+side*4.6,12,.18,.18);}
   for(let i=0;i<10;i++)box('wood',x+8,y+.4+i*.8,z-8+i*1.6,2,.8,1.6);
   for(const dx of [-5,5])for(const dz of [-4,4])box('wood',x+dx,y+10,z+dz,.25,4,.25);
   add('cone','red',x,y+12.5,z,17,3,14,Math.PI/4);
  }
  if(clearRectangle(75,45,18,16,'ridge-radio')){
   const y=course.height(75,45);box('white',75,y+1.8,45,8,3.6,6);box('metal',75,y+3.8,45,9,.4,7);box('glass',75,y+2,48.1,4,1.3,.15);
   for(const dx of [-2,2])for(const dz of [-2,2])box('metal',75+dx,y+12,45+dz,.18,24,.18);
   for(let h=5;h<=24;h+=4){box('metal',75,y+h,43,4,.12,.12);box('metal',75,y+h,47,4,.12,.12);}
   box('red',75,y+25,45,.7,.7,.7);box('white',75,y+21,45,7,.4,.3);
  }
  for(const x of [-250,248])for(const z of [-55,35,125]){
   if(!clearRectangle(x,z,27,22,'ridge-outcrop'))continue;const y=scenicHeight(x,z);
   // Bury the broad foot into the slope; a shallow ellipsoid leaves a visible air gap downhill.
   add('rock','stone',x,y-4,z+2,25,20,20);
   for(let tier=1;tier<4;tier++)add('rock','stone',x+Math.sin(tier*2)*3,y+3+tier*4,z+Math.cos(tier)*2,25-tier*4,8,20-tier*3,tier*.3);
  }
 }else if(theme==='club'){
  building(62,-160,68,20,5.5,'white');stand(-97,-156);canopy(-42,-159,'red');canopy(-22,-159,'white');serviceTruck(119,-158,'red');
  if(clearRectangle(62,-160,72,24,'club-pits')){
   for(let x=37;x<=87;x+=10){box('metal',x,2.4,-149.8,7.5,4.6,.16);for(let y=.4;y<4.6;y+=.4)box('white',x,y,-149.65,7.3,.07,.12);box('red',x,5,-149.5,8.2,.65,.2);box('white',x,.1,-148,7.5,.15,.2);}
   box('red',62,7.7,-159,24,4,15);box('glass',62,8,-151.3,22,2.1,.15);box('white',62,10,-159,26,.5,17);
   for(let x=52;x<=72;x+=4)box('white',x,8,-151.1,.15,2.5,.2);
   box('metal',72,12,-160,.18,4,.18);box('ochre',74,13,-160,4,1.5,.1);
  }
  // The infield clubhouse overlooks the technical bends, safely behind barriers.
  if(clearRectangle(-35,-30,32,26,'clubhouse')){
   const y=course.height(-35,-30);box('wood',-35,y+3,-30,28,6,20);
   for(const side of [-1,1]){
    const roof=new T.Matrix4().makeRotationX(side*.32);roof.setPosition(-35,y+7.5,-30+side*5);roof.scale(new T.Vector3(31,.4,11));
    const batch=batches.get('box_red')??{shape:'box' as const,finish:'red' as const,matrices:[],colors:[]};batch.matrices.push(roof);batch.colors.push(new T.Color(.92,.92,.92));batches.set('box_red',batch);
    add('gable','wood',-35+side*14.1,y+6,-30,20,3.3,1,side*Math.PI/2);
   }
   for(const x of [-44,-35,-26]){box('glass',x,y+3.4,-19.9,5,2.3,.15);box('white',x,y+4.7,-19.7,5.5,.2,.2);}
   box('wood',-35,y+.6,-18.8,30,.3,2.2);box('stone',-25,y+7,-34,2.2,8,2.2);
  }
  for(const [x,z]of [[-72,-35],[15,-28],[40,56]]){
   if(!clearRectangle(x,z,20,12,'club-terrace'))continue;const y=course.height(x,z);
   for(let tier=0;tier<3;tier++){box('wood',x,y+.6+tier*.65,z+tier*2,18,.3,1.7);for(const dx of [-7,7])box('metal',x+dx,y+.3+tier*.33,z+tier*2,.2,.6+tier*.65,1.7);}
   for(const side of [-1,1]){box('metal',x+side*9,y+1.5,z+3,.15,3,.15);box('metal',x+side*9,y+3,z+3,.15,.15,9);}
  }
  for(const x of [-137,145])if(clearRectangle(x,-163,9,10,'club-entry')){
   box('stone',x,2.3,-163,6,4.6,7);box('glass',x,3,-159.4,4,1.7,.15);box('red',x,4.9,-163,8,.6,9);box('white',x,6,-163,.15,2,.15);box('ochre',x+1.3,6.5,-163,2.6,.9,.1);
  }
 }else if(theme==='park'){
  building(38,-158,55,17,6,'white');stand(-85,-155);canopy(-30,-157,'red');canopy(-12,-157,'ochre');serviceTruck(99,-157,'red');
  // Club pits face the grid, with roller doors, bays and an elevated timing room.
  for(const x of [18,28,38,48,58]){
   box('metal',x,2.2,-149.42,7.4,4.2,.15);
   for(let h=.5;h<4.2;h+=.4)box('white',x,h,-149.3,7.2,.07,.12);
   box('red',x,4.7,-149.2,8,.55,.2);
   box('white',x,1,-146.9,7.5,.15,.2);
  }
  if(clearRectangle(38,-158,18,13,'timing-tower')){
   box('white',38,8,-158,17,4,12);box('glass',38,8.4,-151.9,15,2.1,.12);
   for(const x of [30,34,38,42,46])box('white',x,8.4,-151.7,.16,2.4,.2);
   box('red',38,10.2,-158,19,.45,14);
   box('metal',38,12,-158,.18,3.2,.18);box('ochre',39.7,13,-158,3.4,1.3,.08);
  }
  // An old park bandstand and picnic terraces turn the infield into a venue.
  for(const [x,z]of [[0,-30],[-80,-45],[78,0]]){
   if(!clear(x,z,10,'park-pavilion'))continue;const y=course.height(x,z);
   add('round','stone',x,y+.35,z,17,.7,17);
   for(let i=0;i<8;i++){const a=i*Math.PI/4;box('white',x+Math.cos(a)*6,y+2.8,z+Math.sin(a)*6,.28,5,.28);}
   add('cone','red',x,y+6.1,z,19,3.2,19,Math.PI/8);
   add('round','white',x,y+4.9,z,17,.4,17);
   box('white',x,y+8.2,z,.18,2,.18);
  }
  for(const [x,z]of [[-36,-35],[-18,-35],[37,-35],[55,-35],[-220,70],[220,50]]){
   if(!clearRectangle(x,z,9,7,'picnic-area'))continue;const y=scenicHeight(x,z);
   box('wood',x,y+1,z,5,.18,1.6);
   for(const side of [-1,1]){
    box('wood',x,y+.55,z+side*1.45,5,.16,.55);
    for(const dx of [-1.7,1.7]){box('metal',x+dx,y+.5,z+side*.5,.12,1,.12);box('metal',x+dx,y+.25,z+side*1.45,.12,.5,.12);}
   }
  }
  for(const x of [-112,125]){
   const z=-162;if(!clear(x,z,5,'club-clock'))continue;const y=course.height(x,z);
   box('stone',x,y+2,z,3.6,4,3.6);box('white',x,y+5.3,z,4.4,2.6,4.4);
   box('metal',x,y+5.3,z+2.23,3.7,2.1,.12);
   box('white',x,y+5.6,z+2.31,.09,.65,.08);box('white',x+.5,y+5.3,z+2.31,1,.09,.08);
   add('cone','red',x,y+7.4,z,6,2,6,Math.PI/4);
  }

 }else if(theme==='dunes'){
  building(70,-158,34,14,4.5,'wood');stand(-95,-155);for(const x of [-40,-20,0])canopy(x,-156,x===-20?'red':'ochre');serviceTruck(110,-157,'ochre');
  // Industrial landmarks use shared batches and stay beyond the racing corridor.
  function beam(finish:Finish,a:T.Vector3,b:T.Vector3,width:number,depth=width){
   const direction=b.clone().sub(a),rotation=new T.Quaternion().setFromUnitVectors(new T.Vector3(0,1,0),direction.clone().normalize());
   const m=new T.Matrix4().compose(a.clone().add(b).multiplyScalar(.5),rotation,new T.Vector3(width,direction.length(),depth));
   const key='box_'+finish,batch=batches.get(key)??{shape:'box' as const,finish,matrices:[],colors:[]};batch.matrices.push(m);batch.colors.push(new T.Color(.94,.94,.94));batches.set(key,batch);
  }
  const x=230,z=-48,y=scenicHeight(x,z);
  if(clearRectangle(x+4,z,28,12,'excavator')){
   // Separate crawler tracks, cab, counterweight, jointed boom and toothed bucket.
   for(const side of [-1,1]){
    box('rubber',x,y+.8,z+side*2.2,10,1.6,1.5);
    for(let dx=-4.5;dx<=4.5;dx+=.65)box('metal',x+dx,y+1.65,z+side*2.2,.25,.16,1.6);
   }
   add('round','metal',x,y+1.8,z,4,.8,4);box('ochre',x-1.5,y+2.8,z,7,2,4.7);
   box('ochre',x-2,y+4.4,z-1,3.4,2.4,2.2);box('glass',x-1.9,y+4.6,z-2.13,2.7,1.6,.1);
   box('glass',x-.24,y+4.6,z-1,.1,1.6,1.8);box('metal',x-2,y+5.7,z-1,3.6,.22,2.5);
   const pivot=new T.Vector3(x+1,y+3.2,z+1),elbow=new T.Vector3(x+7,y+11,z+1),tip=new T.Vector3(x+12,y+3,z+1);
   beam('ochre',pivot,elbow,1.4,1.6);beam('ochre',elbow,tip,1,1.3);
   beam('metal',new T.Vector3(x+2,y+3,z+.1),new T.Vector3(x+6,y+8.5,z+.1),.32);
   beam('metal',new T.Vector3(x+7.5,y+10,z+.1),new T.Vector3(x+11,y+5,z+.1),.25);
   box('metal',x+12,y+2.2,z+1,3.8,1.5,3.8);for(const dz of [-.4,.5,1.4,2.3])box('metal',x+14,y+1.6,z+dz,1.2,.25,.35);
   box('metal',x-3.5,y+4.2,z+1.4,.25,2,.25);
  }
  const cx=-239,cz=12,cy=scenicHeight(cx,cz);
  if(clearRectangle(cx,cz,20,65,'aggregate-conveyor')){
   // Raised feed hopper, steel supports and a sloping conveyor to the stockpile.
   for(const dx of [-6,6])for(const dz of [-5,5])box('metal',cx+dx,cy+5,cz-20+dz,.5,10,.5);
   box('red',cx,cy+10,cz-20,15,3,13);box('metal',cx,cy+11.6,cz-20,13,.2,11);
   for(const side of [-1,1]){
    beam('ochre',new T.Vector3(cx+side*2.5,cy+8,cz-16),new T.Vector3(cx+side*2.5,cy+15,cz+24),.4);
    for(let dz=-12;dz<=24;dz+=9){const h=8+(dz+16)*7/40;box('metal',cx+side*2.5,cy+h/2,cz+dz,.3,h,.3);}
   }
   beam('rubber',new T.Vector3(cx,cy+8,cz-16),new T.Vector3(cx,cy+15,cz+24),4.4,.35);
   for(let dz=-12;dz<=24;dz+=4){const h=8+(dz+16)*7/40;box('metal',cx,cy+h,cz+dz,5,.15,.25);}
  }
  for(const [px,pz,size]of [[-239,57,20],[239,63,18],[-40,-35,11],[40,-35,13]]){
   if(!clear(px,pz,size,'aggregate-pile'))continue;const py=scenicHeight(px,pz);
   add('cone','sand',px,py+size*.27,pz,size*1.8,size*.65,size*1.7,Math.PI/7);
   for(let i=0;i<7;i++){const angle=i*Math.PI*2/7;add('rock','stone',px+Math.cos(angle)*size*.68,py+.6,pz+Math.sin(angle)*size*.62,2.5,1.4,2.2,angle);}
  }
 }else if(theme==='canal'){
  building(-77,-158,48,16,7,'red');building(65,-158,48,16,6,'red');stand(-10,-155);canopy(22,-157,'ochre');serviceTruck(112,-157,'white');
  // Quayside cranes, bollards, warehouse tanks and a towpath footbridge.
  for(const x of [-56,58]){box('metal',x,6,-19,.55,12,.55);box('ochre',x+6,11.6,-19,13,.6,.7);box('metal',x+11.5,8,-19,.1,7,.1);}
  for(let x=-60;x<=60;x+=12)for(const z of [-17,7])add('round','metal',x,1.1,z,.45,.85,.45);
  box('wood',-18,3.8,-5,4,.5,26);for(const x of [-20, -16]){box('metal',x,4.8,-5,.13,.13,26);for(let z=-18;z<=8;z+=3)box('metal',x,4.3,z,.12,1,.12);}
  for(const x of [-105,105]){add('round','white',x,4.5,-50,10,9,10);add('cone','metal',x,9.3,-50,10,1.6,10);}
  // Moored narrowboats share the canal's existing hulls and leave the race route clear.
  for(const x of [-38,10,42]){
   clearRectangle(x,-5,22,8,'narrowboat');
   box('wood',x,1.55,-5,19,.18,5.6);box('white',x+3,2.82,-5,9,.2,5.4);
   for(const side of [-1,1]){
    for(const dx of [0,2.3,4.6])box('glass',x+dx,2.15,-5+side*2.53,1.5,.7,.08);
    box('white',x,1.1,-5+side*3.03,18,.18,.08);
    for(const dx of [-8,8])add('round','rubber',x+dx,1,-5+side*3.15,.65,1.1,.65);
    box('metal',x-6,2.1,-5+side*2.5,6,.1,.1);
    for(const dx of [-9,-3])box('metal',x+dx,1.85,-5+side*2.5,.1,.6,.1);
   }
   box('metal',x+4,3.35,-5,.35,1,.35);add('round','red',x-6,1.85,-5,1.3,.45,1.3);
  }
  // Lock gates carry timber panels, steel straps, balance beams and winding pedestals.
  for(const x of [-62,62]){
   clearRectangle(x,-5,8,28,'lock-gate');
   for(const side of [-1,1]){
    const z=-5+side*5;
    box('wood',x,1.2,z,.7,2.4,9.7);for(const y of [.5,1.8])box('metal',x+.4,y,z,.15,.2,9.7);
    box('white',x,2.6,-5+side*12,.7,.6,5);
    box('metal',x+2,1.8,-5+side*12,.35,2,.35);box('ochre',x+2,2.8,-5+side*12,1.4,.18,.25);
   }
  }
  // Glazed lock keeper's office overlooks the towpath.
  if(clearRectangle(0,-39,16,12,'lock-office')){
   const y=course.height(0,-39);box('red',0,y+2.5,-39,14,5,10);box('metal',0,y+5.2,-39,16,.5,12);
   for(const x of [-4,4]){box('white',x,y+3,-33.94,3,2,.12);box('glass',x,y+3,-33.84,2.6,1.6,.12);}
   box('wood',0,y+1.6,-33.9,1.6,3.2,.15);box('white',0,y+4.4,-33.8,9,.45,.15);
  }
 }else if(theme==='port'){
  building(62,-158,48,18,8,'metal');stand(-88,-155);canopy(-30,-157,'ochre');canopy(-10,-157,'white');serviceTruck(112,-157,'red');
  function container(x:number,z:number,y:number,finish:Finish){
   box(finish,x,y+1.5,z,22,3,8);
   for(const side of [-1,1]){
    for(let rib=-10;rib<=10;rib+=1.5)box('metal',x+rib,y+1.5,z+side*4.03,.11,2.8,.1);
    box('white',x+side*10.96,y+1.5,z,.1,2.8,7.7);
    for(const dz of [-2,2])box('metal',x+side*11.03,y+1.5,z+dz,.13,2.7,.12);
   }
   for(const zside of [-4,4])box('metal',x,y+.15,z+zside,22,.18,.12);
  }
  // Containers leave generous recovery lanes between the dockside esses.
  for(const [x,z]of [[-65,-40],[-35,-40],[-65,-5],[-35,-5],[25,-42],[55,-42],[20,12],[50,12],[-212,15],[212,50]]){
   if(!clearRectangle(x,z,24,10,'container-stack'))continue;
   container(x,z,0,'red');container(x,z,3,'ochre');
  }
  // Gantries over the quay, with open frames, diagonal bracing and suspended spreaders.
  for(const x of [-120,110]){
   const z=191;if(!clearRectangle(x,z,36,60,'dock-crane'))continue;
   for(const dx of [-14,14])for(const dz of [-22,22]){box('ochre',x+dx,16,z+dz,1.5,32,1.5);box('metal',x+dx,1,z+dz,3,2,5);}
   for(const dx of [-14,14])box('ochre',x+dx,33,z,1.8,2,60);
   for(const dz of [-28,28])box('ochre',x,33,z+dz,30,2,1.8);
   for(const dz of [-26,26])box('ochre',x,23,z+dz,30,1,1.2);
   for(const dx of [-14,14])box('metal',x+dx,35,z,.3,.3,60);
   box('white',x-10,29,z-15,5,4,5);box('glass',x-10,29.5,z-17.6,4,2,.15);
   for(const dx of [-8,8])box('metal',x+dx,22,z+22,.1,20,.1);
   box('ochre',x,11.5,z+22,20,1,6);
   for(const side of [-1,1]){add('box','metal',x,16,z+side*22,1,1,1);const b=batches.get('box_metal')!;const tilt=new T.Quaternion().setFromAxisAngle(new T.Vector3(0,0,1),side*.72);b.matrices[b.matrices.length-1].compose(new T.Vector3(x,16,z+side*22),tilt,new T.Vector3(.5,39,.5));}
  }
  box('stone',0,-.1,177,440,.6,9);
  for(let x=-210;x<=210;x+=15){add('round','metal',x,.7,176,.7,1.4,.7);box('metal',x,.9,176,1.4,.2,.3);}
  // Cargo ship with a tapered hull, bridge windows, masts and loaded deck.
  clearRectangle(0,245,150,32,'cargo-ship');
  box('metal',0,5.6,245,124,.5,25);
  for(const x of [-22,4,30])for(const z of [239,251]){container(x,z,5.9,'red');container(x,z,8.9,'ochre');}
  for(let deck=0;deck<3;deck++){box('white',-47,7.5+deck*3,245,18,3,22);box('glass',-37.9,8+deck*3,245,.12,1.4,19);for(const side of [-1,1])box('glass',-47,8+deck*3,245+side*11.05,16,1.4,.12);}
  box('metal',-47,16,245,21,.5,25);box('ochre',-57,18,245,4,7,5);box('metal',-57,21.8,245,4.4,.6,5.4);box('metal',-43,20,245,.4,8,.4);box('white',-43,22,245,9,.3,.3);
  for(const side of [-1,1]){box('white',0,6.7,245+side*13,130,.12,.12);for(let x=-65;x<=65;x+=5)box('white',x,6.1,245+side*13,.12,1.2,.12);}
  // Fuel tanks and pipes beyond the western fence, visible on the return straight.
  for(const z of [-54,-28]){if(!clear(-244,z,12,'fuel-tank'))continue;add('round','white',-244,7,z,20,14,20);add('cone','metal',-244,14.7,z,20,1.4,20);for(const y of [2,12])add('round','metal',-244,y,z,20.2,.16,20.2);box('ochre',-232,2,z,6,.4,.4);}
 }else if(theme==='farm'){
  building(62,-158,42,17,6,'red');stand(-88,-155);canopy(-30,-157,'ochre');canopy(-10,-157,'white');serviceTruck(112,-157,'white');
  // Gabled barns with timber doors and white framing, viewed from both long sides.
  for(const [x,z,w,d]of [[-205,0,18,28],[205,0,18,28],[62,-158,42,17]]){
   if(x!==62){if(!clearRectangle(x,z,w+3,d+3,'barn'))continue;const y=course.height(x,z);box('red',x,y+3,z,w,6,d);}
   const y=course.height(x,z);
   for(const side of [-1,1]){
    const roof=new T.Matrix4().makeRotationZ(-side*.46);roof.setPosition(x+side*w*.25,y+6+w*.29*Math.sin(.46),z);roof.scale(new T.Vector3(w*.58,.35,d+2));const k='box_metal',b=batches.get(k)!;b.matrices.push(roof);b.colors.push(new T.Color(.92,.92,.92));
    add('gable','red',x,y+6,z+side*(d/2+.02),w,w*.5*Math.tan(.46),1,side===1?0:Math.PI);
    box('wood',x,y+2.3,z+side*(d/2+.08),6,4.6,.16);
    for(const dx of [-3.1,0,3.1])box('white',x+dx,y+2.4,z+side*(d/2+.2),.16,4.8,.18);
    box('white',x,y+4.8,z+side*(d/2+.2),6.4,.2,.18);
    for(const dx of [-w/2,w/2])box('white',x+dx,y+3,z+side*d/2,.25,6,.25);
   }
  }
  // Grain silos use cylindrical shells, conical caps, rings and an access ladder.
  for(const x of [-42, -24]){const z=-166;if(!clear(x,z,6,'grain-silo'))continue;const y=course.height(x,z);add('round','white',x,y+6,z,9,12,9);add('cone','metal',x,y+13.2,z,10,2.4,10);
   for(let ring=1;ring<12;ring+=2)add('round','metal',x,y+ring,z,9.15,.12,9.15);
   for(const dx of [-.55,.55])box('metal',x+dx,y+6,z+4.6,.09,12,.09);for(let h=.4;h<12;h+=.45)box('metal',x,y+h,z+4.64,1.2,.08,.08);
  }
  // Round straw bales and cut ends face the circuit rather than appearing as crates.
  const cylinder=(finish:Finish,x:number,y:number,z:number,w:number,length:number)=>{
   const m=new T.Matrix4().makeRotationX(Math.PI/2);m.setPosition(x,y,z);m.scale(new T.Vector3(w,length,w));const key='round_'+finish,b=batches.get(key)??{shape:'round' as const,finish,matrices:[],colors:[]};b.matrices.push(m);b.colors.push(new T.Color(.95,.91,.8));batches.set(key,b);
  };
  for(let i=0;i<32;i++){const x=-190+i*12,z=150+Math.sin(i*.7)*8;if(!clear(x,z,2,'hay-bale'))continue;const y=course.height(x,z);cylinder('ochre',x,y+1.25,z,2.5,2.3);for(const end of [-1,1])cylinder('sand',x,y+1.25,z+end*1.17,2.22,.05);}
  // A parked tractor and open hay trailer sit in a checked off-road clearing.
  const tx=60,tz=14;if(clear(tx,tz,10,'tractor')){const y=course.height(tx,tz);box('red',tx,y+1.4,tz,2.2,1.3,4.8);box('red',tx,y+2.1,tz+1.5,1.8,1.4,2.2);box('glass',tx,y+3,tz-1,1.9,2.2,2);box('white',tx,y+4.2,tz-1,2.4,.2,2.6);box('metal',tx+.7,y+3.2,tz+2,.16,2,.16);
   for(const side of [-1,1])for(const [dz,r]of [[-1.7,1.4],[1.8,.85]]){const m=new T.Matrix4().makeRotationZ(Math.PI/2);m.setPosition(tx+side*1.4,y+r,tz+dz);m.scale(new T.Vector3(r*2,.75,r*2));const key='round_rubber',b=batches.get(key)??{shape:'round' as const,finish:'rubber' as const,matrices:[],colors:[]};b.matrices.push(m);b.colors.push(new T.Color(.8,.8,.8));batches.set(key,b);}
   box('metal',tx,y+1,tz-5.8,.25,.25,4);box('wood',tx,y+1.5,tz-8,3.2,.4,5);for(const side of [-1,1])box('wood',tx+side*1.6,y+2,tz-8,.15,1,5);for(const x of [-.8,.8])cylinder('ochre',tx+x,y+2.3,tz-8,1.5,3.8);
  }
 }else if(theme==='coast'){
  building(52,-158,48,16,5,'white');stand(-85,-155);canopy(-28,-157,'red');canopy(-8,-157,'white');serviceTruck(105,-157,'white');
  // A round, banded lighthouse and wraparound lantern replace the old stack of boxes.
  const x=206,z=137,y=course.height(x,z);
  rock(x,z,11);
  for(let tier=0;tier<5;tier++)add('round',tier%2?'red':'white',x,y+2+tier*3.2,z,5-tier*.35,3.2,5-tier*.35);
  add('round','metal',x,y+17,z,7,.4,7);add('round','glass',x,y+18.2,z,3.6,2.2,3.6);add('cone','red',x,y+20,z,5,1.6,5);
  for(let i=0;i<12;i++){const a=i/12*Math.PI*2;box('white',x+Math.cos(a)*3,y+17.7,z+Math.sin(a)*3,.12,1.2,.12);}
  for(let i=0;i<12;i++){const a=i/12*Math.PI*2;box('white',x+Math.cos(a)*3,y+18.3,z+Math.sin(a)*3,.1,.1,1.65,-a);}
  box('wood',x,y+1.5,z-2.3,1.4,2.8,.2);
  for(let i=0;i<35;i++)rock(-212+i*12,155+Math.sin(i*.8)*7,3+random()*5);
 }else if(theme==='forest'){
  building(52,-158,44,17,6,'wood');stand(-88,-155);canopy(-30,-157,'ochre');canopy(-10,-157,'red');serviceTruck(111,-157,'ochre');
  // Lodge gables, chimney and stacked cut timber at the service clearing.
  for(const side of [-1,1]){const roof=new T.Matrix4().makeRotationX(side*.38);roof.setPosition(52,7.9,-158+side*5);roof.scale(new T.Vector3(47,.5,11));const key='box_metal',b=batches.get(key)!;b.matrices.push(roof);b.colors.push(new T.Color(.9,.9,.9));}
  box('stone',66,7.7,-158,2,5,2);
  for(const [x,z]of [[-84,-52],[70,23],[214,18]]){if(!clear(x,z,9,'log-pile'))continue;const y=course.height(x,z);
   for(let row=0;row<3;row++)for(let col=0;col<4-row;col++){const xx=x+(col+row*.5-1.5)*1.3,yy=y+.65+row*1.12;
    const m=new T.Matrix4().makeRotationX(Math.PI/2);m.setPosition(xx,yy,z);m.scale(new T.Vector3(1.2,8,1.2));const key='round_bark',b=batches.get(key)??{shape:'round' as const,finish:'bark' as const,matrices:[],colors:[]};b.matrices.push(m);b.colors.push(new T.Color(.85,.8,.7));batches.set(key,b);
    for(const end of [-1,1]){const cut=new T.Matrix4().makeRotationX(Math.PI/2);cut.setPosition(xx,yy,z+end*4.01);cut.scale(new T.Vector3(1.02,.04,1.02));const k='round_sand',bb=batches.get(k)??{shape:'round' as const,finish:'sand' as const,matrices:[],colors:[]};bb.matrices.push(cut);bb.colors.push(new T.Color(.95,.9,.8));batches.set(k,bb);}
   }
  }
 }else if(theme==='reservoir'){
  building(90,-163,45,15,8,'stone');stand(-105,-158);canopy(-48,-159,'red');canopy(-27,-159,'white');serviceTruck(136,-159,'ochre');
  // Dam control house and maintenance yard are set back from the start straight.
  if(clearRectangle(90,-163,49,19,'dam-control')){
   const y=course.height(90,-163);
   box('glass',90,y+6,-155.3,35,2.1,.18);
   for(let x=74;x<=106;x+=4)box('white',x,y+6,-155.1,.15,2.4,.2);
   for(const x of [77,102]){box('metal',x,y+2.3,-155.2,8,4.4,.15);for(let yy=.5;yy<4.5;yy+=.5)box('white',x,y+yy,-155,7.7,.07,.1);}
   box('white',90,y+10,-163,18,4,10);box('glass',90,y+10,-157.9,16,2.4,.15);box('metal',90,y+12.3,-163,20,.5,12);
   box('metal',99,y+15,-165,.18,6,.18);add('round','white',99,y+17,-165,2,.5,2);
  }
  // Intake machinery, a shoreline service pier and dam railings make the water legible.
  for(const x of [-110,0,110]){
   if(!clearRectangle(x,198,15,27,'water-intake'))continue;
   box('stone',x,4,198,10,8,12);box('metal',x,8.3,198,12,.6,14);
   box('glass',x,6,191.9,7,2,.15);box('white',x,10,198,.4,3,.4);box('red',x,11.5,198,.8,.6,.8);
   box('metal',x,3.3,184,3,.4,17);
   for(const side of [-1,1]){box('metal',x+side*1.4,4.3,184,.1,.1,17);for(let z=177;z<=192;z+=3)box('metal',x+side*1.4,3.8,z,.1,1,.1);}
  }
  for(let x=-208;x<=208;x+=4){box('metal',x,4.1,173,.1,2,.1);}
  for(const h of [3.7,4.9])box('metal',0,h,173,420,.1,.1);
  if(clearRectangle(-40,-45,27,16,'reservoir-picnic')){
   const y=course.height(-40,-45);
   for(const x of [-49,-31]){box('wood',x,y+1,-45,5,.2,1.8);for(const side of [-1,1]){box('wood',x,y+.55,-45+side*1.5,5,.2,.6);for(const dx of [-1.8,1.8])box('metal',x+dx,y+.5,-45+side*.5,.15,1,.15);}}
   for(const x of [-52,-28]){box('white',x,y+2,-50,.18,4,.18);}box('red',-40,y+4.2,-50,26,.5,4);
  }
  for(let i=0;i<20;i++){const x=-210+i*22,z=165;if(clear(x,z,2,'shore-rock')){add('rock','stone',x,course.height(x,z)+.5,z,3,1.7,2.5,i);}}
 }else{
  building(65,-166,38,16,5,'wood');stand(-88,-155);canopy(-28,-157,'red');canopy(-8,-157,'white');serviceTruck(112,-157,'red');
  for(const x of [-241,245])for(const z of [-60,35,125])rock(x,z,18+random()*17);
  // Alpine rescue lodge: pitched roof, timber balcony and recovery garage.
  if(clearRectangle(65,-166,42,22,'rescue-lodge')){
   const y=course.height(65,-166);
   for(const side of [-1,1]){
    const roof=new T.Matrix4().makeRotationX(side*.38);roof.setPosition(65,y+7,-166+side*4.5);roof.scale(new T.Vector3(41,.45,10));
    const batch=batches.get('box_metal')!;batch.matrices.push(roof);batch.colors.push(new T.Color(.9,.9,.9));
   }
   for(const side of [-1,1])add('gable','wood',65+side*19.1,y+5,-166,16,3.8,1,side*Math.PI/2);
   box('stone',78,y+6,-168,2.2,7,2.2);
   box('wood',65,y+1,-155.8,38,.35,3.5);
   for(let x=47;x<=83;x+=3){box('wood',x,y+1.8,-154.3,.16,1.5,.16);}
   box('wood',65,y+2.5,-154.3,38,.14,.14);
   for(const x of [52,65,78]){box('metal',x,y+2.5,-157.8,7,3,.15);for(let yy=1.3;yy<=3.8;yy+=.5)box('white',x,y+yy,-157.7,6.8,.06,.08);}
   box('white',65,y+4.5,-157.65,3.2,1.1,.12);box('red',65,y+4.5,-157.55,.25,.85,.1);box('red',65,y+4.5,-157.5,.85,.25,.1);
  }
  // Two small overlooks provide landmarks without narrowing racing/recovery space.
  for(const [x,z]of [[-5,-30],[75,35]]){
   if(!clearRectangle(x,z,16,12,'mountain-overlook'))continue;const y=course.height(x,z);
   for(const dx of [-6,6])for(const dz of [-4,4])box('stone',x+dx,y+1.8,z+dz,1,3.6,1);
   box('wood',x,y+3.6,z,14,.35,10);
   for(const side of [-1,1]){
    box('wood',x,y+4.8,z+side*4.8,14,.16,.16);
    for(let dx=-6;dx<=6;dx+=3)box('wood',x+dx,y+4.2,z+side*4.8,.16,1.2,.16);
    box('wood',x+side*6.8,y+4.8,z,.16,.16,10);
   }
   // Climbing steps stay inside the reserved footprint.
   for(let i=0;i<6;i++)box('wood',x-5,y+.3+i*.6,z-4+i*1.2,2,.6,1.2);
   box('metal',x+3,y+4.2,z, .2,1.2,.2);add('round','metal',x+3,y+4.9,z,.8,.25,.8);
  }
  // Snow poles, grit bins and a weather mast give the maintenance yard a purpose.
  if(clearRectangle(-52,-158,22,16,'pass-maintenance')){
   const y=course.height(-52,-158);
   for(const x of [-60,-55,-50]){box('ochre',x,y+.8,-158,3,1.6,2.2);box('metal',x,y+1.7,-158,3.2,.2,2.4);}
   for(let i=0;i<7;i++){box('red',-61+i*1.4,y+2,-164,.14,4,.14);box('white',-61+i*1.4,y+3,-164,.17,.7,.17);}
   box('metal',-44,y+6,-160,.25,12,.25);box('white',-44,y+9,-160,2.2,.5,1.2);box('metal',-44,y+12,-160,3,.1,.1);
   for(const dx of [-1.4,1.4])add('round','white',-44+dx,y+12.2,-160,.5,.4,.5);
  }

 }
 // Fences and marshal huts sit beyond the existing collision barriers.
 for(let i=0;i<course.samples.length;i+=3){
  const a=course.point(i/256),b=course.point((i+1)/256),yaw=Math.atan2(b.x-a.x,b.z-a.z);
  for(const side of [-1,1]){const x=a.x+Math.cos(yaw)*side*21,z=a.z-Math.sin(yaw)*side*21;if(course.distance(x,z)<20.5)continue;const y=course.height(x,z);box('wood',x,y+.95,z,.14,1.9,.14,yaw);for(const h of [.6,1.4])box('metal',x,y+h,z,.05,.05,3.9,yaw);}
 }
 for(const t of [.12,.38,.64,.86]){const a=course.point(t),b=course.point(t+.001),yaw=Math.atan2(b.x-a.x,b.z-a.z),x=a.x+Math.cos(yaw)*29,z=a.z-Math.sin(yaw)*29;if(clear(x,z,2.5,'marshal')){const y=course.height(x,z);box('white',x,y+1.5,z,3,3,3,yaw);box('ochre',x,y+3.2,z,3.5,.4,3.5,yaw);box('glass',x,y+2,z+1.51,2,1,.1,yaw);}}

 const ownedGeometries:T.BufferGeometry[]=[],ownedMaterials:T.Material[]=[],textures:T.Texture[]=[];
 if(theme==='port'){
  const outline=new T.Shape();outline.moveTo(-68,-13);outline.lineTo(52,-13);outline.lineTo(74,0);outline.lineTo(52,13);outline.lineTo(-68,13);outline.closePath();
  const hullGeometry=new T.ExtrudeGeometry(outline,{depth:6,bevelEnabled:false,steps:1});hullGeometry.rotateX(-Math.PI/2);const hullMaterial=new T.MeshStandardMaterial({color:0x4d5555,roughness:.8,metalness:.25});const hull=new T.Mesh(hullGeometry,hullMaterial);hull.name=course.id+'_cargo_hull';hull.position.set(0,-.4,245);hull.castShadow=hull.receiveShadow=true;root.add(hull);ownedGeometries.push(hullGeometry);ownedMaterials.push(hullMaterial);
 }
 if(theme==='coast'||theme==='port'||theme==='reservoir'){
  const waterGeometry=new T.PlaneGeometry(theme==='reservoir'?620:2600,theme==='reservoir'?460:1600);waterGeometry.rotateX(-Math.PI/2);
  const waterMaterial=new T.MeshStandardMaterial({color:0x537f82,roughness:.38,metalness:.12});
  // Static world-space ripples remain stable in demo and driving cameras.
  waterMaterial.onBeforeCompile=shader=>{shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 coastPosition;').replace('#include <begin_vertex>','#include <begin_vertex>\ncoastPosition=(modelMatrix*vec4(position,1.0)).xyz;');shader.fragmentShader=shader.fragmentShader.replace('#include <common>','#include <common>\nvarying vec3 coastPosition;').replace('#include <color_fragment>',`#include <color_fragment>
float ripple=sin(coastPosition.x*.48+sin(coastPosition.z*.21)*2.0)*sin(coastPosition.z*1.8+coastPosition.x*.14);
diffuseColor.rgb*=.87+.13*ripple;
float foam=(1.0-smoothstep(183.0,209.0,coastPosition.z))*(.35+.65*pow(abs(sin(coastPosition.z*.7+sin(coastPosition.x*.07)*2.0)),8.0));
diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.73,.8,.74),foam*.65);`);};
  waterMaterial.customProgramCacheKey=()=> 'seabrook-water-v1';
  const sea=new T.Mesh(waterGeometry,waterMaterial);sea.name=course.id+'_sea';sea.position.set(0,theme==='reservoir'?-.22:-1.2,theme==='reservoir'?410:982);root.add(sea);ownedGeometries.push(waterGeometry);ownedMaterials.push(waterMaterial);
 }

 // A continuous low-cost landscape joins the exact edge height and rises beyond it.
 const horizon=new T.BufferGeometry(),positions:number[]=[],colorsOut:number[]=[],indices:number[]=[],segments=128,rings=9;
 for(let ring=0;ring<rings;ring++)for(let i=0;i<=segments;i++){
  const a=i/segments*Math.PI*2,dx=Math.cos(a),dz=Math.sin(a),edge=1/Math.max(Math.abs(dx)/220,Math.abs(dz)/180),r=edge+ring*56,x=dx*r,z=dz*r;
  const ridge=(theme==='pass'?60:theme==='ridge'?38:theme==='canyon'?48:theme==='dunes'?24:19)*(1+.35*Math.sin(a*5)+.2*Math.cos(a*9));
  let y=ring===0?course.height(x,z)-.12:course.height(dx*edge,dz*edge)+Math.sin(Math.min(1,ring/5)*Math.PI*.62)*ridge+(Math.sin(a*11+ring)*2);
  // Northern headland slopes into the sea; never close the coast with a mountain wall.
  if((theme==='coast'||theme==='port'||theme==='reservoir')&&z>170)y=Math.min(y,Math.max(-6,-.12-(z-180)*.18));
  positions.push(x,y,z);const color=new T.Color(p.hill).multiplyScalar(.86+.12*Math.sin(a*3+ring*.4));colorsOut.push(color.r,color.g,color.b);
  if(ring<rings-1&&i<segments){const n=ring*(segments+1)+i;indices.push(n,n+segments+1,n+1,n+1,n+segments+1,n+segments+2);}
 }
 horizon.setAttribute('position',new T.Float32BufferAttribute(positions,3));horizon.setAttribute('color',new T.Float32BufferAttribute(colorsOut,3));horizon.setIndex(indices);horizon.computeVertexNormals();const hm=new T.MeshStandardMaterial({vertexColors:true,roughness:1,side:T.DoubleSide}),hills=new T.Mesh(horizon,hm);hills.name=course.id+'_surrounding_landscape';const ridgeDetail=addCourseRockDetail(hm);hills.receiveShadow=true;root.add(hills);ownedGeometries.push(horizon);ownedMaterials.push(hm);
 if(typeof document!=='undefined'){
  // Reuse the licensed tree photographs already shipped with the quarry.
  // The vertex shader faces the camera without per-frame scene mutations.
  for(const [kind,aspect]of [['pine',461/1024],['spruce',402/1024],['maple',712/1024]]as const){
   const trees=treeCards.filter(t=>t.kind===kind);if(!trees.length)continue;
   const photo=new T.TextureLoader().load((import.meta.env?.BASE_URL??'./')+'models/'+kind+'.webp');photo.colorSpace=T.SRGBColorSpace;photo.anisotropy=8;textures.push(photo);
   const material=new T.MeshStandardMaterial({map:photo,alphaTest:.45,roughness:1,color:0xbac4b0,side:T.DoubleSide});
   material.onBeforeCompile=shader=>{
    shader.vertexShader=shader.vertexShader.replace('#include <project_vertex>',`
      vec3 center=(modelMatrix*instanceMatrix*vec4(0.0,0.0,0.0,1.0)).xyz;
      vec3 right=normalize(vec3(viewMatrix[0][0],0.0,viewMatrix[2][0]));
      vec3 billboard=center+right*position.x*length(instanceMatrix[0].xyz)+vec3(0.0,position.y*length(instanceMatrix[1].xyz),0.0);
      vec4 mvPosition=viewMatrix*vec4(billboard,1.0);gl_Position=projectionMatrix*mvPosition;
    `);
    shader.fragmentShader=shader.fragmentShader.replace('#include <normal_fragment_begin>',`#include <normal_fragment_begin>
normal=transformDirection(vec3(0.0,1.0,0.0),viewMatrix);nonPerturbedNormal=normal;`).replace('#include <lights_fragment_end>',`#include <lights_fragment_end>
reflectedLight.directDiffuse *= .5;reflectedLight.directSpecular *= .5;`);
   };
   material.customProgramCacheKey=()=> 'course-forest-canopy-v1';
   const geometry=new T.PlaneGeometry(aspect,1);geometry.translate(0,.5,0);ownedGeometries.push(geometry);ownedMaterials.push(material);
   const mesh=new T.InstancedMesh(geometry,material,trees.length);mesh.name=course.id+'_forest_'+kind;
   for(const [i,t]of trees.entries()){matrix.makeScale(t.size,t.size,t.size);matrix.setPosition(t.x,t.y,t.z);mesh.setMatrixAt(i,matrix);mesh.setColorAt(i,new T.Color().setScalar(.87+(i%7)*.025));}mesh.computeBoundingSphere();root.add(mesh);
  }
  const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=256;const ctx=canvas.getContext('2d');
  if(ctx){ctx.fillStyle='#ded5b9';ctx.fillRect(0,0,1024,256);ctx.fillStyle=p.accent;ctx.fillRect(0,0,1024,24);ctx.fillRect(0,225,1024,31);ctx.fillStyle='#27312e';ctx.font='900 52px sans-serif';ctx.textAlign='center';ctx.fillText(p.title,512,114,980);ctx.font='24px sans-serif';ctx.fillText(p.subtitle,512,171);for(let i=0;i<28;i++){ctx.globalAlpha=.08;ctx.fillRect(random()*1024,random()*256,1+random()*100,1+random()*5);}ctx.globalAlpha=1;
   const texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;textures.push(texture);const sm=new T.MeshStandardMaterial({map:texture,roughness:.9});ownedMaterials.push(sm);const sg=new T.PlaneGeometry(28,5.5);ownedGeometries.push(sg);
   const sign=new T.Mesh(sg,sm);sign.name=course.id+'_venue_sign';sign.position.set(0,11.2,course.point(0).z);sign.rotation.y=-Math.PI/2;sign.position.x=-.03;root.add(sign);const reverseSign=sign.clone();reverseSign.position.x=.03;reverseSign.rotation.y=Math.PI/2;root.add(reverseSign);
   const billboard=new T.Mesh(sg,sm);billboard.position.set(0,6,-173);root.add(billboard);for(const x of [-11,11])box('metal',x,3,-173,.25,6,.25);
  }
 }
 for(const [key,b]of batches){const mesh=new T.InstancedMesh(geometries[b.shape],materials[b.finish],b.matrices.length);b.matrices.forEach((m,i)=>{mesh.setMatrixAt(i,m);mesh.setColorAt(i,b.colors[i]);});mesh.name=course.id+'_dressing_'+key;mesh.castShadow=b.shape==='box'||b.finish==='bark';mesh.receiveShadow=true;mesh.computeBoundingSphere();root.add(mesh);}
 const fairWheel=theme==='fair'?createFairWheel():null,fairMidway=theme==='fair'?createMidway():null;if(fairWheel)root.add(fairWheel.root);if(fairMidway)root.add(fairMidway.root);
 root.userData.placements=placements;root.userData.theme=theme;
 let disposed=false;return{root,dispose(){if(disposed)return;disposed=true;fairMidway?.dispose();fairWheel?.dispose();stoneDetail.dispose();ridgeDetail.dispose();root.removeFromParent();root.traverse(o=>{if(o instanceof T.InstancedMesh)o.dispose();});Object.values(geometries).forEach(g=>g.dispose());Object.values(materials).forEach(m=>m.dispose());ownedGeometries.forEach(g=>g.dispose());ownedMaterials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());foliageTextures.forEach(t=>t.dispose());root.clear();}};
}
