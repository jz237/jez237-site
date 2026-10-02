import * as T from 'three';
export type BuggyCorner='FL'|'FR'|'RL'|'RR';
type End={point:T.Vector3;hub:boolean};
export type BuggyLink={name:string;a:End;b:End;radius:number};
const v=(x:number,y:number,z:number)=>new T.Vector3(x,y,z);
export const buggyHub=(corner:BuggyCorner)=>v(corner.endsWith('L')?-.85:.85,.40,corner.startsWith('F')?1.20:-1.20);
export function buggyShock(corner:BuggyCorner){const side=corner.endsWith('L')?-1:1,front=corner.startsWith('F'),z=front?1.20:-1.20;return{mount:v(side*.405,front?.89:.97,z+(front?-.06:-.10)),offset:v(-side*.13,.05,0)};}
export function buggyLinks(corner:BuggyCorner):BuggyLink[]{
 const side=corner.endsWith('L')?-1:1,z=corner.startsWith('F')?1.20:-1.20,mount=(point:T.Vector3):End=>({point,hub:false}),hub=(point:T.Vector3):End=>({point,hub:true}),links:BuggyLink[]=[];
 for(const upper of [false,true])for(const fore of [-1,1])links.push({name:`suspension_${corner}_${upper?'upper':'lower'}_${fore<0?'rear':'front'}`,a:mount(v(side*.30,upper?.59:.345,z+fore*.21)),b:hub(v(-side*(upper?.095:.060),upper?.13:-.025,0)),radius:upper?.016:.022});
 links.push({name:`suspension_${corner}_upright`,a:hub(v(-side*.06,-.055,0)),b:hub(v(-side*.095,.165,0)),radius:.032},{name:`suspension_${corner}_tie_rod`,a:mount(v(side*.24,.47,z+.115)),b:hub(v(-side*.08,.05,.075)),radius:.011});
 if(corner.startsWith('R'))links.push({name:`suspension_${corner}_halfshaft`,a:mount(v(0,.46,z)),b:hub(v(-side*.07,0,0)),radius:.024});
 return links;
}

/** Transform-only running gear. Wheel spin does not rotate the wishbone's
 * mounts: the axle direction carries steering/camber while vertical stays up. */
export class BuggySuspension {
 private corners:{wheel:T.Object3D;links:{node:T.Object3D;layout:BuggyLink;length:number;position:T.Vector3;quaternion:T.Quaternion;scale:T.Vector3}[];shock?:{node:T.Object3D;mount:T.Vector3;offset:T.Vector3;length:number;position:T.Vector3;quaternion:T.Quaternion;scale:T.Vector3}}[]=[];
 constructor(model:T.Group){for(const corner of ['FL','FR','RL','RR']as const){const wheel=model.getObjectByName('wheel_'+corner);if(!wheel)continue;const rest=buggyHub(corner),links=buggyLinks(corner).flatMap(layout=>{const node=model.getObjectByName(layout.name);if(!node)return[];const a=layout.a.point.clone().add(layout.a.hub?rest:v(0,0,0)),b=layout.b.point.clone().add(layout.b.hub?rest:v(0,0,0));return[{node,layout,length:a.distanceTo(b),position:node.position.clone(),quaternion:node.quaternion.clone(),scale:node.scale.clone()}];}),node=model.getObjectByName(`suspension_${corner}_shock`),s=buggyShock(corner);this.corners.push({wheel,links,shock:node?{node,...s,length:s.mount.distanceTo(rest.clone().add(s.offset)),position:node.position.clone(),quaternion:node.quaternion.clone(),scale:node.scale.clone()}:undefined});}}
 update(){
  const up=v(0,1,0);
  for(const corner of this.corners){const axle=v(1,0,0).applyQuaternion(corner.wheel.quaternion).normalize(),forward=axle.clone().cross(up).normalize(),point=(end:End)=>end.hub?corner.wheel.position.clone().addScaledVector(axle,end.point.x).addScaledVector(up,end.point.y).addScaledVector(forward,end.point.z):end.point.clone();
   for(const {node,layout,length,scale}of corner.links){const a=point(layout.a),b=point(layout.b),d=b.clone().sub(a);if(d.lengthSq()<1e-10)continue;node.position.copy(a).add(b).multiplyScalar(.5);node.quaternion.setFromUnitVectors(up,d.clone().normalize());node.scale.copy(scale);node.scale.y*=d.length()/length;node.updateMatrix();}
   if(corner.shock){const s=corner.shock,bottom=point({point:s.offset,hub:true}),d=s.mount.clone().sub(bottom);if(d.lengthSq()>1e-10){s.node.position.copy(bottom);s.node.quaternion.setFromUnitVectors(up,d.clone().normalize());s.node.scale.copy(s.scale);s.node.scale.y*=d.length()/s.length;s.node.updateMatrix();}}
  }
 }
 reset(){for(const c of this.corners){for(const r of [...c.links,...(c.shock?[c.shock]:[])]){r.node.position.copy(r.position);r.node.quaternion.copy(r.quaternion);r.node.scale.copy(r.scale);r.node.updateMatrix();}}}
}
