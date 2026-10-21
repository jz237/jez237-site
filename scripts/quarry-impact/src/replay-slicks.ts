import type * as T from 'three';
import {FluidSlicks} from './fluid-leaks';
import {PropFires,type PropKind} from './prop-fires';
import type {ReplayDrip} from './replay-data';
/** Rebuilds recorded oil, coolant and fuel drips and puddle fires under the replay playhead: forward play
 * adds the new ones, a backwards seek starts again from the first. Fire does not spread on its own here:
 * every recorded ignition (spread included) is applied at its time, so the burn matches the live event. */
export class ReplaySlicks{
  readonly slicks:FluidSlicks;
  /** Loose tyres and drums that caught fire, from the recorded ignitions; propKinds come from the replay's props. */
  readonly props=new PropFires();
  propKinds:PropKind[]=[];
  private index=0;private clock=0;
  constructor(private drips:readonly ReplayDrip[],scene:T.Scene){this.slicks=new FluidSlicks(scene);this.slicks.spread=false;this.props.simulate=false;}
  update(time:number){
    if(!Number.isFinite(time))return;
    if(time<this.clock-1e-6){this.slicks.reset();this.props.reset();this.index=0;this.clock=0;}
    while(this.index<this.drips.length&&this.drips[this.index].time<=time){
      const d=this.drips[this.index++];
      this.slicks.advance(d.time-this.clock);this.clock=Math.max(this.clock,d.time);
      // An ignition's seed records whether it was raining (0.5) or dry (0), which sets how long it burns.
      if(d.kind===4){const i=Math.round(d.seed*1000);this.props.ignite(i,this.propKinds[i]??'tyre',d.time);}
      else if(d.kind===3){this.slicks.wet=d.seed>=.5;this.slicks.igniteAt(d.position[0],d.position[2],.05,false);}
      else this.slicks.drip(d.position[0],d.position[1],d.position[2],d.kind,d.seed);
    }
    this.slicks.advance(time-this.clock);this.clock=time;
  }
  dispose(){this.slicks.dispose();}
}
