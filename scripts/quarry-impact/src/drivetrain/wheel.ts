export type WheelState={omega:number;angle:number};
export type WheelStep={dt:number;radius:number;inertia:number;driveTorque:number;brakeTorque:number;grounded:boolean;speed:number;inverseMass:number;normalLoad:number;friction:number;lateralImpulse:number};
const brake=(omega:number,budget:number)=>Math.abs(omega)<=budget?0:Math.sign(omega)*(Math.abs(omega)-budget);
/** Impulse solve with wheel inertia, brake complementarity and a shared friction circle.
 * Positive impulse accelerates the chassis along the wheel's rolling direction;
 * its equal/opposite torque slows the wheel. State uses radians and SI units. */
export function stepWheel(state:WheelState,p:WheelStep){
 if(!Object.values(p).every(v=>typeof v==='boolean'||Number.isFinite(v))||!Number.isFinite(state.omega)||!Number.isFinite(state.angle)||p.dt<=0||p.radius<=0||p.inertia<=0||p.inverseMass<0||p.brakeTorque<0||p.normalLoad<0||p.friction<0)throw new RangeError('Invalid wheel step');
 const driven=state.omega+p.driveTorque*p.dt/p.inertia,braking=p.brakeTorque*p.dt/p.inertia;
 const limit=p.grounded?Math.sqrt(Math.max(0,(p.normalLoad*p.friction*p.dt)**2-p.lateralImpulse**2)):0;
 const endOmega=(impulse:number)=>brake(driven-impulse*p.radius/p.inertia,braking);
 const residual=(impulse:number)=>endOmega(impulse)*p.radius-p.speed-impulse*p.inverseMass;
 let impulse=0;
 if(limit>0){
  let lo=-limit,hi=limit;
  if(residual(lo)<=0)impulse=lo;
  else if(residual(hi)>=0)impulse=hi;
  else{for(let n=0;n<48;n++){const mid=(lo+hi)/2;if(residual(mid)>0)lo=mid;else hi=mid;}impulse=(lo+hi)/2;}
 }
 const omega=endOmega(impulse),slip=omega*p.radius-(p.speed+impulse*p.inverseMass);
 state.angle+=(state.omega+omega)*.5*p.dt;state.omega=omega;
 return{impulse,slip,limit,omega};
}
