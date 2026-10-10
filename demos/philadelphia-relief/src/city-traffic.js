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
  return {nodes,edges,segments};
}
export function trafficPose(car){
  const e=car.edge,t=Math.min(1,Math.max(0,car.distance/e.length));
  return {x:e.from.x+(e.to.x-e.from.x)*t-e.dz*e.lane,
    z:e.from.z+(e.to.z-e.from.z)*t+e.dx*e.lane,
    ground:e.from.ground+(e.to.ground-e.from.ground)*t,angle:Math.atan2(e.dx,e.dz)};
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
    const edge=eligible[Math.floor(random()*eligible.length)],distance=random()*edge.length;
    const positions=occupied.get(edge.id)||[];
    if(positions.some(p=>Math.abs(p-distance)<12))continue;
    positions.push(distance);occupied.set(edge.id,positions);
    cars.push({edge,distance,speed:0,cruise:6+random()*6,seed:random(),wait:0});
  }
  function choose(car){
    const options=car.edge.to.out.filter(e=>e.to!==car.edge.from);
    if(!options.length)return car.edge.to.out[0]||null;
    const weighted=options.map(e=>({e,w:1+Math.max(0,e.dx*car.edge.dx+e.dz*car.edge.dz)*3}));
    let n=random()*weighted.reduce((s,v)=>s+v.w,0);
    for(const v of weighted){n-=v.w;if(n<=0)return v.e;}return options[0];
  }
  return {cars,
    update(dt){
      dt=Math.max(0,Math.min(dt,.05));time+=dt;
      const queues=new Map();
      for(const car of cars){const q=queues.get(car.edge.id)||[];q.push(car);queues.set(car.edge.id,q);}
      for(const q of queues.values())q.sort((a,b)=>b.distance-a.distance);
      for(const q of queues.values())for(let i=0;i<q.length;i++){
        const car=q[i],edge=car.edge,node=edge.to;
        const phase=(time+Math.abs(node.id%19))%42;
        const green=Math.abs(edge.dx)>Math.abs(edge.dz)?phase<18:phase>=21&&phase<39;
        let gap=i?Math.max(0,q[i-1].distance-car.distance-7):Infinity;
        if(node.neighbors.size>2&&!green)gap=Math.min(gap,Math.max(0,edge.length-car.distance-5));
        const target=Math.min(car.cruise,Math.sqrt(4*gap));
        car.speed+=Math.max(-dt*6,Math.min(dt*2,target-car.speed));
        car.distance+=Math.min(car.speed*dt,gap);
        let guard=0;
        while(car.distance>=car.edge.length&&guard++<8){
          const next=choose(car);
          if(!next){car.distance=car.edge.length;car.speed=0;break;}
          // Wait at the junction if the receiving lane has no room.
          if((queues.get(next.id)||[]).some(other=>other!==car&&other.distance<8)){
            car.distance=car.edge.length-.1;car.speed=0;break;
          }
          car.distance-=car.edge.length;car.edge=next;
        }
      }
    },
  };
}
