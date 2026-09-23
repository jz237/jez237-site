import * as T from 'three';
import {erodedRock} from './ReefRock.ts';
import {encrustRock} from './ReefMaterials.ts';
import {sandHeight} from './ReefOptics.ts';
import {topSurfaceSampler} from './RockSurface.ts';
import {encrustingGarden} from './EncrustingPolyps.ts';

/** Small attached living colonies feather the two reef islands into the sand. */
export function reefFootGardens(random:()=>number){
 const sites=[[-4.35,1.64,.25,.14,.22],[-3.84,2.01,.24,.14,.18],[-2.65,1.98,.31,.17,.20],[-1.91,1.36,.27,.16,.25],[-1.65,.67,.22,.17,.22],
  [1.13,1.90,.24,.15,.19],[1.77,2.04,.26,.16,.18],[2.48,2.02,.28,.16,.21],[3.82,1.99,.23,.15,.19],[4.36,.96,.26,.19,.25]];
 const rocks:T.BufferGeometry[]=[],gardens:T.BufferGeometry[]=[],obstacles:{center:T.Vector3;radius:number}[]=[];
 const stats={rocks:0,polyps:0,tentacles:0,triangles:0,maxAttachmentError:0};
 for(let i=0;i<sites.length;i++){
  const [x,z,sx,sy,sz]=sites[i],g=erodedRock(x,.4,z,sx,sy,sz,random),p=g.getAttribute('position');
  let gap=Infinity;for(let j=0;j<p.count;j++)gap=Math.min(gap,p.getY(j)-sandHeight(p.getX(j),p.getZ(j)));
  g.translate(0,-.035-gap,0);encrustRock(g);g.computeBoundingSphere();g.computeBoundingBox();rocks.push(g);
  obstacles.push({center:g.boundingSphere!.center.clone(),radius:g.boundingSphere!.radius+.01});
  const sample=topSurfaceSampler([g]),kind=i%3===0?'stony':'zoanthid';
  const garden=encrustingGarden(x,z,Math.min(sx,sz)*1.2,kind,(px,pz)=>sample(px,g.boundingBox!.max.y+.2,pz),random);
  // Colony-scale pigment families, not a random rainbow on individual vertices.
  const color=garden.geometry.getAttribute('color'),c=new T.Color(),hsl={h:0,s:0,l:0};
  for(let j=0;j<color.count;j++){
   c.fromBufferAttribute(color,j).getHSL(hsl);
   if(kind==='stony')c.setHSL(i%2?.83:.035,Math.min(.75,hsl.s*1.3),hsl.l*1.12);
   else if(i%3===1)c.offsetHSL(.015,.10,.015);
   color.setXYZ(j,c.r,c.g,c.b);
  }
  gardens.push(garden.geometry);stats.rocks++;stats.polyps+=garden.polypCount;stats.tentacles+=garden.tentacleCount;
  stats.maxAttachmentError=Math.max(stats.maxAttachmentError,garden.attachmentError);
  stats.triangles+=(g.index!.count+garden.geometry.index!.count)/3;
 }
 return {rocks,gardens,obstacles,stats};
}
