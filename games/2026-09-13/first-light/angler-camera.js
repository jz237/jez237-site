// First person from the kayak seat. The hull's pitch and roll reach the eye through a steadiness
// factor (the Steady camera option and prefers-reduced-motion damp them), the look is a damped
// yaw/pitch offset from the heading, and nothing ever rolls the horizon on purpose.
import * as T from './vendor/three.module.js';
import {KAYAK} from './kayak.js';
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export function createLook(){return {yaw:0,pitch:-.08,targetYaw:0,targetPitch:-.08};}
export function lookDrag(look,dx,dy){look.targetYaw=clamp(look.targetYaw-dx*.0042,-2.7,2.7);look.targetPitch=clamp(look.targetPitch-dy*.0034,-.62,.58);}
export function lookStick(look,x,y,dt){look.targetYaw=clamp(look.targetYaw-x*2.3*dt,-2.7,2.7);look.targetPitch=clamp(look.targetPitch-y*1.7*dt,-.62,.58);}
const q=new T.Quaternion(),e=new T.Euler(),offset=new T.Vector3();
export function updateAnglerCamera(camera,state,look,dt,{steady=0}={}){
 const k=1-Math.exp(-dt*9);look.yaw+=(look.targetYaw-look.yaw)*k;look.pitch+=(look.targetPitch-look.pitch)*k;
 const damp=1-steady*.85;
 e.set(state.pitch*damp,state.heading,state.roll*damp,'YXZ');q.setFromEuler(e);
 offset.set(0,KAYAK.eyeHeight,KAYAK.eyeForward).applyQuaternion(q);
 camera.position.set(state.x+offset.x,state.y+.02+offset.y,state.z+offset.z);
 // Three cameras look down local -z while the kayak's bow is +z: a half-turn of yaw puts the eye over the bow.
 e.set(look.pitch,look.yaw+Math.PI,0,'YXZ');const ql=new T.Quaternion().setFromEuler(e);
 camera.quaternion.copy(q).multiply(ql);
}
