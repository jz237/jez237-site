// Join the two sides of ordinary bends in offset space. Stopping both strips at
// the road centre node makes their ends cross the carriageway on sharp corners.
export function createCurbLayout(graph){
  const adjoining=new Map();
  for(const segment of graph.segments)
    for(const [node,other] of [[segment.a,segment.b],[segment.b,segment.a]]){
    let connections=adjoining.get(node);
    if(!connections){connections=new Map();adjoining.set(node,connections);}
    const previous=connections.get(other);
    if(!previous||previous.width<segment.width)connections.set(other,segment);
  }
  function endpoint(segment,node,other,side,margin,start){
    const dx=(segment.b.x-segment.a.x)/segment.length,dz=(segment.b.z-segment.a.z)/segment.length;
    const offset=side*(segment.width/2+margin),p={x:node.x-dz*offset,z:node.z+dx*offset};
    const connections=adjoining.get(node),trim=()=>{
      const setback=Math.min(segment.length*.45,segment.width*.7)*(start?1:-1);
      return {x:p.x+dx*setback,z:p.z+dz*setback};
    };
    if(connections.size>2)return trim();
    if(connections.size<2)return p;
    const [next,adjacent]=[...connections].find(([neighbor])=>neighbor!==other);
    const length=Math.hypot(next.x-node.x,next.z-node.z),sign=start?-1:1;
    const ux=(next.x-node.x)/length*sign,uz=(next.z-node.z)/length*sign;
    const offset2=side*(adjacent.width/2+margin),q={x:node.x-uz*offset2,z:node.z+ux*offset2};
    if(dx*ux+dz*uz<-.85)return trim();
    const cross=dx*uz-dz*ux;
    if(Math.abs(cross)<.015)return {x:(p.x+q.x)/2,z:(p.z+q.z)/2};
    const t=((q.x-p.x)*uz-(q.z-p.z)*ux)/cross;
    const joined={x:p.x+dx*t,z:p.z+dz*t};
    const reach=Math.min(Math.max(segment.width,adjacent.width)*2.5,
      Math.min(segment.length,adjacent.length)*.45);
    return Math.hypot(joined.x-node.x,joined.z-node.z)<=reach?joined:trim();
  }
  return (segment,side,margin)=>{
    const a=endpoint(segment,segment.a,segment.b,side,margin,true);
    const b=endpoint(segment,segment.b,segment.a,side,margin,false);
    const dx=(segment.b.x-segment.a.x)/segment.length,dz=(segment.b.z-segment.a.z)/segment.length;
    return (b.x-a.x)*dx+(b.z-a.z)*dz>1?[a.x,a.z,b.x,b.z]:null;
  };
}
