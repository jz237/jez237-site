import * as T from 'three';
import {grazerBody} from '../lib/GrazerCollision.ts';
import {coryBody} from '../lib/Corydoras.ts';
/** Seeded contacts around actual foliage, plus open water, recorded before optimization. */
export function plantClearanceCases(plants){
 let seed=7351;const random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296),bits=[];
 for(let i=0;i<4000;i++){
  const leaf=plants.leaves[Math.floor(random()*plants.leaves.length)],p=i%3===0?new T.Vector3(random()*9.5-4.75,random()*4.8+.3,random()*4.4-2.2):leaf.box.getCenter(new T.Vector3()).add(new T.Vector3(random()-.5,random()-.5,random()-.5));
  const yaw=random()*Math.PI*2,f=new T.Vector3(Math.cos(yaw),0,Math.sin(yaw)),n=new T.Vector3(0,1,0),body=i%3===0?coryBody(p,f,.42+random()*.2,random()*.6-.3):grazerBody(p,n,f,i%3===1,.8+random()*.1);
  bits.push(plants.clearBody(p,body,(i%7)*1.7,i%5===0?leaf:undefined,i%2===0)?'1':'0');
 }
 return bits.join('');
}
