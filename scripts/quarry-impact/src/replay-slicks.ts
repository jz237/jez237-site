import type * as T from 'three';
import {FluidSlicks} from './fluid-leaks';
import type {ReplayDrip} from './replay-data';
/** Rebuilds recorded oil and coolant drips under the replay playhead: forward play adds the new drips,
 * a backwards seek starts again from the first one. Fading follows the recorded drip times. */
export class ReplaySlicks{
  readonly slicks:FluidSlicks;
  private index=0;private clock=0;
  constructor(private drips:readonly ReplayDrip[],scene:T.Scene){this.slicks=new FluidSlicks(scene);}
  update(time:number){
    if(!Number.isFinite(time))return;
    if(time<this.clock-1e-6){this.slicks.reset();this.index=0;this.clock=0;}
    while(this.index<this.drips.length&&this.drips[this.index].time<=time){
      const d=this.drips[this.index++];
      this.slicks.advance(d.time-this.clock);this.clock=Math.max(this.clock,d.time);
      this.slicks.drip(d.position[0],d.position[1],d.position[2],d.kind,d.seed);
    }
    this.slicks.advance(time-this.clock);this.clock=time;
  }
  dispose(){this.slicks.dispose();}
}
