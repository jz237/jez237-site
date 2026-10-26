import * as T from 'three';

/** Strut punched through (offline): wreck a front corner — that wheel's damage past STRUT.punch with the front crushed past
 * STRUT.front — and its suspension strut tears off its tower and punches up through the panel above the wheel: the damper
 * and its coil spring stick out STRUT.proud m above the bonnet or wing, leaning in STRUT.lean rad at the top, with the top
 * mount on the end — and it goes with a snap of the spring and a shower of sparks. A mended corner (damage back under half
 * of STRUT.punch) has it back in its tower. */
export const STRUT={punch:.6,front:.3,proud:.24,lean:.18,rod:.022,body:.034,spring:.075,coil:.009,turns:6,mount:.075,below:.12,steel:0x3a3d40,springs:[0xd22a1e,0xf0c419,0x2f6fd8] as const} as const;
/** Does this front corner punch its strut through, with its wheel this damaged and the front this crushed? */
export const strutPunches=(wheel:number,front:number)=>Number.isFinite(wheel)&&Number.isFinite(front)&&wheel>=STRUT.punch&&front>=STRUT.front;
const steel=new T.MeshStandardMaterial({name:'Strut steel',color:STRUT.steel,metalness:.8,roughness:.38});
/** A strut along +y from its foot at the origin, `length` m long: damper body, chromed rod, coil spring and top mount. */
export function strutAssembly(length:number,springColour:number){
  const group=new T.Group();group.name='punched_strut';const l=Math.max(.2,length);
  const body=new T.Mesh(new T.CylinderGeometry(STRUT.body,STRUT.body,l*.55,10).translate(0,l*.275,0),steel);body.name='strut_body';
  const rod=new T.Mesh(new T.CylinderGeometry(STRUT.rod,STRUT.rod,l*.5,8).translate(0,l*.75,0),new T.MeshStandardMaterial({name:'Strut rod',color:0xd7dbde,metalness:1,roughness:.18}));rod.name='strut_rod';
  const helix=new T.CatmullRomCurve3(Array.from({length:STRUT.turns*12+1},(_,i)=>{const a=i/12*Math.PI*2,t=i/(STRUT.turns*12);return new T.Vector3(Math.cos(a)*STRUT.spring,l*(.25+.62*t),Math.sin(a)*STRUT.spring);}));
  const spring=new T.Mesh(new T.TubeGeometry(helix,STRUT.turns*24,STRUT.coil,6,false),new T.MeshStandardMaterial({name:'Coil spring',color:springColour,metalness:.35,roughness:.45}));spring.name='strut_spring';
  const mount=new T.Mesh(new T.CylinderGeometry(STRUT.mount,STRUT.mount*.9,.025,12).translate(0,l,0),steel);mount.name='strut_mount';
  group.add(body,rod,spring,mount);group.traverse(o=>{if(o instanceof T.Mesh){o.castShadow=true;o.receiveShadow=true;}});
  return group;
}
/** Watches a car's front corners and punches a strut up through the panel over a wrecked one. */
export class StrutPunch{
  readonly struts:(T.Group|null)[]=[null,null];
  punched=0;
  private ray=new T.Raycaster();
  constructor(private root:T.Object3D,private wheels:readonly (T.Object3D|undefined)[],private panels:readonly T.Mesh[],private colour:number,private onPunch?:(at:T.Vector3)=>void){}
  /** Checks the two front corners (wheel damage 0–1 each, the front structure's crush 0–1). */
  update(wheelDamage:ArrayLike<number>,front:number){
    for(const i of [0,1]){
      const strut=this.struts[i],d=wheelDamage[i]??0;
      if(strut&&d<STRUT.punch/2){strut.removeFromParent();this.struts[i]=null;continue;}
      if(strut||!strutPunches(d,front))continue;
      const s=this.punch(i);if(s){this.struts[i]=s;this.punched++;}
    }
  }
  private punch(i:number){
    const wheel=this.wheels[i];if(!wheel)return null;this.root.updateMatrixWorld(true);
    const inverse=this.root.matrixWorld.clone().invert(),hub=wheel.getWorldPosition(new T.Vector3()).applyMatrix4(inverse);
    // The skin over the wheel: cast down onto the panels from above it (straight at each: the batches leave them on no layer).
    const from=new T.Vector3(hub.x,hub.y+2,hub.z).applyMatrix4(this.root.matrixWorld),down=new T.Vector3(0,-1,0).transformDirection(this.root.matrixWorld);
    this.ray.set(from,down);this.ray.far=2.4;const hits:T.Intersection[]=[];for(const p of this.panels)p.raycast(this.ray,hits);hits.sort((a,b)=>a.distance-b.distance);
    const top=hits[0]?hits[0].point.clone().applyMatrix4(inverse).y:hub.y+.45;
    const foot=new T.Vector3(hub.x,hub.y+STRUT.below,hub.z),length=Math.max(.3,top+STRUT.proud-foot.y);
    const strut=strutAssembly(length/Math.cos(STRUT.lean),STRUT.springs[Math.abs(Math.round(this.colour))%STRUT.springs.length]);
    strut.position.copy(foot);strut.rotation.z=Math.sign(hub.x||1)*STRUT.lean;this.root.add(strut);
    this.onPunch?.(new T.Vector3(hub.x,top,hub.z).applyMatrix4(this.root.matrixWorld));
    return strut;
  }
  dispose(){for(const s of this.struts)s?.removeFromParent();this.struts.fill(null);}
}
