import * as T from 'three';
/** Contact shadows for the tier without the sun's shadow pass (medium): a soft dark footprint under each car, as wide
 * and long as its body plus CONTACT.spread m, darkest (CONTACT.opacity) on the ground (body CONTACT.rest m above it) and
 * gone by CONTACT.fade[1] m higher,
 * growing softer as the car rises. One instanced draw; nothing at all while the sun's shadows are live. */
export const CONTACT={opacity:.7,spread:.35,fade:[.15,1.6],lift:.05,max:32,rest:.45} as const;
export type ContactCar={current:T.Vector3;currentQ:T.Quaternion;kind:string;root:T.Object3D};
export type ContactSizes=Readonly<Record<string,{halfLength:number;halfWidth:number}>>;
/** How dark a car's footprint is at this height of its body above the floor (m). */
export const contactStrength=(height:number)=>{const h=Number.isFinite(height)?height:9;return CONTACT.opacity*(1-T.MathUtils.smoothstep(h,CONTACT.fade[0],CONTACT.fade[1]));};
export class ContactShadows{
  readonly mesh:T.InstancedMesh<T.PlaneGeometry,T.ShaderMaterial>;
  private strength=new Float32Array(CONTACT.max);private matrix=new T.Matrix4();private q=new T.Quaternion();private yaw=new T.Euler();private at=new T.Vector3();private scale=new T.Vector3();
  constructor(scene:T.Scene){
    const geometry=new T.PlaneGeometry(1,1);geometry.rotateX(-Math.PI/2);
    geometry.setAttribute('contactStrength',new T.InstancedBufferAttribute(this.strength,1).setUsage(T.DynamicDrawUsage));
    const material=new T.ShaderMaterial({name:'contact-shadows',transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2,
      vertexShader:'attribute float contactStrength;varying vec2 vUv;varying float vStrength;void main(){vUv=uv*2.-1.;vStrength=contactStrength;gl_Position=projectionMatrix*modelViewMatrix*instanceMatrix*vec4(position,1.);}',
      // A rounded rectangle with a long soft falloff: darkest in the middle of the footprint.
      fragmentShader:'varying vec2 vUv;varying float vStrength;void main(){vec2 q=abs(vUv);float d=length(max(q-vec2(.55,.62),0.))/.42;float a=(1.-smoothstep(0.,1.,d))*(1.-.35*max(q.x,q.y));gl_FragColor=vec4(0.,0.,0.,a*vStrength);}'});
    this.mesh=new T.InstancedMesh(geometry,material,CONTACT.max);this.mesh.name='contact-shadows';this.mesh.count=0;this.mesh.frustumCulled=false;this.mesh.renderOrder=-1;
    this.mesh.instanceMatrix.setUsage(T.DynamicDrawUsage);scene.add(this.mesh);
  }
  /** Lay the footprints for this frame (none when `on` is false); `floor` gives the ground height under a point. */
  update(cars:readonly ContactCar[],sizes:ContactSizes,floor:(x:number,z:number,near:number)=>number,on:boolean){
    const m=this.mesh;let n=0;
    if(on)for(const c of cars){if(n>=CONTACT.max)break;const size=sizes[c.kind];if(!size||!c.root.visible)continue;const p=c.current,ground=floor(p.x,p.z,p.y);if(!Number.isFinite(ground))continue;
      const k=contactStrength(p.y-ground-CONTACT.rest);if(k<=.01)continue;
      this.yaw.setFromQuaternion(c.currentQ,'YXZ');this.yaw.x=this.yaw.z=0;this.q.setFromEuler(this.yaw);
      const soft=1+Math.max(0,p.y-ground-CONTACT.rest)*.5;this.scale.set((size.halfWidth*2+CONTACT.spread*2)*soft,1,(size.halfLength*2+CONTACT.spread*2)*soft);
      this.matrix.compose(this.at.set(p.x,ground+CONTACT.lift,p.z),this.q,this.scale);m.setMatrixAt(n,this.matrix);this.strength[n]=k;n++;}
    m.count=n;m.visible=n>0;if(n){m.instanceMatrix.needsUpdate=true;(m.geometry.attributes.contactStrength as T.BufferAttribute).needsUpdate=true;}
  }
  dispose(){this.mesh.removeFromParent();this.mesh.geometry.dispose();this.mesh.material.dispose();this.mesh.dispose();}
}
