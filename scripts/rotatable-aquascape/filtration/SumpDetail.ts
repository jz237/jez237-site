import * as T from 'three';
import type {Part} from './model.ts';

type XYZ=[number,number,number];
type Palette={white:T.Material;dark:T.Material;rubber:T.Material;metal:T.Material;teal:T.Material;glass:T.MeshPhysicalMaterial};
const TAU=Math.PI*2;
const seeded=(seed:number)=>()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
function add(p:T.Object3D,g:T.BufferGeometry,m:T.Material,xyz:XYZ=[0,0,0]){const o=new T.Mesh(g,m);o.position.set(...xyz);p.add(o);return o;}
const box=(p:T.Object3D,xyz:XYZ,size:XYZ,m:T.Material)=>add(p,new T.BoxGeometry(...size),m,xyz);
function ring(p:T.Object3D,xyz:XYZ,r:number,t:number,m:T.Material){const o=add(p,new T.TorusGeometry(r,t,8,48),m,xyz);o.rotation.x=Math.PI/2;return o;}
function sleeve(p:T.Object3D,xyz:XYZ,r:number,h:number,m:T.Material,inner=r*.76){return add(p,new T.LatheGeometry([new T.Vector2(inner,-h/2),new T.Vector2(r,-h/2),new T.Vector2(r,h/2),new T.Vector2(inner,h/2)],48),m,xyz);}
function route(p:T.Object3D,points:XYZ[],radius:number,material:T.Material){
 const ps=points.map(v=>new T.Vector3(...v)),curve=new T.CurvePath<T.Vector3>();let last=ps[0];
 for(let i=1;i<ps.length-1;i++){const corner=ps[i],r=Math.min(.18,corner.distanceTo(ps[i-1])*.4,corner.distanceTo(ps[i+1])*.4),before=corner.clone().addScaledVector(ps[i-1].clone().sub(corner).normalize(),r),after=corner.clone().addScaledVector(ps[i+1].clone().sub(corner).normalize(),r);curve.add(new T.LineCurve3(last,before));curve.add(new T.QuadraticBezierCurve3(before,corner,after));last=after;}
 curve.add(new T.LineCurve3(last,ps.at(-1)!));return add(p,new T.TubeGeometry(curve,Math.max(48,points.length*20),radius,16,false),material);
}
function union(p:T.Object3D,xyz:XYZ,r:number,m:Palette){const g=new T.Group();g.position.set(...xyz);p.add(g);sleeve(g,[0,0,0],r,.20,m.dark);for(let i=0;i<16;i++){const a=i/16*TAU,o=box(g,[Math.cos(a)*r,0,Math.sin(a)*r],[.032,.16,.032],m.dark);o.rotation.y=-a;}for(const y of [-.15,.15]){sleeve(g,[0,y,0],r*.77,.095,m.white);ring(g,[0,y*.62,0],r*.78,.012,m.rubber);}return g;}

/** Complete installation detail. Static hardware follows its selectable parent;
 * wet effects exist only in the assembled system and share the paused model clock. */
export function detailSump(parts:Part[],groups:Record<string,T.Group>,m:Palette){
 const get=(id:string)=>parts.find(p=>p.id===id)!.group;
 const detail=(id:string)=>{const g=new T.Group();get(id).add(g);return g;};
 const edge=new T.MeshPhysicalMaterial({color:0x789b8f,roughness:.12,metalness:.08,transparent:true,opacity:.57,depthWrite:false});
 const joint=new T.MeshStandardMaterial({color:0x667973,roughness:.58});
 const wetGlass=m.glass.clone();wetGlass.opacity=.72;wetGlass.thickness=.09;wetGlass.roughness=.035;
 // Actual edge thickness, silicone seams and small feet replace floating hairline panes.
 for(const id of ['sump-front','sump-back','sump-left','sump-right']){
  const p=get(id),wide=id.endsWith('front')||id.endsWith('back'),w=wide?12:3.64,d=detail(id);(p.children[0] as T.Mesh).material=wetGlass;
  for(const y of [-1.08,1.08])box(d,[0,y,0],wide?[w,.025,.085]:[.085,.025,w],edge);
  for(const x of [-1,1])box(d,wide?[x*(w/2-.015),0,0]:[0,0,x*(w/2-.015)],wide?[.032,2.16,.079]:[.079,2.16,.032],joint);
 }
 const base=detail('sump');for(const x of [-5.5,-1.8,1.8,5.5])for(const z of [-1.55,1.55])box(base,[x,-.18,z],[.52,.13,.39],m.rubber);
 box(base,[0,-.139,0],[12.09,.038,3.88],m.rubber);
 for(const z of [-1.83,1.83])box(base,[0,.029,z],[12.08,.13,.08],m.dark);
 for(let i=0;i<3;i++){const d=detail('baffle-'+i);for(const z of [-1.72,1.72]){box(d,[0,0,z],[.092,i===1?1.91:1.55,.026],edge);box(d,[0,-.52,z],[.19,.23,.10],m.dark);}box(d,[0,i===1?.95:.775,0],[.09,.024,3.5],edge);}
 // Socketed PVC runs: the pressure riser now seats on the return pump outlet.
 const pressure=get('return-pipe');pressure.clear();route(pressure,[[.11,1.61,.60],[.11,1.99,.60],[.35,1.99,0],[.35,3.61,0],[-.55,3.61,0],[-.55,3.38,0]],.12,m.white);
 for(const y of [1.72,2.76,3.31])union(pressure,[y===1.72?.11:.35,y,y===1.72?.6:0],.21,m);
 sleeve(pressure,[.35,2.33,0],.22,.28,m.dark);for(const y of [2.1,2.56])sleeve(pressure,[.35,y,0],.17,.12,m.white);
 const stem=add(pressure,new T.CylinderGeometry(.052,.052,.19,24),m.metal,[.35,2.34,.23]);stem.rotation.x=Math.PI/2;
 box(pressure,[.35,2.34,.345],[.12,.52,.064],m.teal);for(const y of [2.1,2.58])ring(pressure,[.35,y,0],.173,.009,m.rubber);
 sleeve(pressure,[-.55,3.37,0],.151,.16,m.white);sleeve(pressure,[.11,1.60,.6],.167,.15,m.dark);
 const inlet=get('overflow');inlet.clear();box(inlet,[0,3.26,0],[1.25,.58,.72],m.dark);box(inlet,[0,3.57,0],[1.28,.045,.75],m.dark);
 for(let i=0;i<12;i++)box(inlet,[-.56+i*.102,3.61,.35],[.047,.18,.06],m.teal);
 route(inlet,[[0,2.97,0],[0,2.8,0],[-.25,2.8,0],[-.25,2.05,-.1]],.135,m.white);union(inlet,[-.25,2.39,-.055],.225,m);sleeve(inlet,[0,2.96,0],.22,.14,m.dark);
 const backup=get('emergency');backup.clear();route(backup,[[0,3.65,0],[.05,3.37,0],[.05,1.58,0],[.33,1.58,0]],.10,m.white);union(backup,[.05,2.7,0],.175,m);
 // Back-wall clips and discrete cable routing, held by the pane during separation.
 const back=detail('sump-back');for(const [x,z] of [[4.3,.08],[-.2,.08]]){for(const y of [-.3,.68]){box(back,[x,y,z],[.22,.12,.13],m.dark);const head=add(back,new T.CylinderGeometry(.033,.033,.035,6),m.metal,[x,y,z+.08]);head.rotation.x=Math.PI/2;}route(back,[[x,-.84,.07],[x+.08,.6,.07],[x+.08,1.17,.07],[x+.32,1.21,-.07]],.025,m.rubber);}
 // Fixed inlet divider keeps the first chamber readable without another removable filter.
 const divider=detail('sump');box(divider,[-2.7,.77,0],[.075,1.30,3.48],wetGlass);box(divider,[-2.7,1.43,0],[.09,.025,3.49],edge);
 for(const z of [-1.73,1.73])box(divider,[-2.7,.73,z],[.12,1.22,.025],joint);
 const dropMaterial=new T.MeshPhysicalMaterial({color:0xd9eee7,roughness:.1,transparent:true,opacity:.29,depthWrite:false,clearcoat:1}),dr=seeded(319),dropMatrix=new T.Object3D();
 for(const id of ['sump-front','sump-back']){const g=get(id),drops=new T.InstancedMesh(new T.SphereGeometry(1,6,4),dropMaterial,260);for(let i=0;i<260;i++){const x=(dr()-.5)*11.5,y=.26+dr()*.68,r=.004+Math.pow(dr(),3)*.02;dropMatrix.position.set(x,y,id==='sump-front'?.05:-.05);dropMatrix.scale.set(r,r*(1+dr()*1.3),r*.18);dropMatrix.updateMatrix();drops.setMatrixAt(i,dropMatrix.matrix);}drops.computeBoundingSphere();g.add(drops);}
 // Subtle graduated operating-level marks on the front pane, without hiding the view.
 const front=detail('sump-front');for(let i=0;i<14;i++)box(front,[-5.7+i%2*.03,-.73+i*.096,.047],[i%5===0?.22:.09,.007,.002],edge);

 const waterGroup=new T.Group();groups.system.add(waterGroup);
 const clock={value:0};
 const normalCanvas=document.createElement('canvas');normalCanvas.width=normalCanvas.height=256;const ctx=normalCanvas.getContext('2d')!,data=ctx.createImageData(256,256);
 const nr=seeded(417),grids=[8,19,43].map(n=>({n,v:Array.from({length:n*n},()=>nr())}));
 const height=(x:number,y:number)=>{let h=0;for(let k=0;k<grids.length;k++){const {n,v}=grids[k],u=((x+256)%256)/256*n,w=((y+256)%256)/256*n,ix=Math.floor(u),iy=Math.floor(w),fx=u-ix,fy=w-iy,sx=fx*fx*(3-2*fx),sy=fy*fy*(3-2*fy),sample=(a:number,b:number)=>v[(b%n)*n+(a%n)];h+=(1/Math.pow(2,k))*(sample(ix,iy)*(1-sx)*(1-sy)+sample(ix+1,iy)*sx*(1-sy)+sample(ix,iy+1)*(1-sx)*sy+sample(ix+1,iy+1)*sx*sy);}return h;};
 const heights=new Float32Array(256*256);for(let y=0;y<256;y++)for(let x=0;x<256;x++)heights[y*256+x]=height(x,y);
 for(let y=0;y<256;y++)for(let x=0;x<256;x++){const i=(y*256+x)*4,nx=(heights[y*256+(x+255)%256]-heights[y*256+(x+1)%256])*4,ny=(heights[((y+255)%256)*256+x]-heights[((y+1)%256)*256+x])*4,k=127/Math.sqrt(nx*nx+ny*ny+1);data.data[i]=128+nx*k;data.data[i+1]=128+ny*k;data.data[i+2]=128+k;data.data[i+3]=255;}ctx.putImageData(data,0,0);
 const ripple=new T.CanvasTexture(normalCanvas);ripple.wrapS=ripple.wrapT=T.RepeatWrapping;ripple.repeat.set(2,1);
 const water=new T.MeshPhysicalMaterial({color:0xc6d1c8,roughness:.075,metalness:.12,envMapIntensity:2,transparent:true,opacity:.48,depthWrite:false,normalMap:ripple,normalScale:new T.Vector2(.62,.62),side:T.DoubleSide});
 water.onBeforeCompile=shader=>{shader.uniforms.sumpTime=clock;shader.vertexShader='uniform float sumpTime;\n'+shader.vertexShader;shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\ntransformed.z += .006*sin(position.x*8.0+position.y*3.0+sumpTime*1.6)+.004*sin(position.y*13.0-position.x*5.0-sumpTime*2.0);');shader.fragmentShader=shader.fragmentShader.replace('#include <opaque_fragment>','diffuseColor.a *= .18 + .82 * pow(1.0-abs(dot(normal,normalize(vViewPosition))),2.0);\n#include <opaque_fragment>');};
 for(const [x,y,w] of [[-1.81,1.635,8.18],[2.78,1.635,.90],[4.56,1.27,2.70]]){const surface=add(waterGroup,new T.PlaneGeometry(w,3.48,Math.ceil(w*14),42),water,[x,y,0]);surface.rotation.x=-Math.PI/2;}
 // Falling sheet has its own fast vertical ripple direction and variable edge profile.
 const fallNormal=ripple.clone();fallNormal.repeat.set(2,5);const fallMat=water.clone();fallMat.normalMap=fallNormal;fallMat.opacity=.67;fallMat.normalScale.set(.85,.85);
 const fall=new T.BufferGeometry(),positions:number[]=[],uv:number[]=[],indices:number[]=[];
 for(let i=0;i<=24;i++){const t=i/24;for(let j=0;j<=72;j++){const z=-1.73+j/72*3.46;positions.push(3.28+.18*t,1.635-.365*t*t,z);uv.push(j/72,t);if(i<24&&j<72){const a=i*73+j;indices.push(a,a+73,a+1,a+1,a+73,a+74);}}}fall.setAttribute('position',new T.Float32BufferAttribute(positions,3));fall.setAttribute('uv',new T.Float32BufferAttribute(uv,2));fall.setIndex(indices);fall.computeVertexNormals();add(waterGroup,fall,fallMat);
 const meniscus=new T.MeshPhysicalMaterial({color:0xb8d4c9,roughness:.07,transparent:true,opacity:.5,depthWrite:false});
 for(const z of [-1.744,1.744])for(const [l,r,y] of [[-5.90,3.23,1.636],[3.46,5.89,1.27]])route(waterGroup,[[l,y,z],[r,y,z]],.013,meniscus);
 // A restrained sheet of refracted light makes the water depth legible on the sump floor.
 const caustic=new T.ShaderMaterial({transparent:true,depthWrite:false,blending:T.AdditiveBlending,uniforms:{t:clock},vertexShader:'varying vec2 v;void main(){v=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:`uniform float t;varying vec2 v;void main(){vec2 p=v*vec2(48.,16.);p+=.28*vec2(sin(p.y*1.3+t*.7),cos(p.x*.7-t*.9));float a=sin(p.x+sin(p.y*1.8)+t*.9),b=cos(p.y+sin(p.x*1.3)-t*.7);float c=pow(max(0.,1.-abs(a+b)),18.);float edge=smoothstep(0.,.025,v.x)*(1.-smoothstep(.975,1.,v.x))*smoothstep(0.,.05,v.y)*(1.-smoothstep(.95,1.,v.y));gl_FragColor=vec4(vec3(.42,.57,.52),c*.065*edge);}`});
 const light=add(waterGroup,new T.PlaneGeometry(11.78,3.46),caustic,[0,.126,0]);light.rotation.x=-Math.PI/2;
 // Small bubbles collect where the weir meets the return chamber; no flow in the dry backup drain.
 const r=seeded(121),count=900,bubbles=new T.BufferGeometry(),coords=new Float32Array(count*3),seeds=Array.from({length:count},()=>[r(),r(),r()]);bubbles.setAttribute('position',new T.BufferAttribute(coords,3));
 const spot=document.createElement('canvas');spot.width=spot.height=32;const sc=spot.getContext('2d')!,gr=sc.createRadialGradient(14,12,1,16,16,15);gr.addColorStop(0,'rgba(236,255,246,.8)');gr.addColorStop(.5,'rgba(236,255,246,.07)');gr.addColorStop(.82,'rgba(236,255,246,.45)');gr.addColorStop(1,'rgba(236,255,246,0)');sc.fillStyle=gr;sc.fillRect(0,0,32,32);
 const foam=new T.Points(bubbles,new T.PointsMaterial({map:new T.CanvasTexture(spot),size:.025,transparent:true,opacity:.56,depthWrite:false}));waterGroup.add(foam);
 return {visibility:(visible:boolean)=>waterGroup.visible=visible,update:(time:number)=>{clock.value=time;ripple.offset.set(time*.026,time*.019);fallNormal.offset.y=-time*.32;for(let i=0;i<count;i++){const [a,b,c]=seeds[i],phase=(a+time*(.14+c*.12))%1;coords[i*3]=3.44+phase*.39;coords[i*3+1]=1.275+Math.sin(phase*Math.PI)*.023-b*.032;coords[i*3+2]=(c-.5)*3.34+Math.sin(time*1.4+a*9)*.017;}bubbles.attributes.position.needsUpdate=true;}};
}
