import * as T from 'three';

/** Spark light (offline): a shower of sparks lights up what is round it — the floor, the cars — in an orange flash that
 * dies away in SPARK_LIGHT.fade s. One light (always there, dark between flashes, so the lighting never changes shape):
 * a burst of SPARK_LIGHT.full sparks or more flashes it at SPARK_LIGHT.intensity, fewer less, and a weaker burst never
 * outshines a brighter one still glowing. */
export const SPARK_LIGHT={intensity:25,distance:9,decay:2,full:14,min:4,fade:.16,lift:.25,colour:0xffa04a} as const;
/** How bright a flash is for a burst of this many sparks (0 for too few). */
export const sparkFlash=(count:number)=>Number.isFinite(count)&&count>=SPARK_LIGHT.min?SPARK_LIGHT.intensity*Math.min(1,count/SPARK_LIGHT.full):0;
export class SparkLight{
  readonly light:T.PointLight;
  flashes=0;
  constructor(parent:T.Object3D){this.light=new T.PointLight(SPARK_LIGHT.colour,0,SPARK_LIGHT.distance,SPARK_LIGHT.decay);this.light.name='spark-light';this.light.castShadow=false;parent.add(this.light);}
  /** A burst of `count` sparks at `at`. */
  flash(at:T.Vector3,count:number){const i=sparkFlash(count);if(i<=0||i<this.light.intensity)return;this.light.position.copy(at);this.light.position.y+=SPARK_LIGHT.lift;this.light.intensity=i;this.flashes++;}
  step(dt:number){if(!(dt>0)||this.light.intensity<=0)return;this.light.intensity*=Math.exp(-dt*4.6/SPARK_LIGHT.fade);if(this.light.intensity<.05)this.light.intensity=0;}
  reset(){this.light.intensity=0;}
}
