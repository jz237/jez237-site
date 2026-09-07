import * as THREE from 'three';
import {ConvexGeometry} from 'three/addons/geometries/ConvexGeometry.js';

// Broken sedimentary slabs: asymmetric cut planes rather than inflated spheres.
export function fracturedRock(w,h,d,seed=1){
  const rand=i=>{const n=Math.sin(seed*17.13+i*73.91)*47381.7;return n-Math.floor(n);};
  const points=[];
  for(let layer=0;layer<2;layer++)for(let i=0;i<7;i++){
    const a=i/7*Math.PI*2,r=.78+rand(i+layer*11)*.22;
    points.push(new THREE.Vector3(Math.cos(a)*w*r+(layer-.5)*w*.16,Math.sin(a)*h*r,(layer?1:-1)*d*(.5+rand(i+33)*.5)));
  }
  const g=new ConvexGeometry(points),pos=g.attributes.position,colors=[],uv=[];
  for(let i=0;i<pos.count;i++){const a=.66+.18*(pos.getY(i)/h+1)/2;colors.push(a,a*.98,a*.93);uv.push(pos.getX(i)/40,pos.getY(i)/40);}
  g.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));return g;
}

// A continuous escarpment with long slopes, broken shelves and open valleys.
export function ridgeGeometry(seed=1,height=180){
  const profile=[.11,.18,.30,.58,.63,.46,.39,.19,.09,.14,.38,.53,.84,.91,.74,.56,.31,.24,.18,.37,.44,.65,.60,.30,.13];
  const pos=[],uv=[],color=[],idx=[],samples=(profile.length-1)*4+1;
  for(let i=0;i<samples;i++){
    const x=i*23,base=Math.floor(i/4),t=(i%4)/4,crest=(profile[(base+seed*3)%profile.length]*(1-t)+profile[(base+1+seed*3)%profile.length]*t)*height+Math.sin(i*7.13+seed)*5;
    for(let j=0;j<12;j++){
      const y=crest*(j/11),z=-Math.sin(i*.61+seed)*14-j*3+Math.sin(i*.83-j*.19)*9+Math.cos(i*.31+j*.63)*7;
      pos.push(x,y,z);uv.push(x/110,y/110);const shade=.57+j*.018+Math.sin(i*.81-j*.17)*.045;color.push(shade,shade,shade);
      if(i<samples-1&&j<11){const k=i*12+j;idx.push(k,k+12,k+1,k+1,k+12,k+13);}
    }
  }
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setAttribute('color',new THREE.Float32BufferAttribute(color,3));g.setIndex(idx);g.computeVertexNormals();return g;
}

export function atmosphere(world){
  const palettes={1:['#151f27','#697274'],2:['#081b22','#345159'],5:['#211d28','#59515c']},[top,bottom]=palettes[world]||palettes[1];
  return new THREE.ShaderMaterial({depthWrite:false,fog:false,uniforms:{top:{value:new THREE.Color(top)},bottom:{value:new THREE.Color(bottom)}},vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:`varying vec2 vUv;uniform vec3 top;uniform vec3 bottom;
    float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
    float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
    void main(){float mist=noise(vUv*vec2(6.,11.))*.6+noise(vUv*vec2(18.,27.))*.4;vec3 c=mix(bottom,top,smoothstep(.05,1.,vUv.y));c+=vec3(mist*.025);gl_FragColor=vec4(c,1.);}`});
}
