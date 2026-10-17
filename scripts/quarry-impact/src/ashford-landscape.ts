import * as T from 'three';
const STEP=20;
function vertexHeight(x:number,z:number){const distance=Math.max(0,Math.abs(x)-240,Math.abs(z)-220),t=Math.min(1,distance/160),fade=t*t*(3-2*t);return -.03+fade*(23+14*Math.sin(x*.009+Math.sin(z*.006))+9*Math.cos(z*.012-x*.003));}
/** Height of the actual triangulated decorative landscape, including its diagonal. */
export function ashfordLandscapeHeight(x:number,z:number){
 const x0=Math.floor(x/STEP)*STEP,z0=Math.floor(z/STEP)*STEP,u=(x-x0)/STEP,v=(z-z0)/STEP,a=vertexHeight(x0,z0),b=vertexHeight(x0+STEP,z0),c=vertexHeight(x0,z0+STEP),d=vertexHeight(x0+STEP,z0+STEP);
 return u+v<=1?a+u*(b-a)+v*(c-a):d+(1-u)*(c-d)+(1-v)*(b-d);
}
export function createAshfordLandscape(){
 const root=new T.Group();root.name='ashford_landscape';
 const positions:number[]=[],colors:number[]=[];
 const point=(x:number,z:number)=>{positions.push(x,vertexHeight(x,z),z);const shade=.9+.07*Math.sin(x*.07)*Math.cos(z*.04),c=new T.Color(0x73764d).multiplyScalar(shade);colors.push(c.r,c.g,c.b);};
 // A recessed ring overlaps the old plane's outer margin, never the racing area.
 for(let z=-800;z<800;z+=STEP)for(let x=-900;x<900;x+=STEP){if(x>=-160&&x+STEP<=160&&z>=-140&&z+STEP<=140)continue;point(x,z);point(x,z+STEP);point(x+STEP,z);point(x+STEP,z);point(x,z+STEP);point(x+STEP,z+STEP);}
 const groundGeometry=new T.BufferGeometry();groundGeometry.setAttribute('position',new T.Float32BufferAttribute(positions,3));groundGeometry.setAttribute('color',new T.Float32BufferAttribute(colors,3));groundGeometry.computeVertexNormals();
 const groundMaterial=new T.MeshStandardMaterial({vertexColors:true,roughness:1}),ground=new T.Mesh(groundGeometry,groundMaterial);ground.name='ashford_outer_land';ground.receiveShadow=true;root.add(ground);
 let seed=17293;const random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
 const crownGeometry=new T.IcosahedronGeometry(1,1),trunkGeometry=new T.CylinderGeometry(.5,.75,1,6),foliage=new T.MeshStandardMaterial({roughness:1}),wood=new T.MeshStandardMaterial({color:0x665541,roughness:1});
 const places:{x:number;y:number;z:number;radius:number;height:number}[]=[];
 for(let i=0;i<460;i++){const a=random()*Math.PI*2,r=1+random()*.85,x=Math.cos(a)*235*r,z=Math.sin(a)*215*r,radius=3.5+random()*3;
  if(Math.abs(x)-radius*1.7<190&&Math.abs(z)-radius*1.7<180)continue;
  if(z< -140&&z> -235&&Math.abs(x)<115)continue; // service-yard entrance
  places.push({x,y:ashfordLandscapeHeight(x,z),z,radius,height:9+random()*13});
 }
 const trunks=new T.InstancedMesh(trunkGeometry,wood,places.length),crowns=new T.InstancedMesh(crownGeometry,foliage,places.length*3),obj=new T.Object3D();trunks.name='ashford_tree_trunks';crowns.name='ashford_tree_crowns';
 places.forEach((p,i)=>{obj.position.set(p.x,p.y+p.height*.35,p.z);obj.rotation.set(0,i,0);obj.scale.set(1,p.height*.7,1);obj.updateMatrix();trunks.setMatrixAt(i,obj.matrix);
  for(let j=0;j<3;j++){const a=i+j*2.094;obj.position.set(p.x+Math.cos(a)*p.radius*.5,p.y+p.height*(.54+j*.13),p.z+Math.sin(a)*p.radius*.5);obj.rotation.set(.1,a,.1);obj.scale.set(p.radius,p.height*.24,p.radius*.85);obj.updateMatrix();crowns.setMatrixAt(i*3+j,obj.matrix);crowns.setColorAt(i*3+j,new T.Color([0x496749,0x708053,0x547245,0x7b8152][i%4]).multiplyScalar(.85+random()*.25));}
 });
 for(const m of [trunks,crowns]){m.computeBoundingSphere();m.castShadow=m.receiveShadow=true;root.add(m);}
 root.userData.treePlaces=places;
 let disposed=false;return{root,dispose(){if(disposed)return;disposed=true;root.removeFromParent();trunks.dispose();crowns.dispose();for(const g of [groundGeometry,crownGeometry,trunkGeometry])g.dispose();for(const m of [groundMaterial,foliage,wood])m.dispose();root.clear();}};
}
