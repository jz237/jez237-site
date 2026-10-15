import * as THREE from 'three';
import type {GroundQuery} from './LizardRig';
import {TANK} from './Case';

export interface Foothold {point: THREE.Vector3; normal: THREE.Vector3; top: number}

/** A foot commits to a real, reachable patch before leaving its previous patch. */
export class Footholds {
  constructor(private ground: GroundQuery) {}

  support(x: number, z: number, ceiling: number) {
    const out = {y: 0, normal: new THREE.Vector3()};
    if (this.ground.supportAt) return this.ground.supportAt(x, z, ceiling, out);
    out.y = this.ground.heightAt(x, z); this.ground.normalAt(x, z, out.normal); return out;
  }

  find(wanted: THREE.Vector3, shoulder: THREE.Vector3, reach: number, heading: number,
    side: number, from?: THREE.Vector3, footprint: THREE.Vector3[] = [], fromHeading=heading, maximumHeight=Infinity, footHeading=heading, usable?:(hold:Foothold)=>boolean, maximumLift=.025): Foothold | null {
    const f = new THREE.Vector3(Math.cos(heading), 0, -Math.sin(heading));
    const right = new THREE.Vector3(-f.z, 0, f.x);
    let best: Foothold | null = null, score = Infinity;
    // Prefer the intended step, then nearby patches. Never invent a contact in air.
    for (const radius of [0, .008, .016, .024, .032, .040, .048, .056, .064, .072]) {
      // Horizontal distance alone is a lower bound on the score. Once it
      // exceeds the best patch, no expensive toe/corridor cast can improve it.
      if(best && radius*radius>score+1e-12)break;
      for (let i = 0; i < (radius ? 24 : 1); i++) {
        const angle = i * Math.PI / 12;
        const x = wanted.x + radius * Math.cos(angle), z = wanted.z + radius * Math.sin(angle);
        const support = this.support(x, z, shoulder.y + .035);
        if(support.y>maximumHeight)continue;
        const point = new THREE.Vector3(x, support.y, z);
        const s = point.distanceToSquared(wanted) + Math.abs(point.y - wanted.y) * .006;
        if(s>=score)continue;
        const ankle = point.clone().addScaledVector(support.normal, .0075);
        const extension=ankle.distanceTo(shoulder);
        if (extension > reach * .92 || extension < reach * .31 || support.normal.y < .48) continue;
        if (point.clone().sub(shoulder).dot(right) * side < .009) continue;
        // Fit a small sole patch. An edge or a near-vertical face is not a flat foothold.
        const e = .007;
        const l = this.support(x - e, z, support.y + .012).y;
        const r = this.support(x + e, z, support.y + .012).y;
        const b = this.support(x, z - e, support.y + .012).y;
        const t = this.support(x, z + e, support.y + .012).y;
        if (Math.max(l, r, b, t) - Math.min(l, r, b, t) > .016) continue;
        const normal = new THREE.Vector3(l - r, 2 * e, b - t).normalize();
        if (normal.y < .55) continue;
        let clear = true;
        const footF=new THREE.Vector3(Math.cos(footHeading),0,-Math.sin(footHeading)),footR=new THREE.Vector3(-footF.z,0,footF.x);
        for(const offset of footprint) {
          const dx=footF.x*offset.x+footR.x*offset.z, dz=footF.z*offset.x+footR.z*offset.z;
          if(Math.abs(x+dx)>TANK.w/2-.014 || Math.abs(z+dz)>TANK.d/2-.014){clear=false;break;}
          const plane=point.y-(normal.x*dx+normal.z*dz)/normal.y;
          if(this.support(x+dx,z+dz,Math.max(plane,point.y)+.025).y>plane+.002){clear=false;break;}
          if(this.ground.tailContacts){
            const p=new THREE.Vector3(x+dx,plane+.0015,z+dz),q=p.clone();
            this.ground.tailContacts.projectPoint(p,q,.001,new THREE.Vector3());
            if(p.distanceTo(q)>.002){clear=false;break;}
          }
        }
        if(!clear)continue;
        let top = point.y;
        if (from) {
          // Reach from the shoulder is the limit; a previously tucked foot can
          // descend farther than a fixed riser threshold while the body stays put.
          if (Math.abs(point.y - from.y) > reach * 1.15) continue;
          // Sweep the entire sole-width corridor, not only three centre samples.
          const n = Math.max(2, Math.ceil(from.distanceTo(point) / .005));
          for (let j = 0; j <= n; j++) for (const lateral of [-.008, 0, .008]) {
            const p = from.clone().lerp(point, j / n).addScaledVector(right, lateral);
            top = Math.max(top, this.support(p.x, p.z, Math.max(from.y, point.y) + .055).y);
          }
          const turn=Math.atan2(Math.sin(footHeading-fromHeading),Math.cos(footHeading-fromHeading));
          for(let j=0;j<=n;j++){
            const p=from.clone().lerp(point,j/n),yaw=fromHeading+turn*j/n,c=Math.cos(yaw),s=Math.sin(yaw);
            for(const offset of footprint){
              const dx=c*offset.x+s*offset.z,dz=-s*offset.x+c*offset.z;
              top=Math.max(top,this.support(p.x+dx,p.z+dz,Math.max(from.y,point.y)+.055).y);
            }
          }
          if (top > Math.max(from.y, point.y) + maximumLift) continue;
        }
        const hold={point,normal,top};
        if (s < score && (!usable||usable(hold))) {score = s; best = hold;}
      }
      if (best && radius >= .016) break;
    }
    // Prefer a low, clear stride. If none exists, a toe may need to lift over
    // a rock corner even when both soles are on sand. Size that lift to this
    // limb; the rig still checks reach and collision throughout the transfer.
    const higherLift=Math.min(.045,reach*.65);
    if(!best && from && maximumLift<higherLift)return this.find(wanted,shoulder,reach,heading,side,from,footprint,fromHeading,maximumHeight,footHeading,usable,higherLift);
    return best;
  }
}
