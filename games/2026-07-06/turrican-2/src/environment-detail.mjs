import * as THREE from 'three';
import {part,mat,dark,silver} from './models.mjs';
import {tube,pack} from './artisan.mjs';
import {fracturedRock} from './geology.mjs';
const rand=n=>{const x=Math.sin(n*127.17)*43758.5453;return x-Math.floor(x);};

// Local batches retain culling; all decoration stays behind the playable silhouette.
export function surfaceDetail(parent,level,surface){
  const natural=![3,4].includes(level.world),T=20;
  const stone=surface.clone();stone.vertexColors=true;
  const seam=mat('#202c2b',.04,.97),lichen=mat(level.world===5?'#787350':'#637561',.03,.98);
  for(let start=0;start<level.cols;start+=12){
    const g=new THREE.Group();parent.add(g);
    for(let x=start;x<Math.min(start+12,level.cols);x++)for(let y=0;y<level.rows;y++){
      if(level.tiles[y*level.cols+x]!==1)continue;
      const n=rand(x*91+y*17),px=x*T,py=-y*T;
      if(natural){
        // Interlocking fracture scales: deep chips, thin shale and mineral inclusions.
        for(let k=0;k<3;k++){
          const r=rand(x*391+y*73+k*11),m=new THREE.Mesh(fracturedRock(4+r*7,1.3+r*3,1.4+r*2,x+y*51+k),stone);
          m.position.set(px+3+r*14,py-3-k*6,2+r);m.rotation.z=(n-.5)*.7;m.receiveShadow=true;g.add(m);
        }
        if(n<.45)g.add(tube([[px+2,py-1,3.2],[px+5+n*10,py-7,3.4],[px+4,py-12,3.1],[px+8,py-19,3.3]],.16,seam));
        if(n>.65)for(let k=0;k<4;k++)part(g,'sphere',[.5+k*.19,.35,.12],lichen,[px+4+k*2,py-4-rand(k+x)*8,5]);
      }else if(n<.4){
        part(g,'box',[16,16,.7],dark,[px+10,py-10,2]);
        for(let k=0;k<5;k++)part(g,'box',[12,.65,.6],silver,[px+10,py-5-k*2.3,2.8]);
        for(let side of [-1,1])part(g,'sphere',[.45,.45,.25],silver,[px+10+side*6,py-3,3]);
      }
    }
    pack(g);
  }
}

const leafShape=new THREE.Shape();leafShape.moveTo(-.5,0);leafShape.quadraticCurveTo(0,.35,.5,0);leafShape.quadraticCurveTo(0,-.25,-.5,0);
const leafGeometry=new THREE.ShapeGeometry(leafShape,3);
export function fern(g,x,y,scale,world){
  const leaf=mat(world===5?'#78764c':'#496e60',.03,.94),stem=mat('#506359',.04,.95);
  for(let a=0;a<5;a++){
    const lean=(a-2)*.42,h=(16-Math.abs(a-2)*2)*scale;
    g.add(tube([[x,y,0],[x+lean*h*.35,y+h*.65,0],[x+lean*h,y+h,0]],.24*scale,stem));
    for(let k=1;k<7;k++)for(let side of [-1,1]){
      const t=k/7,w=(1-t)*5*scale;
      const blade=new THREE.Mesh(leafGeometry,leaf);blade.scale.set(w*1.8,scale*2,1);blade.position.set(x+lean*h*t*t+side*w*.5,y+h*t,1);blade.rotation.z=side*.45;g.add(blade);
    }
  }
}

export function expeditionSite(g,seed,world){
  const paint=mat(world===5?'#716653':'#647777',.5,.65),rubber=mat('#263637',.1,.9);
  const x=85+seed*17;
  // Weathered survey machinery: broken gantry, pressure vessels and bundled wiring.
  for(let side of [-1,1]){
    part(g,'box',[7,100,11],paint,[x+side*32,50,-10],[0,0,side*.08]);
    for(let k=0;k<7;k++){
      part(g,'plate',[12,5,13],dark,[x+side*32,9+k*13,-10]);
      part(g,'sphere',[1,1,.6],silver,[x+side*32,9+k*13,-2]);
    }
  }
  part(g,'box',[83,9,14],paint,[x,98,-10],[0,0,-.08]);
  for(let k=0;k<3;k++){
    part(g,'cylinder',[7,7,34],paint,[x-16+k*17,21,0]);
    for(let y of [8,32])part(g,'torus',[7.3,.7],silver,[x-16+k*17,y,0],[Math.PI/2,0,0]);
    g.add(tube([[x-16+k*17,39,0],[x-19+k*17,62,0],[x+23,72,0],[x+31,47,0]],.65,rubber));
  }
  part(g,'plate',[23,21,6],paint,[x+32,45,3]);
  for(let k=0;k<6;k++)part(g,'box',[13,.8,1],dark,[x+32,40+k*1.7,7]);
  part(g,'box',[5,2,.5],mat('#acc5aa',.2,.5,.3),[x+32,51,7]);
  for(let k=0;k<9;k++)part(g,'box',[2,1,.4],silver,[x-28+k*7,97-k*.55,-2]);
}
