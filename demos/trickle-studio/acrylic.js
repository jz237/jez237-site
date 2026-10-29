import * as T from '../aquaclear-studio/vendor/three.module.js';

// Sparse polish marks affect highlights, not printed dirt or opaque glass.
export function finishAcrylic(material){
 const c=document.createElement('canvas');c.width=c.height=512;const x=c.getContext('2d');
 x.fillStyle='#747474';x.fillRect(0,0,512,512);let seed=932;
 const rnd=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
 for(let i=0;i<160;i++){const px=rnd()*512,py=rnd()*512;x.strokeStyle=i%3?'#838383':'#636363';x.lineWidth=.3+rnd()*.45;x.beginPath();x.moveTo(px,py);x.quadraticCurveTo(px+3,py+8,px+4+rnd()*10,py+12+rnd()*35);x.stroke();}
 const map=new T.CanvasTexture(c);map.wrapS=map.wrapT=T.RepeatWrapping;
 material.bumpMap=map;material.bumpScale=.0012;material.roughnessMap=map;material.roughness=.105;
 material.clearcoat=.85;material.clearcoatRoughness=.075;material.envMapIntensity=1.25;
 material.thickness=.085;material.attenuationDistance=2.6;
}
export function acrylicEdges(panel){
 const lines=new T.LineSegments(new T.EdgesGeometry(panel.geometry,38),new T.LineBasicMaterial({color:'#c0e3df',transparent:true,opacity:.19,depthWrite:false}));
 lines.name='polished-acrylic-edges';panel.add(lines);
}
