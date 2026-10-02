import * as T from 'three';
import type R from '@dimforge/rapier3d-compat';
import type {CarKind} from './rules';
import {measureTyreVisual,tyreDeformationShader,type TyreVisualCondition,type TyreVisualProfile} from './tyre-visual';

export {wheelResponse} from './wheel-physics';
export type {TyreVisualCondition} from './tyre-visual';

/** Loaded contact patch plus explicit tyre failure. No pressure state or time
 * is integrated here: live cars, authority snapshots and replay share inputs. */
export class TireContact {
  readonly plane={value:new T.Vector4(0,1,0,0)};
  readonly load={value:0};
  readonly active={value:0};
  readonly dirt={value:0};
  readonly failure={value:0};
  readonly radius:{value:number};
  readonly baseRadius:{value:number};
  readonly profile:TyreVisualProfile;
  private readonly shadows:T.Material[]=[];
  constructor(wheel:T.Object3D,kind?:CarKind,private readonly intactRadius=.375){
    this.radius={value:intactRadius};this.baseRadius={value:intactRadius};
    const measured=measureTyreVisual(wheel,kind);this.profile=measured.profile;
    for(const {mesh:o,toWheel,fromWheel,maskRadius,legacy} of measured.meshes){
      const old=o.material as T.MeshPhysicalMaterial,m=old.clone();o.material=m;
      // These wheel ribs formerly shared the body hose material. Preserve its
      // VehicleSurface finish when giving each wheel independent tyre uniforms.
      if(kind==='coupe'&&old.name==='Structure hoses'){m.metalness=0;m.roughness=.87;}
      const uniforms={
        tireGround:this.plane,tireLoad:this.load,tireContact:this.active,tireDirt:this.dirt,
        tireFailure:this.failure,tireRadius:this.radius,tireBaseRadius:this.baseRadius,tireLegacy:{value:legacy?1:0},
        tireToWheel:{value:toWheel},tireFromWheel:{value:fromWheel},
        tireNormalToWheel:{value:new T.Matrix3().getNormalMatrix(toWheel)},
        tireNormalFromWheel:{value:new T.Matrix3().getNormalMatrix(fromWheel)},
        tireProfile:{value:new T.Vector4(this.profile.rimRadius,this.profile.outerRadius,this.profile.halfWidth,maskRadius)},
      };
      const patch=(material:T.Material,shadow:boolean)=>{
        const base=material.onBeforeCompile,key=material.customProgramCacheKey();
        material.onBeforeCompile=(s,renderer)=>{
          base.call(material,s,renderer);Object.assign(s.uniforms,uniforms);
          s.vertexShader=s.vertexShader.replace('#include <common>','#include <common>\nvarying float vTyreAffected;\n'+tyreDeformationShader)
            .replace('#include <beginnormal_vertex>','#include <beginnormal_vertex>\nobjectNormal=tyrePressureNormal(position,objectNormal);')
            .replace('#include <begin_vertex>',`#include <begin_vertex>
transformed=tyrePressurePoint(transformed);
vTyreAffected=step(max(tireProfile.w,tireProfile.x*step(.000001,tireFailure))+.000001,length((tireToWheel*vec4(position,1.)).yz));
if(vTyreAffected>0.)transformed=tyreLoadedPoint(transformed);
vec3 tyreWorld=(modelMatrix*vec4(transformed,1.)).xyz;
float tyreHeight=dot(tyreWorld,tireGround.xyz)+tireGround.w;
float tyreEnabled=${shadow?'step(.000001,tireFailure)':'max(tireLegacy,step(.000001,tireFailure))'}*vTyreAffected;
transformed.x*=1.+tireLoad*.055*(1.-smoothstep(0.,.24,tyreHeight))*tireContact*tyreEnabled*(1.-step(.000001,tireFailure));`)
            .replace('#include <project_vertex>',`#include <project_vertex>
tyreWorld=(modelMatrix*vec4(transformed,1.)).xyz;
float tyreLiftLimit=mix(.08,max(.08,tireProfile.y-tireRadius+.04),tireFailure);
float tyreLift=clamp(-(dot(tyreWorld,tireGround.xyz)+tireGround.w),0.,tyreLiftLimit)*tireContact*tyreEnabled;
mvPosition+=viewMatrix*vec4(tireGround.xyz*tyreLift,0.);
gl_Position=projectionMatrix*mvPosition;`)
            .replace('#include <worldpos_vertex>','#include <worldpos_vertex>\n#if defined(USE_ENVMAP) || defined(DISTANCE) || defined(USE_SHADOWMAP) || defined(USE_TRANSMISSION) || NUM_SPOT_LIGHT_COORDS > 0\nworldPosition.xyz+=tireGround.xyz*tyreLift*step(.000001,tireFailure);\n#endif');
          if(!shadow)s.fragmentShader=s.fragmentShader.replace('#include <common>','#include <common>\nvarying float vTyreAffected;uniform float tireDirt;uniform float tireLegacy;uniform float tireFailure;')
            .replace('#include <color_fragment>','#include <color_fragment>\ndiffuseColor.rgb=mix(diffuseColor.rgb,vec3(.17,.135,.095),tireDirt*.6*max(tireLegacy,step(.000001,tireFailure))*vTyreAffected);');
        };
        material.customProgramCacheKey=()=>key+'-loaded-sidewall-pressure-v3'+(shadow?'-shadow':'');
      };
      patch(m,false);
      const depth=new T.MeshDepthMaterial({depthPacking:T.RGBADepthPacking,side:m.side});
      const distance=new T.MeshDistanceMaterial({side:m.side});
      patch(depth,true);patch(distance,true);o.customDepthMaterial=depth;o.customDistanceMaterial=distance;
      this.shadows.push(depth,distance);
    }
  }
  setCondition(condition?:TyreVisualCondition){
    this.failure.value=T.MathUtils.clamp(Number.isFinite(condition?.failure)?condition!.failure:0,0,1);
    this.radius.value=Number.isFinite(condition?.radius)?condition!.radius:this.intactRadius;
    this.baseRadius.value=Number.isFinite(condition?.baseRadius)?condition!.baseRadius!:condition?this.profile.outerRadius:this.intactRadius;
  }
  reset(){this.setCondition();this.active.value=0;this.load.value=0;this.dirt.value=0;}
  update(controller:R.DynamicRayCastVehicleController,index:number,mass:number,damage:number,dirt:number,condition?:TyreVisualCondition){
    this.setCondition(condition);
    const normal=controller.wheelContactNormal(index),point=controller.wheelContactPoint(index);
    this.active.value=controller.wheelIsInContact(index)&&!!normal&&!!point?1:0;
    if(normal&&point)this.plane.value.set(normal.x,normal.y,normal.z,-(normal.x*point.x+normal.y*point.y+normal.z*point.z)-.001);
    this.load.value=T.MathUtils.clamp((controller.wheelSuspensionForce(index)??0)/(mass*9.81/4),0,2)+damage*.5;
    this.dirt.value=dirt;
  }
  /** Colour materials belong to Vehicle; only these additional shadow
   * programs are owned here. Cached geometry and materials are never disposed. */
  dispose(){for(const material of this.shadows)material.dispose();this.shadows.length=0;}
}
