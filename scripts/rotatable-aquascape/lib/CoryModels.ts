import * as T from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
const V=(x=0,y=0,z=0)=>new T.Vector3(x,y,z);
/** Continuous armored trunk with a broad head and narrowing caudal peduncle. */
export function coryProfile(x:number){const knots=[[-.39,.021,.022,.083],[-.30,.036,.031,.085],[-.18,.073,.055,.10],[-.04,.103,.071,.115],[.10,.112,.081,.12],[.21,.084,.077,.105],[.29,.030,.038,.072]];let i=0;while(i<knots.length-2&&x>knots[i+1][0])i++;const a=knots[i],b=knots[i+1],u=T.MathUtils.clamp((x-a[0])/(b[0]-a[0]),0,1);return [1,2,3].map(k=>T.MathUtils.lerp(a[k],b[k],u));}
export function coryWave(x:number,phase:number,effort:number){const w=T.MathUtils.clamp((.10-x)/.58,0,1);return Math.sin(phase+x*11)*w*w*(.010+.038*effort);}
function geometries(){
 const solid:T.BufferGeometry[]=[],fins:T.BufferGeometry[]=[];
 function add(g:T.BufferGeometry,color:T.Color|number,part=9,pivot=V(),fin=false){g=g.index?g.toNonIndexed():g;const n=g.getAttribute('position').count,c=typeof color==='number'?new T.Color(color):color;g.setAttribute('color',new T.Float32BufferAttribute(Array.from({length:n},()=>c.toArray()).flat(),3));g.setAttribute('coryPart',new T.Float32BufferAttribute(Array(n).fill(part),1));g.setAttribute('coryPivot',new T.Float32BufferAttribute(Array.from({length:n},()=>pivot.toArray()).flat(),3));(fin?fins:solid).push(g);return g;}
 function ell(p:T.Vector3,s:T.Vector3,color:number){const g=new T.SphereGeometry(1,20,12);g.scale(s.x,s.y,s.z).translate(p.x,p.y,p.z);return add(g,color);}
 function tube(points:T.Vector3[],r:number,color:number,part=9,pivot=V(),fin=false){return add(new T.TubeGeometry(new T.CatmullRomCurve3(points),12,r,5,false),color,part,pivot,fin);}
 const pos:number[]=[],uv:number[]=[],idx:number[]=[];for(let i=0;i<=64;i++){const x=-.39+i/64*.68,[ry,rz,cy]=coryProfile(x);for(let j=0;j<=40;j++){const a=j/40*Math.PI*2;pos.push(x,cy+Math.sin(a)*ry,Math.cos(a)*rz);uv.push(i/64,j/40);if(i<64&&j<40){const k=i*41+j;idx.push(k,k+41,k+1,k+1,k+41,k+42);}}}
 const body=new T.BufferGeometry();body.setAttribute('position',new T.Float32BufferAttribute(pos,3));body.setAttribute('uv',new T.Float32BufferAttribute(uv,2));body.setIndex(idx);body.computeVertexNormals();const b=add(body,0xd5c6a4,0),p=b.getAttribute('position'),colors=b.getAttribute('color');
 // Irregular flank blotches and fine mottling, matched to the generated macro plate.
 for(let i=0;i<p.count;i++){const c=new T.Color(0xb4a887);colors.setXYZ(i,c.r,c.g,c.b);}
 // Two raised armor seams follow the body contour rather than floating above it.
 for(const side of [-1,1])for(let i=0;i<19;i++){const x=-.30+i*.025;for(const row of [-.35,.45]){const points=[];for(let j=0;j<6;j++){const a=row+(j/5-.5)*.62,xx=x+.008*Math.sin(j/5*Math.PI),[ry,rz,cy]=coryProfile(xx);points.push(V(xx,cy+Math.sin(a)*ry,side*Math.cos(a)*rz));}tube(points,.0014,0x9f967b);}}
 for(const side of [-1,1]){ell(V(.20,.151,side*.065),V(.031,.031,.011),0xb8aa80);ell(V(.205,.153,side*.073),V(.024,.024,.011),0x090c0b);ell(V(.213,.163,side*.081),V(.006,.006,.003),0xcde4dc);tube([V(.11,.20,side*.035),V(.13,.135,side*.079),V(.16,.077,side*.056)],.0026,0x928772);}
 const mouth=new T.TorusGeometry(.021,.004,8,24);mouth.rotateX(Math.PI/2);mouth.scale(1,1,.65);mouth.translate(.261,.044,0);add(mouth,0xb9aa8a);ell(V(.258,.044,0),V(.016,.003,.011),0x443b30);
 for(const side of [-1,1])for(let k=0;k<3;k++){const root=V(.25-k*.015,.051,side*(.017+k*.009));tube([root,root.clone().add(V(.035,.0,side*.025)),root.clone().add(V(.067-k*.012,-.018,side*(.044+k*.015)))],.0021,0xc6b797,8,root);}
 function fan(root:T.Vector3,edge:T.Vector3[],part:number){const ps:number[]=[],indices:number[]=[];for(let j=0;j<edge.length;j++){ps.push(...root.toArray(),...edge[j].toArray());if(j<edge.length-1)indices.push(j*2,j*2+1,j*2+3);tube([root,root.clone().lerp(edge[j],.45).add(V(0,.001,0)),edge[j]],j===0?.0025:.0011,0x978d6e,part,root,true);}
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(ps,3));g.setAttribute('uv',new T.Float32BufferAttribute(Array(ps.length/3).fill([0,0]).flat(),2));g.setIndex(indices);g.computeVertexNormals();add(g,0xc0bd9c,part,root,true);
 }
 fan(V(-.37,.084,0),Array.from({length:19},(_,i)=>{const a=i/18;return V(-.56+.09*Math.sin(a*Math.PI),.084+(a-.5)*.28,.004*Math.sin(a*6));}),1);
 fan(V(.045,.20,0),Array.from({length:13},(_,i)=>{const a=i/12;return V(.025-a*.20,.20+Math.sin((a*.83+.15)*Math.PI)*.145,0);}),2);
 fan(V(-.23,.12,0),[V(-.25,.16,0),V(-.29,.155,0),V(-.31,.115,0)],3);
 for(const side of [-1,1]){fan(V(.12,.057,side*.045),Array.from({length:12},(_,i)=>{const a=i/11;return V(.15-a*.19,.023+Math.sin(a*Math.PI)*.017,side*(.065+.12*Math.sin((a*.8+.15)*Math.PI)));}),side<0?4:5);fan(V(-.12,.039,side*.025),Array.from({length:9},(_,i)=>{const a=i/8;return V(-.12-a*.11,.025,side*(.035+.075*Math.sin(a*Math.PI)));}),side<0?6:7);}
 return [mergeGeometries(solid),mergeGeometries(fins)];
}
export class CoryModels{
 readonly root=new T.Group();readonly meshes:T.InstancedMesh[]=[];readonly motion:T.InstancedBufferAttribute;
 constructor(count:number){this.root.name='Dwarf Corydoras group';this.motion=new T.InstancedBufferAttribute(new Float32Array(count*3),3);const gs=geometries();for(let i=0;i<2;i++){const g=gs[i];g.setAttribute('coryMotion',this.motion);const m=new T.MeshStandardMaterial({vertexColors:true,roughness:i?.36:.48,metalness:.08,side:T.DoubleSide,transparent:i===1,opacity:i?.62:1,depthWrite:i===0});const mesh=new T.InstancedMesh(g,m,count);mesh.frustumCulled=false;mesh.castShadow=i===0;mesh.receiveShadow=true;mesh.instanceMatrix.setUsage(T.DynamicDrawUsage);this.meshes.push(mesh);this.root.add(mesh);
 const shader=(s:T.WebGLProgramParametersWithUniforms)=>{s.vertexShader=`varying vec3 coryLocal;varying float corySkin;attribute float coryPart;attribute vec3 coryPivot;attribute vec3 coryMotion;
 vec3 coryPose(vec3 p){float phase=coryMotion.x,effort=coryMotion.y;vec3 q=p-coryPivot;float a=0.;if(coryPart>3.5&&coryPart<7.5){a=sin(phase*.61+coryPart*1.8)*(.10+.32*effort);q.yz=mat2(cos(a),sin(a),-sin(a),cos(a))*q.yz;}else if(coryPart>7.5&&coryPart<8.5){a=sin(coryMotion.z*9.+coryPivot.z*27.)*.10;q.xz=mat2(cos(a),sin(a),-sin(a),cos(a))*q.xz;}else if(coryPart>1.5&&coryPart<3.5){q.z+=sin(phase*.47+coryPart)*q.y*.12;}p=coryPivot+q;float w=clamp((.10-p.x)/.58,0.,1.);p.z+=sin(phase+p.x*11.)*w*w*(.010+.038*effort);return p;}
`+s.vertexShader;s.vertexShader=s.vertexShader.replace('#include <begin_vertex>','coryLocal=position;corySkin=coryPart;vec3 transformed=coryPose(position);');s.fragmentShader=`varying vec3 coryLocal;varying float corySkin;
 float coryHash(vec3 p){return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453);}
 float coryNoise(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(mix(coryHash(i),coryHash(i+vec3(1,0,0)),f.x),mix(coryHash(i+vec3(0,1,0)),coryHash(i+vec3(1,1,0)),f.x),f.y),mix(mix(coryHash(i+vec3(0,0,1)),coryHash(i+vec3(1,0,1)),f.x),mix(coryHash(i+vec3(0,1,1)),coryHash(i+vec3(1,1,1)),f.x),f.y),f.z);}
 `+s.fragmentShader;s.fragmentShader=s.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
 if(corySkin<.5){vec3 p=coryLocal;float n=coryNoise(p*vec3(40.,56.,61.)),small=coryNoise(p*260.),grain=coryNoise(p*1300.);float flank=1.-smoothstep(.025,.085,abs(p.y-.12));float pigment=smoothstep(.51,.65,n+small*.16)*smoothstep(.043,.086,p.y);float speck=smoothstep(.66,.76,small)*smoothstep(.07,.14,p.y);diffuseColor.rgb*=mix(vec3(.94,.91,.84),vec3(.13,.12,.095),clamp(pigment*(.62+.30*flank)+speck*.5,0.,.97));diffuseColor.rgb*=.88+grain*.21;}
 if(corySkin>0.5&&corySkin<7.5){float spot=coryNoise(coryLocal*vec3(95.,100.,110.));diffuseColor.rgb*=mix(1.,.22,smoothstep(.58,.70,spot));}
 `);s.vertexShader=s.vertexShader.replace('#include <beginnormal_vertex>',`vec3 t=normalize(cross(normal,abs(normal.y)<.9?vec3(0,1,0):vec3(1,0,0)));vec3 b=cross(normal,t);vec3 objectNormal=normalize(cross(coryPose(position+t*.001)-coryPose(position),coryPose(position+b*.001)-coryPose(position)));`);};m.onBeforeCompile=shader;m.customProgramCacheKey=()=>`cory-articulated-v1-${i}`;const depth=new T.MeshDepthMaterial({depthPacking:T.RGBADepthPacking});depth.onBeforeCompile=shader;depth.customProgramCacheKey=()=> 'cory-depth-v1';mesh.customDepthMaterial=depth;}
 }
 pose(id:number,p:T.Vector3,yaw:number,pitch:number,scale:number,phase:number,effort:number,time:number){const m=new T.Matrix4().compose(p,new T.Quaternion().setFromEuler(new T.Euler(0,yaw,pitch,'YXZ')),new T.Vector3().setScalar(scale));this.meshes.forEach(mesh=>mesh.setMatrixAt(id,m));this.motion.setXYZ(id,phase,effort,time);}
 flush(){this.motion.needsUpdate=true;this.meshes.forEach(m=>m.instanceMatrix.needsUpdate=true);}
}

