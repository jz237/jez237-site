import * as T from 'three';
import {finishVehiclePresentation} from './vehicle-presentation';

/** Persistent deposition state. Four tires retain water after leaving a puddle. */
export class VehicleSurface {
  readonly coating={value:new T.Vector4(0,0,0,0)}; // left/right wetness, left/right dirt
  readonly water=new Float32Array(4);
  readonly phase:{value:number};
  distance=0;
  constructor(root:T.Group,id:number){
    this.phase={value:id*.731};finishVehiclePresentation(root);
    const seen=new Set<T.Material>();
    root.traverse(o=>{
      if(!(o instanceof T.Mesh)||!o.userData.wreckRest)return;
      const m=o.material as T.MeshPhysicalMaterial;if(seen.has(m))return;seen.add(m);
      const painted=m.name.startsWith('paint'),glass=o.name.startsWith('glass_'),plastic=/Paint 2|hoses|Interior|Panel Sides/.test(m.name);
      if(painted){const enamel=/^paint_(Marten|Tern|Carrier)$/.test(m.name);m.metalness=plastic?.06:enamel?.12:.23;m.roughness=plastic?.4:enamel?.36:.26;m.clearcoat=plastic?.3:enamel?.85:.96;m.clearcoatRoughness=enamel?.18:.13;m.normalScale.setScalar(.025);m.envMapIntensity=.88;}
      if(glass){m.metalness=.025;m.ior=1.52;m.roughness=.052;m.envMapIntensity=.95;}
      if(m.name.includes('galvanized steel')){m.metalness=.85;m.roughness=.46;}
      if(m.name.includes('cast alloy')){m.metalness=.72;m.roughness=.53;}
      if(m.name.includes('hoses')){m.metalness=0;m.roughness=.87;}
      const base=m.onBeforeCompile,key=m.customProgramCacheKey();
      m.onBeforeCompile=(s,renderer)=>{
        base.call(m,s,renderer);s.uniforms.carCoating=this.coating;s.uniforms.carSurfacePhase=this.phase;
        s.vertexShader=s.vertexShader.replace('#include <common>','#include <common>\nattribute vec4 transferPaint;varying vec4 vTransferredPaint;varying vec3 vCoatingRest;'+(s.vertexShader.includes('attribute vec3 wreckPosition;')?'':'\nattribute vec3 wreckPosition;'))
          .replace('#include <begin_vertex>','#include <begin_vertex>\nvCoatingRest=wreckPosition;vTransferredPaint=transferPaint;');
        s.fragmentShader=s.fragmentShader.replace('#include <common>',`#include <common>
varying vec4 vTransferredPaint;varying vec3 vCoatingRest;uniform vec4 carCoating;uniform float carSurfacePhase;
float coatingHash(vec3 p){return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453);}
float coatingNoise(vec3 p){vec3 c=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(mix(coatingHash(c),coatingHash(c+vec3(1,0,0)),f.x),mix(coatingHash(c+vec3(0,1,0)),coatingHash(c+vec3(1,1,0)),f.x),f.y),mix(mix(coatingHash(c+vec3(0,0,1)),coatingHash(c+vec3(1,0,1)),f.x),mix(coatingHash(c+vec3(0,1,1)),coatingHash(c+vec3(1,1,1)),f.x),f.y),f.z);}
`)
          .replace(/float dust=clamp\(lowBody\*\([^;]+;/,'float dust=clamp(lowBody*.035+vImpactWear.x*.07,0.,.32);')
          .replace('#include <alphamap_fragment>',`#include <alphamap_fragment>
float coatingSide=smoothstep(-.3,.3,vCoatingRest.x);
float deposited=mix(carCoating.z,carCoating.w,coatingSide);
float moisture=mix(carCoating.x,carCoating.y,coatingSide);
float coatingLow=1.-smoothstep(.32,1.28,vCoatingRest.y);
float thrown=exp(-pow((abs(vCoatingRest.z)-1.45)*2.7,2.));
float siltPattern=coatingNoise(vCoatingRest*vec3(26.,40.,22.)+carSurfacePhase)*.58+coatingNoise(vCoatingRest*7.)*.42;
float carDirt=clamp(deposited*(coatingLow*.74+thrown*.38)*(.45+siltPattern),0.,.72);
float carWet=clamp(moisture*(coatingLow*.8+thrown*.3),0.,1.);
${glass?`carDirt*=.1;carWet=moisture*.35;
float droplets=smoothstep(.73,.87,coatingNoise(vCoatingRest*vec3(130.,40.,95.)))*carWet;
diffuseColor.a=clamp(diffuseColor.a+droplets*.11,0.,.98);`:''}
diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.185,.148,.103)*mix(1.,.66,carWet),carDirt);
diffuseColor.rgb*=1.-carWet*.08;
`)
          .replace('#include <roughnessmap_fragment>',`${glass?'':`float transferred=vTransferredPaint.a*(.48+.52*siltPattern);
diffuseColor.rgb=mix(diffuseColor.rgb,vTransferredPaint.rgb,transferred*.85);`}
#include <roughnessmap_fragment>
roughnessFactor=mix(roughnessFactor,.89,carDirt*.8);
roughnessFactor=mix(roughnessFactor,max(.1,roughnessFactor*.48),carWet*(1.-carDirt*.55));`)
          .replace('#include <metalnessmap_fragment>','#include <metalnessmap_fragment>\nmetalnessFactor*=1.-carDirt*.9;')
          .replace('#include <lights_physical_fragment>',`#include <lights_physical_fragment>
#ifdef USE_CLEARCOAT
material.clearcoat*=1.-carDirt*.88;
material.clearcoatRoughness=mix(material.clearcoatRoughness,.07,carWet);
#endif`);
      };
      m.customProgramCacheKey=()=>key+'-persistent-wet-silt-v1-'+Number(glass);
    });
  }
  advance(dt:number,speed:number,gravel:boolean,wet:readonly boolean[],grounded:readonly boolean[]=[true,true,true,true]){
    if(!(dt>0)||!Number.isFinite(dt))return;
    const distance=Math.abs(speed)*dt;this.distance+=distance;
    const v=this.coating.value;
    v.x*=Math.exp(-dt*(.014+Math.abs(speed)*.0007));v.y*=Math.exp(-dt*(.014+Math.abs(speed)*.0007));
    for(let i=0;i<4;i++){
      this.water[i]=wet[i]?1:this.water[i]*Math.exp(-distance*.035-dt*.03);
      const side=i%2?'y':'x',dirt=i%2?'w':'z';
      if(wet[i]&&Math.abs(speed)>.7)v[side]=Math.min(1,v[side]+dt*Math.min(2,Math.abs(speed)*.13));
      if(grounded[i]&&gravel&&Math.abs(speed)>1.4)v[dirt]=Math.min(.9,v[dirt]+distance*(wet[i]?.00065:.00011));
    }
  }
  transfer(mesh:T.Mesh,contact:T.Vector3,damage:number,color?:T.Color){
    if(!color)return;
    const attribute=mesh.geometry.attributes.transferPaint,rest=mesh.userData.wreckRest as T.BufferAttribute;
    if(!attribute||!rest)return;
    const p=new T.Vector3(),radius=.55+Math.min(23,damage)*.02;
    for(let i=0;i<rest.count;i++){
      const weight=Math.max(0,1-p.fromBufferAttribute(rest,i).distanceTo(contact)/radius);
      if(weight<=0)continue;
      const alpha=Math.min(.8,attribute.getW(i)+weight*damage*.012);
      attribute.setXYZW(i,color.r,color.g,color.b,alpha);
    }
    attribute.needsUpdate=true;
  }
  reset(){this.coating.value.set(0,0,0,0);this.water.fill(0);this.distance=0;}
  get stats(){return{wet:[this.coating.value.x,this.coating.value.y],dirt:[this.coating.value.z,this.coating.value.w],tires:Array.from(this.water),distance:this.distance};}
}
