export const GRAPHICS_LEVELS=['medium','high','ultra'] as const;
export type GraphicsLevel=typeof GRAPHICS_LEVELS[number];
export type GraphicsChoice=GraphicsLevel|'auto';
export function graphicsChoice(value:unknown):GraphicsChoice{return value==='medium'||value==='high'||value==='ultra'?value:'auto';}
/** Sustained frame pacing controls only rendering. Physics and entrants stay intact.
 * A slow three-second window reduces one level; upgrades require twenty seconds
 * of headroom. Warm-up after switches and pauses prevents rapid oscillation.
 * Each second is judged by its median frame, not its mean: a few long hitches (the
 * opening pile-up denting every car at once) must not cost the whole event its detail. */
export class AdaptiveGraphics{
 private choice:GraphicsChoice='auto';private level=1;private warmup=3;
 private elapsed=0;private frames=0;private fast=0;private slow=0;private readonly times:number[]=[];
 get quality():GraphicsLevel{return GRAPHICS_LEVELS[this.level];}
 configure(value:unknown){const next=graphicsChoice(value);if(next===this.choice)return;this.choice=next;this.level=next==='auto'?1:GRAPHICS_LEVELS.indexOf(next);this.reset();}
 private reset(){this.warmup=3;this.elapsed=this.frames=this.fast=this.slow=0;this.times.length=0;}
 sample(milliseconds:number,active:boolean):boolean{
  if(this.choice!=='auto')return false;
  if(!active||!Number.isFinite(milliseconds)||milliseconds<=0||milliseconds>=1000){this.reset();return false;}
  const seconds=milliseconds/1000;
  if(this.warmup>0){this.warmup-=seconds;return false;}
  this.elapsed+=seconds;this.frames++;this.times.push(milliseconds);
  if(this.elapsed<1)return false;
  const sorted=this.times.sort((a,b)=>a-b),typical=sorted[Math.floor(sorted.length/2)],duration=this.elapsed;this.elapsed=this.frames=0;this.times.length=0;
  this.slow=typical>26?this.slow+duration:0;this.fast=typical<18.5?this.fast+duration:0;
  if(this.slow>=3&&this.level>0){this.level--;this.reset();return true;}
  if(this.fast>=20&&this.level<2){this.level++;this.reset();return true;}
  return false;
 }
}
