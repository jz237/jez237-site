import * as T from 'three';
import type {CarKind} from './rules';

export type TyreVisualCondition={failure:number;radius:number;baseRadius?:number};
export type TyreVisualProfile={outerRadius:number;rimRadius:number;halfWidth:number};
export type TyreMeshProfile={mesh:T.Mesh;toWheel:T.Matrix4;fromWheel:T.Matrix4;maskRadius:number;legacy:boolean};

/** Wheel coordinates are metres, including the authored wheel scale, with X
 * along the axle. Geometry buffers and metal meshes are never modified. */
export function measureTyreVisual(wheel:T.Object3D,kind?:CarKind){
  wheel.updateWorldMatrix(true,true);
  const toAxle=new T.Matrix4().makeScale(...wheel.scale.toArray()).multiply(wheel.matrixWorld.clone().invert());
  const meshes:TyreMeshProfile[]=[];
  let outerRadius=0,rimRadius=0,halfWidth=0;
  wheel.traverse(object=>{
    if(!(object instanceof T.Mesh)||Array.isArray(object.material))return;
    const name=object.material.name,tyre=/tire|tyre/i.test(name),blocker=name==='WheelViewBlocker';
    // These original moulded rubber ribs share a material batch with brake
    // drill details. Only the outer vertices are rubber; the drill discs stay.
    const ribs=kind==='coupe'&&name==='Structure hoses',maskRadius=ribs?.30:0;
    const toWheel=toAxle.clone().multiply(object.matrixWorld),p=object.geometry.attributes.position,point=new T.Vector3();
    for(let i=0;i<p.count;i++){
      point.fromBufferAttribute(p,i).applyMatrix4(toWheel);const radial=Math.hypot(point.y,point.z);
      if(tyre){outerRadius=Math.max(outerRadius,radial);halfWidth=Math.max(halfWidth,Math.abs(point.x));}
      else if(!blocker&&!(ribs&&radial>maskRadius))rimRadius=Math.max(rimRadius,radial);
    }
    if(tyre||blocker||ribs)meshes.push({mesh:object,toWheel,fromWheel:toWheel.clone().invert(),maskRadius,legacy:/^Tire/.test(name)});
  });
  return {profile:{outerRadius,rimRadius,halfWidth},meshes};
}

/** The physical radius is the loaded hub height, not the free carcass radius.
 * Retaining 78% of the released sidewall height gives the road a broad patch to
 * compress; radial lugs stay proud instead of becoming a low-profile tyre. */
export function tyreCarcassRadius(profile:TyreVisualProfile,condition:TyreVisualCondition){
  const failure=T.MathUtils.clamp(condition.failure,0,1),outer=profile.outerRadius;
  const base=Number.isFinite(condition.baseRadius)?condition.baseRadius!:outer;
  const contact=condition.radius+(outer-base)*(1-failure);
  return T.MathUtils.clamp(outer-(outer-contact)*.22,profile.rimRadius+.003,outer);
}

/** Airborne pressure loss: bounded, deterministic folds turn with the rubber.
 * The preserved bead, metal and mixed-material brake details never move. */
export function deformTyrePoint(point:T.Vector3,profile:TyreVisualProfile,condition:TyreVisualCondition|undefined,maskRadius=0,target=new T.Vector3()){
  target.copy(point);
  const failure=T.MathUtils.clamp(Number.isFinite(condition?.failure)?condition!.failure:0,0,1);
  if(!failure)return target;
  const r=Math.hypot(point.y,point.z),rim=profile.rimRadius,outer=profile.outerRadius;
  if(r<=Math.max(maskRadius,rim)||outer<=rim)return target;
  const radius=tyreCarcassRadius(profile,condition!),radial=rim+(r-rim)*(radius-rim)/(outer-rim);
  const t=T.MathUtils.clamp((r-rim)/(outer-rim),0,1),c=point.y/r,s=point.z/r,cos4=1-8*c*c*s*s;
  target.y*=radial/r;target.z*=radial/r;
  target.x+=Math.sign(point.x)*Math.min(.012,profile.halfWidth*.10)*failure*Math.sin(t*Math.PI)*(1+.6*cos4);
  return target;
}

export type TyreVisualContact={wheelToWorld:T.Matrix4;plane:T.Vector4;load:number;active:number};
/** CPU proof of the shared shader, in metre-scaled axle coordinates. Contact
 * comes from recorded/controller data, so spinning or seeking cannot move the
 * flat patch away from the road. This is not called by the rendering loop. */
export function deformTyreContactPoint(point:T.Vector3,profile:TyreVisualProfile,condition:TyreVisualCondition|undefined,contact:TyreVisualContact,maskRadius=0,target=new T.Vector3()){
  deformTyrePoint(point,profile,condition,maskRadius,target);
  if(!condition?.failure||!contact.active||Math.hypot(point.y,point.z)<=Math.max(maskRadius,profile.rimRadius))return target;
  const radius=tyreCarcassRadius(profile,condition),r=Math.hypot(target.y,target.z);
  const t=T.MathUtils.clamp((r-profile.rimRadius)/(radius-profile.rimRadius),0,1),world=target.clone().applyMatrix4(contact.wheelToWorld);
  const height=world.x*contact.plane.x+world.y*contact.plane.y+world.z*contact.plane.z+contact.plane.w;
  const near=1-T.MathUtils.smoothstep(height,.012,.18);
  target.x+=Math.sign(target.x)*Math.min(.045,profile.halfWidth*.33)*condition.failure*contact.active*T.MathUtils.clamp(contact.load,.35,1.35)*Math.sin(t*Math.PI)*near;
  world.copy(target).applyMatrix4(contact.wheelToWorld);
  const lift=T.MathUtils.clamp(-(world.x*contact.plane.x+world.y*contact.plane.y+world.z*contact.plane.z+contact.plane.w),0,T.MathUtils.lerp(.08,Math.max(.08,profile.outerRadius-condition.radius+.04),condition.failure))*contact.active;
  world.addScaledVector(new T.Vector3(contact.plane.x,contact.plane.y,contact.plane.z),lift);
  return target.copy(world).applyMatrix4(contact.wheelToWorld.clone().invert());
}

/** Shared by colour, depth and distance passes. The normal transform is the
 * analytic inverse transpose of the radial/fold/loaded-sidewall mappings. */
export const tyreDeformationShader=`
uniform mat4 tireToWheel;
uniform mat4 tireFromWheel;
uniform mat3 tireNormalToWheel;
uniform mat3 tireNormalFromWheel;
uniform vec4 tireProfile;
uniform float tireFailure;
uniform float tireRadius;
uniform float tireBaseRadius;
uniform float tireLegacy;
uniform vec4 tireGround;
uniform float tireLoad;
uniform float tireContact;
float tyreCarcassRadius() {
  float contact=tireRadius+(tireProfile.y-tireBaseRadius)*(1.-tireFailure);
  return clamp(tireProfile.y-(tireProfile.y-contact)*.22,tireProfile.x+.003,tireProfile.y);
}
vec3 tyrePressureAxle(vec3 q) {
  float r=length(q.yz),rim=tireProfile.x,outer=tireProfile.y;
  float radial=rim+(r-rim)*(tyreCarcassRadius()-rim)/(outer-rim);
  float t=clamp((r-rim)/(outer-rim),0.,1.);
  vec2 d=q.yz/r;
  float cos4=1.-8.*d.x*d.x*d.y*d.y;
  q.yz*=radial/r;
  q.x+=sign(q.x)*min(.012,tireProfile.z*.10)*tireFailure*sin(t*3.141592653589793)*(1.+.6*cos4);
  return q;
}
vec3 tyrePressurePoint(vec3 p) {
  if(tireFailure<=0.)return p;
  vec3 q=(tireToWheel*vec4(p,1.)).xyz;
  if(length(q.yz)<=max(tireProfile.w,tireProfile.x)||tireProfile.y<=tireProfile.x)return p;
  return (tireFromWheel*vec4(tyrePressureAxle(q),1.)).xyz;
}
vec3 tyreLoadedPoint(vec3 p) {
  if(tireFailure<=0.||tireContact<=0.)return p;
  vec3 q=(tireToWheel*vec4(p,1.)).xyz;
  float r=length(q.yz),rim=tireProfile.x;
  if(r<=rim)return p;
  float t=clamp((r-rim)/(tyreCarcassRadius()-rim),0.,1.);
  vec3 world=(modelMatrix*vec4(p,1.)).xyz;
  float height=dot(world,tireGround.xyz)+tireGround.w;
  float near=1.-smoothstep(.012,.18,height);
  q.x+=sign(q.x)*min(.045,tireProfile.z*.33)*tireFailure*tireContact*clamp(tireLoad,.35,1.35)*sin(t*3.141592653589793)*near;
  return (tireFromWheel*vec4(q,1.)).xyz;
}
vec3 tyrePressureNormal(vec3 p,vec3 normal) {
  if(tireFailure<=0.)return normal;
  vec3 q=(tireToWheel*vec4(p,1.)).xyz;
  float r=length(q.yz),rim=tireProfile.x,outer=tireProfile.y;
  if(r<=max(tireProfile.w,rim)||outer<=rim)return normal;
  float radialScale=(tyreCarcassRadius()-rim)/(outer-rim);
  float radial=rim+(r-rim)*radialScale;
  vec2 direction=q.yz/r,tangent=vec2(-direction.y,direction.x);
  vec3 n=tireNormalToWheel*normal;
  float radialNormal=dot(n.yz,direction),tangentNormal=dot(n.yz,tangent);
  float t=clamp((r-rim)/(outer-rim),0.,1.),sine=sin(t*3.141592653589793),cosine=cos(t*3.141592653589793);
  float cos4=1.-8.*direction.x*direction.x*direction.y*direction.y;
  float sin4=4.*direction.x*direction.y*(direction.x*direction.x-direction.y*direction.y);
  float amplitude=sign(q.x)*min(.012,tireProfile.z*.10)*tireFailure;
  float bulgeRadial=amplitude*3.141592653589793*cosine*(1.+.6*cos4)/(outer-rim);
  float bulgeTangent=-amplitude*sine*2.4*sin4/r;
  n.yz=direction*(radialNormal-n.x*bulgeRadial)/radialScale+tangent*(tangentNormal-n.x*bulgeTangent)/(radial/r);
  if(tireContact>0.) {
    vec3 pressure=tyrePressureAxle(q);
    mat4 axleToWorld=modelMatrix*tireFromWheel;
    vec3 world=(axleToWorld*vec4(pressure,1.)).xyz;
    float height=dot(world,tireGround.xyz)+tireGround.w;
    float h=clamp((height-.012)/.168,0.,1.);
    float near=1.-h*h*(3.-2.*h),nearDerivative=-6.*h*(1.-h)/.168;
    vec3 groundAxle=transpose(mat3(axleToWorld))*tireGround.xyz;
    float loaded=sign(q.x)*min(.045,tireProfile.z*.33)*tireFailure*tireContact*clamp(tireLoad,.35,1.35);
    vec3 gradient=loaded*(sine*nearDerivative*groundAxle+vec3(0.,direction)*3.141592653589793*cosine*near/(tyreCarcassRadius()-rim));
    n-=gradient*n.x/max(.15,1.+gradient.x);
  }
  return normalize(tireNormalFromWheel*n);
}
`;
