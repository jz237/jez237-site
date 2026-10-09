import * as T from 'three';
import type {DemoCamera} from './demo-director';
export type AudioPerspective={id:number;view:DemoCamera};
/** Remote broadcast views retain a nearby listening point around their subject.
 * Trackside and orbit cameras keep their actual world-space listening position. */
export function audioListenerPosition(camera:T.Vector3,focus:T.Vector3|undefined,view?:AudioPerspective['view']){
 if(!focus||!['overview','drone','chase'].includes(view??''))return camera.clone();
 const offset=camera.clone().sub(focus),distance=offset.length();
 return distance>18?focus.clone().addScaledVector(offset,18/distance):camera.clone();
}
/** Camera switches, recovery teleports and pause gaps must not create Doppler. */
export class AudioListenerMotion{
 private previous:T.Vector3|null=null;
 private key='';
 reset(){this.previous=null;this.key='';}
 velocity(position:T.Vector3,dt:number,key:string){
  const velocity=new T.Vector3();
  if(this.previous&&this.key===key&&Number.isFinite(dt)&&dt>0&&dt<=.25){
   velocity.copy(position).sub(this.previous).divideScalar(dt);
   if(velocity.length()>120)velocity.set(0,0,0);
  }
  this.previous=position.clone();this.key=key;return velocity;
 }
}
