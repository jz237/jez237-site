import * as T from 'three';
import {toCreasedNormals,mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';

type MapPoint=(x:number,y:number,depth:number)=>T.Vector3;
const range=(a:number,b:number,n:number)=>Array.from({length:n+1},(_,i)=>T.MathUtils.lerp(a,b,i/n));
const rear=(x:number)=>-2.355+.10*(x/.84)**2;

/** A closed stamped section. Depth is measured outwards toward the rear. */
function section(xs:number[],ys:number[],map:MapPoint,thickness:number){
 const positions:number[]=[],uv:number[]=[];
 const triangle=(a:T.Vector3,b:T.Vector3,c:T.Vector3)=>{positions.push(...a.toArray(),...b.toArray(),...c.toArray());uv.push(a.x,a.y,b.x,b.y,c.x,c.y);};
 for(let j=0;j<ys.length-1;j++)for(let i=0;i<xs.length-1;i++){
  const coordinates=[[xs[i],ys[j]],[xs[i+1],ys[j]],[xs[i+1],ys[j+1]],[xs[i],ys[j+1]]];
  const outer=coordinates.map(([x,y])=>map(x,y,0)),inner=coordinates.map(([x,y])=>map(x,y,-thickness));
  triangle(outer[0],outer[2],outer[1]);triangle(outer[0],outer[3],outer[2]);triangle(inner[0],inner[1],inner[2]);triangle(inner[0],inner[2],inner[3]);
  for(const edge of [j===0?0:-1,i===xs.length-2?1:-1,j===ys.length-2?2:-1,i===0?3:-1])if(edge>=0){const next=(edge+1)%4;triangle(outer[edge],outer[next],inner[next]);triangle(outer[edge],inner[next],inner[edge]);}
 }
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(positions,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.computeVertexNormals();const smooth=toCreasedNormals(g,Math.PI/3);if(g!==smooth)g.dispose();return smooth;
}
function outline(w:number,h:number,r:number){
 const result:T.Vector2[]=[];
 for(let c=0;c<4;c++)for(let i=0;i<=2;i++){
  const angle=(c*90+i*45)*Math.PI/180,sx=c===0||c===3?1:-1,sy=c<2?1:-1;
  result.push(new T.Vector2(sx*(w/2-r)+Math.cos(angle)*r,sy*(h/2-r)+Math.sin(angle)*r));
 }return result;
}
function bezel(w:number,h:number,map:MapPoint,materialDepth=.009){
 const outer=outline(w,h,.015),inner=outline(w-.026,h-.026,.009),positions:number[]=[],uv:number[]=[];
 const triangle=(a:T.Vector3,b:T.Vector3,c:T.Vector3)=>{positions.push(...a.toArray(),...b.toArray(),...c.toArray());uv.push(a.x,a.y,b.x,b.y,c.x,c.y);};
 for(let i=0;i<outer.length;i++){
  const n=(i+1)%outer.length,a=map(outer[i].x,outer[i].y,0),b=map(outer[n].x,outer[n].y,0),c=map(inner[n].x,inner[n].y,materialDepth),d=map(inner[i].x,inner[i].y,materialDepth);
  triangle(a,c,b);triangle(a,d,c);
  const ai=map(outer[i].x,outer[i].y,-.012),bi=map(outer[n].x,outer[n].y,-.012),ci=map(inner[n].x,inner[n].y,-.012),di=map(inner[i].x,inner[i].y,-.012);
  triangle(a,b,bi);triangle(a,bi,ai);triangle(d,ci,c);triangle(d,di,ci);triangle(ai,bi,ci);triangle(ai,ci,di);
 }
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(positions,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.computeVertexNormals();return g;
}

/** Original estate hatch and corner lamps replace the donor coupe's rear band.
 * The lower hatch, handle and window travel as one roof-hinged assembly. */
export function addEstateRear(root:T.Group,paint:T.Material,chrome:T.Material,rubber:T.Material){
 const add=(name:string,g:T.BufferGeometry,m:T.Material)=>{const o=new T.Mesh(g,m);o.name=name;o.castShadow=o.receiveShadow=true;root.add(o);return o;};
 const hatchMap:MapPoint=(x,y,d)=>{
  const width=.66+.135*T.MathUtils.smoothstep(y,.975,1.025),px=x*width/.66;
  const press=.013*Math.sin(Math.PI*T.MathUtils.clamp((y-.57)/.455,0,1))*(1-(x/.66)**2);
  const recess=.009*(1-T.MathUtils.smoothstep(Math.abs(x),.18,.25))*T.MathUtils.smoothstep(y,.64,.70)*(1-T.MathUtils.smoothstep(y,.80,.84));
  return new T.Vector3(px,y,rear(px)-press+recess-d);
 };
 add('panel_TailgateEstateStamping',section([-.66,-.40,-.25,-.18,0,.18,.25,.40,.66],[.57,.64,.70,.80,.84,.975,1.025],hatchMap,.027),paint);
 const seam:T.BufferGeometry[]=[];
 for(const side of [-1,1])seam.push(section([side*.663,side*.670].sort((a,b)=>a-b),[.574,.78,.974],(x,y,d)=>new T.Vector3(x,y,rear(x)-.002-d),.007));
 add('panel_RearValanceEstateHatchSeals',mergeGeometries(seam)!,rubber);seam.forEach(g=>g.dispose());
 // Folded inner pressings fit inside the hatch rather than filling the cargo bay.
 const steel=new T.MeshStandardMaterial({name:'Estate Hatch Inner Steel',color:0x414943,roughness:.68,metalness:.45});
 const ribs:T.BufferGeometry[]=[];
 for(const x of [-.50,.50])ribs.push(section([x-.027,x+.027],[.61,.72,.84,.97],(x,y,d)=>hatchMap(x,y,d-.042),.009));
 ribs.push(section(range(-.52,.52,2),[.604,.631],(x,y,d)=>hatchMap(x,y,d-.041),.008));
 add('panel_TailgateEstateInnerPressings',mergeGeometries(ribs)!,steel);ribs.forEach(g=>g.dispose());
 add('panel_TailgateEstateHandle',bezel(.18,.045,(x,y,d)=>hatchMap(x,y+.897,d+.008)),chrome);
 add('panel_TailgateEstateHandleRecess',section([-.071,.071],[-.012,.012],(x,y,d)=>hatchMap(x,y+.897,d+.008),.008),rubber);
 const plate=new T.MeshStandardMaterial({name:'Estate Rear Plate Backing',color:0xd6d9d0,roughness:.55});
 add('panel_TailgateEstatePlate',section([-.15,.15],[.682,.778],(x,y,d)=>hatchMap(x,y,d+.006),.004),plate);
 const red=new T.MeshPhysicalMaterial({name:'Classic Brakelight Estate',color:0x9e1620,roughness:.24,clearcoat:1,clearcoatRoughness:.12});
 const amber=new T.MeshPhysicalMaterial({name:'Estate Rear Amber Lens',color:0xd67d26,roughness:.26,clearcoat:1});
 const clear=new T.MeshPhysicalMaterial({name:'Estate Rear Reverse Lens',color:0xc0c9bf,roughness:.25,clearcoat:1});
 for(const side of [-1,1]){
  const label=side<0?'L':'R',map:MapPoint=(x,y,d)=>new T.Vector3(x+side*.755,y+.787,rear(x+side*.755)-d);
  // Corner returns join the retained quarters at the donor cut station.
  add('panel_RearQuarterEstateCorner'+label,section([.67,.75,.84].map(x=>x*side).sort((a,b)=>a-b),[.55,.62,.78,.94,.982],(x,y,d)=>new T.Vector3(x,y,rear(x)-d),.033),paint);
  add('panel_RearQuarterEstateReturn'+label,section(side>0?[0,1]:[1,0],[.55,.78,.982],(t,y,d)=>new T.Vector3(side*(.84-.028*t)-side*d,y,T.MathUtils.lerp(rear(.84),-2.18,t)),.026),paint);
  add('panel_RearQuarterEstateLampBezel'+label,bezel(.144,.338,map),chrome);
  add('panel_RearQuarterEstateLampHousing'+label,section([-.062,.062],[-.155,.155],(x,y,d)=>map(x,y,d+.003),.018),rubber);
  for(const [name,min,max,material]of [['Indicator',.069,.145,amber],['Brake',-.066,.060,red],['Reverse',-.144,-.075,clear]]as const){
   add('panel_RearQuarterEstate'+name+label,section([-.051,.051],[min,max],(x,y,d)=>map(x,y,d+.012),.008),material);
  }
 }
 const bumperMap:MapPoint=(x,y,d)=>new T.Vector3(x,y,rear(x)-.075-.013*Math.sin(Math.PI*(y-.475)/.080)-d);
 add('panel_bumper_rearEstateChrome',section(range(-.855,.855,8),[.475,.485,.545,.555],bumperMap,.055),chrome);
 add('panel_bumper_rearEstateRubber',section(range(-.832,.832,4),[.506,.528],(x,y,d)=>bumperMap(x,y,d+.010),.012),rubber);
 add('panel_RearValanceEstateApron',section(range(-.81,.81,4),[.39,.46,.57],(x,y,d)=>new T.Vector3(x,y,rear(x)+.015+(y-.57)*-.12-d),.024),paint);
}
