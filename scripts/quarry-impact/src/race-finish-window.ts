/** Unadjusted first crossing starts a bounded wait for the remaining field. */
export const RACE_FINISH_WINDOW=60;
type Finisher={finished:boolean;finishTime:number;penalty:number};
export function raceFinishRemaining(cars:readonly Finisher[],elapsed:number):number|null{
 let first=Infinity;
 for(const car of cars)if(car.finished&&Number.isFinite(car.finishTime)&&Number.isFinite(car.penalty)){
  const crossing=car.finishTime-car.penalty;
  if(crossing>=0&&crossing<=elapsed)first=Math.min(first,crossing);
 }
 return first===Infinity?null:Math.max(0,first+RACE_FINISH_WINDOW-elapsed);
}
