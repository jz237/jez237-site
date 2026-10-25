/** A breeze over each offline event: from a random direction at WIND.min–WIND.max m/s (WIND.rain times that in the rain),
 * gusting by up to WIND.gust either way. Smoke, steam and vapour drift with it, fire smoke leans with it (WIND.fire of its
 * speed), the rain slants with it and the derby flags stream in it. Online events keep the old still air. */
export const WIND={min:.6,max:2.4,rain:1.35,gust:.35,fire:.6} as const;
export type Breeze={x:number;z:number};
/** A fresh breeze for an event (m/s, world x and z). */
export function eventWind(random:()=>number,raining:boolean):Breeze{
  const a=random()*Math.PI*2,s=(WIND.min+random()*(WIND.max-WIND.min))*(raining?WIND.rain:1);return {x:Math.cos(a)*s,z:Math.sin(a)*s};
}
/** The breeze at time t (seconds), gusting slowly about its base. */
export function gusting(base:Breeze,t:number,out:Breeze){
  const g=Number.isFinite(t)?1+WIND.gust*Math.sin(t*.23)*Math.sin(t*.61+1.1):1;out.x=base.x*g;out.z=base.z*g;return out;
}
