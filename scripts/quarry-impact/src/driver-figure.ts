import * as T from 'three';
/** A driver in the seat (cosmetic): helmet with a dark visor, shoulders in a race suit and arms reaching for the wheel. Placed
 * from the car model's own box: DRIVER.side of the half width to the left, the helmet top DRIVER.headroom below the roof,
 * DRIVER.back of the length behind the box centre. */
export const DRIVER={side:.36,headroom:.3,back:.06,head:.12} as const;
export function driverFigure(helmet:number){
  const group=new T.Group();group.name='driver';
  const shell=new T.MeshStandardMaterial({color:helmet,roughness:.25,metalness:.15}),visor=new T.MeshStandardMaterial({color:0x101418,roughness:.1,metalness:.6}),suit=new T.MeshStandardMaterial({color:0x22262c,roughness:.8});
  const head=new T.Mesh(new T.SphereGeometry(DRIVER.head,16,12),shell);head.position.y=0;group.add(head);
  const face=new T.Mesh(new T.SphereGeometry(DRIVER.head*1.01,16,8,-Math.PI*.35,Math.PI*.7,Math.PI*.38,Math.PI*.24),visor);face.rotation.y=Math.PI/2;face.position.y=-.01;group.add(face);
  const body=new T.Mesh(new T.BoxGeometry(.4,.34,.24),suit);body.position.set(0,-DRIVER.head-.19,-.04);group.add(body);
  for(const x of [-.17,.17]){const arm=new T.Mesh(new T.CylinderGeometry(.045,.045,.36,8),suit);arm.position.set(x,-DRIVER.head-.16,.14);arm.rotation.x=Math.PI*.36;group.add(arm);}
  group.traverse(o=>{if(o instanceof T.Mesh){o.castShadow=false;o.receiveShadow=true;}});
  return group;
}
export function disposeDriver(figure:T.Object3D){figure.traverse(o=>{if(!(o instanceof T.Mesh))return;o.geometry.dispose();for(const m of Array.isArray(o.material)?o.material:[o.material])m.dispose();});figure.removeFromParent();}
