/** Tyres crunch over the crash litter (offline): a wheel rolling at speed or faster over min or more chips within radius metres
 * crunches, louder for more chips and more speed (volume at 8 chips and 8 m/s), no more often than every gap seconds per car. */
export const CRUNCH={radius:.3,min:2,speed:1.5,gap:.22,volume:.5,duration:.8} as const;
/** How loud a wheel over chips chips at speed (m/s, either way) crunches; 0 for no crunch. */
export function crunchVolume(chips:number,speed:number){
  const v=Math.abs(Number.isFinite(speed)?speed:0);if(!(chips>=CRUNCH.min)||v<CRUNCH.speed)return 0;
  return CRUNCH.volume*Math.min(1,chips/8)*Math.min(1,v/8);
}
