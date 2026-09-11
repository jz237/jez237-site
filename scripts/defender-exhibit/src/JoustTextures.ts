import * as T from 'three';
const tex=(w:number,h:number,draw:(c:CanvasRenderingContext2D)=>void)=>{const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;draw(canvas.getContext('2d')!);const t=new T.CanvasTexture(canvas);t.colorSpace=T.SRGBColorSpace;t.anisotropy=8;return t;};
export const joustMarquee=(image:CanvasImageSource)=>tex(1024,256,c=>c.drawImage(image,0,0,1024,256));
export const joustSide=(image:CanvasImageSource)=>tex(1024,2048,c=>{c.fillStyle='#652225';c.fillRect(0,0,1024,2048);c.drawImage(image,70,440,884,1422);});
// The scan includes the upright's front apron below the horizontal playing surface.
export const joustControls=(image:HTMLImageElement)=>tex(2048,768,c=>c.drawImage(image,0,0,image.width,image.height*610/1248,0,0,2048,768));
export const joustApron=(image:HTMLImageElement)=>tex(2048,512,c=>c.drawImage(image,0,image.height*610/1248,image.width,image.height*570/1248,0,0,2048,512));
