import * as T from 'three';
/** A derby flag (offline derby rivals): a fibreglass whip standing pole metres off the back of the roof with a pennant at its tip,
 * as derby cars carry so a driver can snap it to signal they are out. The whip bends with the car (a spring stiffer than the
 * driver's, gain radians per m/s² of acceleration, and the oncoming air leaning it back like drag·v² of acceleration, bend at most
 * maxBend), the pennant streams back from the way the car is going
 * and flutters, and the whip snaps at snapAt of its height and hangs (snap radians) once the car is out or upside down. */
export const FLAG={pole:1.1,radius:.008,width:.34,height:.21,omega:6.5,damping:.22,gain:.03,drag:.02,maxBend:.55,maxAccel:300,snapAt:.55,snap:2.1,flutter:15,teleport:5} as const;
export const FLAG_COLOURS=[0xff4a12,0x16c95b,0xffd21a,0x2f7dff,0xff3fa4] as const;
/** The flag as a group named 'derby_flag' standing on y=0: 'flag_whip' bends about the base, 'flag_top' (the upper whip and the
 * pennant 'flag_cloth') snaps about snapAt. */
export function derbyFlag(colour:number){
  const group=new T.Group();group.name='derby_flag';
  const whip=new T.Group();whip.name='flag_whip';group.add(whip);
  const rod=new T.MeshStandardMaterial({color:0x1d1f22,roughness:.45,metalness:.2}),low=FLAG.pole*FLAG.snapAt,high=FLAG.pole-low;
  const base=new T.Mesh(new T.CylinderGeometry(FLAG.radius*.8,FLAG.radius,low,6),rod);base.position.y=low/2;whip.add(base);
  const top=new T.Group();top.name='flag_top';top.position.y=low;whip.add(top);
  const tip=new T.Mesh(new T.CylinderGeometry(FLAG.radius*.45,FLAG.radius*.8,high,6),rod);tip.position.y=high/2;top.add(tip);
  // A pennant hanging off the tip: a long triangle, its hoist on the whip.
  const shape=new T.BufferGeometry();shape.setAttribute('position',new T.Float32BufferAttribute([0,0,0,0,-FLAG.height,0,FLAG.width,-FLAG.height*.42,0],3));shape.computeVertexNormals();
  const cloth=new T.Mesh(shape,new T.MeshStandardMaterial({color:colour,roughness:.8,side:T.DoubleSide}));cloth.name='flag_cloth';cloth.position.y=high;top.add(cloth);
  group.traverse(o=>{if(o instanceof T.Mesh){o.castShadow=false;o.receiveShadow=false;}});
  return group;
}
export function disposeDerbyFlag(flag:T.Object3D){flag.traverse(o=>{if(!(o instanceof T.Mesh))return;o.geometry.dispose();(o.material as T.Material).dispose();});flag.removeFromParent();}
export type FlagState={bendX:number;rateX:number;bendZ:number;rateZ:number;velocity:T.Vector3;position:T.Vector3;frames:number;time:number;snapped:boolean};
export const newFlagState=():FlagState=>({bendX:0,rateX:0,bendZ:0,rateZ:0,velocity:new T.Vector3(),position:new T.Vector3(),frames:0,time:0,snapped:false});
/** One spring step: the whip leans opposite the car-frame acceleration (x sideways, z forward), bendX the lean towards -x (a z
 * turn), bendZ towards -z (an x turn). */
export function stepFlag(s:FlagState,ax:number,az:number,dt:number){
  if(!(dt>0))return s;const h=Math.min(dt,1/20),k=FLAG.omega*FLAG.omega,c=2*FLAG.damping*FLAG.omega,length=Math.hypot(ax,az),scale=length>FLAG.maxAccel?FLAG.maxAccel/length:1;
  s.rateX+=(-k*s.bendX-c*s.rateX+FLAG.gain*k*ax*scale)*h;s.rateZ+=(-k*s.bendZ-c*s.rateZ+FLAG.gain*k*az*scale)*h;s.bendX+=s.rateX*h;s.bendZ+=s.rateZ*h;
  const bend=Math.hypot(s.bendX,s.bendZ);if(bend>FLAG.maxBend){s.bendX*=FLAG.maxBend/bend;s.bendZ*=FLAG.maxBend/bend;s.rateX*=-.3;s.rateZ*=-.3;}
  s.time+=dt;return s;
}
const now=new T.Vector3(),speed=new T.Vector3(),local=new T.Vector3(),turn=new T.Quaternion();
/** Moves a flag on car (the car's root group) for dt: bends the whip from the root's own motion, streams and flutters the pennant,
 * and snaps the whip for good when out is true. Frames without movement (the simulation frozen) hold it; a jump of teleport metres
 * restarts it. */
export function waveFlag(flag:T.Object3D,car:T.Object3D,dt:number,out:boolean,wind?:{x:number;z:number}){
  const s:FlagState=flag.userData.wave??=newFlagState(),whip=flag.getObjectByName('flag_whip'),top=flag.getObjectByName('flag_top'),cloth=flag.getObjectByName('flag_cloth');
  if(!whip||!top||!cloth||!(dt>0))return;
  if(out&&!s.snapped){s.snapped=true;top.rotation.z=FLAG.snap;}
  car.getWorldPosition(now);
  if(s.frames===0||now.distanceTo(s.position)>FLAG.teleport){s.position.copy(now);s.frames=1;return;}
  if(now.equals(s.position)&&!wind)return;
  speed.copy(now).sub(s.position).divideScalar(dt);local.copy(speed).sub(s.velocity).divideScalar(dt);s.velocity.copy(speed);s.position.copy(now);
  if(s.frames++<2)return;
  // The flag feels the car's speed through the air: its own motion less any breeze.
  car.getWorldQuaternion(turn);turn.invert();local.applyQuaternion(turn);if(wind)speed.x-=wind.x,speed.z-=wind.z;const flow=speed.applyQuaternion(turn);
  stepFlag(s,local.x+FLAG.drag*flow.x*Math.abs(flow.x),local.z+FLAG.drag*flow.z*Math.abs(flow.z),dt);
  whip.rotation.set(-s.bendZ,0,s.bendX);
  // The pennant streams back from the way the car is going (and idles out to the side), fluttering faster the quicker it goes.
  // The cloth runs along its +x: turned by θ it points (cos θ, -sin θ), so back from the flow (fx, fz) is θ = atan2(fz, -fx).
  const pace=Math.hypot(flow.x,flow.z),trail=pace>.8?Math.atan2(flow.z,-flow.x):Math.PI/2;
  cloth.rotation.set(0,trail+Math.sin(s.time*FLAG.flutter*Math.min(1,.3+pace/12))*.22*Math.min(1,.25+pace/10),0);
}
