import * as T from 'three';
/** Raindrops landing (offline rain): SPLASHES.count little rings spread over the ground within SPLASHES.reach m of the
 * camera, each opening out to SPLASHES.radius m and fading over SPLASHES.life s before landing again somewhere else.
 * One draw call; positions are set on the CPU as each ring lands (the ground height from the course). */
export const SPLASHES={count:480,reach:14,radius:.18,life:[.35,.6],alpha:.42} as const;
export type GroundHeight=(x:number,z:number)=>number;
type Splash={age:number;life:number};
export function createRainSplashes(scene:T.Object3D,random=Math.random){
  const geometry=new T.InstancedBufferGeometry(),ring=new T.RingGeometry(.72,1,20,1).rotateX(-Math.PI/2);
  geometry.index=ring.index;geometry.setAttribute('position',ring.getAttribute('position'));
  const offset=new T.InstancedBufferAttribute(new Float32Array(SPLASHES.count*3),3).setUsage(T.DynamicDrawUsage),phase=new T.InstancedBufferAttribute(new Float32Array(SPLASHES.count),1).setUsage(T.DynamicDrawUsage);
  geometry.setAttribute('offset',offset);geometry.setAttribute('phase',phase);geometry.instanceCount=SPLASHES.count;
  const material=new T.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{radius:{value:SPLASHES.radius},alpha:{value:SPLASHES.alpha}},
    vertexShader:`attribute vec3 offset;attribute float phase;uniform float radius;varying float vT;void main(){vT=phase;vec3 p=offset+position*radius*(.15+.85*phase);gl_Position=projectionMatrix*viewMatrix*vec4(p,1.);}`,
    fragmentShader:`uniform float alpha;varying float vT;void main(){float a=alpha*(1.-vT)*smoothstep(0.,.12,vT);gl_FragColor=vec4(vec3(.82,.86,.9)*a,a);}`,blending:T.AdditiveBlending});
  const mesh=new T.Mesh(geometry,material);mesh.name='rain_splashes';mesh.frustumCulled=false;mesh.visible=false;mesh.renderOrder=2;scene.add(mesh);
  const drops:Splash[]=Array.from({length:SPLASHES.count},()=>({age:0,life:0}));let active=false,landed=0;
  const land=(i:number,c:T.Vector3,ground:GroundHeight,stagger:boolean)=>{const d=drops[i],a=random()*Math.PI*2,r=Math.sqrt(random())*SPLASHES.reach,x=c.x+Math.cos(a)*r,z=c.z+Math.sin(a)*r,y=ground(x,z);
    d.life=SPLASHES.life[0]+random()*(SPLASHES.life[1]-SPLASHES.life[0]);d.age=stagger?random()*d.life:0;offset.setXYZ(i,x,(Number.isFinite(y)?y:c.y)+.03,z);landed++;};
  return{
    mesh,get landed(){return landed;},get active(){return active;},
    setActive(on:boolean){active=on;mesh.visible=on;if(!on)for(const d of drops)d.life=0;},
    update(camera:T.Camera,ground:GroundHeight,dt:number){
      if(!active||!(dt>0))return;const c=camera.position;
      // The first landings are spread through their lives; after that each lands afresh where it next falls.
      drops.forEach((d,i)=>{if(d.life<=0)land(i,c,ground,true);else if((d.age+=dt)>=d.life)land(i,c,ground,false);phase.setX(i,d.age/d.life);});
      offset.needsUpdate=true;phase.needsUpdate=true;
    },
    dispose(){mesh.removeFromParent();geometry.dispose();ring.dispose();material.dispose();}};
}
