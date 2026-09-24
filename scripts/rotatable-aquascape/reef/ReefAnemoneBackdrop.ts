import * as T from 'three';
import {erodedRock} from './ReefRock.ts';
import {encrustRock} from './ReefMaterials.ts';
import {coralCrust} from './CoralCrust.ts';
import {surfaceColony} from './SurfaceColony.ts';
import {encrustingGarden} from './EncrustingPolyps.ts';
import {topSurfaceSampler} from './RockSurface.ts';
import {sandHeight} from './ReefOptics.ts';

/** Rear outcrop closes the bare glass sightline behind the large host anemone.
 * Its own random stream leaves established colonies and baked attachments intact. */
export function reefAnemoneBackdrop(random:()=>number){
 const sites=[
  [3.45,.65,-1.48,.76,.55,.46],[4.24,.62,-1.20,.53,.48,.46],
  [3.74,1.30,-1.42,.82,.66,.46],[4.25,1.66,-1.18,.53,.65,.48],
  [3.39,2.02,-1.40,.71,.61,.48],[3.96,2.50,-1.37,.74,.54,.48],
  [4.41,2.35,-1.22,.39,.46,.42]
 ];
 for(const site of sites){site[2]+=.55;if(site[0]>3.7)site[0]+=.12;}
 const rocks:T.BufferGeometry[]=[],crusts:T.BufferGeometry[]=[],corals:T.BufferGeometry[]=[],gardens:T.BufferGeometry[]=[];
 const obstacles:{center:T.Vector3;radius:number}[]=[];
 const stats={rocks:0,rockTriangles:0,crusts:0,colonies:0,polyps:0,tentacles:0,triangles:0};
 const material=new T.MeshBasicMaterial(),ray=new T.Raycaster();
 for(let i=0;i<sites.length;i++){
  const [x,y,z,sx,sy,sz]=sites[i],g=erodedRock(x,y,z,sx,sy,sz,random);
  if(i<2){const p=g.getAttribute('position');let gap=Infinity;for(let j=0;j<p.count;j++)gap=Math.min(gap,p.getY(j)-sandHeight(p.getX(j),p.getZ(j)));g.translate(0,-.035-gap,0);}
  encrustRock(g);g.computeBoundingSphere();rocks.push(g);stats.rocks++;stats.rockTriangles+=g.index!.count/3;
  obstacles.push({center:g.boundingSphere!.center.clone(),radius:g.boundingSphere!.radius+.005});
  const mesh=new T.Mesh(g,material);
  // Surface-following growth follows cavities instead of concealing them with balls.
  for(let j=0;j<9;j++){
   const angle=j*2.39996,origin=new T.Vector3(x+Math.cos(angle)*sx*.69,y+Math.sin(angle)*sy*.67,z+1.3);
   ray.set(origin,new T.Vector3(0,0,-1));ray.far=2.5;const hit=ray.intersectObject(mesh,false)[0];if(!hit?.face)continue;
   const hue=[.80,.91,.07,.14,.43,.55][(i+j)%6];
   crusts.push(coralCrust(g,hit.point,hit.face.normal,.16+random()*.15,hue,random()*90));stats.crusts++;
  }
  if(i>=2){
   ray.set(new T.Vector3(x,y+1.3,z),new T.Vector3(0,-1,0));ray.far=2.6;const hit=ray.intersectObject(mesh,false)[0];
   if(hit?.face){const c=surfaceColony(mesh,hit.point,hit.face.normal,.22+random()*.11,[.81,.045,.33,.12,.76][i-2],random);corals.push(...c.geometries);obstacles.push(c.obstacle);stats.colonies++;}
  }
 }
 const sample=topSurfaceSampler(rocks);
 for(const i of [1,2,4,5]){const [x,y,z]=sites[i],g=encrustingGarden(x,z+.16,.22,i%2?'zoanthid':'stony',(px,pz)=>sample(px,y+1.2,pz),random);gardens.push(g.geometry);stats.polyps+=g.polypCount;stats.tentacles+=g.tentacleCount;}
 for(const g of [...rocks,...crusts,...corals,...gardens])stats.triangles+=(g.index?.count??g.getAttribute('position').count)/3;
 material.dispose();return {rocks,crusts,corals,gardens,obstacles,stats};
}
