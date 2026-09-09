import * as T from 'three';
import {assemblyOffset} from './choreography';
export const boardCenters:Record<string,[number,number,number]>={logic:[.64,0,0],rom:[-.055,-.20,0],interface:[-.075,.37,0],sound:[-.80,-.26,0]};
export function boardPoint(id:string,progress:number,mobile:boolean){const center=new T.Vector3(...boardCenters[id]);center.applyEuler(new T.Euler(0,(1-progress)*Math.PI/2,(1-progress)*Math.PI/2));return center.add(new T.Vector3(-.57*(1-progress),1.90,-.17*(1-progress))).add(new T.Vector3(...assemblyOffset('logic',progress,mobile))).multiplyScalar(.84);}
export function hardwareTextures(scene:T.Group){
 const sets=scene.userData.hardwareLabels as Record<string,{text:string;red:boolean}[]>|undefined;const result:Record<string,T.CanvasTexture>={};
 for(const [id,entries]of Object.entries(sets||{})){
  const canvas=document.createElement('canvas');canvas.width=2048;const rows=Math.max(1,Math.ceil(entries.length/8));canvas.height=rows*96;const c=canvas.getContext('2d')!;c.fillStyle='#20231e';c.fillRect(0,0,canvas.width,canvas.height);
  entries.forEach((e,i)=>{const x=i%8*256,y=Math.floor(i/8)*96;c.fillStyle=e.red?'#902b29':'#20231e';c.fillRect(x,y,256,96);c.textAlign='center';c.textBaseline='middle';const lines=e.text.split('|');lines.forEach((line,j)=>{c.font=`${j===0?'bold ':''}${lines.length===1?28:j===0?30:23}px monospace`;c.fillStyle=e.red?'#fff0d8':'#bbbdaa';c.fillText(line,x+128,y+(lines.length===1?48:30+j*40),246);});});
  const texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;texture.anisotropy=8;texture.repeat.y=16/rows;texture.offset.y=1-16/rows;result['hardware_labels_'+id]=texture;
 }return result;
}
