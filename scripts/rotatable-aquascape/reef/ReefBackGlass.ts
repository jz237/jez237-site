import * as T from 'three';
import {Reflector} from 'three/addons/objects/Reflector.js';
import {ReefReflections} from './ReefReflections.ts';

/** A dark-backed pane reflects the real reef at its actual mirrored depth.
 * Uses the existing capture budget, not an additional render on every frame. */
export function reefBackGlass(pool:ReefReflections,time:{value:number},daylight:{value:number}){
 // Reach below the lowest sand edge: the old .2 bottom left a black slot at
 // the newly visible channel end. Keep the original upper pane and tint UVs.
 const pane=new Reflector(new T.PlaneGeometry(10.04,5.4).translate(0,-.1,0),{
  textureWidth:1024,textureHeight:768,multisample:2,clipBias:.002,
  shader:{name:'ReefRearGlass',uniforms:{color:{value:new T.Color(0xffffff)},tDiffuse:{value:null},textureMatrix:{value:new T.Matrix4()},time,daylight,reflectionDepth:{value:null},reflectionInverseProjection:{value:new T.Matrix4()},reflectionWorld:{value:new T.Matrix4()}},
   vertexShader:`uniform mat4 textureMatrix;varying vec4 reflectedUv;varying vec2 v;varying vec3 world;
    void main(){v=vec2(uv.x,(position.y+2.6)/5.2);world=(modelMatrix*vec4(position,1.)).xyz;reflectedUv=textureMatrix*vec4(position,1.);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
   fragmentShader:`uniform sampler2D tDiffuse,reflectionDepth;uniform mat4 reflectionInverseProjection,reflectionWorld;uniform float time,daylight;varying vec4 reflectedUv;varying vec2 v;varying vec3 world;
    float farHash(float x){return fract(sin(x*127.1)*43758.5453);}
    float farNoise(float x){float i=floor(x),f=fract(x);f=f*f*(3.-2.*f);return mix(farHash(i),farHash(i+1.),f);}
    float farNoise2(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);float n=i.x+i.y*57.;return mix(mix(farHash(n),farHash(n+1.),f.x),mix(farHash(n+57.),farHash(n+58.),f.x),f.y);}
    // A distant reef deep behind the pane: rock towers crowned with branching
    // coral, seen through blue water. q is the view ray's point on that plane.
    vec4 farReef(vec2 q,float channel){
     // Mounds with occasional tall pillars; a sand channel opens near the
     // middle (channel is the distance from the tank's own channel line).
     float pillar=pow(farNoise(q.x*.85+5.3),2.2);
     float ridge=.35+.8*farNoise(q.x*.31+3.1)+1.9*pillar+.25*farNoise(q.x*2.9+1.3)+.08*farNoise(q.x*11.);
     ridge*=.72+.28*smoothstep(.3,2.8,abs(q.x));
     ridge=mix(-.4,ridge,smoothstep(.12,.62,channel));
     float rock=smoothstep(.05,-.05,q.y-ridge-.14*farNoise2(q*5.)-.05*farNoise2(q*17.));
     // Branching crowns: upright, streaked bushes thinning toward their tips.
     float above=q.y-ridge;
     float stems=farNoise2(vec2(q.x*26.,q.y*3.2)+1.7)*.55+farNoise2(vec2(q.x*11.,q.y*6.5)+4.1)*.45;
     float bush=farNoise2(vec2(q.x*3.4,q.y*2.2)+8.3);
     float crown=smoothstep(-.08,.04,above)*smoothstep(.36,.5,stems*(.55+.6*bush)*(1.15-above*1.05));
     float lump=farNoise2(q*9.)*.45+farNoise2(q*23.)*.35+farNoise2(q*61.)*.2;
     // Lit from above, distant growth reads lighter and more violet than the
     // water; rubble crowns catch light, recesses beneath them stay dark.
     float lit=(.45+.55*smoothstep(-.4,2.6,q.y))*(.55+.75*smoothstep(-.55,0.,above));
     vec3 stone=mix(vec3(.02,.03,.11),vec3(.10,.08,.26),smoothstep(.25,.8,lump))*lit;
     vec3 coral=mix(vec3(.09,.09,.28),vec3(.2,.14,.4),farNoise2(q*5.+9.))*lit*(1.+.6*smoothstep(.15,.6,above));
     float cover=max(rock,crown);
     return vec4(mix(coral,stone,rock),cover);
    }
    void main(){
     float glow=pow(max(0.,1.-length((v-vec2(.5,.83))*vec2(1.,.65))),2.);
     vec3 blue=mix(vec3(.008,.02,.07),vec3(.04,.11,.37),glow)*(.25+.75*daylight);
     vec3 toPane=world-cameraPosition;
     // A pale sand floor continues past the glass, a lit channel winding away
     // between the distant reefs, as in a deep aquascape photographed head on.
     float floorZ=1e6;
     if(toPane.y<-.0001){
      vec3 floorP=cameraPosition+toPane*((.2-cameraPosition.y)/toPane.y);
      if(floorP.z<-2.3){
       floorZ=floorP.z;float away=-2.3-floorP.z,path=floorP.x+.25-.45*sin(away*.32);
       float lit=exp(-path*path/.5),grain=farNoise2(floorP.xz*vec2(5.,3.))*.6+farNoise2(floorP.xz*vec2(17.,11.))*.4;
       vec3 sand=mix(vec3(.05,.08,.2),vec3(.26,.34,.6),lit*(.75+.35*grain))*(.25+.75*daylight);
       blue=mix(sand,blue,1.-exp(-away*.11));
      }
     }
     // Two depths: a hazier reef farther back, a nearer one in front of it.
     // Each is hidden where the floor already lies in front of its plane.
     for(int layer=0;layer<2;layer++){
      float depthZ=layer==0?-10.5:-5.6;
      if(floorZ<1e5&&floorZ>depthZ)continue;
      vec2 q=(cameraPosition+toPane*((depthZ-cameraPosition.z)/min(-.001,toPane.z))).xy;
      float channel=abs(q.x+.25-.45*sin((-2.3-depthZ)*.32));
      vec4 far=farReef(q+(layer==0?vec2(13.7,-.25):vec2(0.)),channel*(layer==0?.8:1.));
      // Farther, higher structure fades into the water's own blue.
      float haze=clamp((layer==0?.46:.06)+.12*q.y,0.,.85);
      blue=mix(blue,mix(far.rgb*(.25+.75*daylight),blue,haze),far.a);
     }
     float grazing=pow(1.-abs(normalize(cameraPosition-world).z),3.);
     vec2 sampleUv=reflectedUv.xy/reflectedUv.w;
     vec3 reflected=texture2D(tDiffuse,sampleUv).rgb;
     float depth=texture2D(reflectionDepth,sampleUv).r;
     vec4 captured=reflectionInverseProjection*vec4(sampleUv*2.-1.,depth*2.-1.,1.);
     captured/=captured.w;
     vec3 subject=(reflectionWorld*captured).xyz;
     // Additional out-and-back water path grows as a fish leaves the rear pane.
     float distanceToPane=max(0.,subject.z+2.325);
     float pathFade=depth<.999999?exp(-.40*distanceToPane):.12;
     // Attenuate warm wavelengths across the longer reflected water path.
     reflected*=vec3(.53,.72,.90);
     gl_FragColor=vec4(mix(blue,reflected,(.32+.16*grazing)*pathFade),1.);
     #include <tonemapping_fragment>
     #include <colorspace_fragment>
    }`
  }
 });
 pane.name='Submerged rear glass reflection';pane.position.set(0,2.8,-2.325);
 // Reflector clones its uniform set; reconnect live lighting controls.
 const material=pane.material as T.ShaderMaterial;material.uniforms.time=time;material.uniforms.daylight=daylight;
 const target=pane.getRenderTarget();target.depthTexture=new T.DepthTexture(target.width,target.height,T.UnsignedIntType);
 material.uniforms.reflectionDepth.value=target.depthTexture;
 const capture=pane.onBeforeRender;
 pane.onBeforeRender=(...args)=>{
  capture.apply(pane,args);
  const camera=pane.getReflectionCamera(args[2]);
  material.uniforms.reflectionInverseProjection.value.copy(camera.projectionMatrix).invert();
  material.uniforms.reflectionWorld.value.copy(camera.matrixWorld);
 };
 return pool.add(pane);
}
