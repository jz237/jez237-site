/** Quarry tyre balance. Existing asphalt/gravel coefficients remain exact when dry. */
export type DrivingSurface='asphalt'|'gravel'|'mud';
let wetness=0;
/** Rain makes tarmac slick (up to 18% less grip) and loose surfaces a little worse (10%). Local events only; 0 = dry. */
export function setWetness(value:number){wetness=Number.isFinite(value)?Math.max(0,Math.min(1,value)):0;}
export const currentWetness=()=>wetness;
export const surfaceGrip=(surface:DrivingSurface)=>(surface==='asphalt'?3.2:surface==='mud'?1.9:2.4)*(1-wetness*(surface==='asphalt'?.18:.1));
