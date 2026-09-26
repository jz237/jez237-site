import {Vector3} from 'three';

export const reefTourStops = [
 {title:'A reef in miniature',text:'Two living islands frame a sandy channel. Look for fish moving in front of and behind the coral, and softer reflections in the glass.',position:[0,3.25,17.7],target:[0,2.67,0]},
 {title:'Life above the coral',text:'Watch the orange anthias and blue-green chromis in open water. Each fish changes pace and direction independently. The reef below gives their movement a sense of depth.',position:[-.8,4.1,9.5],target:[-.8,3.05,0]},
 {title:'A branching neighborhood',text:'Follow the branches from their thick bases to their fine tips. Small polyps cover the living surface, while layered plates spread out beneath the canopy.',position:[-2.65,3.55,5.4],target:[-2.65,2.55,0]},
 {title:'Clownfish and their host',text:'Watch the clownfish weave into and around the anemone. The tentacles sway with the current and bend locally where a fish brushes past.',position:[3.15,2.55,5.1],target:[3.05,1.6,.82]},
 {title:'The rock is alive',text:'Look closely at the colored crusts, tiny cups and fringed polyps. These communities grow across an irregular, porous foundation rather than a smooth bare stone.',position:[2.8,1.6,4.4],target:[2.8,.55,1.45]},
 {title:'Along the sandy bottom',text:'Trace the sand banks and scattered rubble between the islands. Watch for the patterned mandarin near the bottom: it pauses, picks and makes short, flexible moves as it searches.',position:[.1,2.25,6.2],target:[0,.42,.85]}
] as const;

/** Move through the clear front of the tank; never steer the animals. */
export class ReefTourCamera {
 private fromPosition=new Vector3();private fromTarget=new Vector3();
 private toPosition=new Vector3();private toTarget=new Vector3();private corridor=new Vector3();
 private elapsed=0;active=false;
 readonly duration=2.8;
 private position:Vector3;private target:Vector3;
 constructor(position:Vector3,target:Vector3){this.position=position;this.target=target;}
 start(stop:number,reducedMotion=false){
  const view=reefTourStops[stop];if(!view)return;
  this.fromPosition.copy(this.position);this.fromTarget.copy(this.target);
  this.toPosition.fromArray(view.position);this.toTarget.fromArray(view.target);
  this.corridor.copy(this.fromPosition).lerp(this.toPosition,.5);
  this.corridor.z=Math.max(6,this.fromPosition.z,this.toPosition.z);
  this.elapsed=0;this.active=!reducedMotion;
  if(reducedMotion){this.position.copy(this.toPosition);this.target.copy(this.toTarget);}
 }
 update(dt:number){
  if(!this.active)return;
  this.elapsed=Math.min(this.duration,this.elapsed+Math.max(0,dt));
  const t=this.elapsed/this.duration,s=t*t*t*(t*(t*6-15)+10),a=1-s;
  this.position.copy(this.fromPosition).multiplyScalar(a*a).addScaledVector(this.corridor,2*a*s).addScaledVector(this.toPosition,s*s);
  this.target.copy(this.fromTarget).lerp(this.toTarget,s);
  if(t===1)this.active=false;
 }
 cancel(){this.active=false;}
}
