import {addCourseRockDetail} from './course-materials';
import * as T from 'three';
import type {createCountyCourse} from './county-course';

type Course=ReturnType<typeof createCountyCourse>;
export type SceneryTheme='park'|'dunes'|'canal'|'pass'|'coast'|'forest';
type Shape='box'|'round'|'cone'|'rock'|'leaf';
type Finish='bark'|'leaf'|'pine'|'stone'|'sand'|'wood'|'metal'|'white'|'red'|'ochre'|'glass'|'rubber';
const palettes={
 coast:{ground:'#a19e75',patch:'#bcb48d',rock:0x938c79,leaf:0x69764b,pine:0x48614e,hill:0x7e886b,accent:'#377886',title:'SEABROOK COAST CIRCUIT',subtitle:'SEA AIR / BENT BODYWORK'},
 forest:{ground:'#596c48',patch:'#7b895d',rock:0x827b6b,leaf:0x536836,pine:0x3b5138,hill:0x51674b,accent:'#bd833a',title:'HAZELWOOD FOREST RALLY',subtitle:'LOGGING MILES / LOSING MIRRORS'},
 park:{ground:'#596847',patch:'#78805b',rock:0x858475,leaf:0x526337,pine:0x354b30,hill:0x546344,accent:'#bf4d30',title:'KINGSWELL MOTOR CLUB',subtitle:'PARK CIRCUIT / EST. 1978'},
 dunes:{ground:'#b59a67',patch:'#c9b17e',rock:0xaa9270,leaf:0x7b7950,pine:0x777449,hill:0xb09a72,accent:'#c46b27',title:'COPPERFIELD DIRT WEEKEND',subtitle:'DUNES RALLY / FULL CONTACT'},
 canal:{ground:'#647156',patch:'#859077',rock:0x8b877a,leaf:0x596e40,pine:0x3b5336,hill:0x596950,accent:'#376e80',title:'MILLBROOK LOCKSIDE',subtitle:'CANAL CIRCUIT / MOTOR FESTIVAL'},
 pass:{ground:'#6c7563',patch:'#89907a',rock:0x8b8b80,leaf:0x526545,pine:0x354b3b,hill:0x657262,accent:'#a85336',title:'GRANITE PASS RALLY',subtitle:'HIGH COUNTRY / MOTOR CLUB'},
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
export function createCourseScenery(course:Course,theme:SceneryTheme){
 const root=new T.Group();root.name=course.id+'_scenery';const p=palettes[theme];
 let seed=8713+theme.length*659;const random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
 const geometries:Record<Shape,T.BufferGeometry>={box:new T.BoxGeometry(1,1,1),round:new T.CylinderGeometry(.5,.5,1,8),cone:new T.ConeGeometry(.5,1,9),rock:new T.IcosahedronGeometry(.5,1),leaf:new T.IcosahedronGeometry(.5,2)};
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
  if(theme==='coast'&&z+r>172)return false;
  // Keep the canal's water, lock gates and towpath unobstructed.
  if(theme==='canal'&&Math.abs(x)<78+r&&z>-23-r&&z<15+r)return false;
  placements.push({x,z,radius:r,kind});return true;
 }
 function clearRectangle(x:number,z:number,w:number,d:number,kind:string){
  for(const dx of [-w/2,0,w/2])for(const dz of [-d/2,0,d/2])if(course.distance(x+dx,z+dz)<23)return false;
  placements.push({x,z,radius:0,kind,halfWidth:w/2,halfDepth:d/2});return true;
 }
 function scenicHeight(x:number,z:number){
  if(theme!=='coast'&&theme!=='forest')return course.height(x,z);
  if(Math.abs(x)<=220&&Math.abs(z)<=180)return course.height(x,z);
  const a=Math.atan2(z,x),dx=Math.cos(a),dz=Math.sin(a),edge=1/Math.max(Math.abs(dx)/220,Math.abs(dz)/180),ring=(Math.hypot(x,z)-edge)/56;
  const height=(r:number)=>{const zz=dz*(edge+r*56),ridge=19*(1+.35*Math.sin(a*5)+.2*Math.cos(a*9));let y=r===0?course.height(dx*edge,dz*edge)-.12:course.height(dx*edge,dz*edge)+Math.sin(Math.min(1,r/5)*Math.PI*.62)*ridge+Math.sin(a*11+r)*2;if(theme==='coast'&&zz>170)y=Math.min(y,Math.max(-6,-.12-(zz-180)*.18));return y;};
  return T.MathUtils.lerp(height(Math.floor(ring)),height(Math.ceil(ring)),ring%1)-.2;
 }
 function tree(x:number,z:number,size:number,pine:boolean){
  const r=size*(pine?.3:.48);if(!clear(x,z,r,'tree'))return;
  const y=scenicHeight(x,z),yaw=random()*6.28;
  if(typeof document!=='undefined'&&(theme==='coast'||theme==='forest'||course.distance(x,z)>40)){treeCards.push({x,y,z,size,kind:pine?(treeCards.length%2?'pine':'spruce'):'maple'});return;}
  add('round','bark',x,y+size*.36,z,.3+size*.04,size*.72,.3+size*.04);
  if(pine){for(let tier=0;tier<3;tier++)add('cone','pine',x,y+size*(.45+tier*.19),z,size*(.68-tier*.13),size*.52,size*(.68-tier*.13),yaw+tier);}
  else{for(let lobe=0;lobe<4;lobe++){const a=yaw+lobe*2.2,offset=lobe?size*.2:0;add('leaf',lobe%2?'leaf':'pine',x+Math.cos(a)*offset,y+size*(lobe?.72:.94),z+Math.sin(a)*offset,size*.67,size*(lobe?.61:.57),size*.6,a);}}
 }
 function rock(x:number,z:number,size:number){if(!clear(x,z,size*.75,'rock'))return;const y=scenicHeight(x,z);add('rock','stone',x,y+size*.27,z,size*1.4,size*.8,size,random()*6.28);if(size>5)add('rock','stone',x+size*.36,y+size*.12,z-size*.25,size*.8,size*.5,size*.9,random()*6.28);}
 // Naturally staggered clusters, with a clear paddock on the southern side.
 for(let i=0;i<(theme==='forest'?650:theme==='dunes'?180:240);i++){
  const x=(random()-.5)*420,z=-85+random()*257;
  if(theme==='dunes'){
   if(i%4===0)rock(x,z,1.5+random()*3.5);
   else if(clear(x,z,1.9,'scrub')){const y=course.height(x,z);add('leaf','leaf',x,y+.55,z,2.5,.9,2,random()*6.28);add('round','bark',x,y+.3,z,.13,.6,.13);}
  }else if(theme==='coast'&&i%3===0)rock(x,z,2+random()*5);
  else if(theme==='pass'&&i%4===0)rock(x,z,3+random()*9);
  else tree(x,z,theme==='pass'?10+random()*9:7+random()*8,theme==='pass'||(theme==='forest'?i%4!==0:i%7===0));
 }
 // Distant tree lines hide the rectangular terrain edge, with no physics cost.
 for(let i=0;i<130;i++){const a=i/130*Math.PI*2,x=Math.cos(a)*(242+random()*80),z=Math.sin(a)*(210+random()*70);if(theme==='dunes'){if(i%3===0)rock(x,z,6+random()*10);}else tree(x,z,11+random()*11,theme==='pass'||theme==='forest');}

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
 if(theme==='park'){
  building(38,-158,55,17,6,'white');stand(-85,-155);canopy(-30,-157,'red');canopy(-12,-157,'ochre');serviceTruck(99,-157,'red');
 }else if(theme==='dunes'){
  building(70,-158,34,14,4.5,'wood');stand(-95,-155);for(const x of [-40,-20,0])canopy(x,-156,x===-20?'red':'ochre');serviceTruck(110,-157,'ochre');
  // Open-pit machinery beyond the eastern perimeter.
  const x=243,z=-48,y=course.height(x,z);box('rubber',x,y+.7,z,9,1.4,5);box('ochre',x,y+2,z,7,2,4);box('glass',x-2,y+3.7,z,2.8,2.4,3);box('ochre',x+4,y+5,z,1,7,1);box('metal',x+8,y+8,z,9,.8,1.3);box('rubber',x+12,y+5,z,1,5,1);box('ochre',x+12,y+2,z,3,2,4);
 }else if(theme==='canal'){
  building(-77,-158,48,16,7,'red');building(65,-158,48,16,6,'red');stand(-10,-155);canopy(22,-157,'ochre');serviceTruck(112,-157,'white');
  // Quayside cranes, bollards, warehouse tanks and a towpath footbridge.
  for(const x of [-56,58]){box('metal',x,6,-19,.55,12,.55);box('ochre',x+6,11.6,-19,13,.6,.7);box('metal',x+11.5,8,-19,.1,7,.1);}
  for(let x=-60;x<=60;x+=12)for(const z of [-17,7])add('round','metal',x,1.1,z,.45,.85,.45);
  box('wood',-18,3.8,-5,4,.5,26);for(const x of [-20, -16]){box('metal',x,4.8,-5,.13,.13,26);for(let z=-18;z<=8;z+=3)box('metal',x,4.3,z,.12,1,.12);}
  for(const x of [-105,105]){add('round','white',x,4.5,-50,10,9,10);add('cone','metal',x,9.3,-50,10,1.6,10);}
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
 }else{
  building(65,-158,38,16,5,'wood');stand(-88,-155);canopy(-28,-157,'red');canopy(-8,-157,'white');serviceTruck(112,-157,'red');
  for(const x of [-241,245])for(const z of [-60,35,125])rock(x,z,18+random()*17);
 }
 // Fences and marshal huts sit beyond the existing collision barriers.
 for(let i=0;i<course.samples.length;i+=3){
  const a=course.point(i/256),b=course.point((i+1)/256),yaw=Math.atan2(b.x-a.x,b.z-a.z);
  for(const side of [-1,1]){const x=a.x+Math.cos(yaw)*side*21,z=a.z-Math.sin(yaw)*side*21;if(course.distance(x,z)<20.5)continue;const y=course.height(x,z);box('wood',x,y+.95,z,.14,1.9,.14,yaw);for(const h of [.6,1.4])box('metal',x,y+h,z,.05,.05,3.9,yaw);}
 }
 for(const t of [.12,.38,.64,.86]){const a=course.point(t),b=course.point(t+.001),yaw=Math.atan2(b.x-a.x,b.z-a.z),x=a.x+Math.cos(yaw)*29,z=a.z-Math.sin(yaw)*29;if(clear(x,z,2.5,'marshal')){const y=course.height(x,z);box('white',x,y+1.5,z,3,3,3,yaw);box('ochre',x,y+3.2,z,3.5,.4,3.5,yaw);box('glass',x,y+2,z+1.51,2,1,.1,yaw);}}

 const ownedGeometries:T.BufferGeometry[]=[],ownedMaterials:T.Material[]=[],textures:T.Texture[]=[];
 if(theme==='coast'){
  const waterGeometry=new T.PlaneGeometry(2600,1600);waterGeometry.rotateX(-Math.PI/2);
  const waterMaterial=new T.MeshStandardMaterial({color:0x537f82,roughness:.38,metalness:.12});
  // Static world-space ripples remain stable in demo and driving cameras.
  waterMaterial.onBeforeCompile=shader=>{shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 coastPosition;').replace('#include <begin_vertex>','#include <begin_vertex>\ncoastPosition=(modelMatrix*vec4(position,1.0)).xyz;');shader.fragmentShader=shader.fragmentShader.replace('#include <common>','#include <common>\nvarying vec3 coastPosition;').replace('#include <color_fragment>',`#include <color_fragment>
float ripple=sin(coastPosition.x*.48+sin(coastPosition.z*.21)*2.0)*sin(coastPosition.z*1.8+coastPosition.x*.14);
diffuseColor.rgb*=.87+.13*ripple;
float foam=(1.0-smoothstep(183.0,209.0,coastPosition.z))*(.35+.65*pow(abs(sin(coastPosition.z*.7+sin(coastPosition.x*.07)*2.0)),8.0));
diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.73,.8,.74),foam*.65);`);};
  waterMaterial.customProgramCacheKey=()=> 'seabrook-water-v1';
  const sea=new T.Mesh(waterGeometry,waterMaterial);sea.name=course.id+'_sea';sea.position.set(0,-1.2,982);root.add(sea);ownedGeometries.push(waterGeometry);ownedMaterials.push(waterMaterial);
 }

 // A continuous low-cost landscape joins the exact edge height and rises beyond it.
 const horizon=new T.BufferGeometry(),positions:number[]=[],colorsOut:number[]=[],indices:number[]=[],segments=128,rings=9;
 for(let ring=0;ring<rings;ring++)for(let i=0;i<=segments;i++){
  const a=i/segments*Math.PI*2,dx=Math.cos(a),dz=Math.sin(a),edge=1/Math.max(Math.abs(dx)/220,Math.abs(dz)/180),r=edge+ring*56,x=dx*r,z=dz*r;
  const ridge=(theme==='pass'?60:theme==='dunes'?24:19)*(1+.35*Math.sin(a*5)+.2*Math.cos(a*9));
  let y=ring===0?course.height(x,z)-.12:course.height(dx*edge,dz*edge)+Math.sin(Math.min(1,ring/5)*Math.PI*.62)*ridge+(Math.sin(a*11+ring)*2);
  // Northern headland slopes into the sea; never close the coast with a mountain wall.
  if(theme==='coast'&&z>170)y=Math.min(y,Math.max(-6,-.12-(z-180)*.18));
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
 root.userData.placements=placements;root.userData.theme=theme;
 let disposed=false;return{root,dispose(){if(disposed)return;disposed=true;stoneDetail.dispose();ridgeDetail.dispose();root.removeFromParent();root.traverse(o=>{if(o instanceof T.InstancedMesh)o.dispose();});Object.values(geometries).forEach(g=>g.dispose());Object.values(materials).forEach(m=>m.dispose());ownedGeometries.forEach(g=>g.dispose());ownedMaterials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());foliageTextures.forEach(t=>t.dispose());root.clear();}};
}
