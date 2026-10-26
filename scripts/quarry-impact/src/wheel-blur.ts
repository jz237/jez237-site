import * as T from 'three';

/** Wheel blur (offline): at speed the eye (and a camera) sees a spoked wheel smeared into a soft disc, not strobing spokes. Over
 * each rim's face lies a thin ring, BLUR.out m proud of it from BLUR.hub to BLUR.lip of the rim's radius, in the rim's own
 * colour darkened by the gaps between its spokes (BLUR.gaps) and the brake dust on it; it fades in as the wheel itself spins up
 * from BLUR.from to BLUR.full rad/s (so wheelspin blurs it standing, and a locked wheel shows its spokes), at most BLUR.most
 * opaque. The pattern is round, so the wheel's turning never shows through it. None on a wheel that has come off or wears a
 * solid hubcap. */
export const BLUR={from:15,full:45,most:.72,gaps:.55,dust:.6,hub:.18,lip:.92,out:.004} as const;
/** How opaque the blur over a wheel spinning at `omega` rad/s. */
export function blurOpacity(omega:number){const w=Number.isFinite(omega)?Math.abs(omega):0;if(w<=BLUR.from)return 0;const t=Math.min(1,(w-BLUR.from)/(BLUR.full-BLUR.from));return BLUR.most*t*t*(3-2*t);}
const NOT_RIM=/tire|tyre|blocker|disc|brake|caliper|hose|hubcap/i;
type Blurred={index:number;wheel:T.Object3D;disc:T.Mesh;material:T.MeshStandardMaterial;colour:T.Color;cap?:T.Object3D;angle:number;seen:boolean};
const under=(o:T.Object3D,root:T.Object3D)=>{for(let p:T.Object3D|null=o.parent;p;p=p.parent)if(p===root)return true;return false;};
/** Blur discs on a car's wheels (tyre radius in metres), fitted to each rim. */
export class WheelBlur{
  readonly discs:Blurred[]=[];
  constructor(wheels:readonly (T.Object3D|undefined)[],radius:number){
    wheels.forEach((wheel,index)=>{
      if(!wheel)return;wheel.updateMatrixWorld(true);const inverse=wheel.matrixWorld.clone().invert(),box=new T.Box3(),part=new T.Box3();let colour:T.Color|undefined;
      wheel.traverse(o=>{if(!(o instanceof T.Mesh)||Array.isArray(o.material)||NOT_RIM.test(`${o.name} ${(o.material as T.Material).name}`))return;
        o.geometry.computeBoundingBox();box.union(part.copy(o.geometry.boundingBox!).applyMatrix4(new T.Matrix4().multiplyMatrices(inverse,o.matrixWorld)));
        colour??=(o.material as T.MeshStandardMaterial).color?.clone();});
      if(box.isEmpty()||!colour)return;
      // The rim's face: its outboard side (away from the car's middle) and its reach about the axle.
      const rim=Math.min(Math.max(Math.abs(box.min.y),Math.abs(box.max.y),Math.abs(box.min.z),Math.abs(box.max.z)),radius*.75),side=wheel.position.x>=0?1:-1,face=side>0?box.max.x:box.min.x;
      const material=new T.MeshStandardMaterial({name:'Wheel blur',color:colour.clone().multiplyScalar(BLUR.gaps),metalness:.55,roughness:.45,transparent:true,opacity:0,depthWrite:false});
      const disc=new T.Mesh(new T.RingGeometry(rim*BLUR.hub,rim*BLUR.lip,40,1).rotateY(side*Math.PI/2),material);
      disc.name='wheel_blur';disc.position.x=face+side*BLUR.out;disc.visible=false;disc.castShadow=disc.receiveShadow=false;disc.renderOrder=1;wheel.add(disc);
      this.discs.push({index,wheel,disc,material,colour,cap:wheel.getObjectByName('hubcap_fitted'),angle:0,seen:false});
    });
  }
  /** Blur from each wheel's spin (its turned angle now, by index, over dt s), on the wheels still on (lost by index) under this
   * much brake dust (0–1). */
  update(angles:ArrayLike<number>,dt:number,lost:ArrayLike<boolean|number>,dust=0){
    if(!(dt>0)||!Number.isFinite(dt))return;const grime=1-BLUR.dust*(Number.isFinite(dust)?Math.max(0,Math.min(1,dust)):0);
    for(const d of this.discs){const a=angles[d.index];if(!Number.isFinite(a)){d.disc.visible=false;continue;}
      const turn=d.seen?Math.atan2(Math.sin(a-d.angle),Math.cos(a-d.angle)):0,omega=turn/dt;d.angle=a;d.seen=true;const opacity=blurOpacity(omega);
      const show=opacity>.01&&!lost[d.index]&&!(d.cap&&d.cap.visible&&under(d.cap,d.wheel));d.disc.visible=show;if(!show)continue;
      d.material.opacity=opacity;d.material.color.copy(d.colour).multiplyScalar(BLUR.gaps*grime);}
  }
  /** Each wheel's blur opacity now (QA). */
  get opacities(){return this.discs.map(d=>d.disc.visible?+d.material.opacity.toFixed(3):0);}
  dispose(){for(const d of this.discs){d.disc.removeFromParent();d.disc.geometry.dispose();d.material.dispose();}this.discs.length=0;}
}
