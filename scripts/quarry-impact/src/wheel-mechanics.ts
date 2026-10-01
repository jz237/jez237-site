import * as T from 'three';
import type R from '@dimforge/rapier3d-compat';

export {wheelResponse} from './wheel-physics';

/** Small sidewall bulge and a flat contact patch, evaluated against real ground. */
export class TireContact {
  readonly plane={value:new T.Vector4(0,1,0,0)};
  readonly load={value:0};
  readonly active={value:0};
  readonly dirt={value:0};
  constructor(wheel:T.Object3D){
    wheel.traverse(o=>{
      if(!(o instanceof T.Mesh)||!/^Tire/.test((o.material as T.Material).name))return;
      const old=o.material as T.MeshPhysicalMaterial,m=old.clone();o.material=m;
      const base=old.onBeforeCompile,key=old.customProgramCacheKey();
      m.onBeforeCompile=(s,renderer)=>{
        base.call(m,s,renderer);s.uniforms.tireGround=this.plane;s.uniforms.tireLoad=this.load;s.uniforms.tireContact=this.active;s.uniforms.tireDirt=this.dirt;
        s.vertexShader=s.vertexShader.replace('#include <common>','#include <common>\nuniform vec4 tireGround;uniform float tireLoad;uniform float tireContact;')
          .replace('#include <begin_vertex>',`#include <begin_vertex>
vec3 tyreWorld=(modelMatrix*vec4(transformed,1.)).xyz;
float tyreHeight=dot(tyreWorld,tireGround.xyz)+tireGround.w;
transformed.x*=1.+tireLoad*.055*(1.-smoothstep(0.,.24,tyreHeight))*tireContact;`)
          .replace('#include <project_vertex>',`#include <project_vertex>
tyreWorld=(modelMatrix*vec4(transformed,1.)).xyz;
float tyreLift=clamp(-(dot(tyreWorld,tireGround.xyz)+tireGround.w),0.,.08)*tireContact;
mvPosition+=viewMatrix*vec4(tireGround.xyz*tyreLift,0.);
gl_Position=projectionMatrix*mvPosition;`);
        s.fragmentShader=s.fragmentShader.replace('#include <common>','#include <common>\nuniform float tireDirt;')
          .replace('#include <color_fragment>','#include <color_fragment>\ndiffuseColor.rgb=mix(diffuseColor.rgb,vec3(.17,.135,.095),tireDirt*.6);');
      };
      m.customProgramCacheKey=()=>key+'-loaded-sidewall-v1';
    });
  }
  update(controller:R.DynamicRayCastVehicleController,index:number,mass:number,damage:number,dirt:number){
    const normal=controller.wheelContactNormal(index),point=controller.wheelContactPoint(index);
    this.active.value=controller.wheelIsInContact(index)&&!!normal&&!!point?1:0;
    if(normal&&point)this.plane.value.set(normal.x,normal.y,normal.z,-(normal.x*point.x+normal.y*point.y+normal.z*point.z)-.001);
    this.load.value=T.MathUtils.clamp((controller.wheelSuspensionForce(index)??0)/(mass*9.81/4),0,2)+damage*.5;
    this.dirt.value=dirt;
  }
}
