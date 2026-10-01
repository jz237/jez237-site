const clamp=(n:number,min:number,max:number)=>Math.max(min,Math.min(max,n));
export function wheelResponse(damage:number,side:number,speed:number){
  const d=clamp(Number.isFinite(damage)?damage:0,0,1),failure=d*d;
  return {stiffness:30*(1-.5*d),rest:.36*(1-.3*failure),radius:.375*(1-.13*failure),
    force:13000*(1-.42*d),grip:1-.38*d,sideGrip:1.1*(1-.44*d),
    toe:side*failure*.15,camber:-side*d*.22,
    drag:failure*(7+Math.min(32,Math.abs(speed))*1.35),power:1-.24*d};
}
