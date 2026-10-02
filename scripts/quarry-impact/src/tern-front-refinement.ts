import * as T from 'three';
import {ConvexGeometry} from 'three/addons/geometries/ConvexGeometry.js';
import {mergeGeometries,toCreasedNormals} from 'three/addons/utils/BufferGeometryUtils.js';
const v=(x:number,y:number,z:number)=>new T.Vector3(x,y,z);
type Surface=(x:number,y:number,depth:number)=>T.Vector3;
type Opening={left:number;right:number;bottom:number;top:number};

/** Closed inner/outer skins and edge returns around real apertures. */
function piercedSheet(xs:number[],ys:number[],surface:Surface,thickness:number,openings:Opening[]=[]){
 const p:number[]=[],uv:number[]=[],nx=xs.length-1,ny=ys.length-1;
 const filled=(x:number,y:number)=>x>=0&&y>=0&&x<nx&&y<ny&&!openings.some(h=>(xs[x]+xs[x+1])/2>h.left&&(xs[x]+xs[x+1])/2<h.right&&(ys[y]+ys[y+1])/2>h.bottom&&(ys[y]+ys[y+1])/2<h.top);
 const tri=(a:T.Vector3,b:T.Vector3,c:T.Vector3)=>{p.push(...a.toArray(),...b.toArray(),...c.toArray());uv.push(a.x,a.y,b.x,b.y,c.x,c.y);};
 for(let y=0;y<ny;y++)for(let x=0;x<nx;x++)if(filled(x,y)){
  const q=[[xs[x],ys[y]],[xs[x+1],ys[y]],[xs[x+1],ys[y+1]],[xs[x],ys[y+1]]],a=q.map(([x,y])=>surface(x,y,0)),b=q.map(([x,y])=>surface(x,y,-thickness));
  tri(a[0],a[1],a[2]);tri(a[0],a[2],a[3]);tri(b[2],b[1],b[0]);tri(b[3],b[2],b[0]);
  for(const [edge,dx,dy]of [[0,0,-1],[1,1,0],[2,0,1],[3,-1,0]])if(!filled(x+dx,y+dy)){const next=(edge+1)%4;tri(a[next],a[edge],b[edge]);tri(a[next],b[edge],b[next]);}
 }
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.computeVertexNormals();return toCreasedNormals(g,Math.PI/3);
}
function roundedContour(w:number,h:number,r:number){
 const points:T.Vector2[]=[];for(let c=0;c<4;c++)for(let i=0;i<=2;i++){const a=(c*90+i*45)*Math.PI/180,sx=c===0||c===3?1:-1,sy=c<2?1:-1;points.push(new T.Vector2(sx*(w/2-r)+r*Math.cos(a),sy*(h/2-r)+r*Math.sin(a)));}return points;
}
/** A moulding's closed cross-section is revolved around a rounded rectangle. */
function moulding(profiles:{w:number;h:number;r:number;z:number}[],surface:Surface,cap=false){
 const p:number[]=[],uv:number[]=[],indices:number[]=[],n=12;
 for(const row of profiles)for(const q of roundedContour(row.w,row.h,row.r)){p.push(...surface(q.x,q.y,row.z).toArray());uv.push(q.x,q.y);}
 for(let row=0;row<profiles.length-1;row++)for(let i=0;i<n;i++){const a=row*n+i,b=row*n+(i+1)%n;indices.push(a,b,b+n,a,b+n,a+n);}
 if(cap){for(const [row,reverse]of [[0,true],[profiles.length-1,false]]as const){const c=p.length/3;p.push(...surface(0,0,profiles[row].z).toArray());uv.push(0,0);for(let i=0;i<n;i++)indices.push(...(reverse?[row*n+(i+1)%n,row*n+i,c]:[row*n+i,row*n+(i+1)%n,c]));}}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(indices);g.computeVertexNormals();const flat=g.toNonIndexed();g.dispose();return flat;
}
/** Cast and moulded components have bevel faces, without high-detail spheres. */
function castBlock(w:number,h:number,d:number,r:number){
 const points:T.Vector3[]=[];r=Math.min(r,w/3,h/3,d/3);
 for(const x of [-1,1])for(const y of [-1,1])for(const z of [-1,1])for(let axis=0;axis<3;axis++)points.push(v(x*(w/2-(axis===0?0:r)),y*(h/2-(axis===1?0:r)),z*(d/2-(axis===2?0:r))));
 const g=new ConvexGeometry(points),p=g.attributes.position,n=g.attributes.normal,uv:number[]=[];for(let i=0;i<p.count;i++){if(Math.abs(n.getY(i))>.5)uv.push(p.getX(i),p.getZ(i));else if(Math.abs(n.getZ(i))>.5)uv.push(p.getX(i),p.getY(i));else uv.push(p.getZ(i),p.getY(i));}g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));return g;
}

export function refineTernFront(root:T.Group,materials:{paint:T.Material;rubber:T.Material;trim:T.Material;steel:T.Material;alloy:T.Material;lamp:T.Material;amber:T.Material}){
 const {paint,rubber,trim,steel,alloy,lamp,amber}=materials;
 const remove=(name:string)=>{const o=root.getObjectByName(name);if(o){o.removeFromParent();if(o instanceof T.Mesh)o.geometry.dispose();}};
 const add=(name:string,g:T.BufferGeometry,m:T.Material,x=0,y=0,z=0)=>{if(g.index)g=g.toNonIndexed();const o=new T.Mesh(g,m);o.name=name;o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;root.add(o);return o;};
 const block=(name:string,x:number,y:number,z:number,w:number,h:number,d:number,r:number,m:T.Material)=>add(name,castBlock(w,h,d,r),m,x,y,z);
 const cylinder=(name:string,x:number,y:number,z:number,r:number,length:number,m:T.Material,axis:'x'|'y'|'z'='y',segments=8)=>{const o=add(name,new T.CylinderGeometry(r,r,length,segments),m,x,y,z);if(axis==='x')o.rotation.z=Math.PI/2;if(axis==='z')o.rotation.x=Math.PI/2;return o;};
 const pipe=(name:string,points:T.Vector3[],r:number,m:T.Material,segments=5)=>add(name,new T.TubeGeometry(new T.CatmullRomCurve3(points),segments,r,5,false),m);
 for(const o of [...root.children])if(/^panel_(FrontValanceTern$|FrontGrilleTern|HeadlightTern|IndicatorTern)/.test(o.name))remove(o.name);
 const nose:Surface=(x,y,d)=>v(x,y,1.81+.026*(1-(x/.737)**2)+.006*Math.sin(Math.PI*T.MathUtils.clamp((y-.61)/.34,0,1))+d);
 const xs=[-.737,-.69,-.525,-.36,-.31,0,.31,.36,.525,.69,.737],ys=[.365,.49,.61,.698,.715,.89,.95];
 add('panel_FrontValanceTern',piercedSheet(xs,ys,nose,.025,[{left:-.31,right:.31,bottom:.698,top:.89},{left:-.69,right:-.36,bottom:.715,top:.89},{left:.36,right:.69,bottom:.715,top:.89}]),paint);
 const grille:Surface=(x,y,d)=>nose(x,y+.794,d);
 const rim=[{w:.64,h:.210,r:.012,z:0},{w:.614,h:.184,r:.012,z:.005},{w:.601,h:.171,r:.010,z:-.024},{w:.64,h:.210,r:.012,z:-.030},{w:.64,h:.210,r:.012,z:0}];
 add('panel_FrontGrilleTernRim',moulding(rim,grille),trim);
 add('panel_FrontGrilleTernRecess',piercedSheet([-.31,0,.31],[-.097,.097],(x,y,d)=>grille(x,y,d-.052),.012),rubber);
 const louvers:T.BufferGeometry[]=[];for(const y of [-.069,-.034,0,.034,.069])louvers.push(piercedSheet([-.303,0,.303],[y-.005,y+.005],(x,y,d)=>grille(x,y,d-.026),.020));
 add('panel_FrontGrilleTernLouvers',mergeGeometries(louvers)!,trim);louvers.forEach(g=>g.dispose());
 for(const side of [-1,1]){
  const x=side*.525,map:Surface=(a,b,d)=>nose(a+x,b+.8025,d);
  add('panel_HeadlightTernBezel'+side,moulding([{w:.35,h:.195,r:.016,z:0},{w:.321,h:.166,r:.012,z:.006},{w:.302,h:.150,r:.012,z:-.026},{w:.35,h:.195,r:.016,z:-.035},{w:.35,h:.195,r:.016,z:0}],map),trim);
  add('panel_HeadlightTernHousing'+side,piercedSheet([-.164,.164],[-.086,.086],(a,b,d)=>map(a,b,d-.065),.020),rubber);
  add('panel_HeadlightTernLens'+side,moulding([{w:.300,h:.148,r:.012,z:-.033},{w:.300,h:.148,r:.012,z:-.025},{w:.277,h:.125,r:.016,z:-.018}],map,true),lamp);
  const ribs:T.BufferGeometry[]=[];for(let i=-3;i<=3;i++)ribs.push(piercedSheet([i*.033-.0015,i*.033+.0015],[-.056,.056],(a,b,d)=>map(a,b,d-.014),.003));
  add('panel_HeadlightTernFlutes'+side,mergeGeometries(ribs)!,lamp);ribs.forEach(g=>g.dispose());
  const indicator:Surface=(a,b,d)=>nose(a+side*.635,b+.63,d);
  add('panel_IndicatorTernHousing'+side,moulding([{w:.153,h:.067,r:.008,z:0},{w:.135,h:.049,r:.006,z:.004},{w:.153,h:.067,r:.008,z:-.014},{w:.153,h:.067,r:.008,z:0}],indicator),rubber);
  add('panel_IndicatorTernLens'+side,moulding([{w:.134,h:.048,r:.006,z:-.006},{w:.125,h:.041,r:.007,z:.009}],indicator,true),amber);
 }
 // Replace the blank rectangular mechanical blocks with recognisable castings.
 for(const name of ['Structure engine block Tern','Structure engine sump Tern','Structure engine valve cover Tern','Structure engine air cleaner Tern','Structure Tern transaxle','Structure Tern battery'])remove(name);
 block('Structure engine block Tern',-.055,.642,1.141,.57,.244,.282,.028,steel);
 block('Structure engine sump Tern',-.055,.495,1.141,.56,.063,.259,.013,steel);
 block('Structure engine valve cover Tern',-.055,.800,1.141,.51,.078,.178,.020,alloy);
 for(const z of [1.083,1.119,1.155,1.191])add('Structure engine casting rib Tern '+z,new T.BoxGeometry(.438,.010,.008),alloy,-.055,.843,z);
 cylinder('Structure engine cover oil cap Tern',-.207,.856,1.139,.034,.021,rubber);
 block('Structure engine air cleaner Tern',-.063,.877,1.275,.30,.080,.188,.018,rubber);
 block('Structure Tern transaxle',.352,.625,1.147,.226,.208,.28,.042,alloy);
 block('Structure Tern battery',-.431,.64,1.413,.19,.154,.231,.012,rubber);
 for(const x of [-.475,-.388])cylinder('Structure Tern battery terminal '+x,x,.728,1.407,.012,.02,alloy);
 pipe('Structure Tern coolant upper',[v(.25,.734,1.191),v(.29,.765,1.43),v(.23,.78,1.608)],.024,rubber);
 pipe('Structure Tern coolant lower',[v(-.25,.51,1.15),v(-.29,.487,1.45),v(-.25,.56,1.61)],.025,rubber);
 cylinder('Structure engine cover timing Tern',-.363,.656,1.141,.114,.031,trim,'x',10);
 cylinder('Structure engine block alternator Tern',-.30,.591,.929,.047,.098,alloy,'x');
 for(const side of [-1,1]){
  cylinder('Structure Tern suspension turret '+side,side*.564,.724,1.18,.071,.152,steel);
  cylinder('Structure Tern strut top '+side,side*.564,.809,1.18,.044,.018,rubber);
 }
 cylinder('Structure Tern brake reservoir',-.46,.838,.778,.037,.068,alloy);
 root.updateMatrixWorld(true);
}
