import * as T from 'three';

/** Wake dust (offline): the low-pressure wake behind a car driving through its own dust plume coats its tail — the rear
 * glass, the tailgate or boot, the rear bumper — in a film of dust, thickest at the very back and gone WAKE.reach m forward
 * of it. It builds while the car raises a dust plume on dry gravel (WAKE.rate of the way to WAKE.max a second with a full
 * plume), and the rain rinses it off (WAKE.rinse of it a second in a full downpour). Every car starts the event a little
 * dusty (WAKE.start, its own amount). */
export const WAKE={reach:1.15,rate:.08,max:.75,rinse:.05,start:[.06,.18],tint:0x8a7f6b} as const;
/** Grimy lamps (offline): a lamp under the dust film (wake or settled) or body dirt glows dimmer through it — down by
 * LAMP_GRIME.dust of the film and LAMP_GRIME.dirt of the dirt, LAMP_GRIME.most at most. */
export const LAMP_GRIME={dust:.7,dirt:.5,most:.75} as const;
export function startingWake(id:number){
  const n=Number.isFinite(id)?id:0,r=Math.abs(Math.sin(n*78.233+1.733)*43758.5453)%1;
  return WAKE.start[0]+r*(WAKE.start[1]-WAKE.start[0]);
}
/** The dust after dt seconds with this much of a full dust plume (0–1) behind the car and this hard a rain (0–1). */
export function wakeDustStep(level:number,dt:number,plume:number,rain:number){
  const t=Number.isFinite(dt)?Math.max(0,Math.min(1,dt)):0,p=Number.isFinite(plume)?Math.max(0,Math.min(1,plume)):0,r=Number.isFinite(rain)?Math.max(0,Math.min(1,rain)):0;
  let l=Number.isFinite(level)?Math.max(0,Math.min(WAKE.max,level)):0;
  l+=t*WAKE.rate*p*(WAKE.max-l);
  l*=Math.exp(-t*WAKE.rinse*r);
  return l;
}
/** The back of the bodywork along the car (the least z of its panels) in the car model's own frame. */
export function rearOf(model:T.Object3D,panels:readonly T.Mesh[]){
  model.updateMatrixWorld(true);
  const inverse=model.matrixWorld.clone().invert(),box=new T.Box3(),body=new T.Box3();
  for(const p of panels)body.union(box.setFromObject(p).applyMatrix4(inverse));
  return body.isEmpty()?null:body.min.z;
}
