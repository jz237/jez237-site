/** Oil burners (offline): an old banger's worn valve seals let oil seep into its cylinders while it coasts, and it burns off
 * blue-grey out of the tailpipe when the driver floors it again. After OIL_BURN.lift s off the pedal (under OIL_BURN.coast),
 * flooring it (past OIL_BURN.floor) coughs a puff of OIL_BURN.puffs particles, more the older the car; held flat out (past
 * OIL_BURN.full) it trails a thin haze, up to OIL_BURN.haze particles a second. Cars younger than OIL_BURN.age burn none. */
export const OIL_BURN={age:.45,lift:.8,coast:.15,floor:.6,puffs:[3,10],full:.92,haze:3,size:.45,puff:[.8,1.4],life:[1.3,2.3],back:1.2,tint:0x7d8a9c} as const;
/** A car's engine: how long it has coasted, its haze clock, and the puffs it has burnt (QA). */
export type Burner={lifted:number;haze:number;puffs:number};
export const burner=():Burner=>({lifted:0,haze:0,puffs:0});
/** Blue smoke particles from one step of a car this old (0–1) at this pedal over dt s. */
export function burnOil(s:Burner,age:number,throttle:number,dt:number){
  const t=Number.isFinite(dt)?Math.max(0,Math.min(.25,dt)):0,pedal=Number.isFinite(throttle)?throttle:0;
  if(!(age>=OIL_BURN.age)||!Number.isFinite(age)){s.lifted=s.haze=0;return 0;}
  const wear=Math.min(1,(age-OIL_BURN.age)/(1-OIL_BURN.age));let n=0;
  if(pedal<OIL_BURN.coast){s.lifted+=t;s.haze=0;return 0;}
  if(pedal>=OIL_BURN.floor&&s.lifted>=OIL_BURN.lift)n+=Math.round(OIL_BURN.puffs[0]+(OIL_BURN.puffs[1]-OIL_BURN.puffs[0])*wear);
  s.lifted=0;
  if(pedal>=OIL_BURN.full){s.haze+=t*OIL_BURN.haze*wear;const whole=Math.floor(s.haze);n+=whole;s.haze-=whole;}else s.haze=0;
  return n;
}
