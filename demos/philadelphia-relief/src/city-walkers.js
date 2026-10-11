// Illustrative pedestrians follow the inside sidewalks of closed street blocks.
// Open roads, dead ends and narrow/ambiguous faces do not invent walking routes.
import { prepareInBatches } from './background-work.js?v=philly-2026092207';
const cross=(a,b)=>a.x*b.z-a.z*b.x;
const delta=(a,b)=>({x:b.x-a.x,z:b.z-a.z});
const mix=(a,b,t)=>({x:a.x+(b.x-a.x)*t,z:a.z+(b.z-a.z)*t});
const distance=(a,b)=>Math.hypot(b.x-a.x,b.z-a.z);
const hash=n=>((Math.imul(n|0,1664525)+1013904223)>>>0)/4294967296;

function inset(ring){
  const points=[];
  for(let i=0;i<ring.length;i++){
    const before=ring[(i+ring.length-1)%ring.length],after=ring[i],v=after.a;
    const a={x:before.dx,z:before.dz},b={x:after.dx,z:after.dz};
    const p={x:v.x-a.z*(before.width/2+.8),z:v.z+a.x*(before.width/2+.8)};
    const q={x:v.x-b.z*(after.width/2+.8),z:v.z+b.x*(after.width/2+.8)};
    const turn=cross(a,b);
    let point;
    if(Math.abs(turn)<.015){
      if(a.x*b.x+a.z*b.z<0||distance(p,q)>.6)return null;
      point=mix(p,q,.5);
    }else{
      const t=cross(delta(p,q),b)/turn;point={x:p.x+a.x*t,z:p.z+a.z*t};
    }
    if(distance(point,v)>Math.max(before.width,after.width)*1.8)return null;
    points.push(point);
  }
  // Offset streets can fold back at very short or acute corners. Exclude the
  // whole block rather than let a walker jump across the carriageway.
  for(let i=0;i<points.length;i++){
    const a=points[i],b=points[(i+1)%points.length],e=ring[i];
    if(distance(a,b)<1||((b.x-a.x)*e.dx+(b.z-a.z)*e.dz)<1)return null;
    for(let j=0;j<ring.length;j++){
      const edge=ring[j],point=mix(a,b,.5);
      const t=Math.max(0,Math.min(edge.length,(point.x-edge.a.x)*edge.dx+(point.z-edge.a.z)*edge.dz));
      if(Math.hypot(point.x-edge.a.x-edge.dx*t,point.z-edge.a.z-edge.dz*t)<edge.width/2+.3)return null;
    }
  }
  return points;
}

function roundedRoute(points){
  const corners=points.map((p,i)=>{
    const before=points[(i+points.length-1)%points.length],after=points[(i+1)%points.length];
    const radius=Math.min(.65,distance(before,p)*.2,distance(p,after)*.2);
    return {a:mix(p,before,radius/distance(before,p)),b:mix(p,after,radius/distance(p,after)),p};
  });
  const pieces=[];let length=0;
  const add=(a,b,p=null)=>{
    const samples=[0];let last=a;
    for(let i=1;i<=8;i++){
      const t=i/8,point=p?mix(mix(a,p,t),mix(p,b,t),t):mix(a,b,t);
      samples.push(samples.at(-1)+distance(last,point));last=point;
    }
    const span=samples.at(-1);
    pieces.push({a,b,p,start:length,length:span,samples});length+=span;
  };
  for(let i=0;i<corners.length;i++){
    const c=corners[i];add(c.a,c.b,c.p);add(c.b,corners[(i+1)%corners.length].a);
  }
  return {pieces,length};
}

export function* sidewalkRouteSteps(graph){
  const outgoing=new Map(),edges=[],dedupe=new Set(),roadCells=new Map();
  let work=0;
  for(const segment of graph.segments){
    if(++work%64===0)yield;
    const key=[segment.a.id,segment.b.id].sort((a,b)=>a-b).join(':');
    if(dedupe.has(key))continue;dedupe.add(key);
    const margin=segment.width/2+1;
    for(let x=Math.floor((Math.min(segment.a.x,segment.b.x)-margin)/50);
      x<=Math.floor((Math.max(segment.a.x,segment.b.x)+margin)/50);x++){
      for(let z=Math.floor((Math.min(segment.a.z,segment.b.z)-margin)/50);
        z<=Math.floor((Math.max(segment.a.z,segment.b.z)+margin)/50);z++){
        const key=`${x}:${z}`,bucket=roadCells.get(key)||[];
        bucket.push(segment);roadCells.set(key,bucket);
      }
    }
    for(const [a,b] of [[segment.a,segment.b],[segment.b,segment.a]]){
      const e={a,b,width:segment.width,length:segment.length,
        dx:(b.x-a.x)/segment.length,dz:(b.z-a.z)/segment.length,angle:Math.atan2(b.z-a.z,b.x-a.x)};
      edges.push(e);const bucket=outgoing.get(a.id)||[];bucket.push(e);outgoing.set(a.id,bucket);
    }
  }
  for(const bucket of outgoing.values()){
    if(++work%128===0)yield;
    bucket.sort((a,b)=>a.angle-b.angle);
  }
  for(const edge of edges){
    if(++work%128===0)yield;
    const choices=outgoing.get(edge.b.id),reverse=choices.findIndex(e=>e.b===edge.a);
    edge.next=choices[(reverse+choices.length-1)%choices.length];
  }
  const visited=new Set(),routes=[];
  for(const start of edges){
    if(++work%64===0)yield;
    if(visited.has(start))continue;const ring=[];let edge=start;
    while(!visited.has(edge)){visited.add(edge);ring.push(edge);edge=edge.next;}
    if(edge!==start||ring.length<3||ring.length>80)continue;
    const area=ring.reduce((sum,e)=>sum+cross(e.a,e.b),0)/2;
    const perimeter=ring.reduce((sum,e)=>sum+e.length,0);
    if(area<1500||area>250000||perimeter<150||perimeter>1800
      ||new Set(ring.map(e=>e.a.id)).size!==ring.length)continue;
    const points=inset(ring);if(!points)continue;
    const route=roundedRoute(points);
    // A cropped OSM face can contain another road (split nodes, ramps or
    // grade-separated alignments). Reject it rather than invent a crossing.
    let clear=true;
    for(let d=0;clear&&d<route.length;d+=1){
      if(++work%128===0)yield;
      const p=sidewalkPose(route,d);
      for(const edge of roadCells.get(`${Math.floor(p.x/50)}:${Math.floor(p.z/50)}`)||[]){
        const dx=(edge.b.x-edge.a.x)/edge.length,dz=(edge.b.z-edge.a.z)/edge.length;
        const t=Math.max(0,Math.min(edge.length,(p.x-edge.a.x)*dx+(p.z-edge.a.z)*dz));
        if(Math.hypot(p.x-edge.a.x-dx*t,p.z-edge.a.z-dz*t)<edge.width/2+.74){clear=false;break;}
      }
    }
    if(!clear)continue;
    const xs=points.map(p=>p.x),zs=points.map(p=>p.z);
    Object.assign(route,{id:Math.min(...ring.map(e=>e.a.id)),
      bounds:[Math.min(...xs),Math.min(...zs),Math.max(...xs),Math.max(...zs)]});
    routes.push(route);
  }
  return routes;
}

export function createSidewalkRoutes(graph){
  const steps=sidewalkRouteSteps(graph);
  for(;;){const step=steps.next();if(step.done)return step.value;}
}

export function prepareSidewalkRoutes(graph,options){
  return prepareInBatches(sidewalkRouteSteps(graph),options);
}

export function sidewalkPose(route,distanceAlong,direction=1){
  const d=((distanceAlong%route.length)+route.length)%route.length;
  const piece=route.pieces.find(p=>d<p.start+p.length)||route.pieces.at(-1);
  const local=d-piece.start;let index=1;
  while(index<8&&local>piece.samples[index])index++;
  const t=(index-1+(local-piece.samples[index-1])/(piece.samples[index]-piece.samples[index-1]))/8;
  const {a,b,p}=piece;
  const point=p?mix(mix(a,p,t),mix(p,b,t),t):mix(a,b,t);
  const tangent=p?delta(mix(a,p,t),mix(p,b,t)):delta(a,b);
  return {...point,angle:Math.atan2(tangent.x*direction,tangent.z*direction)};
}

export function walkerTravel(time,seed){
  const period=34+seed*23,moving=period-4-seed*4,ramp=.8;
  const clock=Math.max(0,time+seed*period),cycles=Math.floor(clock/period),t=Math.min(moving,clock%period);
  const integral=t<ramp?t*t/(2*ramp):t>moving-ramp
    ?moving-ramp-(moving-t)**2/(2*ramp):t-ramp/2;
  const pace=Math.max(0,Math.min(1,t/ramp,(moving-t)/ramp));
  return {distance:(cycles*(moving-ramp)+integral)*(1.05+seed*.55),pace};
}

export function walkersForRoutes(routes,x,z,radius,limit=240){
  const visible=routes.filter(({bounds:b})=>Math.hypot(Math.max(b[0]-x,0,x-b[2]),
    Math.max(b[1]-z,0,z-b[3]))<radius).sort((a,b)=>
    Math.hypot((a.bounds[0]+a.bounds[2])/2-x,(a.bounds[1]+a.bounds[3])/2-z)
    -Math.hypot((b.bounds[0]+b.bounds[2])/2-x,(b.bounds[1]+b.bounds[3])/2-z));
  const walkers=[];
  for(const route of visible){
    const count=Math.min(10,Math.max(2,Math.floor(route.length/42)));
    for(let i=0;i<count&&walkers.length<limit;i++){
      const seed=hash(route.id+i*7919),direction=i%2?1:-1;
      walkers.push({route,seed,direction,offset:(i+.2+seed*.4)*route.length/count});
    }
    if(walkers.length>=limit)break;
  }
  return walkers;
}
