/** Dust trails (offline): a car driving over dry gravel faster than DUST.speed m/s kicks dust up off its rear tyres, a
 * plume that hangs behind it — DUST.rate puffs a second per tyre at DUST.full m/s, fewer slower. None on asphalt or mud,
 * and none in the rain: wet gravel stays down. */
export const DUST={speed:7,full:22,rate:16,trail:.25,lift:.9,size:.9,puff:[1.3,2.6],life:[2,3.4],tint:0xd2c6ad} as const;
/** Dust puffs a second off one rear tyre at this speed (m/s) on this surface, wet or dry. */
export function dustRate(speed:number,surface:string,wet:boolean){
  const v=Math.abs(Number.isFinite(speed)?speed:0);if(wet||surface!=='gravel'||v<=DUST.speed)return 0;
  return DUST.rate*Math.min(1,(v-DUST.speed)/(DUST.full-DUST.speed));
}
