import * as THREE from 'three';
import type {TailCollision} from './TailContacts';

/** Contact with the swept mouth/tongue, not a generous distance-to-head trigger. */
export function touchesPrey(prey:THREE.Vector3,from:THREE.Vector3,to:THREE.Vector3,
  radius:number,collision?:TailCollision) {
  const d=to.clone().sub(from),length=d.lengthSq();
  const t=length>1e-12?THREE.MathUtils.clamp(prey.clone().sub(from).dot(d)/length,0,1):0;
  const nearest=from.clone().addScaledVector(d,t);
  if(nearest.distanceToSquared(prey)>radius*radius)return false;
  if(collision){
    // A mouth beside a wall cannot capture prey through the wall.
    const distance=nearest.distanceTo(prey),steps=Math.max(2,Math.ceil(distance/.003));
    for(let i=0;i<=steps;i++){
      const p=nearest.clone().lerp(prey,i/steps),q=p.clone();
      collision.projectPoint(p,q,0,new THREE.Vector3());
      if(p.distanceToSquared(q)>.001*.001)return false;
    }
  }
  return true;
}
