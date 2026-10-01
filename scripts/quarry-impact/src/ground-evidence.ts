import * as T from 'three';

/** One bounded draw for wet tread, displaced dirt and dragged-part scrapes. */
export class GroundEvidence {
  readonly capacity=2048;
  readonly mesh:T.InstancedMesh;
  readonly data=new Float32Array(this.capacity*4);
  private cursor=0;
  private count=0;
  private time={value:0};
  private pose=new T.Object3D();
  constructor(scene:T.Scene){
    const geometry=new T.PlaneGeometry(.24,1);
    geometry.setAttribute('traceData',new T.InstancedBufferAttribute(this.data,4).setUsage(T.DynamicDrawUsage));
    const material=new T.MeshPhysicalMaterial({color:0x51473a,roughness:.17,metalness:0,clearcoat:.7,transparent:true,opacity:.42,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2});
    material.onBeforeCompile=s=>{
      s.uniforms.traceClock=this.time;
      s.vertexShader=s.vertexShader.replace('#include <common>','#include <common>\nattribute vec4 traceData;varying vec4 vTrace;varying vec2 vTraceUv;')
        .replace('#include <begin_vertex>','#include <begin_vertex>\nvTrace=traceData;vTraceUv=uv;');
      s.fragmentShader=s.fragmentShader.replace('#include <common>','#include <common>\nuniform float traceClock;varying vec4 vTrace;varying vec2 vTraceUv;')
        .replace('#include <alphamap_fragment>',`#include <alphamap_fragment>
float edge=pow(clamp(1.-pow(abs(vTraceUv.x-.5)*2.,4.),0.,1.),.5);
float endMask=smoothstep(0.,.08,vTraceUv.y)*(1.-smoothstep(.92,1.,vTraceUv.y));
float tread=mix(.3,1.,smoothstep(.06,.2,abs(sin(vTraceUv.x*19.))));
float age=max(0.,traceClock-vTrace.y),fade=pow(max(0.,1.-age/vTrace.w),1.35);
diffuseColor.a*=edge*endMask*tread*fade*vTrace.z;
diffuseColor.rgb=vTrace.x<.5?vec3(.085,.073,.055):vTrace.x<1.5?vec3(.2,.16,.105):vec3(.085,.081,.075);`)
        .replace('#include <roughnessmap_fragment>','#include <roughnessmap_fragment>\nroughnessFactor=vTrace.x<.5?.14:.92;')
        .replace('#include <lights_physical_fragment>','#include <lights_physical_fragment>\n#ifdef USE_CLEARCOAT\nmaterial.clearcoat=vTrace.x<.5?.75:0.;\n#endif');
    };
    material.customProgramCacheKey=()=> 'bounded-ground-contact-evidence-v1';
    this.mesh=new T.InstancedMesh(geometry,material,this.capacity);this.mesh.name='wet-tread-dirt-drag-evidence';this.mesh.count=0;this.mesh.frustumCulled=false;this.mesh.receiveShadow=true;this.mesh.renderOrder=1;
    this.mesh.instanceMatrix.setUsage(T.DynamicDrawUsage);scene.add(this.mesh);
  }
  add(point:T.Vector3,yaw:number,length:number,strength:number,kind:0|1|2=0){
    if(!(length>.025)||!(strength>.025)||!Number.isFinite(point.lengthSq()))return;
    const slot=this.cursor++%this.capacity;
    this.pose.position.copy(point);this.pose.position.y+=.012;
    this.pose.rotation.set(-Math.PI/2,0,-yaw);this.pose.scale.set(kind===2?.2:1,Math.min(1.5,Math.max(.09,length)),1);this.pose.updateMatrix();
    this.mesh.setMatrixAt(slot,this.pose.matrix);
    this.data.set([kind,this.time.value,Math.min(1,strength),kind===0?65:kind===1?130:220],slot*4);
    this.count=Math.min(this.capacity,this.count+1);this.mesh.count=this.count;
    this.mesh.instanceMatrix.needsUpdate=true;this.mesh.geometry.attributes.traceData.needsUpdate=true;
  }
  advance(dt:number){if(dt>0&&Number.isFinite(dt))this.time.value+=dt;}
  reset(){this.cursor=this.count=0;this.time.value=0;this.data.fill(0);this.mesh.count=0;this.mesh.geometry.attributes.traceData.needsUpdate=true;}
  get stats(){return{count:this.count,capacity:this.capacity,clock:this.time.value,wet:Array.from({length:this.count},(_,i)=>this.data[i*4]).filter(k=>k===0).length};}
}
