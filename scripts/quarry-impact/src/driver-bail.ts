import * as T from 'three';
import {DRIVER} from './driver-figure';
/** A driver gets out of a burning car (offline): once their car is out (wrecked) and on fire or blown up, and has all but stopped
 * (under speed m/s) for delay seconds, they climb out of their door, walk walk metres clear over stroll seconds and stand watching it burn for watch
 * seconds (waving to the crowd for the first wave of them, to show they are all right), then are gone over the barrier (they are
 * not solid, so cars would drive through them). The seated figure is moved into the world and given legs (leg metres long), its
 * arms hanging from shoulders. */
export const BAIL={delay:1.2,speed:3,door:1.1,walk:3.2,stroll:2.2,watch:6,wave:2.4,leg:.78,stride:.5} as const;
/** Whether a car's driver should get out now: the car out, burning or blown up, nearly stopped, for long enough (seconds so far in
 * that state). A car still in the fight keeps its driver: its fire may yet be put out and it drives on. */
export function shouldBail(onFire:boolean,blownUp:boolean,out:boolean,speed:number,seconds:number){return out&&(onFire||blownUp)&&Math.abs(Number.isFinite(speed)?speed:99)<BAIL.speed&&seconds>=BAIL.delay;}
const BODY_BOTTOM=-DRIVER.head-.36;
/** Gives the figure legs and stands it: arms hanging, eyes front, no sway. */
function standUp(figure:T.Object3D){
  if(!figure.getObjectByName('driver_legs')){
    const legs=new T.Group();legs.name='driver_legs';const suit=new T.MeshStandardMaterial({color:0x22262c,roughness:.8});
    // Each leg swings from a hip pivot.
    for(const x of [-.1,.1]){const hip=new T.Group();hip.name='driver_hip';hip.position.set(x,BODY_BOTTOM,0);const leg=new T.Mesh(new T.CylinderGeometry(.08,.068,BAIL.leg,8),suit);leg.position.y=-BAIL.leg/2;hip.add(leg);legs.add(hip);}
    figure.add(legs);
  }
  // The arms (the two cylinders reaching for the wheel) hang from shoulders by the sides.
  for(const arm of [...figure.children])if(arm instanceof T.Mesh&&arm.geometry instanceof T.CylinderGeometry&&Math.abs(arm.rotation.x)>.5){
    const shoulder=new T.Group();shoulder.name='driver_shoulder';shoulder.position.set(Math.sign(arm.position.x)*.24,-DRIVER.head-.02,-.02);figure.add(shoulder);
    shoulder.add(arm);arm.rotation.set(.08,0,0);arm.position.set(0,-.18,0);}
  figure.rotation.set(0,0,0);delete figure.userData.sway;
  // Eyes front again (the visor turns about the helmet).
  const visor=figure.children[1];if(visor)visor.rotation.y=Math.PI/2;delete figure.userData.look;
}
/** Takes the driver figure out of car into scene beside its driver's door, standing on height(x, z); returns the walk to make. */
export function bailOut(figure:T.Object3D,car:T.Object3D,scene:T.Object3D,height:(x:number,z:number)=>number){
  car.updateWorldMatrix(true,false);
  const side=new T.Vector3(Math.sign(figure.position.x)||-1,0,0).transformDirection(car.matrixWorld);side.y=0;if(side.lengthSq()<1e-6)side.set(1,0,0);side.normalize();
  const centre=new T.Vector3().setFromMatrixPosition(car.matrixWorld),from=centre.clone().addScaledVector(side,BAIL.door),to=centre.clone().addScaledVector(side,BAIL.door+BAIL.walk);
  // Out of the car they are seen, even if a camera inside the car had hidden them.
  scene.add(figure);figure.visible=true;standUp(figure);
  const walk={from,to,time:0,facing:Math.atan2(-side.x,-side.z),height};figure.userData.bail=walk;placeWalker(figure,0);
  return walk;
}
/** Moves a bailed-out driver along their walk for dt (a slight bob and leg swing while walking), stands them still waving for a
 * while, then takes them away once they have watched long enough. True on the frame they get clear (for the crowd's cheer). */
export function strollAway(figure:T.Object3D,dt:number){
  const walk=figure.userData.bail;if(!walk||!(dt>0)||!figure.visible)return false;
  if(walk.time>=BAIL.stroll){walk.watched=(walk.watched??0)+dt;wave(figure,walk.watched);if(walk.watched>=BAIL.watch)figure.visible=false;return false;}
  walk.time=Math.min(BAIL.stroll,walk.time+dt);placeWalker(figure,walk.time/BAIL.stroll);
  if(walk.time>=BAIL.stroll){wave(figure,0);return true;}return false;
}
/** The arm on the figure's +x side up over the head, waving side to side, for BAIL.wave seconds of watching; then down. */
function wave(figure:T.Object3D,t:number){
  const shoulder=figure.children.find(o=>o.name==='driver_shoulder'&&o.position.x>0);if(!shoulder)return;
  shoulder.rotation.z=t<BAIL.wave?2.5+Math.sin(t*9)*.3*Math.min(1,t*4):0;
}
function placeWalker(figure:T.Object3D,t:number){
  const walk=figure.userData.bail,at=walk.from.clone().lerp(walk.to,t),moving=t<1,phase=walk.time/BAIL.stroll*Math.PI*2*BAIL.walk/BAIL.stride/2;
  const ground=walk.height(at.x,at.z),stand=(Number.isFinite(ground)?ground:at.y)-BODY_BOTTOM+BAIL.leg;
  figure.position.set(at.x,stand+(moving?Math.abs(Math.sin(phase))*.03:0),at.z);
  // Walking away from the car, then turned round to watch it.
  figure.rotation.set(0,moving?walk.facing+Math.PI:walk.facing,0);
  const legs=figure.getObjectByName('driver_legs');if(legs)legs.children.forEach((leg,i)=>{leg.rotation.x=moving?Math.sin(phase+(i?Math.PI:0))*.45:0;});
}
