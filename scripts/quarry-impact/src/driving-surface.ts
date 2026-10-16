/** Quarry tyre balance. Existing asphalt/gravel coefficients remain exact. */
export type DrivingSurface='asphalt'|'gravel'|'mud';
export const surfaceGrip=(surface:DrivingSurface)=>surface==='asphalt'?3.2:surface==='mud'?1.9:2.4;
