import type {FluidSlicks,GroundFire} from './fluid-leaks';
/** Loose tyres and oil drums catch from burning oil or fuel beside them (offline events only): a tyre
 * smoulders for about a minute under thick black smoke, a drum flares for half that. A burning prop
 * lights the puddles around it and the props it is stacked or leaning against. Positions follow the
 * props as they are knocked about, so the fire goes where the tyre rolls. */
export type PropKind='tyre'|'drum'|null;
export const PROP_FIRE={reach:.5,spread:2,neighbour:1.1,tyre:{burn:55,radius:.5},drum:{burn:30,radius:.42}} as const;
/** A burning drum goes up 8–20 s after it catches (fixed per drum, so replays match): a fireball and a blast. */
export const DRUM_BLAST={after:8,spread:12,radius:6,damage:14,fireball:1.6,size:1.7} as const;
export const drumBlastTime=(index:number,start:number)=>start+DRUM_BLAST.after+DRUM_BLAST.spread*((index*.61803+.1)%1);
export type PropPoint={x:number;y:number;z:number;kind:PropKind};
/** Tyre stacks are tori, drums and barrels cylinders; anything else does not burn. */
export function propKind(geometryType:string|undefined):PropKind{return geometryType==='TorusGeometry'?'tyre':geometryType==='CylinderGeometry'?'drum':null;}
export class PropFires{
  /** Burning props by index into the venue's prop list: when they caught and when they go out. */
  readonly burning=new Map<number,{start:number;end:number;kind:'tyre'|'drum';blast?:number}>();
  private blown=new Set<number>();
  /** Live events light props themselves; replays apply the recorded ignitions only. */
  simulate=true;
  onIgnite?:(index:number,p:PropPoint)=>void;
  reset(){this.burning.clear();this.blown.clear();}
  ignite(index:number,kind:PropKind,time:number,p?:PropPoint){
    if(!kind||this.burning.has(index))return false;
    const blast=kind==='drum'?drumBlastTime(index,time):undefined;
    this.burning.set(index,{start:time,end:blast!==undefined?blast+.6:time+PROP_FIRE[kind].burn,kind,...(blast!==undefined?{blast}:{})});if(p)this.onIgnite?.(index,p);return true;
  }
  /** Catch props standing in fire, spread between touching props, and set puddles round burning ones alight.
   * Returns the drums that blew up this step (live only). */
  update(time:number,props:readonly PropPoint[],slicks:FluidSlicks){
    const blasts:{index:number;p:PropPoint}[]=[];
    if(!this.simulate)return blasts;
    const fires=slicks.fires();
    if(fires.length)props.forEach((p,i)=>{
      if(!p.kind||this.burning.has(i))return;
      if(fires.some(f=>Math.hypot(f.x-p.x,f.z-p.z)<=f.radius+PROP_FIRE.reach&&Math.abs(f.y-p.y)<1.5))this.ignite(i,p.kind,time,p);
    });
    for(const [i,f] of [...this.burning]){
      const p=props[i];if(!p||time>=f.end||time-f.start<PROP_FIRE.spread)continue;
      if(f.blast!==undefined&&time>=f.blast&&!this.blown.has(i)){
        this.blown.add(i);blasts.push({index:i,p});slicks.igniteAt(p.x,p.z,3,false);
        props.forEach((q,j)=>{if(j!==i&&q.kind&&Math.hypot(q.x-p.x,q.z-p.z)<=3)this.ignite(j,q.kind,time,q);});
      }
      slicks.igniteAt(p.x,p.z,.6,false);
      props.forEach((q,j)=>{if(j!==i&&q.kind&&!this.burning.has(j)&&Math.hypot(q.x-p.x,q.z-p.z)<=PROP_FIRE.neighbour&&Math.abs(q.y-p.y)<1.2)this.ignite(j,q.kind,time,q);});
    }
    return blasts;
  }
  /** Flames and smoke to draw, at the props' current positions (drawn sooty, like burning oil). */
  fires(time:number,props:readonly PropPoint[]):GroundFire[]{
    const out:GroundFire[]=[];
    for(const [i,f] of this.burning){
      const p=props[i];if(!p)continue;
      if(f.blast!==undefined&&time>=f.blast&&time<f.blast+DRUM_BLAST.fireball)out.push({x:p.x,y:p.y,z:p.z,radius:DRUM_BLAST.size,start:f.blast,end:f.blast+DRUM_BLAST.fireball,kind:2,seed:(i*.377)%1});
      if(time<f.end)out.push({x:p.x,y:p.y-.15,z:p.z,radius:PROP_FIRE[f.kind].radius,start:f.start,end:f.end,kind:0,seed:(i*.61803)%1});
    }
    return out;
  }
}
