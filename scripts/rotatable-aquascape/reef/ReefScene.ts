import {finishRockMaterial} from './ReefRockMaterial.ts';
import {reefFlankShelves} from './ReefFlankShelves.ts';
import * as T from 'three';
import {reefButtresses} from './ReefButtress.ts';
import {plateSurfaceMaps,finishPlateMaterial} from './PlateSurface.ts';
import {encrustingSurfaceMaps} from './EncrustingSurface.ts';
import {surfaceColony} from './SurfaceColony.ts';
import {coralCrust} from './CoralCrust.ts';
import {erodedRock} from './ReefRock.ts';
import {sandHeight,sandBank} from './ReefOptics.ts';
import {coralSurfaceMaps} from './CoralSurface.ts';
import {topSurfaceSampler} from './RockSurface.ts';
import {encrustingGarden,animatePolypMaterial} from './EncrustingPolyps.ts';
import {buildAnemones} from './Anemones.ts';
import {limestoneMaps,encrustRock} from './ReefMaterials.ts';
import {branchingColony,platingColony,plateCollisionVolumes} from './CoralMorphology.ts';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';

export type Obstacle={center:T.Vector3;radius:number};
export const reefClock={value:0};
export function seeded(seed:number){return ()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return ((t^t>>>14)>>>0)/4294967296;};}
const random=seeded(81412),pick=(a:number,b:number)=>a+(b-a)*random();
function texture(kind:'rock'|'sand'|'coral'){
 const c=document.createElement('canvas');c.width=c.height=512;const ctx=c.getContext('2d')!,im=ctx.createImageData(512,512);
 for(let y=0;y<512;y++)for(let x=0;x<512;x++){
  const i=(y*512+x)*4,n=random(),large=Math.sin(x*.027+Math.sin(y*.042))*Math.sin(y*.024),grain=n*.25;
  const base=kind==='sand'?[.88,.87,.80]:kind==='rock'?[.58,.54,.46]:[.96,.94,.92];
  const factor=kind==='rock'?.58+large*.3+grain:kind==='sand'?.78+grain:.72+grain;
  for(let k=0;k<3;k++)im.data[i+k]=255*base[k]*factor;im.data[i+3]=255;
 }
 ctx.putImageData(im,0,0);
 if(kind==='sand'){
  // Independent stream: detailing sand must not reshuffle reef inhabitants.
  const grainRandom=seeded(2309230740),palette=['#e5dfc9','#bcb5a2','#d1cbb4','#f0e9d4','#a39d89'];
  for(let i=0;i<14500;i++){
   const x=grainRandom()*512,y=grainRandom()*512,r=.55+grainRandom()*1.7,aspect=.45+grainRandom()*.5,angle=grainRandom()*6.28;
   ctx.fillStyle=palette[Math.floor(grainRandom()*palette.length)];
   // Wrapped edge grains make the existing repeated map seamless.
   for(const dx of x<3?[0,512]:x>509?[0,-512]:[0])for(const dy of y<3?[0,512]:y>509?[0,-512]:[0]){
    ctx.beginPath();ctx.ellipse(x+dx,y+dy,r,r*aspect,angle,0,6.28);ctx.fill();
   }
  }
 }
 if(kind==='rock')for(let i=0;i<4100;i++){const x=random()*512,y=random()*512,r=pick(.4,5);ctx.fillStyle=i%3===0?'#634d6680':i%3===1?'#252d25a0':'#99916b60';ctx.beginPath();ctx.ellipse(x,y,r,r*.6,random()*6.28,0,6.28);ctx.fill();}
 if(kind==='coral')for(let i=0;i<2500;i++){
  const x=random()*512,y=random()*512,r=pick(.6,1.9);ctx.strokeStyle='#938d7a';ctx.lineWidth=pick(.35,.7);ctx.beginPath();ctx.ellipse(x,y,r,r*pick(.65,1),random()*6.28,0,6.28);ctx.stroke();
  ctx.fillStyle='#e9e2cb';ctx.beginPath();ctx.arc(x-r*.35,y-r*.7,r*.4,0,6.28);ctx.fill();
 }
 const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;t.wrapS=t.wrapT=T.RepeatWrapping;t.anisotropy=8;return t;
}
function batch(geometries:T.BufferGeometry[],material:T.Material,parent:T.Group,name:string){
 if(!geometries.length)return;const geometry=mergeGeometries(geometries,false);geometries.forEach(g=>g.dispose());const mesh=new T.Mesh(geometry,material);mesh.name=name;mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;
}
export function buildReef(scene:T.Scene){
 const group=new T.Group();scene.add(group);const obstacles:Obstacle[]=[],notes:T.Object3D[]=[];
 const rockMaps=limestoneMaps(),coralMaps=coralSurfaceMaps(),crustMaps=encrustingSurfaceMaps(),plateMaps=plateSurfaceMaps(),sandTex=texture('sand'),coralTex=texture('coral');sandTex.repeat.set(7,4);
 const rockMat=finishRockMaterial(new T.MeshStandardMaterial({...rockMaps.maps,normalScale:new T.Vector2(1.1,1.1),roughness:.96,vertexColors:true}));
 const coralMat=new T.MeshStandardMaterial({...coralMaps.maps,normalScale:new T.Vector2(.9,.9),roughness:.9,vertexColors:true});
 const rocks:T.BufferGeometry[]=[],corals:T.BufferGeometry[]=[],massiveCorals:T.BufferGeometry[]=[],plates:T.BufferGeometry[]=[];
 const addNote=(mesh:T.Object3D,title:string,description:string)=>{mesh.userData.note={title,description};notes.push(mesh);};
 const rock=(x:number,y:number,z:number,sx:number,sy:number,sz:number,rng:()=>number=random,ground=false)=>{
  const geo=erodedRock(x,y,z,sx,sy,sz,rng);
  if(ground){geo.computeBoundingBox();const sink=Math.min(0,sandHeight(x,z)-.025-geo.boundingBox!.min.y);geo.translate(0,sink,0);y+=sink;}
  const surface=encrustRock(geo);rocks.push(surface);
  // Conservative cluster of collision volumes follows the irregular rock rather than one island-sized ball.
  const r=Math.min(sx,sy,sz)*1.16;obstacles.push({center:new T.Vector3(x,y,z),radius:r});
  for(const [axis,size] of [[0,sx],[1,sy],[2,sz]] as const)if(size>r*1.2)for(const sign of [-1,1]){const center=new T.Vector3(x,y,z);center.setComponent(axis,center.getComponent(axis)+sign*(size-r)*.85);obstacles.push({center,radius:r});}
 };
 // Two porous islands, with deliberately open caves and a winding channel.
 const formations=[[-3.6,.63,.15,.91,.55,.93],[-2.45,.55,-.6,.87,.48,.9],[-3.85,1.27,-.45,.64,.78,.72],[-2.05,1.13,-.6,.62,.75,.72],[-2.97,1.92,-.5,1.13,.57,.76],[-2.9,2.45,-.73,.82,.62,.76],[-3.1,2.91,-.95,.6,.56,.57],[-3.9,.5,1.38,.72,.39,.58],[-2.42,.51,1.45,.68,.4,.6],[-1.81,.35,-1.38,.65,.26,.52],
 [1.25,.66,-.42,.81,.59,.83],[3.35,.64,-.05,1,.6,.91],[3.25,1.4,-.72,.77,.82,.84],[1.01,1.45,-.75,.68,.78,.78],[1.68,2.35,-.81,1.12,.7,.8],[2.05,3.01,-.91,.83,.67,.74],[1.64,3.44,-1.02,.63,.49,.62],[3.4,2.11,-.82,.74,.58,.72],[3.98,.91,.65,.57,.67,.74],[2.25,.58,1.36,.88,.48,.6],[3.74,.5,1.52,.67,.42,.63],[.66,.36,1.42,.58,.22,.55],[3.99,2.09,-1.31,.56,.72,.53]];
 for(const a of formations)rock(...a as [number,number,number,number,number,number]);
 // A staggered rear ridge rises behind the open foreground sand channel. Taller
 // crowns overlap its shoulders, creating depth without a flat scenery card.
 // Its own random stream
 // keeps all established foreground anatomy and motion seeds unchanged.
 const rearRandom=seeded(230926);
 for(const a of [[-1.03,.43,-1.64,.55,.30,.36],[-.46,.38,-1.65,.43,.25,.34],[-.91,.91,-1.66,.38,.47,.32],[.19,.35,-1.72,.41,.22,.31],[.36,.81,-1.69,.29,.47,.32],[-1.00,1.35,-1.71,.34,.25,.28],[.29,1.24,-1.69,.34,.23,.29]])rock(...a as [number,number,number,number,number,number],rearRandom);
 // Temporary per-rock bounds keep attachment raycasts local; these are never rendered.
 const toeRandom=seeded(2309231712);
 // Broken live-rock fragments feather the island feet into the sand. Their
 // separate stream does not reshuffle existing colonies or animal animations.
 for(const a of [[-4.48,.38,-.35,.25,.24,.32],[-4.38,.28,1.72,.25,.16,.30],[-3.24,.3,1.96,.29,.16,.19],[-1.63,.29,.96,.32,.14,.27],[.28,.26,-1.9,.3,.12,.22],[1.21,.31,1.79,.26,.17,.2],[3.07,.31,1.82,.28,.17,.23],[4.32,.32,1.49,.24,.18,.26],[4.23,.5,-1.67,.37,.3,.28]])rock(...a as [number,number,number,number,number,number],toeRandom,true);
 const supports=rocks.map(g=>{g.computeBoundingSphere();g.computeBoundingBox();return new T.Mesh(g,rockMat);}),attachRay=new T.Raycaster();
 const surfaceLookup=topSurfaceSampler(supports.map(s=>s.geometry));
 // Small irregular colonies follow front-facing rock relief. No new draw group.
 const crustStats={colonies:0,triangles:0,emergentColonies:0,emergentTriangles:0,understoryColonies:0,understoryTriangles:0,mantleColonies:0,mantleTriangles:0},crustSurfaces:T.BufferGeometry[]=[],livingCrustZones:Obstacle[]=[];
 for(const [rockIndex,dx,dy,r,hue] of [[4,-.18,.02,.7,.12],[5,.18,.07,.56,.055],[2,-.08,-.09,.46,.8],[8,.04,.02,.43,.08],[14,-.18,.05,.66,.1],[15,.12,.06,.5,.82],[12,.18,.12,.61,.045],[17,.06,.04,.43,.22],[19,.04,.08,.49,.095],[20,.09,.04,.37,.83]]){
  const f=formations[rockIndex];attachRay.set(new T.Vector3(f[0]+dx,f[1]+dy,3),new T.Vector3(0,0,-1));attachRay.far=6;
  const hit=attachRay.intersectObject(supports[rockIndex],false)[0];if(!hit?.face)continue;
  const crust=coralCrust(supports[rockIndex].geometry,hit.point,hit.face.normal,r,hue,rockIndex*1.73);if(crust.index!.count){massiveCorals.push(crust);crustSurfaces.push(crust);crustStats.colonies++;crustStats.triangles+=crust.index!.count/3;livingCrustZones.push({center:hit.point.clone(),radius:r*.85});}
 }
 // Scattered thin encrusting colonies grow directly on exposed stone. An
 // independent random stream leaves every established organism/placement intact.
 const crustRandom=seeded(23092306),crustPalette=['#794365','#9e6f83','#77785e','#897b49','#536f69'];
 for(let rockIndex=0;rockIndex<supports.length;rockIndex++){
  const support=supports[rockIndex],box=support.geometry.boundingBox!,center=box.getCenter(new T.Vector3()),extent=box.getSize(new T.Vector3());
  for(let patch=0;patch<3;patch++){
   const x=center.x+(crustRandom()-.5)*extent.x*.78,y=center.y+(crustRandom()-.5)*extent.y*.8;
   attachRay.set(new T.Vector3(x,y,3),new T.Vector3(0,0,-1));attachRay.far=6;
   const hit=attachRay.intersectObjects(supports,false)[0];
   if(!hit?.face||hit.object!==support)continue;
   const radius=.075+crustRandom()*.13,color=new T.Color(crustPalette[Math.floor(crustRandom()*crustPalette.length)]).multiplyScalar(.48);
   const tissue=coralCrust(support.geometry,hit.point,hit.face.normal,radius,.8,rockIndex*9.13+patch*3.4,{color,thickness:.005});
   if(tissue.index!.count){corals.push(tissue);crustSurfaces.push(tissue);crustStats.colonies++;crustStats.triangles+=tissue.index!.count/3;}
  }
 }
 const rockMesh=batch(rocks,rockMat,group,'Porous living reef rock')!;addNote(rockMesh,'The architecture of a reef','Open caves and water-filled spaces give fish shelter and routes between the reef islands. The rock carries irregular patches of coralline algae. Drag to look through the arches.');
 const rockGeometry=rockMesh.geometry,rockStats={triangles:rockGeometry.index!.count/3,bufferBytes:Object.values(rockGeometry.attributes).reduce((n,a)=>n+a.array.byteLength,0)+rockGeometry.index!.array.byteLength,expandedBufferBytes:rockGeometry.index!.count*11*4};
 const rockObstacleCount=obstacles.length;
 const branch=(x:number,y:number,z:number,size:number,hue:number,rng:()=>number=random)=>{
  const base=new T.Vector3(x,y,z);attachRay.set(new T.Vector3(x,y+.32,z),new T.Vector3(0,-1,0));attachRay.far=.95;
  const support=attachRay.intersectObjects(supports,false)[0];if(support)base.y=support.point.y-.012*size;
  const colony=branchingColony(base,size,hue,rng,(px,pz)=>surfaceLookup(px,base.y+.28*size,pz)?.point.y??null,hue>.9?'antler':hue>.7?'canopy':'bushy',support?.face?coralCrust((support.object as T.Mesh).geometry,support.point,support.face.normal,(size>=.6?.36:.23)*size,hue,hue*17+size,{color:new T.Color().setHSL(hue,.52,.29).multiplyScalar(size>=.6?.55:1),thickness:.006*size}):undefined),center=base.clone().add(new T.Vector3(0,size*.47,0));let radiusSquared=0;
  for(const geometry of colony){const p=geometry.getAttribute('position');for(let i=0;i<p.count;i++)radiusSquared=Math.max(radiusSquared,(p.getX(i)-center.x)**2+(p.getY(i)-center.y)**2+(p.getZ(i)-center.z)**2);}
  corals.push(...colony);obstacles.push({center,radius:Math.sqrt(radiusSquared)+.015});
 };
 for(const b of [[-3.12,3.24,-.95,1,.94],[-3.92,2.55,-.6,.8,.025],[-2.37,2.83,-.7,.72,.22],[-3.45,2.83,-.25,.82,.81],[-1.94,1.61,-.63,.63,.47],[-3.89,1.23,1.06,.5,.2],[-2.11,.63,1.61,.51,.025],[-4.27,.72,.56,.63,.28],[-1.48,.57,-1.46,.55,.8],
 [1.69,3.76,-1.06,1.07,.84],[2.3,3.41,-.74,.95,.96],[1.02,3.22,-.5,.83,.23],[2.87,2.7,-.81,.82,.075],[3.69,2.43,-1.1,.94,.81],[4.03,1.63,-.38,.8,.03],[4.15,1.5,.1,.6,.23],[1.1,1.13,.5,.52,.92],[.64,.55,1.58,.55,.025],[1.58,.87,1.47,.44,.21],[4.21,.65,1.50,.39,.82]])branch(...b as [number,number,number,number,number]);
 // These are full volumetric colonies, not distant cards; they share the same
 // indexed detail and merged material as the main islands.
 for(const b of [[-1.00,1.64,-1.71,1.02,.82],[.28,1.51,-1.69,.90,.23],[-.32,.57,-1.59,.53,.96]])branch(...b as [number,number,number,number,number],rearRandom);
 // Asymmetric shoulder colonies interrupt the bare rear pillars. Their feet
 // follow the real stone; existing navigation includes the entire grown volume.
 for(const [rockIndex,x,y,size,hue,seed] of [[25,-1.00,.96,.59,.79,4101],[27,.34,.84,.53,.94,4102]]){
  const support=supports[rockIndex];attachRay.set(new T.Vector3(x,y,0),new T.Vector3(0,0,-1));attachRay.far=2.3;
  const hit=attachRay.intersectObject(support,false)[0];if(!hit?.face)continue;
  const colony=surfaceColony(support,hit.point,hit.face.normal,size,hue,seeded(seed));
  corals.push(...colony.geometries);obstacles.push(colony.obstacle);
 }
 const plate=(x:number,y:number,z:number,r:number)=>{
  const geometry=platingColony(x,y,z,r,random()*Math.PI*2);plates.push(geometry);
  obstacles.push(...plateCollisionVolumes(geometry));
 };
 plate(-3,1.98,.43,1.08);plate(-2.77,1.77,.62,.8);plate(2.4,2.52,.1,1.05);plate(1.62,2.4,-.07,.65);plate(1.26,.81,.95,.68);
 // Smaller colonies occupy exposed shoulders between the main crowns. Their
 // own stream preserves existing coral, anemone, garden and rubble placement.
 const infillStats={colonies:0,triangles:0,placements:[] as number[][]};
 const occupied=obstacles.slice(rockObstacleCount);
 // These inspected anchor sites have stable independent shape seeds; rejected
 // placement trials are not regenerated on each page load.
 for(const [seed,x,y,size,hue] of [[1,-2.3293738395249055,2.4894741716151554,.47,.035],[5,-2.48,.88,.48,.22],[8,-2.08,1.05,.36,.03],[9,-3.42,1.22,.33,.14],[11,-3.86002344463442,1.5607145878049533,.34,.23],[14,1.474970675119953,3.5631057078247537,.43,.14],[19,4.3623875879720995,1.6737468652770737,.48,.14],[22,1.29,1.24,.4,.025],[23,1.05,1.65,.35,.23],[27,2.274984466846001,3.3617742425195716,.31,.23],[28,3.9286545634283656,2.4476474502760235,.37,.025]]){
  // Erosion can turn a former shoulder into a cavity. Reattach a displaced
  // colony to a nearby clear shoulder instead of silently deleting its detail.
  for(let attempt=0;attempt<33;attempt++){
  const reach=attempt===0?0:.07*Math.ceil(attempt/8),angle=(attempt-1)*Math.PI/4+seed*.37;
  const px=x+Math.cos(angle)*reach,py=y+Math.sin(angle)*reach;
  const infillRandom=seeded(23092307+seed);
  attachRay.set(new T.Vector3(px,py,3),new T.Vector3(0,0,-1));attachRay.far=5.1;
  const hit=attachRay.intersectObjects(supports,false)[0];if(!hit?.face||hit.face.normal.z<.12)continue;
  if(livingCrustZones.some(zone=>hit.point.distanceTo(zone.center)<zone.radius))continue;
  const normal=hit.face.normal.clone().normalize();
  if(normal.y<-.45)continue;
  const colony=surfaceColony(hit.object as T.Mesh,hit.point,normal,size,hue,infillRandom),o=colony.obstacle;
  // Keep established shelves/crowns and soft host tentacles readable.
  const blocked=occupied.some(other=>o.center.distanceTo(other.center)<other.radius*.52+o.radius*.55)||
   o.center.distanceTo(new T.Vector3(3.05,1.5,.82))<.92+o.radius||o.center.distanceTo(new T.Vector3(-3.62,1.0,1.35))<.73+o.radius;
  if(blocked){colony.geometries.forEach(g=>g.dispose());continue;}
  corals.push(...colony.geometries);obstacles.push(o);occupied.push(o);infillStats.colonies++;infillStats.triangles+=colony.triangles;infillStats.placements.push([seed,px,py,size,hue]);break;
  }
 }
 // Small upward/outward fingers grow from selected living crusts. Using the
 // crust itself as support keeps their feet on the tissue rather than buried
 // in the supporting rock. Independent seeds preserve all existing placement.
 for(const [index,x,y,size,hue] of [[1,-2.72,2.52,.40,.055],[5,2.17,3.07,.44,.82],[7,3.46,2.15,.36,.22]]){
  const tissue=massiveCorals[index];if(!tissue)continue;
  const support=new T.Mesh(tissue,rockMat);attachRay.set(new T.Vector3(x,y,3),new T.Vector3(0,0,-1));attachRay.far=5.1;
  const hit=attachRay.intersectObject(support,false)[0];if(!hit?.face)continue;
  const colony=surfaceColony(support,hit.point,hit.face.normal,size,hue,seeded(23092340+index));
  corals.push(...colony.geometries);obstacles.push(colony.obstacle);crustStats.emergentColonies++;crustStats.emergentTriangles+=colony.triangles;
 }
 // A second scale of growth occupies flanks, ledges and lower shoulders.
 // Each colony has real branch/corallite anatomy and a ray-attached basal crust.
 // Interleaved colors and heights leave the arches and central channel open.
 const understorySites=[[-4.12,1.05,.32,.81],[-4.01,1.78,.35,.14],[-3.70,2.12,.36,.92],[-3.31,1.46,.28,.23],[-2.66,2.68,.32,.035],[-2.39,1.36,.28,.81],[-1.84,.70,.30,.14],[-2.02,1.93,.32,.94],[-3.11,.83,.31,.025],[-3.90,.44,.24,.22],[-2.65,.46,.25,.92],[-4.40,.39,.26,.025],
 [1.08,.79,.29,.22],[1.06,1.93,.33,.81],[1.39,2.72,.32,.035],[2.36,3.28,.34,.23],[2.73,2.15,.30,.92],[3.40,1.80,.34,.14],[3.89,1.23,.33,.81],[4.12,.69,.27,.22],[2.59,.90,.31,.035],[2.17,1.51,.30,.81],[3.70,.45,.25,.025],[4.05,2.37,.31,.14],[-.89,.72,.29,.23],[.29,.71,.28,.94],[-.70,1.15,.33,.035],[.37,1.10,.29,.81]];
 const newGrowth:Obstacle[]=[];
 for(let index=0;index<understorySites.length;index++){
  const [x,y,size,hue]=understorySites[index];
  attachRay.set(new T.Vector3(x,y,3),new T.Vector3(0,0,-1));attachRay.far=5.2;
  const hit=attachRay.intersectObjects(supports,false)[0];if(!hit?.face||hit.face.normal.y<-.65||hit.face.normal.z<.08)continue;
  if(hit.point.distanceTo(new T.Vector3(3.05,1.35,.82))<.72||hit.point.distanceTo(new T.Vector3(-3.62,.91,1.35))<.57)continue;
  const colony=surfaceColony(hit.object as T.Mesh,hit.point,hit.face.normal,size,hue,seeded(2309231800+index));
  // Fine branches may interleave; prevent whole colonies sharing one center.
  if(newGrowth.some(o=>o.center.distanceTo(colony.obstacle.center)<(o.radius+colony.obstacle.radius)*.63)){colony.geometries.forEach(g=>g.dispose());continue;}
  corals.push(...colony.geometries);obstacles.push(colony.obstacle);newGrowth.push(colony.obstacle);
  crustStats.understoryColonies++;crustStats.understoryTriangles+=colony.triangles;
 }
 // Low living mantles occupy exposed faces beneath the branching canopy.
 // Each is clipped to its supporting stone, preserving cavities and existing
 // colonies. Own seeds and late insertion keep established scenery intact.
 const mantleSurfaces:T.BufferGeometry[]=[];
 const mantlePalette=['#a481a1','#9c9568','#67877e','#ab826b'];
 const mantleSites=[[-3.86,1.55,.46],[-2.13,1.37,.44],[-3.17,2.94,.38],[-3.32,2.19,.36],[-3.63,.53,.42],[-2.73,.56,.33],[-2.55,1.06,.32],[-4.02,.71,.35],
 [1.06,1.72,.45],[1.06,.56,.35],[2.90,.71,.42],[3.42,1.21,.48],[3.63,2.28,.41],[1.88,3.31,.37],[3.93,1.52,.39],[2.75,2.61,.38]];
 for(let i=0;i<mantleSites.length;i++){
  const [x,y,radius]=mantleSites[i];attachRay.set(new T.Vector3(x,y,3),new T.Vector3(0,0,-1));attachRay.far=5.2;
  const hit=attachRay.intersectObjects(supports,false)[0];if(!hit?.face||hit.face.normal.z<.18)continue;
  // Leave the established thick tissue and animal-host faces exposed.
  if(livingCrustZones.some(o=>hit.point.distanceTo(o.center)<o.radius*.7))continue;
  if(hit.point.distanceTo(new T.Vector3(3.05,1.35,.82))<.8||hit.point.distanceTo(new T.Vector3(-3.62,.91,1.35))<.65)continue;
  const mantle=coralCrust((hit.object as T.Mesh).geometry,hit.point,hit.face.normal,radius,.8,2309231804+i*3.71,{color:new T.Color(mantlePalette[i%mantlePalette.length]),thickness:.014,lobed:true});
  if(!mantle.index!.count){mantle.dispose();continue;}
  massiveCorals.push(mantle);mantleSurfaces.push(mantle);crustStats.colonies++;crustStats.triangles+=mantle.index!.count/3;crustStats.mantleColonies++;crustStats.mantleTriangles+=mantle.index!.count/3;
  mantle.computeBoundingSphere();obstacles.push({center:mantle.boundingSphere!.center.clone(),radius:mantle.boundingSphere!.radius+.004});
 }
 const flankShelves=reefFlankShelves(supports);plates.push(...flankShelves.geometries);obstacles.push(...flankShelves.obstacles);
 coralMat.side=T.DoubleSide;const hard=batch(corals,coralMat,group,'Branching and plating corals')!;addNote(hard,'A city built by tiny animals','Stony corals are colonies of polyps supported by a hard skeleton. Branching colonies and ruffled plates add different shapes and shelter. Their skeletons do not bend in the current. This scene is an artistic reef study, not a stocking plan.');
 const plateMaterial=finishPlateMaterial(new T.MeshStandardMaterial({...plateMaps.maps,normalScale:new T.Vector2(1.05,1.05),roughness:.88,vertexColors:true,side:T.DoubleSide}));
 const shelves=batch(plates,plateMaterial,group,'Layered plate coral tissue')!;addNote(shelves,'Growing toward the light','Thin folded shelves carry small coral cups among irregular skeletal ridges. The pale growing margin remains finer and smoother. This is a Montipora-inspired artistic study, not an exact species reconstruction.');
 const crustMaterial=new T.MeshStandardMaterial({...crustMaps.maps,normalScale:new T.Vector2(1.15,1.15),roughness:.92,vertexColors:true,side:T.DoubleSide});
 const massive=batch(massiveCorals,crustMaterial,group,'Ridged encrusting colonies')!;addNote(massive,'A living surface','Closely packed coral cups have recessed centers and fine radial ridges. This tissue follows the supporting rock, while its hard skeleton remains still in the current. An artistic anatomical study.');
 const hosts=[new T.Vector3(3.05,1.21,.82),new T.Vector3(-3.62,.78,1.35)];
 const anemone=buildAnemones(hosts,reefClock,random,center=>{attachRay.set(center.clone().add(new T.Vector3(0,.08,0)),new T.Vector3(0,-1,0));attachRay.far=1.5;return attachRay.intersectObjects(supports,false)[0]?.point.y??center.y-.35;});group.add(anemone.mesh);
 group.add(anemone.behavior.morsels);
 addNote(anemone.mesh,'Shelter in the tentacles','Bubble-tip anemones can have both long and swollen, blunt-ended tentacles. The foot anchors inside the reef. Current bends the canopy; food contact causes nearby tentacles to shorten and the oral disc to fold. Watch sinking morsels during feeding. Food transfer is accelerated for observation; this is an artistic study, not a biological clock or stocking guide.');

 const crustSurface=topSurfaceSampler(crustSurfaces),mantleSurface=topSurfaceSampler(mantleSurfaces);
 const gardenSurface=(x:number,y:number,z:number)=>{const rock=surfaceLookup(x,y,z),crust=crustSurface(x,y,z);return crust&&(!rock||crust.point.y>rock.point.y)?crust:rock;};
 const gardens:T.BufferGeometry[]=[],polypStats={polyps:0,tentacles:0,maxAttachmentError:0};
 const colonies:[number,number,number,number,'zoanthid'|'stony'][]=[[-3.23,.48,1.81,.55,'zoanthid'],[2.18,.7,1.63,.61,'zoanthid'],[-2.4,1.08,.64,.35,'zoanthid'],[1.12,2.76,-.39,.31,'zoanthid'],[-2.42,2.09,.03,.38,'stony'],[-3.47,1.37,.64,.37,'stony'],[-2.2,.67,.97,.29,'stony'],[1.31,2.94,-.34,.37,'stony'],[2.45,1.72,.3,.42,'stony'],[3.79,.74,1.15,.32,'stony'],[.91,1.17,-.06,.28,'stony']];
 for(const [x,y,z,r,kind] of colonies){
  const sample=(px:number,pz:number)=>gardenSurface(px,y+.5,pz);
  const garden=encrustingGarden(x,z,r,kind,sample,random,(px,pz)=>mantleSurface(px,y+.5,pz));gardens.push(garden.geometry);polypStats.polyps+=garden.polypCount;polypStats.tentacles+=garden.tentacleCount;polypStats.maxAttachmentError=Math.max(polypStats.maxAttachmentError,garden.attachmentError);
 }
 const polypMat=new T.MeshStandardMaterial({vertexColors:true,map:coralTex,bumpMap:coralTex,bumpScale:.0012,roughness:.78,side:T.DoubleSide});animatePolypMaterial(polypMat,reefClock);
 const zoo=batch(gardens,polypMat,group,'Rock-encrusting polyp gardens')!;addNote(zoo,'Life across the rock','Living tissue follows the reef surface. Zoanthid oral discs have a mouth and two fringes of narrow tentacles. Their soft fringes move gently while the stony colonies stay rigid. Colors and motion are illustrative.');
 // Add edge outcrops after existing gardens have attached. They share the
 // existing material batches without changing original attachment/RNG streams.
 const buttress=reefButtresses(seeded(2309231920));
 const extend=(mesh:T.Mesh,parts:T.BufferGeometry[])=>{
  const old=mesh.geometry,merged=mergeGeometries([old,...parts],false);
  old.dispose();parts.forEach(g=>g.dispose());mesh.geometry=merged;
 };
 extend(rockMesh,buttress.rocks);extend(hard,buttress.corals);extend(zoo,buttress.gardens);
 obstacles.push(...buttress.obstacles);
 rockStats.triangles=rockMesh.geometry.index!.count/3;
 rockStats.bufferBytes=Object.values(rockMesh.geometry.attributes).reduce((n,a)=>n+a.array.byteLength,0)+rockMesh.geometry.index!.array.byteLength;
 rockStats.expandedBufferBytes=rockMesh.geometry.index!.count*11*4;
 const buttressStats=buttress.stats;
 const sand=new T.Mesh(new T.PlaneGeometry(10.06,4.61,100,46),new T.MeshStandardMaterial({map:sandTex,bumpMap:sandTex,bumpScale:.018,roughness:1,color:'#ccc6b5',vertexColors:true}));sand.rotation.x=-Math.PI/2;const sandPositions=sand.geometry.getAttribute('position'),sandColors=new Float32Array(sandPositions.count*3);
 for(let i=0;i<sandPositions.count;i++){
  const x=sandPositions.getX(i),z=-sandPositions.getY(i),bank=sandBank(x,z);
  sandPositions.setZ(i,sandHeight(x,z));
  const patch=.5+.5*Math.sin(x*4.1+Math.sin(z*2.3))*Math.sin(z*3.7+x*.8),shade=1-bank*(.035+patch*.065);
  sandColors.set([shade,shade*.995,shade*.975],i*3);
 }
 sand.geometry.setAttribute('color',new T.BufferAttribute(sandColors,3));sand.geometry.computeVertexNormals();sand.receiveShadow=true;group.add(sand);
 const rubble=new T.InstancedMesh(new T.IcosahedronGeometry(1,0),new T.MeshStandardMaterial({color:'#d4d4bd',roughness:1}),1600),dummy=new T.Object3D();
 for(let i=0;i<1600;i++){
  const x=pick(-4.94,4.94),z=pick(-2.23,2.23),bank=sandBank(x,z),patch=.5+.5*Math.sin(x*7.1+z*2.3)*Math.sin(z*5.7-x*1.8);
  const s=pick(.006,.032)*(.7+bank*.6+patch*.25),height=pick(.4,1)*s;
  dummy.position.set(x,sandHeight(x,z)-height*.12,z);dummy.scale.set(s*(.8+patch*.5),height,s*(.75+bank*.2));dummy.rotation.set(random()*3,random()*3,random()*3);dummy.updateMatrix();rubble.setMatrixAt(i,dummy.matrix);rubble.setColorAt(i,new T.Color().setHSL(.11,.12,pick(.37,.83)));
 }rubble.receiveShadow=true;group.add(rubble);
 return {group,obstacles,notes,hosts,anemone,polypStats,rockStats,crustStats,infillStats,buttressStats,flankStats:flankShelves.stats,assetsReady:Promise.all([rockMaps.ready,coralMaps.ready,crustMaps.ready,plateMaps.ready])};
}
