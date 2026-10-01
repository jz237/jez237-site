export * from './livery-data';
import {liveryHex,type LiveryLayer,type LiveryFace} from './livery-data';
/** Canvas painting is deterministic; seed is saved with every spray/weathering layer. */
export function drawLivery(ctx:CanvasRenderingContext2D,layers:readonly LiveryLayer[],face:LiveryFace,width:number,height:number,finishMask=false){
 ctx.clearRect(0,0,width,height);
 for(const layer of layers){if(layer.face!==face||layer.hidden)continue;
 ctx.save();ctx.scale(width,height);ctx.translate(layer.x,layer.y);ctx.rotate(layer.rotation*Math.PI/180);ctx.scale(layer.width*(layer.flip?-1:1),layer.height);ctx.globalAlpha=layer.opacity;ctx.fillStyle=finishMask?(layer.shape==='rust'?'#ff0000':layer.shape==='chips'?'#00ff00':'#000000'):liveryHex(layer.color);ctx.strokeStyle=ctx.fillStyle;
 const shape=layer.shape;
 if(shape==='stripe')ctx.fillRect(-.5,-.5,1,1);
 else if(shape==='circle'){ctx.beginPath();ctx.ellipse(0,0,.5,.5,0,0,Math.PI*2);ctx.fill();}
 else if(shape==='star'){ctx.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,r=i%2?.22:.5;ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r);}ctx.closePath();ctx.fill();}
 else if(shape==='chevron'){ctx.beginPath();ctx.moveTo(-.5,-.5);ctx.lineTo(0,0);ctx.lineTo(-.5,.5);ctx.lineTo(0,.5);ctx.lineTo(.5,0);ctx.lineTo(0,-.5);ctx.closePath();ctx.fill();}
 else if(shape==='checker'){for(let x=0;x<8;x++)for(let y=0;y<4;y++)if((x+y)%2===0)ctx.fillRect(x/8-.5,y/4-.5,1/8,1/4);}
 else if(shape==='text'||shape==='number'){ctx.font='900 100px Arial,sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';const text=layer.text||'27',w=ctx.measureText(text).width;ctx.scale(.94/Math.max(w,1),.011);ctx.fillText(text,0,0);}
 else {let state=layer.seed>>>0;const random=()=>((state=(Math.imul(state,1664525)+1013904223)>>>0)/4294967296);
 for(let i=0;i<(shape==='spray'?700:220);i++){const x=random()-.5,y=random()-.5,edge=Math.max(0,1-Math.hypot(x*2,y*2));if(edge===0)continue;ctx.globalAlpha=layer.opacity*edge*(shape==='spray'?.2+random()*.5:.4+random()*.6);const radius=(shape==='spray'?.008:.018)*(1+random()*2);if(shape==='rust'){const shade=.65+random()*.55;if(!finishMask)ctx.fillStyle=`rgb(${Math.floor((layer.color>>16)*shade)},${Math.floor((layer.color>>8&255)*shade)},${Math.floor((layer.color&255)*shade)})`;}if(shape==='chips')ctx.fillRect(x,y,radius,radius*.6);else{ctx.beginPath();ctx.ellipse(x,y,radius*.45,radius*1.5,0,0,Math.PI*2);ctx.fill();}}}
 ctx.restore();
 }
}
