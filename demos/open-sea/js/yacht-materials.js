// Small mipmapped PBR textures, generated once without downloads or paid assets.
import {gl,texArray,tex2D,generateMips} from './gl.js';
const N=512,TAU=Math.PI*2;
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
function noise(u,v,nx,ny,seed=0){
  const x=u*nx,y=v*ny,ix=Math.floor(x),iy=Math.floor(y),a=x-ix,b=y-iy,s=a*a*(3-2*a),t=b*b*(3-2*b);
  const rand=(x,y)=>{let h=Math.imul(((x%nx+nx)%nx)+seed,374761393)^Math.imul((y%ny+ny)%ny,668265263);h=Math.imul(h^(h>>>13),1274126177);return ((h^(h>>>16))>>>0)/4294967295;};
  const p=rand(ix,iy)*(1-s)+rand(ix+1,iy)*s,q=rand(ix,iy+1)*(1-s)+rand(ix+1,iy+1)*s;return p*(1-t)+q*t;
}

export class YachtMaterials {
  constructor(){
    const color=new Uint8Array(N*N*4*7),detail=new Uint8Array(color.length);
    for(let layer=0;layer<7;layer++){
      const heights=new Float32Array(N*N),rough=new Float32Array(N*N);
      for(let y=0;y<N;y++)for(let x=0;x<N;x++){
        const u=x/N,v=y/N,i=y*N+x,j=(layer*N*N+i)*4;
        // Periodic warping makes the grain continuous at the texture boundary.
        let rgb;
        if(layer===0||layer===3){
          const bend=.007*Math.sin(u*TAU)+.009*(noise(u,v,4,8,17)-.5);
          const fine=noise(u,v+bend,7,193,31),growth=noise(u,v+bend,3,47,9),pores=noise(u,v,47,211,8);
          const grain=.65*(fine-.5)+.35*(growth-.5);
          const seam=layer===0&&Math.min(v,1-v)<.013?1:0;
          const tone=.96+.28*grain+.07*(pores-.5)+.07*(noise(u,v,2,7,23)-.5);
          rgb=seam?[30,29,26]:[169*tone,127*tone,79*tone];
          heights[i]=seam?-.0007:.00016*grain+.000015*(pores-.5);
          rough[i]=seam?.88:clamp(.55+.18*grain+.08*(pores-.5),.38,.73);
        }else if(layer===1){
          const warp=Math.sin(u*TAU*64),weft=Math.sin(v*TAU*64);
          const weave=warp*weft;
          const tone=.985+.012*weave+.003*Math.sin(u*TAU*3+v*TAU*5);
          rgb=[228*tone,225*tone,215*tone];
          heights[i]=.000022*weave;rough[i]=.82+.04*weave;
        }else if(layer===2){
          const brush=Math.sin(v*TAU*205)+.35*Math.sin(v*TAU*113+u*TAU*2);
          const mottling=Math.sin(u*TAU*9+Math.sin(v*TAU*4))*Math.sin(v*TAU*7);
          const tone=.93+.025*brush+.025*mottling;
          rgb=[218*tone,222*tone,224*tone];
          heights[i]=.000012*brush;rough[i]=clamp(.32+.055*brush+.06*mottling,.20,.55);
        }else if(layer===4){
          const a=Math.sin(TAU*(u*9+v*12)),b=Math.sin(TAU*(u*9-v*12));
          const braid=.6*(.5+.5*a)**6+.4*(.5+.5*b)**6,fibre=noise(u,v,59,181,12);
          const tone=.90+.15*braid+.035*(fibre-.5),trace=Math.min((u+v*2)%1,1-(u+v*2)%1)<.019;
          rgb=trace?[75*tone,99*tone,110*tone]:[181*tone,169*tone,142*tone];
          heights[i]=.00040*braid+.000012*(fibre-.5);rough[i]=.79+.10*(1-braid);
        }else if(layer===5){
          const peel=noise(u,v,113,113,5),soft=noise(u,v,13,13,29),tone=.995+.008*(soft-.5);
          rgb=[250*tone,248*tone,242*tone];heights[i]=.000035*(peel-.5);rough[i]=.29+.04*(soft-.5);
        }else{
          const pore=noise(u,v,97,97,7),mottle=noise(u,v,12,12,48),tone=.95+.035*(mottle-.5)+.025*(pore-.5);
          rgb=[174*tone,178*tone,172*tone];heights[i]=.00013*(pore-.5);rough[i]=.78+.12*(pore-.5);
        }
        for(let k=0;k<3;k++)color[j+k]=clamp(Math.round(rgb[k]),0,255);color[j+3]=255;
      }
      const metres=layer===0||layer===3?[2,.16]:layer===1?[.08,.08]:layer===4?[.12,.10]:layer===5?[.25,.25]:[.5,.5];
      for(let y=0;y<N;y++)for(let x=0;x<N;x++){
        const i=y*N+x,j=(layer*N*N+i)*4;
        const hx=(heights[y*N+(x+1)%N]-heights[y*N+(x+N-1)%N])*N/(2*metres[0]);
        const hy=(heights[((y+1)%N)*N+x]-heights[((y+N-1)%N)*N+x])*N/(2*metres[1]);
        const length=Math.hypot(hx,hy,1);
        detail[j]=Math.round((-hx/length*.5+.5)*255);detail[j+1]=Math.round((-hy/length*.5+.5)*255);
        detail[j+2]=Math.round(rough[i]*255);detail[j+3]=255;
      }
    }
    const options={fmt:'rgba8',filter:'linear',wrap:'repeat',mips:true,aniso:4};
    this.color=texArray(N,N,7,options);this.detail=texArray(N,N,7,options);
    for(const [texture,data] of [[this.color,color],[this.detail,detail]]){
      gl.bindTexture(gl.TEXTURE_2D_ARRAY,texture.tex);gl.texSubImage3D(gl.TEXTURE_2D_ARRAY,0,0,0,0,N,N,7,gl.RGBA,gl.UNSIGNED_BYTE,data);generateMips(texture);
    }
    this.canvas=document.createElement('canvas');this.canvas.width=512;this.canvas.height=384;
    this.instrument=tex2D(512,384,{fmt:'rgba8',filter:'linear',mips:true});this.lastInstrument=-1;
    this.compassCanvas=document.createElement('canvas');this.compassCanvas.width=this.compassCanvas.height=512;
    this.compass=tex2D(512,512,{fmt:'rgba8',filter:'linear',mips:true});
    this.updateInstrument(0,2.5,0);
  }

  updateInstrument(heading,speed,time){
    const tick=Math.floor(time*2);if(tick===this.lastInstrument)return;this.lastInstrument=tick;
    const c=this.canvas.getContext('2d'),w=512,h=384;
    c.fillStyle='#091923';c.fillRect(0,0,w,h);
    c.fillStyle='#173543';c.fillRect(12,12,334,354);
    c.strokeStyle='#386779';c.lineWidth=1;
    for(let i=0;i<12;i++){c.beginPath();c.moveTo(12+i*30,12);c.lineTo(12+i*30,366);c.stroke();c.beginPath();c.moveTo(12,12+i*30);c.lineTo(346,12+i*30);c.stroke();}
    c.strokeStyle='#9ac6cc';c.lineWidth=2;
    for(let k=0;k<5;k++){c.beginPath();for(let i=0;i<24;i++){const x=20+i*14,y=75+k*51+Math.sin(i*.48+k)*13;c[i?'lineTo':'moveTo'](x,y);}c.stroke();}
    c.strokeStyle='#f1d18c';c.setLineDash([8,6]);c.beginPath();c.moveTo(55,328);c.lineTo(178,208);c.lineTo(307,74);c.stroke();c.setLineDash([]);
    c.save();c.translate(178,208);c.rotate(heading);c.fillStyle='#faf5d7';c.beginPath();c.moveTo(0,-16);c.lineTo(9,12);c.lineTo(0,7);c.lineTo(-9,12);c.closePath();c.fill();c.restore();
    c.fillStyle='#a4c6cb';c.font='16px monospace';c.fillText('OPEN SEA / POSITION',25,36);c.fillText('OFFSHORE  /  1 NM',25,350);
    const degrees=((heading*180/Math.PI)%360+360)%360;
    c.fillStyle='#f5efd4';c.font='bold 36px monospace';c.fillText((speed*1.944).toFixed(1),365,68);
    c.fillStyle='#a4c6cb';c.font='14px monospace';c.fillText('KNOTS',365,90);
    c.fillStyle='#f5efd4';c.font='bold 30px monospace';c.fillText(String(Math.round(degrees)).padStart(3,'0')+'°',355,156);
    c.fillStyle='#a4c6cb';c.font='14px monospace';c.fillText('HEADING',358,178);
    for(let i=0;i<3;i++){c.strokeStyle='#5e8996';c.beginPath();c.arc(426,230+i*47,18,Math.PI,0);c.stroke();c.strokeStyle='#eedbb1';c.beginPath();c.moveTo(426,230+i*47);c.lineTo(426+15*Math.cos(-1.1-i*.35),230+i*47+15*Math.sin(-1.1-i*.35));c.stroke();}
    gl.bindTexture(gl.TEXTURE_2D,this.instrument.tex);gl.texSubImage2D(gl.TEXTURE_2D,0,0,0,gl.RGBA,gl.UNSIGNED_BYTE,this.canvas);generateMips(this.instrument);
    this.drawCompass(heading);
  }

  drawCompass(heading){
    const c=this.compassCanvas.getContext('2d');c.fillStyle='#e6dfcd';c.fillRect(0,0,512,512);
    c.save();c.translate(256,256);c.rotate(-heading);c.strokeStyle='#25303a';c.fillStyle='#25303a';
    for(let d=0;d<360;d+=5){const a=d*Math.PI/180,major=d%30===0,r=major?190:d%10===0?203:213;c.lineWidth=major?4:2;c.beginPath();c.moveTo(Math.sin(a)*r,-Math.cos(a)*r);c.lineTo(Math.sin(a)*229,-Math.cos(a)*229);c.stroke();}
    c.font='bold 40px serif';c.textAlign='center';c.textBaseline='middle';for(const[n,a]of[['N',0],['E',Math.PI/2],['S',Math.PI],['W',-Math.PI/2]])c.fillText(n,Math.sin(a)*164,-Math.cos(a)*164);
    for(let i=0;i<8;i++){c.save();c.rotate(i*Math.PI/4);c.fillStyle=i===0?'#a4342c':i%2?'#797d77':'#25303a';c.beginPath();c.moveTo(0,-130);c.lineTo(17,0);c.lineTo(0,19);c.lineTo(-17,0);c.closePath();c.fill();c.restore();}
    c.restore();c.strokeStyle='#a4342c';c.lineWidth=7;c.beginPath();c.moveTo(256,16);c.lineTo(256,57);c.stroke();
    c.fillStyle='#25303a';c.beginPath();c.arc(256,256,14,0,TAU);c.fill();
    gl.bindTexture(gl.TEXTURE_2D,this.compass.tex);gl.texSubImage2D(gl.TEXTURE_2D,0,0,0,gl.RGBA,gl.UNSIGNED_BYTE,this.compassCanvas);generateMips(this.compass);
  }
}
