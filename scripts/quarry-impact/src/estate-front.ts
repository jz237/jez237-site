import * as T from 'three';
import {mergeGeometries,toCreasedNormals} from 'three/addons/utils/BufferGeometryUtils.js';

const nose=(x:number)=>2.27-.20*(x/.84)**2;
const hoodEdge=(z:number)=>{
  const stations=[[.72,1.042],[.85,1.031],[1,1.021],[1.25,1.005],[1.5,.987],[1.75,.960],[2,.921],[2.08,.898]];
  for(let i=1;i<stations.length;i++)if(z<=stations[i][0]){
    const [a,ya]=stations[i-1],[b,yb]=stations[i];return T.MathUtils.lerp(ya,yb,T.MathUtils.clamp((z-a)/(b-a),0,1));
  }
  return .898;
};

type MapPoint=(x:number,y:number,depth:number)=>T.Vector3;
type Hole={left:number;right:number;bottom:number;top:number};
/** A subdivided outer skin, inner skin and returns at every exposed edge.
 * Openings stay actual holes; paint never sits behind the grille or lenses. */
function shell(xs:number[],ys:number[],map:MapPoint,depth:number,holes:Hole[]=[]){
  const positions:number[]=[],uv:number[]=[],nx=xs.length-1,ny=ys.length-1;
  const filled=(i:number,j:number)=>i>=0&&i<nx&&j>=0&&j<ny&&!holes.some(h=>(xs[i]+xs[i+1])/2>h.left&&(xs[i]+xs[i+1])/2<h.right&&(ys[j]+ys[j+1])/2>h.bottom&&(ys[j]+ys[j+1])/2<h.top);
  const tri=(a:T.Vector3,b:T.Vector3,c:T.Vector3)=>{positions.push(...a.toArray(),...b.toArray(),...c.toArray());uv.push(a.x,a.y,b.x,b.y,c.x,c.y);};
  for(let j=0;j<ny;j++)for(let i=0;i<nx;i++)if(filled(i,j)){
    const points=[[xs[i],ys[j]],[xs[i+1],ys[j]],[xs[i+1],ys[j+1]],[xs[i],ys[j+1]]];
    const front=points.map(([x,y])=>map(x,y,0)),back=points.map(([x,y])=>map(x,y,-depth));
    tri(front[0],front[1],front[2]);tri(front[0],front[2],front[3]);tri(back[2],back[1],back[0]);tri(back[3],back[2],back[0]);
    for(const [edge,di,dj]of [[0,0,-1],[1,1,0],[2,0,1],[3,-1,0]])if(!filled(i+di,j+dj)){
      const next=(edge+1)%4;tri(front[next],front[edge],back[edge]);tri(front[next],back[edge],back[next]);
    }
  }
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(positions,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.computeVertexNormals();
  const smooth=toCreasedNormals(g,Math.PI/3);if(smooth!==g)g.dispose();return smooth;
}
function rounded(w:number,h:number,r:number){
  const points:T.Vector2[]=[];
  for(let corner=0;corner<4;corner++)for(let i=0;i<=4;i++){
    const angle=(corner*90+i*22.5)*Math.PI/180,sx=corner===0||corner===3?1:-1,sy=corner<2?1:-1;
    points.push(new T.Vector2(sx*(w/2-r)+Math.cos(angle)*r,sy*(h/2-r)+Math.sin(angle)*r));
  }
  return points;
}
function ring(profiles:{w:number;h:number;r:number;depth:number}[],map:MapPoint,cap=false){
  const positions:number[]=[],uv:number[]=[],indices:number[]=[];
  const count=rounded(profiles[0].w,profiles[0].h,profiles[0].r).length;
  for(const p of profiles)for(const v of rounded(p.w,p.h,p.r)){positions.push(...map(v.x,v.y,p.depth).toArray());uv.push(v.x,v.y);}
  for(let row=0;row<profiles.length-1;row++)for(let i=0;i<count;i++){
    const a=row*count+i,b=row*count+(i+1)%count,c=b+count,d=a+count;indices.push(a,b,c,a,c,d);
  }
  if(cap){const c=positions.length/3,p=profiles.at(-1)!;positions.push(...map(0,0,p.depth).toArray());uv.push(0,0);const base=(profiles.length-1)*count;for(let i=0;i<count;i++)indices.push(base+i,base+(i+1)%count,c);}
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(positions,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(indices);g.computeVertexNormals();const flat=g.toNonIndexed();g.dispose();return flat;
}
/** A moulded lens flute has a triangular cross-section and closed ends. */
function flute(map:MapPoint,x:number){
  const vertices=[-.052,.052].flatMap(y=>[map(x-.0015,y,-.002),map(x+.0015,y,-.002),map(x,y,.001)]);
  const indices=[0,1,2,3,5,4,0,3,4,0,4,1,1,4,5,1,5,2,2,5,3,2,3,0];
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(indices.flatMap(i=>vertices[i].toArray()),3));g.setAttribute('uv',new T.Float32BufferAttribute(indices.flatMap(i=>[vertices[i].x,vertices[i].y]),2));g.computeVertexNormals();return g;
}
const range=(a:number,b:number,n:number)=>Array.from({length:n+1},(_,i)=>T.MathUtils.lerp(a,b,i/n));

/** Original estate nose: smooth stamped hood, recessed twin rectangular lamps,
 * a bowed louver grille and a fitted chrome bumper with a rubber impact strip. */
export function addEstateFront(root:T.Group,paint:T.Material,chrome:T.Material,rubber:T.Material){
  const add=(name:string,g:T.BufferGeometry,m:T.Material)=>{const mesh=new T.Mesh(g,m);mesh.name=name;mesh.castShadow=mesh.receiveShadow=true;root.add(mesh);return mesh;};
  const hoodMap:MapPoint=(x,t,d)=>{
    const z=T.MathUtils.lerp(.721,nose(x),t),crown=.029*(1-(x/.716)**2);
    return new T.Vector3(x,hoodEdge(z)+crown+d,z);
  };
  // Back skin and pressings are supplied by addClassicPanelBackings, so the
  // hood is an outer grid with enough interior vertices for local deformation.
  const apertureX=[-.795,-.615,-.435,-.40,-.20,0,.20,.40,.435,.615,.795];
  const hx=[...new Set([...range(-.716,.716,12).map(x=>Number(x.toFixed(6))),...apertureX.filter(x=>Math.abs(x)<.716)])].sort((a,b)=>a-b),hz=range(0,1,10),hp:number[]=[],huv:number[]=[];
  for(let j=0;j<hz.length-1;j++)for(let i=0;i<hx.length-1;i++){
    const corners=[hoodMap(hx[i],hz[j],0),hoodMap(hx[i+1],hz[j],0),hoodMap(hx[i+1],hz[j+1],0),hoodMap(hx[i],hz[j+1],0)];
    for(const k of [0,2,1,0,3,2]){hp.push(...corners[k].toArray());huv.push(corners[k].x,corners[k].z);}
  }
  const hood=new T.BufferGeometry();hood.setAttribute('position',new T.Float32BufferAttribute(hp,3));hood.setAttribute('uv',new T.Float32BufferAttribute(huv,2));hood.computeVertexNormals();
  const hoodNormals=toCreasedNormals(hood,Math.PI/3);if(hoodNormals!==hood)hood.dispose();
  add('panel_hood_EstateStamping',hoodNormals,paint);
  const top=(x:number)=>.898+.029*Math.max(0,1-(x/.716)**2);
  const headerMap:MapPoint=(x,y,d)=>new T.Vector3(x,y+(y-.56)/(.898-.56)*(top(x)-.898),nose(x)+d);
  const xs=[...new Set([-.84,.84,...hx,...apertureX])].sort((a,b)=>a-b);
  const ys=[.56,.63,.645,.735,.825,.842,.898];
  const openings=[{left:-.40,right:.40,bottom:.645,top:.825},{left:-.795,right:-.435,bottom:.645,top:.825},{left:.435,right:.795,bottom:.645,top:.825}];
  add('panel_FrontValanceEstateHeader',shell(xs,ys,headerMap,.10,openings),paint);
  const grilleMap:MapPoint=(x,y,d)=>headerMap(x,y+.735,d);
  add('panel_FrontValanceEstateGrilleRim',ring([{w:.816,h:.196,r:.014,depth:.006},{w:.786,h:.164,r:.010,depth:.012},{w:.776,h:.154,r:.009,depth:-.018}],grilleMap),chrome);
  add('panel_FrontValanceEstateGrilleRecess',shell(range(-.39,.39,4),[-.081,.081],(x,y,d)=>grilleMap(x,y,d-.042),.013),rubber);
  const louvers:T.BufferGeometry[]=[];
  for(const y of [-.061,-.031,0,.031,.061])louvers.push(shell(range(-.385,.385,4),[y-.004,y+.004],(x,y,d)=>grilleMap(x,y,d-.010),.018));
  for(const x of [-.30,-.15,0,.15,.30])louvers.push(shell([x-.003,x+.003],[-.076,.076],(x,y,d)=>grilleMap(x,y,d-.025),.012));
  add('panel_FrontValanceEstateGrilleLouvers',mergeGeometries(louvers)!,chrome);louvers.forEach(g=>g.dispose());
  const lens=new T.MeshPhysicalMaterial({name:'Classic Headlight Estate',color:0xdadfd5,roughness:.23,metalness:.18,clearcoat:1,clearcoatRoughness:.12});
  const amber=new T.MeshPhysicalMaterial({name:'Estate Indicator Lens',color:0xda7928,roughness:.26,clearcoat:1});
  for(const side of [-1,1]){
    const label=side<0?'L':'R',map:MapPoint=(x,y,d)=>headerMap(x+side*.615,y+.735,d);
    add('panel_FrontValanceEstateLampBezel'+label,ring([{w:.376,h:.204,r:.018,depth:.003},{w:.35,h:.178,r:.015,depth:.012},{w:.338,h:.166,r:.012,depth:-.009}],map),chrome);
    add('panel_FrontValanceEstateLampHousing'+label,shell([-.178,.178],[-.087,.087],(x,y,d)=>map(x,y,d-.031),.015),rubber);
    for(const offset of [-.084,.084]){
      const lampMap:MapPoint=(x,y,d)=>map(x+offset,y,d);
      add('panel_FrontValanceEstateLamp'+label+(offset*side>0?'Outer':'Inner'),ring([{w:.157,h:.151,r:.014,depth:-.008},{w:.141,h:.135,r:.013,depth:-.002}],lampMap,true),lens);
    }
    const ribs:T.BufferGeometry[]=[];
    for(const offset of [-.084,.084])for(const x of [-.051,-.034,-.017,0,.017,.034,.051])ribs.push(flute(map,x+offset));
    add('panel_FrontValanceEstateLensFlutes'+label,mergeGeometries(ribs)!,lens);ribs.forEach(g=>g.dispose());
    add('panel_FrontValanceEstateIndicator'+label,ring([{w:.14,h:.041,r:.006,depth:0},{w:.13,h:.031,r:.005,depth:.004}],(x,y,d)=>headerMap(x+side*.64,y+.594,d+.006),true),amber);
  }
  const apronMap:MapPoint=(x,y,d)=>new T.Vector3(x,y,nose(x)-.035+(y-.40)*.20+d);
  add('panel_FrontValanceEstateApron',shell(range(-.80,.80,8),[.39,.43,.49,.56],apronMap,.024),paint);
  const bumperMap:MapPoint=(x,y,d)=>new T.Vector3(x,y,nose(x)+.075+d);
  add('panel_bumper_frontEstateChrome',shell(range(-.855,.855,12),[.475,.482,.490,.539,.547,.554],(x,y,d)=>bumperMap(x,y,d+.015*Math.sin(Math.PI*(y-.475)/.079)),.055),chrome);
  add('panel_bumper_frontEstateRubber',shell(range(-.829,.829,12),[.505,.527],(x,y,d)=>bumperMap(x,y,d+.020),.012),rubber);
  const plate=new T.MeshStandardMaterial({name:'Estate Plate Backing',color:0xd6d9d0,roughness:.55});
  add('panel_bumper_frontEstatePlate',shell([-.125,.125],[.447,.511],(x,y,d)=>bumperMap(x,y,d+.030),.004),plate);
}
