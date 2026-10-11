// Decorative traffic follows the public street graph. It is not a live traffic feed.
export function createStreetGraph(doc,projection,sampleElevation){
  const nodes=new Map(),edges=[],segments=[];
  for(const road of doc.roads||[]){
    for(const [id,lon,lat] of road.points){
      if(!nodes.has(id))nodes.set(id,{id,x:projection.lonToX(lon),z:projection.latToZ(lat),
        ground:sampleElevation(lon,lat),out:[],neighbors:new Set()});
    }
    for(let i=1;i<road.points.length;i++){
      const a=nodes.get(road.points[i-1][0]),b=nodes.get(road.points[i][0]);
      const length=Math.hypot(b.x-a.x,b.z-a.z);
      if(length<.5||length>800)continue;
      const segment={a,b,length,width:road.width,oneway:road.oneway,road:road.id};
      segments.push(segment);a.neighbors.add(b.id);b.neighbors.add(a.id);
      const add=(from,to)=>{
        const edge={id:edges.length,from,to,length,width:road.width,
          lane:road.oneway?0:Math.min(road.width*.22,2),
          dx:(to.x-from.x)/length,dz:(to.z-from.z)/length};
        edges.push(edge);from.out.push(edge);
      };
      if(road.oneway>=0)add(a,b);if(road.oneway<=0)add(b,a);
    }
  }
  // Several OSM nodes can describe one physical junction. Keep nearby connected
  // pieces under one occupancy lock, with a bounded footprint so a densely
  // sampled road cannot collapse into one enormous intersection.
  const parents=new Map(),bounds=new Map();
  for(const node of nodes.values()){
    parents.set(node.id,node.id);bounds.set(node.id,[node.x,node.z,node.x,node.z]);
  }
  const root=id=>{while(parents.get(id)!==id){
    parents.set(id,parents.get(parents.get(id)));id=parents.get(id);}
    return id;};
  for(const segment of segments){
    if(segment.length>12)continue;
    const a=root(segment.a.id),b=root(segment.b.id);if(a===b)continue;
    const aa=bounds.get(a),bb=bounds.get(b);
    const joined=[Math.min(aa[0],bb[0]),Math.min(aa[1],bb[1]),
      Math.max(aa[2],bb[2]),Math.max(aa[3],bb[3])];
    if(joined[2]-joined[0]>18||joined[3]-joined[1]>18)continue;
    parents.set(b,a);bounds.set(a,joined);
  }
  for(const node of nodes.values())node.junction=root(node.id);
  return {nodes,edges,segments};
}
function lanePoint(e,distance){
  const t=Math.min(1,Math.max(0,distance/e.length));
  return {x:e.from.x+(e.to.x-e.from.x)*t-e.dz*e.lane,
    z:e.from.z+(e.to.z-e.from.z)*t+e.dx*e.lane,
    ground:e.from.ground+(e.to.ground-e.from.ground)*t,angle:Math.atan2(e.dx,e.dz)};
}
function turnSpan(from,to){
  return Math.min(12,Math.max(from.width,to.width)*.75,from.length*.24,to.length*.24);
}
function stopLine(car){
  return car.edge.length-Math.max(5,(car.nextEdge?turnSpan(car.edge,car.nextEdge):0)+3);
}
function followingGap(car,queues){
  let edge=car.edge,offset=-car.distance,gap=Infinity;
  const visited=new Set();
  // OSM often splits a single street into very short edges. Following distance
  // must span those edges, otherwise a queued car on the next five-metre piece
  // is invisible until its follower has already reached its bumper.
  for(let hop=0;edge&&hop<12&&offset<50&&!visited.has(edge.id);hop++){
    visited.add(edge.id);
    for(const other of queues.get(edge.id)||[]){
      if(other===car||other.edge!==edge)continue;
      const ahead=offset+other.distance;
      if(ahead>0)gap=Math.min(gap,Math.max(0,ahead-7));
    }
    offset+=edge.length;
    if(!hop)edge=car.nextEdge;
    else{
      const continuations=edge.to.out.filter(next=>next.to!==edge.from);
      edge=continuations.length===1?continuations[0]:null;
    }
  }
  return gap;
}
function turnPose(from,to,distance){
  const span=turnSpan(from,to),t=Math.max(0,Math.min(1,(distance+span)/(2*span))),s=1-t;
  const a=lanePoint(from,from.length-span),b=lanePoint(to,span),handle=span*2/3;
  const ax=a.x+from.dx*handle,az=a.z+from.dz*handle;
  const bx=b.x-to.dx*handle,bz=b.z-to.dz*handle;
  // Coincident centre lanes at a one-way dead end need a small loop. Without
  // it, a reversal's tangent reaches zero and the car spins abruptly in place.
  const loop=from.dx*to.dx+from.dz*to.dz<-.95&&from.lane+to.lane<.1
    ?Math.min(span*.2,Math.min(from.width,to.width)*.15)*64:0;
  const offset=loop*t*t*s*s*(2*t-1);
  const tangent=loop*(2*t*s*(1-2*t)*(2*t-1)+2*t*t*s*s);
  const dx=3*s*s*(ax-a.x)+6*s*t*(bx-ax)+3*t*t*(b.x-bx)-from.dz*tangent;
  const dz=3*s*s*(az-a.z)+6*s*t*(bz-az)+3*t*t*(b.z-bz)+from.dx*tangent;
  return {x:s*s*s*a.x+3*s*s*t*ax+3*s*t*t*bx+t*t*t*b.x-from.dz*offset,
    z:s*s*s*a.z+3*s*s*t*az+3*s*t*t*bz+t*t*t*b.z+from.dx*offset,
    ground:a.ground+(b.ground-a.ground)*t,angle:Math.atan2(dx,dz)};
}
export function trafficPose(car){
  const e=car.edge;
  // Evaluate the same curve on both sides of the graph boundary: lane offsets
  // and heading remain continuous when the simulation advances to a new edge.
  if(car.previousEdge&&car.distance<turnSpan(car.previousEdge,e)){
    return turnPose(car.previousEdge,e,car.distance);
  }
  if(car.nextEdge&&car.distance>e.length-turnSpan(e,car.nextEdge)){
    return turnPose(e,car.nextEdge,car.distance-e.length);
  }
  return lanePoint(e,car.distance);
}
export function createTraffic(graph,count=260,seed=239){
  let randomState=seed>>>0,time=0;
  const random=()=>{randomState=(Math.imul(randomState,1664525)+1013904223)>>>0;
    return randomState/4294967296;};
  const eligible=graph.edges.filter(e=>e.length>30&&e.to.out.length);
  const cars=[];
  if(!eligible.length)return {cars,update(){}};
  const occupied=new Map();
  for(let i=0;i<count*5&&cars.length<count;i++){
    const edge=eligible[Math.floor(random()*eligible.length)],distance=8+random()*(edge.length-28);
    const positions=occupied.get(edge.id)||[];
    if(positions.some(p=>Math.abs(p-distance)<12))continue;
    positions.push(distance);occupied.set(edge.id,positions);
    cars.push({edge,distance,speed:0,cruise:6+random()*6,seed:random(),braking:true,
      previousEdge:null,nextEdge:null});
  }
  function choose(car){
    const options=car.edge.to.out.filter(e=>e.to!==car.edge.from);
    if(!options.length)return car.edge.to.out[0]||null;
    const weighted=options.map(e=>({e,w:1+Math.max(0,e.dx*car.edge.dx+e.dz*car.edge.dz)*3}));
    let n=random()*weighted.reduce((s,v)=>s+v.w,0);
    for(const v of weighted){n-=v.w;if(n<=0)return v.e;}return options[0];
  }
  for(const car of cars)car.nextEdge=choose(car);
  function step(dt){
      time+=dt;
      const queues=new Map();
      const reserved=new Set();
      const junctions=new Map();
      const occupy=(node,car)=>{
        const owners=junctions.get(node.junction)||new Set();
        owners.add(car);junctions.set(node.junction,owners);
      };
      // Reserve from before the turn starts until the rear of the vehicle has
      // cleared it. Waiting until the graph edge changes is too late: two
      // incoming cars may already be on overlapping curves by then.
      for(const car of cars){
        if(car.distance>stopLine(car)||car.edge.from.junction===car.edge.to.junction)occupy(car.edge.to,car);
        const clear=car.previousEdge?turnSpan(car.previousEdge,car.edge)+4:8;
        if(car.distance<clear)occupy(car.edge.from,car);
      }
      for(const car of cars){const q=queues.get(car.edge.id)||[];q.push(car);queues.set(car.edge.id,q);}
      for(const q of queues.values())q.sort((a,b)=>b.distance-a.distance);
      for(const q of queues.values())for(let i=0;i<q.length;i++){
        const car=q[i],edge=car.edge,node=edge.to;
        const phase=(time+Math.abs(node.junction%19))%42;
        const green=Math.abs(edge.dx)>Math.abs(edge.dz)?phase<18:phase>=21&&phase<39;
        const next=car.nextEdge;
        const span=next?turnSpan(edge,next):0;
        const stopAt=stopLine(car);
        const occupiedJunction=[...(junctions.get(node.junction)||[])].some(owner=>owner!==car);
        const blocked=occupiedJunction||next&&(reserved.has(next.id)||(queues.get(next.id)||[])
          .some(other=>other!==car&&other.edge===next&&other.distance<span+8));
        let gap=followingGap(car,queues);
        // A car that has passed the stop line clears the intersection even if
        // the signal changes; it must not freeze halfway through a turn.
        const insideJunction=edge.from.junction===node.junction;
        if(!insideJunction&&car.distance<=stopAt&&((node.neighbors.size>2&&!green)||blocked)){
          gap=Math.min(gap,Math.max(0,stopAt-car.distance));
        }
        const turning=next&&edge.dx*next.dx+edge.dz*next.dz<.8;
        const cruise=turning&&edge.length-car.distance<span+12?Math.min(car.cruise,4.5):car.cruise;
        const target=Math.min(cruise,Math.sqrt(4*gap));
        car.braking=target<car.speed-.2||car.speed<.4;
        car.speed+=Math.max(-dt*6,Math.min(dt*2,target-car.speed));
        car.distance+=Math.min(car.speed*dt,gap);
        if(car.distance>stopAt)occupy(node,car);
        let guard=0;
        while(car.distance>=car.edge.length&&guard++<8){
          const next=car.nextEdge;
          if(!next){car.distance=car.edge.length;car.speed=0;break;}
          // Wait at the junction if the receiving lane has no room.
          if(reserved.has(next.id)||(queues.get(next.id)||[])
            .some(other=>other!==car&&other.edge===next&&other.distance<8)){
            car.distance=car.edge.length-.1;car.speed=0;car.braking=true;break;
          }
          reserved.add(next.id);
          car.distance-=car.edge.length;car.previousEdge=car.edge;car.edge=next;
          car.nextEdge=choose(car);
        }
      }
  }
  return {cars,
    update(dt){
      // Preserve elapsed time at low frame rates without a large unstable step
      // or a long catch-up loop when the tab wakes after being hidden.
      if(!Number.isFinite(dt)||dt<=0)return;
      let remaining=Math.min(dt,.25);
      while(remaining>1e-8){const elapsed=Math.min(remaining,.05);step(elapsed);remaining-=elapsed;}
    },
  };
}
