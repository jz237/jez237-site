import * as T from 'three';
type Vertex={p:T.Vector3;n:T.Vector3;uv:T.Vector2};
export type SurfacePlane=readonly [axis:number,position:number];
function clip(poly:Vertex[],axis:number,at:number,side:number){
  const out:Vertex[]=[];
  for(let i=0;i<poly.length;i++){
    const a=poly[i],b=poly[(i+1)%poly.length],da=(a.p.getComponent(axis)-at)*side,db=(b.p.getComponent(axis)-at)*side;
    if(da>=0)out.push(a);
    if(da*db<0){const t=da/(da-db);out.push({p:a.p.clone().lerp(b.p,t),n:a.n.clone().lerp(b.n,t).normalize(),uv:a.uv.clone().lerp(b.uv,t)});}
  }return out;
}

/** Cut source surfaces at exact assembly boundaries without moving their skin.
 * A null classification deliberately removes a surface for a body conversion. */
export function partitionSurface(geometry:T.BufferGeometry,planes:readonly SurfacePlane[],classify:(centre:T.Vector3)=>string|null){
  const input=geometry.index?geometry.toNonIndexed():geometry,p=input.getAttribute('position'),n=input.getAttribute('normal'),uv=input.getAttribute('uv');
  const batches=new Map<string,{p:number[];n:number[];uv:number[]}>();
  for(let i=0;i<p.count;i+=3){
    let polys=[Array.from({length:3},(_,j)=>({p:new T.Vector3().fromBufferAttribute(p,i+j),n:new T.Vector3().fromBufferAttribute(n,i+j),uv:new T.Vector2(uv?.getX(i+j)??0,uv?.getY(i+j)??0)}))];
    for(const [axis,at]of planes)polys=polys.flatMap(poly=>{
      const coords=poly.map(v=>v.p.getComponent(axis));
      return Math.min(...coords)<at&&Math.max(...coords)>at?[clip(poly,axis,at,-1),clip(poly,axis,at,1)].filter(q=>q.length>=3):[poly];
    });
    for(const poly of polys){
      const key=classify(poly.reduce((v,a)=>v.add(a.p),new T.Vector3()).divideScalar(poly.length));if(key===null)continue;
      if(!batches.has(key))batches.set(key,{p:[],n:[],uv:[]});const batch=batches.get(key)!;
      for(let j=1;j<poly.length-1;j++){const tri=[poly[0],poly[j],poly[j+1]];
        if(tri[1].p.clone().sub(tri[0].p).cross(tri[2].p.clone().sub(tri[0].p)).lengthSq()<1e-18)continue;
        for(const v of tri){batch.p.push(...v.p.toArray());batch.n.push(...v.n.toArray());batch.uv.push(...v.uv.toArray());}
      }
    }
  }
  if(input!==geometry)input.dispose();
  return [...batches].filter(([,b])=>b.p.length).map(([name,b])=>{const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(b.p,3));g.setAttribute('normal',new T.Float32BufferAttribute(b.n,3));g.setAttribute('uv',new T.Float32BufferAttribute(b.uv,2));return {name,geometry:g};});
}
