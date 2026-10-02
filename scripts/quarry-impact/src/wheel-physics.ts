import {tyreFailure} from './tyre-condition';
const clamp=(n:number,min:number,max:number)=>Math.max(min,Math.min(max,n));
export function wheelResponse(damage:number,side:number,speed:number,radius=.375,tyreDamage?:number,flatRadius=radius*.70){
  const d=clamp(Number.isFinite(damage)?damage:0,0,1),failure=d*d;
  const response={stiffness:30*(1-.5*d),rest:.36*(1-.3*failure),radius:radius*(1-.13*failure),
    force:13000*(1-.42*d),grip:1-.38*d,sideGrip:1.1*(1-.44*d),
    toe:side*failure*.15,camber:-side*d*.22,
    drag:failure*(7+Math.min(32,Math.abs(speed))*1.35),power:1-.24*d};
  const flat=tyreFailure(tyreDamage);
  // The old corner-damage curve can sink modern rims through the road. A
  // present tyre model has a measured geometric floor even before puncture;
  // legacy saves retain their original radius. Deflation only reduces radius.
  if(Number.isFinite(tyreDamage))response.radius=Math.max(response.radius,flatRadius);
  if(flat>0){
    response.radius+=(flatRadius-response.radius)*flat;
    response.grip*=1-.68*flat;response.sideGrip*=1-.60*flat;
  }
  return response;
}
