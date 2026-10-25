import * as T from 'three';
import {Pass,FullScreenQuad} from 'three/addons/postprocessing/Pass.js';
/** Rain on the lens (offline rain): drops land on the chase or hood camera's lens (LENS_RAIN.rate a second, the hood camera
 * more and more with speed as it drives into the rain), each a little lens of its own showing the world upside down and
 * magnified, with a dark rim and a highlight, LENS_RAIN.size px across on a 1080-line screen. Big drops slide down; drops
 * evaporate over LENS_RAIN.life s, faster once the camera is out of the rain or behind the windscreen, and past
 * LENS_RAIN.blow m/s the air strips them away toward the edges. Driving through standing water throws it over the lens
 * too (LENS_RAIN.splash: bigger drops, more the harder the tyres plough through it), rain or not. At most LENS_RAIN.max at
 * once; one full-screen pass. */
export const LENS_RAIN={max:40,rate:{chase:1.6,hood:2.6},speedRate:.14,size:[18,46],life:[2.5,6],slide:.06,heavy:34,blow:22,dry:5,fade:.6,
  splash:{rate:26,most:2.5,size:[26,60],life:[1.8,4]}} as const;
export type LensView='chase'|'hood'|'dashboard';
export type LensDrop={u:number;v:number;size:number;age:number;life:number;vu:number;vv:number};
const between=(r:readonly number[],t:number)=>r[0]+(r[1]-r[0])*t;
/** Drops landing a second: none out of the rain or behind the windscreen. */
export function lensRate(raining:boolean,view:LensView,speed:number){
  if(!raining||view==='dashboard')return 0;const s=Number.isFinite(speed)?Math.max(0,speed):0;
  return view==='hood'?LENS_RAIN.rate.hood*(1+s*LENS_RAIN.speedRate):LENS_RAIN.rate.chase;
}
/** How visible a drop is (0–1): it lands at once and fades over the last LENS_RAIN.fade of its life. */
export const dropAlpha=(d:LensDrop)=>Math.max(0,Math.min(1,(d.life-d.age)/(d.life*LENS_RAIN.fade)));
export class LensRain{
  readonly drops:LensDrop[]=[];
  private budget=0;private splashBudget=0;
  /** Drops landed so far, and thrown up out of puddles (QA). */
  landed=0;splashed=0;
  constructor(private random=()=>Math.random()){}
  step(dt:number,raining:boolean,view:LensView,speed:number){
    const t=Number.isFinite(dt)?Math.max(0,Math.min(.1,dt)):0,s=Number.isFinite(speed)?Math.max(0,speed):0;
    this.budget+=lensRate(raining,view,s)*t;
    while(this.budget>=1){
      this.budget--;if(this.drops.length>=LENS_RAIN.max)continue;const size=between(LENS_RAIN.size,this.random()**1.5);
      this.drops.push({u:.04+this.random()*.92,v:.06+this.random()*.88,size,age:0,life:between(LENS_RAIN.life,this.random()),vu:0,vv:0});this.landed++;
    }
    // Out of the rain, or behind the glass, the lens dries off quickly; at speed the air drags drops out toward the edges.
    const drying=raining&&view!=='dashboard'?1:LENS_RAIN.dry,blown=Math.max(0,s-LENS_RAIN.blow)/LENS_RAIN.blow;
    for(const d of this.drops){
      d.age+=t*drying*(1+blown*2);
      d.vv=d.size>LENS_RAIN.heavy?-LENS_RAIN.slide*(d.size-LENS_RAIN.heavy)/LENS_RAIN.heavy:0;
      d.vu=blown*(d.u-.5)*.6;d.vv-=blown*.08;
      d.u+=d.vu*t;d.v+=d.vv*t;
    }
    for(let i=this.drops.length;i--;){const d=this.drops[i];if(d.age>=d.life||d.u<-.05||d.u>1.05||d.v<-.05)this.drops.splice(i,1);}
  }
  /** Water thrown up over the lens by the car ploughing through a puddle: `plough` 0 (dry) to LENS_RAIN.splash.most. */
  splash(plough:number,dt:number,view:LensView){
    const t=Number.isFinite(dt)?Math.max(0,Math.min(.1,dt)):0,p=Number.isFinite(plough)?Math.max(0,Math.min(LENS_RAIN.splash.most,plough)):0,S=LENS_RAIN.splash;
    if(view==='dashboard'||p<=0){this.splashBudget=0;return;}
    this.splashBudget+=p*S.rate*t;
    while(this.splashBudget>=1){this.splashBudget--;if(this.drops.length>=LENS_RAIN.max)continue;
      this.drops.push({u:.04+this.random()*.92,v:.06+this.random()*.6,size:between(S.size,this.random()),age:0,life:between(S.life,this.random()),vu:0,vv:0});this.splashed++;}
  }
  clear(){this.drops.length=0;this.budget=0;this.splashBudget=0;}
}
/** Draws the drops on the lens; disabled whenever the lens is dry. */
export class LensRainPass extends Pass{
  readonly material:T.ShaderMaterial;
  private quad:FullScreenQuad;
  constructor(){
    super();
    this.material=new T.ShaderMaterial({name:'lens-rain',defines:{MAX:LENS_RAIN.max},
      uniforms:{tDiffuse:{value:null},resolution:{value:new T.Vector2(1,1)},count:{value:0},drops:{value:Array.from({length:LENS_RAIN.max},()=>new T.Vector4())}},
      vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
      fragmentShader:`uniform sampler2D tDiffuse;uniform vec2 resolution;uniform int count;uniform vec4 drops[MAX];varying vec2 vUv;
void main(){
  vec2 px=vUv*resolution;vec3 col=texture2D(tDiffuse,vUv).rgb;
  for(int i=0;i<MAX;i++){
    if(i>=count)break;vec4 d=drops[i];vec2 c=d.xy*resolution;vec2 q=(px-c)/(d.z*vec2(1.,1.12));float r2=dot(q,q);if(r2>=1.)continue;
    // Each drop is a little lens: the world through it upside down and magnified, a dark rim, a highlight up and left.
    vec2 look=(c-q*d.z*1.8+vec2(0.,d.z*.6))/resolution;
    vec3 inside=texture2D(tDiffuse,clamp(look,vec2(.001),vec2(.999))).rgb*.9+.03;
    float rim=smoothstep(.55,1.,r2),glint=pow(max(0.,1.-length(q-vec2(-.32,.38))*2.6),3.);
    vec3 drop=inside*(1.-rim*.45)+glint*.55;
    col=mix(col,drop,d.w*(1.-smoothstep(.86,1.,r2)));
  }
  gl_FragColor=vec4(col,1.);
}`,depthTest:false,depthWrite:false});
    this.quad=new FullScreenQuad(this.material);this.enabled=false;
  }
  /** This frame's drops (sizes in px at 1080 lines); the pass switches off with none. */
  setDrops(drops:readonly LensDrop[]){
    const u=this.material.uniforms,scale=u.resolution.value.y/1080,n=Math.min(LENS_RAIN.max,drops.length);
    for(let i=0;i<n;i++){const d=drops[i];(u.drops.value as T.Vector4[])[i].set(d.u,d.v,d.size/2*scale,dropAlpha(d));}
    u.count.value=n;this.enabled=n>0;
  }
  override setSize(width:number,height:number){this.material.uniforms.resolution.value.set(Math.max(1,width),Math.max(1,height));}
  override render(renderer:T.WebGLRenderer,writeBuffer:T.WebGLRenderTarget,readBuffer:T.WebGLRenderTarget){
    this.material.uniforms.tDiffuse.value=readBuffer.texture;renderer.setRenderTarget(this.renderToScreen?null:writeBuffer);this.quad.render(renderer);
  }
  override dispose(){this.material.dispose();this.quad.dispose();}
}
