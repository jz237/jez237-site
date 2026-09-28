import * as T from 'three';
import { TessellateModifier } from 'three/addons/modifiers/TessellateModifier.js';
import {mergeVertices} from 'three/addons/utils/BufferGeometryUtils.js';
import { quarryRim, landscapeHeight, seededRandom } from './quarry-layout';
import { trackPoint } from './rules';
import type { BackdropCard } from './scenery-backdrop';
import type { NorthSaplingPart } from './scenery-north-forest';
import { dressWestVerge, type VergePlant } from './scenery-west-verge';

export const remainingBankAngle = (degrees: number) =>
  degrees > 57 && degrees < 116 || degrees > 174 && degrees < 273 || degrees > 327 && degrees < 348;

/** Shallow rock cleavage on the remaining old banks. The shared collision mesh
 * and its bench profile remain exact; this relief is capped at 28 cm. */
export function fractureBankGeometry(source: T.BufferGeometry) {
  const geometry = new TessellateModifier(1.15, 4).modify(source);
  const p = geometry.attributes.position, color = geometry.attributes.color;
  const reference = new Float32Array(p.array);
  for (let i=0;i<p.count;i++) {
    const x=p.getX(i),y=p.getY(i),z=p.getZ(i),a=Math.atan2(x/1.08,z),r=Math.hypot(x/1.08,z);
    const degrees=(a*180/Math.PI+360)%360;
    if (!remainingBankAngle(degrees)) continue;
    const arc=a*168, seam=Math.abs(Math.sin(arc*.71+y*.17));
    const cleft=(1-T.MathUtils.smoothstep(seam,.02,.18));
    const ledge=Math.abs(Math.sin(y*1.63+Math.floor(arc/3.1)*.81));
    const mask=T.MathUtils.smoothstep(y,1.5,4);
    const relief=mask*(.13*ledge-.15*cleft);
    p.setXYZ(i,x-Math.sin(a)*relief,y+mask*.04*(ledge-.5),z-Math.cos(a)*relief);
    const stain=1-cleft*.17;
    color.setXYZ(i,color.getX(i)*stain,color.getY(i)*stain,color.getZ(i)*stain);
  }
  geometry.setAttribute('bankReference',new T.BufferAttribute(reference,3));
  geometry.deleteAttribute('normal');
  const joined=mergeVertices(geometry,.0001);geometry.dispose();
  joined.computeVertexNormals();joined.computeBoundingSphere();
  return joined;
}

/** Replace the foremost remaining conifer cards with existing 3D branch assets.
 * Keep the farther photographs as overlapping background crowns. */
export function bankForestCards(cards: readonly BackdropCard[]) {
  return cards.filter(p=>{
    const a=Math.atan2(p.x/1.08,p.z), degrees=(a*180/Math.PI+360)%360;
    return p.kind!=='maple' && remainingBankAngle(degrees) && Math.hypot(p.x/1.08,p.z)-quarryRim(a).r<19;
  }).filter((_,i)=>i%2===0).slice(0,42);
}
export function addBankForest(parent:T.Group, cards:readonly BackdropCard[], parts:readonly NorthSaplingPart[]) {
  const dummy=new T.Object3D();
  for (const part of parts.filter(p=>p.level===1)) {
    const plants=cards.filter((_,i)=>i%3===part.variant);
    if(!plants.length)continue;
    const mesh=new T.InstancedMesh(part.geometry,part.material,plants.length);mesh.name='bank-rim-branch-trees';
    plants.forEach((p,i)=>{
      const s=p.height/part.sourceHeight;
      dummy.position.set(p.x,p.ground-part.sourceBottom*s,p.z);
      dummy.rotation.set(0,(p.x*.371+p.z*.917)%(Math.PI*2),0);
      dummy.scale.set(s*(.87+(i%4)*.065),s,s*(.87+(i%4)*.065));dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix);
      mesh.setColorAt(i,new T.Color(.78+(i%3)*.035,.81+(i%3)*.035,.74+(i%3)*.035));
    });
    mesh.receiveShadow=true;mesh.computeBoundingSphere();parent.add(mesh);
  }
}

export const bankVergeCenters=[.185,.255,.545,.615];
export function bankVergePlacements() {
  const random=seededRandom(907213),grass:VergePlant[]=[],shrubs:VergePlant[]=[],chips:VergePlant[]=[];
  const road=Array.from({length:721},(_,i)=>trackPoint(i/720));
  for(const [index,t]of bankVergeCenters.entries())for(let patch=0;patch<5;patch++) {
    const at=t+(patch-2)*.005,p=trackPoint(at),q=trackPoint(at+.0001),dx=q.x-p.x,dz=q.z-p.z,len=Math.hypot(dx,dz);
    for(let i=0;i<42;i++) {
      const across=7.7+random()*4.5,along=(random()-.5)*8;
      const x=p.x+dz/len*across+dx/len*along,z=p.z-dx/len*across+dz/len*along;
      if(road.some(p=>Math.hypot(p.x-x,p.z-z)<7.1))continue;
      const plant={x,z,y:landscapeHeight(x,z),height:.13+random()*.32,yaw:random()*Math.PI*2,width:.65+random()*.9,variant:index%3};
      if(i%5===0)chips.push({...plant,height:.04+random()*.10});
      else if(i===1)shrubs.push({...plant,height:.45+random()*.55});
      else grass.push(plant);
    }
  }
  return {grass,shrubs,chips};
}
export function dressBankVerges(parent:T.Group,saplings:readonly NorthSaplingPart[]) {
  return dressWestVerge(parent,saplings,{plants:bankVergePlacements(),centers:bankVergeCenters,label:'bank-verge'});
}
