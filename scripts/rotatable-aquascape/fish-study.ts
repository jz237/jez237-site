import * as T from 'three';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {Tetra3D} from './lib/Tetra3D';
// Authoring-only view of the same trimmed atlas and model used by the aquarium.
const image=new Image();image.src='./living-species.png';await image.decode();
const canvas=document.createElement('canvas');canvas.width=image.width/2;canvas.height=image.height/2;
const context=canvas.getContext('2d')!;context.drawImage(image,0,0,canvas.width,canvas.height,0,0,canvas.width,canvas.height);
const pixels=context.getImageData(0,0,canvas.width,canvas.height).data;
let left=canvas.width,top=canvas.height,right=0,bottom=0;
for(let y=0;y<canvas.height;y++)for(let x=0;x<canvas.width;x++)if(pixels[(y*canvas.width+x)*4+3]>32){left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);}
const trimmed=document.createElement('canvas');trimmed.width=right-left+1;trimmed.height=bottom-top+1;trimmed.getContext('2d')!.drawImage(canvas,left,top,trimmed.width,trimmed.height,0,0,trimmed.width,trimmed.height);
const texture=new T.CanvasTexture(trimmed);texture.colorSpace=T.SRGBColorSpace;texture.anisotropy=8;
const renderer=new T.WebGLRenderer({antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.65));renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.12;document.body.append(renderer.domElement);
const scene=new T.Scene();scene.background=new T.Color(0x080f12);
const pmrem=new T.PMREMGenerator(renderer),environment=new RoomEnvironment();scene.environment=pmrem.fromScene(environment,.035).texture;scene.environmentIntensity=.1;environment.dispose();pmrem.dispose();
scene.add(new T.HemisphereLight(0xc2e2e6,0x5b6a49,.9));const key=new T.DirectionalLight(0xe8f8ed,2.5);key.position.set(-1,5,3);scene.add(key);
const camera=new T.PerspectiveCamera(37,1,.1,100);camera.position.set(0,0,12);
const fish=[0,1,2].map(i=>{const model=new Tetra3D(texture,i*.83,false);model.group.scale.setScalar(4.2);model.group.position.set(0,1.7-i*1.8,0);scene.add(model.group);return model;});
const resize=()=>{renderer.setSize(innerWidth,innerHeight);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();};resize();addEventListener('resize',resize);
let last=0,time=0,paused=false;document.querySelector<HTMLButtonElement>('#pause')!.onclick=()=>{paused=!paused;document.querySelector('#pause')!.textContent=paused?'Resume motion':'Pause motion';};
renderer.setAnimationLoop(now=>{const dt=last?Math.min((now-last)/1000,.05):0;last=now;if(!paused)time+=dt;fish.forEach((model,i)=>{model.group.rotation.y=i===0?0:i===1?time*.32:Math.PI-.22;model.update(time,.30,texture,0,.5,1,paused?0:dt,.35);});renderer.render(scene,camera);});
