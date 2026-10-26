import * as T from 'three';

/** Airbags (offline, modern cars — the classics were built without): the first time the front structure is crushed past
 * AIRBAG.front they fire with a bang — the driver's out of the wheel and the passenger's out of the dash, full in
 * AIRBAG.fill s — hold a moment (AIRBAG.hold s) and then sag deflated over AIRBAG.sag s, drooping AIRBAG.droop m and
 * hanging there for the rest of the event, in a puff of AIRBAG.powder motes of white powder. Placed in the cabin from the
 * driver figure's helmet: each bag at its height below it (AIRBAG.*.drop), the driver's on the driver's side and the
 * passenger's across the car, kept inside the cabin's sides and fitted against the dash or windscreen ahead (found by
 * casting across and forward at the bodywork and glass), and no further forward than its reach (AIRBAG.*.reach). */
export const AIRBAG={front:.2,fill:.05,hold:.18,sag:.9,droop:.11,limp:[.78,.42,.38],powder:16,gap:.04,
  driver:{drop:-.14,reach:.4,size:[.28,.27,.2]},passenger:{drop:-.08,reach:.55,size:[.4,.34,.28]},colour:0xf1f0ea} as const;
/** How full a bag is (its size, 0–1, and how far it has drooped, 0–1) this long after it fired. */
export function airbagShape(age:number){
  const t=Number.isFinite(age)?age:-1;if(t<0)return {size:0,droop:0,limp:0};
  if(t<AIRBAG.fill){const k=t/AIRBAG.fill;return {size:1-(1-k)*(1-k),droop:0,limp:0};}
  const after=t-AIRBAG.fill-AIRBAG.hold;if(after<=0)return {size:1,droop:0,limp:0};
  const k=Math.min(1,after/AIRBAG.sag),ease=k*k*(3-2*k);return {size:1,droop:ease,limp:ease};
}
const material=new T.MeshStandardMaterial({name:'Airbag fabric',color:AIRBAG.colour,roughness:.92,metalness:0}),geometry=new T.SphereGeometry(1,18,12);
export class Airbags{
  readonly bags:{mesh:T.Mesh;size:readonly number[];at:T.Vector3}[]=[];
  age=-1;
  constructor(root:T.Object3D,driver:T.Object3D,surfaces:readonly T.Mesh[]=[]){
    // The driver's helmet in the car's own frame, whatever the figure hangs from.
    root.updateMatrixWorld(true);const seat=root.worldToLocal(driver.getWorldPosition(new T.Vector3())),ray=new T.Raycaster(),hits:T.Intersection[]=[];
    // How far from a point in the car's frame, along a direction in it, to the first panel or glass (Infinity if none).
    const room=(from:T.Vector3,along:T.Vector3)=>{ray.set(from.clone().applyMatrix4(root.matrixWorld),along.clone().transformDirection(root.matrixWorld));ray.far=3;hits.length=0;
      for(const m of surfaces)m.raycast(ray,hits);return hits.reduce((d,h)=>Math.min(d,h.distance),Infinity);};
    const driverSide=Math.sign(seat.x)||-1;
    for(const [spec,side] of [[AIRBAG.driver,1],[AIRBAG.passenger,-1]] as const){
      const y=seat.y+spec.drop,out=driverSide*side,wall=room(new T.Vector3(0,y,seat.z),new T.Vector3(out,0,0));
      const x=out*Math.max(0,Math.min(Math.abs(seat.x),(Number.isFinite(wall)?wall:Math.abs(seat.x)+spec.size[0]+AIRBAG.gap)-spec.size[0]-AIRBAG.gap));
      const ahead=room(new T.Vector3(x,y,seat.z),new T.Vector3(0,0,1)),z=seat.z+(Number.isFinite(ahead)?Math.max(.12,Math.min(spec.reach,ahead-spec.size[2]-AIRBAG.gap)):spec.reach);
      const at=new T.Vector3(x,y,z);
      const mesh=new T.Mesh(geometry,material);mesh.name='airbag';mesh.visible=false;mesh.castShadow=false;mesh.position.copy(at);root.add(mesh);this.bags.push({mesh,size:spec.size,at});
    }
  }
  get deployed(){return this.age>=0;}
  /** Fires them (once). Returns whether they fired now. */
  deploy(){if(this.age>=0)return false;this.age=0;this.pose();return true;}
  update(dt:number){if(this.age<0||!(dt>0))return;this.age+=dt;this.pose();}
  private pose(){
    const {size,droop,limp}=airbagShape(this.age);
    for(const b of this.bags){b.mesh.visible=size>0;
      b.mesh.scale.set(b.size[0]*size*(1-limp*(1-AIRBAG.limp[0])),b.size[1]*size*(1-limp*(1-AIRBAG.limp[1])),b.size[2]*size*(1-limp*(1-AIRBAG.limp[2])));
      b.mesh.position.set(b.at.x,b.at.y-droop*AIRBAG.droop,b.at.z);}
  }
  /** Where the bags are, in the world (the powder comes from here). */
  points(out:T.Vector3[]){for(const b of this.bags)out.push(b.mesh.getWorldPosition(new T.Vector3()));return out;}
  /** A mended car has fresh bags packed away. */
  reset(){this.age=-1;for(const b of this.bags){b.mesh.visible=false;b.mesh.scale.setScalar(1);b.mesh.position.copy(b.at);}}
  dispose(){for(const b of this.bags)b.mesh.removeFromParent();this.bags.length=0;}
}
