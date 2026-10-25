import * as T from 'three';
import {DRIVER} from './driver-figure';
/** A driver gets out of a burning car (offline): once their car is on fire or blown up and has all but stopped (under speed m/s)
 * for delay seconds, they climb out of their door, walk walk metres clear over stroll seconds and stand watching it burn for watch
 * seconds, then are gone over the barrier (they are not solid, so cars would drive through them). The seated figure is moved into
 * the world and given legs (leg metres long), its arms hanging. */
export const BAIL={delay:1.2,speed:3,door:1.1,walk:3.2,stroll:2.2,watch:6,leg:.78,stride:.5} as const;
/** Whether a car's driver should get out now: burning or blown up, nearly stopped, for long enough (seconds so far in that state). */
export function shouldBail(onFire:boolean,blownUp:boolean,speed:number,seconds:number){return (onFire||blownUp)&&Math.abs(Number.isFinite(speed)?speed:99)<BAIL.speed&&seconds>=BAIL.delay;}
const BODY_BOTTOM=-DRIVER.head-.36;
/** Gives the figure legs and stands it: arms hanging, eyes front, no sway. */
function standUp(figure:T.Object3D){
  if(!figure.getObjectByName('driver_legs')){
    const legs=new T.Group();legs.name='driver_legs';const suit=new T.MeshStandardMaterial({color:0x22262c,roughness:.8});
    // Each leg swings from a hip pivot.
    for(const x of [-.1,.1]){const hip=new T.Group();hip.name='driver_hip';hip.position.set(x,BODY_BOTTOM,0);const leg=new T.Mesh(new T.CylinderGeometry(.08,.068,BAIL.leg,8),suit);leg.position.y=-BAIL.leg/2;hip.add(leg);legs.add(hip);}
    figure.add(legs);
  }
  // The arms (the two cylinders reaching for the wheel) hang down by the sides.
  for(const arm of figure.children)if(arm instanceof T.Mesh&&arm.geometry instanceof T.CylinderGeometry&&Math.abs(arm.rotation.x)>.5){arm.rotation.x=.08;arm.position.z=-.02;arm.position.y=-DRIVER.head-.2;arm.position.x=Math.sign(arm.position.x)*.24;}
  figure.rotation.set(0,0,0);delete figure.userData.sway;
  // Eyes front again (the visor turns about the helmet).
  const visor=figure.children[1];if(visor)visor.rotation.y=Math.PI/2;delete figure.userData.look;
}
/** Takes the driver figure out of car into scene beside its driver's door, standing on height(x, z); returns the walk to make. */
export function bailOut(figure:T.Object3D,car:T.Object3D,scene:T.Object3D,height:(x:number,z:number)=>number){
  car.updateWorldMatrix(true,false);
  const side=new T.Vector3(Math.sign(figure.position.x)||-1,0,0).transformDirection(car.matrixWorld);side.y=0;if(side.lengthSq()<1e-6)side.set(1,0,0);side.normalize();
  const centre=new T.Vector3().setFromMatrixPosition(car.matrixWorld),from=centre.clone().addScaledVector(side,BAIL.door),to=centre.clone().addScaledVector(side,BAIL.door+BAIL.walk);
  scene.add(figure);standUp(figure);
  const walk={from,to,time:0,facing:Math.atan2(-side.x,-side.z),height};figure.userData.bail=walk;placeWalker(figure,0);
  return walk;
}
/** Moves a bailed-out driver along their walk for dt (a slight bob and leg swing while walking), stands them still, then takes
 * them away once they have watched long enough. */
export function strollAway(figure:T.Object3D,dt:number){
  const walk=figure.userData.bail;if(!walk||!(dt>0)||!figure.visible)return;
  if(walk.time>=BAIL.stroll){walk.watched=(walk.watched??0)+dt;if(walk.watched>=BAIL.watch)figure.visible=false;return;}
  walk.time=Math.min(BAIL.stroll,walk.time+dt);placeWalker(figure,walk.time/BAIL.stroll);
}
function placeWalker(figure:T.Object3D,t:number){
  const walk=figure.userData.bail,at=walk.from.clone().lerp(walk.to,t),moving=t<1,phase=walk.time/BAIL.stroll*Math.PI*2*BAIL.walk/BAIL.stride/2;
  const ground=walk.height(at.x,at.z),stand=(Number.isFinite(ground)?ground:at.y)-BODY_BOTTOM+BAIL.leg;
  figure.position.set(at.x,stand+(moving?Math.abs(Math.sin(phase))*.03:0),at.z);
  // Walking away from the car, then turned round to watch it.
  figure.rotation.set(0,moving?walk.facing+Math.PI:walk.facing,0);
  const legs=figure.getObjectByName('driver_legs');if(legs)legs.children.forEach((leg,i)=>{leg.rotation.x=moving?Math.sin(phase+(i?Math.PI:0))*.45:0;});
}
