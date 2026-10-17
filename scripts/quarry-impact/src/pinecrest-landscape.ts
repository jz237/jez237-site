import * as T from 'three';
import {createFenwickTreeBelt} from './fenwick-tree-belt';
import {addCourseGroundDetail} from './course-materials';
import {PINECREST} from './pinecrest-course';
const axis=(extent:number,edge:number)=>Array.from(new Set([...Array.from({length:(extent-edge)/20+1},(_,i)=>-extent+i*20),...Array.from({length:edge+1},(_,i)=>-edge+i*2),...Array.from({length:(extent-edge)/20+1},(_,i)=>edge+i*20)])).sort((a,b)=>a-b);
const xs=axis(900,180),zs=axis(800,160);
function vertexHeight(x:number,z:number){const distance=Math.max(0,Math.abs(x)-240,Math.abs(z)-220),t=Math.min(1,distance/180),fade=t*t*(3-2*t);return PINECREST.height(x,z)-.04+fade*(30+19*Math.sin(x*.009+Math.sin(z*.007))+13*Math.cos(z*.011-x*.004));}
const interval=(values:number[],n:number)=>{let lo=0,hi=values.length-2;while(lo<hi){const mid=Math.ceil((lo+hi)/2);if(values[mid]<=n)lo=mid;else hi=mid-1;}return lo;};
/** Same nonuniform grid and diagonal as the rendered landscape. */
export function pinecrestLandscapeHeight(x:number,z:number){
 const i=interval(xs,x),j=interval(zs,z),x0=xs[i],x1=xs[i+1],z0=zs[j],z1=zs[j+1],u=(x-x0)/(x1-x0),v=(z-z0)/(z1-z0),a=vertexHeight(x0,z0),b=vertexHeight(x1,z0),c=vertexHeight(x0,z1),d=vertexHeight(x1,z1);
 return u+v<=1?a+u*(b-a)+v*(c-a):d+(1-u)*(c-d)+(1-v)*(b-d);
}
export function createPinecrestLandscape(){
 const root=new T.Group();root.name='pinecrest_landscape';
 const positions:number[]=[],colors:number[]=[];
 const point=(x:number,z:number)=>{positions.push(x,vertexHeight(x,z),z);const shade=.9+.07*Math.sin(x*.07)*Math.cos(z*.04),c=new T.Color(0x6f7551).multiplyScalar(shade);colors.push(c.r,c.g,c.b);};
 // A recessed ring overlaps the old plane's outer margin, never the racing area.
 for(let j=0;j<zs.length-1;j++)for(let i=0;i<xs.length-1;i++){const x=xs[i],x1=xs[i+1],z=zs[j],z1=zs[j+1];if(x>=-178&&x1<=178&&z>=-158&&z1<=158)continue;point(x,z);point(x,z1);point(x1,z);point(x1,z);point(x,z1);point(x1,z1);}

 const groundGeometry=new T.BufferGeometry();groundGeometry.setAttribute('position',new T.Float32BufferAttribute(positions,3));groundGeometry.setAttribute('color',new T.Float32BufferAttribute(colors,3));groundGeometry.computeVertexNormals();
 const groundMaterial=new T.MeshStandardMaterial({vertexColors:true,roughness:1});
 const detail=addCourseGroundDetail(groundMaterial,{terrain:{spanX:1800,spanZ:1600,step:20,columns:90,rows:80},distance:()=>1000,surface:()=> 'gravel'});
 const ground=new T.Mesh(groundGeometry,groundMaterial);ground.name='pinecrest_outer_land';ground.receiveShadow=true;root.add(ground);
 let seed=17293;const random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
 const places:{x:number;y:number;z:number;radius:number;height:number}[]=[];
 for(let i=0;i<620;i++){const a=random()*Math.PI*2,r=1+random()*.85,x=Math.cos(a)*245*r,z=Math.sin(a)*225*r,radius=3.5+random()*3;
  if(Math.abs(x)-radius*1.7<195&&Math.abs(z)-radius*1.7<180)continue;
  if(z< -140&&z> -235&&Math.abs(x)<115)continue; // service-yard entrance
  places.push({x,y:pinecrestLandscapeHeight(x,z),z,radius,height:9+random()*13});
 }
 const trees=createFenwickTreeBelt(places,true);trees.root.name='pinecrest_distant_woodland';root.add(trees.root);
 root.userData.treePlaces=places;
 let disposed=false;return{root,dispose(){if(disposed)return;disposed=true;root.removeFromParent();trees.dispose();detail.dispose();groundGeometry.dispose();groundMaterial.dispose();root.clear();}};
}
