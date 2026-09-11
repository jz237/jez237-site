import * as T from 'three';
export type Panels={coin:boolean;controls:boolean;rear:boolean};
export type Demonstration={kind:'coin'|'button'|'joystick';serial:number}|null;
export const closedPanels:Panels={coin:false,controls:false,rear:false};
export const closeups=[['joystick','Joystick & contacts'],['button_2','Fire button & leaf switch'],['leaf_2','Fire leaf-switch contacts'],['joystick_contact_0','Joystick contacts'],['coin_return_left','Coin return'],['coin_demo_anchor','Coin acceptor & chute'],['control_harness_plug','Control harness connector'],['coin_harness_plug','Coin-door connector'],['rear_service','Rear service opening']] as const;
export function mechanismPose(kind:string,elapsed:number){
 const t=Math.max(0,elapsed);const press=kind==='button'&&t<3?Math.max(0,Math.sin(Math.PI*t)):0;
 return {press,joystick:kind==='joystick'&&t<4?Math.sin(t*Math.PI)*.24:0,coin:Math.min(1,t/2.4),done:t>=(kind==='joystick'?4:kind==='coin'?2.4:3)};
}
export function harnessCurve(a:T.Vector3,b:T.Vector3,branch=0){
 const slack=Math.max(.10,a.distanceTo(b)*.14);const middle=a.clone().lerp(b,.5);
 middle.y-=slack;middle.z+=.08+branch*.009;
 return new T.CatmullRomCurve3([a,a.clone().lerp(middle,.55).add(new T.Vector3(.025,0,.035)),middle,b.clone().lerp(middle,.55).add(new T.Vector3(-.025,0,.035)),b]);
}
/** Camera-relative pan plus smooth distance loss and the cabinet's rear acoustic shadow. */
export function speakerMix(distance:number,side:number,facing:number){
 const front=Math.max(0,Math.min(1,(facing+1)/2));
 return {pan:Math.max(-.85,Math.min(.85,side)),gain:Math.max(.12,1/(1+Math.max(0,distance-1.2)*.34))*(.62+.38*front),cutoff:2400+12600*front};
}
