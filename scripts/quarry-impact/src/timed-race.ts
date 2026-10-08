import type {EventOptions,RoutePoint} from './event-rules';
import type {DemoOptions} from './demo-session';
/** Local circuit rule; fixed challenges, championships and online retain their rules. */
export function timedRaceLimit(mode:string,custom:boolean,demo:boolean,format:string,event:EventOptions,options:DemoOptions):number{
 return mode==='race'&&custom&&format==='laps'?(demo?options.raceDuration:event.raceDuration)??0:0;
}
export function timedRaceFinished(passed:number,elapsed:number,limit:number):boolean{return limit>0&&elapsed>=limit&&passed>0&&passed%24===0;}
type Entrant={id:number;passed:number;nextCheckpoint:number;current:RoutePoint;finished:boolean;finishTime:number;health:number};
export function timedRaceOrder<T extends Entrant>(cars:readonly T[],route:(id:number)=>readonly RoutePoint[]):T[]{
 const remaining=(c:T)=>{const p=route(c.id)[c.nextCheckpoint];return Math.hypot(c.current.x-p.x,c.current.z-p.z);};
 return [...cars].sort((a,b)=>Number(b.finished)-Number(a.finished)||b.passed-a.passed||(a.finished&&b.finished?a.finishTime-b.finishTime:remaining(a)-remaining(b))||a.id-b.id);
}
export function timedRaceResult(car:Entrant):string{
 const laps=Math.max(0,Math.floor(car.passed/24));
 return `${laps} ${laps===1?'LAP':'LAPS'} · ${car.finished?car.finishTime.toFixed(2)+'s incl. penalties':car.health<=0?'RETIRED':'DNF'}`;
}
/** Separate record category: more completed laps first, then lower adjusted time. */
export function timedRaceRecordScore(car:Entrant):number{return Math.floor(car.passed/24)*100000-Math.min(99999,car.finishTime);}
