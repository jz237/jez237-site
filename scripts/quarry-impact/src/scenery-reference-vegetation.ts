import {quarryRim,landscapeHeight,seededRandom} from './quarry-layout';
import type {BackdropCard} from './scenery-backdrop';

/** Irregular conifer clumps on the photographed quarry's actual crest. */
export function referenceCrestPlants():BackdropCard[]{
 const random=seededRandom(237094),plants:BackdropCard[]=[];
 for(let i=0;i<42;i++){
  const stand=i%7,centre=(-71+stand*25)*Math.PI/180,a=centre+(random()-.5)*.19;
  const radius=quarryRim(a).r+2.5+random()*10,x=Math.sin(a)*radius*1.08,z=Math.cos(a)*radius;
  plants.push({kind:'fir',x,z,ground:landscapeHeight(x,z),height:9+random()*8,width:.78+random()*.33,color:[.72,.77,.68]});
 }
 return plants;
}
