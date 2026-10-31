import * as THREE from 'three';

/** Only observed positions enter this filter. No access to an insect's velocity,
 * hop timer or destination. Occlusion stops updates and ages the memory. */
export class PreyObservation {
  readonly position=new THREE.Vector3();
  readonly velocity=new THREE.Vector3();
  age=Infinity;
  private clock=0;
  private last=-Infinity;
  private sampled=false;
  reset(){this.age=Infinity;this.clock=0;this.last=-Infinity;this.sampled=false;this.velocity.set(0,0,0);}
  update(dt:number,point:THREE.Vector3,visible:boolean) {
    this.clock+=dt;this.age+=dt;
    if(!visible||this.clock-this.last<.075)return;
    const elapsed=this.clock-this.last;
    if(this.sampled&&elapsed<.35){
      const measured=point.clone().sub(this.position).divideScalar(elapsed).clampLength(0,1.5);
      this.velocity.lerp(measured,1-Math.exp(-elapsed*18));
    }else this.velocity.set(0,0,0);
    this.position.copy(point);this.last=this.clock;this.age=0;this.sampled=true;
  }
  predict(distance:number,airborne:boolean,floor:number,out=new THREE.Vector3()) {
    out.copy(this.position);
    if(!this.sampled||this.age>.25)return out;
    const horizon=airborne?THREE.MathUtils.clamp((this.velocity.y+Math.sqrt(this.velocity.y**2+19.6*Math.max(0,out.y-floor)))/9.8,0,.22)
      :THREE.MathUtils.clamp((distance-.10)/.55,0,.22);
    const lead=this.velocity.clone().multiplyScalar(horizon*(1-this.age/.25));
    lead.y=0;lead.clampLength(0,.055);out.add(lead);
    return out;
  }
}
