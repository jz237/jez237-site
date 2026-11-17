// Post-processing: bloom + one style shader that gives each section its look.
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

// mode: 0 plain, 1 comic, 2 synthwave, 3 paper, 4 sonar, 5 stained glass, 6 colour chalkboard
const StyleShader = {
  uniforms: {
    tDiffuse: { value: null }, mode: { value: 0 }, time: { value: 0 }, beat: { value: 0 },
    bass: { value: 0 }, glitch: { value: 0 }, flash: { value: 0 }, fade: { value: 1 },
    lines: { value: 0 }, reveal: { value: 1 }, res: { value: new THREE.Vector2(1, 1) },
  },
  vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
  fragmentShader: `
    uniform sampler2D tDiffuse; uniform int mode; uniform float time,beat,bass,glitch,flash,fade,lines,reveal; uniform vec2 res;
    varying vec2 vUv;
    float h(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
    vec2 h2(vec2 p){ return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453); }
    float lum(vec3 c){ return dot(c,vec3(.299,.587,.114)); }
    float vn(vec2 p){ vec2 i=floor(p),f=fract(p); f=f*f*(3.-2.*f); return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y); }
    float L(vec2 uv){ return lum(texture2D(tDiffuse,uv).rgb); }
    float edge(vec2 uv){
      vec2 p=1.4/res;
      float a=L(uv+p*vec2(-1,-1)),b=L(uv+p*vec2(0,-1)),c=L(uv+p*vec2(1,-1)),d=L(uv+p*vec2(-1,0)),
            e=L(uv+p*vec2(1,0)),f=L(uv+p*vec2(-1,1)),g=L(uv+p*vec2(0,1)),i=L(uv+p*vec2(1,1));
      float gx=-a-2.*d-f+c+2.*e+i, gy=-a-2.*b-c+f+2.*g+i;
      return sqrt(gx*gx+gy*gy);
    }
    void main(){
      vec2 uv=vUv; vec2 cuv=uv-.5; float asp=res.x/res.y;
      if(glitch>0.){
        float row=floor(uv.y*28.); float n=h(vec2(row,floor(time*40.)));
        uv.x+=(n-.5)*glitch*.3*step(.45,h(vec2(row*3.1,floor(time*25.))));
      }
      float split=glitch*.02+(mode==2?.0016+.004*beat:0.);
      vec3 c;
      if(mode==5){
        // stained glass: voronoi cells sample one colour each, dark lead between
        vec2 sc=vec2(asp,1.)*(res.y/15.); vec2 p=uv*sc; vec2 ip=floor(p); float d1=9.,d2=9.; vec2 best=p;
        for(int j=-1;j<=1;j++)for(int i=-1;i<=1;i++){
          vec2 g=ip+vec2(float(i),float(j)); vec2 o=g+.5+.38*(h2(g)*2.-1.); float d=distance(p,o);
          if(d<d1){d2=d1;d1=d;best=o;}else if(d<d2)d2=d;
        }
        c=texture2D(tDiffuse,best/sc).rgb;
        c=mix(vec3(lum(c)),c,1.5); c=max(c,0.)*(.9+.25*h(best))*1.15;
        c*=smoothstep(.03,.14,d2-d1);
        c+=c*.35*sin(time*2.+h(best)*20.)*beat;
      } else {
        c=vec3(texture2D(tDiffuse,uv+vec2(split,0.)).r,texture2D(tDiffuse,uv).g,texture2D(tDiffuse,uv-vec2(split,0.)).b);
      }
      if(mode==1){
        float l=lum(c); float q=(floor(l*5.+.5)/5.); c=mix(vec3(l),c,1.5)*(q/max(l,.001));
        mat2 r=mat2(.707,-.707,.707,.707); vec2 hp=r*gl_FragCoord.xy/7.; float dt=length(fract(hp)-.5);
        c*=mix(1.,.62,step(dt,(1.-clamp(l*1.6,0.,1.))*.55));
        c=mix(c,vec3(.01,.01,.03),smoothstep(.12,.32,edge(uv)));
        // speed lines from the edges
        float a=atan(cuv.y,cuv.x*asp); float sl=step(.72,h(vec2(floor(a*40.),floor(time*12.))));
        float rr=length(cuv*vec2(asp,1.));
        c=mix(c,vec3(1.),sl*lines*smoothstep(.42,.75,rr));
      } else if(mode==2){
        c*=.86+.14*sin(gl_FragCoord.y*3.14159);
        c+=vec3(.25,.02,.3)*pow(length(cuv),2.)*.6;
      } else if(mode==3){
        float g=h(floor(gl_FragCoord.xy/2.)); float fib=h(vec2(floor(gl_FragCoord.x/3.),floor(gl_FragCoord.y/40.)));
        c*=.9+.14*g+.05*fib; c=mix(c,c*vec3(1.05,1.,.9),.6);
      } else if(mode==4){
        float l=lum(c); float rr=length(cuv*vec2(asp,1.));
        float a=atan(cuv.y,cuv.x*asp); float sw=fract((a/6.2832)-time*.35); sw=pow(sw,6.);
        float ring=smoothstep(.46,.5,abs(fract(rr*3.-time*1.134)-.5))*.5;
        c=vec3(.08,1.,.45)*(l*(.5+sw*1.0+bass*.4)+ring*(.25+beat*.6));
        c*=.8+.2*sin(gl_FragCoord.y*2.);
        c+=vec3(.0,.035,.02);
      } else if(mode==6){
        // colour chalk on a slate board: steady grainy outlines + hatched fills, drawn on with a sweep at each cut
        float l=lum(c); vec3 sat=max(mix(vec3(l),c,1.7),0.); sat/=max(max(sat.r,max(sat.g,sat.b)),.3);
        vec2 fc=gl_FragCoord.xy; float boil=0.;
        float grain=.5+.5*h(floor(fc/1.6)+boil);
        mat2 r=mat2(.8,-.6,.6,.8); vec2 hp=r*fc;
        float mx=max(c.r,max(c.g,c.b)),mn=min(c.r,min(c.g,c.b)); float sa=(mx-mn)/max(mx,.001);
        float hatch=mix(.3,1.,smoothstep(.25,.7,vn(vec2(hp.x*.5,hp.y*.085)+boil*3.1)))*(.7+.3*vn(fc/7.+boil));
        float e=smoothstep(.05,.22,edge(uv));
        vec3 board=vec3(.013,.038,.03)*(.7+.6*vn(fc/170.))+vec3(.007)*vn(fc/38.+7.);
        float fill=pow(clamp(l*1.35,0.,1.),.8)*hatch*mix(.28,1.,smoothstep(.08,.45,sa));
        c=board+mix(sat,vec3(1.),.1+.3*l)*fill*(.6+.4*grain)*.9+mix(vec3(1.),sat,.25)*e*(.55+.5*grain)*.85;
        float fr=reveal*1.5-.2; float dco=vUv.x*.65+(1.-vUv.y)*.35+(vn(fc/60.)-.5)*.12;
        c=mix(board,c,1.-smoothstep(fr-.07,fr,dco));
        c+=vec3(1.,.97,.88)*smoothstep(.012,.0,abs(dco-fr))*step(reveal,.999)*.35;
        c+=step(.9989,h(floor((fc+vec2(time*5.,time*20.))/2.5)))*.22;
      } else if(mode==0){
        c+=(h(gl_FragCoord.xy+time)-.5)*.025;
      }
      float v=smoothstep(.95,.35,length(cuv*vec2(1.,1.15))); c*=mix(.55,1.,v);
      if(mode==6){
        vec2 bp=min(vUv,1.-vUv)*res; float bw=res.y*.035; float m=min(bp.x,bp.y);
        if(m<bw){ float g=bp.x<bp.y?vn(vec2(vUv.x*res.x/5.,vUv.y*res.y/110.)):vn(vec2(vUv.x*res.x/110.,vUv.y*res.y/5.));
          c=vec3(.2,.105,.045)*(.55+.6*g)*(.65+.35*smoothstep(0.,bw,m)); c*=1.-.75*smoothstep(bw*.82,bw,m); }
      }
      c+=flash; c*=fade;
      gl_FragColor=vec4(c,1.);
    }`,
};

export function makePost(renderer, scene, camera) {
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.5, 0.6, 0.8);
  composer.addPass(bloom);
  const style = new ShaderPass(StyleShader);
  composer.addPass(style);
  composer.addPass(new OutputPass());
  return {
    composer, bloom, u: style.uniforms,
    resize(w, h, pr) { composer.setPixelRatio(pr); composer.setSize(w, h); style.uniforms.res.value.set(w * pr, h * pr); },
  };
}
