/** A supported arrival: brake, place the final paw, then relax the trunk.
 * These envelopes are conservative animation estimates, not muscle dynamics. */
export class RestTransition {
  settled=0;
  readiness=1;
  private wasResting=false;
  update(dt:number,resting:boolean,transferring:boolean,speed:number,turn:number) {
    const supported=!transferring&&Math.abs(speed)<.008&&Math.abs(turn)<.10;
    this.settled=resting&&supported?Math.min(4,this.settled+dt):0;
    if(this.wasResting&&!resting)this.readiness=.25;
    this.readiness=Math.min(1,this.readiness+dt/ .3);
    this.wasResting=resting;
    return {bodyRate:resting?(this.settled<.25?0:1.6):4,
      headRate:resting?3:7,breathRate:resting?.8:2,
      advance:this.readiness,adjust:resting&&this.settled>.5&&this.settled<1.5};
  }
}
