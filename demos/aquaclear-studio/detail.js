import * as T from './vendor/three.module.js';
// Original procedural material maps: no downloaded product art or generated labels.
export function surfaceMaps(seed=17){
  const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d'),data=x.createImageData(256,256);let n=seed;
  for(let i=0;i<data.data.length;i+=4){n=(Math.imul(n,1664525)+1013904223)>>>0;const value=110+(n>>>25);data.data.set([value,value,value,255],i);}x.putImageData(data,0,0);
  const t=new T.CanvasTexture(c);t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(5,5);t.anisotropy=4;return t;
}
export function clothMaterial(){
  const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d');x.clearRect(0,0,64,64);
  x.strokeStyle='#697971';x.lineWidth=3;x.beginPath();x.moveTo(0,32);x.lineTo(64,32);x.moveTo(32,0);x.lineTo(32,64);x.stroke();
  x.strokeStyle='#a6b0a5';x.lineWidth=1;x.beginPath();x.moveTo(0,30);x.lineTo(64,30);x.moveTo(30,0);x.lineTo(30,64);x.stroke();
  const map=new T.CanvasTexture(c);map.colorSpace=T.SRGBColorSpace;map.wrapS=map.wrapT=T.RepeatWrapping;map.repeat.set(34,22);map.anisotropy=8;
  return new T.MeshStandardMaterial({color:'#a4b0a7',map,alphaTest:.18,alphaToCoverage:true,roughness:.93,side:T.DoubleSide});
}
export function perforatedCover(){
  const shape=new T.Shape();const w=4.38,d=2.68,r=.22;
  shape.moveTo(-w/2+r,-d/2);shape.lineTo(w/2-r,-d/2);shape.quadraticCurveTo(w/2,-d/2,w/2,-d/2+r);shape.lineTo(w/2,d/2-r);shape.quadraticCurveTo(w/2,d/2,w/2-r,d/2);shape.lineTo(-w/2+r,d/2);shape.quadraticCurveTo(-w/2,d/2,-w/2,d/2-r);shape.lineTo(-w/2,-d/2+r);shape.quadraticCurveTo(-w/2,-d/2,-w/2+r,-d/2);
  // Perforations follow the photographed broad panel with its stepped front edge.
  for(let ix=0;ix<26;ix++)for(let iy=0;iy<16;iy++){const x=-1.12+ix*.115,y=-.88+iy*.115;if(y>.66&&x>.7)continue;const h=new T.Path(),s=.032;h.moveTo(x-s,y-s);h.lineTo(x-s,y+s);h.lineTo(x+s,y+s);h.lineTo(x+s,y-s);h.closePath();shape.holes.push(h);}
  const g=new T.ExtrudeGeometry(shape,{depth:.075,bevelEnabled:true,bevelSegments:2,bevelSize:.008,bevelThickness:.009,curveSegments:16});g.rotateX(-Math.PI/2);const a=g.attributes.position;for(let i=0;i<a.count;i++){const z=a.getZ(i);a.setY(i,a.getY(i)+.09*(1-Math.pow(Math.min(1,Math.abs(z)/1.34),4)));}a.needsUpdate=true;g.computeVertexNormals();return g;
}
export function hollowCylinder(outer,inner,height){
  const shape=new T.Shape();shape.absarc(0,0,outer,0,Math.PI*2,false);const hole=new T.Path();hole.absarc(0,0,inner,0,Math.PI*2,true);shape.holes.push(hole);const g=new T.ExtrudeGeometry(shape,{depth:height,bevelEnabled:false,curveSegments:32});g.rotateX(-Math.PI/2);g.translate(0,-height/2,0);return g;
}
export function pumpCoverGeometry(){
  const s=new T.Shape();s.moveTo(-.47,-.39);s.lineTo(.47,-.39);s.lineTo(.47,.39);s.lineTo(-.47,.39);s.closePath();const h=new T.Path();h.absarc(0,0,.18,0,Math.PI*2,true);s.holes.push(h);const g=new T.ExtrudeGeometry(s,{depth:.055,bevelEnabled:true,bevelSize:.025,bevelThickness:.012,bevelSegments:3,curveSegments:24});g.rotateX(-Math.PI/2);return g;
}
export function causticMaterial(){return new T.ShaderMaterial({uniforms:{time:{value:0},strength:{value:1}},transparent:true,depthWrite:false,blending:T.AdditiveBlending,side:T.DoubleSide,
 vertexShader:'varying vec2 tex;void main(){tex=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
 fragmentShader:`varying vec2 tex;uniform float time,strength;void main(){vec2 p=tex*29.;p+=vec2(sin(p.y*.7+time*.35),cos(p.x*.8-time*.27))*.55;float a=abs(sin(p.x*1.7+sin(p.y*1.3+time*.24))),b=abs(sin(p.y*1.65+sin(p.x*1.4-time*.28)));float lines=pow(1.-min(a,b),16.);float fade=smoothstep(0.,.12,tex.x)*smoothstep(0.,.12,1.-tex.x)*smoothstep(0.,.12,tex.y)*smoothstep(0.,.12,1.-tex.y);gl_FragColor=vec4(.48,.72,.68,lines*fade*.028*strength);}`});}
