/** Pile-ups (offline): car-on-car impacts (closing PILEUP.closing m/s or more) within PILEUP.window seconds of each other and
 * PILEUP.radius m of the newest one, linked through the cars they share, make one cluster; at PILEUP.cars cars it is called a
 * PILE-UP, credited to whoever was going fastest into its first impact (PILEUP.points a car in scored derbies). The same pile-up
 * is called again only once it has grown by PILEUP.grow more cars; it is over once nothing has hit in it for PILEUP.window. */
export const PILEUP={closing:3,window:1.5,radius:12,cars:4,grow:2,points:5} as const;
type Impact={a:number;b:number;time:number;x:number;z:number;by:number};
export type PileUpCall={size:number;cars:number[];starter:number};
export class PileUp{
  private impacts:Impact[]=[];private called:{cars:Set<number>;size:number;time:number}[]=[];
  reset(){this.impacts=[];this.called=[];}
  /** Note an impact between cars a and b at (x,z), `by` the faster of the two; returns a pile-up to call when one forms or grows. */
  note(a:number,b:number,time:number,x:number,z:number,by:number,closing:number):PileUpCall|null{
    if(a===b||![time,x,z,closing].every(Number.isFinite)||closing<PILEUP.closing)return null;
    this.impacts=this.impacts.filter(i=>time-i.time>=0&&time-i.time<=PILEUP.window);this.impacts.push({a,b,time,x,z,by});
    const cars=new Set([a,b]),linked:Impact[]=[];let grew=true;
    while(grew){grew=false;for(const i of this.impacts){if(linked.includes(i)||Math.hypot(i.x-x,i.z-z)>PILEUP.radius||!cars.has(i.a)&&!cars.has(i.b))continue;linked.push(i);for(const id of [i.a,i.b])if(!cars.has(id)){cars.add(id);grew=true;}}}
    this.called=this.called.filter(c=>time-c.time<=PILEUP.window);
    const before=this.called.find(c=>[...cars].some(id=>c.cars.has(id)));
    if(before){for(const id of cars)before.cars.add(id);before.time=time;}
    if(cars.size<PILEUP.cars||before&&cars.size<before.size+PILEUP.grow)return null;
    if(before)before.size=cars.size;else this.called.push({cars:new Set(cars),size:cars.size,time});
    const first=linked.reduce((p,q)=>q.time<p.time?q:p);
    return{size:cars.size,cars:[...cars].sort((p,q)=>p-q),starter:first.by};
  }
}
