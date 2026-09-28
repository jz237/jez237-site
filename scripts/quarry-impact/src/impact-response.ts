type Vec={x:number;y:number;z:number};
/** Presentation only: exact damped-spring integration never changes physics,
 * damage, controls or simulation time. Kick amplitudes are bounded in pileups. */
export class ImpactResponse {
  offset:Vec={x:0,y:0,z:0}; velocity:Vec={x:0,y:0,z:0};
  roll=0; pitch=0; private rollVelocity=0;private pitchVelocity=0;
  kick(direction:Vec,damage:number,lateral:number,longitudinal:number) {
    const amount=Math.min(1,Math.max(0,(damage-.8)/24));if(!amount)return;
    const length=Math.hypot(direction.x,direction.y,direction.z)||1;
    for(const key of ['x','y','z']as const)this.velocity[key]+=direction[key]/length*amount*.95;
    const speed=Math.hypot(this.velocity.x,this.velocity.y,this.velocity.z);
    if(speed>2.2)for(const key of ['x','y','z']as const)this.velocity[key]*=2.2/speed;
    this.rollVelocity=Math.max(-1.1,Math.min(1.1,this.rollVelocity-lateral*amount*.62));
    this.pitchVelocity=Math.max(-.8,Math.min(.8,this.pitchVelocity+longitudinal*amount*.36));
  }
  step(dt:number) {
    if(!(dt>0)||!Number.isFinite(dt))return this;
    const lambda=11.8,omega=22,damped=Math.sqrt(omega*omega-lambda*lambda),e=Math.exp(-lambda*dt),c=Math.cos(damped*dt),s=Math.sin(damped*dt);
    const evolve=(p:number,v:number)=>[e*(p*c+(v+lambda*p)/damped*s),e*(v*c-(lambda*v+omega*omega*p)/damped*s)];
    for(const k of ['x','y','z']as const){const [p,v]=evolve(this.offset[k],this.velocity[k]);this.offset[k]=p;this.velocity[k]=v;}
    [this.roll,this.rollVelocity]=evolve(this.roll,this.rollVelocity);
    [this.pitch,this.pitchVelocity]=evolve(this.pitch,this.pitchVelocity);
    return this;
  }
  reset(){this.offset={x:0,y:0,z:0};this.velocity={x:0,y:0,z:0};this.roll=this.pitch=this.rollVelocity=this.pitchVelocity=0;}
}

export function impactSoundLayers(damage:number,glass=false,debris=false){
  const severity=Math.max(0,Math.min(1,damage/30));
  const layers=[{id:damage>15?'impact-heavy':damage>5?'impact-medium':'impact-light',volume:.25+severity*.68,rate:1.02-severity*.11,delay:0,duration:damage>15?1.75:damage>5?1.15:.72}];
  if(glass)layers.push({id:'glass',volume:.16+severity*.12,rate:1.0,delay:.018,duration:1.2});
  if(debris)layers.push({id:'debris',volume:.17+severity*.12,rate:.96,delay:.085,duration:1.4});
  return layers;
}
