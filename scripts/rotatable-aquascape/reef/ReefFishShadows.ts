import * as T from 'three';
import {sandHeight} from './ReefOptics.ts';
import {type ReefFish} from './ReefFish.ts';

/** Broad overhead light produces diffuse fish penumbras, not crisp cutouts.
 * A single instanced draw updates continuously. Static reef occlusion is cached
 * separately; these footprints approximate fish shadows on the sand only. */
export class ReefFishShadows {
 readonly mesh:T.InstancedMesh;
 private dummy=new T.Object3D();
 private updates=0;
 private opacity:T.InstancedBufferAttribute;
 constructor(private fish:ReefFish,private light:T.Vector3,daylight:{value:number}){
  const geometry=new T.PlaneGeometry(1,1,12,8);geometry.rotateX(-Math.PI/2);
  this.opacity=new T.InstancedBufferAttribute(new Float32Array(fish.fish.length),1);
  geometry.setAttribute('shadowOpacity',this.opacity);
  const material=new T.ShaderMaterial({transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-1,
   uniforms:{daylight},vertexShader:`attribute float shadowOpacity;varying vec2 v;varying vec3 world;varying float strength;
   float bed(vec2 p){
    float x=p.x,z=p.y;
    float left=exp(-(pow(x+2.95+sin(z*1.8)*.16,2.)/1.65+pow(z-.1,2.)/3.2));
    float right=exp(-(pow(x-2.55-sin(z*1.5)*.23,2.)/2.15+pow(z-.2,2.)/3.5));
    float toe=exp(-(pow(x-.7,2.)/.4+pow(z-1.43,2.)/.4));
    float bank=min(1.,left+right+toe*.42),edge=min(1.,min(max(0.,(5.03-abs(x))*4.),max(0.,(2.305-abs(z))*4.)));
    float phase=z*11.4+x*.85+sin(x*1.9)*.65;
    float dunes=.115*exp(-(pow(x+1.85,2.)/.85+pow(z-1.42,2.)/.32))+.14*exp(-(pow(x-1.48,2.)/.65+pow(z-1.58,2.)/.26))+.09*exp(-(pow(x+3.85,2.)/.45+pow(z-.98,2.)/.30));
    return .18+edge*edge*(3.-2.*edge)*(bank*.14+dunes+(sin(phase)+sin(phase*2.+.7)*.22)*(.010+bank*.008)+sin(x*2.1+z*.7)*cos(z*1.6)*.009);
   }
   void main(){v=uv;strength=shadowOpacity;vec4 p=modelMatrix*instanceMatrix*vec4(position,1.);p.y=bed(p.xz)+.006;world=p.xyz;gl_Position=projectionMatrix*viewMatrix*p;}`,
   fragmentShader:`varying vec2 v;varying vec3 world;varying float strength;uniform float daylight;
   void main(){if(abs(world.x)>5.02||abs(world.z)>2.30)discard;
    vec2 p=(v-.5)*2.;float shape=exp(-dot(p,p)*4.5)*(1.-smoothstep(.64,1.,length(p)));
    gl_FragColor=vec4(.025,.045,.075,shape*strength*daylight);
   }`});
  this.mesh=new T.InstancedMesh(geometry,material,fish.fish.length);this.mesh.name='Continuous soft fish penumbras';this.mesh.frustumCulled=false;
  this.update();
 }
 snapshot(){const a=this.mesh.instanceMatrix.array;return {updates:this.updates,centers:this.fish.fish.map((_,i)=>[a[i*16+12],a[i*16+14]])};}
 update(){this.updates++;for(let i=0;i<this.fish.fish.length;i++){
  const f=this.fish.fish[i],p=f.position,h=Math.max(0,p.y-sandHeight(p.x,p.z)),size=f.group.scale.x;
  const projection=h/Math.max(1,this.light.y-p.y);
  this.dummy.position.set(p.x+(p.x-this.light.x)*projection,0,p.z+(p.z-this.light.z)*projection);
  this.dummy.rotation.set(0,f.yaw,0);
  // Higher fish have wider, fainter footprints; no sharp jumping silhouette.
  this.dummy.scale.set(size*(1+projection)+h*.25,.1,size*.34*(1+projection)+h*.25);
  this.dummy.updateMatrix();this.mesh.setMatrixAt(i,this.dummy.matrix);
  this.opacity.setX(i,.28/(1+h*.65));
 }this.mesh.instanceMatrix.needsUpdate=true;this.opacity.needsUpdate=true;}
}
