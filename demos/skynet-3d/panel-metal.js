import * as T from 'three';

// Locally generated material maps: no downloads, and no changes to the scene RNG.
export function createPanelMetals(renderer,environment){
 let seed=82931;
 const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
 function maps(edge){
  const width=1024,height=512;
  const canvases=Array.from({length:3},()=>{const c=document.createElement('canvas');c.width=width;c.height=height;return c});
  const contexts=canvases.map(c=>c.getContext('2d')),images=contexts.map(c=>c.createImageData(width,height));
  for(let y=0;y<height;y++){
   const grain=(random()-.5)*22,mill=Math.cos(y/height*Math.PI*2*(edge?22:13));
   for(let x=0;x<width;x++){
    const noise=(random()-.5)*15,cloud=7*Math.sin(x/width*Math.PI*4+y*.037),value=158+grain+noise+cloud+mill*(edge?16:5),i=(y*width+x)*4;
    const values=[[value*.91,value*.96,value],[128+grain+noise*.6+mill*18,128+grain+noise*.6+mill*18,128+grain+noise*.6+mill*18],[145+noise+grain*.6-mill*12,145+noise+grain*.6-mill*12,145+noise+grain*.6-mill*12]];
    for(let k=0;k<3;k++){images[k].data[i]=values[k][0];images[k].data[i+1]=values[k][1];images[k].data[i+2]=values[k][2];images[k].data[i+3]=255}
   }
  }
  contexts.forEach((c,i)=>c.putImageData(images[i],0,0));
  // Fine brushing and occasional longer machining scratches catch moving light.
  for(let i=0;i<1500;i++){
   const x=random()*width,y=random()*height,length=8+random()*(edge?190:330),alpha=.06+random()*.15;
   contexts.forEach((c,k)=>{c.lineWidth=i%23===0?1.1:.5;c.strokeStyle=k===2?`rgba(240,240,240,${alpha})`:`rgba(225,233,240,${alpha})`;c.beginPath();c.moveTo(x,y);c.lineTo(x+length,y+(random()-.5)*.8);c.stroke()});
  }
  return canvases.map((canvas,i)=>{const texture=new T.CanvasTexture(canvas);texture.name=`${edge?'Machined edge':'Brushed gunmetal'} ${['color','height','roughness'][i]}`;texture.wrapS=texture.wrapT=T.RepeatWrapping;texture.repeat.set(edge?.7:.18,edge?1.6:.6);texture.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());if(i===0)texture.colorSpace=T.SRGBColorSpace;return texture});
 }
 const [faceColor,faceHeight,faceRoughness]=maps(false),[edgeColor,edgeHeight,edgeRoughness]=maps(true);
 const face=new T.MeshPhysicalMaterial({name:'Brushed gunmetal backing',color:0x29333e,metalness:.95,roughness:.58,map:faceColor,bumpMap:faceHeight,bumpScale:.038,roughnessMap:faceRoughness,envMap:environment,envMapIntensity:.2,clearcoat:.06,clearcoatRoughness:.4});
 const edge=new T.MeshPhysicalMaterial({name:'Machined satin-metal panel edges',color:0xabb9c7,metalness:1,roughness:.52,map:edgeColor,bumpMap:edgeHeight,bumpScale:.027,roughnessMap:edgeRoughness,envMap:environment,envMapIntensity:.72,clearcoat:.2,clearcoatRoughness:.28});
 return {face,edge,withEdges:front=>[front,edge]};
}
