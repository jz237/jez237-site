/** How a car was finished (offline events), for the standings: the most telling cause first. */
export type WreckCauseState={engineOut:boolean;fireHeat:number;wheelsLost:number;seized:boolean;fuel:number};
export const BURNT_OUT=.4;
export function wreckCause(s:WreckCauseState){
  if(s.engineOut)return 'ENGINE OUT';
  if(s.fireHeat>BURNT_OUT)return 'BURNT OUT';
  if(s.wheelsLost>=2)return 'NO WHEELS';
  if(s.seized)return 'SEIZED';
  if(Number.isFinite(s.fuel)&&s.fuel<=0)return 'NO FUEL';
  return 'WRECKED';
}
